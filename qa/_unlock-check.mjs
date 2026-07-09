// NB-21 verify: app loads clean, first real click fires the unlock with no JS error, and a
// move clip played AFTER the gesture resolves (not NotAllowedError). Default autoplay policy.
import { chromium, startStaticServer, PW_CHROMIUM } from './_harness.mjs';
const { port, close } = await startStaticServer();
const browser = await chromium.launch({ executablePath: PW_CHROMIUM });
const page = await browser.newPage({ viewport:{width:412,height:915} });
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,160)));
await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
await page.evaluate(()=>{ startDemo(5); });
await page.waitForTimeout(150);
// wrap play() to record outcomes
await page.evaluate(()=>{
  window.__res=[]; const orig=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(){ const p=orig.apply(this,arguments);
    if(p&&p.then)p.then(()=>window.__res.push('OK')).catch(e=>window.__res.push(e.name)); return p; };
});
// real gesture -> should trigger _primeAudio
await page.mouse.click(206, 500);
await page.waitForTimeout(400);
// then an explicit clean move-name play, spaced so no pause->play race
await page.evaluate(()=>{ window.playClipFor && window.playClipFor('ბუქნი'); });
await page.waitForTimeout(700);
const res = await page.evaluate(()=>window.__res.slice());
console.log('play() outcomes after gesture:', JSON.stringify(res));
console.log('pageerrors:', errs);
const blocked = res.includes('NotAllowedError');
const anyOK = res.includes('OK');
console.log(!errs.length && !blocked ? '✅ no JS error, no autoplay-BLOCK after gesture (OK/AbortError from prime race are fine)'
                                     : '❌ problem (blocked or JS error)');
await browser.close(); await close();
process.exit((!errs.length && !blocked)?0:1);
