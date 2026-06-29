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

/* ── 3: version sync ── */
const ver = (r('niko/screens.js').match(/APP_VERSION='([\d.]+)'/) || [])[1];
const swVer = (r('sw.js').match(/nikolearn-([\d.]+)/) || [])[1];
const landVer = (r('landing.html').match(/title="owner">v([\d.]+)/) || [])[1];
if (!(ver && ver === swVer && ver === landVer))
  add('P2', 'version', `version drift: screens=${ver} sw=${swVer} landing=${landVer} (run node bump.mjs)`);

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

/* ── report ── */
const order = { P1: 0, P2: 1, P3: 2 };
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
const blockers = findings.filter(f => f.sev === 'P1' || BLOCK_DIMS.has(f.dim));
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
