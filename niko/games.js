/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — games: engine, vocab, match, math, counting, kings, results
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════ GAME ENGINE ═══════════════ */
function wordPool(){
  if(game.cat&&WORDS[game.cat])return [...WORDS[game.cat]];
  let pool=[];catsFor(profile).forEach(c=>pool.push(...WORDS[c]));return pool;
}
function phrasePool(){
  if(game.pcat&&PHRASES[game.pcat])return [...PHRASES[game.pcat]];
  let pool=[];Object.values(PHRASES).forEach(a=>pool.push(...a));return pool;
}
function startGame(m){
  if(m==='topics'){return openTopics();}
  if(m==='phrases'){return openPhraseCats();}
  if(m==='compare')return cmpRound();
  if(m==='skip')return skipRound();
  if(m==='shapes')return shapeRound();
  if(m==='money')return moneyRound();
  if(m==='clock')return clockRound();
  game.mode=m;game.i=0;game.shields=0;game.wrong=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  if(m.startsWith('math-'))return mathRound(m);
  const pool=wordPool();
  game.qs=shuffle(pool).slice(0,8);
  if(m==='match')return matchRound();
  nextWord();
}
function gameShell(area){
  closeHint();
  const tot=game.qs?game.qs.length:8;
  render(`<div class="screen game" id="gscreen">
    <div class="progress-row">
      <button class="iconbtn" onclick="openMenu(game.subj)" style="width:40px;height:40px;font-size:1.1rem">←</button>
      <div class="bar"><i id="gbar" style="width:${(game.i/tot)*100}%"></i></div>
      ${voiceToggleBtn()}
      <span class="q-count" id="gcount">${Math.min(game.i+1,tot)}/${tot}</span>
    </div>
    <div class="game" id="garea">${area}</div>
  </div>`,false);
  syncAiFab();
}
function nextWord(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i],pool=wordPool();
  let opts=[q];while(opts.length<4){const r=pool[ri(0,pool.length-1)];if(!opts.find(o=>o.en===r.en))opts.push(r);}
  opts=shuffle(opts);
  let area;
  if(game.mode==='quiz'){
    area=`<div class="prompt" onclick="sayWord('${q.ka}','${q.en}')"><div class="p-emoji">${q.emoji}</div><div class="p-word">${q.ka}</div>
      <button class="speakbtn">${I.speaker} მოისმინე</button></div>
      <div class="options">${opts.map(o=>`<button class="opt en" onclick="speak('${o.en}','en-US');answer(this,'${o.en}','${q.en}')">${o.en}</button>`).join('')}</div>`;
  } else if(game.mode==='reverse'){
    speak(q.en);
    area=`<div class="prompt">
      <button class="speakbtn big" onclick="speak('${q.en}','en-US');spellOut(document.getElementById('spellrev'),'${q.en}')">${I.speaker} მოისმინე</button>
      <div class="spell-reveal en" id="spellrev"></div>
      <div class="p-sub">აირჩიე მნიშვნელობა</div></div>
      <div class="options">${opts.map(o=>`<button class="opt" onclick="answer(this,'${o.en}','${q.en}')">${o.ka}</button>`).join('')}</div>`;
  } else if(game.mode==='listen'){
    speak(q.en);
    area=`<div class="prompt" onclick="speak('${q.en}')"><div class="p-emoji">${I.speaker.replace('currentColor','var(--sky-d)')}</div><div class="p-sub">მოისმინე და აირჩიე</div></div>
      <div class="options">${opts.map(o=>`<button class="opt emoji" onclick="answer(this,'${o.en}','${q.en}')">${o.emoji}</button>`).join('')}</div>`;
  } else if(game.mode==='spell'){
    area=`<div class="prompt"><div class="p-emoji">${q.emoji}</div><div class="p-word">${q.ka}</div>
      <button class="speakbtn" onclick="speak('${q.en}')">${I.speaker} მოისმინე</button></div>
      <input class="spell-input en" id="sp" autocomplete="off" autocapitalize="off" placeholder="დაწერე…">
      <button class="btn btn-sky btn-block" onclick="checkSpell('${q.en}')">${I.check} შეამოწმე</button>`;
    setTimeout(()=>{const e=$('#sp');if(e){e.focus();e.onkeydown=ev=>{if(ev.key==='Enter')checkSpell(q.en);};}},80);
  }
  gameShell(area);
  if(game.mode==='reverse')spellOut($('#spellrev'),q.en);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answer(btn,sel,cor){
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.remove('dim');btn.classList.add('correct');
    record(cor,true);praise();feedback(true);
    setTimeout(()=>{game.i++;closeFeedback();advance();},1050);
  } else {
    btn.classList.add('wrong','dim');record(cor,false);
    setTimeout(()=>maybeOfferHelp(),350);
  }
}
function checkSpell(cor){
  const e=$('#sp'),v=(e?e.value:'').trim().toLowerCase();
  if(v===cor.toLowerCase()){record(cor,true);praise();feedback(true);setTimeout(()=>{game.i++;closeFeedback();advance();},1100);}
  else{record(cor,false);if(e){e.value='';e.style.borderColor='var(--red)';setTimeout(()=>e.style.borderColor='',500);e.focus();}maybeOfferHelp();}
}
function advance(){
  if(game.mode==='phrases')return nextPhrase();
  if(game.mode==='math-pat'||game.mode.startsWith('math-'))return nextMath();
  if(game.mode==='count')return nextCount();
  nextWord();
}

