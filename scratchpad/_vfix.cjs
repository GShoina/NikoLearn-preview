const PW='C:/Users/gela.shonia/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright';
const SHELL='C:/Users/gela.shonia/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe';
const {chromium}=require(PW);
(async()=>{
  const b=await chromium.launch({headless:true,executablePath:SHELL});
  const ctx=await b.newContext({viewport:{width:390,height:780}});
  await ctx.addInitScript(()=>{try{localStorage.setItem('niko_owner','1');}catch(e){}; try{speechSynthesis.speak=()=>{}}catch(e){}; try{HTMLAudioElement.prototype.play=()=>Promise.resolve()}catch(e){}});
  const p=await ctx.newPage();
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120));});
  await p.goto("http://localhost:8137/index.html?app=1&cb="+Date.now(),{waitUntil:'networkidle',timeout:40000});
  await p.evaluate(()=>{try{startDemo(5);}catch(e){}}); // 5yo guest
  // ---- Bug1: firstrun now 3 tasks ----
  await p.evaluate(()=>{ try{ firstRunStart(window.profile||'guest'); }catch(e){window.__e1=e.message;} });
  await p.waitForTimeout(200);
  await p.evaluate(()=>{ try{ frPick('counting'); }catch(e){window.__e2=e.message;} });
  await p.waitForTimeout(1100); // "let's go" → firstRunTask
  const steps=[];
  for(let n=0;n<4;n++){
    const st=await p.evaluate(()=>{
      const step=document.querySelector('.fr-task .fr-pop'); // the "i / total" line
      const q=document.querySelector('.fr-taskq'); const win=document.querySelector('.fr-winscr');
      if(win) return {win:true};
      const stepTxt=[...document.querySelectorAll('.fr-task .fr-pop')].map(e=>e.textContent.trim()).find(t=>/\d\s*\/\s*\d/.test(t))||'';
      // click correct fr-opt: onclick frAnswer(this,'sel','ans',subj,idx) → correct sel===ans
      const opts=[...document.querySelectorAll('.fr-opt')];
      let clicked=null;
      for(const o of opts){const m=(o.getAttribute('onclick')||'').match(/frAnswer\(this,'([^']*)','([^']*)'/); if(m&&m[1]===m[2]){o.click();clicked=m[1];break;}}
      return {step:stepTxt, q:(q?q.textContent.trim():''), clicked};
    });
    steps.push(st); if(st.win)break; await p.waitForTimeout(800);
  }
  // ---- CLASS A: counting celebration = winStep (child-paced, has .fb-next) ----
  await p.evaluate(()=>{try{ if(window.game)game.roundActive=false; startCount('pick'); }catch(e){window.__e3=e.message;}});
  await p.waitForTimeout(400);
  const celA=await p.evaluate(async()=>{
    // click the correct counting option
    const opts=[...document.querySelectorAll('.opt')]; let cor=null;
    for(const o of opts){const m=(o.getAttribute('onclick')||'').match(/answerCount\(this,(\d+),(\d+)\)/); if(m&&m[1]===m[2]){o.click();cor=m[1];break;}}
    return {clickedCorrect:cor};
  });
  await p.waitForTimeout(1500); // within old 2.2s cutoff window
  const overlay=await p.evaluate(()=>{
    const ov=document.querySelector('#fbov'); const next=document.querySelector('#fbov .fb-next');
    const gi=window.game?game.i:'?';
    return {fbovPresent:!!ov, hasNextButton:!!next, gi};
  });
  console.log('=== Bug1 firstrun (expect 1/3 → 2/3 → 3/3 → win) ===');
  steps.forEach((s,i)=>console.log(` t${i}:`, JSON.stringify(s)));
  console.log('=== CLASS A counting celebration (expect fbov + .fb-next, NOT auto-advanced) ===');
  console.log(' clicked:',celA.clickedCorrect,'| at ~1.5s:',JSON.stringify(overlay),'(hasNextButton=true & still on same q = child-paced ✓)');
  console.log('=== errors ===', JSON.stringify([...new Set(errs)].slice(0,5)), 'e:',await p.evaluate(()=>[window.__e1,window.__e2,window.__e3].filter(Boolean)));
  await b.close();
})().catch(e=>{console.error('FATAL',e.message,e.stack);process.exit(1);});
