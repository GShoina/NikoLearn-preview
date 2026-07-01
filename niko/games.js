/* ═══════════════════════════════════════════════════════════
   NIKO LEARN: games: engine, vocab, match, math, counting, kings, results
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
/* ── Color Words (owner 2026-06-26): "What colour is it?" — a single UNAMBIGUOUS single-colour
   object (or a colour swatch where no clear object exists), pick the English colour word.
   Deliberately avoids two-colour items (watermelon slice) + purple-looking "blue" (blueberry). ── */
const COLOR_WORDS=[
  {emoji:'🍎',en:'red',ka:'წითელი'},   {emoji:'🍌',en:'yellow',ka:'ყვითელი'},
  {emoji:'🍊',en:'orange',ka:'ნარინჯისფერი'},{emoji:'🍇',en:'purple',ka:'იისფერი'},
  {emoji:'🌳',en:'green',ka:'მწვანე'}, {emoji:'🐻',en:'brown',ka:'ყავისფერი'},
  {emoji:'🌸',en:'pink',ka:'ვარდისფერი'},{emoji:'🐘',en:'grey',ka:'ნაცრისფერი'},
  {emoji:'🔵',en:'blue',ka:'ლურჯი'},   {emoji:'⚫',en:'black',ka:'შავი'}
  // 'white' dropped: ⚪ renders as a pale lavender sphere on some platforms = ambiguous. Re-add
  // with a proper illustrated white object once the AI-art coloring/illustration set exists (roadmap).
];
function colourRound(){
  game.mode='colour';game.subj='english';
  game.qs=shuffle(COLOR_WORDS).slice(0,8);
  game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  nextWord();
}
function startGame(m){
  if(m==='topics'){return openTopics();}
  if(m==='phrases'){return openPhraseCats();}
  if(m==='compare')return cmpRound();
  if(m==='skip')return skipRound();
  if(m==='shapes')return shapeRound();
  if(m==='money')return moneyRound();
  if(m==='clock')return clockRound();
  if(m==='cal')return calRound();
  if(m==='math-word')return wordRound();
  if(m==='math-pic')return picRound();
  if(m==='listen-yle')return listenYleRound();
  if(m==='yesno')return yesNoRound();
  if(m==='story')return storyRound();
  if(m==='speak')return speakYleRound();
  if(m==='engram'||m==='addlet')return kxPracticeRound(m); // grammar + add-a-letter, ported into regular English
  if(m==='pattern')return patternRound();
  if(REASON_STRANDS[m])return reasonRound(m);
  if(m==='exam')return examRoom();
  if(m==='colour')return colourRound();
  game.mode=m;game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  if(m.startsWith('math-'))return mathRound(m);
  const pool=wordPool();
  game.qs=shuffle(pool).slice(0,8);
  if(m==='match')return matchRound();
  nextWord();
}
// A4 telemetry: map the specific game.mode → the worker's coarse subject enum.
function coarseMode(m){
  m=m||game.mode||'';
  if(m==='listen-yle'||m==='yesno'||m==='story'||m==='speak'||m==='pattern'||m==='rebus'||m==='model'||m==='triangle'||m==='exam')return 'kings'; // Kings strands
  if(m==='count'||m==='counting'||m==='digit')return 'counting';
  if(m==='kings-eng'||m==='kings-math')return 'kings';
  if(m==='ka-alpha'||m==='en-alpha'||m==='shead')return 'alphabet';
  if(m==='read'||m==='sent'||m==='build'||m==='trace'||m==='rtext')return 'reading'; // Georgian reading suite
  if(m.indexOf('math')===0||['compare','skip','shapes','money','clock','cal'].indexOf(m)>=0)return 'math';
  return 'english'; // quiz/reverse/listen/match/spell/phrases
}
// fired (fire-and-forget) when a child leaves a round before finishing it
function abandonRound(){
  clearCeleb(); if(typeof closeFeedback==='function')closeFeedback(); // CE-2: cancel pending win-celebration timers so they can't drag the child back into the round
  if(typeof clearIdleHelp==='function')clearIdleHelp();
  if(game.roundActive){ try{ if(window.Analytics) Analytics.event('round_abandon',{mode:coarseMode(),q:(game.i>=8?'8+':String(game.i||0))}); }catch(e){} game.roundActive=false; }
  openMenu(game.subj||'math');
}
const SUBMODES=['quiz','reverse','listen','listen-yle','yesno','story','speak','engram','addlet','pattern','rebus','model','triangle','exam','match','spell','phrases','math-add','math-sub','math-mul','math-div','math-miss','math-pat','math-word','math-pic','compare','skip','shapes','money','clock','cal','count','kings-eng','kings-math','ka-alpha','en-alpha','read','sent','build','rtext','digit','shead','colour'];
// First-round activation easing (2026-06-16). Telemetry showed ~60% of rounds abandoned, worst on a
// brand-new child's first tries. A new child's first few rounds are SHORTER so they reach the "round
// complete" reward fast (an early win is what hooks a young learner); re-queue growth is also capped
// tighter for them so a struggling beginner's finish line can't keep moving away. Back to full 8 once
// the habit is formed. BEGINNER_ROUNDS = completed rounds (s.sessions) still treated as a beginner.
const BEGINNER_ROUNDS=3, BEGINNER_LEN=5, BEGINNER_REQUEUE=4;
function isBeginner(){ try{ return ((state[profile]&&state[profile].sessions)||0) < BEGINNER_ROUNDS; }catch(e){ return false; } }
function reqCap(){ return game.beginnerRound ? BEGINNER_REQUEUE : 14; }
function gameShell(area){
  closeHint();
  game.roundActive=true; // marks an in-progress round (cleared by results()/abandonRound())
  // A3: report the sub-mode once per round (first question only); anonymous, fire-and-forget
  if(game.i===0 && window.Analytics && SUBMODES.indexOf(game.mode)>=0){ try{ Analytics.event('submode_usage',{mode:game.mode}); }catch(e){} }
  // beginner easing: decide once at the first question, then trim this round to a shorter length.
  if(game.i===0){ game.beginnerRound=isBeginner(); if(game.beginnerRound && game.qs && game.qs.length>BEGINNER_LEN) game.qs=game.qs.slice(0,BEGINNER_LEN); }
  const tot=game.qs?game.qs.length:8;
  render(`<div class="screen game" id="gscreen">
    <div class="progress-row">
      <button class="iconbtn" onclick="abandonRound()" style="width:44px;height:44px;font-size:1.1rem">&lt;</button>
      <div class="bar"><i id="gbar" style="width:${(game.i/tot)*100}%"></i></div>
      ${voiceToggleBtn()}
      <span class="q-count" id="gcount">${Math.min(game.i+1,tot)}/${tot}</span>
    </div>
    <div class="game" id="garea">${area}</div>
  </div>`,'slim');
  syncAiFab();
  if(typeof armIdleHelp==='function')armIdleHelp();   // owl watches for a stuck child this question
}
function nextWord(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i],pool=(game.mode==='colour'?COLOR_WORDS:wordPool());
  // dedup distractors by what the child actually SEES in this mode (emoji in listen, ka in reverse,
  // en otherwise) so two visually-identical options can never appear and mis-score a correct tap.
  const disp=game.mode==='listen'?(o=>o.emoji):game.mode==='reverse'?(o=>o.ka):(o=>o.en);
  let opts=[q],_g=0;while(opts.length<4&&_g++<300){const r=pool[ri(0,pool.length-1)];if(!opts.find(o=>o.en===r.en||disp(o)===disp(r)))opts.push(r);}
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
    // listen mode: a BIG, obviously-tappable speaker button (was a small 🔊 icon — owner 2026-06-13:
    // „the listen button is tiny, fix it everywhere"). The whole card stays tappable too = generous target.
    area=`<div class="prompt listen-prompt" onclick="speak('${q.en}')"><button class="listen-cta" onclick="event.stopPropagation();speak('${q.en}')">${I.speaker}</button><div class="p-sub">მოისმინე და აირჩიე</div></div>
      <div class="options">${opts.map(o=>`<button class="opt emoji" onclick="answer(this,'${o.en}','${q.en}')">${o.emoji}</button>`).join('')}</div>`;
  } else if(game.mode==='spell'){
    area=`<div class="prompt"><div class="p-emoji">${q.emoji}</div><div class="p-word">${q.ka}</div>
      <button class="speakbtn" onclick="speak('${q.en}')">${I.speaker} მოისმინე</button></div>
      <input class="spell-input en" id="sp" autocomplete="off" autocapitalize="off" placeholder="დაწერე…">
      <button class="btn btn-sky btn-block" onclick="checkSpell('${q.en}')">${I.check} შეამოწმე</button>`;
    setTimeout(()=>{const e=$('#sp');if(e){e.focus();e.onkeydown=ev=>{if(ev.key==='Enter')checkSpell(q.en);};}},80);
  } else if(game.mode==='colour'){
    area=`<div class="prompt"><div class="p-emoji">${q.emoji}</div><div class="p-sub">${window.UILANG==='en'?'What colour is it?':'რა ფერია?'}</div></div>
      <div class="options">${opts.map(o=>`<button class="opt en" onclick="speak('${o.en}','en-US');answer(this,'${o.en}','${q.en}')">${o.en}</button>`).join('')}</div>`;
  }
  gameShell(area);
  if(game.mode==='reverse')spellOut($('#spellrev'),q.en);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
// after a correct answer: VOICE the answer first, hold a beat, THEN show the praise screen.
// bigger pause so a small child hears the answer before "ბრავო/ყოჩაღ" pops (owner request).
// 2.4 age-tuned rhythm: 8+ kids get a snappier celebration; any tap on the 🎉 overlay skips to next.
let _celebTimers=[], _celebGo=null;
function clearCeleb(){ _celebTimers.forEach(clearTimeout); _celebTimers=[]; }
function skipCeleb(){ if(_celebGo){ const g=_celebGo; _celebGo=null; clearCeleb(); g(); } }
// A (owner 2026-07-01): after a correct answer the celebration used to auto-advance in 1.4–2.5s —
// too fast for a small child to absorb the win before the next question appears. Now the CHILD sets
// the pace: praise shows, a big „შემდეგი →" button appears, and we auto-advance only on a long safety
// fallback so an unattended child is never stuck. Tapping anywhere on the overlay still advances.
function addNextCue(){
  const ov=document.getElementById('fbov'); if(!ov)return;
  const card=ov.querySelector('.fb'); if(!card||card.querySelector('.fb-next'))return;
  const b=document.createElement('button');
  b.className='fb-next';
  b.textContent=(window.UILANG==='en')?'Next →':'შემდეგი →';
  b.onclick=function(ev){ ev.stopPropagation(); try{skipCeleb();}catch(e){} };
  card.appendChild(b);
}
function winStep(say,lang,next){
  if(say){ try{ speak(String(say), lang||'en-US'); }catch(e){} }
  const big=(typeof isBig==='function'&&isBig(profile));
  const a=big?650:1200;                 // when the praise + celebration appears
  const fallback=big?5200:6500;         // safety auto-advance if the child never taps „შემდეგი"
  clearCeleb();
  _celebGo=()=>{ _celebGo=null; clearCeleb(); closeFeedback(); if(next) next(); };
  _celebTimers.push(setTimeout(()=>{ try{praise();}catch(e){} feedback(true); addNextCue(); }, a));
  _celebTimers.push(setTimeout(()=>{ if(_celebGo) _celebGo(); }, fallback));
}
function answer(btn,sel,cor){
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.remove('dim');btn.classList.add('correct');
    record(cor,true);winStep(cor,'en-US',()=>{game.i++;advance();});
  } else {
    btn.classList.add('wrong','dim');record(cor,false);
    reQueueWrong(cor,'en-US');
  }
}
function checkSpell(cor){
  const e=$('#sp'),v=(e?e.value:'').trim().toLowerCase();
  if(v===cor.toLowerCase()){record(cor,true);winStep(cor,'en-US',()=>{game.i++;advance();});}
  else{
    record(cor,false);
    // 2.1: reveal the correct spelling + voice it, then re-queue the word to the end (no guess-through)
    const q=game.qs[game.i];
    if(!game.missMap)game.missMap=new Map();
    const n=(game.missMap.get(q)||0)+1; game.missMap.set(q,n);
    if(e){ e.value=cor; e.disabled=true; e.style.borderColor='var(--green)'; }
    try{speak(cor,'en-US');}catch(x){}
    if(n>=2) setTimeout(maybeOfferHelp,650);
    game.requeues=game.requeues||0; if(game.requeues<reqCap()){game.qs.push(q);game.requeues++;}
    setTimeout(()=>{game.i++;advance();}, n>=2?1700:1400);
  }
}
function advance(){
  if(game.mode==='phrases')return nextPhrase();
  if(game.mode==='math-pat'||game.mode.startsWith('math-'))return nextMath();
  if(game.mode==='count')return nextCount();
  nextWord();
}
/* ═══════════════ Phase 2.1 — answer-loop: re-queue + 2nd-mistake auto-hint ═══════════════ */
// which "draw next question" function belongs to the current mode (so re-queue redraws correctly).
function nextForMode(){
  const m=game.mode||'';
  if(m==='compare')return nextCmp;
  if(m==='skip')return nextSkip;
  if(m==='shapes')return nextShape;
  if(m==='money')return nextMoney;
  if(m==='clock')return nextClock;
  if(m==='cal')return nextCal;
  if(m==='count')return nextCount;
  if(m==='phrases')return nextPhrase;
  if(m==='kings-eng'||m==='kings-math')return nextKings;
  if(m==='math-word')return nextWordQ;
  if(m==='math-pic')return nextPic;
  if(m.startsWith('math-'))return nextMath;
  return nextWord;
}
// A wrong item is shown + voiced, then RE-QUEUED to the END of the round, so a round can never be
// finished by guessing. The SECOND miss on the SAME item auto-opens the tutor hint. Miss counts live
// in a round-local Map keyed by the question object (never mutate the shared WORD/SHAPE data). Caller
// has already recorded the wrong answer + added .wrong/.dim to the tapped button.
//   lang: voice code for revealCorrect, null = reveal silently, false = skip reveal (e.g. phrases
//   whose options are labelled in Georgian so the English answer can't be matched in the DOM).
function reQueueWrong(cor,lang,nextFn){
  const q=game.qs[game.i];
  if(!game.missMap)game.missMap=new Map();
  const n=(game.missMap.get(q)||0)+1; game.missMap.set(q,n);
  // TUTORING (owner ask 2026-06-13): on the 1st miss do NOT reveal the answer and do NOT advance.
  // Encourage the child to THINK and try again on the SAME question (only the tapped wrong option
  // is blocked). The answer is revealed only on the 2nd miss, so nobody gets stuck.
  if(n<2){
    document.querySelectorAll('.opt.wrong').forEach(b=>{b.style.pointerEvents='none';b.classList.add('dim');});
    try{ feedback(false); }catch(e){}
    setTimeout(()=>{ try{closeFeedback();}catch(e){} },1100);
    return;
  }
  // 2nd+ miss: lock the options, reveal the correct one, RE-QUEUE the item, then TEACH the child and
  // wait for them to CONFIRM understanding before advancing. (owner 2026-06-13: the old 1.7s auto-advance
  // was far too fast — a 5–7 yo couldn't absorb what the right answer even was. teachAndConfirm shows the
  // solution slowly, step by step, then a „გაიგე?" gate, so the child controls the pace = real tutoring.)
  document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim');b.style.pointerEvents='none';});
  // B (owner 2026-07-01): do NOT reveal the answer yet. The owl first encourages + teaches the mistake
  // inside teachAndConfirm, and only THEN reveals the correct answer (was: reveal-first = "show + move on").
  game.requeues=game.requeues||0;
  if(game.requeues<reqCap()){ game.qs.push(q); game.requeues++; }  // capped so the round always terminates (tighter for beginners)
  const advance=()=>{ game.i++; (nextFn||nextForMode())(); };
  setTimeout(()=>{ try{closeFeedback();}catch(e){} teachAndConfirm(cor,lang,advance); }, 600);
}

