#!/usr/bin/env node
/* NikoLearn QA Tester — static functional checks that catch the bug classes the owner cares about,
   WITHOUT a human. Runs anywhere with Node (locally or a scheduled night agent). Report-only.
   Dimensions:
     1. Audio integrity   — every clip the manifest references exists on disk (no silent 404s).
     2. Audio↔text         — Georgian text passed to speak('…','ka-GE') has a recorded clip
                             (else it falls back to robot TTS = the "garbled voice" class of bug).
     3. Version sync       — APP_VERSION == sw cache == landing footer (deploy consistency).
     4. Age-safety         — movement pool has a tiny filter; arithmetic hidden from 3-4.
   Exit code 0 always (report-only); findings printed + written to qa/last-report.txt. */
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const r = p => readFileSync(join(ROOT, p), 'utf8');
const findings = [];
const add = (sev, dim, msg) => findings.push({ sev, dim, msg });

/* ── 1 + 2: audio ── */
const manifestSrc = r('niko/audio-manifest.js');
const manifest = {};
for (const m of manifestSrc.matchAll(/"([^"]+)"\s*:\s*"([^"]+\.mp3)"/g)) manifest[m[1]] = m[2];
const audioFiles = new Set(readdirSync(join(ROOT, 'niko/audio')).filter(f => f.endsWith('.mp3')));

let missingClips = 0;
for (const [key, file] of Object.entries(manifest)) {
  if (!audioFiles.has(file)) { add('P1', 'audio', `manifest "${key}" → ${file} but the file is MISSING on disk`); missingClips++; }
}

// reverse: ka string literals spoken with ka-GE that have no clip → will robot-TTS
const KA = /[Ⴀ-ჿ]/;
const jsFiles = ['core.js','games.js','owl.js','alpha.js','screens.js','tutor.js','tweaks.js'].map(f => 'niko/' + f);
const spokenNoClip = new Set();
for (const f of jsFiles) {
  let src; try { src = r(f); } catch { continue; }
  // speak('literal','ka-GE'…) and speakSeq([{t:'literal',lang:'ka-GE'}])
  for (const m of src.matchAll(/speak(?:One)?\(\s*'([^']+)'\s*,\s*'ka-GE'/g)) {
    const t = m[1];
    if (KA.test(t) && !manifest[t.trim().toLowerCase()]) spokenNoClip.add(t);
  }
  for (const m of src.matchAll(/\{\s*t:\s*'([^']+)'\s*,\s*lang:\s*'ka-GE'/g)) {
    const t = m[1];
    if (KA.test(t) && !manifest[t.trim().toLowerCase()]) spokenNoClip.add(t);
  }
}
for (const t of spokenNoClip) add('P2', 'audio↔text', `ka spoken with no recorded clip (TTS fallback risk): "${t}"`);

/* ── 3: version sync (auto-fixable: with --fix, sync landing/sw to APP_VERSION, then pass) ── */
const FIX = process.argv.includes('--fix');
const ver = (r('niko/screens.js').match(/APP_VERSION='([\d.]+)'/) || [])[1];
let swVer = (r('sw.js').match(/nikolearn-([\d.]+)/) || [])[1];
let landVer = (r('landing.html').match(/title="owner">v([\d.]+)/) || [])[1];
if (ver && (ver !== swVer || ver !== landVer)) {
  if (FIX) {
    if (landVer !== ver) writeFileSync(join(ROOT, 'landing.html'), r('landing.html').replace(/(title="owner">v)[\d.]+/, `$1${ver}`));
    if (swVer !== ver) writeFileSync(join(ROOT, 'sw.js'), r('sw.js').replace(/nikolearn-[\d.]+/, `nikolearn-${ver}`));
    add('fixed', 'version', `version drift auto-fixed: landing ${landVer}→${ver}, sw ${swVer}→${ver}`);
    swVer = landVer = ver;
  } else {
    add('P2', 'version', `version drift: screens=${ver} sw=${swVer} landing=${landVer} (auto-fixable: npm run qa:fix)`);
  }
}

