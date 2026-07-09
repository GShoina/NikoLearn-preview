// NB-21/NB-22 first-run pre-reader class fix: every task prompt is voiced (frPlay clip),
// ka-alpha shows the TARGET LETTER (not 🔤), English options speak on tap. §6c screenshot.
import { startStaticServer, launchBrowser, makeChk, SHOT_DIR } from './_harness.mjs';
const { port, close:closeServer } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:915} });
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,180)));
const { chk, fails } = makeChk();

await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
await page.evaluate(()=>{
  window.__fr=[]; window.frPlay=(n)=>window.__fr.push(String(n));   // record prompt voicing, no real audio
  window.__spoke=[]; window.speak=(t,l)=>window.__spoke.push(t+'|'+(l||''));
});
await page.evaluate(()=>{ startDemo(5); });
await page.waitForTimeout(150);

async function renderTask(subj){
  await page.evaluate(()=>{ window.__fr=[]; }, );
  await page.evaluate((s)=>firstRunTask(s,0), subj);
  await page.waitForTimeout(320);
  return page.evaluate(()=>({
    q: (document.querySelector('.fr-taskq')||{}).textContent||'',
    show: (document.querySelector('.fr-show')||{}).innerHTML||'',
    hasReplay: !!document.querySelector('.fr-replay'),
    bigLetter: !!document.querySelector('.fr-show .fr-bigletter'),
    voiced: window.__fr.slice(),
  }));
}

// ka-alpha: target letter shown + prompt voiced + replay button
const ka = await renderTask('ka-alpha');
chk('ka-alpha: prompt voiced on render (frPlay clip)', ka.voiced.some(c=>c.startsWith('fr_ta')), JSON.stringify(ka.voiced));
chk('ka-alpha: shows the TARGET LETTER flashcard (not 🔤)', ka.bigLetter && !ka.show.includes('🔤'), ka.show.slice(0,40));
chk('ka-alpha: has 🔊 replay button', ka.hasReplay);
await page.screenshot({ path: SHOT_DIR+'/fr_ka_alpha.png' });

// counting: prompt voiced (class fix covers it too)
const co = await renderTask('counting');
chk('counting: prompt voiced on render', co.voiced.some(c=>c.startsWith('fr_tc')), JSON.stringify(co.voiced));

// english: prompt voiced + tapping an option speaks the English word (en-US)
const en = await renderTask('english');
chk('english: prompt voiced on render', en.voiced.some(c=>c.startsWith('fr_te')), JSON.stringify(en.voiced));
await page.evaluate(()=>{ window.__spoke=[]; const b=document.querySelector('.fr-opt'); if(b) b.click(); });
await page.waitForTimeout(120);
const spoke = await page.evaluate(()=>window.__spoke.slice());
chk('english: option tap speaks the word in en-US', spoke.some(s=>s.endsWith('|en-US')), JSON.stringify(spoke));

chk('no pageerrors', errs.length===0, errs.join(' | '));
console.log('screenshot ->', SHOT_DIR+'/fr_ka_alpha.png');
await browser.close(); await closeServer();
process.exit(fails()?1:0);
