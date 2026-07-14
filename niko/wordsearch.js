/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — Word-Search engine (SPEC-2). Subject-agnostic grid; hidden themed words.
   Self-contained overlay screen (modelled on the Movement break): mounts into `.device`,
   closes by removing #wsscr. Audio-first (pre-readers get emoji clue + 🔊 word audio; no
   reading required).
   Adaptive by AGE **and** CAPACITY (NB-45): a persistent per-profile skill (wsSkill) is
   hard-banded by age (young 0-1, reader 1-3) and scaled within the band by mastery — it
   ramps up after hint-free wins and eases back when the child leans on hints. Skill maps to
   grid size, word count and direction set (straight → +down-diagonal → +up-diagonal).
   SOLVABILITY IS GUARANTEED (NB-44): _build grows the grid and retries until EVERY clue word
   is placed; clues only ever render placed words, so every shown word is findable+selectable.
   TUTOR (NB-43): Niko 🦉 appears after a struggle window and offers a graduated hint
   (pulse the first letter + play the word → flash the whole path). Hint use feeds the skill.
   FOOTER (NB-42): a self-contained bottom dock (Home / Hint / New) so the screen isn't a dead-end.
   Reuses AUDIO_MANIFEST clips + the coin reward.
   §11: all word lists are our own selection of common nouns (not copied from any source).
   Load AFTER owl.js (needs isYoung/isBig/isTiny/backBtn/praise/playClipFor/state/save).
   ═══════════════════════════════════════════════════════════ */
