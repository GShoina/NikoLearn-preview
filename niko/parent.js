/* ═══════════════════════════════════════════════════════════
   NIKO LEARN: parent: gate, dashboard, BOOT
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════ PARENT GATE + DASHBOARD ═══════════════ */
let gate={a:0,b:0,ans:0,buf:''};
// dispatcher: a real 4-digit PIN if the parent set one, otherwise the kid-proof arithmetic gate.
function openGate(){ if(state.parentPin) return openPinGate(); openGateMath(); }
// hard=true → PIN-recovery path: a 2-digit × 1-digit problem (3-digit answer) that is ABOVE the app's own
// teaching ceiling, so a 6–9 yo can't use „forgot PIN" as a trivial bypass (owner 2026-06-14). Normal entry
// (no PIN set) keeps the easy single-digit addition = kid-proof for toddlers but not a real secret.
function openGateMath(hard){
  let q;
  if(hard){ gate.a=ri(11,19); gate.b=ri(6,9); gate.ans=gate.a*gate.b; q=`${gate.a} × ${gate.b}`; }
  else    { gate.a=ri(3,9);   gate.b=ri(2,8); gate.ans=gate.a+gate.b; q=`${gate.a} + ${gate.b}`; }
  gate.buf='';
  const el=document.createElement('div');el.className='gate';el.id='gate';
  el.innerHTML=`<div class="gate-card">
    <h3>${I.lock} ${hard?'მშობლის აღდგენა':'მშობლის სივრცე'}</h3>
    <p>${hard?'PIN დაგავიწყდა? ეს მაგალითი მხოლოდ მშობელს შეუძლია.':'ეს კარი ბავშვებისთვის არ არის. ამოხსენი მაგალითი გასაგრძელებლად.'}</p>
    <div class="gate-q">${q} = ?</div>
    <div class="gate-display" id="gdisp"></div>
    <div class="gate-keys">${[1,2,3,4,5,6,7,8,9].map(n=>`<button onclick="gateKey(${n})">${n}</button>`).join('')}
      <button onclick="gateClear()">✕</button><button onclick="gateKey(0)">0</button><button onclick="gateOk()">${I.check}</button></div>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
}
function gateKey(n){gate.buf=(gate.buf+n).slice(0,3);$('#gdisp').textContent=gate.buf;}
function gateClear(){gate.buf='';const d=$('#gdisp');if(d)d.textContent='';}
function gateOk(){if(parseInt(gate.buf)===gate.ans){$('#gate').remove();parentDash();}else{const d=$('#gdisp');d.textContent='✕';d.style.color='var(--red)';gate.buf='';setTimeout(()=>{d.textContent='';d.style.color='';},700);}}

/* ── real 4-digit parent PIN (gate hardening v1.99) ── */
function openPinGate(){
  gate.buf='';
  const el=document.createElement('div');el.className='gate';el.id='gate';
  el.innerHTML=`<div class="gate-card">
    <h3>${I.lock} მშობლის სივრცე</h3>
    <p>შეიყვანე 4-ნიშნა PIN-კოდი.</p>
    <div class="gate-display" id="gdisp"></div>
    <div class="gate-keys">${[1,2,3,4,5,6,7,8,9].map(n=>`<button onclick="pinKey(${n})">${n}</button>`).join('')}
      <button onclick="gateClear()">✕</button><button onclick="pinKey(0)">0</button><button onclick="pinOk()">${I.check}</button></div>
    <button class="btn btn-ghost btn-block mt" style="font-size:.82rem" onclick="pinForgot()">დაგავიწყდა? ➜ მაგალითით შესვლა</button>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
}
function pinKey(n){gate.buf=(gate.buf+n).slice(0,4);const d=$('#gdisp');if(d)d.textContent='•'.repeat(gate.buf.length);}
function pinOk(){
  if(gate.buf===state.parentPin){$('#gate').remove();parentDash();}
  else{const d=$('#gdisp');if(d){d.textContent='✕';d.style.color='var(--red)';}gate.buf='';setTimeout(()=>{const e=$('#gdisp');if(e){e.textContent='';e.style.color='';}},700);}
}
function pinForgot(){const g=$('#gate');if(g)g.remove();openGateMath(true);} // recovery: ADULT-level problem, not the kid math (owner 2026-06-14)
function setParentPin(){
  const a=prompt(tx('ახალი 4-ნიშნა PIN-კოდი:'));if(a==null)return;
  if(!/^\d{4}$/.test(a.trim())){alert(tx('PIN უნდა იყოს ზუსტად 4 ციფრი.'));return;}
  const b=prompt(tx('გაიმეორე PIN-კოდი:'));if(b==null)return;
  if(a.trim()!==b.trim()){alert(tx('კოდები არ ემთხვევა. სცადე თავიდან.'));return;}
  state.parentPin=a.trim();save();alert(tx('PIN-კოდი დაყენდა. ✓'));parentDash();
}
function clearParentPin(){if(confirm(tx('მოვხსნა PIN-კოდი? სივრცეს მაინც დაიცავს მაგალითი.'))){state.parentPin=null;save();parentDash();}}
function setScreenLimit(m){state.screenLimitMin=m;save();try{if(window.Analytics)Analytics.event('screenlimit_set',{minutes:String(m)});}catch(e){}parentDash();}
function togglePremium(){state.premium=(state.premium===false)?true:false;save();parentDash();}
// owner-device marker (honest LOCAL flag, not security): when on, analytics.js skips telemetry from this
// device so real-user launch stats stay clean. Lives in the PIN-gated parent space. (closes audit B4)
function toggleOwnerDevice(){try{if(localStorage.getItem('niko_owner')==='1')localStorage.removeItem('niko_owner');else localStorage.setItem('niko_owner','1');}catch(e){}parentDash();}

