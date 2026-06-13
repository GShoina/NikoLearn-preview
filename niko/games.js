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
const SUBMODES=['quiz','reverse','listen','match','spell','phrases','math-add','math-sub','math-mul','math-div','math-miss','math-pat','math-word','compare','skip','shapes','money','clock','count','kings-eng','kings-math','ka-alpha','en-alpha','read','sent','build','digit'];
function gameShell(area){
  closeHint();
  game.roundActive=true; // marks an in-progress round (cleared by results()/abandonRound())
  // A3: report the sub-mode once per round (first question only); anonymous, fire-and-forget
  if(game.i===0 && window.Analytics && SUBMODES.indexOf(game.mode)>=0){ try{ Analytics.event('submode_usage',{mode:game.mode}); }catch(e){} }
  const tot=game.qs?game.qs.length:8;
  render(`<div class="screen game" id="gscreen">
    <div class="progress-row">
      <button class="iconbtn" onclick="abandonRound()" style="width:40px;height:40px;font-size:1.1rem">←</button>
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
    game.requeues=game.requeues||0; if(game.requeues<14){game.qs.push(q);game.requeues++;}
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
  // lock options during the reveal: no tap-to-advance, no guess-spam
  document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim');b.style.pointerEvents='none';});
  if(lang!==false) revealCorrect(cor,lang||null);
  if(n>=2) setTimeout(()=>maybeOfferHelp(),650);
  game.requeues=game.requeues||0;
  if(game.requeues<14){ game.qs.push(q); game.requeues++; }  // capped so the round always terminates
  setTimeout(()=>{ game.i++; (nextFn||nextForMode())(); }, n>=2?1700:1400);
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
const MATH_WHY={
  'math-add':'შეკრება = რამდენი გახდა, როცა ერთად დადე. 🍎+🍎',
  'math-sub':'გამოკლება = რამდენი დარჩა, როცა რაღაც წაიღე. 🍎',
  'math-mul':'გამრავლება = იგივეს რამდენჯერმე შეკრება, სწრაფად. ✖️',
  'math-div':'გაყოფა = თანაბრად დაყოფა ყველას შორის. 🍪',
  'math-miss':'იპოვე გამოტოვებული რიცხვი. რა აკლია? 🔍',
  'math-pat':'იპოვე კანონზომიერება — რა მოდის შემდეგ? 🔢',
  'math-word':'ჯერ ამბავი წაიკითხე, წარმოიდგინე, მერე დათვალე. 🦉'
};
// #3b: real-life WORD PROBLEMS (Georgian, Nanobashvili-style). Story → number. Sentence frames stay
// grammatically stable for any number; items in nominative; names take the dative -ს.
const WP_NAMES=['ნიკო','მაშო','ლუკა','ანა','დათო','ნინო'];
const WP_FOOD=['ვაშლი','ბანანი','კანფეტი','მსხალი','ნამცხვარი'];      // can be EATEN
const WP_OBJ =['ბურთი','მანქანა','წიგნი','ფანქარი','ყვავილი','ბუშტი']; // had / given / found — NOT eaten
const rpick=a=>a[ri(0,a.length-1)];
function genWord(){
  const nm=rpick(WP_NAMES)+'ს', t=ri(0,5);
  if(t===0){const it=rpick(WP_OBJ),a=ri(2,9),b=ri(2,9);return{q:`${nm} ჰქონდა ${a} ${it}. კიდევ ${b} იშოვა. სულ რამდენი ${it} აქვს?`,a:a+b,op:'word'};}
  if(t===1){const it=rpick(WP_FOOD),a=ri(5,12),b=ri(1,a-1);return{q:`${nm} ჰქონდა ${a} ${it}. ${b} შეჭამა. რამდენი ${it} დარჩა?`,a:a-b,op:'word'};}
  if(t===2){const it=rpick(WP_OBJ),a=ri(5,12),b=ri(1,a-1);return{q:`${nm} ჰქონდა ${a} ${it}. ${b} მისცა მეგობარს. რამდენი ${it} დარჩა?`,a:a-b,op:'word'};}
  if(t===3){const a=ri(4,10),b=ri(1,a-1);return{q:`ხეზე იჯდა ${a} ჩიტი. ${b} გაფრინდა. რამდენი ჩიტი დარჩა?`,a:a-b,op:'word'};}
  if(t===4){const it=rpick(WP_OBJ),k=ri(2,5),m=ri(2,5);return{q:`${k} ყუთში ${m}-${m} ${it}. სულ რამდენი ${it}?`,a:k*m,op:'word'};}
  const it=rpick(WP_FOOD),a=ri(6,15),b=ri(1,a-1);return{q:`კალათში იყო ${a} ${it}. ${b} შეჭამეს. რამდენი დარჩა?`,a:a-b,op:'word'};
}
function wordRound(){game.mode='math-word';game.qs=Array.from({length:6},()=>genWord());game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextWordQ();}
function nextWordQ(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const why=game.i===0?`<div style="background:#fff8ee;border:1px solid #ffe2bd;border-radius:14px;padding:10px 14px;margin-bottom:12px;font-size:.92rem;color:#6b5640;line-height:1.45">🦉 ${MATH_WHY['math-word']}</div>`:'';
  gameShell(`${why}<div class="prompt"><div class="p-word" style="font-size:1.25rem;line-height:1.55;max-width:430px">${q.q}</div></div>
    <div class="options">${mathOpts(q.a).map(o=>`<button class="opt num" onclick="answerMath(this,${o},${q.a})">${o}</button>`).join('')}</div>`);
  $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
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
  if(type==='math-add'){const mx=young?10:(cfg.max||20);const a=ri(1,Math.floor(mx*0.7)),b=ri(1,Math.max(1,mx-a));return{q:`${a} + ${b}`,a:a+b,op:'add',a1:a,a2:b};}
  if(type==='math-sub'){const mx=young?10:(cfg.max||20);const a=ri(2,mx),b=ri(1,a-1);return{q:`${a} − ${b}`,a:a-b,op:'sub',a1:a,a2:b};}
  if(type==='math-mul'){if(cfg.twod&&!young){const t=ri(11,19),b=ri(2,9);return{q:`${t} × ${b}`,a:t*b,op:'mul',a1:t,a2:b};}const tmax=young?3:(cfg.tmax||5);const t=ri(2,tmax),b=ri(1,10);return{q:`${t} × ${b}`,a:t*b,op:'mul',a1:t,a2:b};}
  // A+ (8-9): integer division — b*c ÷ b = c, always whole
  if(type==='math-div'){const dmax=cfg.dmax||5;const b=ri(2,dmax),c=ri(2,10);return{q:`${b*c} ÷ ${b}`,a:c,op:'div',a1:b*c,a2:b};}
  // A+ (8-9): missing number — ? op y = res, answer is the missing first operand
  if(type==='math-miss'){const ops=cfg.ops||['+'];const sym=ops[ri(0,ops.length-1)];let x,y;if(sym==='×'){x=ri(2,9);y=ri(2,9);}else{x=ri(2,15);y=ri(2,15);}const res=(sym==='×')?x*y:x+y;return{q:`? ${sym} ${y} = ${res}`,a:x,op:'miss',a1:x,a2:y};}
  // pattern
  const step=ri(1,young?2:(cfg.span||2)),s=ri(1,5),seq=[s];for(let i=1;i<4;i++)seq.push(seq[i-1]+step);return{q:seq.join(', ')+', ?',a:seq[3]+step,pat:true,op:'pat',seq:seq.slice(),step};
}
function mathOpts(ans){const set=new Set([ans]);while(set.size<4){const v=ans+ri(1,Math.max(3,Math.ceil(Math.abs(ans)*0.3)+1))*(Math.random()>.5?1:-1);if(v>=0)set.add(v);}return shuffle([...set]);}
function mathRound(m){game.mode=m;game.leveledMath=null;game.qs=Array.from({length:8},()=>genMath(m));game.i=0;game.shields=0;game.wrong=0;game.missMap=new Map();game.requeues=0;game.start=Date.now();game.preLvl=levelIdx(profile);nextMath();}
function nextMath(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const canHarder=mathLvl(game.mode)<((MATH_LV[game.mode]||[{}]).length-1);
  const why=game.i===0&&MATH_WHY[game.mode]?`<div style="background:#fff8ee;border:1px solid #ffe2bd;border-radius:14px;padding:9px 14px;margin-bottom:12px;font-size:.9rem;color:#6b5640;line-height:1.4">🦉 ${MATH_WHY[game.mode]}</div>`:'';
  gameShell(`${why}<div class="prompt"><div class="p-word num" style="font-size:2.4rem;letter-spacing:2px">${q.q}</div>${q.pat?'<div class="p-sub">იპოვე კანონზომიერება</div>':''}</div>
    <div class="options">${mathOpts(q.a).map(o=>`<button class="opt num" onclick="answerMath(this,${o},${q.a})">${o}</button>`).join('')}</div>
    ${canHarder?`<button class="btn btn-ghost" style="margin-top:16px;font-size:.95rem" onclick="mathHarder()">⏫ გამირთულე</button>`:''}`);
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
  const en=(window.UILANG==='en');
  gameShell(`<div class="prompt"><div class="p-emoji" style="font-size:5rem">${q.e}</div><div class="p-sub">რა ფიგურაა?</div></div>
    <div class="options">${opts.map(o=>`<button class="opt" onclick="speak('${o.en}','en-US');answerShape(this,'${o.en}','${q.en}')">${en?o.en:o.ka}</button>`).join('')}</div>`);
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
  el.innerHTML=`<div class="fb"><div class="fb-ico">${ok?'🎉':'💪'}</div><div class="fb-txt">${ok?'ბრავო, '+voc()+'!':voc()+', კიდევ ცადე!'}</div></div>`;
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
  let msg=pct>=90?voc()+', შესანიშნავია! 🌟':pct>=70?voc()+', კარგად მიდიხარ! 💪':pct>=50?voc()+', ისწავლე ახალი! 📚':voc()+', ყოველი ცდა = წინსვლა! 🌱';
  let beat='';
  if(best>0){if(game.shields>best)beat=`<div class="beat up">🎉 გაჯობე გუშინს! ${best} → ${game.shields}</div>`;
    else if(game.shields===best)beat=`<div class="beat same">🤝 გუშინდელი გაიმეორე: ${game.shields}</div>`;
    else beat=`<div class="beat down">💪 გუშინ ${best} გქონდა, ხვალ აჯობებ!</div>`;}
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

