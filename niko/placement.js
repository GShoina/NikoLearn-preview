/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — placement: a short entry diagnostic that gauges
   the child's level and recommends where to start. Owner ask
   2026-06-10. Self-contained: own `pl` state, reuses render/topbar.
   ═══════════════════════════════════════════════════════════ */

let pl = null;

// new child, hasn't been assessed and hasn't played yet → offer the diagnostic
function placementNeeded(p){
  const s = state[p];
  return !!s && !(s.placement && s.placement.done) && (s.sessions || 0) === 0;
}

// leveled question banks. diff weight: easy=1, medium=2, hard=3.
function plBankOlder(){
  return [
    {subj:'english',diff:1,kind:'pic', emoji:'🍎', q:'რომელია?', a:'apple', opts:['apple','book','dog']},
    {subj:'english',diff:2,kind:'tr',  q:'ცხენი', a:'horse', opts:['horse','house','mouse']},
    {subj:'math',   diff:1,kind:'num', q:'3 + 4', a:'7', opts:['7','6','8']},
    {subj:'math',   diff:2,kind:'num', q:'12 + 9', a:'21', opts:['21','19','22']},
    {subj:'math',   diff:3,kind:'num', q:'6 × 7', a:'42', opts:['42','36','48']},
    {subj:'english',diff:3,kind:'tr',  q:'მასწავლებელი', a:'teacher', opts:['teacher','student','doctor']},
    {subj:'english',diff:2,kind:'pic', emoji:'🐶', q:'რომელია?', a:'dog', opts:['dog','cat','cow']},
    {subj:'english',diff:3,kind:'en2ka', q:'happy', a:'ბედნიერი', opts:['ბედნიერი','მწუხარე','დაღლილი']}
  ];
}
function plBankYoung(){
  return [
    {subj:'counting',diff:1,kind:'count', emoji:'🍎🍎🍎', q:'რამდენია?', a:'3', opts:['3','2','4']},
    {subj:'counting',diff:1,kind:'count', emoji:'⭐⭐', q:'რამდენია?', a:'2', opts:['2','3','1']},
    {subj:'ka-alpha',diff:1,kind:'letter', q:'რომელია „ა"?', a:'ა', opts:['ა','ბ','გ']},
    {subj:'en-alpha',diff:2,kind:'letter', q:'რომელია „B"?', a:'B', opts:['B','D','P']},
    {subj:'counting',diff:2,kind:'count', emoji:'🐥🐥🐥🐥🐥', q:'რამდენია?', a:'5', opts:['5','4','6']}
  ];
}

function placementIntro(p){
  profile = p;
  const young = isYoung(p);
  render(`<div class="screen" style="justify-content:center;text-align:center;gap:16px;padding:24px">
    <div style="font-size:4rem">🧭</div>
    <h2>ვნახოთ, რა იცი</h2>
    <p style="color:var(--muted);max-width:300px;line-height:1.5">სულ რაღაც ${young?'5':'8'} კითხვა, რომ ნიკომ გაიგოს, რა იცი და საიდან დავიწყოთ. ეს ტესტი კი არა, თამაშია! 🦉</p>
    <button class="btn btn-primary btn-block" style="max-width:300px" onclick="startPlacement('${p}')">დავიწყოთ →</button>
    <button class="btn btn-ghost btn-block" style="max-width:300px" onclick="skipPlacement('${p}')">მოგვიანებით</button>
  </div>`, false);
}
function skipPlacement(p){
  const s = state[p];
  s.placement = {done:true, skipped:true, date:new Date().toISOString()};
  save();
  selectProfile(p);
}

