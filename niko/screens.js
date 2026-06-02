/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — screens: home, auth, onboarding, profile, menu
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════ SCREENS ═══════════════ */
const APP_VERSION='1.4';
function goHome(){
  profile=null;state=load();
  if(!state.onboarded){state.onboarded=true;save();} // landing already explains the app — skip the duplicate welcome
  const kids=state.kids||[];
  const isNew=kids.length===0;
  const cards=kids.map(k=>{
    const p=k.id,s=state[p],lv=levelOf(p),init=(k.name||'?')[0];
    const meta=s.shields>0?`<div class="pmeta"><span>${I.shield}</span> ${s.shields} · ${lv.ic} ${lv.name}</div>`
      :`<div class="pmeta">დაიწყე →</div>`;
    return `<div class="pcard" onclick="selectProfile('${p}')">
      <button class="pcard-del" onclick="event.stopPropagation();deleteKid('${p}')" aria-label="${k.name}-ს წაშლა">🗑️</button>
      <div class="avatar a-${k.color||'sky'}">${init}</div>
      <div class="pname">${k.name}</div>
      <div class="page">${k.age} წლის</div>
      ${meta}
    </div>`;
  }).join('');
  const addCard=`<div class="pcard add" onclick="addChild()">
      <div class="avatar add-av">＋</div>
      <div class="pname"${isNew?'':' style="color:var(--muted)"'}>${isNew?'შექმენი ბავშვის პროფილი':'დაამატე ბავშვი'}</div>
    </div>`;
  render(`<div class="screen home">
    <div class="brand brand-btn" onclick="landing()" title="landing გვერდი">
      <div class="sun-badge">${I.sun}</div>
      <div class="mark">NikoLearn</div>
      <div class="tag">${isNew?'მოგესალმები 👋 — შექმენი ბავშვის პროფილი დასაწყებად':'ვინ თამაშობს?'}</div>
    </div>
    <div class="profile-grid">
      ${cards}
      ${addCard}
      <div class="pcard parent" style="grid-column:span 2" onclick="openGate()">
        <div class="avatar a-purple">${I.lock}</div>
        <div><div class="pname">მშობლის სივრცე</div>
        <div class="lockwrap">${I.lock} დაცულია</div></div>
      </div>
    </div>
    <div class="trustline">${I.privacy} მონაცემები ამ მოწყობილობაზე რჩება</div>
    <div style="margin-top:14px;font-size:.78rem;color:var(--muted);text-align:center">NikoLearn v${APP_VERSION} · <a href="https://wa.me/995593255385?text=NikoLearn%20feedback" target="_blank" rel="noopener" style="color:var(--primary-d);font-weight:600;text-decoration:none">დაგვიკავშირდი 💬</a> · <a href="mailto:gela.shonia@bivision.ge?subject=NikoLearn%20feedback" style="color:var(--muted);text-decoration:none">✉️</a></div>
  </div>`,false);
}

