// Games. Visual-first for non-readers. HANDOFF §4. Shared helpers: distractors(), results() in core.js.

// ── Counting (1–5 non-reader / 1–10 reader). "რამდენია?" ──
function startCounting(){
  const k = kid();
  const pool = COUNTING.filter(c => c.n <= (k.reader ? 10 : 5));
  let round = 0, right = 0; const total = 6;
  function next(){
    if(round >= total) return results(right, total, startCounting);
    round++;
    const item = pick(pool);
    const choices = distractors(pool, item, c => c.n);
    app(`<div class="hdr"><button class="pill" id="x">✕</button><h1>რამდენია?</h1><span class="pill">${round}/${total}</span></div>
      <div class="center">
        <button class="btn ghost" id="say" aria-label="listen">🔊</button>
        <div class="emojis">${item.emoji.repeat(item.n)}</div>
        <div class="opts">${choices.map(c=>`<button class="btn opt" data-n="${c.n}">${c.n}</button>`).join('')}</div>
      </div>`);
    $('#x').onclick = renderMenu;
    $('#say').onclick = () => speak(item.en, 'en');
    document.querySelectorAll('[data-n]').forEach(b => b.onclick = () => {
      const v = +b.dataset.n, p = prog();
      if(v === item.n){ b.classList.add('good'); right++; p.coins++; p.combo=(p.combo||0)+1; p.maxCombo=Math.max(p.maxCombo||0,p.combo);
        p.counting.correct++; save(); praise(); setTimeout(next, 700); }
      else { b.classList.add('bad'); p.combo=0; p.counting.wrong++; save(); showOwl('counting', item); setTimeout(()=>b.classList.remove('bad'), 500); }
    });
  }
  next();
}

// ── English vocabulary (YLE "Kings" core). Reader: ka→pick EN. Non-reader: hear EN→pick picture. ──
function startWords(cat){
  const k = kid();
  const items = cat ? WORDS[cat].slice() : Object.values(WORDS).flat();
  let round = 0, right = 0; const total = 6;
  function score(item, btn){
    const p = prog();
    if(btn.dataset.v === item.en){ btn.classList.add('good'); right++; p.coins++; p.combo=(p.combo||0)+1; p.maxCombo=Math.max(p.maxCombo||0,p.combo);
      p.words.correct++; save(); speak(item.en,'en'); praise(); setTimeout(next, 800); }
    else { btn.classList.add('bad'); p.combo=0; p.words.wrong++; save(); showOwl('words', item); setTimeout(()=>btn.classList.remove('bad'), 500); }
  }
  function next(){
    if(round >= total) return results(right, total, () => startWords(cat));
    round++;
    const item = pick(items);
    const choices = distractors(items, item, c => c.en);
    if(k.reader){
      app(`<div class="hdr"><button class="pill" id="x">✕</button><h1>რა არის?</h1><span class="pill">${round}/${total}</span></div>
        <div class="center">
          <div class="emojis">${item.emoji}</div><div class="q">${esc(item.ka)}</div>
          <div class="opts">${choices.map(c=>`<button class="btn opt" data-v="${esc(c.en)}" style="font-size:1.3rem">${esc(c.en)}</button>`).join('')}</div>
        </div>`);
    } else {
      app(`<div class="hdr"><button class="pill" id="x">✕</button><h1>აირჩიე 👂</h1><span class="pill">${round}/${total}</span></div>
        <div class="center">
          <button class="btn ghost" id="say">🔊 ${esc(item.en)}</button>
          <div class="opts">${choices.map(c=>`<button class="btn opt" data-v="${esc(c.en)}" style="font-size:3rem">${c.emoji}</button>`).join('')}</div>
        </div>`);
      $('#say').onclick = () => speak(item.en,'en');
      setTimeout(() => speak(item.en,'en'), 300);
    }
    $('#x').onclick = renderMenu;
    document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => score(item, b));
  }
  next();
}