function startPlacement(p){
  profile = p;
  pl = {qs: isYoung(p) ? plBankYoung() : plBankOlder(), i:0, got:0, max:0, young:isYoung(p)};
  pl.qs.forEach(q => pl.max += q.diff);
  // snapshot the starting point so the parent can later see growth
  pl.startLearned = levelOf(p).learned;
  pl.startLevel = levelOf(p).name;
  plNext();
}
function plNext(){
  if(pl.i >= pl.qs.length) return plResult();
  const q = pl.qs[pl.i];
  const opts = shuffle(q.opts);
  const head = q.emoji ? `<div class="p-emoji" style="font-size:3.4rem">${q.emoji}</div>` : '';
  const isEn = (q.kind==='pic' || q.kind==='tr');
  const isNum = (q.kind==='num' || q.kind==='count');
  const prompt = q.kind==='num'
    ? `<div class="p-word num" style="font-size:2.4rem;letter-spacing:2px">${q.q}</div>`
    : `<div class="p-word" style="font-size:1.3rem">${q.q}</div>`;
  const optCls = isNum ? 'opt num' : (isEn ? 'opt en' : 'opt');
  render(`<div class="screen game" id="gscreen">
    <div class="progress-row">
      <button class="iconbtn" onclick="skipPlacement('${profile}')" style="width:40px;height:40px;font-size:1.1rem">←</button>
      <div class="bar"><i style="width:${(pl.i/pl.qs.length)*100}%"></i></div>
      <span class="q-count">${pl.i+1}/${pl.qs.length}</span>
    </div>
    <div class="game">
      <div class="prompt">${head}${prompt}<div class="p-sub">რომელია სწორი?</div></div>
      <div class="options">${opts.map(o=>`<button class="${optCls}" onclick="plAnswer(this,'${String(o).replace(/'/g,"\\'")}','${String(q.a).replace(/'/g,"\\'")}')">${o}</button>`).join('')}</div>
    </div>
  </div>`, 'slim');
  // voice the English target for the en questions (recorded ka clip for ka ones via the audio layer)
  try{
    if(q.kind==='tr' || q.kind==='en2ka'){ /* read after pick */ }
    else if(q.kind==='pic'){ speak(q.a,'en-US'); }
  }catch(e){}
}
function plAnswer(btn, sel, cor){
  const q = pl.qs[pl.i];
  const ok = String(sel)===String(cor);
  document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
  btn.classList.remove('dim');
  btn.classList.add(ok?'correct':'wrong');
  if(ok){ pl.got += q.diff; try{praise();}catch(e){} }
  else { const right=[...document.querySelectorAll('.opt')].find(b=>b.textContent===String(cor)); if(right){right.classList.remove('dim');right.classList.add('correct');} }
  setTimeout(()=>{ pl.i++; plNext(); }, ok?700:1100);
}

// map score → level bucket + a concrete, honest recommendation tied to a real subject
function plVerdict(){
  const pct = pl.max ? Math.round(pl.got/pl.max*100) : 0;
  if(pl.young){
    if(pl.got >= Math.round(pl.max*0.7))
      return {pct, level:'კარგი დასაწყისი', reco:'ანბანი და დათვლა უკვე იცი. დაიწყე „ისწავლე ასოები" და „დათვალე".', subj:'ka-alpha'};
    return {pct, level:'პატარა ნაბიჯები', reco:'დავიწყოთ ნელა: ასოები და რიცხვები ხატულებითა და ხმით.', subj:'counting'};
  }
  if(pct >= 75) return {pct, level:'მაღალი', reco:'მაგარი ხარ! დაიწყე კინგსი (Cambridge YLE) და გამრავლება.', subj:'kings-eng'};
  if(pct >= 45) return {pct, level:'საშუალო', reco:'საფუძველი უკვე გაქვს. დაიწყე ინგლისური სიტყვებითა და შეკრება-გამოკლებით.', subj:'english'};
  return {pct, level:'დაწყებითი', reco:'დავიწყოთ თავიდან: ანბანი, თვლა და მოსმენა.', subj:'ka-alpha'};
}
function plResult(){
  const v = plVerdict();
  const s = state[profile];
  s.placement = {
    done:true, skipped:false, date:new Date().toISOString(),
    pct:v.pct, level:v.level, reco:v.reco, subj:v.subj,
    startLearned: pl.startLearned, startLevel: pl.startLevel
  };
  save();
  render(`<div class="screen results" style="--pct:${v.pct}%">
    <div class="r-ring"><i>🧭</i></div>
    <h2>${voc()}, აი შენი დონე: <span style="color:var(--primary-d)">${v.level}</span></h2>
    <div class="insight" style="max-width:340px;margin:6px auto"><div class="ii">${I.spark}</div><div class="it"><b>👉 რეკომენდაცია</b><br>${v.reco}</div></div>
    <div class="actions">
      <button class="btn btn-primary btn-block" onclick="placementStart()">დავიწყოთ თამაში →</button>
      <button class="btn btn-ghost btn-block mt" onclick="selectProfile(profile)">თვითონ ავირჩევ</button>
    </div>
  </div>`, 'home');
  try{ if(isYoung(profile)) praise(); }catch(e){}
}
// route to the recommended subject's menu (or the child's grid for the young plan)
function placementStart(){
  const s = state[profile];
  const subj = (s.placement && s.placement.subj) || null;
  if(subj==='counting' || subj==='ka-alpha' || subj==='en-alpha' || subj==='english' || subj==='kings-eng'){
    if(typeof openMenu==='function') return openMenu(subj);
  }
  selectProfile(profile);
}
