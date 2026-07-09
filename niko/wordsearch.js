/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — Word-Search engine (SPEC-2). Subject-agnostic grid; hidden themed words.
   Self-contained overlay screen (modelled on the Movement break): mounts into `.device`,
   closes by removing #wsscr. Audio-first (pre-readers get emoji clue + 🔊 word audio; no
   reading required). Adaptive: young ≤6 = small grid, straight lines only, big cells;
   reader ≥7 = bigger grid + diagonals. Reuses AUDIO_MANIFEST clips + the coin reward.
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
  let _grid=[], _words=[], _size=7, _anchor=null, _packIdx=0;

  const rnd = n => Math.floor(Math.random()*n);
  const young = () => (typeof isYoung==='function' && isYoung(profile)) || (typeof isTiny==='function' && isTiny(profile));
  const cellKey = cells => cells.map(c=>c[0]+','+c[1]).sort().join(';');

  function _place(word, dirs){
    const L=[...word];
    for(let t=0;t<250;t++){
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

  function _build(pack){
    const yng=young();
    const nWords = yng?4:6;
    const chosen = pack.words.slice().sort((a,b)=> a.w.length-b.w.length); // shorter first helps young
    const pick = (yng ? chosen.slice(0,5) : chosen).slice(0, nWords);
    const longest = Math.max.apply(null, pick.map(x=>x.w.length));
    _size = yng ? Math.min(8, Math.max(6, longest+1)) : Math.min(11, Math.max(9, longest+1));
    const dirs = yng ? [[0,1],[1,0]] : [[0,1],[1,0],[1,1],[-1,1]];
    // up to 4 whole-build retries so a bad random layout can't ship < 3 words
    for(let attempt=0; attempt<4; attempt++){
      _grid = Array.from({length:_size},()=>Array(_size).fill(''));
      _words=[];
      for(const it of pick){ const cells=_place(it.w, dirs); if(cells) _words.push({w:it.w, e:it.e, cells, key:cellKey(cells), found:false}); }
      if(_words.length>=Math.min(3,pick.length)) break;
    }
    for(let r=0;r<_size;r++) for(let c=0;c<_size;c++) if(!_grid[r][c]) _grid[r][c]=KA[rnd(KA.length)];
  }

  function _css(){
    if(document.getElementById('ws-css')) return;
    const s=document.createElement('style'); s.id='ws-css';
    s.textContent=`
    #wsscr{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;background:linear-gradient(180deg,#FFF6E9,#FDEBD2);overflow:auto;padding-bottom:16px}
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
    @keyframes wsShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
    #wsscr .ws-done{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35)}
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
    const yng=young(), px=_cellPx(), fs=Math.max(15, Math.floor(px*0.42));
    const found=_words.filter(w=>w.found).length;
    const clues=_words.map((w,i)=>`<div class="ws-clue${w.found?' done':''}" data-ci="${i}">
        <span class="em">${w.e}</span>${yng?'':`<span class="lbl">${w.w}</span>`}
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
      <div class="ws-gridwrap"><div class="ws-grid" id="wsGrid" style="grid-template-columns:repeat(${_size},${px}px)">${cells}</div></div>`;
    el.innerHTML=html;
    // re-apply found highlighting
    _words.forEach(w=>{ if(w.found) w.cells.forEach(([r,c])=>{ const b=document.getElementById('wsC_'+r+','+c); if(b)b.classList.add('found'); }); });
  }

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
    if(b.classList.contains('found')) return;
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
      hit.cells.forEach(([rr,cc])=>{ const cb=document.getElementById('wsC_'+rr+','+cc); if(cb){cb.classList.remove('sel');cb.classList.add('found');} });
      if(typeof playClipFor==='function') playClipFor(hit.w);
      const ci=_words.indexOf(hit); const chip=document.querySelector('.ws-clue[data-ci="'+ci+'"]'); if(chip)chip.classList.add('done');
      const pill=document.getElementById('wsPill'); if(pill)pill.textContent=_words.filter(w=>w.found).length+'/'+_words.length;
      if(_words.every(w=>w.found)) setTimeout(wsComplete,500);
    } else {
      sel.forEach(([rr,cc])=>{ const cb=document.getElementById('wsC_'+rr+','+cc); if(cb){cb.classList.add('miss');setTimeout(()=>cb.classList.remove('miss'),350);} });
    }
  };

  function wsComplete(){
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

  window.wsAgain = function(){ const el=document.getElementById('wsscr'); if(el)el.remove(); _anchor=null; window.wsStart(); };
  window.closeWs = function(){ const el=document.getElementById('wsscr'); if(el)el.remove(); _anchor=null; };
  // expose internals for the QA harness (read-only)
  window.__wsState = ()=>({ size:_size, words:_words.map(w=>({w:w.w,found:w.found,cells:w.cells})), grid:_grid });
})();
