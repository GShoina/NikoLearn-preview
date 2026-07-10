// NikoLearn weekly measurement report (2026-07-10 measurement upgrade, plan step 4).
// Pulls: telemetry Worker stats + Cloudflare Web Analytics (GraphQL) + GitHub repo traffic.
// GSC: linked manually until API wiring (property pending owner 2-min step).
// Output: output/YYYY-MM-DD-კვირის მეტრიკები by Niko.html  (owner-facing, Georgian)
// GitHub traffic has a rolling 14-day window → snapshot appended to tools/data/github-traffic.json.
// Run: node tools/weekly-report.mjs   (creds read from ~/.claude/.bivision-creds.env)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CREDS = Object.fromEntries(
  fs.readFileSync('C:/Users/gela.shonia/.claude/.bivision-creds.env', 'utf8')
    .split(/\r?\n/).filter(l => /^[A-Z_0-9]+=/.test(l)).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const DAYS = 14;
const today = new Date();
const iso = d => d.toISOString().slice(0, 10);
const dates = Array.from({ length: DAYS }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() - (DAYS - 1 - i)); return iso(d); });

// ── 1. Worker stats ─────────────────────────────────────────────────────────
async function workerStats() {
  const r = await fetch(`https://nikolearn-t.bivision.workers.dev/v1/stats?k=${encodeURIComponent(CREDS.NIKO_STATS_KEY)}`);
  if (!r.ok) throw new Error('stats HTTP ' + r.status);
  const raw = await r.json();
  // parse: c|date|event|deviceType|dims → rows; s|/n| both shapes (with/without trailing deviceType)
  const rows = [], sums = [];
  for (const [k, v] of Object.entries(raw)) {
    const p = k.split('|'), n = parseInt(v, 10) || 0;
    if (p[0] === 'c') rows.push({ date: p[1], event: p[2], device: p[3], dims: Object.fromEntries((p[4] || '').split(',').filter(Boolean).map(s => s.split('='))), n });
    else if (p[0] === 's' || p[0] === 'n') sums.push({ kind: p[0], date: p[1], event: p[2], prop: p[3], device: p[4] || 'all', n });
  }
  return { rows, sums };
}
const inWin = r => dates.includes(r.date);
const tally = (rows, f) => rows.filter(inWin).filter(f).reduce((a, r) => a + r.n, 0);
const by = (rows, f, keyFn) => { const m = {}; rows.filter(inWin).filter(f).forEach(r => { const k = keyFn(r); m[k] = (m[k] || 0) + r.n; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); };

// ── 2. Cloudflare Web Analytics (GraphQL; needs Account Analytics:Read on the token) ──
async function cfWebAnalytics() {
  const q = { query: `{ viewer { accounts(filter:{accountTag:"62f02b2a518a8e63eba0537f9162c0ec"}) {
    rumPageloadEventsAdaptiveGroups(filter:{date_geq:"${dates[0]}", date_leq:"${dates[DAYS - 1]}"}, limit:100, orderBy:[date_ASC]) {
      count dimensions { date } sum { visits } } } } }` };
  const r = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST', headers: { Authorization: `Bearer ${CREDS.CF_NIKO_API_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(q) });
  const j = await r.json();
  if (j.errors && j.errors.length) throw new Error(j.errors[0].message);
  return (j.data.viewer.accounts[0] || {}).rumPageloadEventsAdaptiveGroups || [];
}

// ── 3. GitHub traffic (14-day rolling window → persist snapshot) ────────────
async function githubTraffic() {
  const h = { Authorization: `Bearer ${CREDS.GITHUB_TOKEN}`, 'User-Agent': 'nikolearn-report' };
  const [views, referrers] = await Promise.all([
    fetch('https://api.github.com/repos/GShoina/NikoLearn/traffic/views', { headers: h }).then(r => r.json()),
    fetch('https://api.github.com/repos/GShoina/NikoLearn/traffic/popular/referrers', { headers: h }).then(r => r.json())]);
  const snapFile = path.join(ROOT, 'tools', 'data', 'github-traffic.json');
  fs.mkdirSync(path.dirname(snapFile), { recursive: true });
  let hist = []; try { hist = JSON.parse(fs.readFileSync(snapFile, 'utf8')); } catch (e) {}
  const seen = new Set(hist.map(x => x.timestamp));
  (views.views || []).forEach(v => { if (!seen.has(v.timestamp)) hist.push(v); });
  fs.writeFileSync(snapFile, JSON.stringify(hist, null, 1));
  return { views, referrers, hist };
}

// ── build ────────────────────────────────────────────────────────────────────
const out = { w: null, cf: null, gh: null, err: {} };
try { out.w = await workerStats(); } catch (e) { out.err.w = e.message; }
try { out.cf = await cfWebAnalytics(); } catch (e) { out.err.cf = e.message; }
try { out.gh = await githubTraffic(); } catch (e) { out.err.gh = e.message; }

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const tbl = (head, rows) => `<table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
let S = [];
if (out.w) {
  const { rows, sums } = out.w;
  const phone = r => r.device === 'phone' || r.device === 'tablet';
  // Acquisition
  S.push(['🚪 მოზიდვა (Acquisition)', tbl(['წყარო', 'page_view 14დღე'], by(rows, r => r.event === 'page_view', r => r.dims.ref || '?').map(([k, v]) => [k, v]))
    + tbl(['გვერდი', 'ხსნის'], by(rows, r => r.event === 'page_view', r => r.dims.page || '?').map(([k, v]) => [k, v]))]);
  // Activation + Retention
  const retRows = by(rows, r => r.event === 'retention_ping', r => `${r.date} · ${r.dims.band} · played=${r.dims.played} · ${r.device}`);
  S.push(['🔄 დაბრუნება/გააქტიურება (retention_ping — ახალი, 07-10-დან; 07-10-ის new=1 + tier_up=1 ჩემი ტესტ-probe-ია, გამოაკელი)',
    (retRows.length ? tbl(['დღე · band · played · device', 'n'], retRows.map(([k, v]) => [k, v])) : '<p>ჯერ ცარიელია — მონაცემი v1.356-ის გაშვებიდან დაიწყება.</p>')
    + `<p>first_win (14დღე): <b>${tally(rows, r => r.event === 'first_win')}</b> · აქტივაცია = დაბრუნება ≤7 დღეში played=y</p>`]);
  // Engagement (phone-first)
  S.push(['🎮 ჩართულობა (phone-first)', tbl(['მეტრიკა', 'phone/tablet', 'desktop'], [
    ['round_complete', tally(rows, r => r.event === 'round_complete' && phone(r)), tally(rows, r => r.event === 'round_complete' && !phone(r))],
    ['round_abandon', tally(rows, r => r.event === 'round_abandon' && phone(r)), tally(rows, r => r.event === 'round_abandon' && !phone(r))],
    ['abandon q0-ზე', tally(rows, r => r.event === 'round_abandon' && r.dims.q === '0' && phone(r)), tally(rows, r => r.event === 'round_abandon' && r.dims.q === '0' && !phone(r))]])
    + tbl(['საგანი (mode_usage)', 'n'], by(rows, r => r.event === 'mode_usage', r => r.dims.mode || '?').slice(0, 8).map(([k, v]) => [k, v]))]);
  // Learning + Parent + PWA
  S.push(['📈 სწავლა · მშობელი · PWA', tbl(['event', 'n 14დღე'], [
    ['tier_up', tally(rows, r => r.event === 'tier_up')],
    ['parent_open', tally(rows, r => r.event === 'parent_open')],
    ['feedback_open', tally(rows, r => r.event === 'feedback_open')],
    ['pwa_nudge (ახალი)', tally(rows, r => r.event === 'pwa_nudge')],
    ['pwa_installed (ახალი)', tally(rows, r => r.event === 'pwa_installed')]])]);
  // session length avg (both key shapes; per-device where new shape exists)
  const sAgg = {}; sums.filter(inWin).forEach(x => { const k = `${x.prop}|${x.device}`; sAgg[k] = sAgg[k] || { s: 0, n: 0 }; sAgg[k][x.kind === 's' ? 's' : 'n'] += x.n; });
  const sess = Object.entries(sAgg).filter(([k]) => k.startsWith('seconds')).map(([k, v]) => [k.split('|')[1], v.n ? Math.round(v.s / v.n) + ' წმ საშ.' : '?']);
  if (sess.length) S.push(['⏱ სესიის ხანგრძლივობა (device-ჭრილი ახალი მონაცემიდან ივსება)', tbl(['device', 'საშუალო'], sess)]);
} else S.push(['⚠ Worker stats', `<p>ვერ წამოვიდა: ${esc(out.err.w)}</p>`]);
if (out.cf) S.push(['☁ Cloudflare Web Analytics', tbl(['დღე', 'pageloads', 'visits'], out.cf.map(g => [g.dimensions.date, g.count, g.sum.visits]))]);
else S.push(['☁ Cloudflare Web Analytics', `<p>ვერ წამოვიდა: ${esc(out.err.cf || '?')} → ტოკენს სჭირდება Account Analytics:Read scope.</p>`]);
if (out.gh) S.push(['🐙 GitHub traffic (14 დღე, snapshot ინახება)', `<p>views: <b>${out.gh.views.count || 0}</b> · unique: <b>${out.gh.views.uniques || 0}</b></p>`
  + tbl(['referrer', 'count', 'uniques'], (out.gh.referrers || []).map(r => [esc(r.referrer), r.count, r.uniques]))]);
else S.push(['🐙 GitHub traffic', `<p>ვერ წამოვიდა: ${esc(out.err.gh || '?')}</p>`]);
S.push(['🔍 Google Search Console', '<p>Property ჯერ არ არსებობს. Owner-ის 2-წუთიანი ნაბიჯი: search.google.com/search-console → Add property → Domain → nikolearn.com → TXT მნიშვნელობა გადმომეცი და DNS-ში ჩავსვამ.</p>']);

const html = `<!doctype html><html lang="ka"><head><meta charset="utf-8"><title>NikoLearn კვირის მეტრიკები ${iso(today)}</title>
<style>body{font-family:system-ui,'Noto Sans Georgian',sans-serif;max-width:860px;margin:24px auto;padding:0 16px;color:#222;background:#faf7f0}
h1{font-size:1.4rem}h2{font-size:1.05rem;margin:22px 0 8px;border-bottom:2px solid #e8dcc4;padding-bottom:4px}
table{border-collapse:collapse;margin:6px 0;font-size:.9rem}td,th{border:1px solid #ddd;padding:4px 10px;text-align:left}th{background:#f0e8d8}
.note{background:#fff8e6;border:1px solid #eedc9a;border-radius:10px;padding:10px 14px;font-size:.88rem}</style></head><body>
<h1>🦉 NikoLearn — გაზომვის რეპორტი · ${iso(today)} (ბოლო ${DAYS} დღე)</h1>
<div class="note"><b>პატიოსნების წესები:</b> n&lt;30 → მხოლოდ რაოდენობები, არა პროცენტები. სტრატეგიის ცვლილება მხოლოდ ≥2 თანმიმდევრული კვირის ტრენდზე. Desktop ≈ უფროსის გადახედვა, phone ≈ რეალური ბავშვი.</div>
${S.map(([t, b]) => `<h2>${t}</h2>${b}`).join('\n')}
<p style="color:#888;font-size:.8rem">გენერირებულია tools/weekly-report.mjs · წყაროები: telemetry Worker · CF Web Analytics · GitHub · (GSC pending)</p>
</body></html>`;
const outFile = path.join(ROOT, 'output', `${iso(today)}-კვირის მეტრიკები by Niko.html`);
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, html);
console.log('REPORT →', outFile);
console.log('sources: worker=' + (out.w ? 'OK' : 'FAIL:' + out.err.w) + ' cf=' + (out.cf ? 'OK' : 'FAIL:' + (out.err.cf || '')) + ' gh=' + (out.gh ? 'OK' : 'FAIL:' + (out.err.gh || '')));
