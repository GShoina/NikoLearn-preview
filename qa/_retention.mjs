// Retention-ping + tier_up behavioral harness (2026-07-10 measurement upgrade).
// Verifies the id-free retention band machine (niko_ret), the once-per-day guard, the legacy
// migration, the CLIENT_ALLOW↔Worker EVENTS mirror, and the tier_up emission points.
// Run: node qa/_retention.mjs   (also wired into qa/behavioral.mjs → pre-push)
import { launchBrowser, startStaticServer, makeChk, ROOT } from './_harness.mjs';
import fs from 'node:fs';

const { chk, fails } = makeChk();
const srv = await startStaticServer();
const URL = `http://localhost:${srv.port}/index.html?app=1`;
const browser = await launchBrowser();

const day = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const TODAY = day(0);

// open a fresh context, optionally seeding localStorage BEFORE any page script runs
async function load(seed) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  const page = await ctx.newPage();
  if (seed) await page.addInitScript(s => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.Analytics, null, { timeout: 10000 });
  return { ctx, page, errs };
}
const ret = (page) => page.evaluate(() => window.Analytics._ret);
const stored = (page) => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('niko_ret')); } catch (e) { return null; } });

// ── 1. fresh device → band=new, played=n, niko_ret seeded with today, stamped today ──
{
  const { ctx, page, errs } = await load(null);
  const r = await ret(page), s = await stored(page);
  chk('fresh → band new', r && r.band === 'new');
  chk('fresh → played n', r && r.played === 'n');
  chk('fresh → ctx browser', r && r.ctx === 'browser');
  chk('fresh → niko_ret f=today l=today', s && s.f === TODAY && s.l === TODAY && s.p === 0);
  chk('fresh → no pageerrors', errs.length === 0);
  await ctx.close();
}
// ── 2-5. seeded first-use dates → correct bands; played flag carried ──
for (const [off, band] of [[-1, 'd1'], [-5, 'd2_7'], [-20, 'd8_30'], [-60, 'd31p']]) {
  const { ctx, page } = await load({ niko_ret: JSON.stringify({ f: day(off), l: '', p: 1 }) });
  const r = await ret(page);
  chk(`f=${off}d → band ${band}`, r && r.band === band);
  chk(`f=${off}d → played y`, r && r.played === 'y');
  await ctx.close();
}
// ── 6. pre-existing device (nikolearn_p2 present, no niko_ret) → one-time legacy migration ──
{
  const { ctx, page } = await load({ nikolearn_p2: JSON.stringify({ onboarded: true, kids: [], guest: {} }) });
  const r = await ret(page), s = await stored(page);
  chk('legacy device → band legacy', r && r.band === 'legacy');
  chk('legacy device → played y', r && r.played === 'y');
  chk('legacy device → niko_ret seeded', s && s.f === TODAY && s.p === 1);
  await ctx.close();
}
// ── 7. already pinged today → guard: no second ping, stamp unchanged ──
{
  const { ctx, page } = await load({ niko_ret: JSON.stringify({ f: day(-3), l: TODAY, p: 0 }) });
  const r = await ret(page);
  chk('same-day reload → no ping (guard)', r === null);
  await ctx.close();
}
// ── 8. CLIENT_ALLOW ↔ Worker EVENTS mirror (static, fail-closed both sides) ──
{
  const client = fs.readFileSync(`${ROOT}/niko/analytics.js`, 'utf8');
  const worker = fs.readFileSync(`${ROOT}/cloudflare/telemetry-worker.js`, 'utf8');
  const block = client.match(/var CLIENT_ALLOW = \{([\s\S]*?)\};/)[1];
  const names = [...block.matchAll(/(\w+):\s*\[/g)].map(m => m[1]);
  const wblock = worker.match(/const EVENTS = \{([\s\S]*?)\n\};/)[1];
  const wnames = new Set([...wblock.matchAll(/^\s{2}(\w+):\s*\{/gm)].map(m => m[1]));
  const missing = names.filter(n => !wnames.has(n));
  chk(`mirror: every client event exists in worker (${names.length} events)`, missing.length === 0);
  for (const n of ['retention_ping', 'tier_up', 'pwa_nudge', 'pwa_installed'])
    chk(`mirror: ${n} on both sides`, names.includes(n) && wnames.has(n));
}
// ── 9. tier_up emission: rampMath (≥90% bump) + bumpFlat (4-streak bump) ──
{
  const { ctx, page } = await load(null);
  await page.waitForFunction(() => typeof rampMath === 'function' && typeof bumpFlat === 'function', null, { timeout: 10000 });
  const got = await page.evaluate(() => {
    const spy = []; window.Analytics.event = (n, d) => spy.push({ n, d });
    profile = 'guest'; if (typeof state === 'undefined' || !state) state = {}; if (!state.guest) state.guest = {};
    rampMath('math-add', 95);                       // strong round → instant level-up
    state.guest.flatStreak = { compare: 3 }; state.guest.flatTier = { compare: 1 };
    bumpFlat('compare', true);                      // 4th correct → tier 2
    return spy;
  });
  const ups = got.filter(e => e.n === 'tier_up');
  chk('rampMath 95% → tier_up emitted', ups.some(e => e.d && e.d.mode === 'math-add' && /^t[1-4]$/.test(e.d.tier)));
  chk('bumpFlat 4-streak → tier_up t2 compare', ups.some(e => e.d && e.d.mode === 'compare' && e.d.tier === 't2'));
  await ctx.close();
}

await browser.close(); srv.close();
console.log(fails() ? `\n❌ ${fails()} FAILED` : '\n✅ ALL PASS — _retention.mjs');
process.exit(fails() ? 1 : 0);