/* ── D3 (v2.02): structured parent feedback form. Privacy-clean: nothing is auto-collected — the
   parent's own mail app sends it, so the only data shared is what the parent chooses to send. ── */
function feedbackForm(){
  try{if(window.Analytics)Analytics.event('feedback_open');}catch(e){}
  const el=document.createElement('div');el.className='gate';el.id='fbform';
  el.innerHTML=`<div class="gate-card" style="max-width:360px">
    <h3>💬 დაგვიკავშირდი</h3>
    <p style="font-size:.85rem;color:var(--muted)">დაგვიტოვე შენი აზრი ან საკონტაქტო. ყველა ველი ნებაყოფლობითია.</p>
    <input class="login-in" id="fb-name" placeholder="სახელი (არასავალდებულო)" autocomplete="name">
    <input class="login-in" id="fb-phone" placeholder="ტელეფონი (არასავალდებულო)" inputmode="tel" autocomplete="tel">
    <input class="login-in" id="fb-email" placeholder="ელფოსტა (არასავალდებულო)" inputmode="email" autocomplete="email">
    <textarea class="login-in" id="fb-msg" placeholder="შენი აზრი…" style="min-height:88px;resize:vertical;text-align:left"></textarea>
    <button class="btn btn-primary btn-block mt" onclick="sendFeedback()">📨 გაგზავნა</button>
    <button class="btn btn-ghost btn-block mt" onclick="document.getElementById('fbform').remove()">დახურვა</button>
    <p class="consent-note" style="font-size:.72rem">შეტყობინება იგზავნება NikoLearn-თან, რომ დაგიკავშირდეთ. ბავშვის სწავლის მონაცემები მაინც მხოლოდ მოწყობილობაზე რჩება.</p>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
  const n=$('#fb-name');if(n)n.focus();
}
// D3 (v1.179): real DELIVERY — POST the message to NikoLearn so the parent gets a true „✓ received"
// confirmation and the owner can actually read it (was mailto-only: no confirmation, never visible).
// Child learning data is NOT sent; only the parent's own voluntary message + optional contact.
const NIKO_FB_ENDPOINT='https://nikolearn-t.bivision.workers.dev/v1/feedback';
function sendFeedback(){
  const g=id=>(($('#'+id)||{}).value||'').trim();
  const name=g('fb-name'),phone=g('fb-phone'),email=g('fb-email'),msg=g('fb-msg');
  if(!msg&&!phone&&!email){toast('დაწერე აზრი ან დატოვე საკონტაქტო');return;}
  // offline / worker-down → fall back to the parent's own mail app so nothing is lost.
  const mailFallback=()=>{
    const body=`NikoLearn გამოხმაურება\n\nსახელი: ${name||'-'}\nტელეფონი: ${phone||'-'}\nელფოსტა: ${email||'-'}\n\nაზრი:\n${msg||'-'}`;
    try{ location.href='mailto:NikoLearn@outlook.com?subject='+encodeURIComponent('NikoLearn გამოხმაურება')+'&body='+encodeURIComponent(body); }catch(e){}
  };
  const btn=$('#fbform .btn-primary'); if(btn){btn.disabled=true;btn.textContent='იგზავნება…';}
  let done=false; const fail=()=>{ if(done)return; done=true; const f=$('#fbform');if(f)f.remove(); mailFallback(); toast('✓ მადლობა! იხსნება ფოსტის აპი სარეზერვოდ'); };
  const t=setTimeout(fail,6000); // network stall → don't leave the parent hanging
  fetch(NIKO_FB_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,phone,email,msg}),credentials:'omit'})
    .then(r=>{ if(!r.ok)throw 0; clearTimeout(t); if(done)return; done=true; try{if(window.Analytics)Analytics.event('feedback_send');}catch(e){} const f=$('#fbform');if(f)f.remove(); fbConfirm(); })
    .catch(()=>{ clearTimeout(t); fail(); });
}
// the real delivery confirmation a parent expects (owner ask 2026-06-15).
function fbConfirm(){
  const el=document.createElement('div');el.className='gate';el.id='fbok';
  el.innerHTML=`<div class="gate-card" style="max-width:340px;text-align:center">
    <div style="font-size:2.6rem;line-height:1">✓</div>
    <h3>მიღებულია, მადლობა!</h3>
    <p style="font-size:.9rem;color:var(--muted)">შენი შეტყობინება ჩაგვივიდა. თუ საკონტაქტო დატოვე, მალე გიპასუხებთ.</p>
    <button class="btn btn-primary btn-block mt" onclick="document.getElementById('fbok').remove()">კარგი</button>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
}

