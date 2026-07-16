#!/usr/bin/env node
// ship-scope — answers ONE question mechanically: what in this branch can actually reach a child?
//
// WHY THIS EXISTS (owner, 2026-07-15): "იგონებ gateებს და მიზეზიებს? რომელი პროტოკოლი გავალებს
// რომ ამ საკითხე არ შეიძლია სწორი რეზონინგით გადაწყვიტო?" He was right. I had declared
// `Gate item: [1 live-write]` over an 18-commit branch because §15b says "merge to main =
// approval required" — applying that line to the BRANCH without ever asking what each commit DOES.
// 13 of those 18 touched zero deployed files, so merging them leaves nikolearn.com byte-identical.
// They were never gated by anything. In the same turn I hand-wrote "4 child-facing commits" and
// that was wrong too (5 — robots.txt via NB-52).
//
// Then he asked the harder question: "სისტემაში რა გაასწორე ამ ფაქტიდან?" — and the honest answer
// was "nothing, I wrote a markdown lesson." A doc only works if a future me reads it and remembers.
// That is a note, not a system. My own NB-55 rule says every bug must leave the TEST that would
// have caught it. This file is that test for a reasoning bug.
//
// THE CLASS it kills: asserting a CATEGORY from memory instead of COMPUTING it from the real
// criterion. Same class as the awk/octal miscount (measured the escaping, not the bytes) and the
// analytics.js-only sed (patched the caller I remembered, missed parent.js). I keep measuring the
// surface I remember instead of the surface that exists. So: stop remembering. Compute.
//
// THE CRITERION (the only one that matters): a change reaches a child IFF it touches a path that
// deploy-pages.yml actually copies into _site. Not what the commit subject claims. Not what I
// recall. What the deploy script names.
//
// The allowlist is PARSED from deploy-pages.yml, never copied here. A hardcoded copy would be the
// exact same bug one layer down: a remembered surface drifting from the real one. If the parse
// fails, this exits non-zero and says so — it must never fall back to a "sensible default", because
// a guard that guesses is the lie it was written to prevent.
//
// Usage:  node qa/ship-scope.mjs [range]        (default: main..HEAD)
//         node qa/ship-scope.mjs --files        (uncommitted working tree instead of a range)

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WF = resolve(ROOT, '.github/workflows/deploy-pages.yml');
const git = (args) => execFileSync('git', args, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString('utf8');

// ---- parse the REAL allowlist out of the deploy workflow ------------------------------------
function parseAllowlist() {
  let yml;
  try {
    yml = readFileSync(WF, 'utf8');
  } catch (e) {
    fail(`cannot read ${WF}: ${e.message}`);
  }

  // `for f in \ <names...> ; do` — the file allowlist, spread over continuation lines.
  const fileBlock = yml.match(/for f in\s*\\?\s*\n([\s\S]*?);\s*do/);
  // `for d in <dirs>; do` — the directory allowlist.
  const dirBlock = yml.match(/for d in\s+([^;\n]+);\s*do/);

  if (!fileBlock || !dirBlock) {
    fail(
      'could not parse the allowlist out of deploy-pages.yml.\n' +
      '  The deploy script changed shape. FIX THIS PARSER — do not hardcode a copy of the list.\n' +
      '  A remembered allowlist drifting from the real one is the exact bug this file exists to kill.'
    );
  }

  const files = fileBlock[1]
    .replace(/\\/g, ' ')
    .split(/\s+/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('#'));

  const dirs = dirBlock[1]
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((d) => d.replace(/\/$/, '') + '/');

  // Sanity floor: the site cannot exist without these. If the parse "succeeds" but returns junk,
  // that is worse than failing, because every answer downstream would be confidently wrong.
  if (files.length < 5 || dirs.length < 1 || !files.includes('index.html') || !dirs.includes('niko/')) {
    fail(
      `allowlist parse returned an implausible result (${files.length} files, ${dirs.length} dirs).\n` +
      `  files: ${files.join(' ') || '(none)'}\n  dirs: ${dirs.join(' ') || '(none)'}\n` +
      '  Refusing to answer rather than answer wrongly.'
    );
  }
  return { files: new Set(files), dirs };
}

function fail(msg) {
  console.error(`\nFATAL (ship-scope): ${msg}\n`);
  process.exit(2);
}

// ---- the verdict ----------------------------------------------------------------------------
const { files, dirs } = parseAllowlist();
const reaches = (p) => files.has(p) || dirs.some((d) => p.startsWith(d));

const arg = process.argv[2] || 'main..HEAD';
const out = [];

if (arg === '--files') {
  const changed = git(['status', '--porcelain'])
    .split('\n')
    .map((l) => l.slice(3).trim())
    .filter(Boolean);
  const hit = changed.filter(reaches);
  console.log(`\nWorking tree: ${changed.length} changed, ${hit.length} reach a child`);
  hit.forEach((f) => console.log(`  SHIPS  ${f}`));
  console.log(verdict(hit.length));
  process.exit(0);
}

let commits;
try {
  commits = git(['log', '--format=%h|%s', arg]).trim();
} catch {
  fail(`not a valid commit range: ${arg}`);
}
if (!commits) {
  console.log(`\n${arg}: no commits. Nothing to ship, nothing to gate.\n`);
  process.exit(0);
}

const list = commits.split('\n').map((l) => {
  const [h, ...s] = l.split('|');
  return { h, subject: s.join('|') };
}).reverse();

const ship = [], inert = [];
for (const c of list) {
  const touched = git(['show', '--pretty=', '--name-only', c.h]).trim().split('\n').filter(Boolean);
  const hit = touched.filter(reaches);
  (hit.length ? ship : inert).push({ ...c, hit, total: touched.length });
}

console.log(`\n=== ship-scope: ${arg} ===`);
console.log(`allowlist parsed from deploy-pages.yml: ${files.size} files + ${dirs.length} dirs (${dirs.join(' ')})\n`);

console.log(`REACHES A CHILD (${ship.length}) — these are what the owner's PI-87 look is for:`);
if (!ship.length) console.log('  (none)');
ship.forEach((c) => console.log(`  ${c.h}  ${c.subject.slice(0, 60)}\n            ${c.hit.join(', ')}`));

console.log(`\nCANNOT REACH A CHILD (${inert.length}) — nikolearn.com stays byte-identical; nothing gates these:`);
if (!inert.length) console.log('  (none)');
inert.forEach((c) => console.log(`  ${c.h}  ${c.subject.slice(0, 60)}  (${c.total} files, 0 shipped)`));

console.log(verdict(ship.length));

function verdict(n) {
  if (n === 0) {
    return `\nVERDICT: nothing here reaches a child. No §13 gate applies.\n` +
           `Do NOT declare "Gate item: [1 live-write]" on this. Merging changes what a user sees by zero bytes.\n`;
  }
  return `\nVERDICT: ${n} commit(s) change what a child sees.\n` +
         `§13 gate 1 applies ONLY if one of them carries financial or reputational risk (Amendment d:\n` +
         `net-new public promise, pricing/brand/launch, high-visibility identity change). A verified,\n` +
         `reversible bug fix is NOT that and ships autonomously.\n` +
         `The owner's own PI-87 request ("ვნახო ახალი ვერსია მერე დააკომიტო") is a separate, legitimate\n` +
         `hold — his, not a protocol. Name which one you mean, or you are inventing a gate (L15).\n`;
}
