/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — placement & paths (owner ask 2026-06-10, v2.03):
   • per-SUBJECT entry diagnostic (English / Math / Georgian)
   • a data-backed "Path" (გზა) of skill milestones per subject
   • a persistent "ჯამური პროგრესი" meter across all subjects
   Self-contained: own `pl` state, reuses render/topbar/shuffle.

   v3 PLACEMENT UPGRADE — LAYER (a), 2026-06-18 (owner-scoped 2-layer split):
   The diagnostic engine is now a real ADAPTIVE test, running on the EXISTING question sets
   (no new Georgian copy → ships fast, no Gemini gate):
   • Each item is tagged d:1 (easy) · 2 (medium) · 3 (hard). The test asks PL_ASK items ADAPTIVELY:
     a right answer steps difficulty UP, a wrong one steps it DOWN, so it converges on the child's
     real ceiling instead of asking a fixed flat list.
   • 4 options where adding one is NOT translatable copy (English distractor / extra numeral / extra
     letter). en2ka + word items keep their original 3 Georgian options. The GUESSING-CORRECTION is
     OPTION-COUNT-AWARE: a wrong answer costs 1/(opts−1), so mixed 3/4-option items score correctly
     and lucky guesses don't inflate the placement.
   LAYER (b) — the ~30/subject/age pools with NEW Georgian content — is staged in
   docs/PLACEMENT_LAYER_B.staging.js, pending Gemini KA-QA + owner gate, then merged here.
   The Path / real-data mastery system below is UNCHANGED (it is the strong part — keep it).
   ═══════════════════════════════════════════════════════════ */

let pl = null;
const PL_ASK = 9;       // questions presented per diagnostic (drawn adaptively from the pool)

/* ── mastery helpers (read REAL play data, so the Path reflects actual learning) ── */
function wordsMastered(p){const s=state[p];return s&&s.words?Object.values(s.words).filter(w=>w.correct>=3).length:0;}
// 2.3: "truly learned" = answered correctly 3 times IN A ROW (stricter than cumulative wordsMastered)
function wordsLearned(p){const s=state[p];return s&&s.words?Object.values(s.words).filter(w=>(w.streak||0)>=3).length:0;}
// 2.2b: words reinforced through spaced repetition (Leitner box advanced to 3+)
function wordsReinforced(p){const s=state[p];return s&&s.words?Object.values(s.words).filter(w=>(w.box||0)>=3).length:0;}
function phrasesDone(p){const s=state[p];return s&&s.phrases?Object.values(s.phrases).filter(v=>v.correct>=2).length:0;}
function opAcc(p,op){const m=(state[p]&&state[p].math&&state[p].math[op])||null;if(!m)return 0;const t=m.correct+m.wrong;return t>=4?m.correct/t:0;}
function alphaAcc(p,k){const a=(state[p]&&state[p].alpha&&state[p].alpha[k])||null;if(!a)return 0;const t=a.correct+a.wrong;return t>=4?a.correct/t:0;}
function bestAtLeast(p,mode,n){const b=state[p]&&state[p].best&&state[p].best[mode];return !!b&&b>=n;}

