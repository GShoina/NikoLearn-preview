import { chromium } from 'file:///C:/Users/gela.shonia/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/gela.shonia/Documents/NGT 2020-07/AI_Projects/NikoLand';
const MIME = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
const srv = http.createServer((req,res)=>{
  let u = decodeURIComponent(req.url.split('?')[0]); if(u==='/')u='/index.html';
  fs.readFile(path.join(ROOT,u),(e,d)=>{ if(e){res.writeHead(404);res.end('x');return;} res.writeHead(200,{'content-type':MIME[path.extname(u)]||'application/octet-stream'}); res.end(d); });
});
await new Promise(r=>srv.listen(0,r));
const port = srv.address().port;

const browser = await chromium.launch({ executablePath:'C:/Users/gela.shonia/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe' });
const page = await browser.newPage({ viewport:{width:412,height:915} });
page.on('pageerror', e=>console.log('  [pageerror]', String(e).slice(0,200)));

let FAILS=0; const chk=(name,ok)=>{ console.log(`ASSERT ${name}:`, ok?'PASS':'FAIL'); if(!ok)FAILS++; };

async function launch(age){
  await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
  // record speak() + playClipSeq() calls (NB-17 abstract voicing goes through playClipSeq), neutralise real audio
  await page.evaluate(()=>{
    window.__spoke=[]; window.__seq=[];
    window.speak=(t)=>{ window.__spoke.push(String(t)); };
    window.speakSeq=(parts)=>{ window.__seq.push((parts||[]).map(p=>p.t)); };
    window.playClipSeq=(texts)=>{ window.__seq.push((texts||[]).slice()); return true; };
    try{ window.speechSynthesis&&(window.speechSynthesis.speak=()=>{}); }catch{}
  });
  await page.evaluate((a)=>{ startDemo(a); }, age);
  await page.waitForTimeout(120);
}