/* ── 4: age-safety ── */
const owl = r('niko/owl.js');
if (!/isTiny\(profile\)\?MOVE_POOL\.filter\(e=>e\.tiny\)/.test(owl))
  add('P1', 'age-safety', 'movement break missing the isTiny safe-pool filter (3-4 yos could get unsafe moves)');

/* ── 5: encoding / charset — catches mojibake before it ships in visible text or social previews ── */
for (const f of ['index.html', 'landing.html', 'privacy.html']) {
  let src; try { src = r(f); } catch { continue; }
  if (src.includes('�')) add('P1', 'encoding', `${f}: contains � (U+FFFD) replacement char — broken text encoding`);
  if (!/<meta\s+charset=["']?utf-8/i.test(src)) add('P2', 'encoding', `${f}: missing <meta charset="utf-8"> (Georgian / OG text can mojibake)`);
}

/* ── 6: social-preview meta — a broken OG card kills click-through on shared links ── */
for (const f of ['index.html', 'landing.html']) {
  let src; try { src = r(f); } catch { continue; }
  for (const tag of ['og:title', 'og:image']) {
    const m = src.match(new RegExp(`property=["']${tag}["'][^>]*content=["']([^"']*)["']`, 'i'));
    if (!m || !m[1].trim() || /placeholder/i.test(m[1])) add('P2', 'meta', `${f}: ${tag} missing/empty/placeholder (bad social share preview)`);
  }
}

/* ── 7: repo portability — a path this repo can hold that a CI runner cannot CREATE (NB-55) ──
   The class: we author on Windows/NTFS, but every deploy checks the repo out on a Linux runner. A
   path that is legal here and illegal there kills `actions/checkout` itself, so the build dies
   BEFORE any of our other checks get to run, and every commit after it is undeployable.
   Why it needs its own check: on 2026-07-15 this gate ran on such a commit and printed green. It
   was green about the app while the repo could not be cloned. Absence of a check is not absence
   of a bug (CLAUDE.md §14), and nothing else here looks at paths at all. */
const trackedPaths = (() => {
  try {
    // -z + a Buffer keeps real UTF-8 bytes. Plain `git ls-files` would octal-escape non-ASCII
    // ("\341\203\236"), and measuring THAT string measures the escaping, not the filename.
    return execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 })
      .toString('utf8').split('\0').filter(Boolean);
  } catch { return null; }   // not a git checkout (e.g. a tarball) — skip, don't crash the gate
})();
if (trackedPaths) {
  // NAME_MAX on ext4 is 255 BYTES, not characters. Georgian is 3 bytes/char in UTF-8, so a
  // Georgian filename dies at ~85 characters — a length that looks perfectly normal in Explorer.
  // That asymmetry is exactly why this shipped unnoticed.
  const NAME_MAX = 255;
  for (const p of trackedPaths) {
    const base = p.split('/').pop();
    const bytes = Buffer.byteLength(base, 'utf8');
    if (bytes > NAME_MAX)
      add('P1', 'repo-portability', `filename is ${bytes} bytes (Linux NAME_MAX=${NAME_MAX}) → git checkout FAILS on the CI runner, so NOTHING deploys: ${p}`);
  }
  // Same class, other mechanism: git can track Foo.js and foo.js as two files; a case-insensitive
  // checkout (Windows, macOS) collapses them and silently gets whichever landed last.
  const seen = new Map();
  for (const p of trackedPaths) {
    const k = p.toLowerCase();
    if (seen.has(k) && seen.get(k) !== p)
      add('P1', 'repo-portability', `case-only path collision → collapses to one file on Windows/macOS checkouts: "${seen.get(k)}" vs "${p}"`);
    else seen.set(k, p);
  }
}

/* ── 8: service-worker cache-key integrity — the offline shell must be unpoisonable (NB-57) ──
   The class: a cache write whose KEY is a string literal instead of the request that produced it.
   Then any document served through that handler is stored AS the shell, and the next offline launch
   opens whatever was cached last. Found live 2026-07-15 (audit finding #10): sw.js wrote EVERY
   successful navigation to './index.html', so opening landing.html — which niko/screens.js:132 does
   deliberately — replaced the app with the marketing page for every later offline launch.
   Why static and why here: the damage only appears offline, after a specific visit order, on a
   device that already has the SW. Nothing in a normal render catches that, and by then it is on a
   child's phone. The literal, however, is visible on sight — so make it fail at the gate instead. */