// ── Comprehension gate (owner-locked 2026-06-13) — slow teaching reveal after the 2nd miss ──
// Shows the SOLUTION at the child's pace: for arithmetic the full solved equation revealed step by step
// (e.g. 5 + 6 = … then 11 pops in), for everything else the correct answer with its picture. Then a
// „გაიგე?" gate: ✓ კი advances, ✗ არა drops to a CONCRETE visual explanation (counted dots / groups) and
// only a single „გასაგებია" button. Advancing happens ONLY on a tap, never on a timer.
function solveLine(q,cor,m){
  const A=String(cor);
  if(m.startsWith('math-') && q && q.q){
    const expr=String(q.q);
    if(expr.indexOf('?')>=0){
      return {html:`<div class="eqline">${expr.replace('?',`<span class="te-ans" id="teAns">?</span>`)}</div>`, answer:A};
    }
    return {html:`<div class="eqline">${expr} <span class="te-eq">=</span> <span class="te-ans" id="teAns">?</span></div>`, answer:A};
  }
  const emo=q&&(q.e||q.emoji)?`<div class="te-emoji">${q.e||q.emoji}</div>`:'';
  return {html:`${emo}<div class="eqline"><span class="te-ans solo" id="teAns">?</span></div>`, answer:A};
}
function _teDots(n,cls){let s='';for(let i=0;i<n;i++)s+=`<span class="td ${cls}">●</span>`;return `<span class="dg">${s}</span>`;}
function teachAndConfirm(cor,lang,advanceFn){
  const q=game.cur||(game.qs&&game.qs[game.i]);
  const m=game.mode||'';
  const en=(window.UILANG==='en');
  const sol=solveLine(q,cor,m);
  // B (owner 2026-07-01): owl ENCOURAGES → TEACHES the concept → THEN reveals the answer → „გაიგე?" gate.
  // Order matters: never reveal-and-move-on. For language modes the lesson comes from Tutor.build().explain
  // (math keeps its own step-by-step equation, so we skip the redundant text there).
  const encourage= en?'It is okay. Let us look at it together 💛':'არა უშავს. მოდი ერთად ვნახოთ 💛';
  let lesson='';
  if(!m.startsWith('math-')){ try{ const t=Tutor.build({subject:gameSubject(),q,mode:m,profile,aiRole:aiRole()}); lesson=(t&&t.explain)||''; }catch(e){} }
  let ov=document.getElementById('teachov'); if(ov)ov.remove();
  ov=document.createElement('div'); ov.className='overlay teach-ov'; ov.id='teachov';
  ov.innerHTML=`<div class="teach-card">
    <div class="teach-owl">${tutorFace(profile,'2.7rem')}</div>
    <div class="teach-say">${encourage}</div>
    ${lesson?`<div class="teach-lesson">${lesson}</div>`:''}
    <div class="teach-eq" id="teachEq" style="opacity:0">${sol.html}</div>
    <div class="teach-q" id="teachQ" style="opacity:0">${en?'Got it?':'გაიგე?'}</div>
    <div class="teach-btns" id="teachBtns" style="opacity:0">
      <button class="teach-yes" id="teachYes">${en?'✓ Yes':'✓ კი'}</button>
      <button class="teach-no" id="teachNo">${en?'✗ No':'✗ არა'}</button>
    </div>
  </div>`;
  $('.device').appendChild(ov);
  // language modes hold the lesson longer before the reveal so the child actually reads it first.
  const beat = m.startsWith('math-')?800:1500;
  setTimeout(()=>{ const eq=ov.querySelector('#teachEq'); if(eq)eq.style.opacity='1'; }, beat);
  // reveal the answer: pop it in the card, mark the correct option in the grid underneath, and voice it.
  setTimeout(()=>{ const a=ov.querySelector('#teAns'); if(a){a.textContent=sol.answer;a.classList.add('pop');} if(lang!==false){ try{revealCorrect(cor,lang||null);}catch(e){} } if(lang&&typeof speak==='function'){try{speak(sol.answer,lang);}catch(e){}} }, beat+500);
  setTimeout(()=>{ const qd=ov.querySelector('#teachQ'),bd=ov.querySelector('#teachBtns'); if(qd)qd.style.opacity='1'; if(bd)bd.style.opacity='1'; }, beat+1400);
  ov.querySelector('#teachYes').onclick=()=>{ ov.remove(); advanceFn(); };
  ov.querySelector('#teachNo').onclick=()=>teachMore(q,cor,m,advanceFn);
}
function teachMore(q,cor,m,advanceFn){
  const ov=document.getElementById('teachov'); if(!ov)return;
  const card=ov.querySelector('.teach-card'); if(!card)return;
  const a1=q&&q.a1, a2=q&&q.a2;
  const en=(window.UILANG==='en');
  const solved=(m.startsWith('math-')&&q&&q.q)?(q.q.indexOf('?')>=0?q.q.replace('?',cor):`${q.q} = ${cor}`):String(cor);
  let visual='';
  if(m==='math-add' && a1!=null && a2!=null && (a1+a2)<=24){
    visual=`<div class="teach-dots">${_teDots(a1,'g1')}<span class="te-plus">+</span>${_teDots(a2,'g2')}</div>
      <div class="teach-count">${en?'Count them all together':'ყველა დავთვალოთ ერთად'}: <b>${a1+a2}</b></div>`;
  } else if(m==='math-sub' && a1!=null && a2!=null && a1<=24){
    let d=''; for(let i=0;i<a1;i++) d+=`<span class="td ${i<a1-a2?'g1':'x'}">●</span>`;
    visual=`<div class="teach-dots"><span class="dg">${d}</span></div>
      <div class="teach-count">${en?'Left after crossing out':'გადახაზულის შემდეგ დარჩა'}: <b>${a1-a2}</b></div>`;
  } else if(m==='math-mul' && a1!=null && a2!=null && (a1*a2)<=24){
    visual=`<div class="teach-rows">${Array.from({length:a2},()=>`<div class="te-row">${_teDots(a1,'g1')}</div>`).join('')}</div>
      <div class="teach-count">${en?`${a2} groups of ${a1}`:`${a2} ჯგუფი, თითო ${a1}`}: <b>${a1*a2}</b></div>`;
  } else {
    let explain=''; try{ const t=Tutor.build({subject:gameSubject(),q,mode:m,profile,aiRole:aiRole()}); explain=t.explain||''; }catch(e){}
    visual=`<div class="teach-explain">${explain}</div>`;
  }
  card.innerHTML=`<div class="teach-owl">${tutorFace(profile,'2.7rem')}</div>
    <div class="teach-eq small"><div class="eqline">${solved}</div></div>
    ${visual}
    <div class="teach-btns"><button class="teach-yes" id="teachYes2">${window.UILANG==='en'?'✓ Got it':'✓ გასაგებია'}</button></div>`;
  card.querySelector('#teachYes2').onclick=()=>{ ov.remove(); advanceFn(); };
}

/* ═══════════════ Phase 2.2 — weighted review ("🔁 გაიმეორე") ═══════════════
   Pure addition: resurfaces the words a child has gotten WRONG, weakest-first
   (priority = wrong/(correct+1)), through the existing quiz engine. Touches no
   existing flow — startReview just seeds game.qs with weak words and reuses
   nextWord()/answer() (incl. the 2.1 re-queue), so a weak word always returns. */
function allWordObjs(){ const m={}; for(const c in WORDS){ for(const w of WORDS[c]){ m[w.en]=w; } } return m; }
function weakWords(){
  const s=state[profile]; if(!s||!s.words) return [];
  const lut=allWordObjs();
  return Object.keys(s.words).map(function(en){
    const r=s.words[en]||{}; const wrong=r.wrong||0, correct=r.correct||0;
    return { obj:lut[en], pr:wrong/(correct+1), correct:correct };
  }).filter(function(x){ return x.obj && x.pr>0; })
    .sort(function(a,b){ return (b.pr-a.pr) || (a.correct-b.correct); })
    .map(function(x){ return x.obj; });
}
// 2.2b: words whose Leitner due-date has passed (spaced resurfacing across days, mastered or not)
function dueWords(p){
  p=p||profile; const s=state[p]; if(!s||!s.words) return [];
  const lut=allWordObjs(); const now=Date.now();
  return Object.keys(s.words).map(function(en){ return { obj:lut[en], due:s.words[en].due||0 }; })
    .filter(function(x){ return x.obj && x.due && x.due<=now; })
    .sort(function(a,b){ return a.due-b.due; })
    .map(function(x){ return x.obj; });
}
function startRefresh(){
  const due=dueWords();
  if(!due.length) return refreshEmpty();
  game.mode='quiz'; game.cat=null; game.pcat=null; game.subj='english';
  game.i=0; game.shields=0; game.wrong=0; game.missMap=new Map(); game.requeues=0;
  game.start=Date.now(); game.preLvl=levelIdx(profile);
  if(window.Analytics)Analytics.screen('subject/english');
  game.qs=due.slice(0,8);
  nextWord();
}
function refreshEmpty(){
  render(`<div class="screen" style="justify-content:center;text-align:center;gap:14px;padding:24px">
    <div style="font-size:3.6rem">🔄</div>
    <h2>დღეს ყველაფერი გაიმეორე!</h2>
    <p style="color:var(--muted);max-width:300px;line-height:1.5">ხვალ ისევ მოდი და ნიკო დაგელოდება.</p>
    <button class="btn btn-primary btn-block" style="max-width:300px" onclick="openMenu('english')">${I.check} კარგი</button>
  </div>`,false);
}
function startReview(){
  const weak=weakWords();
  if(!weak.length) return reviewEmpty();
  game.mode='quiz'; game.cat=null; game.pcat=null; game.subj='english';
  game.i=0; game.shields=0; game.wrong=0; game.missMap=new Map(); game.requeues=0;
  game.start=Date.now(); game.preLvl=levelIdx(profile);
  if(window.Analytics)Analytics.screen('subject/english');
  game.qs=weak.slice(0,8);
  nextWord();
}
function reviewEmpty(){
  render(`<div class="screen" style="justify-content:center;text-align:center;gap:14px;padding:24px">
    <div style="font-size:3.6rem">🔁</div>
    <h2>ჯერ გასამეორებელი არაფერია</h2>
    <p style="color:var(--muted);max-width:300px;line-height:1.5">ითამაშე და ის სიტყვები, რომლებიც გაგიჭირდება, აქ მოგროვდება.</p>
    <button class="btn btn-primary btn-block" style="max-width:300px" onclick="openMenu('english')">${I.check} კარგი</button>
  </div>`,false);
}

/* ── phrases ── hear a short everyday sentence, pick its meaning (with typewriter reveal) ── */
function startPhrases(cat){
  game.mode='phrases';game.pcat=cat||null;game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;
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
    recordPhrase(cor,true);winStep(null,null,()=>{game.i++;nextPhrase();});
  } else {
    btn.classList.add('wrong','dim');recordPhrase(cor,false);
    reQueueWrong(cor,false);  // options are Georgian-labelled → skip DOM reveal; re-queue + 2nd-miss hint
  }
}

