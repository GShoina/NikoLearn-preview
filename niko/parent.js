// Parent space: math gate (not solvable by a 5-yo) + plain-language dashboard + report export. HANDOFF §4
const SUBJECTS = [
  {k:'counting', n:'თვლა'}, {k:'words', n:'სიტყვები'}, {k:'phrases', n:'ფრაზები'},
  {k:'math', n:'მათემატიკა'}, {k:'alpha', n:'ანბანი'}
];

function parentGate(){
  const a = rnd(3,9), b = rnd(3,9), ans = a*b;
  app(`<div class="hdr"><button class="pill" id="back">⬅️</button><h1>მშობლის სივრცე 👪</h1><span class="pill">🔒</span></div>
    <div class="center" style="margin-top:10vh">
      <div class="q">გადაამოწმე: ${a} × ${b} = ?</div>
      <input class="input" id="g" inputmode="numeric" autocomplete="off">
      <button class="btn big" id="ok">შესვლა</button>
    </div>`);
  const submit = () => { if(+$('#g').value === ans) renderParent(); else { $('#g').value=''; toast('თავიდან 🙂'); } };
  $('#ok').onclick = submit;
  $('#g').addEventListener('keydown', e => { if(e.key==='Enter') submit(); });
  $('#back').onclick = renderHome;
}

function kidInsight(p){
  const scored = SUBJECTS.map(s => ({ ...s, acc: accuracy(p[s.k]) })).filter(s => s.acc !== null);
  if(!scored.length) return 'ჯერ არ უთამაშია — წაახალისე დაიწყოს 🌟';
  const best = scored.reduce((a,b) => b.acc > a.acc ? b : a);
  const worst = scored.reduce((a,b) => b.acc < a.acc ? b : a);
  let t = `ძლიერია: <b>${best.n}</b> (${best.acc}%).`;
  if(worst.k !== best.k && worst.acc < 80) t += ` დასახმარებელია: <b>${worst.n}</b> (${worst.acc}%).`;
  return t;
}

function renderParent(){
  const cards = state.kids.map(k => {
    const p = state[k.id] || {};
    const subj = SUBJECTS.map(s => { const a = accuracy(p[s.k]); return a===null ? '' : `${s.n} ${a}%`; }).filter(Boolean).join(' · ');
    return `<div class="card" style="align-items:stretch;text-align:left;cursor:default">
      <div style="font-weight:800;font-size:1.1rem">${esc(k.name)} <span style="color:var(--muted)">${k.reader?'📖':'🖼️'}</span></div>
      <div>🔥 ${p.dayStreak||0} დღე · 🪙 ${p.coins||0} · 🎮 ${p.sessions||0} სესია · საუკეთესო რიგი ${p.maxCombo||0}${p.shown?` · 📣 ${p.shown}`:''}</div>
      <div style="margin-top:4px">${kidInsight(p)}</div>
      ${subj?`<div style="color:var(--muted);font-size:.9rem;margin-top:4px">${subj}</div>`:''}
    </div>`;
  }).join('');
  app(`<div class="hdr"><button class="pill" id="back">⬅️</button><h1>მშობლის სივრცე 👪</h1><span class="pill" id="exp">📋</span></div>
    <div class="grid" style="grid-template-columns:1fr">${cards}</div>
    <div class="center" style="margin-top:16px">
      <button class="btn ghost big" id="export">📋 ანგარიშის კოპირება</button>
      <button class="btn ghost" id="logout">🚪 გასვლა</button>
      <div style="color:var(--muted);font-size:.9rem;text-align:center">🔒 თქვენი შვილის მონაცემები მხოლოდ ამ მოწყობილობაზე რჩება.<br>რეკლამა და გარე ბმულები — არ არის.</div>
    </div>`);
  $('#back').onclick = renderHome;
  $('#logout').onclick = () => { state.session = false; save(); boot(); };
  const doExport = () => {
    const lines = state.kids.map(k => {
      const p = state[k.id] || {};
      const subj = SUBJECTS.map(s => { const a = accuracy(p[s.k]); return a===null ? null : `${s.n}: ${a}%`; }).filter(Boolean).join(', ');
      return `${k.name} (${k.reader?'reader':'pre-reader'}) — ${p.dayStreak||0}d streak, ${p.coins||0} coins, ${p.sessions||0} sessions. ${subj}`;
    });
    const text = 'NikoLearn — progress\n' + lines.join('\n');
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(()=>toast('დაკოპირდა 📋'), ()=>toast('ვერ მოხერხდა')); }
    else toast('ვერ მოხერხდა');
  };
  $('#export').onclick = doExport; $('#exp').onclick = doExport;
}

// ── BOOT — must stay LAST (HANDOFF §2) ──
state = load();
boot();
