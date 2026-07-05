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
  // record speak() calls + neutralise real audio
  await page.evaluate(()=>{
    window.__spoke=[];
    const _s=window.speak; window.speak=(t,l,o)=>{ window.__spoke.push(String(t)); };
    try{ window.speechSynthesis&&(window.speechSynthesis.speak=()=>{}); }catch{}
  });
  await page.evaluate((a)=>{ startDemo(a); }, age);
  await page.waitForTimeout(120);
}

// ---------- YOUNG (age 5) generator distribution ----------
console.log('===== YOUNG (age 5) generator (2000 samples/type) =====');
await launch(5);
const yg = await page.evaluate(()=>{
  const N=2000; let visN=0,visBadSum=0,visBadStruct=0, addN=0,addOver20=0, subN=0,subOver20=0;
  for(let i=0;i<N;i++){
    const q=genMath('math-add');
    if(q.vis){ visN++; if(q.a>10)visBadSum++; if(!/vsum-grp/.test(q.q)||!/vsum-plus/.test(q.q))visBadStruct++; }
    else { addN++; if(q.a1>20||q.a2>20)addOver20++; }
  }
  for(let i=0;i<N;i++){ const q=genMath('math-sub'); subN++; if(q.a1>20||q.a2>20)subOver20++; }
  // pattern (young): step ∈ {1,2,3}, every value ≤20, blank last
  let patN=0,patBadStep=0,patOver20=0,patBlankNotLast=0;
  for(let i=0;i<N;i++){
    const q=genMath('math-pat')||{}; // math-pat routes to the pattern branch? guard below
  }
  return {visN,visBadSum,visBadStruct,addN,addOver20,subN,subOver20};
});
console.log(`visual add: ${yg.visN}/2000 (~40% expected) | badSum>10: ${yg.visBadSum} | badStruct: ${yg.visBadStruct}`);
console.log(`abstract add: ${yg.addN} | operand>20: ${yg.addOver20}`);
console.log(`sub: ${yg.subN} | operand>20: ${yg.subOver20}`);
chk('visual add appears (25-55%)', yg.visN>500 && yg.visN<1100);
chk('every visual sum ≤10 (countable)', yg.visBadSum===0);
chk('visual q has vsum-grp + vsum-plus markup', yg.visBadStruct===0);
chk('abstract young add operands ≤20', yg.addOver20===0);
chk('young sub operands ≤20', yg.subOver20===0);

// pattern branch: genMath returns pat via the trailing block for ANY unmatched type; test via 'math-add'
// abstract path won't hit pattern, so sample the pattern generator directly through the pat block.
const yp = await page.evaluate(()=>{
  // the pattern block is the fallthrough — call with a type that skips add/sub/mul/div/miss
  const N=2000; let bad=0,over20=0,blankBad=0,steps={};
  for(let i=0;i<N;i++){
    const q=genMath('math-pat'); // no explicit branch → falls through to pattern block
    if(!q.pat){ bad++; continue; }
    steps[q.step]=(steps[q.step]||0)+1;
    if(q.seq.some(v=>v>20))over20++;
    if(q.blank!==4)blankBad++;
  }
  return {bad,over20,blankBad,steps};
});
console.log('pattern young steps seen:', JSON.stringify(yp.steps), '| value>20:', yp.over20, '| blank≠last:', yp.blankBad, '| non-pat:', yp.bad);
chk('young pattern all values ≤20', yp.over20===0);
chk('young pattern blank always last', yp.blankBad===0);
chk('young pattern uses steps {1,2,3}', Object.keys(yp.steps).sort().join(',')==='1,2,3');

// ---------- YOUNG render: force a visual question through nextMath ----------
console.log('\n===== YOUNG render (visual add via nextMath) =====');
const rend = await page.evaluate(()=>{
  // grab a real visual question
  let vq=null; for(let i=0;i<400;i++){ const q=genMath('math-add'); if(q.vis){vq=q;break;} }
  if(!vq) return {err:'no vis question generated'};
  game.mode='math-add'; game.i=0; game.qs=[vq]; game.cur=null; window.__spoke=[];
  nextMath();
  const vsum=document.querySelector('.prompt .vsum');
  const groups=document.querySelectorAll('.prompt .vsum .vsum-grp');
  const plus=document.querySelector('.prompt .vsum .vsum-plus');
  const emojis=document.querySelectorAll('.prompt .vsum .ve');
  const sub=document.querySelector('.prompt .p-sub');
  const harder=[...document.querySelectorAll('button')].find(b=>/გამირთულე|harder/i.test(b.textContent));
  const opts=[...document.querySelectorAll('.options .opt')];
  return {
    hasVsum:!!vsum, groupCount:groups.length, hasPlus:!!plus, emojiCount:emojis.length,
    subText:sub?sub.textContent.trim():null, harderShown:!!harder,
    optCount:opts.length, answer:vq.a, a1:vq.a1, a2:vq.a2, spoke:window.__spoke.slice()
  };
});
console.log(JSON.stringify(rend));
if(rend.err){ console.log('FAIL:',rend.err); FAILS++; }
else{
  chk('renders .vsum container', rend.hasVsum);
  chk('two emoji groups', rend.groupCount===2);
  chk('has plus sign', rend.hasPlus);
  chk('emoji count == a1+a2 (countable)', rend.emojiCount===(rend.a1+rend.a2));
  chk('sub prompt = "რამდენია სულ?"', rend.subText==='რამდენია სულ?');
  chk('harder button HIDDEN for young', rend.harderShown===false);
  chk('4 answer options', rend.optCount===4);
  chk('voiced "რამდენია?" on visual q', rend.spoke.some(t=>/რამდენია|how many/i.test(t)));
}
fs.mkdirSync('C:/Users/gela.shonia/niko-shot',{recursive:true});
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/math-young-vis.png', fullPage:true });

// ---------- READER (age 7) regression ----------
console.log('\n===== READER (age 7) regression =====');
await launch(7);
const rd = await page.evaluate(()=>{
  const N=2000; let vis=0,over=0;
  for(let i=0;i<N;i++){ const q=genMath('math-add'); if(q.vis)vis++; if(!q.vis&&q.a1>20)over++; }
  // render a normal question, harder button should show (level < max)
  let nq=null; for(let i=0;i<50;i++){ const q=genMath('math-add'); if(!q.vis){nq=q;break;} }
  game.mode='math-add'; game.i=0; game.qs=[nq]; game.cur=null;
  nextMath();
  const harder=[...document.querySelectorAll('button')].find(b=>/გამირთულე|harder/i.test(b.textContent));
  const vsum=document.querySelector('.prompt .vsum');
  return {vis,over,harderShown:!!harder,hasVsum:!!vsum};
});
console.log(JSON.stringify(rd));
chk('reader NEVER gets visual (young-only)', rd.vis===0);
chk('reader keeps numeric prompt (no .vsum)', rd.hasVsum===false);
chk('reader still has "harder" button', rd.harderShown===true);
await page.screenshot({ path:'C:/Users/gela.shonia/niko-shot/math-reader.png', fullPage:true });

await browser.close();
srv.close();
console.log(`\n${FAILS===0?'✅ ALL PASS':'❌ '+FAILS+' FAIL(S)'} — screenshots in C:/Users/gela.shonia/niko-shot/`);
process.exit(FAILS===0?0:1);