(function(){
  const KA = 'აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ';
  const REWARD = 5;
  // Packs: id, title, words[{w, e}]. Every `w` has a clip in AUDIO_MANIFEST (verified 2026-07-09).
  const WS_PACKS = [
    { id:'animals', title:'ცხოველები', hue:'hue-teal',
      words:[{w:'კატა',e:'🐱'},{w:'ძაღლი',e:'🐶'},{w:'თაგვი',e:'🐭'},{w:'ლომი',e:'🦁'},{w:'დათვი',e:'🐻'},{w:'ცხენი',e:'🐴'},{w:'თევზი',e:'🐟'}] },
    { id:'food', title:'საჭმელი', hue:'hue-orange',
      words:[{w:'ვაშლი',e:'🍎'},{w:'ბანანი',e:'🍌'},{w:'პური',e:'🍞'},{w:'რძე',e:'🥛'}] },
    { id:'colors', title:'ფერები', hue:'hue-pink',
      words:[{w:'წითელი',e:'🔴'},{w:'ლურჯი',e:'🔵'},{w:'მწვანე',e:'🟢'},{w:'ყვითელი',e:'🟡'}] },
    { id:'nature', title:'ბუნება', hue:'hue-blue',
      words:[{w:'მზე',e:'☀️'},{w:'მთვარე',e:'🌙'},{w:'ხე',e:'🌳'},{w:'ყვავილი',e:'🌸'}] },
  ];
  // Skill levels (NB-45): index = wsSkill. words=target count, dirs=allowed directions,
  // grow=extra grid room over the longest word (bigger = more filler = harder to spot).
  const LEVELS = [
    { words:3, dirs:[[0,1],[1,0]],                 grow:1 }, // 0  youngest / brand-new: straight only
    { words:4, dirs:[[0,1],[1,0]],                 grow:2 }, // 1  straight only, a touch bigger
    { words:4, dirs:[[0,1],[1,0],[1,1]],           grow:2 }, // 2  + down-diagonal
    { words:6, dirs:[[0,1],[1,0],[1,1],[-1,1]],    grow:3 }, // 3  both diagonals, more words
  ];
  let _grid=[], _words=[], _size=7, _anchor=null, _packIdx=0;
  let _hintsUsed=0, _struggleT=null, _owlT=null, _completeT=null, _skill=0;

  const rnd = n => Math.floor(Math.random()*n);
  const young = () => (typeof isYoung==='function' && isYoung(profile)) || (typeof isTiny==='function' && isTiny(profile));
  const cellKey = cells => cells.map(c=>c[0]+','+c[1]).sort().join(';');

  // ── difficulty resolution: age is a hard band, mastery scales within it (NB-45) ──
  function _resolveSkill(){
    const yng=young();
    let s = 0; try{ const st=state[profile]; if(st && typeof st.wsSkill==='number') s=st.wsSkill; else s = yng?0:2; }catch(e){ s = yng?0:2; }
    const lo = yng?0:1, hi = yng?1:3;                 // young never gets diagonals-heavy; reader never trivially easy
    return Math.max(lo, Math.min(hi, s|0));
  }
  function _bumpSkill(hintsUsed){
    try{
      const st=state[profile]; if(!st) return;
      const yng=young(); const lo=yng?0:1, hi=yng?1:3;
      let s = (typeof st.wsSkill==='number') ? st.wsSkill : (yng?0:2);
      if(hintsUsed===0) s++; else if(hintsUsed>=3) s--;     // earned it clean → up; leaned on hints → ease back
      st.wsSkill = Math.max(lo, Math.min(hi, s));
      if(typeof save==='function') save();
    }catch(e){}
  }

  function _place(word, dirs){
    const L=[...word];
    for(let t=0;t<300;t++){
      const d=dirs[rnd(dirs.length)], r0=rnd(_size), c0=rnd(_size);
      const r1=r0+d[0]*(L.length-1), c1=c0+d[1]*(L.length-1);
      if(r1<0||r1>=_size||c1<0||c1>=_size) continue;
      let ok=true; const cells=[];
      for(let i=0;i<L.length;i++){ const r=r0+d[0]*i,c=c0+d[1]*i; const cur=_grid[r][c]; if(cur&&cur!==L[i]){ok=false;break;} cells.push([r,c]); }
      if(!ok) continue;
      for(let i=0;i<L.length;i++) _grid[cells[i][0]][cells[i][1]]=L[i];
      return cells;
    }
    return null;
  }

  // Try to place EVERY word at the current _size; returns the placed set (or null if any failed).
  function _tryLayout(pick, dirs){
    _grid = Array.from({length:_size},()=>Array(_size).fill(''));
    const placed=[];
    for(const it of pick){ const cells=_place(it.w, dirs); if(!cells) return null; placed.push({w:it.w, e:it.e, cells, key:cellKey(cells), found:false, hint:0}); }
    return placed;
  }

  function _build(pack){
    const yng=young();
    _skill = _resolveSkill();
    const cfg = LEVELS[_skill];
    _hintsUsed = 0;
    const chosen = pack.words.slice().sort((a,b)=> a.w.length-b.w.length); // shorter first
    // young keeps to the 5 shortest; take the target count for this skill
    let pick = (yng ? chosen.slice(0,5) : chosen).slice(0, cfg.words);
    const longest = Math.max.apply(null, pick.map(x=>x.w.length));
    const minSize = yng?6:9, maxSize = yng?9:12;
    // NB-44: start roomy, then GROW+retry until every clue word places — solvability is guaranteed.
    let out=null;
    for(let size=Math.max(minSize, Math.min(maxSize, longest+cfg.grow)); size<=maxSize && !out; size++){
      _size=size;
      for(let attempt=0; attempt<8 && !out; attempt++) out=_tryLayout(pick, cfg.dirs);
    }
    if(!out){
      // Extreme fallback (never expected for our short packs): drop to straight-only, biggest grid,
      // and keep only words that place — so a clue is NEVER shown for a word that isn't in the grid.
      _size=maxSize;
      for(let attempt=0; attempt<12 && !out; attempt++){
        _grid = Array.from({length:_size},()=>Array(_size).fill(''));
        const placed=[]; for(const it of pick){ const c=_place(it.w,[[0,1],[1,0]]); if(c) placed.push({w:it.w,e:it.e,cells:c,key:cellKey(c),found:false,hint:0}); }
        if(placed.length>=Math.max(3, pick.length-1)) out=placed;
      }
      out = out || [];
    }
    _words = out;
    for(let r=0;r<_size;r++) for(let c=0;c<_size;c++) if(!_grid[r][c]) _grid[r][c]=KA[rnd(KA.length)];
  }

  function _css(){
    if(document.getElementById('ws-css')) return;
    const s=document.createElement('style'); s.id='ws-css';
    s.textContent=`
    #wsscr{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:linear-gradient(180deg,#FFF6E9,#FDEBD2);overflow:auto;padding-bottom:84px}
    #wsscr .ws-top{display:flex;align-items:center;gap:10px;padding:12px 14px}
    #wsscr .ws-who{font-weight:800;font-size:1.15rem;color:#2A1C12;line-height:1.05}
    #wsscr .ws-who small{display:block;font-weight:600;font-size:.72rem;color:#8a7a63}
    #wsscr .ws-pill{margin-left:auto;background:#fff;border-radius:999px;padding:6px 12px;font-weight:800;color:#E8830C;box-shadow:0 2px 6px rgba(0,0,0,.08)}
    #wsscr .ws-clues{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:4px 12px 10px}
    #wsscr .ws-clue{display:flex;align-items:center;gap:6px;background:#fff;border-radius:14px;padding:6px 10px;box-shadow:0 2px 6px rgba(0,0,0,.06);font-weight:700;color:#2A1C12}
    #wsscr .ws-clue .em{font-size:1.35rem;line-height:1}
    #wsscr .ws-clue .snd{border:none;background:#F0E7D8;border-radius:10px;padding:3px 7px;font-size:1rem;cursor:pointer}
    #wsscr .ws-clue.done{opacity:.45}
    #wsscr .ws-clue.done .lbl{text-decoration:line-through}
    #wsscr .ws-gridwrap{display:flex;justify-content:center;padding:2px 10px}
    #wsscr .ws-grid{display:grid;gap:5px;touch-action:manipulation}
    #wsscr .ws-cell{border:none;border-radius:12px;background:#fff;color:#2A1C12;font-weight:800;box-shadow:0 2px 5px rgba(0,0,0,.07);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
    #wsscr .ws-cell.sel{background:#FFD98A;transform:scale(.96)}
    #wsscr .ws-cell.found{background:#8FE3B8;color:#0d5c39}
    #wsscr .ws-cell.miss{animation:wsShake .35s}
    #wsscr .ws-cell.hint{animation:wsHintGlow 1.1s ease-in-out 3}
    @keyframes wsShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
    @keyframes wsHintGlow{0%,100%{box-shadow:0 2px 5px rgba(0,0,0,.07)}50%{box-shadow:0 0 0 4px #FFC24D, 0 0 14px 4px #FFB020;background:#FFF2D6}}
    /* Niko owl helper bubble (NB-43) */
    #wsscr .ws-owl{position:fixed;left:12px;right:12px;bottom:76px;z-index:62;display:none;align-items:center;gap:10px;background:#fff;border:2px solid #FFD98A;border-radius:18px;padding:10px 14px;box-shadow:0 8px 22px rgba(0,0,0,.16)}
    #wsscr .ws-owl.show{display:flex;animation:wsOwlIn .25s ease-out}
    #wsscr .ws-owl .ow-face{font-size:1.9rem;line-height:1}
    #wsscr .ws-owl .ow-txt{font-weight:700;color:#2A1C12;font-size:.92rem;line-height:1.15}
    @keyframes wsOwlIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    /* Footer dock (NB-42) */
    #wsscr .ws-dock{position:fixed;left:10px;right:10px;bottom:calc(8px + env(safe-area-inset-bottom));z-index:61;height:58px;display:flex;justify-content:space-around;align-items:center;background:#fff;border-radius:20px;box-shadow:0 6px 20px rgba(0,0,0,.14)}
    #wsscr .ws-dock button{background:none;border:none;cursor:pointer;font-family:inherit;color:#8a7a63;font-weight:700;font-size:.7rem;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:56px;min-height:48px;padding:6px 10px;border-radius:14px}
    #wsscr .ws-dock button .di{font-size:1.4rem;line-height:1}
    #wsscr .ws-dock button:active{transform:scale(.94)}
    #wsscr .ws-dock button.pulse{color:#E8830C;animation:wsPulse 1s ease-in-out infinite}
    @keyframes wsPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
    #wsscr .ws-done{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35);z-index:63}
    #wsscr .ws-done-card{background:#fff;border-radius:22px;padding:26px 22px;text-align:center;max-width:300px;box-shadow:0 10px 30px rgba(0,0,0,.25)}
    #wsscr .ws-done-em{font-size:3rem}
    #wsscr .ws-done-h{font-weight:800;font-size:1.2rem;color:#2A1C12;margin:6px 0 4px}
    #wsscr .ws-done-rew{color:#E8830C;font-weight:800;margin-bottom:14px}
    #wsscr .ws-done .btn{display:block;width:100%;margin:8px 0}`;
    document.head.appendChild(s);
  }

  function _cellPx(){ const w=Math.min(window.innerWidth,460)-28; return Math.floor((w-(_size-1)*5)/_size); }

  function wsRender(){
    _css();
    const px=_cellPx(), fs=Math.max(15, Math.floor(px*0.42));
    const found=_words.filter(w=>w.found).length;
    const clues=_words.map((w,i)=>`<div class="ws-clue${w.found?' done':''}" data-ci="${i}">
        <span class="em">${w.e}</span><span class="lbl">${w.w}</span>
        <button class="snd" onclick="wsSay(${i})" aria-label="მოისმინე">🔊</button></div>`).join('');
    let cells='';
    for(let r=0;r<_size;r++) for(let c=0;c<_size;c++){
      const key=r+','+c;
      cells+=`<button class="ws-cell" id="wsC_${key}" style="width:${px}px;height:${px}px;font-size:${fs}px" onclick="wsTap(${r},${c})">${_grid[r][c]}</button>`;
    }
    const el=document.getElementById('wsscr');
    const html=`
      <header class="ws-top">
        ${backBtn('closeWs()')}
        <div class="ws-who">სიტყვების ძებნა<small>იპოვე დამალული სიტყვები 🔎</small></div>
        <div class="ws-pill" id="wsPill">${found}/${_words.length}</div>
      </header>
      <div class="ws-clues">${clues}</div>
      <div class="ws-gridwrap"><div class="ws-grid" id="wsGrid" style="grid-template-columns:repeat(${_size},${px}px)">${cells}</div></div>
      <div class="ws-owl" id="wsOwl"><span class="ow-face">🦉</span><span class="ow-txt" id="wsOwlTxt"></span></div>
      <nav class="ws-dock">
        <button onclick="closeWs()" aria-label="მთავარი"><span class="di">🏠</span>მთავარი</button>
        <button id="wsHintBtn" onclick="wsHint()" aria-label="მინიშნება"><span class="di">💡</span>მინიშნება</button>
        <button onclick="wsAgain()" aria-label="ახალი"><span class="di">🔄</span>ახალი</button>
      </nav>`;
    el.innerHTML=html;
    // re-apply found highlighting
    _words.forEach(w=>{ if(w.found) w.cells.forEach(([r,c])=>{ const b=document.getElementById('wsC_'+r+','+c); if(b)b.classList.add('found'); }); });
    _armStruggle();
  }

  // ── Tutor / hint scaffolding (NB-43) ──
  function _clearTimers(){ if(_struggleT){clearTimeout(_struggleT);_struggleT=null;} if(_owlT){clearTimeout(_owlT);_owlT=null;} if(_completeT){clearTimeout(_completeT);_completeT=null;} }
  function _armStruggle(){
    _clearTimers();
    if(_words.every(w=>w.found)) return;
    const delay = (typeof window.__wsStruggleMs==='number') ? window.__wsStruggleMs : (young()?18000:22000);
    _struggleT = setTimeout(()=>_owlOffer(), delay);
  }
  function _owlOffer(){
    const owl=document.getElementById('wsOwl'), txt=document.getElementById('wsOwlTxt'), btn=document.getElementById('wsHintBtn');
    if(!owl||!txt) return;
    txt.textContent = 'გინდა დაგეხმარო? დააჭირე 💡-ს და ერთ სიტყვას გაჩვენებ.';
    owl.classList.add('show'); if(btn) btn.classList.add('pulse');
    if(_owlT) clearTimeout(_owlT);
    _owlT = setTimeout(()=>{ owl.classList.remove('show'); }, 6000);
  }
  window.wsHint = function(){
    const btn=document.getElementById('wsHintBtn'); if(btn) btn.classList.remove('pulse');
    const owl=document.getElementById('wsOwl'); if(owl) owl.classList.remove('show');
    const w=_words.find(x=>!x.found); if(!w){ return; }
    _hintsUsed++; w.hint=(w.hint||0)+1;
    if(w.hint>=2){
      // second nudge on this word: flash the whole path briefly
      w.cells.forEach(([r,c])=>{ const b=document.getElementById('wsC_'+r+','+c); if(b){ b.classList.add('hint'); setTimeout(()=>b.classList.remove('hint'),3400); } });
    } else {
      // first nudge: pulse the FIRST letter + say the word
      const [r,c]=w.cells[0]; const b=document.getElementById('wsC_'+r+','+c);
      if(b){ b.classList.add('hint'); setTimeout(()=>b.classList.remove('hint'),3400); }
    }
    if(typeof playClipFor==='function') try{ playClipFor(w.w); }catch(e){}
    _armStruggle();
  };

  window.wsStart = function(packId){
    if(document.getElementById('wsscr')) return;
    if(window.Analytics) try{ Analytics.screen('wordsearch'); }catch(e){}
    let idx = packId ? WS_PACKS.findIndex(p=>p.id===packId) : rnd(WS_PACKS.length);
    if(idx<0) idx=0; _packIdx=idx; _anchor=null;
    _build(WS_PACKS[idx]);
    const el=document.createElement('div'); el.id='wsscr';
    const host=(typeof $==='function' && $('.device')) || document.body; host.appendChild(el);
    wsRender();
  };

  window.wsSay = function(i){ const w=_words[i]; if(w && typeof playClipFor==='function') playClipFor(w.w); };

  window.wsTap = function(r,c){
    const b=document.getElementById('wsC_'+r+','+c); if(!b) return;
    // NB-44 edge: a found (green) cell can still be an ENDPOINT of another crossing word — never
    // block it, or two words sharing a cell make the second one unselectable. Selection only uses
    // the two tapped endpoints, so participating found cells stay correct.
    if(!_anchor){ _anchor=[r,c]; b.classList.add('sel'); return; }
    const [ar,ac]=_anchor; const prev=document.getElementById('wsC_'+ar+','+ac); if(prev)prev.classList.remove('sel');
    if(ar===r && ac===c){ _anchor=null; return; }               // tapped same cell = cancel
    const dr=Math.sign(r-ar), dc=Math.sign(c-ac);
    const straight = (ar===r)||(ac===c)||(Math.abs(r-ar)===Math.abs(c-ac));
    _anchor=null;
    if(!straight){ b.classList.add('miss'); setTimeout(()=>b.classList.remove('miss'),350); return; }
    const steps=Math.max(Math.abs(r-ar),Math.abs(c-ac)), sel=[];
    for(let i=0;i<=steps;i++) sel.push([ar+dr*i, ac+dc*i]);
    const k=cellKey(sel);
    const hit=_words.find(w=>!w.found && w.key===k);
    if(hit){
      hit.found=true;
      hit.cells.forEach(([rr,cc])=>{ const cb=document.getElementById('wsC_'+rr+','+cc); if(cb){cb.classList.remove('sel');cb.classList.remove('hint');cb.classList.add('found');} });
      if(typeof playClipFor==='function') playClipFor(hit.w);
      const ci=_words.indexOf(hit); const chip=document.querySelector('.ws-clue[data-ci="'+ci+'"]'); if(chip)chip.classList.add('done');
      const pill=document.getElementById('wsPill'); if(pill)pill.textContent=_words.filter(w=>w.found).length+'/'+_words.length;
      if(_words.every(w=>w.found)){ _clearTimers(); _completeT=setTimeout(wsComplete,500); } else { _armStruggle(); }
    } else {
      sel.forEach(([rr,cc])=>{ const cb=document.getElementById('wsC_'+rr+','+cc); if(cb){cb.classList.add('miss');setTimeout(()=>cb.classList.remove('miss'),350);} });
    }
  };

  function wsComplete(){
    _clearTimers();
    _bumpSkill(_hintsUsed);                                       // capacity ramp (NB-45)
    try{ const s=state[profile]; if(s){ s.shields=(s.shields||0)+REWARD; if(typeof save==='function')save(); } }catch(e){}
    const el=document.getElementById('wsscr'); if(!el) return;
    const ov=document.createElement('div'); ov.className='ws-done';
    ov.innerHTML=`<div class="ws-done-card">
      <div class="ws-done-em">🎉</div>
      <div class="ws-done-h">ყოჩაღ! ყველა სიტყვა იპოვე</div>
      <div class="ws-done-rew">+${REWARD} 🪙</div>
      <button class="btn btn-primary" onclick="wsAgain()">კიდევ ერთი 💪</button>
      <button class="btn btn-ghost" onclick="closeWs()">მზად ვარ ✅</button>
    </div>`;
    el.appendChild(ov);
    try{ praise(); }catch(e){}
  }

  window.wsAgain = function(){ _clearTimers(); try{if(window.stopAudio)stopAudio();}catch(e){} const el=document.getElementById('wsscr'); if(el)el.remove(); _anchor=null; window.wsStart(); };
  window.closeWs = function(){ _clearTimers(); try{if(window.stopAudio)stopAudio();}catch(e){} const el=document.getElementById('wsscr'); if(el)el.remove(); _anchor=null; };
  // expose internals for the QA harness (read-only)
  window.__wsState = ()=>({ size:_size, skill:_skill, hintsUsed:_hintsUsed, words:_words.map(w=>({w:w.w,found:w.found,cells:w.cells})), grid:_grid });
  window.__wsHintCount = ()=>_hintsUsed;
  window.__wsForceStruggle = ()=>_owlOffer();   // QA seam: exercise the owl-offer logic directly
})();