/* ── phrases ── hear a short everyday sentence, pick its meaning (with typewriter reveal) ── */
function startPhrases(cat){
  game.mode='phrases';game.pcat=cat||null;game.i=0;game.shields=0;game.wrong=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=shuffle(phrasePool()).slice(0,8);
  nextPhrase();
}
function nextPhrase(){
  if(game.i>=game.qs.length)return results();
  const pool=phrasePool(),q=game.qs[game.i];
  let opts=[q];while(opts.length<3){const r=pool[ri(0,pool.length-1)];if(!opts.find(o=>o.en===r.en))opts.push(r);}
  opts=shuffle(opts);
  speak(q.en);
  const safe=q.en.replace(/'/g,"\\'");
  const area=`<div class="prompt phrase-q">
      <button class="speakbtn big" onclick="speak('${safe}','en-US');spellOut(document.getElementById('phr'),'${safe}',{speed:55})">${I.speaker} მოისმინე</button>
      <div class="spell-reveal phrase en" id="phr"></div>
      <div class="p-sub">აირჩიე მნიშვნელობა</div>
    </div>
    <div class="options phrase-opts">${opts.map(o=>`<button class="opt" onclick="answerPhrase(this,'${o.en.replace(/'/g,"\\'")}','${safe}')">${o.ka}</button>`).join('')}</div>`;
  gameShell(area);
  spellOut($('#phr'),q.en,{speed:55});
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function recordPhrase(en,ok){
  const s=state[profile];if(!s.phrases)s.phrases={};if(!s.phrases[en])s.phrases[en]={correct:0,wrong:0};
  if(ok){s.phrases[en].correct++;game.shields++;s.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);}
  else{s.phrases[en].wrong++;game.wrong++;s.streak=0;}
  save();
}
function answerPhrase(btn,sel,cor){
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.remove('dim');btn.classList.add('correct');
    recordPhrase(cor,true);praise();feedback(true);
    setTimeout(()=>{game.i++;closeFeedback();nextPhrase();},1050);
  } else {
    btn.classList.add('wrong','dim');recordPhrase(cor,false);
    setTimeout(()=>maybeOfferHelp(),350);
  }
}

