/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — placement & paths (owner ask 2026-06-10, v2.03):
   • per-SUBJECT entry diagnostic (English / Math / Georgian)
   • a data-backed "Path" (გზა) of skill milestones per subject
   • a persistent "ჯამური პროგრესი" meter across all subjects
   Self-contained: own `pl` state, reuses render/topbar/shuffle.
   ═══════════════════════════════════════════════════════════ */

let pl = null;

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
const SUBJ_DIAG = {
  english:[
    {kind:'pic', emoji:'🍎', q:'რომელია?', a:'apple', opts:['apple','book','dog']},
    {kind:'tr',  q:'ცხენი', a:'horse', opts:['horse','house','mouse']},
    {kind:'spell', emoji:'🐶', q:'რომელია სწორად დაწერილი?', a:'dog', opts:['dog','dawg','doog']},
    {kind:'en2ka', q:'happy', a:'ბედნიერი', opts:['ბედნიერი','მწუხარე','დაღლილი']}
  ],
  math:[
    {kind:'num', q:'3 + 4', a:'7', opts:['7','6','8']},
    {kind:'num', q:'12 + 9', a:'21', opts:['21','19','22']},
    {kind:'num', q:'15 − 6', a:'9', opts:['9','8','11']},
    {kind:'num', q:'6 × 7', a:'42', opts:['42','36','48']}
  ],
  'ka-alpha':[
    {kind:'letter', q:'რომელია „ა"?', a:'ა', opts:['ა','ბ','გ']},
    {kind:'letter', q:'რომელია „ო"?', a:'ო', opts:['ო','ე','უ']},
    {kind:'syl', emoji:'🍎', q:'რომელი მარცვლით იწყება „ვაშლი"?', a:'ვა', opts:['ვა','მა','სა']},
    {kind:'word', q:'წაიკითხე: რომელია „დედა"?', a:'დედა', opts:['დედა','მამა','ბაბუ']}
  ]
};

function startSubjDiag(p,subj){
  profile=p;
  pl={subj, qs:(SUBJ_DIAG[subj]||[]).slice(), i:0, got:0};
  pl.max=pl.qs.length;
  plNext();
}
function skipSubjDiag(p,subj){
  const s=state[p]; if(!s.subjDiag)s.subjDiag={};
  s.subjDiag[subj]={done:true,skipped:true,date:new Date().toISOString()};
  save(); openMenu(subj);
}
function plNext(){
  if(pl.i>=pl.qs.length) return diagResult();
  const q=pl.qs[pl.i];
  const opts=shuffle(q.opts);
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
      <div class="bar"><i style="width:${(pl.i/pl.qs.length)*100}%"></i></div>
      <span class="q-count">${pl.i+1}/${pl.qs.length}</span>
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
  if(ok){ pl.got++; try{praise();}catch(e){} }
  else { const r=[...document.querySelectorAll('.opt')].find(b=>b.textContent===String(cor)); if(r){r.classList.remove('dim');r.classList.add('correct');} }
  setTimeout(()=>{ pl.i++; plNext(); }, ok?700:1100);
}
// score → recommended START milestone on this subject's path + a level word
function diagResult(){
  const subj=pl.subj, pct=pl.max?Math.round(pl.got/pl.max*100):0;
  const path=PATHS[subj]||[];
  // higher score → start further along the path (but never past what real data already mastered)
  let startIdx = pct>=75?Math.min(2,path.length-1) : pct>=45?1 : 0;
  const level = pct>=75?'მაღალი' : pct>=45?'საშუალო' : 'დაწყებითი';
  const s=state[profile]; if(!s.subjDiag)s.subjDiag={};
  s.subjDiag[subj]={done:true,skipped:false,date:new Date().toISOString(),pct,level,startIdx};
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
    <div class="path-top"><b>🧭 შენი გზა — ${pathDisplayName(subj)}</b><span class="path-pct">${pr.done}/${pr.total}</span></div>
    <div class="path-steps">${steps}</div>
    ${startHint?`<div class="path-hint">${startHint}</div>`:''}
  </div>`;
}
