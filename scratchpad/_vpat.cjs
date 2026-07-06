const PW='C:/Users/gela.shonia/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright';
const SHELL='C:/Users/gela.shonia/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe';
const {chromium}=require(PW);
(async()=>{
  const b=await chromium.launch({headless:true,executablePath:SHELL});
  const p=await b.newContext({viewport:{width:390,height:780}}).then(c=>c.newPage());
  const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120));});
  await p.goto("http://localhost:8137/index.html?app=1&cb="+Date.now(),{waitUntil:'networkidle',timeout:40000});
  const r=await p.evaluate(()=>{
    // make a 5yo the active profile
    startDemo(5);
    const out={maxVal:0, maxStep:0, samples:[], badBig:0};
    for(let k=0;k<40;k++){
      const q=genMath('math-pat'); const vals=q.seq;
      const mx=Math.max(...vals); if(mx>out.maxVal)out.maxVal=mx;
      const st=Math.abs(vals[1]-vals[0]); if(st>out.maxStep)out.maxStep=st;
      if(mx>10)out.badBig++;
      if(k<6)out.samples.push(q.q);
    }
    // genPattern (kings) young
    let gpMax=0,gpBad=0,gpSamp=[];
    for(let k=0;k<20;k++){const q=genPattern(1);const nums=q.q.split(',').map(s=>parseInt(s)).filter(n=>!isNaN(n));const mx=Math.max(...nums);if(mx>gpMax)gpMax=mx;if(mx>10)gpBad++;if(k<4)gpSamp.push(q.q);}
    return {out, gpMax, gpBad, gpSamp, age:kidObj(profile).age};
  });
  console.log('active age:', r.age, '(expect 5, young)');
  console.log('math-pat: maxVal='+r.out.maxVal+' (≤10?), maxStep='+r.out.maxStep+' (≤2?), values>10 count='+r.out.badBig+' (expect 0)');
  console.log('  samples:', JSON.stringify(r.out.samples));
  console.log('genPattern(kings): maxVal='+r.gpMax+', values>10='+r.gpBad+' (expect 0), samples:',JSON.stringify(r.gpSamp));
  console.log('errs:', JSON.stringify([...new Set(errs)].slice(0,4)));
  await b.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1);});
