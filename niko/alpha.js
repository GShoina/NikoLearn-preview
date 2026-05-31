// Alphabet module: Georgian ა–ჰ & English A–Z. Learn (flip + sound) + visual-first quiz. HANDOFF §4, §8.5
function alphaSet(lang){ return lang === 'en' ? EN_ALPHA : KA_ALPHA; }

// Entry: pick language (ka always; en only if the child speaks it), then learn / quiz.
function openAlpha(){
  const k = kid();
  const en = k.langs && k.langs.includes('en');
  app(`<div class="hdr"><button class="pill" id="back">⬅️</button><h1>ანბანი</h1><span class="pill">🪙 ${prog().coins}</span></div>
   <div class="grid">
     <button class="card" data-l="ka"><span class="ico">🇬🇪</span><span class="lbl">ა ბ გ</span></button>
     ${en?`<button class="card" data-l="en"><span class="ico">🇬🇧</span><span class="lbl">A B C</span></button>`:''}
   </div>`);
  $('#back').onclick = renderMenu;
  document.querySelectorAll('[data-l]').forEach(b => b.onclick = () => alphaModes(b.dataset.l));
}

function alphaModes(lang){
  app(`<div class="hdr"><button class="pill" id="back">⬅️</button><h1>${lang==='en'?'A B C':'ა ბ გ'}</h1><span class="pill">🪙 ${prog().coins}</span></div>
   <div class="grid">
     <button class="card" id="learn"><span class="ico">👀</span><span class="lbl">ისწავლე</span></button>
     <button class="card" id="quiz"><span class="ico">🎯</span><span class="lbl">ვიქტორინა</span></button>
   </div>`);
  $('#back').onclick = openAlpha;
  $('#learn').onclick = () => learnAlpha(lang);
  $('#quiz').onclick = () => quizAlpha(lang);
}

// Learn: grid of letters → tap a letter → big card (letter + word + picture + sound). English speaks; ka stays silent (no English-voice gibberish).
function learnAlpha(lang){
  const set = alphaSet(lang);
  app(`<div class="hdr"><button class="pill" id="back">⬅️</button><h1>ისწავლე</h1><span class="pill">🪙 ${prog().coins}</span></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(70px,1fr))">
      ${set.map((a,i)=>`<button class="card" data-i="${i}" style="min-height:70px;padding:10px"><span class="ico" style="font-size:1.8rem">${esc(a.l)}</span></button>`).join('')}
    </div>`);
  $('#back').onclick = () => alphaModes(lang);
  document.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
    const a = set[+b.dataset.i];
    app(`<div class="hdr"><button class="pill" id="back">⬅️</button><h1>${esc(a.l)}</h1><span class="pill">🪙 ${prog().coins}</span></div>
      <div class="center" style="margin-top:6vh">
        <div style="font-size:6rem;font-weight:800;color:var(--primary)">${esc(a.l)}</div>
        <div class="emojis" style="font-size:4rem">${a.emoji}</div>
        <div class="q">${esc(a.word)}</div>
        <button class="btn" id="say">🔊</button>
        <button class="btn ghost big" id="more">სხვა ასო</button>
      </div>`);
    $('#back').onclick = () => learnAlpha(lang);
    $('#more').onclick = () => learnAlpha(lang);
    $('#say').onclick = () => speak(a.word, lang);   // en speaks; ka routed through guard (clip or silent)
    if(lang==='en') setTimeout(()=>speak(a.word,'en'), 250);
  });
}

// Quiz (visual-first): see a picture → pick the starting letter (3 options). No reading required.
function quizAlpha(lang){
  const set = alphaSet(lang);
  let round = 0, right = 0; const total = 6;
  function next(){
    if(round >= total) return results(right, total, () => quizAlpha(lang));
    round++;
    const item = pick(set);
    const choices = distractors(set, item, c => c.l);
    app(`<div class="hdr"><button class="pill" id="x">✕</button><h1>რომელი ასო?</h1><span class="pill">${round}/${total}</span></div>
      <div class="center">
        <div class="emojis" style="font-size:4.5rem">${item.emoji}</div>
        ${lang==='en'?`<button class="btn ghost" id="say">🔊 ${esc(item.word)}</button>`:`<div class="q">${esc(item.word)}</div>`}
        <div class="opts">${choices.map(c=>`<button class="btn opt" data-l="${esc(c.l)}">${esc(c.l)}</button>`).join('')}</div>
      </div>`);
    $('#x').onclick = renderMenu;
    if(lang==='en'){ $('#say').onclick = () => speak(item.word,'en'); setTimeout(()=>speak(item.word,'en'),300); }
    document.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const p = prog();
      if(b.dataset.l === item.l){ b.classList.add('good'); right++; p.coins++; p.combo=(p.combo||0)+1; p.maxCombo=Math.max(p.maxCombo||0,p.combo);
        p.alpha.correct++; save(); praise(); setTimeout(next, 700); }
      else { b.classList.add('bad'); p.combo=0; p.alpha.wrong++; save(); showOwl('alpha', item); setTimeout(()=>b.classList.remove('bad'), 500); }
    });
  }
  next();
}
