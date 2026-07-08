import fs from 'node:fs';
import { startStaticServer, launchBrowser, makeChk } from './_harness.mjs';

const { port, close:closeServer } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:915} });
page.on('pageerror', e=>console.log('  [pageerror]', String(e).slice(0,200)));

const { chk, fails } = makeChk();

async function launch(age){
  await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
  await page.evaluate(()=>{ try{ window.speechSynthesis&&(window.speechSynthesis.speak=()=>{}); }catch{} });
  await page.evaluate((a)=>{ startDemo(a); }, age);      // guest profile of given age
  await page.waitForTimeout(150);
  await page.evaluate(()=>{ startGame('shapes'); });     // launch shapes round
  await page.waitForTimeout(450);
}

function readShapes(){
  return page.evaluate(()=>{
    const opts=[...document.querySelectorAll('.options .opt')];
    const speak=document.querySelector('.prompt .speakbtn');
    const hint=document.querySelector('.prompt .finger-hint');
    const sub=document.querySelector('.prompt .p-sub');
    return {
      optCount:opts.length,
      optClasses:opts.map(o=>o.className),
      optText:opts.map(o=>o.textContent.trim()),
      onclicks:opts.map(o=>o.getAttribute('onclick')||''),
      hasSpeak:!!speak, hasHint:!!hint,
      subText:sub?sub.textContent.trim():null
    };
  });
}

// ---------- YOUNG (age 5, pre-reader) ----------
console.log('===== YOUNG (age 5) =====');
await launch(5);
const y = await readShapes();
console.log('prompt sub:', y.subText);
console.log('speaker btn:', y.hasSpeak, ' finger hint:', y.hasHint);
console.log('opt count:', y.optCount);
console.log('opt classes:', y.optClasses.join(' | '));
console.log('opt text (should be EMOJI pictures):', y.optText.join('  '));

const allPic = y.optClasses.length>0 && y.optClasses.every(c=>c.includes('shape-pic'));
const noWords = y.optText.length>0 && y.optText.every(t=>t.length>0 && !/[ა-ჰ]/.test(t) && !/[a-z]/i.test(t));
chk('shape-pic on all opts', allPic);
chk('options are pictures (no words)', noWords);
chk('speaker + finger hint present', (y.hasSpeak&&y.hasHint));

fs.mkdirSync('C:/Users/gela.shonia/niko-shot',{recursive:true});
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/shapes-young.png', fullPage:true });

// find correct option: onclick = answerShape(this,'<sel>','<cor>') → correct where sel===cor
let corIdx=-1;
y.onclicks.forEach((oc,i)=>{ const m=oc.match(/answerShape\(this,'([^']*)','([^']*)'\)/); if(m&&m[1]===m[2])corIdx=i; });
console.log('correct option index:', corIdx, corIdx>=0?('('+y.optText[corIdx]+')'):'');
if(corIdx>=0){
  await page.evaluate((i)=>{ document.querySelectorAll('.options .opt')[i].click(); }, corIdx);
  await page.waitForTimeout(250);
  const marked = await page.evaluate(()=>!!document.querySelector('.opt.correct'));
  chk('correct tap marks .correct', marked);
  await page.waitForTimeout(7000); // celebration + advance to next question
  const advanced = await page.evaluate(()=>{
    const sub=document.querySelector('.prompt .p-sub'); const opts=document.querySelectorAll('.options .opt');
    return { gcount:(document.querySelector('#gcount')||{}).textContent, stillShapes:!!(sub&&opts.length) };
  });
  console.log('after celebration -> gcount:', advanced.gcount, ' still in shapes flow:', advanced.stillShapes?'PASS':'(round ended/results)');
}
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/shapes-young-after.png', fullPage:true });

// ---------- READER (age 7) regression: keep NAME-picking ----------
console.log('\n===== READER (age 7) regression =====');
await launch(7);
const r = await readShapes();
console.log('opt text:', r.optText.join('  '));
console.log('opt classes:', r.optClasses.join(' | '));
const readerWords = r.optText.some(t=>/[ა-ჰ]/.test(t));
const noPic = r.optClasses.every(c=>!c.includes('shape-pic'));
chk('reader gets NAME options (ka words)', readerWords);
chk('reader has NO shape-pic', noPic);
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/shapes-reader.png', fullPage:true });

await browser.close();
closeServer();
const F=fails();
console.log(`\n${F===0?'✅ ALL PASS':'❌ '+F+' FAIL(S)'} — screenshots in C:/Users/gela.shonia/niko-shot/`);
process.exit(F===0?0:1);
