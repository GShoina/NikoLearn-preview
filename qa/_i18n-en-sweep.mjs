// NB-19 sweep: drive the app in ENGLISH through the main INTERFACE surfaces and dump every
// Georgian-containing VISIBLE text node still showing, per screen. This finds real interface gaps
// empirically (§14: run the app for UI classes) instead of guessing from noisy static literals.
// Teaching content will also appear — classify by hand; only interface chrome gets mapped.
import { startStaticServer, launchBrowser, SHOT_DIR } from './_harness.mjs';

const { port, close:closeServer } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:915} });
page.on('pageerror', e=>console.log('  [pageerror]', String(e).slice(0,160)));

await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
await page.evaluate(()=>{ try{ window.speechSynthesis&&(window.speechSynthesis.speak=()=>{}); }catch{} window.playClipSeq=()=>true; });
await page.evaluate(()=>{ window.setUILang && window.setUILang('en'); });

const collectKa = ()=>page.evaluate(()=>{
  const ka=/[Ⴀ-ჿ]/;
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  const out=new Set(); let n;
  while((n=w.nextNode())){
    const v=(n.nodeValue||'').trim();
    if(!v||!ka.test(v))continue;
    const el=n.parentElement;
    if(!el)continue;
    const r=el.getBoundingClientRect();
    if(r.width===0&&r.height===0)continue;             // skip hidden
    out.add(v.replace(/\s+/g,' ').slice(0,80));
  }
  return [...out];
});

async function screen(name, setup){
  try{ await page.evaluate(setup); }catch(e){ console.log('  ('+name+' setup err '+String(e).slice(0,80)+')'); }
  await page.waitForTimeout(350);
  await page.evaluate(()=>{ window.UILANG==='en' && window.applyLang && window.applyLang(document.body); }); // re-apply after re-render
  await page.waitForTimeout(120);
  const ka = await collectKa();
  await page.screenshot({ path: `${SHOT_DIR}/i18n-en-${name}.png`, fullPage:true });
  console.log(`\n===== ${name} — Georgian still visible (${ka.length}) =====`);
  console.log(ka.map(s=>'  '+s).join('\n'));
}

await screen('home', ()=>{ startDemo(6); });
await screen('menu-math', ()=>{ openMenu('math'); });
await screen('menu-kaalpha', ()=>{ openMenu('ka-alpha'); });
await screen('round-math', ()=>{ startGame('math'); });

await browser.close();
closeServer();
console.log('\nscreens in '+SHOT_DIR);
process.exit(0);
