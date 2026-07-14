#!/usr/bin/env node
/* tools/qa-triage.mjs — NB-46 closed-loop TRIAGE brain.
   Reads the two QA checkers' output (source-level qa/last-report.txt + live qa/live-report.json),
   turns findings into tracked NB rows AUTOMATICALLY, and drafts the PR/issue digest. This is the
   "capture" half of the verify->triage->fix loop the owner asked for ("გადაამოწმე და გაასწორე ჩემი
   ჩართვის გარეშე"): nothing a check finds can be lost, and a persistent finding is logged ONCE (it
   is fingerprinted + deduped against the tracker) so the weekly run never spams the same row again.

   Usage: node tools/qa-triage.mjs [--dry] [--source qa/last-report.txt] [--live qa/live-report.json] [--date YYYY-MM-DD]
     --dry   parse + report, do NOT mutate the tracker (for self-test).
   Outputs: appends rows to docs/BUGFIX_TRACKER.md (unless --dry); writes qa/triage-digest.md
            (human PR/issue body) + qa/triage-out.json (machine summary for the workflow).
   Exit 0 always — the workflow reads triage-out.json.prNeeded to decide whether to open a PR.
*/
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join, isAbsolute } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const abs = (p) => isAbsolute(p) ? p : join(ROOT, p); // accept absolute --source/--live/--tracker (CI + self-test)
const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const DRY = process.argv.includes('--dry');
const SRC = arg('--source', 'qa/last-report.txt');
const LIVE = arg('--live', 'qa/live-report.json');
const DATE = arg('--date', new Date().toISOString().slice(0, 10));
const TRACKER = arg('--tracker', 'docs/BUGFIX_TRACKER.md');

// stable fingerprint: sev+dim+msg with numbers neutralised, so a recurring finding whose only
// change is a version/count number hashes the SAME and is not re-logged every week.
const fp = (f) => createHash('sha1').update(`${f.sev}|${f.dim}|${f.msg.toLowerCase().replace(/[\d.]+/g, '#').replace(/\s+/g, ' ').trim()}`).digest('hex').slice(0, 10);

// ── gather findings from both checkers ──────────────────────────────────────
const findings = [];
// source checker: text lines "[P1] dim: msg"
if (existsSync(abs(SRC))) {
  for (const line of readFileSync(abs(SRC), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\[(P1|P2|P3)\]\s+([^:]+):\s+(.+)$/);
    if (m) findings.push({ sev: m[1], dim: m[2].trim(), msg: m[3].trim(), source: 'source' });
  }
}
// live checker: JSON
let liveVersion = null, origin = 'https://nikolearn.com';
if (existsSync(abs(LIVE))) {
  try {
    const j = JSON.parse(readFileSync(abs(LIVE), 'utf8'));
    liveVersion = j.liveVersion; origin = j.origin || origin;
    for (const f of (j.findings || [])) findings.push({ sev: f.sev, dim: f.dim, msg: f.msg, source: 'live' });
  } catch {}
}

// ── dedupe vs the tracker (already-logged fingerprints) ─────────────────────
const trackerTxt = readFileSync(abs(TRACKER), 'utf8');
const known = new Set([...trackerTxt.matchAll(/qa-fp:([0-9a-f]{10})/g)].map(m => m[1]));
const seenThisRun = new Set();
const fresh = [], already = [];
for (const f of findings) {
  f.fp = fp(f);
  if (seenThisRun.has(f.fp)) continue;      // same finding surfaced by both checkers → collapse silently
  seenThisRun.add(f.fp);
  if (known.has(f.fp)) already.push(f);      // already a tracked NB row → do NOT re-log (kills weekly spam)
  else fresh.push(f);
}

// ── next NB id (ignore the legend's own "next id = NB-N" so it isn't counted as a row) ──
const scanTxt = trackerTxt.replace(/next id = NB-\d+/g, '');
let nextId = Math.max(0, ...[...scanTxt.matchAll(/NB-(\d+)/g)].map(m => +m[1])) + 1;
const autoFixable = (f) => f.source === 'source' && f.dim === 'version'; // qa:fix syncs version drift deterministically
const rows = fresh.map((f) => {
  const id = `NB-${nextId++}`;
  f.nb = id;
  const fixNote = autoFixable(f) ? 'AUTO-FIXABLE (npm run qa:fix syncs version)' : 'needs agent/dev triage + §14 class verdict';
  const status = `OPEN — auto-detected by qa-auto.yml (${f.source} check ${DATE}); ${fixNote} <!--qa-fp:${f.fp}-->`;
  const symptom = `[AUTO-QA ${f.sev}] ${f.dim}: ${f.msg}`.replace(/\|/g, '\\|');
  return `| ${id} | ${symptom} | qa-auto ${DATE} | ${status} | (auto) class verdict pending — §14 |`;
});

