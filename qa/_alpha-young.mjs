// NB-16 pre-reader gate harness: a ≤5 profile must never be ROUTED into a mode that assumes reading.
// Gated for young: წინადადება (sentLearn) · გაგება (startTextQuiz) · შეადგინე სიტყვა (startShead) +
// the english path/resume routing. Kept for young: learn/quiz/კითხვა/ააწყვე/ამოწერა (audio-scaffolded).
import { startStaticServer, launchBrowser, makeChk } from './_harness.mjs';

const { port, close:closeServer } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:915} });
page.on('pageerror', e=>console.log('  [pageerror]', String(e).slice(0,200)));

const { chk, fails } = makeChk();

async function launch(age){
  await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
  await page.evaluate(()=>{
    window.speak=()=>{}; window.playClipSeq=()=>true;
    try{ window.speechSynthesis&&(window.speechSynthesis.speak=()=>{}); }catch{}
  });
  await page.evaluate((a)=>{ startDemo(a); }, age);
  await page.waitForTimeout(120);
}
// which game-launchers the rendered menu offers (from onclick attrs)
const menuLaunchers = (subj)=>page.evaluate((subj)=>{
  openMenu(subj);
  return [...document.querySelectorAll('.mode-grid .mode')].map(m=>m.getAttribute('onclick')||'');
}, subj);
const has=(arr,fn)=>arr.some(s=>s.indexOf(fn)>=0);

// ═══════════ YOUNG (age 5) ═══════════
console.log('===== YOUNG (age 5) =====');
await launch(5);
const yka = await menuLaunchers('ka-alpha');
console.log('ka-alpha tiles:', JSON.stringify(yka));
chk('young ka-alpha: NO წინადადება (sentLearn)', !has(yka,'sentLearn'));
chk('young ka-alpha: NO გაგება (startTextQuiz)', !has(yka,'startTextQuiz'));
chk('young ka-alpha: NO შეადგინე სიტყვა (startShead)', !has(yka,'startShead'));
chk('young ka-alpha: KEEPS ისწავლე + ტესტები', has(yka,'alphaLearn')&&has(yka,'alphaQuiz'));
chk('young ka-alpha: KEEPS კითხვა + ააწყვე + ამოწერა', has(yka,'readLearn')&&has(yka,'startBuild')&&has(yka,'traceLearn'));
chk('young ka-alpha: exactly 5 tiles', yka.length===5);
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/alpha-young-ka-menu.png', fullPage:true });
const yen = await menuLaunchers('en-alpha');
chk('young en-alpha: NO startShead', !has(yen,'startShead'));
chk('young en-alpha: KEEPS learn + quiz (2 tiles)', has(yen,'alphaLearn')&&has(yen,'alphaQuiz')&&yen.length===2);
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/alpha-young-en-menu.png', fullPage:true });
const ypath = await page.evaluate(()=>({
  eng: pathFor(profile,'english').length,
  math: pathFor(profile,'math').map(m=>m.k),
  ka: pathFor(profile,'ka-alpha').map(m=>m.k),
  tp: totalProgress(profile),
  resume: homeResume(profile).subj
}));
console.log('young paths:', JSON.stringify(ypath));
chk('young english path EMPTY', ypath.eng===0);
chk('young math path = add/sub/shapes', ypath.math.join(',')==='add,sub,shapes');
chk('young ka path keeps read/build/write', ypath.ka.join(',')==='letters,read,build,write');
chk('young ჯამური პროგრესი counts 7 milestones (3 math + 4 ka)', ypath.tp.total===7);
chk('young resume card NEVER points at english', ypath.resume!=='english');
const yhome = await page.evaluate(()=>{ selectProfile(profile); const hc=document.querySelector('.home-cont'); return hc?(hc.getAttribute('onclick')||''):''; });
chk('young home continue-card not english', yhome.indexOf("'english'")<0);
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/alpha-young-home.png', fullPage:true });

// ═══════════ TINY (age 4) ═══════════
console.log('\n===== TINY (age 4) =====');
await launch(4);
const tpath = await page.evaluate(()=>({ math: pathFor(profile,'math').map(m=>m.k), eng: pathFor(profile,'english').length, resume: homeResume(profile).subj }));
console.log('tiny paths:', JSON.stringify(tpath));
chk('tiny math path = shapes only', tpath.math.join(',')==='shapes');
chk('tiny english path EMPTY', tpath.eng===0);
chk('tiny resume card NEVER points at english', tpath.resume!=='english');

// ═══════════ READER (age 7) regression ═══════════
console.log('\n===== READER (age 7) regression =====');
await launch(7);
const rka = await menuLaunchers('ka-alpha');
chk('reader ka-alpha KEEPS წინადადება + გაგება + შეადგინე', has(rka,'sentLearn')&&has(rka,'startTextQuiz')&&has(rka,'startShead'));
chk('reader ka-alpha full 8 tiles', rka.length===8);
const ren = await menuLaunchers('en-alpha');
chk('reader en-alpha KEEPS startShead', has(ren,'startShead'));
const rpath = await page.evaluate(()=>({ eng: pathFor(profile,'english').length, tp: totalProgress(profile) }));
chk('reader english path intact (5 milestones)', rpath.eng===5);
chk('reader ჯამური პროგრესი counts 14 milestones', rpath.tp.total===14);
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/alpha-reader-ka-menu.png', fullPage:true });

await browser.close();
closeServer();
const F=fails();
console.log(`\n${F===0?'✅ ALL PASS':'❌ '+F+' FAIL(S)'} — screenshots in C:/Users/gela.shonia/niko-shot/`);
process.exit(F===0?0:1);