/* ── landing page (real marketing landing: what + why; desktop + mobile) ── */
function enterApp(){ if(state&&state.authed) return goHome(); showLogin(); }
function landing(){
  // owner's standalone landing (Downloads v4) is deployed as landing.html
  try{sessionStorage.removeItem('niko_enter');}catch(e){}
  location.href='landing.html'; return;
  render(`<div class="screen landing">
    <div class="lp-hero">
      <div class="sun-badge lp-badge">${I.sun}</div>
      <div class="lp-title">NikoLearn</div>
      <div class="lp-headline">ისწავლე თამაშით</div>
      <div class="lp-sub">თბილი სასწავლო სივრცე შენი ბავშვისთვის. ინგლისური, მათემატიკა და ანბანი — ხმით, სურათით და პატარა ბუს დახმარებით.</div>
      <button class="btn btn-primary lp-cta" onclick="enterApp()">დაიწყე უფასოდ →</button>
      <div class="lp-note">${I.privacy} მონაცემები მხოლოდ ამ მოწყობილობაზე რჩება</div>
    </div>
    <div class="lp-section">
      <div class="lp-h2">რას ისწავლის ბავშვი</div>
      <div class="lp-grid">
        <div class="lp-card"><div class="lp-ic">🔤</div><div class="lp-ct">ინგლისური</div><div class="lp-cs">სიტყვები, ფრაზები, მართლწერა — 5 რეჟიმი</div></div>
        <div class="lp-card"><div class="lp-ic">🧮</div><div class="lp-ct">მათემატიკა</div><div class="lp-cs">შეკრება, გამოკლება, გამრავლება — დონეებით</div></div>
        <div class="lp-card"><div class="lp-ic">🇬🇪</div><div class="lp-ct">ანბანი</div><div class="lp-cs">ქართული და English — სწავლა და ქვიზი</div></div>
        <div class="lp-card"><div class="lp-ic">👑</div><div class="lp-ct">Kings</div><div class="lp-cs">Cambridge YLE გამოცდისთვის მზადება</div></div>
      </div>
    </div>
    <div class="lp-section">
      <div class="lp-h2">რატომ NikoLearn</div>
      <div class="lp-grid">
        <div class="lp-card"><div class="lp-ic">🔒</div><div class="lp-ct">სრული privacy</div><div class="lp-cs">ყველა მონაცემი ტელეფონზე რჩება. ღრუბელი არ არის.</div></div>
        <div class="lp-card"><div class="lp-ic">🚫</div><div class="lp-ct">ნული რეკლამა</div><div class="lp-cs">გარე ბმული არ არის. მშობლის დაცული სივრცე.</div></div>
        <div class="lp-card"><div class="lp-ic">🦉</div><div class="lp-ct">ბუ დაეხმარება</div><div class="lp-cs">მინიშნება და წახალისება ყოველ ნაბიჯზე.</div></div>
        <div class="lp-card"><div class="lp-ic">🔊</div><div class="lp-ct">ქართული ხმა</div><div class="lp-cs">პატარებისთვის, ვინც ჯერ ვერ კითხულობს.</div></div>
      </div>
    </div>
    <button class="btn btn-primary lp-cta wide" onclick="enterApp()">დავიწყოთ 🌟</button>
    <div class="trustline">${I.privacy} მონაცემები ამ მოწყობილობაზე რჩება</div>
  </div>`,false);
  document.body.classList.add('on-landing');
}

/* ── auth gate (simple shared password) ── */
function boot(){
  try{ if(new URLSearchParams(location.search).get('admin')==='1') return adminGate(); }catch(e){}
  var enter=false;
  try{ enter=(new URLSearchParams(location.search).get('app')==='1')||sessionStorage.getItem('niko_enter')==='1'; }catch(e){}
  if(!state.authed){
    if(enter){ try{sessionStorage.setItem('niko_enter','1');}catch(e){} state.authed=true; save(); return goHome(); }
    location.href='landing.html'; return;   // first stop = owner's landing page
  }
  goHome();
}
function showLogin(){
  render(`<div class="screen home" style="gap:18px;justify-content:center">
    <button class="iconbtn" style="position:absolute;top:16px;left:16px;z-index:5" onclick="landing()" aria-label="უკან landing გვერდზე">←</button>
    <div class="brand">
      <div class="sun-badge" style="width:74px;height:74px">${I.sun}</div>
      <div class="mark">NikoLearn</div>
      <div class="tag">შესვლა</div>
    </div>
    <div class="login-card">
      <label class="login-lbl">მომხმარებელი</label>
      <input class="login-in" id="lg-user" value="nikolozi" autocomplete="username">
      <label class="login-lbl">პაროლი</label>
      <input class="login-in num" id="lg-pass" type="password" inputmode="numeric" placeholder="•••••" autocomplete="current-password">
      <div class="login-err" id="lg-err"></div>
      <button class="btn btn-primary btn-block" onclick="doLogin()">შესვლა →</button>
    </div>
    <div class="trustline">${I.privacy} მონაცემები ამ მოწყობილობაზე რჩება</div>
  </div>`,false);
  const pw=$('#lg-pass'); if(pw){ pw.focus(); pw.onkeydown=e=>{if(e.key==='Enter')doLogin();}; }
}
function doLogin(){
  const pw=($('#lg-pass')||{}).value||'';
  if(pw.trim()==='12345'){ state.authed=true; save(); goHome(); return; }
  const e=$('#lg-err'); if(e)e.textContent='პაროლი არასწორია';
  const inp=$('#lg-pass'); if(inp){ inp.classList.add('shake'); inp.value=''; inp.focus(); setTimeout(()=>inp.classList.remove('shake'),420); }
}
function logout(){ state.authed=false; save(); showLogin(); }

