#!/usr/bin/env node
// NikoLearn — LIVE-PUSH PROCEDURE (owner-directed 2026-07-14, AUTONOMOUS_DECISION_POLICY.md §e).
// ONE repeatable command that ships a verified, reversible fix to nikolearn.com so no step is ever
// skipped by hand. The owner's "go" is replaced by THIS procedure: gates -> bump -> merge -> deploy
// -> live-verify. It REFUSES to push if any gate fails, so running it can never ship a broken site.
//
// Usage:  node tools/live-push.mjs [--dry] [domainGate1.mjs domainGate2.mjs ...]
//   --dry            run gates + bump locally, DO NOT merge/push (preview the release).
//   domainGate*.mjs  extra behavioral gates for the changed area (e.g. qa/_wordsearch.mjs).
//                    Always run in ADDITION to the mandatory npm test + visual gate.
//
// Escalation (do NOT run this script; take it to the owner): financial change, or the narrow
// reputational set (net-new public promise / pricing / brand / launch / high-visibility identity).
// This tool is ONLY for verified, reversible bug/UX/a11y/perf/content fixes.
import { execSync } from 'child_process';

const MAIN = 'main';
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const domainGates = args.filter(a => a.endsWith('.mjs'));

const sh   = (c, o = {}) => execSync(c, { stdio: 'inherit', ...o });
const cap  = (c) => execSync(c, { encoding: 'utf8' }).trim();
const die  = (m) => { console.error(`\n✖ LIVE-PUSH ABORTED: ${m}\n`); process.exit(1); };
const step = (m) => console.log(`\n\x1b[36m▶ ${m}\x1b[0m`);

// ── 0. Preflight: safe git state ────────────────────────────────────────────
step('0. Preflight');
const branch = cap('git rev-parse --abbrev-ref HEAD');
if (branch === MAIN) die(`on ${MAIN}. Ship from the feature branch so the merge is reviewable.`);
if (cap('git status --porcelain --untracked-files=no')) die('tracked changes uncommitted. Commit the fix first.');
const ahead  = +cap(`git rev-list --count ${MAIN}..HEAD`);
const behind = +cap(`git rev-list --count HEAD..${MAIN}`);
if (ahead === 0)  die(`branch has no commits ahead of ${MAIN}; nothing to ship.`);
if (behind !== 0) die(`branch is ${behind} commit(s) behind ${MAIN}; rebase so the merge is a clean fast-forward.`);
console.log(`  branch=${branch}  ahead=${ahead}  behind=${behind}  (clean fast-forward)`);

// ── 1. MANDATORY gates: release + visual + every named domain gate ──────────
step('1. Verification gates (release + visual + domain)');
const gates = ['npm test', 'node qa/visual-gate.mjs', ...domainGates.map(g => `node ${g}`)];
for (const g of gates) {
  console.log(`\n  · ${g}`);
  try { sh(g); } catch { die(`gate FAILED: ${g}. Fix it before shipping (NEEDS MORE EVIDENCE, not a ship).`); }
}
console.log('\n  ✓ all gates green');

// ── 2. Version bump (returning users' caches refresh) ───────────────────────
step('2. Version bump');
const readV = () => cap("node -e \"process.stdout.write(require('fs').readFileSync('niko/screens.js','utf8').match(/APP_VERSION='([\\d.]+)'/)[1])\"");
const before = readV();
if (DRY) {
  const [maj, min] = before.split('.');
  step(`DRY RUN complete — gates green; next ship would be v${maj}.${+min + 1} (no files touched).`);
  console.log('  Re-run without --dry to bump + ship.');
  process.exit(0);
}
sh('node bump.mjs');
const after = readV();
if (after === before) die('bump did not advance the version.');
console.log(`  ${before} -> ${after}`);
sh(`git add niko/screens.js landing.html sw.js`);
sh(`git commit -q -m "v${after} release bump (live-push procedure)"`);

// ── 3. Merge to main + push (push triggers deploy-pages.yml + pre-push gate) ─
step(`3. Merge ${branch} -> ${MAIN} and push (triggers production deploy)`);
sh(`git checkout ${MAIN}`);
try { sh(`git merge --ff-only ${branch}`); }
catch { sh(`git checkout ${branch}`); die(`fast-forward merge failed. Resolve manually.`); }
try { sh(`git push origin ${MAIN}`); }
catch { die(`push failed (auth/network). The merge is local; deploy has NOT run. Resolve and re-push ${MAIN}.`); }
sh(`git checkout ${branch}`);
console.log(`  pushed ${MAIN}; GitHub Pages deploy started.`);

// ── 4. Live-verify the cache-busted production URL ──────────────────────────
step('4. Live-verify nikolearn.com (poll for the new version)');
const bust = () => Date.now();
async function grab(path) {
  const r = await fetch(`https://nikolearn.com/${path}?v=${bust()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}
let live = false;
for (let i = 1; i <= 12; i++) {
  await new Promise(r => setTimeout(r, 15000));
  try {
    const screens = await grab('niko/screens.js');
    const swtxt   = await grab('sw.js');
    const vLive = (screens.match(/APP_VERSION='([\d.]+)'/) || [])[1];
    const cLive = (swtxt.match(/nikolearn-([\w.]+)/) || [])[1];
    console.log(`  try ${i}/12: live APP_VERSION=${vLive}  sw-cache=nikolearn-${cLive}`);
    if (vLive === after && cLive === after) { live = true; break; }
  } catch (e) { console.log(`  try ${i}/12: ${e.message} (deploy still propagating)`); }
}
if (!live) die(`v${after} not live after ~3 min. Check the Actions run; if it regressed, "git revert" on ${MAIN}.`);

step(`✓ LIVE: nikolearn.com is now v${after}`);
console.log('  Do the §6c human look at the live UI + update the tracker/handoff. Rollback = git revert on main.');
