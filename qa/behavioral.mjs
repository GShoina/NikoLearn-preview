// NB-14: behavioral QA gate. Runs every young-lane Playwright harness in sequence and exits
// NON-ZERO if any fails. Before this, the 3 harnesses were "orphan" — never run by any gate/CI,
// which is the root cause of previously-fixed bugs silently coming back. Wire to LOCAL pre-push
// (they use local chromium/playwright paths, so they can't run in GitHub CI). Run: npm run qa:behavioral
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PW_CHROMIUM } from './_harness.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const HARNESSES = ['_alpha-young.mjs', '_math-young.mjs', '_shapes-young.mjs', '_retention.mjs', '_worlds.mjs'];

// Fresh-machine guard (mirrors qa:visual): if the local chromium is absent, SKIP with exit 2 so a
// deploy is never blocked by a missing dev dependency. Only a real assert-fail (exit 1) blocks.
if (!fs.existsSync(PW_CHROMIUM)) {
  console.log(`⏭  BEHAVIORAL GATE SKIPPED — local chromium not found (${PW_CHROMIUM})`);
  process.exit(2);
}

const failed = [];
for (const h of HARNESSES) {
  console.log(`\n══════════ RUN ${h} ══════════`);
  const r = spawnSync(process.execPath, [path.join(DIR, h)], { stdio: 'inherit' });
  if (r.status === 0) console.log(`\n✅ ${h} passed`);
  else { failed.push(h); console.log(`\n❌ ${h} exited ${r.status}`); }
}

console.log('\n═══════════════════════════════');
if (failed.length) {
  console.log(`❌ BEHAVIORAL GATE FAILED: ${failed.join(', ')}`);
  process.exit(1);
}
console.log(`✅ BEHAVIORAL GATE PASSED — all ${HARNESSES.length} harnesses green`);
process.exit(0);