/* ── match ── two columns: Georgian ↔ English, tap one then its pair ── */
function matchRound(){
  // dedup by BOTH en and ka so a round never shows the same word twice (owner 2026-06-15: a word appeared
  // in the Georgian and the English column at once). Cause: wordPool() pushes every category, so teacher
  // (school+professions) lands twice, and a few words share a Georgian translation (sun/the Sun=მზე,
  // moon/the Moon=მთვარე, star/a star=ვარსკვლავი). Pick 5 with distinct en AND distinct ka.
  const seenE=new Set(),seenK=new Set(),pool=[];
  for(const w of shuffle(wordPool())){ if(seenE.has(w.en)||seenK.has(w.ka))continue; seenE.add(w.en);seenK.add(w.ka);pool.push(w); if(pool.length===5)break; }
  game.pairs=pool;game.done=0;game.sel=null;
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
   drops back if they struggle, so nobody gets blocked by numbers they don't know yet. */
const MATH_LV = {
  // ceilings raised 2026-06-26 (parent feedback "math is light" + 9-12 yo signups): the adaptive ramp now
  // climbs further for kids who master, so older/strong children keep getting challenge instead of plateauing.
  'math-add':[{max:20,label:'1–20'},{max:40,label:'1–40'},{max:70,label:'1–70'},{max:100,label:'1–100'},{max:200,label:'1–200'}],
  'math-sub':[{max:20,label:'1–20'},{max:40,label:'1–40'},{max:70,label:'1–70'},{max:100,label:'1–100'},{max:200,label:'1–200'}],
  'math-mul':[{tmax:5,label:'×2–×5'},{tmax:9,label:'×2–×9'},{tmax:12,label:'×2–×12'},{twod:true,label:'2-ნიშნა'}],
  'math-pat':[{span:2,label:''},{span:3,label:''}],
  'math-div':[{dmax:5,label:'÷2–÷5'},{dmax:10,label:'÷2–÷10'},{dmax:12,label:'÷2–÷12'}],
  'math-miss':[{ops:['+'],label:'+'},{ops:['+','×'],label:'+ ×'},{ops:['+','−','×'],label:'+ − ×'}]
};
// #3 (interest, not just mechanics): Niko explains the concept in ONE concrete, real-life line
// shown on the FIRST question of a drill. Short, playful, never a lecture.
// bilingual owl intros: render-time ka/en by UILANG (owner 2026-06-13: the EN toggle left these Georgian).
const MATH_WHY={
  'math-add':{ka:'შეკრება = რამდენი გახდა, როცა ერთად დადე. 🍎+🍎',en:'Adding = how many you have when you put them together. 🍎+🍎'},
  'math-sub':{ka:'გამოკლება = რამდენი დარჩა, როცა რაღაც წაიღე. 🍎',en:'Subtracting = how many are left when you take some away. 🍎'},
  'math-mul':{ka:'გამრავლება = იგივეს რამდენჯერმე შეკრება, სწრაფად. ✖️',en:'Multiplying = adding the same number several times, fast. ✖️'},
  'math-div':{ka:'გაყოფა = თანაბრად დაყოფა ყველას შორის. 🍪',en:'Dividing = sharing equally among everyone. 🍪'},
  'math-miss':{ka:'იპოვე გამოტოვებული რიცხვი. რა აკლია? 🔍',en:'Find the missing number. What is gone? 🔍'},
  'math-pat':{ka:'იპოვე კანონზომიერება. რა მოდის შემდეგ? 🔢',en:'Find the pattern. What comes next? 🔢'},
  'math-word':{ka:'ჯერ ამბავი წაიკითხე, წარმოიდგინე, მერე დათვალე. 🦉',en:'First read the story, picture it, then count. 🦉'},
  'math-pic':{ka:'ჯერ ცნობილი ფასები ნახე, მერე იფიქრე რა აკლია. ნელა, ნაბიჯ-ნაბიჯ. 🧠',en:'First look at the known prices, then think what is missing. Slowly, step by step. 🧠'}
};
function whyText(mode){ const w=MATH_WHY[mode]; if(!w) return ''; return w[(window.UILANG==='en')?'en':'ka']||w.ka; }
// #3b: real-life WORD PROBLEMS (Georgian, Nanobashvili-style). Story → number. Sentence frames stay
// grammatically stable for any number; items in nominative; names take the dative -ს.
const WP_NAMES=['ნიკო','მაშო','ლუკა','ანა','დათო','ნინო'];
const WP_FOOD=['ვაშლი','ბანანი','კანფეტი','მსხალი','ნამცხვარი'];      // can be EATEN
const WP_OBJ =['ბურთი','მანქანა','წიგნი','ფანქარი','ყვავილი','ბუშტი']; // had / given / found — NOT eaten
// EN parallels — same index = same item. Food/obj are PLURAL: every slot they fill carries a count >= 2.
const EN_NAMES=['Niko','Masho','Luka','Ana','Dato','Nino'];
const EN_FOOD =['apples','bananas','candies','pears','cakes'];
const EN_OBJ  =['balls','cars','books','pencils','flowers','balloons'];
// Varied real-life scenarios (owner 2026-06-13: more variety + fun, not always "N boxes M-M each").
// 7+ (isBig) also gets comparison/shopping(money)/equal-sharing(division); younger get add/sub only.
// Bilingual: ka uses grammatical cases (dative -ს / ergative -მ); en uses plural nouns + simple frames.
function genWord(){
  const adv=(typeof isBig==='function'&&isBig(profile));
  const en=(window.UILANG==='en');
  const i=ri(0,WP_NAMES.length-1); let j=ri(0,WP_NAMES.length-1); if(j===i)j=(j+1)%WP_NAMES.length;
  const n1=WP_NAMES[i], n2=WP_NAMES[j], d1=n1+'ს', d2=n2+'ს', e1=n1+'მ';
  const E1=EN_NAMES[i], E2=EN_NAMES[j];
  const oi=ri(0,WP_OBJ.length-1), fi=ri(0,WP_FOOD.length-1);
  const obj=WP_OBJ[oi], food=WP_FOOD[fi], eobj=EN_OBJ[oi], efood=EN_FOOD[fi];
  const t=adv?ri(0,9):ri(0,6);
  switch(t){
    case 0:{const a=ri(2,9),b=ri(2,9);return{q:en?`${E1} had ${a} ${eobj}. ${E1} found ${b} more. How many ${eobj} now?`:`${d1} ჰქონდა ${a} ${obj}. კიდევ ${b} იშოვა. სულ რამდენი ${obj} აქვს?`,a:a+b,op:'word'};}
    case 1:{const a=ri(2,9),b=ri(2,9);return{q:en?`${E1} has ${a} ${efood}, ${E2} has ${b}. How many ${efood} together?`:`${d1} აქვს ${a} ${food}, ${d2} ${b}. სულ რამდენი ${food} აქვთ?`,a:a+b,op:'word'};}
    case 2:{const a=ri(2,9),b=ri(2,9);return{q:en?`One box has ${a} ${eobj}, another has ${b}. How many ${eobj} in total?`:`ერთ ყუთში ${a} ${obj}, მეორეში ${b}. სულ რამდენი ${obj}?`,a:a+b,op:'word'};}
    case 3:{const a=ri(5,14),b=ri(1,a-1);return{q:en?`${E1} had ${a} ${efood}. ${E1} ate ${b}. How many ${efood} are left?`:`${d1} ჰქონდა ${a} ${food}. ${b} შეჭამა. რამდენი ${food} დარჩა?`,a:a-b,op:'word'};}
    case 4:{const a=ri(5,14),b=ri(1,a-1);return{q:en?`${E1} had ${a} ${eobj}. ${E1} gave ${b} to a friend. How many ${eobj} are left?`:`${d1} ჰქონდა ${a} ${obj}. ${b} მისცა მეგობარს. რამდენი ${obj} დარჩა?`,a:a-b,op:'word'};}
    case 5:{const a=ri(4,12),b=ri(1,a-1);return{q:en?`${a} birds sat on a tree. ${b} flew away. How many birds are left?`:`ხეზე იჯდა ${a} ჩიტი. ${b} გაფრინდა. რამდენი ჩიტი დარჩა?`,a:a-b,op:'word'};}
    case 6:{const a=ri(5,14),b=ri(2,a-1);return{q:en?`${E1} has ${a} ${efood}, ${E2} has ${b}. How many more does ${E1} have?`:`${d1} აქვს ${a} ${food}, ${d2} ${b}. რამდენით მეტი აქვს ${d1}?`,a:a-b,op:'word'};}
    case 7:{const k=ri(2,5),m=ri(2,5);return{q:en?`${k} boxes have ${m} ${eobj} each. How many ${eobj} in total?`:`${k} ყუთში ${m}-${m} ${obj}. სულ რამდენი ${obj}?`,a:k*m,op:'word'};}
    case 8:{const k=ri(2,5),p=ri(2,5);return{q:en?`${E1} bought ${k} ${efood}, each costing ${p} GEL. How much did ${E1} pay in total?`:`${e1} იყიდა ${k} ${food}, თითო ${p} ლარად. სულ რამდენი ლარი გადაიხადა?`,a:k*p,op:'word'};}
    default:{const b=ri(2,5),qn=ri(2,6),tot=b*qn;return{q:en?`${tot} ${efood} were shared equally among ${b} children. How many did each child get?`:`${tot} ${food} თანაბრად დაურიგდა ${b} ბავშვს. რამდენი ერგო თითოს?`,a:qn,op:'word'};}
  }
}
function wordRound(){game.mode='math-word';game.qs=Array.from({length:6},()=>genWord());game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextWordQ();}
function nextWordQ(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const why=game.i===0?`<div style="background:#fff8ee;border:1px solid #ffe2bd;border-radius:14px;padding:10px 14px;margin-bottom:12px;font-size:.92rem;color:#6b5640;line-height:1.45">🦉 ${whyText('math-word')}</div>`:'';
  gameShell(`${why}<div class="prompt"><div class="p-word" style="font-size:1.25rem;line-height:1.55;max-width:430px">${q.q}</div></div>
    <div class="options">${mathOpts(q.a).map(o=>`<button class="opt num" onclick="answerMath(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
// ★ picture-substitution puzzles (owner favorite): pre-algebra reasoning with pictures, single unknown.
// Niko teaches substitution (the „point B" — building logic from arithmetic bricks). 7+ only.
const PIC_ITEMS=['⚽','🏀','🧸','🚗','🌲','🍎','🎈','🐱','🍌','🚲','🪁','🍪'];
function pickPic(n){const pool=PIC_ITEMS.slice();const o=[];for(let i=0;i<n;i++)o.push(pool.splice(ri(0,pool.length-1),1)[0]);return o;}
function genPic(){
  const L='₾', t=ri(0,3);
  const ln=s=>`<div style="margin:4px 0">${s}</div>`, em=e=>`<span style="font-size:1.7rem;vertical-align:middle">${e}</span>`;
  if(t===0){ const [A]=pickPic(1),k=ri(2,4),v=ri(2,9); const row=Array(k).fill(em(A)).join(' + ');
    return {q: ln(`${row} = ${k*v} ${L}`)+ln(`${em(A)} = ?`), a:v, op:'pic'}; }
  if(t===1){ const [A,B]=pickPic(2),a=ri(2,9),b=ri(2,9);
    return {q: ln(`${em(A)} = ${a} ${L}`)+ln(`${em(B)} = ${b} ${L}`)+ln(`${em(A)} + ${em(B)} = ?`), a:a+b, op:'pic'}; }
  if(t===2){ const [A,B,C]=pickPic(3),b=ri(2,7),c=ri(2,7);
    return {q: ln(`${em(A)} = ${em(B)} + ${em(C)}`)+ln(`${em(A)} = ${b+c} ${L}`)+ln(`${em(B)} = ${b} ${L}`)+ln(`${em(C)} = ?`), a:c, op:'pic'}; }
  const [A,B]=pickPic(2),a=ri(2,8),d=ri(1,5);
  return {q: ln(`${em(A)} = ${a} ${L}`)+ln(`${em(B)} = ${em(A)} + ${d}`)+ln(`${em(B)} = ?`), a:a+d, op:'pic'};
}
function picRound(){game.mode='math-pic';game.qs=Array.from({length:6},()=>genPic());game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextPic();}
function nextPic(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const why=game.i===0?`<div style="background:#fff8ee;border:1px solid #ffe2bd;border-radius:14px;padding:10px 14px;margin-bottom:12px;font-size:.92rem;color:#6b5640;line-height:1.45">🦉 ${whyText('math-pic')}</div>`:'';
  gameShell(`${why}<div class="prompt"><div class="p-word" style="font-size:1.2rem;line-height:1.5;text-align:center">${q.q}</div></div>
    <div class="options">${mathOpts(q.a).map(o=>`<button class="opt num" onclick="answerMath(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function mathLvl(type){
  const s=state[profile]; if(!s.mathLevel)s.mathLevel={};
  const max=(MATH_LV[type]||[{}]).length-1;
  let lvl=s.mathLevel[type];
  // age baseline (owner 2026-06-13): a 7-8 yo shouldn't START add/sub at 1-20 (7→1-40, 8+→1-70). But this is
  // only the STARTING seed — once the child has a real level we respect it, INCLUDING below the seed when they
  // genuinely struggle, so the adaptive ramp can actually make it easier (owner 2026-06-15: a struggling 7yo
  // was stuck at 1-40 because the floor kept pulling the level back up). mul/div have no seed (newer skills).
  if(lvl==null && (type==='math-add'||type==='math-sub')){
    const a=(kidObj(profile)||{}).age||0; lvl=Math.min(a>=8?2:(a>=7?1:0),max);
  }
  return Math.max(0,Math.min(lvl||0,max));
}
function mathRangeLabel(type){const lv=MATH_LV[type];return lv?(lv[mathLvl(type)].label||''):'';}
function rampMath(type,pct){
  const s=state[profile]; if(!s.mathLevel)s.mathLevel={}; if(!s.mathUp)s.mathUp={};
  const cur=mathLvl(type), max=(MATH_LV[type]||[{}]).length-1;
  game.leveledMath=null;
  // a clearly strong round (>=90%) bumps up immediately; a good-but-not-great round (85-89%)
  // still needs two in a row; step back quickly after a weak round so it stays at the real level.
  if(pct>=90 && cur<max){
    s.mathLevel[type]=cur+1; s.mathUp[type]=0; game.leveledMath=(MATH_LV[type][cur+1].label||'');
  } else if(pct>=85){
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
  // 7+ step-up (from the owner's worksheets): occasional 3-term expression e.g. "9 + 9 − 8" / "15 − 5 − 3"
  // at the higher levels. op:'multi' so the tutor teaches step-by-step (left to right), never mislabels it.
  if((type==='math-add'||type==='math-sub') && !young && typeof isBig==='function' && isBig(profile) && mathLvl(type)>=2 && Math.random()<0.15){
    const mx=cfg.max||40;
    if(type==='math-add'){ const a=ri(2,Math.floor(mx*0.5)),b=ri(2,Math.floor(mx*0.5)),c=ri(1,a+b-1); return{q:`${a} + ${b} − ${c}`,a:a+b-c,op:'multi'}; }
    const a=ri(8,mx),b=ri(1,a-2),c=ri(1,a-b); return{q:`${a} − ${b} − ${c}`,a:a-b-c,op:'multi'};
  }
  if(type==='math-add'){const mx=young?10:(cfg.max||20);const a=ri(1,Math.floor(mx*0.7)),b=ri(1,Math.max(1,mx-a));return{q:`${a} + ${b}`,a:a+b,op:'add',a1:a,a2:b};}
  if(type==='math-sub'){const mx=young?10:(cfg.max||20);const a=ri(2,mx),b=ri(1,a-1);return{q:`${a} − ${b}`,a:a-b,op:'sub',a1:a,a2:b};}
  if(type==='math-mul'){if(cfg.twod&&!young){const t=ri(11,19),b=ri(2,9);return{q:`${t} × ${b}`,a:t*b,op:'mul',a1:t,a2:b};}const tmax=young?3:(cfg.tmax||5);const t=ri(2,tmax),b=ri(1,10);return{q:`${t} × ${b}`,a:t*b,op:'mul',a1:t,a2:b};}
  // A+ (8-9): integer division — b*c ÷ b = c, always whole
  if(type==='math-div'){const dmax=cfg.dmax||5;const b=ri(2,dmax),c=ri(2,10);return{q:`${b*c} ÷ ${b}`,a:c,op:'div',a1:b*c,a2:b};}
  // A+ (8-9): missing number — ? op y = res, answer is the missing first operand
  if(type==='math-miss'){const ops=cfg.ops||['+'];const sym=ops[ri(0,ops.length-1)];let x,y,res;if(sym==='×'){x=ri(2,9);y=ri(2,9);res=x*y;}else if(sym==='−'){y=ri(2,12);x=ri(y+1,20);res=x-y;}else{x=ri(2,15);y=ri(2,15);res=x+y;}return{q:`? ${sym} ${y} = ${res}`,a:x,op:'miss',a1:x,a2:y};}
  // pattern: varied types so it isn't always "1,2,3,?" (owner ask 2026-06-13 — more variety + interest).
  // young = simple increasing only; older = increasing(varied step) / skip-5-10 / decreasing / doubling.
  { let full,step,kind=young?0:ri(0,3);
    if(kind===0){ step=young?ri(1,3):[2,3,4,5][ri(0,3)]; const s=ri(1,young?5:9); full=[0,1,2,3,4].map(i=>s+step*i); }
    else if(kind===1){ step=(Math.random()<0.5?5:10); const s=step*ri(1,4); full=[0,1,2,3,4].map(i=>s+step*i); }
    else if(kind===2){ const d=[2,3,5][ri(0,2)]; const start=d*ri(5,8); full=[0,1,2,3,4].map(i=>start-d*i); step=-d; }
    else { const s=[1,2,3,5][ri(0,3)]; full=[0,1,2,3,4].map(i=>s*Math.pow(2,i)); step=null; }
    // blank a position: young → always the last (simplest); older → any middle/last spot for variety.
    const blank=young?4:[1,2,3,4][ri(0,3)];
    const shown=full.map((v,i)=>i===blank?'?':v).join(', ');
    return {q:shown,a:full[blank],pat:true,op:'pat',seq:full.slice(),step,blank};
  }
}
function mathOpts(ans){const set=new Set([ans]);while(set.size<4){const v=ans+ri(1,Math.max(3,Math.ceil(Math.abs(ans)*0.3)+1))*(Math.random()>.5?1:-1);if(v>=0)set.add(v);}return shuffle([...set]);}
// activation: a brand-new child's VERY FIRST math problem ever is guaranteed easily winnable (small
// numbers), so the first interaction is a success → confidence to keep going. Only the first-ever round
// (s.sessions===0); ongoing play is never dumbed down. miss/pat keep their own generator (rare first pick).
function easyFirstMath(type){
  if(type==='math-add'){const a=ri(1,4),b=ri(1,4);return{q:`${a} + ${b}`,a:a+b,op:'add',a1:a,a2:b};}
  if(type==='math-sub'){const a=ri(3,7),b=ri(1,2);return{q:`${a} − ${b}`,a:a-b,op:'sub',a1:a,a2:b};}
  if(type==='math-mul'){const t=ri(2,3),b=ri(2,4);return{q:`${t} × ${b}`,a:t*b,op:'mul',a1:t,a2:b};}
  if(type==='math-div'){const b=2,c=ri(2,5);return{q:`${b*c} ÷ ${b}`,a:c,op:'div',a1:b*c,a2:b};}
  return genMath(type);
}
function mathRound(m){game.mode=m;game.leveledMath=null;game.qs=Array.from({length:8},()=>genMath(m));
  if(((state[profile]&&state[profile].sessions)||0)===0)game.qs[0]=easyFirstMath(m); // first-ever: winnable opener
  game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextMath();}
function nextMath(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const canHarder=mathLvl(game.mode)<((MATH_LV[game.mode]||[{}]).length-1);
  const why=game.i===0&&MATH_WHY[game.mode]?`<div style="background:#fff8ee;border:1px solid #ffe2bd;border-radius:14px;padding:9px 14px;margin-bottom:12px;font-size:.9rem;color:#6b5640;line-height:1.4">🦉 ${whyText(game.mode)}</div>`:'';
  gameShell(`${why}<div class="prompt"><div class="p-word num" style="font-size:2.4rem;letter-spacing:2px">${q.q}</div>${q.pat?'<div class="p-sub">იპოვე კანონზომიერება</div>':''}</div>
    <div class="options">${mathOpts(q.a).map(o=>`<button class="opt num" onclick="answerMath(this,${o},${q.a})">${o}</button>`).join('')}</div>
    ${canHarder?`<button class="btn btn-ghost" style="margin-top:16px;font-size:.95rem" onclick="mathHarder()">⏫ ${window.UILANG==='en'?'Make it harder':'გამირთულე'}</button>`:''}`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
// kid-facing "make it harder": bump this op's level, re-roll the remaining questions harder, keep going.
function mathHarder(){
  const type=game.mode, s=state[profile]; if(!s.mathLevel)s.mathLevel={};
  const max=(MATH_LV[type]||[{}]).length-1, cur=mathLvl(type);
  if(cur>=max) return;
  s.mathLevel[type]=cur+1; if(s.mathUp)s.mathUp[type]=0; save();
  for(let i=game.i;i<game.qs.length;i++){ game.qs[i]=genMath(type); }
  nextMath();
}
function answerMath(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');
    mrec(true);winStep(null,null,()=>{game.i++;(nextForMode())();});}
  else{btn.classList.add('wrong','dim');mrec(false);reQueueWrong(cor,null);}
}
function mrec(ok){const s=state[profile];if(ok){s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);if(!s.math[game.mode])s.math[game.mode]={correct:0,wrong:0};s.math[game.mode].correct++;}else{game.wrong++;s.streak=0;if(!s.math[game.mode])s.math[game.mode]={correct:0,wrong:0};s.math[game.mode].wrong++;}save();}

/* ════════ A: comparison (>/<), skip-counting (5s/10s), shapes ════════ */
/* ── comparison: a ? b → pick > < = ── */
function cmpRound(){game.mode='compare';game.qs=Array.from({length:8},()=>{const a=ri(1,20);let b=ri(1,20);if(Math.random()<0.25)b=a;return{a:a,b:b,ans:a>b?'>':(a<b?'<':'=')};});game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextCmp();}
function nextCmp(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  gameShell(`<div class="prompt"><div class="p-word num" style="font-size:2.6rem;letter-spacing:6px">${q.a} <span style="opacity:.35">?</span> ${q.b}</div><div class="p-sub">მეტი, ნაკლები თუ ტოლი?</div></div>
    <div class="options">${shuffle(['>','<','=']).map(o=>`<button class="opt num" style="font-size:2rem" onclick="answerCmp(this,'${o}','${q.ans}')">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerCmp(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);winStep(null,null,()=>{game.i++;nextCmp();});}
  else{btn.classList.add('wrong','dim');mrec(false);reQueueWrong(cor,null);}
}
/* ── skip-counting by 5 or 10 ── */
function skipRound(){game.mode='skip';const step=Math.random()<0.5?5:10;game.qs=Array.from({length:8},()=>{const s0=step*ri(1,6);const seq=[s0,s0+step,s0+step*2,s0+step*3];return{seq:seq,step:step,a:s0+step*4};});game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextSkip();}
function nextSkip(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  gameShell(`<div class="prompt"><div class="p-word num" style="font-size:1.9rem;letter-spacing:1px">${q.seq.join(', ')}, ?</div><div class="p-sub">${q.step===5?'დაითვალე ხუთობით':'დაითვალე ათობით'}</div></div>
    <div class="options">${mathOpts(q.a).map(o=>`<button class="opt num" onclick="answerSkip(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerSkip(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);winStep(null,null,()=>{game.i++;nextSkip();});}
  else{btn.classList.add('wrong','dim');mrec(false);reQueueWrong(cor,null);}
}
/* ── shapes: see a shape → pick its name (name shown in the UI language) ── */
function shapeRound(){game.mode='shapes';game.subj='math';game.qs=shuffle(SHAPES).slice(0,Math.min(8,SHAPES.length));game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextShape();}
function nextShape(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  let opts=[q];const pool=SHAPES;while(opts.length<Math.min(4,pool.length)){const r=pool[ri(0,pool.length-1)];if(!opts.find(o=>o.en===r.en))opts.push(r);}opts=shuffle(opts);
  // shape NAMES follow the KID's language, not the UI toggle: a Georgian kid keeps Georgian shapes
  // even if a parent switched the UI to English. (owner bug report 2026-06-13: only English showed)
  const kl=(kidObj(profile)&&kidObj(profile).langs)||['ka'], useEn=kl.indexOf('ka')<0;
  const nm=o=>useEn?o.en:o.ka, cor=useEn?q.en:q.ka;
  gameShell(`<div class="prompt"><div class="p-emoji" style="font-size:5rem">${q.e}</div><div class="p-sub">რა ფიგურაა?</div></div>
    <div class="options">${opts.map(o=>`<button class="opt" onclick="speak('${o.en}','en-US');answerShape(this,'${nm(o)}','${cor}')">${nm(o)}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerShape(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);winStep(cor,'en-US',()=>{game.i++;nextShape();});}
  else{btn.classList.add('wrong','dim');mrec(false);reQueueWrong(cor,null);}
}

/* ── money: count coins (tetri) → total ── */
const COINS=[5,10,20,50];      // tetri coins
const BILLS=[1,2,5,10,20];     // lari banknotes (კუპიური) — v1.196
// v1.196: money mixes tetri-coin rounds and lari-banknote (კუპიური) rounds. Prompt is now bilingual
// (was ka-only „რამდენი თეთრია?" = EN-leak for an English-deck kid).
function moneyRound(){game.mode='money';game.qs=Array.from({length:8},()=>{
    const lari=Math.random()<0.45; const pool=lari?BILLS:COINS; const n=ri(2,3); const items=[]; let total=0;
    for(let i=0;i<n;i++){const v=pool[ri(0,pool.length-1)];items.push(v);total+=v;}
    return{items:items,total:total,lari:lari};
  });game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextMoney();}
function nextMoney(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const en=(typeof voiceLang==='function'&&voiceLang(profile)==='en'); // v1.201: same content-lang signal as calendar (was a dead langs branch)
  const ic=q.lari?'💵':'🪙', unit=q.lari?'₾':'';
  const items=q.items.map(v=>`<span style="display:inline-flex;flex-direction:column;align-items:center;margin:2px 6px"><span style="font-size:2.6rem;line-height:1">${ic}</span><b class="num" style="font-size:.95rem">${v}${unit}</b></span>`).join('');
  const sub=q.lari?(en?'How many lari?':'რამდენი ლარია?'):(en?'How many tetri?':'რამდენი თეთრია?');
  gameShell(`<div class="prompt"><div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end">${items}</div><div class="p-sub">${sub}</div></div>
    <div class="options">${mathOpts(q.total).map(o=>`<button class="opt num" onclick="answerMoney(this,${o},${q.total})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerMoney(btn,sel,cor){
  if(sel===cor){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);winStep(null,null,()=>{game.i++;nextMoney();});}
  else{btn.classList.add('wrong','dim');mrec(false);reQueueWrong(cor,null);}
}
/* ── clock: read an analog clock (o'clock / half past) ── */
const CLOCK_OCLOCK=['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
const CLOCK_HALF=['🕧','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦'];
function clockEmoji(h,half){const i=h%12;return half?CLOCK_HALF[i]:CLOCK_OCLOCK[i];}
// real analog clock face: 12/3/6/9 numerals + hour ticks (განაყოფები) + hour & minute hands
function clockFace(h,half){
  // defensive: a deferred advance timer firing after the round was left could call this with a stale/
  // undefined hour → NaN SVG coords (harmless but logs a console error). Clamp to a valid clock value.
  if(!Number.isFinite(h)) h=12;
  const cx=50,cy=50,R=46;
  const pt=(a,r)=>{const t=a*Math.PI/180;return [cx+r*Math.sin(t),cy-r*Math.cos(t)];};
  let ticks='';
  for(let i=0;i<12;i++){const big=i%3===0;const [x1,y1]=pt(i*30,big?R-9:R-5);const [x2,y2]=pt(i*30,R-1.5);
    ticks+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#6B63B5" stroke-width="${big?2.4:1}" stroke-linecap="round"/>`;}
  const num=(n,a)=>{const [x,y]=pt(a,R-19);return `<text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="800" fill="#2b2740" font-family="system-ui,sans-serif">${n}</text>`;};
  const nums=num(12,0)+num(3,90)+num(6,180)+num(9,270);
  const hand=(a,len,w,col)=>{const [x,y]=pt(a,len);return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;};
  const hands=hand(((h%12)+(half?0.5:0))/12*360,22,3.4,'#2b2740')+hand(half?180:0,32,2.6,'#00A651');
  return `<svg viewBox="0 0 100 100" width="172" height="172" style="width:172px;height:172px;display:block;margin:2px auto" role="img" aria-label="საათი"><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#e7dcc8" stroke-width="2"/>${ticks}${nums}${hands}<circle cx="${cx}" cy="${cy}" r="2.8" fill="#2b2740"/></svg>`;
}
function timeLabel(h,half){return h+':'+(half?'30':'00');}
function clockRound(){game.mode='clock';game.qs=Array.from({length:8},()=>{return{h:ri(1,12),half:Math.random()<0.5?1:0};});game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextClock();}
function nextClock(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const correct=timeLabel(q.h,q.half);
  const set=new Set([correct]);while(set.size<4){set.add(timeLabel(ri(1,12),Math.random()<0.5?1:0));}
  gameShell(`<div class="prompt"><div class="p-emoji clockface">${clockFace(q.h,q.half)}</div><div class="p-sub">რომელ საათს უჩვენებს?</div></div>
    <div class="options">${shuffle([...set]).map(o=>`<button class="opt num" onclick="answerClock(this,'${o}','${correct}')">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerClock(btn,sel,cor){
  if(String(sel)===String(cor)){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);winStep(null,null,()=>{game.i++;nextClock();});}
  else{btn.classList.add('wrong','dim');mrec(false);reQueueWrong(cor,null);}
}

/* ── calendar (v1.195): weekday order + seasons. MULTILINGUAL: day/season names render in the kid's
   content language (ka or en) via calLang(); structure is ready for more languages (add an array key). ── */
const CAL_DAYS={ka:['ორშაბათი','სამშაბათი','ოთხშაბათი','ხუთშაბათი','პარასკევი','შაბათი','კვირა'],en:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']};
const CAL_SEASONS={ka:['ზამთარი','გაზაფხული','ზაფხული','შემოდგომა'],en:['Winter','Spring','Summer','Autumn'],ic:['❄️','🌸','☀️','🍂']};
function calLang(){return (typeof voiceLang==='function'&&voiceLang(profile)==='en')?'en':'ka';}
function calRound(){
  game.mode='cal';
  game.qs=Array.from({length:8},()=>{const k=ri(0,2);return k===0?{kind:'day',i:ri(0,6)}:k===1?{kind:'sNext',i:ri(0,3)}:{kind:'sIc',i:ri(0,3)};});
  game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  nextCal();
}
function nextCal(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q; const L=calLang(), en=(L==='en');
  let emoji,sub,correct,pool;
  if(q.kind==='day'){ const D=CAL_DAYS[L]; correct=D[(q.i+1)%7]; pool=D;
    emoji='📅'; sub=en?(D[q.i]+'. Which day comes next?'):(D[q.i]+'. რომელი დღე მოდის შემდეგ?'); }
  else if(q.kind==='sNext'){ const S=CAL_SEASONS[L]; correct=S[(q.i+1)%4]; pool=S;
    emoji=CAL_SEASONS.ic[q.i]; sub=en?(S[q.i]+'. Which season comes next?'):(S[q.i]+'. რომელი სეზონი მოდის შემდეგ?'); }
  else { const S=CAL_SEASONS[L]; correct=S[q.i]; pool=S;
    emoji=CAL_SEASONS.ic[q.i]; sub=en?'Which season is this?':'რომელი სეზონია?'; }
  const set=new Set([correct]); while(set.size<4 && set.size<pool.length) set.add(pool[ri(0,pool.length-1)]);
  const esc=s=>String(s).replace(/'/g,"\\'");
  gameShell(`<div class="prompt"><div class="p-emoji" style="font-size:3.2rem">${emoji}</div><div class="p-sub">${sub}</div></div>
    <div class="options">${shuffle([...set]).map(o=>`<button class="opt" onclick="answerCal(this,'${esc(o)}','${esc(correct)}')">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerCal(btn,sel,cor){
  if(String(sel)===String(cor)){document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');mrec(true);winStep(null,null,()=>{game.i++;nextCal();});}
  else{btn.classList.add('wrong','dim');mrec(false);reQueueWrong(cor,null);}
}

/* ── counting (Masho, zero-text) ── */
function startCount(mode){game.mode='count';game.cmode=mode;game.qs=shuffle(COUNTING).slice(0,6);game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextCount();}
let _countTimer=null;
// #8 (parent 2026-06-28): "count along" — light each object 1..N in turn and SAY the number, so the
// child links quantity → numeral → spoken word. Exactly the show-and-say-each-number the parent asked for.
function countAlong(n){
  if(_countTimer){clearTimeout(_countTimer);_countTimer=null;}
  for(let k=0;k<n;k++){const el=document.getElementById('cobj'+k);if(el)el.classList.remove('lit');}
  let i=0;
  const step=()=>{
    if(i>=n){_countTimer=null;return;}
    const el=document.getElementById('cobj'+i);if(el)el.classList.add('lit');
    try{digitSay(i+1);}catch(e){}
    i++;
    _countTimer=setTimeout(step,820);
  };
  step();
}
function nextCount(){
  if(game.i>=game.qs.length)return results();
  if(_countTimer){clearTimeout(_countTimer);_countTimer=null;} // stop any count-along from the previous question
  const q=game.qs[game.i],opts=new Set([q.num]);while(opts.size<4)opts.add(ri(1,10));
  // #7 (parent 2026-06-28): colourful counting — the plain white screen felt flat for kids.
  const CPAL=['#FFE0B2','#C8E6C9','#BBDEFB','#F8BBD0','#D1C4E9','#FFF1A8'];
  // #8 (parent 2026-06-28): split into individual objects so we can count along, lighting each one
  // 1..N with the number spoken. The parent asked for exactly this "show + say each number" demo.
  const glyphs=[...q.emoji];
  const objHtml=glyphs.map((g,idx)=>`<span class="cobj" id="cobj${idx}">${g}</span>`).join('');
  const prompt=`<div class="prompt count-prompt">
      <div class="count-q">რამდენია?</div>
      <div class="count-objects count-card">${objHtml}</div>
      <button class="speakbtn pulse-tap" onclick="countAlong(${q.num});pulseTap(this)">🔢 დავთვალოთ ერთად</button>
    </div>`;
  gameShell(`${prompt}<div class="options">${shuffle([...opts]).map((n,i)=>`<button class="opt emoji num cnum" style="--cnum:${CPAL[i%CPAL.length]}" onclick="answerCount(this,${n},${q.num})">${n}</button>`).join('')}</div>`);
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

/* ── Kings = Cambridge YLE level ladder (Starters/Movers/Flyers). byLevel() keeps only items at or
   below the selected band (cumulative); falls back to the full pool if a band is somehow empty so a
   round can always be built. KENG_TYPE_LV maps the legacy KINGS_ENG question types onto YLE bands. */
function byLevel(pool,lvl){const f=pool.filter(x=>!x.lv||x.lv<=lvl);return f.length>=3?f:pool;}
const KENG_TYPE_LV={pic2word:1,number:1,translate:2,spelling:2,grammar:2};
function startKings(kind){
  game.kind=kind;game.shields=0;game.wrong=0;game.i=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  if(kind==='eng'){const lvl=kingsLevel();const pool=KINGS_ENG.filter(q=>(q.lv||KENG_TYPE_LV[q.type]||1)<=lvl);game.qs=shuffle((pool.length>=6?pool:KINGS_ENG).slice()).slice(0,10);}
  else game.qs=shuffle(KINGS_MATH.slice()).slice(0,8);
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
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();winStep(null,null,()=>{game.i++;nextKings();});}
  else{btn.classList.add('wrong','dim');state[profile].streak=0;game.wrong++;save();reQueueWrong(cor,game.kind==='eng'?'en-US':null);}
}

/* ── YLE Listening comprehension (sentence level) — owner 2026-06-22 ──
   Hear a short English sentence, tap the matching picture. Reuses the existing listen-card UI
   (.listen-cta speaker + .opt.emoji options). Self-contained answer loop: 1st miss = try again
   (replay the sentence, do not reveal), 2nd miss = reveal the right picture + re-queue. */
function listenYleRound(){
  game.mode='listen-yle';game.kind='listen-yle';game.shields=0;game.wrong=0;game.i=0;
  game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  game.subj=game.subj||'kings-eng';
  game.qs=shuffle(byLevel(LISTEN_YLE,kingsLevel())).slice(0,8);
  nextListenYle();
}
function nextListenYle(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];
  const sen=q.en.replace(/'/g,"\\'");
  const opts=shuffle(q.opts.slice());
  const area=`<div class="prompt listen-prompt" onclick="speak('${sen}')">
      <div class="section-label">🎧 Listening</div>
      <button class="listen-cta pulse-hint" aria-label="მოისმინე" onclick="event.stopPropagation();speak('${sen}')">${I.speaker}</button>
      <div class="p-sub">მოუსმინე წინადადებას და აირჩიე სწორი სურათი</div></div>
    <div class="options">${opts.map(o=>`<button class="opt emoji" onclick="answerListenYle(this,'${String(o).replace(/'/g,"\\'")}','${String(q.a).replace(/'/g,"\\'")}','${sen}')">${o}</button>`).join('')}</div>`;
  gameShell(area);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
  setTimeout(()=>{try{speak(q.en);}catch(e){}},400); // auto-play once on render (the tutor's voice job)
}
function answerListenYle(btn,sel,cor,sentence){
  const s=state[profile];
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.remove('dim');btn.classList.add('correct');
    s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
    winStep(null,null,()=>{game.i++;nextListenYle();});
    return;
  }
  state[profile].streak=0;game.wrong++;save();
  btn.classList.add('wrong','dim');btn.style.pointerEvents='none';
  const q=game.qs[game.i];
  if(!game.missMap)game.missMap=new Map();
  const n=(game.missMap.get(q)||0)+1;game.missMap.set(q,n);
  try{speak(sentence);}catch(e){}                       // replay so they can listen again
  if(n<2){ try{feedback(false);}catch(e){} setTimeout(()=>{try{closeFeedback();}catch(e){}},1100); return; }
  // 2nd miss: lock options, reveal the right picture, re-queue, advance after a beat
  document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim');b.style.pointerEvents='none';});
  document.querySelectorAll('.opt').forEach(b=>{ if(b.textContent.trim()===String(cor)){b.classList.remove('dim');b.classList.add('correct');} });
  if(typeof maybeOfferHelp==='function'){try{maybeOfferHelp();}catch(e){}}
  game.requeues=game.requeues||0; if(game.requeues<reqCap()){game.qs.push(q);game.requeues++;}
  try{feedback(false);}catch(e){}
  setTimeout(()=>{try{closeFeedback();}catch(e){} game.i++; nextListenYle();},1700);
}

/* ── YLE Reading & Writing: TICK yes/no — owner 2026-06-22 ──
   Look at a picture, read the English sentence, decide if it is true (✅ კი / ❌ არა). */
function yesNoRound(){
  game.mode='yesno';game.kind='yesno';game.shields=0;game.wrong=0;game.i=0;
  game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  game.subj=game.subj||'kings-eng';
  game.qs=shuffle(byLevel(YESNO_YLE,kingsLevel())).slice(0,8);
  nextYesNo();
}
function nextYesNo(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];const sen=q.s.replace(/'/g,"\\'");
  const area=`<div class="prompt" onclick="speak('${sen}')">
      <div class="section-label">✅❌ True or false?</div>
      <div class="p-emoji" style="font-size:3.4rem">${q.e}</div>
      <div class="p-word en" style="font-size:1.25rem">${q.s}</div>
      <button class="speakbtn pulse-hint" onclick="event.stopPropagation();speak('${sen}')">${I.speaker} მოისმინე</button></div>
    <div class="options yn-opts">
      <button class="opt yn-yes" onclick="answerYesNo(this,'yes','${q.a}')">✅ კი</button>
      <button class="opt yn-no" onclick="answerYesNo(this,'no','${q.a}')">❌ არა</button>
    </div>`;
  gameShell(area);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerYesNo(btn,sel,cor){
  const s=state[profile];
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.remove('dim');btn.classList.add('correct');
    s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
    winStep(null,null,()=>{game.i++;nextYesNo();});
    return;
  }
  state[profile].streak=0;game.wrong++;save();
  btn.classList.add('wrong','dim');btn.style.pointerEvents='none';
  const q=game.qs[game.i];if(!game.missMap)game.missMap=new Map();
  const n=(game.missMap.get(q)||0)+1;game.missMap.set(q,n);
  if(n<2){ try{feedback(false);}catch(e){} setTimeout(()=>{try{closeFeedback();}catch(e){}},1100); return; }
  document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim');b.style.pointerEvents='none';});
  const ok=[...document.querySelectorAll('.opt')].find(b=>b.classList.contains(cor==='yes'?'yn-yes':'yn-no'));
  if(ok){ok.classList.remove('dim');ok.classList.add('correct');}
  if(typeof maybeOfferHelp==='function'){try{maybeOfferHelp();}catch(e){}}
  game.requeues=game.requeues||0; if(game.requeues<reqCap()){game.qs.push(q);game.requeues++;}
  try{feedback(false);}catch(e){}
  setTimeout(()=>{try{closeFeedback();}catch(e){} game.i++; nextYesNo();},1700);
}

/* ── YLE Reading & Writing: READ A STORY + answer — owner 2026-06-22 ──
   Read 2-3 short English sentences (🔊 reads them too), then answer one question. */
function storyRound(){
  game.mode='story';game.kind='story';game.shields=0;game.wrong=0;game.i=0;
  game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  game.subj=game.subj||'kings-eng';
  game.qs=shuffle(byLevel(STORY_YLE,kingsLevel())).slice(0,6);
  nextStory();
}
function nextStory(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];const txt=q.text.replace(/'/g,"\\'");
  const opts=shuffle(q.opts.slice());
  const area=`<div class="prompt story-prompt">
      <div class="section-label">📖 Read</div>
      <div class="story-text en">${q.text}</div>
      <button class="speakbtn pulse-hint" onclick="speak('${txt}')">${I.speaker} მოისმინე</button>
      <div class="p-word en" style="font-size:1.12rem;margin-top:8px">${q.q}</div></div>
    <div class="options">${opts.map(o=>{const oe=o.replace(/'/g,"\\'");return `<button class="opt en" onclick="speak('${oe}');answerStory(this,'${oe}','${q.a.replace(/'/g,"\\'")}')">${o}</button>`;}).join('')}</div>`;
  gameShell(area);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
  setTimeout(()=>{try{speak(q.text);}catch(e){}},400);
}
function answerStory(btn,sel,cor){
  const s=state[profile];
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.remove('dim');btn.classList.add('correct');
    s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
    winStep(cor,'en-US',()=>{game.i++;nextStory();});
    return;
  }
  state[profile].streak=0;game.wrong++;save();
  btn.classList.add('wrong','dim');btn.style.pointerEvents='none';
  const q=game.qs[game.i];if(!game.missMap)game.missMap=new Map();
  const n=(game.missMap.get(q)||0)+1;game.missMap.set(q,n);
  if(n<2){ try{feedback(false);}catch(e){} setTimeout(()=>{try{closeFeedback();}catch(e){}},1100); return; }
  document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim');b.style.pointerEvents='none';});
  const ok=[...document.querySelectorAll('.opt')].find(b=>b.textContent.trim()===String(cor));
  if(ok){ok.classList.remove('dim');ok.classList.add('correct');try{speak(cor,'en-US');}catch(e){}}
  if(typeof maybeOfferHelp==='function'){try{maybeOfferHelp();}catch(e){}}
  game.requeues=game.requeues||0; if(game.requeues<reqCap()){game.qs.push(q);game.requeues++;}
  try{feedback(false);}catch(e){}
  setTimeout(()=>{try{closeFeedback();}catch(e){} game.i++; nextStory();},1800);
}

/* ── YLE SPEAKING practice (say-aloud + MODEL self-check + optional record→playback) — owner 2026-06-23 ──
   THE LOOP, made honest: owl asks → child answers OUT LOUD → (optional) records & plays back their OWN
   voice to hear their pronunciation → taps „✓ ვთქვი" → the app REVEALS + SPEAKS a model answer to compare
   against. There is NO speech-recognition / auto-grading BY DESIGN: a real recogniser would stream a child's
   voice to a cloud STT = breaks the on-device/COPPA privacy promise + ongoing cost + poor kids-accent accuracy.
   The optional recorder (owner 2026-06-23) is the FIRST real mic use; its audio is captured to an in-memory
   Blob ONLY — never written to disk/localStorage/IndexedDB, never sent, and DELETED the instant the child
   moves to the next card (speakRecCleanup at the top of nextSpeakYle). Mic track is released immediately on
   stop. Fully optional: the listen→say→model loop works untouched without ever granting the mic.
   Every card earns a coin so the loop stays warm. Not graded by design (`s:1` items = the model is a sample). */
function speakYleRound(){
  speakRecCleanup();
  game.mode='speak';game.kind='speak';game.shields=0;game.wrong=0;game.i=0;
  game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  game.subj=game.subj||'kings-eng';
  game.qs=shuffle(byLevel(SPEAK_YLE,kingsLevel())).slice(0,6);
  nextSpeakYle();
}
function nextSpeakYle(){
  speakRecCleanup();                       // delete the previous card's recording before moving on (ephemeral)
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];const pr=q.q.replace(/'/g,"\\'");
  const area=`<div class="prompt speak-prompt" onclick="speak('${pr}')">
      <div class="section-label">🗣️ Speaking</div>
      <div class="p-emoji" style="font-size:3.4rem">${q.e}</div>
      <div class="p-word en" style="font-size:1.16rem">${q.q}</div>
      <button class="speakbtn pulse-hint" onclick="event.stopPropagation();speak('${pr}')">${I.speaker} მოისმინე</button>
      <div class="p-sub">ხმამაღლა უპასუხე, მერე ნახე ნიმუში 🗣️</div></div>
    <div id="srbox" class="srbox"></div>
    <div class="actions" style="margin-top:10px">
      <button class="btn btn-primary btn-block" onclick="speakDone()">✓ ვთქვი</button>
    </div>`;
  gameShell(area);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
  srRender();
  setTimeout(()=>{try{speak(q.q);}catch(e){}},400);
}
function speakDone(){
  const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
  winStep(null,null,showSpeakModel);
}
/* reveal + speak the model answer so the child compares their own try to a good one (offline self-check). */
function showSpeakModel(){
  const q=game.qs[game.i];const last=(game.i+1>=game.qs.length);
  const mdl=(q.m||'').replace(/'/g,"\\'");
  const lbl=q.s?'ნიმუში (ერთ-ერთი კარგი პასუხი) 👂':'ნიმუში-პასუხი 👂';
  const area=`<div class="prompt speak-prompt">
      <div class="section-label">🗣️ Speaking</div>
      <div class="p-emoji" style="font-size:2.5rem">${q.e}</div>
      <div class="p-word en" style="font-size:1rem;opacity:.65">${q.q}</div>
      <div class="speak-model">
        <div class="sm-label">${lbl}</div>
        <div class="sm-en en">${q.m||''}</div>
        <button class="speakbtn" onclick="speak('${mdl}')">${I.speaker} მოუსმინე ნიმუშს</button>
      </div>
      <div class="p-sub">შენი პასუხი მსგავსი იყო? 🙂</div></div>
    <div id="srbox" class="srbox"></div>
    <div class="actions" style="margin-top:10px">
      <button class="btn btn-primary btn-block" onclick="game.i++;nextSpeakYle()">${last?'✓ დასრულება':'შემდეგი →'}</button>
    </div>`;
  gameShell(area);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
  srRender();                              // keep the child's recording playable next to the model (same card)
  setTimeout(()=>{try{speak(q.m||'');}catch(e){}},400);
}
/* ── optional RECORD → PLAYBACK helper (hear your own voice), privacy-strict — owner 2026-06-23 ──
   In-memory only. Never persisted, never sent. Mic released on stop. speakRecCleanup() deletes everything
   and is called on every card advance, so a recording never outlives the card the child made it on. */
let _srRec=null,_srChunks=[],_srUrl=null,_srStream=null,_srState='idle';
function speakRecSupported(){ return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder); }
function speakRecCleanup(){
  try{ if(_srRec&&_srRec.state&&_srRec.state!=='inactive')_srRec.stop(); }catch(e){}
  try{ if(_srStream)_srStream.getTracks().forEach(t=>t.stop()); }catch(e){}   // release the mic (OS indicator off)
  try{ if(_srUrl)URL.revokeObjectURL(_srUrl); }catch(e){}                      // free the in-memory audio
  _srRec=null;_srChunks=[];_srUrl=null;_srStream=null;_srState='idle';
}
function srBox(){ return document.getElementById('srbox'); }
function srRender(){
  const b=srBox(); if(!b)return;
  if(!speakRecSupported()){ b.innerHTML=''; return; }                          // unsupported browser → no broken button
  if(_srState==='rec'){
    b.innerHTML=`<button class="srbtn rec" onclick="speakRecStop()"><span class="srdot"></span>⏹️ გააჩერე</button>`;
  }else if(_srState==='done'){
    b.innerHTML=`<button class="srbtn" onclick="speakRecPlay()">▶️ მოისმინე შენი ხმა</button>`+
                `<button class="srbtn ghost" onclick="speakRecStart()">🎙️ თავიდან</button>`;
  }else{
    b.innerHTML=`<button class="srbtn" onclick="speakRecStart()">🎙️ ჩაიწერე შენი ხმა</button>`+
                `<div class="sr-priv">🔒 ხმა შენს მოწყობილობაზე რჩება, არსად იგზავნება და შემდეგზე გადასვლისას იშლება</div>`;
  }
}
async function speakRecStart(){
  speakRecCleanup();
  try{ _srStream=await navigator.mediaDevices.getUserMedia({audio:true}); }
  catch(e){ const b=srBox(); if(b)b.innerHTML=`<div class="sr-priv">მიკროფონი არ ჩაირთო. ეს არ უშლის ხელს. უბრალოდ ხმამაღლა თქვი 🙂</div>`; return; }
  _srChunks=[];
  try{ _srRec=new MediaRecorder(_srStream); }catch(e){ speakRecCleanup(); return; }
  _srRec.ondataavailable=ev=>{ if(ev.data&&ev.data.size)_srChunks.push(ev.data); };
  _srRec.onstop=()=>{
    try{ const blob=new Blob(_srChunks,{type:(_srRec&&_srRec.mimeType)||'audio/webm'}); _srUrl=URL.createObjectURL(blob); }catch(e){}
    try{ if(_srStream)_srStream.getTracks().forEach(t=>t.stop()); }catch(e){}  // release mic the moment recording ends
    _srStream=null;_srState='done';srRender();
  };
  try{ _srRec.start(); _srState='rec'; srRender(); }catch(e){ speakRecCleanup(); srRender(); }
}
function speakRecStop(){ try{ if(_srRec&&_srRec.state!=='inactive')_srRec.stop(); }catch(e){} }
function speakRecPlay(){ if(!_srUrl)return; try{ const a=new Audio(_srUrl); a.play(); }catch(e){} }

/* ── KINGS reasoning strand #1: PATTERN (კანონზომიერება) — owner 2026-06-23 (Kings v2, capability-based).
   Capacity-TIERED (NOT grade): t1 arithmetic · t2 growing-difference/alternating · t3 interleaved/doubling
   — mirrors the Kings difficulty ramp by the child's CAPACITY (s.patTier advances by mastery). 3 options
   (Kings format). LEARN-mode: on the 2nd miss the RULE is revealed (teaching the reasoning move, not just
   the answer) — the grill's "assessment != instruction" fix. Kings = guide for the pattern TYPES, not a copy. */
function pat3opts(a){ const s=new Set([a]); let g=0;
  while(s.size<3&&g++<80){ const d=ri(1,Math.max(2,Math.round(Math.abs(a)*0.25)+2)); const v=a+(Math.random()<.5?d:-d); if(v>=0&&v!==a) s.add(v); }
  let f=0; while(s.size<3&&f++<40){ const v=ri(0,Math.abs(a)+6); if(v!==a) s.add(v); }
  return shuffle([...s]); }
function genPattern(tier){
  tier=Math.max(1,Math.min(3,tier||1)); let full, blank, rule;
  if(tier===1){ const step=ri(2,5), s=ri(1,9); full=[0,1,2,3,4].map(i=>s+step*i); blank=4; rule=`ყოველ ჯერზე +${step}`; }
  else if(tier===2){
    if(Math.random()<0.5){ const d=ri(2,4), s=ri(1,6); full=[s]; let c=s; for(let i=1;i<5;i++){c+=d+(i-1);full.push(c);} blank=4; rule=`სხვაობა იზრდება: +${d}, +${d+1}, +${d+2}…`; }
    else{ const a=ri(1,3), b=a+ri(1,3), s=ri(2,6); full=[s]; let c=s; for(let i=1;i<6;i++){c+=(i%2?a:b);full.push(c);} blank=5; rule=`მონაცვლეობით +${a}, მერე +${b}`; }
  } else {
    // tier-3: only CLEAN, naturally-logical patterns (no contrived interleaving). Each is a question a teacher
    // would really ask, with a logical path to the answer: geometric (×2/×3) or Fibonacci-sum (each = previous two).
    if(Math.random()<0.5){ const m=ri(2,3), s=ri(1,3); full=[0,1,2,3,4].map(i=>s*Math.pow(m,i)); blank=4; rule=`ყოველი რიცხვი მრავლდება ×${m}-ზე`; }
    else{ const a0=ri(1,4), a1=a0+ri(1,4); full=[a0,a1]; for(let i=2;i<6;i++) full.push(full[i-1]+full[i-2]); blank=5; rule='ყოველი რიცხვი = წინა ორი რიცხვის ჯამი'; }
  }
  const a=full[blank]; return {q:full.map((v,i)=>i===blank?'?':v).join(', '), a, opts:pat3opts(a), rule, tier};
}
function patternRound(){
  game.mode='pattern';game.kind='pattern';game.shields=0;game.wrong=0;game.i=0;
  game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
  game.subj=game.subj||'kings-math';
  const s=state[profile]; game.patTier=(typeof kingsLevel==='function')?kingsLevel():((s&&s.patTier)||1); // unified 3-level selector drives difficulty (consistent with English)
  game.qs=Array.from({length:6},()=>genPattern(game.patTier));
  nextPattern();
}
function nextPattern(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const tn=['','დამწყები','საშუალო','რთული'][q.tier]||'';
  gameShell(`<div class="prompt"><div class="section-label">🧩 კანონზომიერება</div>
      <div class="p-word num" style="font-size:1.9rem;letter-spacing:2px">${q.q}</div>
      <div class="p-sub">იპოვე წესი: რა მოდის ?-ის ნაცვლად</div></div>
    <div class="options">${q.opts.map(o=>`<button class="opt num" onclick="answerPattern(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerPattern(btn,sel,cor){
  const s=state[profile];
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.remove('dim');btn.classList.add('correct');
    s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);
    s.patStreak=(s.patStreak||0)+1; // capacity climb: a short mastery streak at this tier bumps patTier
    if(s.patStreak>=4 && (s.patTier||1)<3 && (s.patTier||1)===game.patTier){ s.patTier=(s.patTier||1)+1; s.patStreak=0; }
    save(); winStep(null,null,()=>{game.i++;nextPattern();}); return;
  }
  state[profile].streak=0;state[profile].patStreak=0;game.wrong++;save();
  btn.classList.add('wrong','dim');btn.style.pointerEvents='none';
  const q=game.qs[game.i];if(!game.missMap)game.missMap=new Map();
  const n=(game.missMap.get(q)||0)+1;game.missMap.set(q,n);
  if(n<2){ try{feedback(false);}catch(e){} setTimeout(()=>{try{closeFeedback();}catch(e){}},1100); return; }
  // 2nd miss → LEARN: reveal the RULE (teach the move) + the answer, then advance
  document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim');b.style.pointerEvents='none'; if(+b.textContent.trim()===cor){b.classList.remove('dim');b.classList.add('correct');}});
  try{ const area=document.querySelector('#garea'); if(area){ const t=document.createElement('div'); t.className='pat-rule'; t.innerHTML=`🦉 წესი: <b>${q.rule}</b><br>ამიტომ პასუხია <b>${cor}</b>`; area.appendChild(t); } }catch(e){}
  setTimeout(()=>{ game.i++; nextPattern(); }, 2800);
}

/* ── Generic KINGS reasoning-strand engine (owner 2026-06-23). A strand = a generator gen(tier) that
   returns {q (HTML), a (number), opts (3), rule (worked solution for learn-mode), tier}. Reuses the
   Pattern strand's design: capacity tier via s[tierKey] (advances on a 4-correct mastery streak, NOT
   grade), 3 options, LEARN-mode reveals the worked rule on the 2nd miss. New strands = one REASON_STRANDS
   entry. Pattern stays its own (already shipped) special case. ── */
function genRebus(tier){
  tier=Math.max(1,Math.min(3,tier||1));
  if(tier===1){ const S=shuffle(['🔵','🟢','⭐','🔺','🟪']).slice(0,2); const v0=ri(2,8), v1=ri(2,8); const a=v0+v1;
    return {q:`${S[0]} = ${v0},  ${S[1]} = ${v1}<br>${S[0]} + ${S[1]} = ?`, a, opts:pat3opts(a), rule:`${S[0]}=${v0}, ${S[1]}=${v1} → ${v0}+${v1}=<b>${a}</b>`, tier}; }
  if(tier===2){ const X=['N','A','□','⭐'][ri(0,3)]; const x=ri(2,9), b=ri(2,9); const res=x+b;
    return {q:`${X} + ${b} = ${res}<br>${X} = ?`, a:x, opts:pat3opts(x), rule:`${X} = ${res} − ${b} = <b>${x}</b>`, tier}; }
  const a0=ri(1,5), s=ri(2,6), sEq=s+a0, c=ri(2,5), a=s+c;
  return {q:`△ + ${a0} = ${sEq}<br>⬛ = △ + ${c}<br>⬛ = ?`, a, opts:pat3opts(a), rule:`△ = ${sEq}−${a0} = ${s};  ⬛ = ${s}+${c} = <b>${a}</b>`, tier};
}
/* Kings MATH "გამოიანგარიშე" strand: multi-step real-world word problems (Gemini KA-QA'd 2026-06-23,
   math self-verified). Curated by capacity tier; genModel picks one; learn-mode shows the steps. */
const MODEL_POOL=[
  {lv:1,q:'ნიკას აქვს 6 ვაშლი. დედამ კიდევ 5 მისცა. მერე 3 შეჭამა. რამდენი დარჩა?', a:8, opts:[8,11,14], rule:'6+5=11, მერე 11−3=<b>8</b>'},
  {lv:1,q:'მაღაზიაში 4 ბურთი იყო. კიდევ 7 მოიტანეს. ახლა რამდენია?', a:11, opts:[11,3,10], rule:'4+7=<b>11</b>'},
  {lv:1,q:'3 კალათაში, თითოეულში 2 ვაშლია. ჯამში რამდენი ვაშლია?', a:6, opts:[6,5,8], rule:'3×2=<b>6</b>'},
  {lv:1,q:'ლუკას აქვს 8 კანფეტი. დას მისცა 3, ძმას 2. რამდენი დარჩა?', a:3, opts:[3,5,6], rule:'8−3−2=<b>3</b>'},
  {lv:2,q:'10 ბავშვი ეზოში თამაშობდა. 4 წავიდა, მერე 3 მოვიდა. ახლა რამდენია?', a:9, opts:[9,7,11], rule:'10−4=6, 6+3=<b>9</b>'},
  {lv:2,q:'მარის ჰქონდა 15 ლარი. იყიდა წიგნი 6-ად და კალამი 4-ად. რამდენი დარჩა?', a:5, opts:[5,9,11], rule:'15−6−4=<b>5</b>'},
  {lv:2,q:'ერთ ყუთში 6 კვერცხია. რამდენი კვერცხია 3 ყუთში?', a:18, opts:[18,9,12], rule:'6×3=<b>18</b>'},
  {lv:2,q:'12 ფანქარი 2 ბავშვმა თანაბრად გაიყო. რამდენი ერგო თითოს?', a:6, opts:[6,10,4], rule:'12÷2=<b>6</b>'},
  {lv:3,q:'ნიკა 2 წლის წინ 7 წლის იყო. რამდენი წლის იქნება 3 წელიწადში?', a:12, opts:[12,10,9], rule:'ახლა 7+2=9; 3 წელში 9+3=<b>12</b>'},
  {lv:3,q:'ვაშლი 3 ლარია, მსხალი 2 ლარით ძვირია. რა ღირს მსხალი?', a:5, opts:[5,2,1], rule:'3+2=<b>5</b>'},
  {lv:3,q:'4 მეგობარს თითოეულს 3 ბურთი აქვს. 2 დაიკარგა. ჯამში რამდენი დარჩა?', a:10, opts:[10,12,14], rule:'4×3=12, 12−2=<b>10</b>'},
  {lv:3,q:'კიბეს 9 საფეხური აქვს. შუა საფეხური მერამდენეა?', a:5, opts:[5,4,6], rule:'შუა = (9+1)÷2 = <b>5</b>'}
];
function genModel(tier){ tier=Math.max(1,Math.min(3,tier||1)); const pool=MODEL_POOL.filter(x=>x.lv<=tier); const q=pool[ri(0,pool.length-1)]; return {q:q.q, a:q.a, opts:shuffle(q.opts.slice()), rule:q.rule, tier:q.lv}; }
/* Kings MATH "სამკუთხედი" strand (owner roadmap, art-free). PROPER "find the rule" format (redesigned
   2026-06-27 — a single triangle was unsolvable): show 3 SOLVED example triangles so the rule
   (top + bottom-left) × bottom-right = centre is INFERABLE, then 1 target with ? to solve. Tier scales numbers. */
function genTriangle(tier){ tier=Math.max(1,Math.min(3,tier||1));
  const gen = tier===1 ? ()=>[ri(1,5),ri(1,5),ri(2,3)]
            : tier===2 ? ()=>[ri(2,9),ri(2,9),ri(2,4)]
            :            ()=>[ri(3,12),ri(4,12),ri(2,5)];
  const C=(t,l,r)=>(t+l)*r;
  // the child must infer ONE rule from the 3 solved examples — guarantee no other common rule fits all 3
  // (unique among the common rules a child would try — a strong guard, not a formal proof over all possible rules).
  const ALT=[(t,l,r)=>t+l+r,(t,l,r)=>t*l*r,(t,l,r)=>t*l+r,(t,l,r)=>t*r+l,(t,l,r)=>l*r+t,(t,l,r)=>(t+r)*l,(t,l,r)=>(l+r)*t,(t,l,r)=>t*l,(t,l,r)=>l*r,(t,l,r)=>t+l*r];
  function build(){ const items=[]; const seen=new Set(); let g=0;
    while(items.length<4 && g++<80){ const a=gen(),k=a.join(','),c=C(a[0],a[1],a[2]); if(seen.has(k)||seen.has('c'+c))continue; seen.add(k); seen.add('c'+c); items.push({t:a[0],l:a[1],r:a[2],c}); }
    while(items.length<4){ const a=gen(); items.push({t:a[0],l:a[1],r:a[2],c:C(a[0],a[1],a[2])}); }
    return items; }
  let items, tries=0;
  do { items=build(); } while(++tries<25 && ALT.some(fn=>{ for(let i=0;i<3;i++){ const s=items[i]; if(fn(s.t,s.l,s.r)!==s.c) return false; } return true; }));
  const target=items[3], ans=target.c;
  const tri=(o,solved)=>`<div style="position:relative;width:90px;height:72px">`
    +`<svg viewBox="0 0 90 72" style="position:absolute;inset:0;width:100%;height:100%"><polygon points="45,5 6,67 84,67" fill="${solved?'rgba(0,166,81,.08)':'rgba(107,99,181,.10)'}" stroke="${solved?'#9ed8b4':'#8e84d6'}" stroke-width="1.6"/></svg>`
    +`<div style="position:absolute;top:6px;left:50%;transform:translateX(-50%);font-size:.95rem;font-weight:800">${o.t}</div>`
    +`<div style="position:absolute;top:30px;left:50%;transform:translateX(-50%);font-size:1.15rem;font-weight:900;color:${solved?'#0a7d3f':'var(--primary-d)'}">${solved?o.c:'?'}</div>`
    +`<div style="position:absolute;bottom:5px;left:12px;font-size:.95rem;font-weight:800">${o.l}</div>`
    +`<div style="position:absolute;bottom:5px;right:12px;font-size:.95rem;font-weight:800">${o.r}</div>`
    +`</div>`;
  const q=`<div style="font-size:.82rem;color:var(--muted);margin:0 0 6px;text-align:center">გამოიცანი წესი 🟩 ამოხსნილი მაგალითებიდან, მერე იპოვე ?</div>`
    +`<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;max-width:300px;margin:0 auto">`
    + items.slice(0,3).map(o=>tri(o,true)).join('') + tri(target,false) + `</div>`;
  const rule=`წესი: (ზედა + ქვედა-მარცხ.) × ქვედა-მარჯვ. = ცენტრი. ანუ (${target.t} + ${target.l}) × ${target.r} = <b>${ans}</b>`;
  return {q, a:ans, opts:pat3opts(ans), rule, tier};
}
const REASON_STRANDS={
  rebus:{label:'🔢 რებუსი', tierKey:'rbTier', gen:genRebus},
  model:{label:'📝 ამოცანები', tierKey:'mdTier', gen:genModel},
  triangle:{label:'🔺 სამკუთხედი', tierKey:'trTier', gen:genTriangle}
};
function reasonRound(mode){
  const st=REASON_STRANDS[mode]; if(!st)return;
  game.mode=mode;game.kind=mode;game.rStrand=st;game.shields=0;game.wrong=0;game.i=0;
  game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);game.subj=game.subj||'kings-math';
  const s=state[profile]; game.rTier=(typeof kingsLevel==='function')?kingsLevel():((s&&s[st.tierKey])||1); // unified 3-level selector drives difficulty (consistent with English)
  game.qs=Array.from({length:6},()=>st.gen(game.rTier));
  nextReason();
}
function nextReason(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const tn=['','დამწყები','საშუალო','რთული'][q.tier]||'';
  gameShell(`<div class="prompt"><div class="section-label">${game.rStrand.label}</div>
      <div class="p-word" style="font-size:1.5rem;line-height:1.55;letter-spacing:1px">${q.q}</div>
      <div class="p-sub">იპოვე პასუხი</div></div>
    <div class="options">${q.opts.map(o=>`<button class="opt num" onclick="answerReason(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function answerReason(btn,sel,cor){
  const s=state[profile], tk=game.rStrand.tierKey;
  if(sel===cor){ document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim')); btn.classList.remove('dim');btn.classList.add('correct');
    s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);
    s[tk+'_st']=(s[tk+'_st']||0)+1;
    if(s[tk+'_st']>=4 && (s[tk]||1)<3 && (s[tk]||1)===game.rTier){ s[tk]=(s[tk]||1)+1; s[tk+'_st']=0; }
    save(); winStep(null,null,()=>{game.i++;nextReason();}); return; }
  state[profile].streak=0;s[tk+'_st']=0;game.wrong++;save();
  btn.classList.add('wrong','dim');btn.style.pointerEvents='none';
  const q=game.qs[game.i];if(!game.missMap)game.missMap=new Map();
  const n=(game.missMap.get(q)||0)+1;game.missMap.set(q,n);
  if(n<2){ try{feedback(false);}catch(e){} setTimeout(()=>{try{closeFeedback();}catch(e){}},1100); return; }
  document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim');b.style.pointerEvents='none'; if(+b.textContent.trim()===cor){b.classList.remove('dim');b.classList.add('correct');}});
  try{ const area=document.querySelector('#garea'); if(area){ const t=document.createElement('div'); t.className='pat-rule'; t.innerHTML=`🦉 წესი: ${q.rule}`; area.appendChild(t); } }catch(e){}
  setTimeout(()=>{ game.i++; nextReason(); }, 2800);
}

/* ── EXAM-REHEARSAL "Test Room" (🏆 სავარჯიშო გამოცდა) — owner 2026-06-23, first-principles + red-team
   decided. TIME = a SEPARATE optional section, NOT a tier-advancement gate (speed-gating contradicts the
   capacity philosophy + trains racing). LOCKED until mastery (so the clock is met by a confident child →
   neutralizes anxiety). Calm total countdown; results do NOT feed advancement; NO learn-reveal (it's an
   exam, not the learning loop). Assembles EXISTING strands (pattern+rebus) — no new content. ── */
function examUnlocked(){ const s=state[profile]||{}; return (typeof kingsLevel==='function'&&kingsLevel()>=2) || (s.patTier||1)>=2 || (s.rbTier||1)>=2 || (s.mdTier||1)>=2; } // unified 3-level model: Movers/Flyers (level>=2) unlock the timed exam (CORE-1 fix)
function fmtClock(t){ t=Math.max(0,t|0); const m=Math.floor(t/60),x=t%60; return m+':'+(x<10?'0':'')+x; }
let _examTimer=null;
function examRoom(){
  if(!examUnlocked()){
    // audit fix 2026-06-28: was a jarring native alert() on a play-looking tile → friendly in-app screen.
    render(`<div class="screen" style="justify-content:center;text-align:center;gap:14px;padding:24px">
      <div style="font-size:54px;line-height:1">🦉</div>
      <h2 style="margin:0;font-size:1.3rem">ჯერ ცოტა ვივარჯიშოთ</h2>
      <p style="color:var(--muted);max-width:300px;margin:0 auto">სავარჯიშო გამოცდა გაიხსნება მას შემდეგ, რაც 🧩 კანონზომიერებასა და 🔢 რებუსში შემდეგ დონეზე ახვალ.</p>
      <button class="btn btn-primary btn-block" style="max-width:320px" onclick="openMenu('kings-math')">🧩 დავიწყოთ ვარჯიში</button>
      <button class="btn btn-ghost btn-block" style="max-width:320px" onclick="openMenu('kings-math')">უკან</button>
    </div>`,false);
    return; }
  game.mode='exam';game.kind='exam';game.shields=0;game.wrong=0;game.i=0;game.missMap=new Map();game.requeues=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);game.subj=game.subj||'kings-math';game.examEnded=false;
  const lv=(typeof kingsLevel==='function')?kingsLevel():1; const s=state[profile], pt=lv, rt=lv, mt=lv; // timed-exam difficulty follows the selected 3-level (consistent with practice; CORE-1)
  const gens=[()=>Object.assign(genPattern(pt),{_lbl:'🧩 კანონზომიერება'}),()=>Object.assign(genRebus(rt),{_lbl:'🔢 რებუსი'}),()=>Object.assign(genModel(mt),{_lbl:'📝 ამოცანა'})];
  const qs=[]; for(let i=0;i<12;i++){ qs.push(gens[i%3]()); } // mixed 3-type Kings-style mock
  game.qs=shuffle(qs); game.examLeft=8*60;
  clearInterval(_examTimer);
  _examTimer=setInterval(()=>{
    if(game.mode!=='exam'||game.examEnded){ clearInterval(_examTimer); return; }
    if(!document.querySelector('.exam-top')){ clearInterval(_examTimer); game.examEnded=true; return; } // user left
    game.examLeft--; const el=document.querySelector('#examclock'); if(el)el.textContent=fmtClock(game.examLeft);
    if(game.examLeft<=0){ clearInterval(_examTimer); examFinish(); }
  },1000);
  nextExam();
}
function nextExam(){
  if(game.examEnded)return;
  if(game.i>=game.qs.length)return examFinish();
  const q=game.qs[game.i];game.cur=q;
  gameShell(`<div class="exam-top">🏆 სავარჯიშო გამოცდა · ⏱️ <span id="examclock">${fmtClock(game.examLeft)}</span> · ${game.i+1}/${game.qs.length}</div>
    <div class="prompt"><div class="section-label">${q._lbl}</div>
      <div class="p-word" style="font-size:1.55rem;line-height:1.5;letter-spacing:1px">${q.q}</div></div>
    <div class="options">${q.opts.map(o=>`<button class="opt num" onclick="answerExam(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
}
function answerExam(btn,sel,cor){
  if(game.examEnded)return;
  const s=state[profile];
  if(sel===cor){ btn.classList.add('correct'); s.shields++;game.shields++; } else { btn.classList.add('wrong'); game.wrong++; }
  document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim');b.style.pointerEvents='none';}); save();
  setTimeout(()=>{ if(!game.examEnded){ game.i++; nextExam(); } }, 650); // exam: no learn-reveal, no tier climb
}
function examFinish(){
  if(game.examEnded)return; game.examEnded=true; clearInterval(_examTimer); game.roundActive=false;
  const tot=game.qs.length, got=game.shields, pct=tot?Math.round(got/tot*100):0, used=fmtClock(8*60-Math.max(0,game.examLeft));
  const band=pct>=80?'high':pct>=50?'mid':'low'; // REAL band from score (was hardcoded 'mid' → faked the Kings mastery signal, Dim-8 audit)
  try{ if(window.Analytics) Analytics.event('round_complete',{mode:'kings',band:band,retries:game.wrong||0}); }catch(e){}
  render(`<div class="screen results">
    <div class="r-owl">${tutorFace(profile,'3.2rem')}</div>
    <div class="r-ring"><i>${pct>=80?'🏆':pct>=50?'⭐':'🌱'}</i></div>
    <h2>${voc()}, გამოცდა დასრულდა! 💛</h2>
    <div class="stat-row">
      <div class="stat"><div class="v">${got}/${tot}</div><div class="l">სწორი</div></div>
      <div class="stat"><div class="v">${pct}%</div><div class="l">სიზუსტე</div></div>
      <div class="stat"><div class="v">${used}</div><div class="l">⏱️ დრო</div></div>
    </div>
    <div class="pat-rule" style="text-align:center">🦉 ეს იყო ნამდვილი გამოცდის რეპეტიცია. დონე აქ არ იცვლება. ისწავლე 🧩 და 🔢, მერე ისევ სცადე.</div>
    <div class="actions"><button class="btn btn-primary btn-block" onclick="openMenu('kings-math')">📋 მენიუ</button></div>
  </div>`,'home');
}

/* ── scoring ── */
function record(word,ok){
  if(typeof clearIdleHelp==='function')clearIdleHelp();   // child answered → stop the idle watch
  const s=state[profile];if(!s.words[word])s.words[word]={correct:0,wrong:0};
  // 2.3: per-word consecutive-correct streak → "ნამდვილად ნასწავლი" = 3-in-a-row (stricter than the
  // cumulative correct>=3 that drives Paths/levels, which stays unchanged so progress only moves forward).
  if(ok){s.words[word].correct++;s.words[word].streak=(s.words[word].streak||0)+1;game.shields++;s.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);}
  else{s.words[word].wrong++;s.words[word].streak=0;game.wrong++;s.streak=0;}
  // 2.2b Leitner spaced repetition: box 1..5, correct promotes / wrong resets to box 1; next due = +interval days.
  (function(){ const r=s.words[word]; const box=ok?Math.min(5,(r.box||1)+1):1; r.box=box; const D={1:1,2:2,3:4,4:7,5:14}; r.due=Date.now()+D[box]*86400000; })();
  save();
}
// 2.4: session-level movement-break clock, shared by ALL games (was vocab-only). Due every ~15 min of play.
let _lastBreakTs=0;
function breakDue(){ const now=Date.now(); if(!_lastBreakTs){_lastBreakTs=now;return false;} if(now-_lastBreakTs>15*60*1000){_lastBreakTs=now;return true;} return false; }

/* ── feedback overlay ── (2.4: tap anywhere to skip the celebration to the next item) */
function feedback(ok){
  const el=document.createElement('div');el.className='overlay';el.id='fbov';
  // The friendly OWL is the child's companion on BOTH outcomes (owner 2026-06-13: owl + 💛 heart wherever
  // we praise/encourage; never the muscle). Correct still gets the confetti party on top; wrong stays warm.
  // varied encouragement so the child does not read the identical line every time (owner 2026-06-22:
  // the tutor felt repetitive). Warm on BOTH outcomes; wrong stays gentle and never scolds.
  const _win=['ბრავო','შესანიშნავია','ყოჩაღ','გენიოსი ხარ','ზუსტად'];
  const _try=['კიდევ ცადე','თითქმის მოახერხე','ერთად შევძლებთ','ცოტაღა დარჩა','ნუ დანებდები'];
  const _txt=ok?(_win[Math.floor(Math.random()*_win.length)]+', '+voc()+'! 💛'):(voc()+', '+_try[Math.floor(Math.random()*_try.length)]+'! 💛');
  // v1.232: the owl reacts to MOMENTUM, not just the single answer — a hot streak earns a fire chip so
  // praise feels responsive instead of uniform. Reads the live consecutive-correct streak (set in record()).
  let _streakLine='';
  if(ok){ const st=(state[profile]&&state[profile].streak)||0; if(st>=5)_streakLine=`<div class="fb-streak">🔥 ${st} ზედიზედ!</div>`; }
  el.innerHTML=`<div class="fb"><div class="fb-ico">${tutorFace(profile,'5rem')}</div><div class="fb-txt">${_txt}</div>${_streakLine}</div>`;
  if(ok)el.appendChild(confettiEl());
  if(window.applyLang)applyLang(el);
  el.onclick=function(){ try{skipCeleb();}catch(e){} };
  $('.device').appendChild(el);
}
function closeFeedback(){const e=$('#fbov');if(e)e.remove();}
// F4 (systemic): voice the ANSWER first, hold a beat so the child hears it, THEN praise + show
// the celebration. Prevents the "ყოჩაღ flashes before the answer is spoken" ordering bug.
function sayThenPraise(answerText,lang,after){
  try{if(answerText!=null&&answerText!=='')speak(String(answerText),lang||'ka-GE');}catch(e){}
  const big=(typeof isBig==='function'&&isBig(profile));
  const a=big?650:1100, b=big?700:1100;
  clearCeleb();
  _celebGo=()=>{ _celebGo=null; clearCeleb(); if(after) after(); };
  _celebTimers.push(setTimeout(()=>{ try{praise();}catch(e){} feedback(true); }, a));
  _celebTimers.push(setTimeout(()=>{ if(_celebGo) _celebGo(); }, a+b));
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
  if(typeof clearIdleHelp==='function')clearIdleHelp();
  const s=state[profile],lv=levelOf(profile);
  const tot=game.shields+game.wrong,pct=tot?Math.round(game.shields/tot*100):0;
  // A4: anonymous round outcome (fire-and-forget; the app is unaffected if telemetry is down)
  game.roundActive=false;
  try{ if(window.Analytics) Analytics.event('round_complete',{mode:coarseMode(),band:pct>=80?'high':(pct>=50?'mid':'low'),retries:game.wrong||0}); }catch(e){}
  // within-session activation milestone: first completed round THIS page-load (aggregate, no id) →
  // gives the opens→first_win→completes funnel without any cross-session tracking (owner 2026-06-23).
  try{ if(window.Analytics && !window._firstWinSent){ window._firstWinSent=true; Analytics.event('first_win',{mode:coarseMode()}); } }catch(e){}
  try{ document.dispatchEvent(new Event('niko:value')); }catch(e){} // UX-3: a completed round IS the value moment → let the install nudge appear now (was dead: nothing dispatched niko:value, so the nudge only ever fired on the 28s fallback)
  const best=s.best[game.mode]||0;if(game.shields>best)s.best[game.mode]=game.shields;
  const _el=game.start?Date.now()-game.start:0;
  // on-device difficulty instrument (metrics.js): first-attempt success per mode. fire-and-forget, never blocks.
  try{ if(window.Metrics) Metrics.logRound(game.mode, game.shields||0, (game.missMap&&game.missMap.size)||0, _el, (typeof levelIdx==='function'?levelIdx(profile):0)); }catch(e){}
  s.sessions++;s.lastPlayed=new Date().toISOString();s.totalTime+=_el;
  if(typeof todayStr==='function'){if(s.todayDate!==todayStr()){s.todayMs=0;s.todayDate=todayStr();}s.todayMs=(s.todayMs||0)+_el;} // per-day screen-time
  if((game.mode||'').startsWith('math-')&&!isYoung(profile))rampMath(game.mode,pct);
  save();
  // gentle daily screen-time limit (parent-set): let this round's result show, then block further play
  if(typeof overLimit==='function'&&overLimit(profile)){setTimeout(()=>screenLimitUp(profile),2800);}
  // 2.4: shared movement-break (every ~15 min, ALL games) — let the result show first, then offer the break
  else if(breakDue()){setTimeout(()=>{try{showBreak();}catch(e){}},2800);}
  // warm 💛 signature on every tier (the ring above already shows the achievement medal 🏆/⭐/🌱).
  let msg=pct>=90?voc()+', შესანიშნავია! 💛':pct>=70?voc()+', კარგად მიდიხარ! 💛':pct>=50?voc()+', ისწავლე ახალი! 💛':voc()+', ყოველი ცდა = წინსვლა! 💛';
  let beat='';
  if(best>0){if(game.shields>best)beat=`<div class="beat up">🎉 გაჯობე გუშინს! ${best} → ${game.shields}</div>`;
    else if(game.shields===best)beat=`<div class="beat same">🤝 გუშინდელი გაიმეორე: ${game.shields}</div>`;
    else beat=`<div class="beat down">💛 გუშინ ${best} გქონდა, ხვალ აჯობებ!</div>`;}
  if(game.leveledMath)beat=`<div class="beat up">🚀 ახალი დონე გაიხსნა: <b>${game.leveledMath}</b></div>`+beat;
  render(`<div class="screen results" style="--pct:${pct}%">
    <div class="r-owl">${tutorFace(profile,'3.2rem')}</div>
    <div class="r-ring"><i>${pct>=80?'🏆':pct>=50?'⭐':'🌱'}</i></div>
    <h2>${msg}</h2>
    <div class="stat-row">
      <div class="stat"><div class="v" style="color:var(--sun-d)">${game.shields}</div><div class="l">🪙 მონეტა</div></div>
      <div class="stat"><div class="v">${pct}%</div><div class="l">სიზუსტე</div></div>
      <div class="stat"><div class="v" style="color:var(--primary-d)">${s.streak}</div><div class="l">🔥 სერია</div></div>
    </div>
    ${beat}
    ${profile==='guest'?`<div class="guest-nudge">მოგეწონა? 🌟 შექმენი პროფილი, რომ შენი 🪙 ${s.shields} მონეტა და პროგრესი შეინახო</div>
    <div class="actions">
      <button class="btn btn-primary btn-block" onclick="addChild()">✏️ შექმენი პროფილი</button>
      <button class="btn btn-ghost btn-block" onclick="replay()">↻ კიდევ ერთი</button>
    </div>`:`<div class="actions">
      <button class="btn btn-primary btn-block" onclick="replay()">↻ კიდევ ერთი</button>
      <button class="btn btn-sun btn-block" onclick="showDad(${pct})">🎉 მამას &amp; დედას აჩვენე</button>
      <button class="btn btn-ghost btn-block" onclick="openMenu(game.subj||'math')">📋 მენიუ</button>
    </div>`}
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
  if(m==='cal')return calRound();
  if(m==='kings-eng')return startKings('eng');
  if(m==='kings-math')return startKings('math');
  if(m==='count')return startCount(game.cmode);
  if(m==='digit')return startDigitQuiz();
  if(m==='read')return startReadQuiz();
  if(m==='sent')return startSentQuiz();
  if(m==='rtext')return startTextQuiz();
  if(m==='build')return startBuild();
  if(m==='math-word')return wordRound(); // CE-1: route word/pic BEFORE the generic math- catch (mirrors startGame)
  if(m==='math-pic')return picRound();
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

