/* ═══════════════════════════════════════════════════════════
   NIKO LEARN: parent: gate, dashboard, BOOT
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════ PARENT GATE + DASHBOARD ═══════════════ */
let gate={a:0,b:0,buf:''};
function openGate(){
  gate.a=ri(3,9);gate.b=ri(2,8);gate.buf='';
  const el=document.createElement('div');el.className='gate';el.id='gate';
  el.innerHTML=`<div class="gate-card">
    <h3>${I.lock} მშობლის სივრცე</h3>
    <p>ეს კარი ბავშვებისთვის არ არის. ამოხსენი მაგალითი გასაგრძელებლად.</p>
    <div class="gate-q">${gate.a} + ${gate.b} = ?</div>
    <div class="gate-display" id="gdisp"></div>
    <div class="gate-keys">${[1,2,3,4,5,6,7,8,9].map(n=>`<button onclick="gateKey(${n})">${n}</button>`).join('')}
      <button onclick="gateClear()">✕</button><button onclick="gateKey(0)">0</button><button onclick="gateOk()">${I.check}</button></div>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
}
function gateKey(n){gate.buf=(gate.buf+n).slice(0,2);$('#gdisp').textContent=gate.buf;}
function gateClear(){gate.buf='';$('#gdisp').textContent='';}
function gateOk(){if(parseInt(gate.buf)===gate.a+gate.b){$('#gate').remove();parentDash();}else{const d=$('#gdisp');d.textContent='✕';d.style.color='var(--red)';gate.buf='';setTimeout(()=>{d.textContent='';d.style.color='';},700);}}

function parentDash(){
  profile=profile||'niko';
  let html=`<div class="screen parent">${topbar('მშობლის სივრცე',null,'goHome()')}`;
  html+=`<div class="privacy-card" style="margin-bottom:16px">${I.privacy}<div class="pt"><b>ყველაფერი ამ მოწყობილობაზე რჩება.</b> პროგრესი ინახება მხოლოდ აქ. რეკლამა: ნული. გარე ბმულები: ნული.</div></div>`;
  [...state.kids.map(k=>k.id),'guest'].forEach(p=>{
    const s=state[p];if(!s||(s.sessions===0&&s.shields===0))return;
    const lv=levelOf(p);const words=Object.entries(s.words);
    const cor=words.reduce((a,[,v])=>a+v.correct,0),wr=words.reduce((a,[,v])=>a+v.wrong,0);
    const acc=cor+wr?Math.round(cor/(cor+wr)*100):0;
    const weak=words.filter(([,v])=>v.wrong>v.correct).map(([k])=>k).slice(0,5);
    const strong=words.filter(([,v])=>v.correct>=3&&v.wrong===0).map(([k])=>k).slice(0,5);
    const mins=Math.round((s.totalTime||0)/60000);
    html+=`<div class="kidcard" id="kc-${p}">
      <button class="kid-head-btn" onclick="toggleKid('${p}')" aria-expanded="false">
        <div class="avatar a-${kidObj(p).color}">${nameOf(p)[0]}</div>
        <div class="kh-meta"><div class="kn">${nameOf(p)}</div><div class="kr">${lv.ic} ${lv.name} · 🪙 ${s.shields} · სიზუსტე ${acc}%</div></div>
        <span class="kid-chev">▾</span>
      </button>
      <div class="kid-body" id="kb-${p}" hidden>
      <div class="stat-grid">
      <div class="scard"><div class="sv" style="color:var(--sun-d)">${s.shields}</div><div class="sl">🪙 მონეტა</div></div>
      <div class="scard"><div class="sv">${lv.learned}</div><div class="sl">ნასწავლი</div></div>
      <div class="scard"><div class="sv" style="color:${acc>=70?'var(--green-d)':'var(--primary-d)'}">${acc}%</div><div class="sl">სიზუსტე</div></div>
    </div>`;
    // dynamic "where is the child getting stuck / what to improve"
    const opNm={'math-add':'შეკრება','math-sub':'გამოკლება','math-mul':'გამრავლება','math-pat':'პატერნები','compare':'შედარება','skip':'დათვლა 5/10','shapes':'ფიგურები','money':'ფული','clock':'საათი'};
    const weakMath=Object.entries(s.math||{}).filter(([,v])=>{const t=v.correct+v.wrong;return t>=3&&v.correct/t<0.6;}).map(([k])=>opNm[k]||k);
    const weakAlpha=Object.entries(s.alpha||{}).filter(([,v])=>{const t=v.correct+v.wrong;return t>=3&&v.correct/t<0.7;}).map(([k])=>k==='ka-alpha'?'ქართული ანბანი':'English ანბანი');
    const recs=[];
    if(weak.length)recs.push(`სიტყვები <b>${weak.slice(0,3).join(', ')}</b>, გაიმეორეთ მოსმენით 🔊`);
    if(weakMath.length)recs.push(`მათემატიკა: <b>${weakMath.join(', ')}</b>, დაბალი დონიდან, ბუს მინიშნებებით`);
    if(weakAlpha.length)recs.push(`ანბანი: <b>${weakAlpha.join(', ')}</b>, „სწავლა" რეჟიმი ხმით`);
    let recBody;
    if(recs.length)recBody=`<b>შემდეგი ნაბიჯი ერთად:</b><br>${recs.map(r=>'• '+r).join('<br>')}<br><span class="rec-push">👉 დააჭირეთ ერთად 5 წუთი, ${nameOf(p)} მალე დაიჭერს თავს ამ თემაში.</span>`;
    else if(s.sessions>0)recBody=`<b>${nameOf(p)} მშვენივრად მიდის! 🌟</b> სიზუსტე ${acc}%. შემდეგი ნაბიჯი: სცადეთ ერთი დონით მაღლა, მზად არის.`;
    else recBody=`ჯერ საკმარისი მონაცემი არ არის, როცა ${nameOf(p)} ითამაშებს, აქ გამოჩნდება სად იჭედება და რა გასაუმჯობესებია.`;
    html+=`<div class="insight"><div class="ii">${I.spark}</div><div class="it"><b>📊 გასაუმჯობესები</b><br>${recBody}</div></div>`;
    if(strong.length)html+=`<div class="tagrow">${strong.map(w=>`<span class="tag strong">✓ ${w}</span>`).join('')}</div>`;
    if(weak.length)html+=`<div class="tagrow">${weak.map(w=>`<span class="tag weak">↻ ${w}</span>`).join('')}</div>`;
    if(Object.keys(s.math||{}).length){
      html+=`<div class="section-label" style="color:var(--purple)">მათემატიკა</div><div class="stat-grid">${Object.entries(s.math).map(([k,v])=>{const nm={'math-add':'➕','math-sub':'➖','math-mul':'✖️','math-pat':'🧩','compare':'⚖️','skip':'🔢','shapes':'🔷','money':'💰','clock':'🕐'}[k]||k;const a=v.correct+v.wrong?Math.round(v.correct/(v.correct+v.wrong)*100):0;return `<div class="scard"><div class="sv">${nm}</div><div class="sl">${a}% · ${v.correct}✓</div></div>`;}).join('')}</div>`;
    }
    // engagement / healthy-use (Case 17): frequency + gentle nudge, not a long win-log
    const avg=s.sessions?Math.round(mins/s.sessions):0;
    let engNote;
    if(s.sessions>=8)engNote=`✅ <b>რეგულარული რიტმი</b>, ${nameOf(p)} ხშირად ბრუნდება. შესანიშნავი ჩვევა! შეინარჩუნეთ მოკლე, ყოველდღიური სესიები.`;
    else if(avg>=22)engNote=`💡 ერთ ჯერზე საკმაოდ დიდხანს თამაშობს (~${avg} წთ). სჯობს <b>მოკლე, ხშირი</b> სესიები, დღეში 10–15 წუთი უკეთ მუშაობს მეხსიერებაზე.`;
    else engNote=`🌱 კარგი დასაწყისია. იდეალური რიტმი, <b>დღეში 10–15 წუთი</b>, რეგულარულად.`;
    html+=`<div class="engage">
      <div class="eng-row">
        <div class="eng-cell"><div class="eng-v">${s.sessions}</div><div class="eng-l">სესია</div></div>
        <div class="eng-cell"><div class="eng-v">${mins}</div><div class="eng-l">წუთი სულ</div></div>
        <div class="eng-cell"><div class="eng-v">${avg}</div><div class="eng-l">წთ/სესია</div></div>
        <div class="eng-cell"><div class="eng-v" style="color:var(--primary-d)">${s.maxStreak||0}</div><div class="eng-l">🔥 რეკორდი</div></div>
      </div>
      <div class="eng-note">${engNote}</div>
    </div>`;
    if(p!=='guest')html+=`<button class="btn btn-ghost btn-block" onclick="deleteKid('${p}')" style="margin-top:14px">🗑️ პროფილის წაშლა</button>`;
    html+=`</div></div>`;
  });
  html+=`<div class="section-label">📤 რეპორტი</div>
    <button class="btn btn-sky btn-block mt" onclick="exportReport()">📋 დააკოპირე რეპორტი, გაუზიარე მასწავლებელს</button>`;
  html+=`<div class="section-label">💬 უკუკავშირი</div>
    <div style="text-align:center;font-size:.85rem;color:var(--muted);margin-top:6px">
      <a href="https://wa.me/995593255385?text=NikoLearn%20feedback" target="_blank" rel="noopener" style="color:var(--primary-d);font-weight:600;text-decoration:none">დაგვიკავშირდი 💬</a>
      · <a href="mailto:gela.shonia@bivision.ge?subject=NikoLearn%20feedback" style="color:var(--muted);text-decoration:none">✉️ ელფოსტა</a>
    </div>`;
  html+=`<div class="section-label">⏱️ დრო · 🔥 ჩვევა · 🎙️ ხმოვანი თანხმობა</div>
    <button class="btn btn-ghost btn-block mt" onclick="logout()">🔒 გასვლა (ჩაკეტვა)</button>
    <button class="btn btn-ghost btn-block mt" onclick="if(confirm('წავშალო პროგრესი?')){localStorage.removeItem('${SK}');state=load();goHome();}">🗑️ პროგრესის გასუფთავება</button>`;
  html+=`</div>`;
  render(html,false);
}
// collapsible per-child cards: default collapsed (name + quick summary), tap to expand details
function toggleKid(p){
  const card=document.getElementById('kc-'+p), body=document.getElementById('kb-'+p);
  if(!body)return;
  const willOpen=body.hasAttribute('hidden');
  if(willOpen){body.removeAttribute('hidden');card&&card.classList.add('open');}
  else{body.setAttribute('hidden','');card&&card.classList.remove('open');}
  const btn=card&&card.querySelector('.kid-head-btn'); if(btn)btn.setAttribute('aria-expanded',String(willOpen));
}