// ── Math (graded + adaptive). L0 ±20 · L1 ±100 · L2 ×÷. ≥85% bumps up, <50% drops. HANDOFF §4 ──
const MATH_LEVELS = ['➕➖ 20','➕➖ 100','✖️➗'];
function mathProblem(lvl){
  if(lvl <= 0){ let a=rnd(2,18), b=rnd(1,20-a); return Math.random()<0.5 ? {q:`${a} + ${b}`,ans:a+b} : {q:`${a+b} − ${b}`,ans:a}; }
  if(lvl === 1){ let a=rnd(10,89), b=rnd(1,99-a); return Math.random()<0.5 ? {q:`${a} + ${b}`,ans:a+b} : {q:`${a+b} − ${b}`,ans:a}; }
  const a=rnd(2,9), b=rnd(2,9); return Math.random()<0.5 ? {q:`${a} × ${b}`,ans:a*b} : {q:`${a*b} ÷ ${b}`,ans:a};
}
function mathOptions(ans){
  const set = new Set([ans]); let g=0;
  while(set.size<3 && g++<50){ const d = ans + pick([-3,-2,-1,1,2,3,10,-10]); if(d>=0) set.add(d); }
  return [...set].sort(()=>Math.random()-0.5);
}
function startMath(){
  const p0 = prog(); let lvl = Math.min(p0.mathLevel||0, MATH_LEVELS.length-1);
  let round = 0, right = 0; const total = 6;
  function next(){
    if(round >= total) return mathResults(right, total, lvl);
    round++;
    const prob = mathProblem(lvl), choices = mathOptions(prob.ans);
    app(`<div class="hdr"><button class="pill" id="x">✕</button><h1>${MATH_LEVELS[lvl]}</h1><span class="pill">${round}/${total}</span></div>
      <div class="center">
        <div class="q" style="font-size:2.4rem">${prob.q} = ?</div>
        <div class="opts">${choices.map(c=>`<button class="btn opt" data-v="${c}">${c}</button>`).join('')}</div>
      </div>`);
    $('#x').onclick = renderMenu;
    document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => {
      const p = prog();
      if(+b.dataset.v === prob.ans){ b.classList.add('good'); right++; p.coins++; p.combo=(p.combo||0)+1; p.maxCombo=Math.max(p.maxCombo||0,p.combo);
        p.math.correct++; save(); praise(); setTimeout(next, 650); }
      else { b.classList.add('bad'); p.combo=0; p.math.wrong++; save(); showOwl('math', prob); setTimeout(()=>b.classList.remove('bad'), 500); }
    });
  }
  next();
}
function mathResults(right, total, lvl){
  const pct = Math.round(100*right/total), p = prog();
  let note = '';
  if(pct >= 85 && lvl < MATH_LEVELS.length-1){ p.mathLevel = lvl+1; save(); note = `⬆️ ახალი დონე: ${MATH_LEVELS[lvl+1]}`; }
  else if(pct < 50 && lvl > 0){ p.mathLevel = lvl-1; save(); note = `↩️ ცოტა გავიმეოროთ`; }
  results(right, total, startMath, note ? `<div class="pill">${note}</div>` : '');
}

// ── Everyday English phrases (reader feature). Hear/see EN phrase → pick the Georgian meaning. ──
function startPhrases(grp){
  const items = grp ? PHRASES[grp].slice() : Object.values(PHRASES).flat();
  let round = 0, right = 0; const total = 6;
  function next(){
    if(round >= total) return results(right, total, () => startPhrases(grp));
    round++;
    const item = pick(items);
    const choices = distractors(items, item, c => c.en);
    app(`<div class="hdr"><button class="pill" id="x">✕</button><h1>რას ნიშნავს?</h1><span class="pill">${round}/${total}</span></div>
      <div class="center">
        <button class="btn ghost" id="say">🔊 ${esc(item.en)}</button>
        <div class="opts" style="grid-template-columns:1fr">${choices.map(c=>`<button class="btn opt" data-v="${esc(c.en)}" style="font-size:1.2rem;min-height:64px">${esc(c.ka)}</button>`).join('')}</div>
      </div>`);
    $('#x').onclick = renderMenu;
    $('#say').onclick = () => speak(item.en,'en');
    setTimeout(() => speak(item.en,'en'), 300);
    document.querySelectorAll('[data-v]').forEach(b => b.onclick = () => {
      const p = prog();
      if(b.dataset.v === item.en){ b.classList.add('good'); right++; p.coins++; p.combo=(p.combo||0)+1; p.maxCombo=Math.max(p.maxCombo||0,p.combo);
        p.phrases.correct++; save(); praise(); setTimeout(next, 800); }
      else { b.classList.add('bad'); p.combo=0; p.phrases.wrong++; save(); showOwl('phrases', item); setTimeout(()=>b.classList.remove('bad'), 500); }
    });
  }
  next();
}
