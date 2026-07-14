#!/usr/bin/env node
/* qa/live-check.mjs — LIVE production health check (NB-46).
   Fetches the DEPLOYED site (default https://nikolearn.com) and asserts deploy health WITHOUT a
   browser, so it runs in GitHub Actions where outbound internet works. This fixes the two defects
   the old weekly cloud QA routine had: it ran in a sandbox that BLOCKED outbound fetch (→ 0 of its
   checks ever ran) and it pointed at the DEAD `gshoina.github.io` origin. This repoints to the live
   app and actually runs — NB-46 defects (i) stale-origin + (ii) 0-checks.
   Report-only (exit 0) unless --gate. Writes findings JSON to qa/live-report.json.
   Usage: node qa/live-check.mjs [--gate] [--origin https://nikolearn.com] [--expect-version 1.360]
     --gate            exit 1 if any P1/P2 finding (for a CI gate).
     --origin URL      site to check (default https://nikolearn.com).
     --expect-version  repo main HEAD APP_VERSION; if the live version differs, flag a stale/failed
                       deploy (a silent deploy regression the source checks can't see).
*/
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, def) => { const i = process.argv.indexOf(name); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def; };
const ORIGIN = arg('--origin', 'https://nikolearn.com').replace(/\/+$/, '');
const EXPECT = arg('--expect-version', '');
const GATE = process.argv.includes('--gate');
// propagation-window false-positive mitigation (red-teamed 2026-07-14): a fresh deploy can
// still be propagating when we check → retry a few times, and if the live version still lags
// but repo HEAD was committed < grace ago, treat it as lag (silent) not a real stale deploy.
const RETRIES = parseInt(arg('--retries', '4'), 10);           // extra re-fetches on a version mismatch
const RETRY_WAIT_MS = parseInt(arg('--retry-wait-ms', '30000'), 10); // wait between retries
const GRACE_MIN = parseFloat(arg('--deploy-grace-min', '15')); // HEAD younger than this → assume propagating
const HEAD_EPOCH = parseInt(arg('--head-epoch', '0'), 10) || 0; // repo HEAD commit time (unix sec), from CI

const findings = [];
const add = (sev, dim, msg) => findings.push({ sev, dim, msg });
const bust = () => `?v=${Date.now()}`;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function grab(path) {
  const url = `${ORIGIN}/${path}${bust()}`;
  const r = await fetch(url, { cache: 'no-store', redirect: 'follow' });
  const text = r.ok ? await r.text() : '';
  return { ok: r.ok, status: r.status, text, ctype: r.headers.get('content-type') || '' };
}

// ── 1. Critical assets must serve 200 ───────────────────────────────────────
const ASSETS = ['', 'sw.js', 'manifest.json', 'niko/screens.js', 'landing.html',
  'niko/wordsearch.js', 'niko/audio-manifest.js'];
const got = {};
for (const a of ASSETS) {
  try {
    const res = await grab(a || 'index.html');
    got[a] = res;
    if (!res.ok) add('P1', 'reachability', `${a || 'index.html'} → HTTP ${res.status} (asset not serving on live)`);
  } catch (e) {
    got[a] = { ok: false, status: 0, text: '' };
    add('P1', 'reachability', `${a || 'index.html'} → fetch failed (${e.message}) — origin unreachable?`);
  }
}

// ── 2. index.html integrity (charset / OG / mojibake) ───────────────────────
const idx = got['']?.text || '';
if (idx) {
  if (!/<meta\s+charset=["']?utf-8/i.test(idx)) add('P2', 'encoding', 'live index.html missing <meta charset="utf-8">');
  if (idx.includes('�')) add('P1', 'encoding', 'live index.html contains � (broken text encoding)');
  for (const tag of ['og:title', 'og:image']) if (!idx.includes(tag)) add('P2', 'social', `live index.html missing ${tag} (broken share card)`);
}

// ── 3. Deploy version consistency ON the live site ──────────────────────────
const screensVer = (got['niko/screens.js']?.text.match(/APP_VERSION='([\d.]+)'/) || [])[1];
const swCache = (got['sw.js']?.text.match(/nikolearn-([\d.]+)/) || [])[1];
const landVer = (got['landing.html']?.text.match(/title="owner">v([\d.]+)/) || [])[1];
if (screensVer && swCache && landVer && (screensVer !== swCache || screensVer !== landVer))
  add('P2', 'version', `live deploy version drift: screens=${screensVer} sw=${swCache} landing=${landVer}`);

// ── 4. Stale/failed-deploy detection (live vs repo main HEAD) — retry + grace guarded ──
// Distinguishes a REAL stale/failed deploy from a deploy that is merely still propagating,
// so a run shortly after a push does not open a spurious PR.
let liveVer = screensVer;
if (EXPECT && liveVer && liveVer !== EXPECT) {
  for (let i = 0; i < RETRIES && liveVer !== EXPECT; i++) {
    await sleep(RETRY_WAIT_MS);
    const r = await grab('niko/screens.js');
    liveVer = (r.text.match(/APP_VERSION=.([0-9.]+)/) || [])[1] || liveVer;
  }
  if (liveVer === EXPECT) {
    console.log(`  ✓ live version converged to ${EXPECT} after retry (was mid-propagation) — no finding.`);
  } else {
    const ageMin = HEAD_EPOCH ? (Date.now() / 1000 - HEAD_EPOCH) / 60 : Infinity;
    if (ageMin < GRACE_MIN) {
      console.log(`  ⏳ live=${liveVer} expected=${EXPECT}, but HEAD committed ${ageMin.toFixed(1)}m ago (< ${GRACE_MIN}m grace) → propagation lag, NOT flagging (next run confirms).`);
    } else {
      const age = Number.isFinite(ageMin) ? `${ageMin.toFixed(0)}m` : 'unknown';
      add('P1', 'deploy', `live is STALE: live APP_VERSION=${liveVer} but repo main HEAD=${EXPECT} — HEAD committed ${age} ago, still not live after ${RETRIES} retr${RETRIES === 1 ? 'y' : 'ies'} (deploy failed or reverted)`);
    }
  }
}

// ── 5. manifest.json must parse ─────────────────────────────────────────────
if (got['manifest.json']?.ok) {
  try { JSON.parse(got['manifest.json'].text); } catch { add('P2', 'manifest', 'live manifest.json does not parse as JSON (PWA install breaks)'); }
}

// ── report ──────────────────────────────────────────────────────────────────
const report = { origin: ORIGIN, when: new Date().toISOString(), liveVersion: liveVer || null, expected: EXPECT || null, findings };
writeFileSync(join(ROOT, 'qa', 'live-report.json'), JSON.stringify(report, null, 2));
const P1 = findings.filter(f => f.sev === 'P1').length, P2 = findings.filter(f => f.sev === 'P2').length;
console.log(`LIVE-CHECK ${ORIGIN}  liveVersion=${liveVer || '?'}${EXPECT ? ` expected=${EXPECT}` : ''}  → P1=${P1} P2=${P2}`);
for (const f of findings) console.log(`  [${f.sev}] ${f.dim}: ${f.msg}`);
if (!findings.length) console.log('  ✓ live site healthy');
if (GATE && findings.length) process.exit(1);
