// Games. Counting (visual-first, "რამდენია?"). HANDOFF §4. More modes added incrementally.
function startCounting(){
  const k = kid();
  const max = k.reader ? 10 : 5;            // non-readers stay in 1–5; readers go to 10
  const pool = COUNTING.filter(c => c.n <= max);
  let round = 0, right = 0; const total = 6;

  function next(){
    if(round >= total) return countResults(right, total);
    round++;
    const item = pick(pool), n = item.n;
    const opts = new Set([n]);
    while(opts.size < 3){ opts.add(pick(pool).n); }
    const choices = [...opts].sort(() => Math.random() - 0.5);
    app(`<div class="hdr"><button class="pill" id="x">✕</button><h1>რამდენია?</h1><span class="pill">${round}/${total}</span></div>
      <div class="center">
        <button class="btn ghost" id="say" aria-label="listen">🔊</button>
        <div class="emojis">${item.emoji.repeat(n)}</div>
        <div class="opts">${choices.map(c=>`<button class="btn opt" data-n="${c}">${c}</button>`).join('')}</div>
      </div>`);
    $('#x').onclick = renderMenu;
    $('#say').onclick = () => speak(item.en, 'en');   // English number via TTS works; ka via clip if present
    document.querySelectorAll('[data-n]').forEach(b => b.onclick = () => {
      const v = +b.dataset.n, p = prog();
      if(v === n){
        b.classList.add('good'); right++; p.coins++; p.combo=(p.combo||0)+1; p.maxCombo=Math.max(p.maxCombo||0,p.combo);
        p.counting.correct++; save(); praise(); setTimeout(next, 700);
      } else {
        b.classList.add('bad'); p.combo=0; p.counting.wrong++; save(); speak(item.en,'en');
        setTimeout(()=>b.classList.remove('bad'), 500);
      }
    });
  }
  next();
}

function countResults(right, total){
  const stars = '⭐'.repeat(right) + '·'.repeat(total-right);
  app(`<div class="center" style="margin-top:14vh">
    <div style="font-size:4rem">🎉</div>
    <div class="q">${right}/${total}</div>
    <div class="emojis">${stars}</div>
    <button class="btn big" id="again">კიდევ</button>
    <button class="btn ghost big" id="menu">მენიუ</button>
  </div>`);
  $('#again').onclick = startCounting;
  $('#menu').onclick = renderMenu;
}