/* ── profile delete (parental consent: type the confirm word in the profile's language) ── */
const DEL_WORD={ka:'წაშლა',en:'DELETE',ru:'УДАЛИТЬ'};
function confirmDelete(id){
  const k=kidObj(id);const lang=(Array.isArray(k.langs)&&k.langs[0])||'ka';
  const word=DEL_WORD[lang]||DEL_WORD.ka;
  const el=document.createElement('div');el.className='gate';el.id='delmodal';
  el.innerHTML=`<div class="gate-card del-card">
    <div class="del-ico">🗑️</div>
    <h3>${nameOf(id)}: პროფილის წაშლა</h3>
    <p>ეს სამუდამოდ წაშლის ${nameOf(id)}-ს და მთელ პროგრესს. დასადასტურებლად საჭიროა <b>მშობლის თანხმობა</b>.</p>
    <div class="del-instr">ჩაწერე <b>«${word}»</b> ქვემოთ:</div>
    <input class="login-in del-in" id="delin" autocomplete="off" autocapitalize="characters" placeholder="${word}">
    <button class="btn btn-block del-go" id="delgo" disabled onclick="doDeleteKid('${id}')">წაშლა</button>
    <button class="btn btn-ghost btn-block mt" onclick="document.getElementById('delmodal').remove()">გაუქმება</button>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
  const inp=$('#delin'),go=$('#delgo');
  inp.oninput=()=>{const ok=inp.value.trim().toLowerCase()===word.toLowerCase();go.disabled=!ok;go.classList.toggle('armed',ok);};
  inp.focus();
}
function doDeleteKid(id){
  const m=$('#delmodal');if(m)m.remove();
  state.kids=state.kids.filter(x=>x.id!==id);
  delete state[id];
  save();
  if(profile==null) goHome(); else parentDash();
}
// kept for any old callers
function deleteKid(id){confirmDelete(id);}

/* ── export report (offline: copy a plain-text summary to share) ── */
function buildReport(){
  const lines=['NIKO LEARN: პროგრესის რეპორტი',new Date().toLocaleString('ka-GE'),''];
  [...state.kids.map(k=>k.id),'guest'].forEach(p=>{
    const s=state[p];if(!s||(s.sessions===0&&s.shields===0))return;
    const lv=levelOf(p);const words=Object.values(s.words);
    const cor=words.reduce((a,v)=>a+v.correct,0),wr=words.reduce((a,v)=>a+v.wrong,0);
    const acc=cor+wr?Math.round(cor/(cor+wr)*100):0;
    const mins=Math.round((s.totalTime||0)/60000);
    lines.push(`■ ${nameOf(p)} (${kidObj(p).age} წ.)`);
    lines.push(`  დონე: ${lv.name} · მონეტა: ${s.shields} · ნასწავლი: ${lv.learned} სიტყვა`);
    lines.push(`  სიზუსტე: ${acc}% · სესია: ${s.sessions} · დრო: ${mins} წთ · 🔥 რეკორდი: ${s.maxStreak||0}`);
    const weak=Object.entries(s.words).filter(([,v])=>v.wrong>v.correct).map(([k])=>k).slice(0,6);
    if(weak.length)lines.push(`  გასამეორებელი: ${weak.join(', ')}`);
    const opNm={'math-add':'შეკრება','math-sub':'გამოკლება','math-mul':'გამრავლება','math-pat':'პატერნები','compare':'შედარება','skip':'დათვლა 5/10','shapes':'ფიგურები','money':'ფული','clock':'საათი'};
    Object.entries(s.math||{}).forEach(([k,v])=>{const a=v.correct+v.wrong?Math.round(v.correct/(v.correct+v.wrong)*100):0;lines.push(`  ${opNm[k]||k}: ${a}%`);});
    lines.push('');
  });
  return lines.join('\n');
}
function exportReport(){
  const txt=buildReport();
  const done=()=>toast('✓ რეპორტი კოპირებულია, ჩასვი და გაუზიარე');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(done).catch(()=>fallbackCopy(txt,done));
  } else fallbackCopy(txt,done);
}
function fallbackCopy(txt,cb){
  const ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';
  document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}
  document.body.removeChild(ta);cb&&cb();
}
function toast(msg){
  let t=$('#toast');if(t)t.remove();
  t=document.createElement('div');t.id='toast';t.className='toast';t.textContent=(window.UILANG==='en'&&window.t_en)?window.t_en(msg):msg;
  $('.device').appendChild(t);setTimeout(()=>{if($('#toast'))$('#toast').remove();},2400);
}

/* ═══════════════ BOOT ═══════════════ */
state=load();boot();
// re-render on theme/ai tweak change
window.addEventListener('niko-tweak',()=>{ if($('#aifab')) syncAiFab(); });
if('serviceWorker'in navigator){/* PWA: registered in production build */}