/* ── PATHS: ordered skill milestones per subject. `m(p)` = mastered? (from real data). ── */
const PATHS = {
  english: [
    {k:'w10',   label:'10 სიტყვა',     m:p=>wordsMastered(p)>=10, go:"openMenu('english')"},
    {k:'w25',   label:'25 სიტყვა',     m:p=>wordsMastered(p)>=25, go:"openMenu('english')"},
    {k:'phr',   label:'ფრაზები',       m:p=>phrasesDone(p)>=5,    go:"openPhraseCats()"},
    {k:'w50',   label:'50 სიტყვა',     m:p=>wordsMastered(p)>=50, go:"openMenu('english')"},
    {k:'kings', label:'კინგსი (YLE)',  m:p=>bestAtLeast(p,'kings-eng',7), go:"startKings('eng')"}
  ],
  math: [
    {k:'add',    label:'შეკრება',     m:p=>opAcc(p,'math-add')>=0.8, go:"startGame('math-add')"},
    {k:'sub',    label:'გამოკლება',   m:p=>opAcc(p,'math-sub')>=0.8, go:"startGame('math-sub')"},
    {k:'shapes', label:'ფიგურები',    m:p=>opAcc(p,'shapes')>=0.8,   go:"shapeRound()"},
    {k:'mul',    label:'გამრავლება',  m:p=>opAcc(p,'math-mul')>=0.8, go:"startGame('math-mul')"},
    {k:'kings',  label:'ოლიმპიადა',   m:p=>bestAtLeast(p,'kings-math',6), go:"startKings('math')"}
  ],
  'ka-alpha': [
    {k:'letters', label:'ასოები',     m:p=>alphaAcc(p,'ka-alpha')>=0.8, go:"alphaLearn('ka-alpha',0)"},
    {k:'read',    label:'კითხვა',     m:p=>!!(state[p].read&&state[p].read.done), go:"readLearn(0)"},
    {k:'build',   label:'ააწყვე',     m:p=>!!(state[p].build&&state[p].build.done), go:"startBuild()"},
    {k:'write',   label:'ამოწერა',    m:p=>!!(state[p].trace&&state[p].trace.done), go:"traceLearn(0)"}
  ]
};
const PATH_SUBJS = ['english','math','ka-alpha'];
// age-aware path: a young child's math menu only has add/sub/shapes, so their Path shows only those
// 3 milestones (no გამრავლება/ოლიმპიადა they can't reach → no permanently-stuck steps). (2026-06-11)
function pathFor(p,subj){
  if(subj==='math' && isYoung(p)) return PATHS.math.filter(m=>['add','sub','shapes'].indexOf(m.k)>=0);
  return PATHS[subj]||[];
}
function pathDisplayName(subj){return {english:'ინგლისური',math:'მათემატიკა','ka-alpha':'ქართული'}[subj]||subj;}
// locative case ("in X") — Georgian drops the final vowel for ი-ending words, so it is pre-declined here
function pathLocName(subj){return {english:'ინგლისურში',math:'მათემატიკაში','ka-alpha':'ქართულში'}[subj]||(pathDisplayName(subj)+'ში');}

// progress within one subject path
function subjProgress(p,subj){
  const path=pathFor(p,subj);let done=0,nextIdx=-1;
  for(let i=0;i<path.length;i++){ if(path[i].m(p)) done++; else if(nextIdx<0) nextIdx=i; }
  return {done,total:path.length,pct:path.length?Math.round(done/path.length*100):0,nextIdx:nextIdx<0?path.length-1:nextIdx,allDone:done===path.length};
}
// persistent total progress across every path (always measured, even with free-roam)
function totalProgress(p){
  let done=0,total=0;
  PATH_SUBJS.forEach(subj=>{const pr=subjProgress(p,subj);done+=pr.done;total+=pr.total;});
  return {done,total,pct:total?Math.round(done/total*100):0};
}

/* ── per-subject entry diagnostic ── */
function subjDiagNeeded(p,subj){
  const s=state[p];
  // young kids (≤5) skip the Math entry diagnostic: its questions (6×7, 15−6) are age-inappropriate.
  // They go straight to the age-tuned math menu (add/sub/shapes) instead. (owner ask 2026-06-11)
  if(subj==='math' && isYoung(p)) return false;
  return PATH_SUBJS.indexOf(subj)>=0 && !(s.subjDiag&&s.subjDiag[subj]);
}

/* ── ADAPTIVE ITEM POOLS — LAYER (a): the EXISTING questions, difficulty-tagged, with a 4th option
   ONLY where it is not translatable copy (English distractor / numeral / letter). en2ka + word
   items stay at their original 3 Georgian options. Subjects taken by both ages carry {young,big}.
   Math is a flat array (young kids skip it). diagSet() picks the right set by isYoung().
   (Bigger ~30 pools with new Georgian content = layer (b), staged for Gemini-QA.) ── */