// ── insert rows after the ledger separator + bump the legend "next id" ───────
let newTracker = trackerTxt;
if (rows.length && !DRY) {
  const anchor = '|---|---|---|---|---|';
  const at = newTracker.indexOf(anchor);
  if (at < 0) { console.error('TRIAGE: could not find ledger table anchor; aborting write.'); process.exit(0); }
  const insertPos = at + anchor.length;
  newTracker = newTracker.slice(0, insertPos) + '\n' + rows.join('\n') + newTracker.slice(insertPos);
  newTracker = newTracker.replace(/next id = NB-\d+/, `next id = NB-${nextId}`);
  writeFileSync(abs(TRACKER), newTracker);
}

// ── digest (PR / issue body) ─────────────────────────────────────────────────
const P1 = findings.filter(f => f.sev === 'P1').length, P2 = findings.filter(f => f.sev === 'P2').length;
const digest = [];
digest.push(`# 🦉 NikoLearn QA auto-run — ${DATE}`);
digest.push('');
digest.push(`Target: **${origin}** (live) + repo source checks. Live version: **${liveVersion || '?'}**.`);
digest.push(`Findings: **${findings.length}** (P1=${P1} P2=${P2}) · newly logged: **${fresh.length}** · already-open: ${already.length}.`);
digest.push('');
if (!findings.length) {
  digest.push('✅ **All checks passed — live site healthy, source clean.** No action needed.');
} else {
  if (fresh.length) {
    digest.push('## 🆕 Newly logged (added to BUGFIX_TRACKER.md)');
    digest.push('| NB | Sev | Dim | Finding | Auto-fixable |');
    digest.push('|---|---|---|---|---|');
    for (const f of fresh) digest.push(`| ${f.nb} | ${f.sev} | ${f.dim} | ${f.msg.replace(/\|/g, '\\|')} | ${autoFixable(f) ? '✅ version sync' : 'needs agent'} |`);
    digest.push('');
  }
  if (already.length) {
    digest.push('## ♻️ Already open (not re-logged)');
    for (const f of already) digest.push(`- [${f.sev}] ${f.dim}: ${f.msg.replace(/\|/g, '\\|')}`);
    digest.push('');
  }
  const fixable = fresh.filter(autoFixable).length;
  digest.push('## Next');
  digest.push(fixable ? `- ${fixable} finding(s) auto-fixable by \`npm run qa:fix\` — this PR includes the fix.` : '- No deterministic auto-fix; findings captured for the agent/dev fix loop.');
  digest.push('- Merge to `main` triggers a re-deploy + the next live-check confirms the fix (§13: live merge stays a human/agent gate on the kids app).');
}
writeFileSync(join(ROOT, 'qa', 'triage-digest.md'), digest.join('\n') + '\n');

// ── machine summary for the workflow ─────────────────────────────────────────
const out = {
  date: DATE, origin, liveVersion,
  totalFindings: findings.length, newRows: fresh.length, alreadyOpen: already.length,
  nbIds: fresh.map(f => f.nb), autoFixable: fresh.some(autoFixable),
  prNeeded: fresh.length > 0, // a PR is opened only when there is something NEW to capture
};
writeFileSync(join(ROOT, 'qa', 'triage-out.json'), JSON.stringify(out, null, 2));
console.log(`TRIAGE ${DATE}: total=${findings.length} new=${fresh.length} alreadyOpen=${already.length} prNeeded=${out.prNeeded} autoFixable=${out.autoFixable}${DRY ? ' (DRY — tracker untouched)' : ''}`);
if (fresh.length) console.log('  new NB rows: ' + fresh.map(f => `${f.nb}[${f.sev} ${f.dim}]`).join(', '));