/* ── admin (owner only): version + insights. URL: ?admin=1 ── */
function adminGate(){
  const code=prompt('ადმინ კოდი:');
  if(code!=='niko-admin'){ location.href='index.html?app=1'; return; }
  adminView();
}
function adminView(){
  state=load();
  const kids=state.kids||[];
  const sessions=kids.reduce((a,k)=>a+(((state[k.id]||{}).sessions)||0),0);
  render(`<div class="screen home" style="gap:16px;justify-content:flex-start">
    <div class="brand" style="margin-top:8px">
      <div class="sun-badge" style="width:64px;height:64px">${I.sun}</div>
      <div class="mark">NikoLearn · Admin</div>
      <div class="tag">ვერსია v${APP_VERSION}</div>
    </div>
    <div class="perm-points" style="max-width:360px;margin:0 auto;text-align:left">
      <div class="perm-point">${I.check} ვერსია: <b>v${APP_VERSION}</b> (deploy-ის შესამოწმებლად)</div>
      <div class="perm-point">${I.check} პროფილები ამ მოწყობილობაზე: <b>${kids.length}</b></div>
      <div class="perm-point">${I.check} სესიები ამ მოწყობილობაზე: <b>${sessions}</b></div>
      <div class="perm-point">⚠️ <b>ყველა მომხმარებლის</b> რეგისტრაცია/ინსაიტი (ყველა მოწყობილობა) მხოლოდ GA4-ში ჩანს — საჭიროა GA4 Measurement ID (მონაცემები მოწყობილობაზე რჩება, ამიტომ ცენტრალური დათვლა ანალიტიკას სჭირდება).</div>
    </div>
    <button class="btn btn-primary btn-block" style="max-width:360px" onclick="location.href='index.html?app=1'">← აპში დაბრუნება</button>
  </div>`,false);
}

/* ── onboarding ── */
function welcome(){
  render(`<div class="screen home" style="gap:22px">
    <div class="brand">
      <div class="sun-badge" style="width:74px;height:74px">${I.sun}</div>
      <div class="mark">NikoLearn</div>
      <div class="tag">თბილი სასწავლო სივრცე შენი ბავშვისთვის</div>
    </div>
    <div class="perm-points" style="max-width:330px;margin:0 auto">
      <div class="perm-point">${I.check} ინგლისური · მათემატიკა · Kings (Cambridge YLE) გამოცდისთვის</div>
      <div class="perm-point">${I.privacy} <b>მონაცემები ამ მოწყობილობაზე რჩება</b> — ღრუბელი არ არის</div>
      <div class="perm-point">${I.check} <b>ნული</b> რეკლამა · ნული გარე ბმული · მშობლის დაცული სივრცე</div>
    </div>
    <div class="actions" style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:330px;margin:0 auto">
      <button class="btn btn-primary btn-block" onclick="finishOnboard()">დავიწყოთ 🌟</button>
    </div>
  </div>`,false);
}
function finishOnboard(){state.onboarded=true;save();goHome();}