/* ── match ── two columns: Georgian ↔ English, tap one then its pair ── */
function matchRound(){
  const pool=shuffle(wordPool()).slice(0,5);game.pairs=pool;game.done=0;game.sel=null;
  const ka=shuffle(pool.map(w=>({t:w.ka,l:'ka',w:w.en})));
  const en=shuffle(pool.map(w=>({t:w.en,l:'en',w:w.en})));
  const col=arr=>arr.map(c=>`<div class="mtile ${c.l==='en'?'en':''}" data-w="${c.w}" data-l="${c.l}" onclick="matchTap(this)">${c.t}</div>`).join('');
  gameShell(`<div class="match-cols">
    <div class="match-col"><div class="match-head">🇬🇪 ქართული</div>${col(ka)}</div>
    <div class="match-col"><div class="match-head en">🇬🇧 ინგლისური</div>${col(en)}</div>
  </div>`);
  $('#gcount').textContent=`0/${pool.length}`;
}
function matchTap(el){
  if(el.classList.contains('done'))return;
  if(el.dataset.l==='en')speak(el.dataset.w);
  el.classList.add('sel');
  if(!game.sel){game.sel=el;return;}
  const a=game.sel;if(a===el){el.classList.remove('sel');game.sel=null;return;}
  if(a.dataset.w===el.dataset.w&&a.dataset.l!==el.dataset.l){
    [a,el].forEach(x=>{x.classList.remove('sel');x.classList.add('done');});
    game.done++;record(a.dataset.w,true);
    $('#gbar').style.width=(game.done/game.pairs.length*100)+'%';$('#gcount').textContent=`${game.done}/${game.pairs.length}`;
    if(game.done===game.pairs.length){game.shields=game.done;setTimeout(results,500);}
  } else {
    [a,el].forEach(x=>x.classList.add('bad'));record(a.dataset.w,false);
    setTimeout(()=>[a,el].forEach(x=>x.classList.remove('sel','bad')),420);
  }
  game.sel=null;
}

/* ── math ── graded levels + adaptive readiness ramp ──
   L1 starts easy (±20 = 1st grade); ramps up only when the child is ready,
   drops back if they struggle — so nobody gets blocked by numbers they don't know yet. */
