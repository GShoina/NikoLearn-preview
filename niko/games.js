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
function startGame(m){
  if(m==='topics'){return openTopics();}
  if(m==='phrases'){return openPhraseCats();}
  if(m==='compare')return cmpRound();
  if(m==='skip')return skipRound();
  if(m==='shapes')return shapeRound();
  if(m==='money')return moneyRound();
  if(m==='clock')return clockRound();
  if(m==='math-word')return wordRound();
  if(m==='math-pic')return picRound();
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
  if(m==='count'||m==='counting'||m==='digit')return 'counting';
  if(m==='kings-eng'||m==='kings-math')return 'kings';
  if(m==='ka-alpha'||m==='en-alpha')return 'alphabet';
  if(m==='read'||m==='sent'||m==='build'||m==='trace')return 'reading'; // Georgian reading suite
  if(m.indexOf('math')===0||['compare','skip','shapes','money','clock'].indexOf(m)>=0)return 'math';
  return 'english'; // quiz/reverse/listen/match/spell/phrases
}
// fired (fire-and-forget) when a child leaves a round before finishing it
function abandonRound(){
  if(game.roundActive){ try{ if(window.Analytics) Analytics.event('round_abandon',{mode:coarseMode()}); }catch(e){} game.roundActive=false; }
  openMenu(game.subj||'math');
}
const SUBMODES=['quiz','reverse','listen','match','spell','phrases','math-add','math-sub','math-mul','math-div','math-miss','math-pat','math-word','math-pic','compare','skip','shapes','money','clock','count','kings-eng','kings-math','ka-alpha','en-alpha','read','sent','build','digit'];
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
      <button class="iconbtn" onclick="abandonRound()" style="width:44px;height:44px;font-size:1.1rem">←</button>
      <div class="bar"><i id="gbar" style="width:${(game.i/tot)*100}%"></i></div>
      ${voiceToggleBtn()}
      <span class="q-count" id="gcount">${Math.min(game.i+1,tot)}/${tot}</span>
    </div>
    <div class="game" id="garea">${area}</div>
  </div>`,'slim');
  syncAiFab();
}
function nextWord(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i],pool=wordPool();
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
function winStep(say,lang,next){
  if(say){ try{ speak(String(say), lang||'en-US'); }catch(e){} }
  const big=(typeof isBig==='function'&&isBig(profile));
  const a=big?650:1200, b=big?1400:2500;
  clearCeleb();
  _celebGo=()=>{ _celebGo=null; clearCeleb(); closeFeedback(); if(next) next(); };
  _celebTimers.push(setTimeout(()=>{ try{praise();}catch(e){} feedback(true); }, a));
  _celebTimers.push(setTimeout(()=>{ if(_celebGo) _celebGo(); }, b));
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
  if(lang!==false) revealCorrect(cor,lang||null);
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
  const sol=solveLine(q,cor,m);
  let ov=document.getElementById('teachov'); if(ov)ov.remove();
  ov=document.createElement('div'); ov.className='overlay teach-ov'; ov.id='teachov';
  ov.innerHTML=`<div class="teach-card">
    <div class="teach-owl">${tutorFace(profile,'2.7rem')}</div>
    <div class="teach-eq">${sol.html}</div>
    <div class="teach-q" id="teachQ" style="opacity:0">${window.UILANG==='en'?'Got it?':'გაიგე?'}</div>
    <div class="teach-btns" id="teachBtns" style="opacity:0">
      <button class="teach-yes" id="teachYes">${window.UILANG==='en'?'✓ Yes':'✓ კი'}</button>
      <button class="teach-no" id="teachNo">${window.UILANG==='en'?'✗ No':'✗ არა'}</button>
    </div>
  </div>`;
  $('.device').appendChild(ov);
  // staged "slow frames" reveal: hold the question a beat, pop in the answer (+voice), then the gate.
  setTimeout(()=>{ const a=ov.querySelector('#teAns'); if(a){a.textContent=sol.answer;a.classList.add('pop');} if(lang&&typeof speak==='function'){try{speak(sol.answer,lang);}catch(e){}} },700);
  setTimeout(()=>{ const qd=ov.querySelector('#teachQ'),bd=ov.querySelector('#teachBtns'); if(qd)qd.style.opacity='1'; if(bd)bd.style.opacity='1'; },1600);
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
  'math-add':[{max:20,label:'1–20'},{max:40,label:'1–40'},{max:70,label:'1–70'},{max:100,label:'1–100'}],
  'math-sub':[{max:20,label:'1–20'},{max:40,label:'1–40'},{max:70,label:'1–70'},{max:100,label:'1–100'}],
  'math-mul':[{tmax:5,label:'×2–×5'},{tmax:9,label:'×2–×9'},{twod:true,label:'2-ნიშნა'}],
  'math-pat':[{span:2,label:''},{span:3,label:''}],
  'math-div':[{dmax:5,label:'÷2–÷5'},{dmax:10,label:'÷2–÷10'}],
  'math-miss':[{ops:['+'],label:'+'},{ops:['+','×'],label:'+ ×'}]
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
  if(type==='math-miss'){const ops=cfg.ops||['+'];const sym=ops[ri(0,ops.length-1)];let x,y;if(sym==='×'){x=ri(2,9);y=ri(2,9);}else{x=ri(2,15);y=ri(2,15);}const res=(sym==='×')?x*y:x+y;return{q:`? ${sym} ${y} = ${res}`,a:x,op:'miss',a1:x,a2:y};}
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
function mathRound(m){game.mode=m;game.leveledMath=null;game.qs=Array.from({length:8},()=>genMath(m));game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextMath();}
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
const COINS=[5,10,20,50];
function moneyRound(){game.mode='money';game.qs=Array.from({length:8},()=>{const n=ri(2,3);const coins=[];let total=0;for(let i=0;i<n;i++){const v=COINS[ri(0,COINS.length-1)];coins.push(v);total+=v;}return{coins:coins,total:total};});game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextMoney();}
function nextMoney(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const coins=q.coins.map(v=>`<span style="display:inline-flex;flex-direction:column;align-items:center;margin:2px 6px"><span style="font-size:2.6rem;line-height:1">🪙</span><b class="num" style="font-size:.95rem">${v}</b></span>`).join('');
  gameShell(`<div class="prompt"><div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-end">${coins}</div><div class="p-sub">რამდენი თეთრია?</div></div>
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