let draft={name:'',age:6,color:'green'};
function addChild(){
  draft={name:'',age:6,color:AV_COLORS[(state.kids.length)%AV_COLORS.length],langs:['ka'],by:null};
  renderInitiator();
}
function renderInitiator(){
  render(`<div class="screen" style="justify-content:flex-start">
    ${topbarPlain('ახალი პროფილი','goHome()')}
    <div class="init-intro">ვინ ქმნის პროფილს?</div>
    <div class="init-grid">
      <button class="init-card" onclick="draft.by='parent';renderAddChild()">
        <div class="init-emoji">👨‍👩‍👧</div><div class="init-t">მე მშობელი ვარ</div>
        <div class="init-s">ვქმნი ჩემი შვილის პროფილს</div></button>
      <button class="init-card" onclick="draft.by='child';renderConsent()">
        <div class="init-emoji">🧒</div><div class="init-t">მე ბავშვი ვარ</div>
        <div class="init-s">საჭიროა მშობლის თანხმობა</div></button>
    </div>
  </div>`,false);
}
function renderConsent(){
  render(`<div class="screen" style="justify-content:flex-start">
    ${topbarPlain('მშობლის თანხმობა','renderInitiator()')}
    <div class="consent-box">
      <div class="consent-ico">${I.privacy}</div>
      <div class="consent-h">მშობელო, საჭიროა შენი თანხმობა</div>
      <div class="perm-points">
        <div class="perm-point">${I.check} პროფილი იქმნება ბავშვისთვის</div>
        <div class="perm-point">${I.privacy} ყველა მონაცემი <b>ამ მოწყობილობაზე</b> ინახება</div>
        <div class="perm-point">${I.check} რეკლამა — ნული · გარე ბმული — ნული</div>
      </div>
      <button class="btn btn-primary btn-block" onclick="renderAddChild()">მე, მშობელი, ვეთანხმები ✓</button>
      <button class="btn btn-ghost btn-block mt" onclick="renderInitiator()">უკან</button>
    </div>
  </div>`,false);
}
function toggleLang(c){ if(c==='ka')return; const i=draft.langs.indexOf(c); if(i>=0)draft.langs.splice(i,1); else draft.langs.push(c); renderAddChild(); }
function renderAddChild(){
  const init=draft.name?draft.name[0]:'?';
  render(`<div class="screen" style="justify-content:flex-start">
    ${topbarPlain('ახალი ბავშვი','goHome()')}
    <div class="center" style="margin:14px 0 18px">
      <div class="avatar a-${draft.color}" style="width:84px;height:84px;border-radius:26px;font-size:2.2rem;margin:0 auto">${init}</div>
    </div>
    <div class="section-label">სახელი</div>
    <input class="spell-input" id="kid-name" style="text-align:left;letter-spacing:0;font-family:'Noto Sans Georgian'" placeholder="მაგ. ლუკა" value="${draft.name}" oninput="draft.name=this.value;document.querySelector('.avatar.a-${draft.color}').textContent=this.value?this.value[0]:'?'">
    <div class="section-label mt">ასაკი — <b class="num">${draft.age}</b> წლის</div>
    <div class="age-row" id="age-row">${[3,4,5,6,7,8,9,10,11,12].map(a=>`<button class="age-chip num ${draft.age===a?'on':''}" onclick="draft.age=${a};renderAddChild()">${a}</button>`).join('')}</div>
    <div class="lvl-hint" style="margin:6px 2px">${draft.age<=5?'🧸 პატარებისთვის: ტექსტის გარეშე, ხატულა + ხმა':'🎒 დაიწყებს ინგლისურს, მათემატიკას და Kings-ს'}</div>
    <div class="section-label mt">რა ენებზე საუბრობს ბავშვი?</div>
    <div class="lang-row">${[['ka','ქართული'],['en','English'],['ru','Русский']].map(([c,n])=>`<button class="lang-chip ${draft.langs.includes(c)?'on':''} ${c==='ka'?'lock':''}" onclick="toggleLang('${c}')">${n}</button>`).join('')}</div>
    <div class="lvl-hint" style="margin:6px 2px">🔊 გახმოვანება და ახსნა ამ ენებზე. ინგლისურს მაინც ისწავლის თამაშით.</div>
    <div class="section-label mt">ფერი</div>
    <div class="color-row">${AV_COLORS.map(c=>`<button class="color-dot a-${c} ${draft.color===c?'on':''}" onclick="draft.color='${c}';renderAddChild()"></button>`).join('')}</div>
    <div class="section-label mt">მშობლის ტელეფონი (არასავალდებულო)</div>
    <input class="spell-input" id="kid-phone" type="tel" inputmode="tel" style="text-align:left;letter-spacing:0" placeholder="თუ გსურს დაგიკავშირდეთ" value="${draft.phone||''}" oninput="draft.phone=this.value">
    <div class="lvl-hint" style="margin:6px 2px">📞 ნებაყოფლობითი — მხოლოდ თუ შეავსებ, დახმარებისთვის დაგიკავშირდებით.</div>
    <div class="spacer"></div>
    <button class="btn btn-primary btn-block mt" onclick="createChild()">შექმენი პროფილი</button>
  </div>`,false);
  const n=$('#kid-name');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}
}
function createChild(){
  const name=(draft.name||'').trim();
  if(!name){const n=$('#kid-name');if(n){n.style.borderColor='var(--red)';n.focus();}return;}
  const id='k'+Date.now();
  state.kids.push({id,name,age:draft.age,color:draft.color,langs:(draft.langs&&draft.langs.length?draft.langs:['ka'])});
  state[id]=blankKid();save();
  try{gtag('event','sign_up',{method:'profile'});}catch(e){}
  const phone=(draft.phone||'').trim();
  if(phone){ try{submitLead(name,draft.age,phone);}catch(e){} }
  selectProfile(id);
}
// opt-in lead capture -> owner's Google Form/Sheet (only fires if parent entered a phone)
function submitLead(name,age,phone){
  const fd=new FormData();
  fd.append('entry.2005620554', (name||'')+' ('+age+'წ)');
  fd.append('entry.1166974658', phone);
  fetch('https://docs.google.com/forms/d/e/1FAIpQLSfn4uD2xhTeigRBekDpBUzzm7hbAkx1brLkaNLai0wO27daiw/formResponse',{method:'POST',mode:'no-cors',body:fd}).catch(()=>{});
}
function topbarPlain(title,back){
  return `<div class="topbar"><button class="iconbtn" onclick="${back}">←</button><div class="who">${title}</div></div>`;
}