const MATH_LV = {
  'math-add':[{max:20,label:'1–20'},{max:40,label:'1–40'},{max:70,label:'1–70'},{max:100,label:'1–100'}],
  'math-sub':[{max:20,label:'1–20'},{max:40,label:'1–40'},{max:70,label:'1–70'},{max:100,label:'1–100'}],
  'math-mul':[{tmax:5,label:'×2–×5'},{tmax:9,label:'×2–×9'}],
  'math-pat':[{span:2,label:''},{span:3,label:''}]
};
function mathLvl(type){
  const s=state[profile]; if(!s.mathLevel)s.mathLevel={};
  const max=(MATH_LV[type]||[{}]).length-1;
  return Math.max(0,Math.min(s.mathLevel[type]||0,max));
}
function mathRangeLabel(type){const lv=MATH_LV[type];return lv?(lv[mathLvl(type)].label||''):'';}
function rampMath(type,pct){
  const s=state[profile]; if(!s.mathLevel)s.mathLevel={}; if(!s.mathUp)s.mathUp={};
  const cur=mathLvl(type), max=(MATH_LV[type]||[{}]).length-1;
  game.leveledMath=null;
  // gentle progression: move up only after TWO strong rounds in a row (no sudden 1–20 → 1–100 jump);
  // step back quickly after a weak round so the test stays at the child's real level.
  if(pct>=85){
    s.mathUp[type]=(s.mathUp[type]||0)+1;
    if(s.mathUp[type]>=2 && cur<max){ s.mathLevel[type]=cur+1; s.mathUp[type]=0; game.leveledMath=(MATH_LV[type][cur+1].label||''); }
  } else {
    s.mathUp[type]=0;
    if(pct<50 && cur>0){ s.mathLevel[type]=cur-1; }
  }
  save();
}
function genMath(type){
  const young=isYoung(profile);
  const cfg=(MATH_LV[type]||[])[mathLvl(type)]||{};
  if(type==='math-add'){const mx=young?10:(cfg.max||20);const a=ri(1,Math.floor(mx*0.7)),b=ri(1,Math.max(1,mx-a));return{q:`${a} + ${b}`,a:a+b,op:'add',a1:a,a2:b};}
  if(type==='math-sub'){const mx=young?10:(cfg.max||20);const a=ri(2,mx),b=ri(1,a-1);return{q:`${a} − ${b}`,a:a-b,op:'sub',a1:a,a2:b};}
  if(type==='math-mul'){const tmax=young?3:(cfg.tmax||5);const t=ri(2,tmax),b=ri(1,10);return{q:`${t} × ${b}`,a:t*b,op:'mul',a1:t,a2:b};}
  // pattern
  const step=ri(1,young?2:(cfg.span||2)),s=ri(1,5),seq=[s];for(let i=1;i<4;i++)seq.push(seq[i-1]+step);return{q:seq.join(', ')+', ?',a:seq[3]+step,pat:true,op:'pat',seq:seq.slice(),step};
}
function mathOpts(ans){const set=new Set([ans]);while(set.size<4){const v=ans+ri(1,Math.max(3,Math.ceil(Math.abs(ans)*0.3)+1))*(Math.random()>.5?1:-1);if(v>=0)set.add(v);}return shuffle([...set]);}
function mathRound(m){game.mode=m;game.leveledMath=null;game.qs=Array.from({length:8},()=>genMath(m));game.i=0;game.shields=0;game.wrong=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextMath();}
function nextMath(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  gameShell(`<div class="prompt"><div class="p-word num" style="font-size:2.4rem;letter-spacing:2px">${q.q}</div>${q.pat?'<div class="p-sub">იპოვე კანონზომიერება</div>':''}</div>
    <div class="options">${mathOpts(q.a).map(o=>`<button class="opt num" onclick="answerMath(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerMath(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');
    mrec(true);praise();feedback(true);setTimeout(()=>{game.i++;closeFeedback();nextMath();},1000);}
  else{btn.classList.add('wrong','dim');mrec(false);setTimeout(maybeOfferHelp,350);}
}
function mrec(ok){const s=state[profile];if(ok){s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);if(!s.math[game.mode])s.math[game.mode]={correct:0,wrong:0};s.math[game.mode].correct++;}else{game.wrong++;s.streak=0;if(!s.math[game.mode])s.math[game.mode]={correct:0,wrong:0};s.math[game.mode].wrong++;}save();}

