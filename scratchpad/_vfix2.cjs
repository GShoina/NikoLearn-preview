const PW='C:/Users/gela.shonia/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright';
const SHELL='C:/Users/gela.shonia/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe';
const {chromium}=require(PW); const OUT='C:/Users/gela.shonia/Documents/NGT 2020-07/AI_Projects/NikoLand/scratchpad/shots'; require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{
  const b=await chromium.launch({headless:true,executablePath:SHELL});
  const ctx=await b.newContext({viewport:{width:390,height:780},deviceScaleFactor:2});
  await ctx.addInitScript(()=>{try{localStorage.setItem('niko_owner','1');}catch(e){}; window.__spk=0; try{const S=speechSynthesis;const o=S.speak.bind(S);S.speak=function(){window.__spk++;}}catch(e){}});
  const p=await ctx.newPage(); const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120));});
  await p.goto("http://localhost:8137/index.html?app=1&cb="+Date.now(),{waitUntil:'networkidle',timeout:40000});
  await p.evaluate(()=>{try{startDemo(6);if(typeof speak==='function'){const o=window.speak;window.speak=function(){window.__spk++;try{return o.apply(this,arguments)}catch(e){}}}}catch(e){}});
  // Bug6: shape prompt voiced
  const shapeSpk=await p.evaluate(()=>{window.__spk=0;try{if(window.game)game.roundActive=false;startGame('shapes');}catch(e){return {e:e.message}}return {spk:window.__spk};});
  await p.waitForTimeout(300);
  const shapeSpk2=await p.evaluate(()=>window.__spk);
  // Bug6 colour voiced
  const colSpk=await p.evaluate(()=>{window.__spk=0;try{if(window.game)game.roundActive=false;startGame('colour');}catch(e){return{e:e.message}}return{};});
  await p.waitForTimeout(300); const colSpk2=await p.evaluate(()=>window.__spk);
  // Bug5: firstrun win screen — render + screenshot
  await p.evaluate(()=>{try{firstRunWin('counting');}catch(e){window.__e5=e.message;}});
  await p.waitForTimeout(500);
  const winEls=await p.evaluate(()=>{
    const again=document.querySelector('.fr-again'); const ic=document.querySelector('.fr-again-ic'); const tap=document.querySelector('.fr-tap'); const done=document.querySelector('.fr-done');
    return {hasAgain:!!again, hasIcon:!!ic&&ic.textContent, hasTap:!!tap&&tap.textContent, pulse:again?again.classList.contains('pulse'):false, doneText:done?done.textContent.trim():''};
  });
  await p.screenshot({path:OUT+'/firstrun_win.png'});
  console.log('Bug6 shape voiced:', shapeSpk2>0, '(spk='+shapeSpk2+')');
  console.log('Bug6 colour voiced:', colSpk2>0, '(spk='+colSpk2+')');
  console.log('Bug5 win screen:', JSON.stringify(winEls));
  console.log('errs:', JSON.stringify([...new Set(errs)].slice(0,5)), 'e5:', await p.evaluate(()=>window.__e5||null));
  await b.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
