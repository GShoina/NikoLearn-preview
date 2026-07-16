// NB-32 / NB-30 behavioral harness — proves kid progress cannot vanish SILENTLY.
//
// Static reading cannot prove any of this (§14: a behavior class needs the app RUN), so every
// assertion below drives the real app in a real browser:
//   A. a blocked/full localStorage is DETECTED by save() (read-back), not swallowed
//   B. the parent dashboard SURFACES it (banner rendered + legible contrast), not silent
//   C. a corrupted main key RECOVERS from the last-known-good backup instead of resetting progress
//   D. the healthy path stays silent (no false alarm)
import { chromium, PW_CHROMIUM, SHOT_DIR, startStaticServer } from './_harness.mjs';

const srv = await startStaticServer();
const BASE = `http://127.0.0.1:${srv.port}/index.html?app=1&notrack=1`;
const browser = await chromium.launch({ executablePath: PW_CHROMIUM });
const results = [];
const ok = (name, pass, detail='') => { results.push({ name, pass, detail }); console.log(`${pass?'✅':'❌'} ${name}${detail?'  — '+detail:''}`); };

// contrast ratio (WCAG) from two rgb() strings
const lum = c => { const [r,g,b] = c.match(/\d+/g).map(Number).map(v=>{ v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }); return 0.2126*r + 0.7152*g + 0.0722*b; };
const ratio = (a,b) => { const [x,y] = [lum(a), lum(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };

async function freshPage(){
  const ctx = await browser.newContext({ viewport:{ width:390, height:780 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  return { ctx, page, errs };
}
// seed a real profile so the parent dashboard has a child to render
const seed = { onboarded:true, kids:[{ id:'k1', name:'ნიკო', age:7, color:'blue' }],
  k1:{ shields:5, streak:1, maxStreak:1, dayStreak:1, maxDayStreak:1, lastDay:null, todayMs:0, todayDate:null,
       words:{}, sessions:3, math:{}, best:{}, lastPlayed:null, totalTime:60000, dadMessages:[] } };

/* ── A + B: storage blocked → detected AND surfaced ─────────────────────────── */
{
  const { ctx, page, errs } = await freshPage();
  await page.addInitScript(s => { localStorage.setItem('nikolearn_p2', JSON.stringify(s)); }, seed);
  await page.goto(BASE, { waitUntil:'networkidle' });
  // Simulate the real failure: the browser ACCEPTS the call but the value never lands. This is the
  // nastiest quota mode (it lies rather than throws) and is what the old catch-only save() missed.
  // The child must have EARNED something first: a dropped write only loses data when the new state
  // differs from what is already stored, so mutate before saving or the test proves nothing.
  await page.evaluate(() => { Storage.prototype.setItem = function(){ /* silently drop */ }; });
  const saved = await page.evaluate(() => { state.k1.shields = 99; return save(); });
  ok('A. save() reports failure when a dropped write would lose progress', saved === false, `save() returned ${saved}`);
  ok('A2. saveStatus() flips unhealthy', await page.evaluate(() => saveStatus()) === false);
  // The other real mode: private browsing throws outright.
  const threw = await page.evaluate(() => { Storage.prototype.setItem = function(){ throw new DOMException('QuotaExceededError'); };
    state.k1.shields = 100; return save(); });
  ok('A3. save() also survives a THROWING store (private mode)', threw === false, `save() returned ${threw}`);

  await page.evaluate(() => parentDash());
  await page.waitForTimeout(250);
  const warn = page.locator('.save-warn');
  const shown = await warn.count() > 0 && await warn.first().isVisible();
  ok('B. parent dashboard shows the warning banner', shown);
  if (shown) {
    const text = (await warn.first().innerText()).replace(/\s+/g,' ').trim();
    ok('B2. banner names the real consequence', /დაიკარგება/.test(text), text.slice(0, 80) + '…');
    const { fg, bg } = await page.evaluate(() => {
      // Resolve through a canvas: computed styles come back as oklch()/color-mix() here, which a
      // naive digit-scrape silently misreads into a nonsense ratio (a check that cannot fail).
      const cv = document.createElement('canvas').getContext('2d', { willReadFrequently:true });
      const toRGB = css => { cv.clearRect(0,0,1,1); cv.fillStyle = '#000'; cv.fillStyle = css;
        cv.fillRect(0,0,1,1); const [r,g,b] = cv.getImageData(0,0,1,1).data; return `rgb(${r}, ${g}, ${b})`; };
      const h = document.querySelector('.save-warn .sw-h');
      const box = document.querySelector('.save-warn');
      const bgOf = el => { for(let n=el; n; n=n.parentElement){ const c=getComputedStyle(n).backgroundColor; if(c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; } return 'rgb(255,255,255)'; };
      return { fg: toRGB(getComputedStyle(h).color), bg: toRGB(bgOf(box)) };
    });
    const cr = ratio(fg, bg);
    ok('B3. banner heading meets WCAG AA (>=4.5)', cr >= 4.5, `contrast ${cr.toFixed(2)} (${fg} on ${bg})`);
    await page.screenshot({ path: `${SHOT_DIR}/nb32-save-warn.png`, fullPage:false });
  }
  ok('B4. no page errors on the failure path', errs.length === 0, errs[0] || '');
  // Caught by LOOKING at the shot, not by any assertion above: the privacy card sat right under the
  // banner still promising "progress is saved only here" while the banner said it could not be.
  const claims = await page.locator('.privacy-card').innerText();
  ok('B5. the privacy card drops the save-promise it can no longer keep', !/ინახება მხოლოდ აქ/.test(claims));
  ok('B6. the privacy promise itself still holds', /ამ მოწყობილობაზე რჩება/.test(claims));
  await ctx.close();
}

/* ── C: corrupted main key → recovers from backup, progress NOT reset ───────── */
{
  const { ctx, page, errs } = await freshPage();
  await page.addInitScript(s => { localStorage.setItem('nikolearn_p2', JSON.stringify(s)); }, seed);
  await page.goto(BASE, { waitUntil:'networkidle' });
  await page.evaluate(() => save());                       // rotates the last-known-good backup
  const hasBak = await page.evaluate(() => !!localStorage.getItem('nikolearn_p2_bak'));
  ok('C1. a last-known-good backup is written', hasBak);
  await page.evaluate(() => localStorage.setItem('nikolearn_p2', '{"kids":[  CORRUPT'));  // torn write
  await page.reload({ waitUntil:'networkidle' });
  const rec = await page.evaluate(() => ({ kids: state.kids.length, name: state.kids[0]?.name, shields: state.k1?.shields }));
  ok('C2. corrupted main key recovers the child from backup', rec.kids === 1 && rec.name === 'ნიკო', JSON.stringify(rec));
  ok('C3. the child\'s coins survive the corruption', rec.shields === 5, `shields=${rec.shields}`);
  ok('C4. no page errors on the recovery path', errs.length === 0, errs[0] || '');
  await ctx.close();
}

/* ── D: healthy path stays silent (no false alarm) ──────────────────────────── */
{
  const { ctx, page, errs } = await freshPage();
  await page.addInitScript(s => { localStorage.setItem('nikolearn_p2', JSON.stringify(s)); }, seed);
  await page.goto(BASE, { waitUntil:'networkidle' });
  ok('D1. healthy save() returns true', await page.evaluate(() => save()) === true);
  await page.evaluate(() => parentDash());
  await page.waitForTimeout(250);
  ok('D2. no banner on a healthy device (no false alarm)', await page.locator('.save-warn').count() === 0);
  ok('D2b. the full save-promise is still made when it is true',
    /ინახება მხოლოდ აქ/.test(await page.locator('.privacy-card').innerText()));
  await page.screenshot({ path: `${SHOT_DIR}/nb32-healthy-parent.png`, fullPage:false });
  ok('D3. no page errors on the healthy path', errs.length === 0, errs[0] || '');
  await ctx.close();
}

await browser.close(); srv.close();
const failed = results.filter(r => !r.pass);
console.log(`\nNB-32 save-durability: ${results.length - failed.length}/${results.length} passed`);
console.log(`shots: ${SHOT_DIR}/nb32-save-warn.png · ${SHOT_DIR}/nb32-healthy-parent.png`);
if (failed.length) { console.log('FAILED: ' + failed.map(f => f.name).join(' · ')); process.exit(1); }
console.log('✅ kid progress cannot fail silently: detected, surfaced, recoverable.');