function selectProfile(p){
  profile=p;game.start=Date.now();game.cat=null;game.pcat=null;
  const s=state[p],lv=levelOf(p),isKid=isYoung(p);
  let subjects;
  if(isKid){
    subjects=`<div class="subj-grid">
      <div class="subj kids" onclick="openMenu('counting')"><div class="s-ico">🔢</div><div class="s-name num">1 2 3</div></div>
      <div class="subj kids" onclick="openMenu('ka-alpha')"><div class="s-ico">🇬🇪</div><div class="s-name">ა ბ გ</div></div>
      <div class="subj kids eng" onclick="openMenu('en-alpha')"><div class="s-ico">🇬🇧</div><div class="s-name en">A B C</div></div>
      <div class="subj kids maths" onclick="openMenu('math')"><div class="s-ico">➕➖</div><div class="s-name num">➕</div></div>
    </div>`;
  } else {
    const wc=Object.values(s.words).filter(w=>w.correct>=3).length;
    subjects=`<div class="subj-grid">
      <div class="subj crown" onclick="openMenu('kings-eng')"><span class="s-badge">👑 Exam</span><div class="s-ico">👑</div><div class="s-name">Kings English</div><div class="s-sub">Cambridge YLE</div></div>
      <div class="subj crown maths" onclick="openMenu('kings-math')"><span class="s-badge">👑 Exam</span><div class="s-ico">📐</div><div class="s-name">Kings Math</div><div class="s-sub">ოლიმპიადა</div></div>
      <div class="subj eng" onclick="openMenu('english')"><span class="s-badge">${wc} სიტყვა</span><div class="s-ico">🔤</div><div class="s-name">ინგლისური</div><div class="s-sub">5 რეჟიმი</div></div>
      <div class="subj maths" onclick="openMenu('math')"><div class="s-ico">🧮</div><div class="s-name">მათემატიკა</div><div class="s-sub">graded 1–100</div></div>
    </div>`;
  }
  render(`<div class="screen">
    ${topbar(nameOf(p),lv.name+' · '+lv.ic,'goHome()')}
    ${isKid?'':`<div class="levelcard">
      <div class="lvl-top"><span class="rankpill"><span class="rk">${lv.ic}</span>${lv.name}</span><span class="lvl-num">${lv.learned} სიტყვა</span></div>
      <div class="bar"><i style="width:${lv.pct}%"></i></div>
      <div class="lvl-hint">${lv.need>=999?'მაქსიმალური დონე! 🎉':`შემდეგ დონემდე: ${lv.need-lv.learned} სიტყვა`}</div>
    </div>`}
    ${subjects}
  </div>`,'home');
}