// ═══════════ YOUNG (age 5) generator distribution ═══════════
console.log('===== YOUNG (age 5) generator (2000 samples/type) =====');
await launch(5);
const yg = await page.evaluate(()=>{
  const N=2000; let visN=0,visBadSum=0,visBadStruct=0, addN=0,addOver20=0;
  let subVis=0,subVisBadA=0,subVisGoneBad=0,subVisAnsBad=0, subAbs=0,subAbsOver20=0;
  for(let i=0;i<N;i++){
    const q=genMath('math-add');
    if(q.vis){ visN++; if(q.a>10)visBadSum++; if(!/vsum-grp/.test(q.q)||!/vsum-plus/.test(q.q))visBadStruct++; }
    else { addN++; if(q.a1>20||q.a2>20)addOver20++; }
  }
  for(let i=0;i<N;i++){
    const q=genMath('math-sub');
    if(q.vsub){
      subVis++;
      if(q.a1>7)subVisBadA++;
      const gone=(q.q.match(/vsub-gone/g)||[]).length;   // faded/struck emoji = the b taken away
      const total=(q.q.match(/class="ve/g)||[]).length;    // all emoji
      if(gone!==q.a2)subVisGoneBad++;
      if((total-gone)!==q.a)subVisAnsBad++;                // remaining == answer
    } else { subAbs++; if(q.a1>20||q.a2>20)subAbsOver20++; }
  }
  return {visN,visBadSum,visBadStruct,addN,addOver20,subVis,subVisBadA,subVisGoneBad,subVisAnsBad,subAbs,subAbsOver20};
});
console.log(`add: visual ${yg.visN} (badSum ${yg.visBadSum}, badStruct ${yg.visBadStruct}) | abstract ${yg.addN} (op>20 ${yg.addOver20})`);
console.log(`sub: visual take-away ${yg.subVis} (a>7 ${yg.subVisBadA}, gone!=b ${yg.subVisGoneBad}, remain!=ans ${yg.subVisAnsBad}) | abstract ${yg.subAbs} (op>20 ${yg.subAbsOver20})`);
chk('visual add appears (25-55%)', yg.visN>500 && yg.visN<1100);
chk('every visual add sum ≤10', yg.visBadSum===0);
chk('visual add markup ok', yg.visBadStruct===0);
chk('abstract young add operands ≤20', yg.addOver20===0);
chk('visual take-away sub appears (25-55%)', yg.subVis>500 && yg.subVis<1100);
chk('take-away sub a ≤7 (countable)', yg.subVisBadA===0);
chk('take-away sub gone-count == b', yg.subVisGoneBad===0);
chk('take-away sub remaining == answer', yg.subVisAnsBad===0);
chk('abstract young sub operands ≤20', yg.subAbsOver20===0);

// pattern young (unchanged behaviour regression)
const yp = await page.evaluate(()=>{
  const N=1500; let over20=0,blankBad=0,steps={};
  for(let i=0;i<N;i++){ const q=genMath('math-pat'); if(!q.pat)continue; steps[q.step]=(steps[q.step]||0)+1; if(q.seq.some(v=>v>20))over20++; if(q.blank!==4)blankBad++; }
  return {over20,blankBad,steps};
});
chk('young pattern values ≤20 + blank last + steps{1,2,3}', yp.over20===0 && yp.blankBad===0 && Object.keys(yp.steps).sort().join(',')==='1,2,3');

// ═══════════ YOUNG render + voicing ═══════════
console.log('\n===== YOUNG render + voicing =====');
const forceRender = (kind)=>page.evaluate((kind)=>{
  const pick=(t,test)=>{ for(let i=0;i<600;i++){ const q=genMath(t); if(test(q))return q; } return null; };
  let q;
  if(kind==='vis')  q=pick('math-add',q=>q.vis);
  if(kind==='vsub') q=pick('math-sub',q=>q.vsub);
  if(kind==='addAbs') q=pick('math-add',q=>!q.vis && q.op==='add');
  if(kind==='subAbs') q=pick('math-sub',q=>!q.vsub && q.op==='sub');
  if(!q) return {err:'no '+kind};
  game.mode=(kind==='vsub'||kind==='subAbs')?'math-sub':'math-add'; game.i=0; game.qs=[q]; game.cur=null;
  window.__spoke=[]; window.__seq=[];
  nextMath();
  const M=window.AUDIO_MANIFEST||{};
  const covered=(arr)=>arr.every(t=>!!M[String(t).toLowerCase().trim()]);
  return {
    q, spoke:window.__spoke.slice(), seq:window.__seq.slice(),
    hasVsum:!!document.querySelector('.prompt .vsum'),
    gone:document.querySelectorAll('.prompt .vsum .ve.vsub-gone').length,
    emojiTotal:document.querySelectorAll('.prompt .vsum .ve').length,
    subText:(document.querySelector('.prompt .p-sub')||{}).textContent||null,
    opts:[...document.querySelectorAll('.options .opt')].map(o=>o.textContent.trim()),
    seqCovered: window.__seq.length? window.__seq.every(covered):true
  };
}, kind);

const vis=await forceRender('vis');
console.log('vis:',JSON.stringify(vis.spoke),vis.subText);
chk('vis renders .vsum + "რამდენია სულ?"', vis.hasVsum && vis.subText==='რამდენია სულ?');
chk('vis voiced "რამდენია?"', vis.spoke.some(t=>/რამდენია\?/.test(t)));

const vsub=await forceRender('vsub');
console.log('vsub:',JSON.stringify(vsub),'\n');
chk('vsub renders .vsum + "რამდენი დარჩა?"', vsub.hasVsum && vsub.subText==='რამდენი დარჩა?');
chk('vsub struck-count == b', vsub.gone===vsub.q.a2);
chk('vsub remaining (total-gone) == answer', (vsub.emojiTotal-vsub.gone)===vsub.q.a);
chk('vsub voiced "რამდენი დარჩა?"', vsub.spoke.some(t=>/რამდენი დარჩა\?/.test(t)));
chk('vsub answer is among options', vsub.opts.includes(String(vsub.q.a)));

const addAbs=await forceRender('addAbs');
console.log('addAbs seq:',JSON.stringify(addAbs.seq));
chk('abstract add voiced via playClipSeq', addAbs.seq.length===1);
chk('abstract add seq = [a1,"და",a2,"რამდენია?"]', JSON.stringify(addAbs.seq[0])===JSON.stringify([String(addAbs.q.a1),'და',String(addAbs.q.a2),'რამდენია?']));
chk('abstract add seq clips all in manifest', addAbs.seqCovered);

const subAbs=await forceRender('subAbs');
console.log('subAbs seq:',JSON.stringify(subAbs.seq));
const DAT=['','ერთს','ორს','სამს','ოთხს','ხუთს','ექვსს','შვიდს','რვას','ცხრას','ათს','თერთმეტს','თორმეტს','ცამეტს','თოთხმეტს','თხუთმეტს','თექვსმეტს','ჩვიდმეტს','თვრამეტს','ცხრამეტს','ოცს'];
chk('abstract sub voiced via playClipSeq', subAbs.seq.length===1);
chk('abstract sub seq = [dative(a1),"გამოვაკლოთ",a2,"რამდენია?"]', JSON.stringify(subAbs.seq[0])===JSON.stringify([DAT[subAbs.q.a1],'გამოვაკლოთ',String(subAbs.q.a2),'რამდენია?']));
chk('abstract sub seq clips all in manifest (dative recorded)', subAbs.seqCovered);

fs.mkdirSync('C:/Users/gela.shonia/niko-shot',{recursive:true});
await forceRender('vsub');
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/math-young-vsub.png', fullPage:true });

// ═══════════ READER (age 7) regression ═══════════
console.log('\n===== READER (age 7) regression =====');
await launch(7);
const rd = await page.evaluate(()=>{
  const N=2000; let vis=0,vsub=0;
  for(let i=0;i<N;i++){ if(genMath('math-add').vis)vis++; if(genMath('math-sub').vsub)vsub++; }
  // render a normal abstract add → must be SILENT (reader reads) + no .vsum + harder button present
  let nq=null; for(let i=0;i<50;i++){ const q=genMath('math-add'); if(!q.vis){nq=q;break;} }
  game.mode='math-add'; game.i=0; game.qs=[nq]; game.cur=null; window.__spoke=[]; window.__seq=[];
  nextMath();
  const harder=[...document.querySelectorAll('button')].some(b=>/გამირთულე|harder/i.test(b.textContent));
  return {vis,vsub,harder,hasVsum:!!document.querySelector('.prompt .vsum'),spoke:window.__spoke.length,seq:window.__seq.length};
});
console.log(JSON.stringify(rd));
chk('reader NEVER gets visual add', rd.vis===0);
chk('reader NEVER gets visual take-away sub', rd.vsub===0);
chk('reader abstract math stays SILENT', rd.spoke===0 && rd.seq===0);
chk('reader keeps numeric prompt (no .vsum)', rd.hasVsum===false);
chk('reader still has "harder" button', rd.harder===true);
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/math-reader.png', fullPage:true });

await browser.close();
srv.close();
console.log(`\n${FAILS===0?'✅ ALL PASS':'❌ '+FAILS+' FAIL(S)'} — screenshots in C:/Users/gela.shonia/niko-shot/`);
process.exit(FAILS===0?0:1);