/* ── counting (Masho, zero-text) ── */
function startCount(mode){game.mode='count';game.cmode=mode;game.qs=shuffle(COUNTING).slice(0,6);game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextCount();}
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
  game.kind=kind;game.shields=0;game.wrong=0;game.i=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);
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
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();winStep(null,null,()=>{game.i++;nextKings();});}
  else{btn.classList.add('wrong','dim');state[profile].streak=0;game.wrong++;save();reQueueWrong(cor,game.kind==='eng'?'en-US':null);}
}

/* ── scoring ── */
function record(word,ok){
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
  el.innerHTML=`<div class="fb"><div class="fb-ico">${tutorFace(profile,'5rem')}</div><div class="fb-txt">${ok?'ბრავო, '+voc()+'! 💛':voc()+', კიდევ ცადე! 💛'}</div></div>`;
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
  const s=state[profile],lv=levelOf(profile);
  const tot=game.shields+game.wrong,pct=tot?Math.round(game.shields/tot*100):0;
  // A4: anonymous round outcome (fire-and-forget; the app is unaffected if telemetry is down)
  game.roundActive=false;
  try{ if(window.Analytics) Analytics.event('round_complete',{mode:coarseMode(),band:pct>=80?'high':(pct>=50?'mid':'low'),retries:game.wrong||0}); }catch(e){}
  const best=s.best[game.mode]||0;if(game.shields>best)s.best[game.mode]=game.shields;
  const _el=game.start?Date.now()-game.start:0;
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
    <div class="actions">
      <button class="btn btn-sun btn-block" onclick="showDad(${pct})">🎉 მამას &amp; დედას აჩვენე</button>
      <div class="btn-row">
        <button class="btn btn-ghost" onclick="openMenu(game.subj||'math')">📋 მენიუ</button>
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
  if(m==='read')return startReadQuiz();
  if(m==='sent')return startSentQuiz();
  if(m==='build')return startBuild();
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

