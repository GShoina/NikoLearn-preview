// NB-10 behavioral gate: every Movement move NAME is voiced on render (owl.js mvRender)
// and resolves to a real manifest clip. §6c: also screenshots the break screen to LOOK at.
import { startStaticServer, launchBrowser, makeChk, SHOT_DIR } from './_harness.mjs';

const { port, close:closeServer } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:915} });
page.on('pageerror', e=>console.log('  [pageerror]', String(e).slice(0,200)));
const { chk, fails } = makeChk();

await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
// record every move-name voicing without producing real audio
await page.evaluate(()=>{
  window.__voiced=[];
  const orig = window.playClipFor;
  window.playClipFor = (t,cb)=>{ window.__voiced.push(String(t)); return false; };
  window.__origPCF = orig;
});
await page.evaluate(()=>{ startDemo(5); });
await page.waitForTimeout(150);

// open the Movement break and walk every move
const r = await page.evaluate(()=>{
  showBreak(true);
  const list = (typeof _mvList!=='undefined' ? _mvList : []).slice();
  const out=[];
  for(let i=0;i<list.length;i++){
    mvSelect(i);
    const name=(document.getElementById('mvName')||{}).textContent||'';
    const key=(name||'').trim().toLowerCase();
    out.push({ name, hasKey: !!(window.AUDIO_MANIFEST && window.AUDIO_MANIFEST[key]) });
  }
  return { out, voiced: window.__voiced.slice(), n:list.length };
});

console.log('moves rendered:', r.n);
console.log('voiced calls  :', r.voiced.length);
r.out.forEach(m=>console.log(`  ${m.hasKey?'OK ':'MISS'}  ${m.name}`));

chk('movement has moves', r.n===17, `got ${r.n}`);
chk('every move name resolves to a clip', r.out.every(m=>m.hasKey), 'some name has no manifest key');
chk('every move name is voiced on render', r.out.every(m=>r.voiced.includes(m.name)), `voiced ${r.voiced.length}/${r.n}`);
chk('no empty move name', r.out.every(m=>m.name.trim().length>0), 'empty mvName');

await page.screenshot({ path: SHOT_DIR + '/nb10_move_voice.png', fullPage:false });
console.log('screenshot -> ' + SHOT_DIR + '/nb10_move_voice.png');

await browser.close(); await closeServer();
process.exit(fails() ? 1 : 0);
