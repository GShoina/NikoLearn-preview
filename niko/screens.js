// Screens: login, add-kid (reader toggle — improvement over age-only isYoung), home, menu. HANDOFF §4
function renderLogin(){
  app(`<div class="center" style="margin-top:18vh">
    <div style="font-size:4rem">🦉</div>
    <h1>NikoLearn</h1>
    <input class="input" id="pw" inputmode="numeric" placeholder="••••" autocomplete="off">
    <button class="btn big" id="go">შესვლა</button>
  </div>`);
  const submit = () => { if($('#pw').value.trim()==='12345'){ state.authed=true; save(); boot(); } else { $('#pw').value=''; toast('თავიდან 🙂'); } };
  $('#go').onclick = submit;
  $('#pw').addEventListener('keydown', e => { if(e.key==='Enter') submit(); });
}

let _newReader = false;
function renderAddKid(){
  _newReader = false;
  const colors = ['#ff8a65','#4db6ac','#7986cb','#f06292','#ffd54f','#81c784'];
  app(`<div class="hdr"><h1>ვინ ისწავლის? 🌟</h1></div>
   <div class="center">
    <input class="input" id="nm" placeholder="სახელი">
    <div style="width:100%;font-weight:700">ასაკი</div>
    <div class="row" id="ages">${[4,5,6,7,8].map(a=>`<button class="btn ghost" data-a="${a}">${a}</button>`).join('')}</div>
    <div style="width:100%;font-weight:700">კითხვა იცის?</div>
    <div class="toggle" style="width:100%"><button id="rno" aria-pressed="true">ჯერ არა 🖼️</button><button id="ryes" aria-pressed="false">კი 📖</button></div>
    <div class="row" id="cols">${colors.map(c=>`<button class="btn" style="background:${c};width:54px;height:54px;border-radius:50%;padding:0" data-c="${c}"></button>`).join('')}</div>
    <button class="btn big" id="add">დამატება</button>
   </div>`);
  let age = 6, color = colors[0];
  $('#ages').onclick = e => { const b=e.target.closest('[data-a]'); if(!b) return; age=+b.dataset.a;
    [...$('#ages').children].forEach(x=>x.classList.add('ghost')); b.classList.remove('ghost'); };
  $('#cols').onclick = e => { const b=e.target.closest('[data-c]'); if(!b) return; color=b.dataset.c; };
  $('#rno').onclick = () => { _newReader=false; $('#rno').setAttribute('aria-pressed','true');  $('#ryes').setAttribute('aria-pressed','false'); };
  $('#ryes').onclick = () => { _newReader=true;  $('#ryes').setAttribute('aria-pressed','true'); $('#rno').setAttribute('aria-pressed','false'); };
  $('#add').onclick = () => {
    const nm = $('#nm').value.trim() || 'ბავშვი';
    const id = 'k' + Date.now();
    state.kids.push({ id, name:nm, age, color, reader:_newReader, langs:['ka'] });
    state.onboarded = true; profile = id; save(); touchDay(); renderMenu();
  };
}

function renderHome(){
  app(`<div class="hdr"><h1>NikoLearn 🦉</h1></div>
    <div class="grid">${state.kids.map(k=>`<button class="card" data-k="${k.id}">
      <span class="ico" style="color:${k.color}">🙂</span><span class="lbl">${esc(k.name)}</span>
      <span class="pill">🔥 ${(state[k.id]&&state[k.id].dayStreak)||0} · 🪙 ${(state[k.id]&&state[k.id].coins)||0}</span></button>`).join('')}
      <button class="card" id="addk"><span class="ico">➕</span><span class="lbl">ბავშვი</span></button></div>
    ${canInstall()?`<div class="center" style="margin-top:18px"><button class="btn" id="install">📲 დააყენე ტელეფონზე</button></div>`:''}`);
  document.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { profile=b.dataset.k; touchDay(); renderMenu(); });
  $('#addk').onclick = renderAddKid;
  if($('#install')) $('#install').onclick = doInstall;
}

function renderMenu(){
  const k = kid();
  app(`<div class="hdr"><button class="pill" id="home">⬅️</button><h1>${esc(k.name)}</h1><span class="pill">🪙 ${prog().coins}</span></div>
   <div class="grid">
    <button class="card" id="counting"><span class="ico">🔢</span><span class="lbl">${k.reader?'1 2 3':'🍎🍎🍎'}</span></button>
    <button class="card" id="words"><span class="ico">🔤</span><span class="lbl">${k.reader?'სიტყვები':'🐈🐕🐟'}</span></button>
    ${k.reader?`<button class="card" id="phrases"><span class="ico">💬</span><span class="lbl">ფრაზები</span></button>`:''}
   </div>`);
  $('#home').onclick = renderHome;
  $('#counting').onclick = () => startCounting();
  $('#words').onclick = () => openTopics();
  if($('#phrases')) $('#phrases').onclick = () => openPhraseCats();
}

// Phrase-group picker (readers). Mirrors openTopics. HANDOFF §4 phrases.
function openPhraseCats(){
  const grps = Object.keys(PHRASES);
  app(`<div class="hdr"><button class="pill" id="back">⬅️</button><h1>ფრაზები 💬</h1><span class="pill">🪙 ${prog().coins}</span></div>
   <div class="grid">
     ${grps.map(g => { const parts=g.split(' '); const ico=parts[0]; const lbl=parts.slice(1).join(' ');
       return `<button class="card" data-g="${esc(g)}"><span class="ico">${ico}</span><span class="lbl">${esc(lbl)}</span></button>`; }).join('')}
     <button class="card" id="allp"><span class="ico">🌈</span><span class="lbl">ყველა</span></button>
   </div>`);
  $('#back').onclick = renderMenu;
  document.querySelectorAll('[data-g]').forEach(b => b.onclick = () => startPhrases(b.dataset.g));
  $('#allp').onclick = () => startPhrases(null);
}

// Category picker (HANDOFF §4 — the "categories don't navigate" fix: a real picker that scopes the game)
function openTopics(){
  const cats = Object.keys(WORDS);
  app(`<div class="hdr"><button class="pill" id="back">⬅️</button><h1>აირჩიე</h1><span class="pill">🪙 ${prog().coins}</span></div>
   <div class="grid">
     ${cats.map(c => { const parts=c.split(' '); const ico=parts[parts.length-1]; const lbl=parts.slice(0,-1).join(' ');
       return `<button class="card" data-c="${esc(c)}"><span class="ico">${ico}</span><span class="lbl">${esc(lbl)}</span></button>`; }).join('')}
     <button class="card" id="all"><span class="ico">🌈</span><span class="lbl">ყველა</span></button>
   </div>`);
  $('#back').onclick = renderMenu;
  document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => startWords(b.dataset.c));
  $('#all').onclick = () => startWords(null);
}