const SUBJ_DIAG = {
  english:{
    young:[ // 3-5: hear the word + see the picture, pick the English word (English options → no QA)
      {kind:'pic', emoji:'🍎', q:'რომელია?', a:'apple',  opts:['apple','ball','sun','cat'],   d:1},
      {kind:'pic', emoji:'🐶', q:'რომელია?', a:'dog',    opts:['dog','cat','cow','pig'],      d:1},
      {kind:'pic', emoji:'🐱', q:'რომელია?', a:'cat',    opts:['cat','dog','fish','bird'],    d:1},
      {kind:'pic', emoji:'☀️', q:'რომელია?', a:'sun',    opts:['sun','star','moon','sky'],    d:1},
      {kind:'pic', emoji:'⚽', q:'რომელია?', a:'ball',   opts:['ball','book','box','bell'],   d:2},
      {kind:'pic', emoji:'🐟', q:'რომელია?', a:'fish',   opts:['fish','frog','bird','fox'],   d:2},
      {kind:'pic', emoji:'🚗', q:'რომელია?', a:'car',    opts:['car','bus','cup','can'],      d:2},
      {kind:'pic', emoji:'⭐', q:'რომელია?', a:'star',   opts:['star','sun','heart','moon'],  d:2},
      {kind:'pic', emoji:'🍌', q:'რომელია?', a:'banana', opts:['banana','apple','lemon','orange'], d:3},
      {kind:'pic', emoji:'🐻', q:'რომელია?', a:'bear',   opts:['bear','bee','bird','boy'],    d:3}
    ],
    big:[ // 6-9: translation / spelling / meaning. pic/tr/spell → 4 English opts; en2ka → 3 original ka opts
      {kind:'pic', emoji:'🍎', q:'რომელია?', a:'apple', opts:['apple','book','dog','ball'], d:1},
      {kind:'tr',  q:'ცხენი', a:'horse', opts:['horse','house','mouse','horn'], d:1},
      {kind:'spell', emoji:'🐶', q:'რომელია სწორად დაწერილი?', a:'dog', opts:['dog','dawg','doog','dogg'], d:1},
      {kind:'en2ka', q:'happy', a:'ბედნიერი', opts:['ბედნიერი','მწუხარე','დაღლილი'], d:1},
      {kind:'tr',  q:'წიგნი', a:'book', opts:['book','look','cook','foot'], d:2},
      {kind:'en2ka', q:'big', a:'დიდი', opts:['დიდი','პატარა','მაღალი'], d:2},
      {kind:'spell', emoji:'🐱', q:'რომელია სწორად დაწერილი?', a:'cat', opts:['cat','kat','catt','cad'], d:2},
      {kind:'tr',  q:'წყალი', a:'water', opts:['water','winter','wonder','weather'], d:2},
      {kind:'en2ka', q:'run', a:'სირბილი', opts:['სირბილი','ხტომა','ცურვა'], d:3},
      {kind:'spell', emoji:'⭐', q:'რომელია სწორად დაწერილი?', a:'star', opts:['star','stahr','starr','stair'], d:3}
    ]
  },
  math:[ // 6-9 only (young kids skip per subjDiagNeeded). numeric → no Georgian QA.
    {kind:'num', q:'2 + 3', a:'5', opts:['5','4','6','8'], d:1},
    {kind:'num', q:'7 + 5', a:'12', opts:['12','11','13','10'], d:1},
    {kind:'num', q:'9 − 4', a:'5', opts:['5','6','4','13'], d:1},
    {kind:'num', q:'13 − 5', a:'8', opts:['8','7','9','18'], d:2},
    {kind:'num', q:'14 + 8', a:'22', opts:['22','21','24','20'], d:2},
    {kind:'num', q:'12 + 9', a:'21', opts:['21','19','22','23'], d:2},
    {kind:'num', q:'20 − 7', a:'13', opts:['13','12','14','27'], d:2},
    {kind:'num', q:'4 × 3', a:'12', opts:['12','7','9','15'], d:3},
    {kind:'num', q:'6 × 7', a:'42', opts:['42','36','48','49'], d:3},
    {kind:'num', q:'8 × 6', a:'48', opts:['48','42','54','56'], d:3}
  ],
  'ka-alpha':{
    young:[ // 3-5: pure letter recognition (letters are factual glyphs, not translatable copy → no QA)
      {kind:'letter', q:'რომელია „ა"?', a:'ა', opts:['ა','ბ','გ','ო'], d:1},
      {kind:'letter', q:'რომელია „ო"?', a:'ო', opts:['ო','ე','უ','ა'], d:1},
      {kind:'letter', q:'რომელია „მ"?', a:'მ', opts:['მ','ნ','ლ','შ'], d:1},
      {kind:'letter', q:'რომელია „ს"?', a:'ს', opts:['ს','შ','ზ','ც'], d:2},
      {kind:'letter', q:'რომელია „დ"?', a:'დ', opts:['დ','ტ','თ','ბ'], d:2},
      {kind:'letter', q:'რომელია „ბ"?', a:'ბ', opts:['ბ','ვ','გ','დ'], d:2},
      {kind:'letter', q:'რომელია „ი"?', a:'ი', opts:['ი','უ','ე','ო'], d:2},
      {kind:'letter', q:'რომელია „რ"?', a:'რ', opts:['რ','ლ','ნ','მ'], d:2},
      {kind:'letter', q:'რომელია „ე"?', a:'ე', opts:['ე','ა','ო','ვ'], d:3},
      {kind:'letter', q:'რომელია „ლ"?', a:'ლ', opts:['ლ','რ','მ','ნ'], d:3}
    ],
    big:[ // 6-9: letters (4-opt) + syllables + reading words (syl/word keep original 3 ka options)
      {kind:'letter', q:'რომელია „ა"?', a:'ა', opts:['ა','ბ','გ','ო'], d:1},
      {kind:'letter', q:'რომელია „ო"?', a:'ო', opts:['ო','ე','უ','ა'], d:1},
      {kind:'letter', q:'რომელია „ჭ"?', a:'ჭ', opts:['ჭ','ჩ','წ','ც'], d:2},
      {kind:'letter', q:'რომელია „ჯ"?', a:'ჯ', opts:['ჯ','ჟ','ძ','ზ'], d:2},
      {kind:'syl', emoji:'🍎', q:'რომელი მარცვლით იწყება „ვაშლი"?', a:'ვა', opts:['ვა','მა','სა'], d:2},
      {kind:'syl', emoji:'🐶', q:'რომელი მარცვლით იწყება „ძაღლი"?', a:'ძა', opts:['ძა','ცა','წა'], d:2},
      {kind:'word', q:'წაიკითხე: რომელია „დედა"?', a:'დედა', opts:['დედა','მამა','ბაბუ'], d:3},
      {kind:'word', q:'წაიკითხე: რომელია „წიგნი"?', a:'წიგნი', opts:['წიგნი','ჩიტი','ცხენი'], d:3},
      {kind:'word', q:'წაიკითხე: რომელია „სახლი"?', a:'სახლი', opts:['სახლი','თაგვი','კარი'], d:3},
      {kind:'word', q:'წაიკითხე: რომელია „მზე"?', a:'მზე', opts:['მზე','ცა','ღამე'], d:3}
    ]
  }
};