/* ── D1 (v2.03): parent goal-setting + tracking ── */
function kidGoalModal(p){
  const el=document.createElement('div');el.className='gate';el.id='goalmodal';
  el.innerHTML=`<div class="gate-card" style="max-width:340px">
    <h3>🎯 დაუსახე მიზანი, ${nameOf(p)}</h3>
    <p style="font-size:.84rem;color:var(--muted)">აირჩიე, რას მივადევნოთ თვალი.</p>
    <button class="btn btn-ghost btn-block" onclick="pickGoal('${p}','words',30,'30 ინგლისური სიტყვა')">📚 30 ინგლისური სიტყვა</button>
    <button class="btn btn-ghost btn-block mt" onclick="pickGoal('${p}','words',50,'50 ინგლისური სიტყვა')">📚 50 ინგლისური სიტყვა</button>
    <button class="btn btn-ghost btn-block mt" onclick="pickGoal('${p}','streak',7,'7 დღე ზედიზედ')">🔥 7 დღე ზედიზედ</button>
    <button class="btn btn-ghost btn-block mt" onclick="pickGoal('${p}','total',50,'ჯამური პროგრესი 50%')">📊 ჯამური პროგრესი 50%</button>
    <button class="btn btn-ghost btn-block mt" onclick="document.getElementById('goalmodal').remove()">დახურვა</button>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
}
function pickGoal(p,type,target,label){const s=state[p];s.goal={type,target,label,date:new Date().toISOString()};save();try{if(window.Analytics)Analytics.event('goal_set',{type:type});}catch(e){}const m=$('#goalmodal');if(m)m.remove();parentDash();}
function clearGoal(p){const s=state[p];delete s.goal;save();parentDash();}
function goalProgress(p){
  const s=state[p],g=s&&s.goal;if(!g)return null;
  let cur=0;
  if(g.type==='words')cur=(typeof wordsMastered==='function')?wordsMastered(p):0;
  else if(g.type==='streak')cur=s.dayStreak||0;
  else if(g.type==='total')cur=(typeof totalProgress==='function')?totalProgress(p).pct:0;
  const pct=g.target?Math.min(100,Math.round(cur/g.target*100)):0;
  return {cur,target:g.target,pct,label:g.label,done:cur>=g.target};
}

function parentDash(){
  try{if(window.Analytics)Analytics.event('parent_open');}catch(e){}
  profile=profile||'niko';
  let html=`<div class="screen parent">${topbarPlain('მშობლის სივრცე','goHome()')}`;
  html+=`<div class="privacy-card" style="margin-bottom:16px">${I.privacy}<div class="pt"><b>ყველაფერი ამ მოწყობილობაზე რჩება.</b> პროგრესი ინახება მხოლოდ აქ. რეკლამა: ნული. გარე ბმულები: ნული.</div></div>`;
  [...state.kids.map(k=>k.id),'guest'].forEach(p=>{
    const s=state[p];if(!s||(s.sessions===0&&s.shields===0))return;
    const en=(window.UILANG==='en');  // build dashboard prose bilingual (re-rendered on lang toggle)
    const lv=levelOf(p);const words=Object.entries(s.words);
    const cor=words.reduce((a,[,v])=>a+v.correct,0),wr=words.reduce((a,[,v])=>a+v.wrong,0);
    const acc=cor+wr?Math.round(cor/(cor+wr)*100):0;
    const weak=words.filter(([,v])=>v.wrong>v.correct).map(([k])=>k).slice(0,5);
    const strong=words.filter(([,v])=>v.correct>=3&&v.wrong===0).map(([k])=>k).slice(0,5);
    const mins=Math.round((s.totalTime||0)/60000);
    html+=`<div class="kidcard" id="kc-${p}">
      <button class="kid-head-btn" onclick="toggleKid('${p}')" aria-expanded="false">
        <div class="avatar a-${kidObj(p).color}">${nameOf(p)[0]}</div>
        <div class="kh-meta"><div class="kn">${nameOf(p)}</div><div class="kr">${lv.ic} ${en?tx(lv.name):lv.name} · 🪙 ${s.shields} · ${en?'accuracy':'სიზუსტე'} ${acc}%</div></div>
        <span class="kid-chev">▾</span>
      </button>
      <div class="kid-body" id="kb-${p}" hidden>
      <div class="stat-grid">
      <div class="scard"><div class="sv" style="color:var(--sun-d)">${s.shields}</div><div class="sl">🪙 მონეტა</div></div>
      <div class="scard"><div class="sv">${lv.learned}</div><div class="sl">ნასწავლი</div></div>
      <div class="scard"><div class="sv" style="color:${acc>=70?'var(--green-d)':'var(--primary-d)'}">${acc}%</div><div class="sl">სიზუსტე</div></div>
    </div>`;
    // dynamic "where is the child getting stuck / what to improve"
    const opNm={'math-add':'შეკრება','math-sub':'გამოკლება','math-mul':'გამრავლება','math-div':'გაყოფა','math-miss':'გამოტოვებული','math-pat':'პატერნები','compare':'შედარება','skip':'დათვლა 5/10','shapes':'ფიგურები','money':'ფული','clock':'საათი'};
    const weakMath=Object.entries(s.math||{}).filter(([,v])=>{const t=v.correct+v.wrong;return t>=3&&v.correct/t<0.6;}).map(([k])=>opNm[k]||k);
    const weakAlpha=Object.entries(s.alpha||{}).filter(([,v])=>{const t=v.correct+v.wrong;return t>=3&&v.correct/t<0.7;}).map(([k])=>k==='ka-alpha'?'ქართული ანბანი':'English ანბანი');
    // OWNER ask 2026-06-10: a clear "what the child already learned + how they grew" instrument
    const masteredW=words.filter(([,v])=>v.correct>=3).map(([k])=>k);
    const masteredM=Object.entries(s.math||{}).filter(([,v])=>{const t=v.correct+v.wrong;return t>=4&&v.correct/t>=0.8;}).map(([k])=>opNm[k]||k);
    const masteredA=Object.entries(s.alpha||{}).filter(([,v])=>{const t=v.correct+v.wrong;return t>=4&&v.correct/t>=0.8;}).map(([k])=>k==='ka-alpha'?'ქართული ანბანი':'English ანბანი');
    const learnedBits=[];
    if(masteredW.length)learnedBits.push(en?`<b>${masteredW.length}</b> English words`:`<b>${masteredW.length}</b> ინგლისური სიტყვა`);
    if(masteredM.length)learnedBits.push(en?`Math: <b>${masteredM.map(x=>tx(x)).join(', ')}</b>`:`მათემატიკა: <b>${masteredM.join(', ')}</b>`);
    if(masteredA.length)learnedBits.push(`<b>${masteredA.map(x=>en?tx(x):x).join(', ')}</b>`);
    let growth='';
    const tp=(typeof totalProgress==='function')?totalProgress(p):null;
    if(tp&&tp.total){
      growth=`<div style="margin-top:8px;font-size:.86rem">📈 <b>${en?'Total progress:':'ჯამური პროგრესი:'}</b> ${tp.done}/${tp.total} ${en?'stages':'ეტაპი'} (${tp.pct}%)`+
        (s.maxDayStreak?` · 🔥 ${en?'best streak:':'საუკეთესო სერია:'} ${s.maxDayStreak} ${en?'days':'დღე'}`:'')+`</div>`;
    }
    const learnedBody=learnedBits.length
      ?`${en?'Already knows:':'უკვე იცის:'} ${learnedBits.join(' · ')}.`
      :(s.sessions>0?(en?'Still processing, the first learned topics will appear soon.':'ჯერ მუშავდება, მალე გამოჩნდება პირველი ნასწავლი თემები.'):(en?"Hasn't played yet.":'ჯერ არ უთამაშია.'));
    // 2.3: "truly learned" (3 correct in a row) shown DISTINCT from "encountered/practiced" above
    const reallyLearned=(typeof wordsLearned==='function')?wordsLearned(p):0;
    const learnedLine=reallyLearned?`<div style="margin-top:6px;font-size:.86rem">✅ <b>${en?'Truly learned':'ათვისებული'}</b> (${en?'3 right in a row':'3-ჯერ ზედიზედ სწორად'}): <b>${reallyLearned}</b> ${en?'words':'სიტყვა'}</div>`:'';
    const reinforced=(typeof wordsReinforced==='function')?wordsReinforced(p):0;
    const reinforcedLine=reinforced?`<div style="margin-top:4px;font-size:.86rem">🔁 <b>${en?'Well remembered':'კარგად დამახსოვრებული'}</b>: <b>${reinforced}</b> ${en?'words':'სიტყვა'}</div>`:'';
    html+=`<div class="insight" style="background:rgba(0,166,81,.07)"><div class="ii">✅</div><div class="it"><b>🌟 უკვე ისწავლა და განვითარდა</b><br>${learnedBody}${learnedLine}${reinforcedLine}${growth}</div></div>`;
    const gp=(typeof goalProgress==='function')?goalProgress(p):null;
    if(gp){
      html+=`<div class="insight" style="background:rgba(107,99,181,.08)"><div class="ii">🎯</div><div class="it"><b>მიზანი:</b> ${gp.label} ${gp.done?'<span style="color:var(--green-d)">✓ მიღწეულია!</span>':''}<div class="bar" style="margin-top:8px"><i style="width:${gp.pct}%"></i></div><div style="font-size:.8rem;color:var(--muted);margin-top:5px">${gp.cur}/${gp.target} (${gp.pct}%) <button class="ai-chip" style="margin-left:6px" onclick="kidGoalModal('${p}')">შეცვლა</button> <button class="ai-chip" onclick="clearGoal('${p}')">მოხსნა</button></div></div></div>`;
    } else {
      html+=`<button class="btn btn-ghost btn-block" style="margin-top:4px" onclick="kidGoalModal('${p}')">🎯 დაუსახე მიზანი</button>`;
    }
    const recs=[];
    if(weak.length)recs.push(en?`Words <b>${weak.slice(0,3).join(', ')}</b>, repeat them by listening 🔊`:`სიტყვები <b>${weak.slice(0,3).join(', ')}</b>, გაიმეორეთ მოსმენით 🔊`);
    if(weakMath.length)recs.push(en?`Math: <b>${weakMath.map(x=>tx(x)).join(', ')}</b>, from a lower level, with the owl's hints`:`მათემატიკა: <b>${weakMath.join(', ')}</b>, დაბალი დონიდან, ბუს მინიშნებებით`);
    if(weakAlpha.length)recs.push(en?`Alphabet: <b>${weakAlpha.map(x=>tx(x)).join(', ')}</b>, the "Learn" mode with sound`:`ანბანი: <b>${weakAlpha.join(', ')}</b>, „სწავლა" რეჟიმი ხმით`);
    let recBody;
    if(recs.length)recBody=en
      ?`<b>Next step, together:</b><br>${recs.map(r=>'• '+r).join('<br>')}<br><span class="rec-push">👉 Sit together for 5 minutes, ${nameOf(p)} will soon get the hang of this topic.</span>`
      :`<b>შემდეგი ნაბიჯი ერთად:</b><br>${recs.map(r=>'• '+r).join('<br>')}<br><span class="rec-push">👉 დააჭირეთ ერთად 5 წუთი, ${nameOf(p)} მალე დაიჭერს თავს ამ თემაში.</span>`;
    else if(s.sessions>0)recBody=en
      ?`<b>${nameOf(p)} is doing wonderfully! 🌟</b> Accuracy ${acc}%. Next step: try one level up, they're ready.`
      :`<b>${nameOf(p)} მშვენივრად მიდის! 🌟</b> სიზუსტე ${acc}%. შემდეგი ნაბიჯი: სცადეთ ერთი დონით მაღლა, მზად არის.`;
    else recBody=en
      ?`There isn't enough data yet. Once ${nameOf(p)} plays, this will show where they get stuck and what to improve.`
      :`ჯერ საკმარისი მონაცემი არ არის, როცა ${nameOf(p)} ითამაშებს, აქ გამოჩნდება სად იჭედება და რა გასაუმჯობესებია.`;
    html+=`<div class="insight"><div class="ii">🦉</div><div class="it"><b>${en?"Niko's tip for parents":'ნიკოს რჩევა მშობელს'}</b><br>${recBody}</div></div>`;
    if(strong.length)html+=`<div class="tagrow">${strong.map(w=>`<span class="tag strong">✓ ${w}</span>`).join('')}</div>`;
    if(weak.length)html+=`<div class="tagrow">${weak.map(w=>`<span class="tag weak">↻ ${w}</span>`).join('')}</div>`;
    if(Object.keys(s.math||{}).length){
      html+=`<div class="section-label" style="color:var(--purple)">მათემატიკა</div><div class="stat-grid">${Object.entries(s.math).map(([k,v])=>{const nm={'math-add':'➕','math-sub':'➖','math-mul':'✖️','math-div':'➗','math-miss':'❓','math-pat':'🧩','compare':'⚖️','skip':'🔢','shapes':'🔷','money':'💰','clock':'🕐'}[k]||k;const a=v.correct+v.wrong?Math.round(v.correct/(v.correct+v.wrong)*100):0;return `<div class="scard"><div class="sv">${nm}</div><div class="sl">${a}% · ${v.correct}✓</div></div>`;}).join('')}</div>`;
    }
    // engagement / healthy-use (Case 17): frequency + gentle nudge, not a long win-log
    const avg=s.sessions?Math.round(mins/s.sessions):0;
    let engNote;
    if(s.sessions>=8)engNote=en
      ?`✅ <b>A regular rhythm</b>, ${nameOf(p)} comes back often. A great habit! Keep sessions short and daily.`
      :`✅ <b>რეგულარული რიტმი</b>, ${nameOf(p)} ხშირად ბრუნდება. შესანიშნავი ჩვევა! შეინარჩუნეთ მოკლე, ყოველდღიური სესიები.`;
    else if(avg>=22)engNote=en
      ?`💡 Plays quite long in one go (~${avg} min). <b>Short, frequent</b> sessions are better, 10–15 minutes a day works best for memory.`
      :`💡 ერთ ჯერზე საკმაოდ დიდხანს თამაშობს (~${avg} წთ). სჯობს <b>მოკლე, ხშირი</b> სესიები, დღეში 10–15 წუთი უკეთ მუშაობს მეხსიერებაზე.`;
    else engNote=en
      ?`🌱 A good start. The ideal rhythm is <b>10–15 minutes a day</b>, regularly.`
      :`🌱 კარგი დასაწყისია. იდეალური რიტმი, <b>დღეში 10–15 წუთი</b>, რეგულარულად.`;
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
  // v1.108: settings grouped into 3 tidy cards (was a long flat list of label+button stacks)
  const lim=state.screenLimitMin||0;const hasPin=!!state.parentPin;const prem=premiumOn();
  html+=`<div class="pgroup"><div class="pgroup-h">📤 გაზიარება</div>
    <button class="btn btn-sky btn-block" onclick="exportReport()">📋 რეპორტი მასწავლებელს</button>
    <button class="btn btn-ghost btn-block mt" onclick="feedbackForm()">💬 დაგვიტოვე აზრი ან საკონტაქტო</button>
    <div class="pset-hint">ან: <a href="https://wa.me/995593255385?text=NikoLearn%20feedback" target="_blank" rel="noopener" style="color:var(--primary-d);font-weight:600;text-decoration:none">WhatsApp 💬</a> · <a href="mailto:NikoLearn@outlook.com?subject=NikoLearn%20feedback" style="color:inherit;text-decoration:none">✉️ ელფოსტა</a></div>
  </div>`;
  const ownerDev=(function(){try{return localStorage.getItem('niko_owner')==='1';}catch(e){return false;}})();
  html+=`<div class="pgroup"><div class="pgroup-h">ℹ️ მფლობელი</div>
    <button class="btn btn-ghost btn-block" onclick="toggleOwnerDevice()">📱 ეს ჩემი მოწყობილობაა <b>${ownerDev?'✓':''}</b></button>
    <div class="pset-hint">ჩართულზე ამ მოწყობილობის გამოყენება სტატისტიკაში არ ითვლება.</div>
    <button class="btn btn-ghost btn-block mt" onclick="adminView()">ℹ️ ვერსია და ანალიტიკა</button>
  </div>`;
  html+=`<div class="pgroup"><div class="pgroup-h">📦 ახალ მოწყობილობაზე გადატანა</div>
    <div class="pset-hint" style="margin-bottom:8px">ახალ ტელეფონს იყენებ? გადაიტანე ბავშვის პროგრესი (დონეები და ვარსკვლავები) კოდით. ღრუბელი და ანგარიში არ სჭირდება.</div>
    <button class="btn btn-ghost btn-block" onclick="backupCode()">📦 სარეზერვო კოდის შექმნა</button>
    <button class="btn btn-ghost btn-block mt" onclick="restoreCode()">♻️ აღდგენა კოდით</button>
  </div>`;
  html+=`<div class="pgroup"><div class="pgroup-h">⏱️ დრო და უსაფრთხოება</div>
    <div class="pset-lbl">ეკრანის დღიური ლიმიტი</div>
    <div class="limit-chips">${[0,15,30,45,60].map(m=>`<button class="lang-chip ${lim===m?'on':''}" onclick="setScreenLimit(${m})">${m===0?'გამორთ.':m+' წთ'}</button>`).join('')}</div>
    <div class="pset-hint">ამ დროის ამოწურვის შემდეგ ნიკო ხვალამდე დაისვენებს.</div>
    <div class="pset-lbl" style="margin-top:14px">მშობლის PIN-კოდი</div>
    <button class="btn btn-ghost btn-block" onclick="setParentPin()">${hasPin?'🔑 შეცვალე PIN-კოდი':'🔑 დააყენე 4-ნიშნა PIN-კოდი'}</button>
    ${hasPin?'<button class="btn btn-ghost btn-block mt" onclick="clearParentPin()">PIN-კოდის მოხსნა</button>':''}
    <div class="pset-hint">${hasPin?'მშობლის სივრცეში მხოლოდ PIN-კოდით შეხვალ.':'PIN-კოდის ნაცვლად მშობლის სივრცეს მათემატიკური ამოცანა იცავს, რომელსაც პატარა ვერ ამოხსნის.'}</div>
  </div>`;
  html+=`<div class="pgroup"><div class="pgroup-h">⚙️ ანგარიში</div>
    <div class="pset-lbl">💎 Premium (დემო)</div>
    <div class="pset-hint">უფასო: სრული საბაზისო სწავლა. Premium: საგამოცდო მზადება (კინგსი), 8-12 დონე, მიზნები. გადახდა ჯერ არ არის, გადამრთველი მხოლოდ საჩვენებელია.</div>
    <button class="btn btn-ghost btn-block" onclick="togglePremium()">${prem?'👁️ ნახე როგორია უფასო ვერსია (Premium OFF)':'👑 Premium-ის ჩართვა'}</button>
    <button class="btn btn-ghost btn-block mt" onclick="logout()">🔒 გასვლა (ჩაკეტვა)</button>
    <button class="btn btn-ghost btn-block mt" onclick="if(confirm(tx('წავშალო პროგრესი?'))){localStorage.removeItem('${SK}');state=load();goHome();}">🗑️ პროგრესის გასუფთავება</button>
  </div>`;
  html+=`</div>`;
  render(html,false);
}
/* ── profile portability: device-to-device backup via a copyable code (no backend, no account) ── */
function _xferOverlay(inner){
  const ov=document.createElement('div');ov.className='overlay';ov.id='niko-xfer';ov.style.zIndex='90';
  ov.onclick=(e)=>{if(e.target===ov)ov.remove();};
  ov.innerHTML=`<div class="ai-bubble" onclick="event.stopPropagation()" style="max-width:380px;width:90%">${inner}</div>`;
  (document.querySelector('.device')||document.body).appendChild(ov);
  if(window.applyLang)applyLang(ov);
  return ov;
}
function backupCode(){
  let code='';try{code='NL1:'+btoa(unescape(encodeURIComponent(JSON.stringify(state))));}catch(e){}
  _xferOverlay(`<button class="ai-close" onclick="document.getElementById('niko-xfer').remove()" aria-label="დახურვა">✕</button>
    <div class="ai-text" style="font-weight:700;margin-bottom:6px">📦 სარეზერვო კოდი</div>
    <div class="pset-hint" style="margin-bottom:8px">დააკოპირე და შეინახე: გაუგზავნე საკუთარ თავს მესიჯად ან ფოსტით. ახალ მოწყობილობაზე ჩასვი „აღდგენაში".</div>
    <textarea readonly id="niko-bk" style="width:100%;height:80px;font-size:.78rem;border-radius:8px;border:1px solid var(--line);padding:8px;resize:none">${code}</textarea>
    <button class="btn btn-primary btn-block mt" onclick="var t=document.getElementById('niko-bk');t.select();try{document.execCommand('copy');}catch(e){}try{navigator.clipboard&&navigator.clipboard.writeText(t.value);}catch(e){}this.textContent='✓ დაკოპირდა';">📋 კოპირება</button>`);
}
function restoreCode(){
  _xferOverlay(`<button class="ai-close" onclick="document.getElementById('niko-xfer').remove()" aria-label="დახურვა">✕</button>
    <div class="ai-text" style="font-weight:700;margin-bottom:6px">♻️ აღდგენა კოდით</div>
    <div class="pset-hint" style="margin-bottom:8px">ჩასვი სარეზერვო კოდი. ამ მოწყობილობის ახლანდელი მონაცემი ჩაანაცვლდება აღდგენილით.</div>
    <textarea id="niko-rs" placeholder="ჩასვი კოდი აქ" style="width:100%;height:80px;font-size:.78rem;border-radius:8px;border:1px solid var(--line);padding:8px;resize:none"></textarea>
    <button class="btn btn-primary btn-block mt" onclick="doRestore()">♻️ აღდგენა</button>`);
}
function doRestore(){
  const t=document.getElementById('niko-rs');let raw=(t&&t.value||'').trim();
  if(raw.indexOf('NL1:')===0)raw=raw.slice(4);
  let obj=null;try{obj=JSON.parse(decodeURIComponent(escape(atob(raw))));}catch(e){}
  if(!obj||!Array.isArray(obj.kids)){alert('კოდი არასწორია. გადაამოწმე და სცადე ხელახლა.');return;}
  if(!confirm('ამ მოწყობილობის მონაცემი ჩაანაცვლდება. გავაგრძელო?'))return;
  state=obj;save();const ov=document.getElementById('niko-xfer');if(ov)ov.remove();
  alert('აღდგენილია ✓');goHome();
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
  // owner 2026-06-14: if a parent PIN exists, deletion REQUIRES that PIN (strongest signal a child can't pass);
  // only when no PIN is set do we fall back to the type-the-word confirmation.
  const needPin=!!state.parentPin;
  const el=document.createElement('div');el.className='gate';el.id='delmodal';
  el.innerHTML=`<div class="gate-card del-card">
    <div class="del-ico">🗑️</div>
    <h3>${nameOf(id)}: პროფილის წაშლა</h3>
    <p>ეს სამუდამოდ წაშლის ${nameOf(id)}-ს და მთელ პროგრესს. დასადასტურებლად საჭიროა <b>მშობლის თანხმობა</b>.</p>
    <div class="del-instr">${needPin?'შეიყვანე <b>მშობლის PIN-კოდი</b> წასაშლელად:':'ჩაწერე <b>«'+word+'»</b> ქვემოთ:'}</div>
    <input class="login-in del-in" id="delin" autocomplete="off" ${needPin?'inputmode="numeric" type="password" maxlength="4" placeholder="••••"':'autocapitalize="characters" placeholder="'+word+'"'}>
    <button class="btn btn-block del-go" id="delgo" disabled onclick="doDeleteKid('${id}')">წაშლა</button>
    <button class="btn btn-ghost btn-block mt" onclick="document.getElementById('delmodal').remove()">გაუქმება</button>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
  const inp=$('#delin'),go=$('#delgo');
  inp.oninput=()=>{const ok=needPin ? inp.value.trim()===state.parentPin : inp.value.trim().toLowerCase()===word.toLowerCase();go.disabled=!ok;go.classList.toggle('armed',ok);};
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
    const opNm={'math-add':'შეკრება','math-sub':'გამოკლება','math-mul':'გამრავლება','math-div':'გაყოფა','math-miss':'გამოტოვებული','math-pat':'პატერნები','compare':'შედარება','skip':'დათვლა 5/10','shapes':'ფიგურები','money':'ფული','clock':'საათი'};
    Object.entries(s.math||{}).forEach(([k,v])=>{const a=v.correct+v.wrong?Math.round(v.correct/(v.correct+v.wrong)*100):0;lines.push(`  ${opNm[k]||k}: ${a}%`);});
    lines.push('');
  });
  return lines.join('\n');
}
// v2.07: the old clipboard-only export silently failed for the owner. Now it shows the report in a
// modal (always visible + selectable), with a reliable copy + a WhatsApp share.
function exportReport(){
  const txt=buildReport();
  const el=document.createElement('div');el.className='gate';el.id='repmodal';
  el.innerHTML=`<div class="gate-card" style="max-width:380px">
    <h3>📋 პროგრესის რეპორტი</h3>
    <p style="font-size:.85rem;color:var(--muted)">დააკოპირე და გაუგზავნე მასწავლებელს ან ოჯახს.</p>
    <textarea id="reptxt" class="login-in" style="min-height:150px;font-size:.8rem;text-align:left;line-height:1.4;white-space:pre-wrap" readonly>${txt.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</textarea>
    <button class="btn btn-primary btn-block mt" onclick="copyReport()">📋 კოპირება</button>
    <a class="btn btn-sky btn-block mt" href="https://wa.me/?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener" style="text-decoration:none">📲 WhatsApp-ით გაგზავნა</a>
    <button class="btn btn-ghost btn-block mt" onclick="document.getElementById('repmodal').remove()">დახურვა</button>
  </div>`;
  el.onclick=e=>{if(e.target===el)el.remove();};
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
  const ta=$('#reptxt'); if(ta){ ta.focus(); ta.select(); }
}
function copyReport(){
  const ta=$('#reptxt'); if(!ta)return;
  ta.focus(); ta.select(); try{ta.setSelectionRange(0,99999);}catch(e){}
  let ok=false; try{ ok=document.execCommand('copy'); }catch(e){}
  if(!ok && navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(ta.value).then(()=>toast('✓ კოპირებულია')).catch(()=>toast('მონიშნე და დააკოპირე ხელით')); return; }
  toast(ok?'✓ კოპირებულია':'მონიშნე და დააკოპირე ხელით');
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
// language toggle: the parent dashboard builds some prose bilingually at render time
// (joined Georgian terms can't be DOM-translated in place), so rebuild it in the new language.
window.addEventListener('niko-lang-change',()=>{ try{ if(document.querySelector('#app .screen.parent')) parentDash(); }catch(e){} });
if('serviceWorker'in navigator){/* PWA: registered in production build */}