/* ════════ A: comparison (>/<), skip-counting (5s/10s), shapes ════════ */
/* ── comparison: a ? b → pick > < = ── */
function cmpRound(){game.mode='compare';game.qs=Array.from({length:8},()=>{const a=ri(1,20);let b=ri(1,20);if(Math.random()<0.25)b=a;return{a:a,b:b,ans:a>b?'>':(a<b?'<':'=')};});game.i=0;game.shields=0;game.wrong=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextCmp();}
function nextCmp(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  gameShell(`<div class="prompt"><div class="p-word num" style="font-size:2.6rem;letter-spacing:6px">${q.a} <span style="opacity:.35">?</span> ${q.b}</div><div class="p-sub">მეტი, ნაკლები თუ ტოლი?</div></div>
    <div class="options">${shuffle(['>','<','=']).map(o=>`<button class="opt num" style="font-size:2rem" onclick="answerCmp(this,'${o}','${q.ans}')">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerCmp(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);praise();feedback(true);setTimeout(()=>{game.i++;closeFeedback();nextCmp();},950);}
  else{btn.classList.add('wrong','dim');mrec(false);setTimeout(maybeOfferHelp,350);}
}
/* ── skip-counting by 5 or 10 ── */
function skipRound(){game.mode='skip';const step=Math.random()<0.5?5:10;game.qs=Array.from({length:8},()=>{const s0=step*ri(1,6);const seq=[s0,s0+step,s0+step*2,s0+step*3];return{seq:seq,step:step,a:s0+step*4};});game.i=0;game.shields=0;game.wrong=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextSkip();}
function nextSkip(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  gameShell(`<div class="prompt"><div class="p-word num" style="font-size:1.9rem;letter-spacing:1px">${q.seq.join(', ')}, ?</div><div class="p-sub">${q.step===5?'დაითვალე ხუთობით':'დაითვალე ათობით'}</div></div>
    <div class="options">${mathOpts(q.a).map(o=>`<button class="opt num" onclick="answerSkip(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerSkip(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);praise();feedback(true);setTimeout(()=>{game.i++;closeFeedback();nextSkip();},950);}
  else{btn.classList.add('wrong','dim');mrec(false);setTimeout(maybeOfferHelp,350);}
}
/* ── shapes: see a shape → pick its name (name shown in the UI language) ── */
function shapeRound(){game.mode='shapes';game.qs=shuffle(SHAPES).slice(0,Math.min(8,SHAPES.length));game.i=0;game.shields=0;game.wrong=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextShape();}
function nextShape(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  let opts=[q];const pool=SHAPES;while(opts.length<Math.min(4,pool.length)){const r=pool[ri(0,pool.length-1)];if(!opts.find(o=>o.en===r.en))opts.push(r);}opts=shuffle(opts);
  const en=(window.UILANG==='en');
  gameShell(`<div class="prompt"><div class="p-emoji" style="font-size:5rem">${q.e}</div><div class="p-sub">რა ფიგურაა?</div></div>
    <div class="options">${opts.map(o=>`<button class="opt" onclick="speak('${o.en}','en-US');answerShape(this,'${o.en}','${q.en}')">${en?o.en:o.ka}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerShape(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);praise();feedback(true);setTimeout(()=>{game.i++;closeFeedback();nextShape();},950);}
  else{btn.classList.add('wrong','dim');mrec(false);setTimeout(maybeOfferHelp,350);}
}

/* ── money: count coins (tetri) → total ── */
const COINS=[5,10,20,50];
function moneyRound(){game.mode='money';game.qs=Array.from({length:8},()=>{const n=ri(2,3);const coins=[];let total=0;for(let i=0;i<n;i++){const v=COINS[ri(0,COINS.length-1)];coins.push(v);total+=v;}return{coins:coins,total:total};});game.i=0;game.shields=0;game.wrong=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextMoney();}
function nextMoney(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const coins=q.coins.map(v=>`<span style="display:inline-flex;flex-direction:column;align-items:center;margin:2px 6px"><span style="font-size:2.6rem;line-height:1">🪙</span><b class="num" style="font-size:.95rem">${v}</b></span>`).join('');
  gameShell(`<div class="prompt"><div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end">${coins}</div><div class="p-sub">რამდენი თეთრია?</div></div>
    <div class="options">${mathOpts(q.total).map(o=>`<button class="opt num" onclick="answerMoney(this,${o},${q.total})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerMoney(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);praise();feedback(true);setTimeout(()=>{game.i++;closeFeedback();nextMoney();},950);}
  else{btn.classList.add('wrong','dim');mrec(false);setTimeout(maybeOfferHelp,350);}
}
/* ── clock: read an analog clock (o'clock / half past) ── */
const CLOCK_OCLOCK=['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
const CLOCK_HALF=['🕧','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦'];
function clockEmoji(h,half){const i=h%12;return half?CLOCK_HALF[i]:CLOCK_OCLOCK[i];}
function timeLabel(h,half){return h+':'+(half?'30':'00');}
function clockRound(){game.mode='clock';game.qs=Array.from({length:8},()=>{return{h:ri(1,12),half:Math.random()<0.5?1:0};});game.i=0;game.shields=0;game.wrong=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextClock();}
function nextClock(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const correct=timeLabel(q.h,q.half);
  const set=new Set([correct]);while(set.size<4){set.add(timeLabel(ri(1,12),Math.random()<0.5?1:0));}
  gameShell(`<div class="prompt"><div class="p-emoji" style="font-size:6rem">${clockEmoji(q.h,q.half)}</div><div class="p-sub">რომელ საათს უჩვენებს?</div></div>
    <div class="options">${shuffle([...set]).map(o=>`<button class="opt num" onclick="answerClock(this,'${o}','${correct}')">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerClock(btn,sel,cor){
  if(String(sel)===String(cor)){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);praise();feedback(true);setTimeout(()=>{game.i++;closeFeedback();nextClock();},950);}
  else{btn.classList.add('wrong','dim');mrec(false);setTimeout(maybeOfferHelp,350);}
}

/* ── counting (Masho, zero-text) ── */
function startCount(mode){game.mode='count';game.cmode=mode;game.qs=shuffle(COUNTING).slice(0,6);game.i=0;game.shields=0;game.wrong=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextCount();}
function nextCount(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i],opts=new Set([q.num]);while(opts.size<4)opts.add(ri(1,10));
  const prompt=`<div class="prompt count-prompt">
      <div class="count-q">რამდენია?</div>
      <div class="count-objects">${q.emoji}</div>
    </div>`;
  gameShell(`${prompt}<div class="options">${shuffle([...opts]).map(n=>`<button class="opt emoji num" onclick="answerCount(this,${n},${q.num})">${n}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
  try{speak(voiceLang(profile)==='en'?'how many?':'რამდენია?',vCode(profile));}catch(e){}
}
function answerCount(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');
    const s=state[profile];s.shields++;game.shields++;s.streak++;save();
    // F3/F4: say the NUMBER first, hold a beat, THEN praise + celebrate (never praise before the answer)
    sayThenPraise(numWord(cor,profile),vCode(profile),()=>{game.i++;closeFeedback();nextCount();});}
  else{btn.classList.add('wrong','dim');state[profile].streak=0;game.wrong++;save();
    // voice the chosen (wrong) number + gentle "try again" (chosen voicing language)
    try{speakSeq([{t:numWord(sel,profile),lang:vCode(profile)},{t:retryWord(profile),lang:vCode(profile)}]);}catch(e){}}
}

/* ── Kings tests ── */
function startKings(kind){
  game.kind=kind;game.shields=0;game.wrong=0;game.i=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=kind==='eng'?shuffle(KINGS_ENG).slice(0,10):shuffle(KINGS_MATH).slice(0,8);
  game.mode=kind==='eng'?'kings-eng':'kings-math';
  nextKings();
}
function nextKings(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];
  let body;
  if(game.kind==='eng'){
    const opts=shuffle(q.opts);
    body=`<div class="prompt">${q.emoji?`<div class="p-emoji" style="font-size:3rem">${q.emoji}</div>`:''}
      <div class="section-label">${TYPE_LABEL[q.type]}</div>
      <div class="p-word ${q.type==='translate'?'':'en'}" style="font-size:1.3rem">${q.q}</div></div>
      <div class="opt-list">${opts.map(o=>`<button class="opt en" onclick="speak('${o.replace(/'/g,"\\'")}');answerKings(this,'${o.replace(/'/g,"\\'")}','${q.a.replace(/'/g,"\\'")}')">${o}</button>`).join('')}</div>`;
  } else {
    const opts=shuffle(q.opts);
    body=`<div class="prompt"><div class="p-emoji" style="font-size:2rem">${q.emoji}</div><div style="font-size:1.08rem;line-height:1.5;margin-top:6px">${q.q}</div></div>
      <div class="options">${opts.map(o=>`<button class="opt ${q.text?'':'num'}" style="${q.text?'font-size:1.05rem':''}" onclick="answerKings(this,'${o}','${q.a}')">${o}</button>`).join('')}</div>`;
  }
  gameShell(body);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerKings(btn,sel,cor){
  if(String(sel)===String(cor)){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();praise();feedback(true);
    setTimeout(()=>{game.i++;closeFeedback();nextKings();},1050);}
  else{btn.classList.add('wrong','dim');state[profile].streak=0;game.wrong++;save();setTimeout(maybeOfferHelp,350);}
}

/* ── scoring ── */
function record(word,ok){
  const s=state[profile];if(!s.words[word])s.words[word]={correct:0,wrong:0};
  if(ok){s.words[word].correct++;game.shields++;s.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);}
  else{s.words[word].wrong++;game.wrong++;s.streak=0;}
  save();
  if(game.start&&Date.now()-game.start>15*60*1000){showBreak();game.start=Date.now();}
}

/* ── feedback overlay ── */
function feedback(ok){
  const el=document.createElement('div');el.className='overlay';el.id='fbov';
  el.innerHTML=`<div class="fb"><div class="fb-ico">${ok?'🎉':'💪'}</div><div class="fb-txt">${ok?'ყოჩაღ, '+voc()+'!':voc()+', კიდევ ცადე!'}</div></div>`;
  if(ok)el.appendChild(confettiEl());
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
}
function closeFeedback(){const e=$('#fbov');if(e)e.remove();}
// F4 (systemic): voice the ANSWER first, hold a beat so the child hears it, THEN praise + show
// the celebration. Prevents the "ყოჩაღ flashes before the answer is spoken" ordering bug.
function sayThenPraise(answerText,lang,after){
  try{if(answerText!=null&&answerText!=='')speak(String(answerText),lang||'ka-GE');}catch(e){}
  setTimeout(()=>{try{praise();}catch(e){}feedback(true);if(after)setTimeout(after,1100);},1100);
}
function confettiEl(){
  const c=document.createElement('div');c.className='confetti';
  const cols=['var(--primary)','var(--sun)','var(--green)','var(--sky)','var(--purple)'];
  for(let i=0;i<26;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=cols[i%cols.length];
    p.style.animationDuration=(0.9+Math.random()*0.8)+'s';p.style.animationDelay=(Math.random()*0.25)+'s';c.appendChild(p);}
  return c;
}

/* ═══════════════ RESULTS ═══════════════ */
function results(){
  const s=state[profile],lv=levelOf(profile);
  const tot=game.shields+game.wrong,pct=tot?Math.round(game.shields/tot*100):0;
  const best=s.best[game.mode]||0;if(game.shields>best)s.best[game.mode]=game.shields;
  s.sessions++;s.lastPlayed=new Date().toISOString();if(game.start)s.totalTime+=Date.now()-game.start;
  if((game.mode||'').startsWith('math-')&&!isYoung(profile))rampMath(game.mode,pct);
  save();
  let msg=pct>=90?voc()+', შესანიშნავია! 🌟':pct>=70?voc()+', კარგად მიდიხარ! 💪':pct>=50?voc()+', ისწავლე ახალი! 📚':voc()+', ყოველი ცდა = წინსვლა! 🌱';
  let beat='';
  if(best>0){if(game.shields>best)beat=`<div class="beat up">🎉 გაჯობე გუშინს! ${best} → ${game.shields}</div>`;
    else if(game.shields===best)beat=`<div class="beat same">🤝 გუშინდელი გაიმეორე: ${game.shields}</div>`;
    else beat=`<div class="beat down">💪 გუშინ ${best} გქონდა — ხვალ აჯობებ!</div>`;}
  if(game.leveledMath)beat=`<div class="beat up">🚀 ახალი დონე გაიხსნა: <b>${game.leveledMath}</b></div>`+beat;
  render(`<div class="screen results" style="--pct:${pct}%">
    <div class="r-ring"><i>${pct>=80?'🏆':pct>=50?'⭐':'🌱'}</i></div>
    <h2>${msg}</h2>
    <div class="stat-row">
      <div class="stat"><div class="v" style="color:var(--sun-d)">${game.shields}</div><div class="l">🪙 მონეტა</div></div>
      <div class="stat"><div class="v">${pct}%</div><div class="l">სიზუსტე</div></div>
      <div class="stat"><div class="v" style="color:var(--primary-d)">${s.streak}</div><div class="l">🔥 სერია</div></div>
    </div>
    ${beat}
    <div class="actions">
      <button class="btn btn-sun btn-block" onclick="showDad(${pct})">🎉 მამას &amp; დედას აჩვენე</button>
      <div class="btn-row">
        <button class="btn btn-ghost" onclick="openMenu(game.subj||'english')">📋 მენიუ</button>
        <button class="btn btn-primary" onclick="replay()">↻ ისევ</button>
      </div>
    </div>
  </div>`,'home');
  try{if(isYoung(profile))praise();}catch(e){}
  // level-up → "go show mom/dad" movement + bonding moment
  if(game.preLvl!=null){const now=levelIdx(profile);if(now>game.preLvl){const L=LEVELS[now];game.preLvl=now;setTimeout(()=>levelUpMoment(L.n,L.ic),750);}}
}
function replay(){
  const m=game.mode;
  if(m==='phrases')return startPhrases(game.pcat);
  if(m==='compare')return cmpRound();
  if(m==='skip')return skipRound();
  if(m==='shapes')return shapeRound();
  if(m==='money')return moneyRound();
  if(m==='clock')return clockRound();
  if(m==='kings-eng')return startKings('eng');
  if(m==='kings-math')return startKings('math');
  if(m==='count')return startCount(game.cmode);
  if(m==='digit')return startDigitQuiz();
  if(m&&m.startsWith('math-'))return mathRound(m);
  if(m==='ka-alpha'||m==='en-alpha')return alphaQuiz(m);
  startGame(m);
}
function logDad(text){
  const s=state[profile];if(!s.dadMessages)s.dadMessages=[];
  s.dadMessages.unshift({date:new Date().toLocaleString('ka-GE'),text:text||`${nameOf(profile)}მ ${game.shields} 🪙 მოაგროვა!`});
  if(s.dadMessages.length>20)s.dadMessages.pop();save();
}
function showDad(pct){
  logDad(`${nameOf(profile)}მ ${game.shields} 🪙 მოაგროვა (${pct}%)!`);
  const el=document.createElement('div');el.className='overlay';el.id='fbov';
  el.innerHTML=`<div class="fb"><div class="fb-ico">🎉</div><div class="fb-txt">${voc()}მ ${game.shields} 🪙 მოაგროვა!</div><div class="fb-sub">მშობელი დაინახავს მშობლის სივრცეში ❤️</div></div>`;
  el.appendChild(confettiEl());el.onclick=()=>el.remove();if(window.applyLang)applyLang(el);$('.device').appendChild(el);
  setTimeout(()=>{if($('#fbov'))$('#fbov').remove();},2600);
}
// LEVEL-UP: push the child off-screen, toward a parent
function levelUpMoment(lvlName,ic){
  logDad(`🏅 ${nameOf(profile)} ახალ დონეზე გავიდა: ${lvlName}!`);
  const el=document.createElement('div');el.className='breakscreen';el.id='lvlup';
  el.innerHTML=`<div class="b-ico">${ic||'🏅'}</div>
    <div class="b-txt">ახალი დონე!<br><b style="font-size:1.5rem">${lvlName}</b></div>
    <div class="b-act">ადექი და აჩვენე<br>დედას ან მამას 🤝</div>
    <button class="btn" onclick="document.getElementById('lvlup').remove()">ვაჩვენე! ❤️</button>`;
  el.appendChild(confettiEl());
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
  // voice the level-up for pre-readers (recorded ka clips: "ახალი დონე!" + level name + show mom/dad)
  try{speakSeq([{t:'ახალი დონე!',lang:'ka-GE'},{t:lvlName,lang:'ka-GE'},{t:'ადექი და აჩვენე დედას ან მამას',lang:'ka-GE'}]);}catch(e){praise();}
}