/* ── mode menu ── */
const MODE_TITLES={english:'🔤 ინგლისური',math:'🧮 მათემატიკა','kings-eng':'👑 Kings English','kings-math':'👑 Kings Math',counting:'🔢 დათვლა','ka-alpha':'🇬🇪 ანბანი','en-alpha':'🇬🇧 Alphabet'};
function openMenu(subj){
  game.subj=subj;
  let body;
  if(subj==='english'){
    const cat=game.cat;
    body=`<div class="cat-chip-row">
        <button class="cat-chip ${cat?'on':''}" onclick="openTopics()">📚 ${cat?cat:'ყველა თემა'} ${cat?'<span class="cx">✕</span>':'▾'}</button>
      </div>
      <div class="mode-grid">
      ${mode('quiz','🎯','მოისმინე','ქართ → ინგლ')}
      ${mode('reverse','🔄','Reading','ინგლ → ქართ')}
      ${mode('listen','👂','სურათი','🔊 → emoji')}
      ${mode('match','🧩','დააწყვილე','ka ↔ en')}
      ${mode('spell','✍️','დაწერე','spelling')}
      ${mode('phrases','💬','ფრაზები','everyday')}
    </div>`;
  } else if(subj==='kings-eng'){
    body=`<div class="mode-grid">
      <div class="mode feature" onclick="startKings('eng')"><div class="m-ico">👑</div><div><div class="m-name">Kings ტესტი</div><div class="m-sub">picture · translate · spelling · grammar</div></div></div>
      ${mode('quiz','🎯','Vocabulary','')}
      ${mode('listen','👂','Listening','')}
      ${mode('spell','✍️','Spelling','')}
      ${mode('match','🧩','Match','')}
    </div>`;
  } else if(subj==='kings-math'){
    body=`<div class="mode-grid">
      <div class="mode feature" onclick="startKings('math')"><div class="m-ico">👑</div><div><div class="m-name">Kings ოლიმპიადა</div><div class="m-sub">word problems + ლოგიკა</div></div></div>
      ${mode('math-add','➕','Addition','1–100')}
      ${mode('math-sub','➖','Subtraction','1–100')}
      ${mode('math-mul','✖️','Multiply','×2–×9')}
    </div>`;
  } else if(subj==='math'){
    const kid=isYoung(profile);
    body=`<div class="mode-grid">
      ${mode('math-add','➕',kid?'':'შეკრება',kid?'':mathRangeLabel('math-add'))}
      ${mode('math-sub','➖',kid?'':'გამოკლება',kid?'':mathRangeLabel('math-sub'))}
      ${kid?'':mode('math-mul','✖️','გამრავლება',mathRangeLabel('math-mul'))}
      ${mode('math-pat','🧩',kid?'':'პატერნები','')}
    </div>`;
  } else if(subj==='counting'){
    body=`<div class="mode-grid">
      <div class="mode" style="min-height:130px;grid-column:span 2" onclick="startCount('pick')"><div class="kids-ico">🍎🍎🍎</div><div class="m-name">დათვალე</div><div class="m-sub">რამდენია? აირჩიე რიცხვი</div></div>
    </div>`;
  } else { /* alphabets — Georgian & English */
    body=`<div class="mode-grid">
      <div class="mode" style="min-height:120px" onclick="alphaLearn('${subj}',0)"><div class="kids-ico">📖</div><div class="m-name">სწავლა</div></div>
      <div class="mode" style="min-height:120px" onclick="alphaQuiz('${subj}')"><div class="kids-ico">🎯</div><div class="m-name">ქვიზი</div></div>
    </div>`;
  }
  render(`<div class="screen">
    ${topbar(MODE_TITLES[subj]||subj,null,'selectProfile(profile)')}
    ${body}
  </div>`,'home');
}
function mode(m,ic,name,sub){
  return `<div class="mode" onclick="startGame('${m}')"><div class="m-ico">${ic}</div><div class="m-name">${name||'&nbsp;'}</div>${sub?`<div class="m-sub">${sub}</div>`:''}</div>`;
}

/* ── category pickers ── */
function openTopics(){
  const cats=Object.keys(WORDS);
  const card=(c)=>{const m=c.match(/(.+?)\s*(\p{Emoji})\s*$/u);const name=m?m[1]:c;const ic=m?m[2]:'📚';
    return `<button class="topic-card" onclick="pickTopic('${c.replace(/'/g,"\\'")}')"><div class="topic-ic">${ic}</div><div class="topic-name">${name}</div><div class="topic-n">${WORDS[c].length} სიტყვა</div></button>`;};
  render(`<div class="screen">
    ${topbar('📚 კატეგორიები','აირჩიე თემა',"openMenu('english')")}
    <button class="topic-all ${game.cat?'':'on'}" onclick="pickTopic('')">🌈 ყველა თემა <span class="topic-n">${Object.values(WORDS).reduce((a,v)=>a+v.length,0)} სიტყვა</span></button>
    <div class="topic-grid">${cats.map(card).join('')}</div>
  </div>`,'home');
}
function pickTopic(c){game.cat=c||null;openMenu('english');}
function openPhraseCats(){
  const cats=Object.keys(PHRASES);
  const card=(c)=>{const m=c.match(/(.+?)\s*(\p{Emoji})\s*$/u);const name=m?m[1]:c;const ic=m?m[2]:'💬';
    return `<button class="topic-card" onclick="startPhrases('${c.replace(/'/g,"\\'")}')"><div class="topic-ic">${ic}</div><div class="topic-name">${name}</div><div class="topic-n">${PHRASES[c].length} ფრაზა</div></button>`;};
  render(`<div class="screen">
    ${topbar('💬 ფრაზები','აირჩიე თემა',"openMenu('english')")}
    <button class="topic-all on" onclick="startPhrases('')">🌈 ყველა ფრაზა <span class="topic-n">${Object.values(PHRASES).reduce((a,v)=>a+v.length,0)} ფრაზა</span></button>
    <div class="topic-grid">${cats.map(card).join('')}</div>
  </div>`,'home');
}