// pick the age-appropriate question pool: flat array (math) → as-is; {young,big} → by isYoung(p).
function diagSet(p,subj){
  const d=SUBJ_DIAG[subj]; if(!d) return [];
  if(Array.isArray(d)) return d;
  return (isYoung(p)?d.young:d.big) || d.big || d.young || [];
}
// how many questions the diagnostic will actually ASK (for the pre-start "X კითხვა" preview)
function plAskCount(p,subj){ return Math.min(PL_ASK, diagSet(p,subj).length); }

function startSubjDiag(p,subj){
  profile=p;
  const set=diagSet(p,subj).slice();
  // bucket the pool by difficulty so the adaptive engine can move up/down between questions
  const byLevel={1:[],2:[],3:[]};
  set.forEach(q=>{ const d=q.d||2; (byLevel[d]||byLevel[2]).push(q); });
  Object.keys(byLevel).forEach(k=>{ byLevel[k]=shuffle(byLevel[k]); });
  pl={subj, byLevel, used:[], level:2, i:0, got:0, wrong:0, ask:Math.min(PL_ASK,set.length), log:[], cur:null};
  plNext();
}
function skipSubjDiag(p,subj){
  const s=state[p]; if(!s.subjDiag)s.subjDiag={};
  s.subjDiag[subj]={done:true,skipped:true,date:new Date().toISOString()};
  save(); openMenu(subj);
}
// adaptive pick: prefer the current difficulty, else fan out to the nearest level that still has an unused item
function plPick(){
  const order=[pl.level, pl.level+1, pl.level-1, pl.level+2, pl.level-2];
  for(const lv of order){
    const arr=pl.byLevel[lv]; if(!arr) continue;
    for(const q of arr){ if(pl.used.indexOf(q)<0) return q; }
  }
  return null;
}
function plNext(){
  if(pl.i>=pl.ask) return diagResult();
  const q=plPick();
  if(!q) return diagResult(); // pool exhausted (fail safe)
  pl.used.push(q); pl.cur=q;
  const opts=shuffle(q.opts.slice());
  const head=q.emoji?`<div class="p-emoji" style="font-size:3.4rem">${q.emoji}</div>`:'';
  const isNum=q.kind==='num';
  const isEn=(q.kind==='pic'||q.kind==='tr'||q.kind==='spell');
  const prompt=isNum
    ? `<div class="p-word num" style="font-size:2.4rem;letter-spacing:2px">${q.q}</div>`
    : `<div class="p-word" style="font-size:1.3rem">${q.q}</div>`;
  const optCls=isNum?'opt num':(isEn?'opt en':'opt');
  render(`<div class="screen game" id="gscreen">
    <div class="progress-row">
      <button class="iconbtn" onclick="skipSubjDiag('${profile}','${pl.subj}')" style="width:40px;height:40px;font-size:1.1rem">←</button>
      <div class="bar"><i style="width:${(pl.i/pl.ask)*100}%"></i></div>
      <span class="q-count">${pl.i+1}/${pl.ask}</span>
    </div>
    <div class="game">
      <div class="prompt">${head}${prompt}<div class="p-sub">რომელია სწორი?</div></div>
      <div class="options">${opts.map(o=>`<button class="${optCls}" onclick="plAnswer(this,'${String(o).replace(/'/g,"\\'")}','${String(q.a).replace(/'/g,"\\'")}')">${o}</button>`).join('')}</div>
    </div>
  </div>`,'slim');
  try{ if(q.kind==='pic') speak(q.a,'en-US'); }catch(e){}
}
function plAnswer(btn,sel,cor){
  const ok=String(sel)===String(cor);
  document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
  btn.classList.remove('dim'); btn.classList.add(ok?'correct':'wrong');
  const d=(pl.cur&&pl.cur.d)||2;
  const n=(pl.cur&&pl.cur.opts&&pl.cur.opts.length)||4; // option count → option-count-aware guess correction
  pl.log.push({d,ok,n});
  if(ok){ pl.got++; pl.level=Math.min(3,pl.level+1); try{praise();}catch(e){} }
  else { pl.wrong++; pl.level=Math.max(1,pl.level-1);
    const r=[...document.querySelectorAll('.opt')].find(b=>b.textContent===String(cor)); if(r){r.classList.remove('dim');r.classList.add('correct');} }
  setTimeout(()=>{ pl.i++; plNext(); }, ok?700:1100);
}
// corrected score → recommended START milestone on this subject's path + a level word
function diagResult(){
  const subj=pl.subj;
  const asked=pl.log.length||pl.i||1;
  // GUESSING-CORRECTION (formula scoring), OPTION-COUNT-AWARE: a wrong answer is worth the chance of a
  // lucky guess, 1/(opts−1). Subtracting it stops a child who guessed from placing high. Floor at 0.
  let adj=pl.got;
  pl.log.forEach(r=>{ if(!r.ok) adj -= 1/(((r.n||4)-1)||1); });
  adj=Math.max(0,adj);
  const pct=Math.round(adj/asked*100);
  // hardest difficulty tier the child actually answered correctly (0 = none) — lifts a borderline start
  const maxOkD=pl.log.reduce((m,r)=>r.ok&&r.d>m?r.d:m,0);
  const path=PATHS[subj]||[];
  // higher corrected score → start further along the path (but never past what real data already mastered)
  let startIdx = pct>=75?Math.min(2,path.length-1) : pct>=45?1 : 0;
  // passing a HARD item with a mid score still earns a higher start (adaptive proof of ability)
  if(maxOkD>=3 && startIdx<2 && pct>=55) startIdx=Math.min(2,path.length-1);
  const level = pct>=75?'მაღალი' : pct>=45?'საშუალო' : 'დაწყებითი';
  const s=state[profile]; if(!s.subjDiag)s.subjDiag={};
  s.subjDiag[subj]={done:true,skipped:false,date:new Date().toISOString(),pct,level,startIdx,asked,maxOkD};
  // math: SEED the in-game number level from the diagnostic, so a strong child does not start at 1-20.
  if(subj==='math'){ if(!s.mathLevel)s.mathLevel={}; const seed=(pct>=80||maxOkD>=3)?2:((pct>=55||maxOkD>=2)?1:0);
    ['math-add','math-sub'].forEach(op=>{ s.mathLevel[op]=Math.max(s.mathLevel[op]||0, seed); });
    if(seed>=1) s.mathLevel['math-mul']=Math.max(s.mathLevel['math-mul']||0, seed-1); }
  save();
  const start=path[startIdx]?path[startIdx].label:'';
  render(`<div class="screen results" style="--pct:${pct}%">
    <div class="r-ring"><i>🧭</i></div>
    <h2>${voc()}, ${pathLocName(subj)} შენი დონეა: <span style="color:var(--primary-d)">${level}</span></h2>
    <div class="insight" style="max-width:340px;margin:6px auto"><div class="ii">${I.spark}</div><div class="it"><b>👉 დაიწყე აქედან</b><br><b>${start}</b>. <span>შენი გზა ქვემოთ ჩანს, ნაბიჯ-ნაბიჯ.</span></div></div>
    <div class="actions">
      <button class="btn btn-primary btn-block" onclick="openMenu('${subj}')">ვნახოთ ჩემი გზა →</button>
    </div>
  </div>`,'home');
  try{ if(isYoung(profile)) praise(); }catch(e){}
}
function pathDisplayNameSafe(subj){return pathDisplayName(subj);}

/* ── the visible "Path" (გზა) shown at the top of a subject menu ── */
function renderPathStrip(subj){
  if(PATH_SUBJS.indexOf(subj)<0) return '';
  const p=profile, path=pathFor(p,subj);
  const pr=subjProgress(p,subj);
  const diag=(state[p].subjDiag&&state[p].subjDiag[subj])||null;
  const startIdx=diag&&!diag.skipped?diag.startIdx:0;
  const steps=path.map((m,i)=>{
    const done=m.m(p);
    const isNext=(i===pr.nextIdx)&&!done;
    const cls=done?'pstep done':(isNext?'pstep next':'pstep');
    const tick=done?'✓':(isNext?'▶':(i+1));
    const onclick=isNext?` onclick="${m.go}"`:'';
    return `<div class="${cls}"${onclick}><span class="pdot">${tick}</span><span class="plabel">${m.label}</span></div>`;
  }).join('<span class="parrow">·</span>');
  const startHint=pr.allDone?'მთელი გზა გაიარე! 🎉':(diag&&!diag.skipped?`რეკომენდებული დასაწყისი: <b>${path[startIdx]?path[startIdx].label:''}</b>`:'');
  return `<div class="pathcard">
    <div class="path-top"><b>🧭 შენი გზა: ${pathDisplayName(subj)}</b><span class="path-pct">${pr.done}/${pr.total}</span></div>
    <div class="path-steps">${steps}</div>
    ${startHint?`<div class="path-hint">${startHint}</div>`:''}
  </div>`;
}