try {
  const swRaw = readFileSync(join(ROOT, 'sw.js'), 'utf8');
  // Strip comments before judging. Caught by this check's OWN discriminator: the first version
  // searched the raw text for "ignoreSearch", and the comment I wrote next to the fix — explaining
  // ignoreSearch — satisfied it. The guard passed a file where the real call was gone. A check that
  // greps for a WORD tests my prose; a check must test the CODE. ([^:] keeps https:// intact.)
  const sw = swRaw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const swLines = sw.split('\n');
  swLines.forEach((line, i) => {
    // Match a .put( whose first argument is a quoted literal. The precache keys on a variable
    // (c.put(u, resp)) and the asset/navigation handlers key on e.request — all legitimate.
    const m = line.match(/\.put\(\s*['"`]([^'"`]+)['"`]/);
    if (m)
      add('P1', 'sw-cache-key', `sw.js:${i + 1} caches under the LITERAL key "${m[1]}" instead of the request that produced it → any document fetched through this path overwrites that entry, and the next offline launch serves it. This is NB-57: it put the marketing landing page where the app should be, and the landing's own start button looped straight back to it. Key on e.request.`);
  });
  // The other half of NB-57, and it survives fixing the key: manifest start_url carries a query
  // ("index.html?app=1&src=pwa"), and caches.match defaults to ignoreSearch=false — so the offline
  // PWA launch never matches its own precached entry and silently falls through to the fallback.
  const startUrl = (() => { try { return JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8')).start_url || ''; } catch { return ''; } })();
  if (startUrl.includes('?') && /request\.mode\s*===\s*'navigate'/.test(sw) && !/ignoreSearch\s*:\s*true/.test(sw))
    add('P1', 'sw-cache-key', `manifest start_url "${startUrl}" has a query but sw.js never passes { ignoreSearch: true } to caches.match → the offline PWA launch cannot match its own precached shell and drops to the fallback path every time (NB-57, second mechanism).`);
} catch { /* no sw.js — nothing to check */ }

/* ── report ── */
const order = { P1: 0, P2: 1, P3: 2, fixed: 3 };
findings.sort((a, b) => order[a.sev] - order[b.sev]);
const counts = findings.reduce((o, f) => ((o[f.sev] = (o[f.sev] || 0) + 1), o), {});
const lines = [];
lines.push(`NikoLearn QA report — version ${ver} — ${findings.length} finding(s)`);
lines.push(`clips: ${Object.keys(manifest).length} manifest / ${audioFiles.size} files on disk · missing: ${missingClips}`);
lines.push(`severity: P1=${counts.P1 || 0} P2=${counts.P2 || 0} P3=${counts.P3 || 0}`);
lines.push('');
if (!findings.length) lines.push('✅ all checks passed — no issues found.');
for (const f of findings) lines.push(`[${f.sev}] ${f.dim}: ${f.msg}`);
/* ── release gate ── release-blocking = any P1, plus version drift and encoding (deploy-breakers) ── */
const BLOCK_DIMS = new Set(['version', 'encoding']);
const blockers = findings.filter(f => f.sev !== 'fixed' && (f.sev === 'P1' || BLOCK_DIMS.has(f.dim)));
lines.push('');
lines.push(blockers.length
  ? `⛔ RELEASE-BLOCKING: ${blockers.length} (must fix before deploy)`
  : '✅ no release-blocking issues');

const report = lines.join('\n');
console.log(report);
try { writeFileSync(join(ROOT, 'qa/last-report.txt'), report + '\n'); } catch {}

/* --gate: exit non-zero so `npm test` / CI / a deploy script actually STOPS on a blocker. */
if (process.argv.includes('--gate') && blockers.length) {
  console.log(`\n⛔ GATE FAILED — refusing release (${blockers.length} blocker(s)). Fix, then re-run.`);
  process.exit(1);
}
if (process.argv.includes('--gate')) console.log('\n✅ GATE PASSED.');
