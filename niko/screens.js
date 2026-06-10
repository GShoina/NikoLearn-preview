/* ═══════════════════════════════════════════════════════════
   NIKO LEARN: screens: home, auth, onboarding, profile, menu
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════ SCREENS ═══════════════ */
const APP_VERSION='2.07';
/* GA4 key-metrics proxy (Apps Script web app). Empty until deployed; admin shows live numbers once set. Returns aggregate counts only (no PII). */
const GA4_METRICS_URL='';
function goHome(){
  if(window.Analytics)Analytics.screen('home');
  profile=null;state=load();
  if(!state.onboarded){state.onboarded=true;save();} // landing already explains the app, skip the duplicate welcome
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
    <div class="brand brand-btn" onclick="landing()" title="მთავარი გვერდი">
      <div class="sun-badge">${I.sun}</div>
      <div class="mark">NikoLearn</div>
      <div class="tag">${isNew?'მოგესალმები 👋, შექმენი ბავშვის პროფილი დასაწყებად':'ვინ თამაშობს?'}</div>
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
    <div style="margin-top:14px;font-size:.78rem;color:var(--muted);text-align:center">NikoLearn v${APP_VERSION}</div>
  </div>`,'home');
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
      <div class="lp-sub">თბილი სასწავლო სივრცე შენი ბავშვისთვის. ინგლისური, მათემატიკა და ანბანი, ხმით, სურათით და პატარა ბუს დახმარებით.</div>
      <button class="btn btn-primary lp-cta" onclick="enterApp()">დაიწყე უფასოდ →</button>
      <div class="lp-note">${I.privacy} მონაცემები მხოლოდ ამ მოწყობილობაზე რჩება</div>
    </div>
    <div class="lp-section">
      <div class="lp-h2">რას ისწავლის ბავშვი</div>
      <div class="lp-grid">
        <div class="lp-card"><div class="lp-ic">🔤</div><div class="lp-ct">ინგლისური</div><div class="lp-cs">სიტყვები, ფრაზები, მართლწერა, 5 რეჟიმი</div></div>
        <div class="lp-card"><div class="lp-ic">🧮</div><div class="lp-ct">მათემატიკა</div><div class="lp-cs">შეკრება, გამოკლება, გამრავლება, დონეებით</div></div>
        <div class="lp-card"><div class="lp-ic">🇬🇪</div><div class="lp-ct">ანბანი</div><div class="lp-cs">ქართული და English, სწავლა და ქვიზი</div></div>
        <div class="lp-card"><div class="lp-ic">👑</div><div class="lp-ct">Kings</div><div class="lp-cs">Cambridge YLE გამოცდისთვის მზადება</div></div>
      </div>
    </div>
    <div class="lp-section">
      <div class="lp-h2">რატომ NikoLearn</div>
      <div class="lp-grid">
        <div class="lp-card"><div class="lp-ic">🔒</div><div class="lp-ct">სრული privacy</div><div class="lp-cs">ყველა მონაცემი ტელეფონზე რჩება. ონლაინ სინქრონიზაციის გარეშე.</div></div>
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
    <button class="iconbtn" style="position:absolute;top:16px;left:16px;z-index:5" onclick="landing()" aria-label="უკან მთავარ გვერდზე">←</button>
    <div class="brand">
      <div class="sun-badge" style="width:74px;height:74px">${I.sun}</div>
      <div class="mark">NikoLearn</div>
      <div class="tag">შესვლა</div>
    </div>
    <div class="login-card">
      <label class="login-lbl">მომხმარებელი</label>
      <input class="login-in" id="lg-user" value="" placeholder="მომხმარებელი" autocomplete="username">
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
  // remember the unlock on this device so the owner does not retype the code every load
  var ok=false; try{ok=localStorage.getItem('niko_admin')==='1';}catch(e){}
  if(!ok){
    const code=prompt('ადმინ კოდი:');
    if(code!=='niko-admin'){ location.href='index.html?app=1'; return; }
    try{localStorage.setItem('niko_admin','1');}catch(e){}
  }
  adminView();
}
function adminLogout(){ try{localStorage.removeItem('niko_admin');}catch(e){} location.href='index.html?app=1'; }
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
      <div class="perm-point">${I.check} პროფილები <b>ამ ბრაუზერში</b>: <b>${kids.length}</b></div>
      <div class="perm-point">${I.check} სესიები <b>ამ ბრაუზერში</b>: <b>${sessions}</b></div>
      <div class="perm-point">ℹ️ ეს რიცხვები მხოლოდ <b>ამ მოწყობილობას</b> ეხება. ყველა მოწყობილობის ნამდვილ რიცხვებს ქვემოთ ხედავ.</div>
    </div>
    <div id="ga4box" style="max-width:360px;margin:0 auto;width:100%"></div>
    <button class="btn btn-primary btn-block" style="max-width:360px" onclick="window.open('https://analytics.google.com/analytics/web/#/p539978869/realtime/overview','_blank')">📊 GA4, სრული რეპორტი</button>
    <button class="btn btn-ghost btn-block" style="max-width:360px;margin-top:10px" onclick="location.href='index.html?app=1'">← აპში დაბრუნება</button>
    <button class="btn btn-ghost btn-block" style="max-width:360px;margin-top:8px" onclick="adminLogout()">ადმინიდან გასვლა (კოდის თავიდან შეყვანა)</button>
  </div>`,false);
  loadGA4Metrics();
}
/* fetch aggregate GA4 numbers from the Apps Script proxy and render the live tiles */
function loadGA4Metrics(){
  const box=$('#ga4box'); if(!box) return;
  if(!GA4_METRICS_URL){
    box.innerHTML='<div class="perm-point" style="opacity:.7;font-size:.8rem">📈 ცოცხალი GA4 რიცხვები მალე ჩაირთვება (proxy deploy მიმდინარეობს). მანამდე, „სრული რეპორტი" ღილაკი.</div>';
    return;
  }
  box.innerHTML='<div class="perm-point" style="opacity:.7;font-size:.8rem">⏳ GA4 რიცხვები იტვირთება…</div>';
  fetch(GA4_METRICS_URL,{cache:'no-store'}).then(r=>r.json()).then(d=>{
    if(!d||!d.ok){ box.innerHTML='<div class="perm-point" style="opacity:.7;font-size:.8rem">GA4 ვერ ჩაიტვირთა, სცადე „სრული რეპორტი".</div>'; return; }
    const tile=(n,l)=>`<div style="flex:1;min-width:96px;background:var(--card,#fff);border:1px solid var(--line,#e7dcc8);border-radius:14px;padding:12px 10px;text-align:center"><div style="font-size:1.5rem;font-weight:800;color:var(--primary-d)">${n}</div><div style="font-size:.72rem;opacity:.75;margin-top:2px">${l}</div></div>`;
    box.innerHTML=`<div style="display:flex;gap:8px;flex-wrap:wrap">
      ${tile(d.usersToday,'მომხ. დღეს')}
      ${tile(d.signupsToday,'რეგ. დღეს')}
      ${tile(d.users7,'მომხ. 7 დღე')}
      ${tile(d.signups7,'რეგ. 7 დღე')}
    </div>`;
  }).catch(()=>{ box.innerHTML='<div class="perm-point" style="opacity:.7;font-size:.8rem">GA4 ვერ ჩაიტვირთა, სცადე „სრული რეპორტი".</div>'; });
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
      <div class="perm-point">${I.privacy} <b>მონაცემები ამ მოწყობილობაზე რჩება</b>, ონლაინ სინქრონიზაციის გარეშე</div>
      <div class="perm-point">${I.check} <b>ნული</b> რეკლამა · გარე ბმულების გარეშე · მშობლის დაცული სივრცე</div>
    </div>
    <div class="actions" style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:330px;margin:0 auto">
      <button class="btn btn-primary btn-block" onclick="finishOnboard()">დავიწყოთ 🌟</button>
    </div>
  </div>`,false);
}
function finishOnboard(){state.onboarded=true;save();goHome();}

let draft={name:'',age:6,color:'green'};
function addChild(){
  draft={name:'',age:6,color:AV_COLORS[(state.kids.length)%AV_COLORS.length],langs:['ka'],tutor:'🦉',by:null};
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
        <div class="perm-point">${I.check} რეკლამა: ნული · გარე ბმულების გარეშე</div>
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
    <div class="section-label mt">ასაკი: <b class="num">${draft.age}</b> წლის</div>
    <div class="age-row" id="age-row">${[3,4,5,6,7,8,9,10,11,12].map(a=>`<button class="age-chip num ${draft.age===a?'on':''}" onclick="draft.age=${a};renderAddChild()">${a}</button>`).join('')}</div>
    <div class="lvl-hint" style="margin:6px 2px">${draft.age<=5?'🧸 პატარებისთვის: ტექსტის გარეშე, ხატულა + ხმა':'🎒 დაიწყებს ინგლისურს, მათემატიკას და Kings-ს'}</div>
    <div class="section-label mt">რა ენებზე საუბრობს ბავშვი?</div>
    <div class="lang-row">${[['ka','ქართული'],['en','English'],['ru','Русский']].map(([c,n])=>`<button class="lang-chip ${draft.langs.includes(c)?'on':''} ${c==='ka'?'lock':''}" onclick="toggleLang('${c}')">${n}</button>`).join('')}</div>
    <div class="lvl-hint" style="margin:6px 2px">🔊 გახმოვანება და ახსნა ამ ენებზე. ინგლისურს მაინც ისწავლის თამაშით.</div>
    <div class="section-label mt">ფერი</div>
    <div class="color-row">${AV_COLORS.map(c=>`<button class="color-dot a-${c} ${draft.color===c?'on':''}" onclick="draft.color='${c}';renderAddChild()"></button>`).join('')}</div>
    <div class="section-label mt">მასწავლებელი 🐾</div>
    <div class="tutor-grid">${TUTOR_ANIMALS.map(a=>`<button class="tutor-pick ${(draft.tutor||'🦉')===a?'on':''}" onclick="draft.tutor='${a}';renderAddChild()">${a}</button>`).join('')}</div>
    <div class="lvl-hint" style="margin:6px 2px">ბავშვი აირჩევს, რომელი ცხოველი ასწავლის. შემდეგ შეცვლაც შეიძლება.</div>
    <div class="spacer"></div>
    <button class="btn btn-primary btn-block mt" onclick="createChild()">შექმენი პროფილი</button>
  </div>`,false);
  const n=$('#kid-name');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}
}
function createChild(){
  const name=(draft.name||'').trim().replace(/[<>&"']/g,'');   // strip HTML-special chars (XSS: name flows into innerHTML)
  if(!name){const n=$('#kid-name');if(n){n.style.borderColor='var(--red)';n.focus();}return;}
  const id='k'+Date.now();
  state.kids.push({id,name,age:draft.age,color:draft.color,langs:(draft.langs&&draft.langs.length?draft.langs:['ka']),tutor:draft.tutor||'🦉'});
  state[id]=blankKid();save();
  // first-party, aggregate, no-PII: "new registration" with only a coarse age band (never name/age).
  if(window.Analytics)Analytics.event('profile_created',{age_band:draft.age<=5?'3-5':draft.age<=8?'6-8':'9-12'});
  selectProfile(id);
}
function topbarPlain(title,back){
  return `<div class="topbar"><button class="iconbtn" onclick="${back}">←</button><div class="who">${title}</div></div>`;
}

// gentle daily screen-time limit reached → friendly "see you tomorrow" (parent can adjust the limit)
function screenLimitUp(p){
  render(`<div class="screen" style="justify-content:center;text-align:center;gap:14px;padding:24px">
    <div style="font-size:4.2rem">🌙</div>
    <h2>რა კარგად ვითამაშეთ!</h2>
    <p style="color:var(--muted);max-width:300px;line-height:1.5">დღევანდელი სათამაშო დრო დასრულდა. ხვალ ნიკო ისევ დაგელოდება. 🦉</p>
    <button class="btn btn-ghost btn-block" style="max-width:300px" onclick="goHome()">${I.home} მთავარი</button>
    <button class="btn btn-ghost btn-block" style="max-width:300px" onclick="openGate()">${I.lock} მშობლის სივრცე</button>
  </div>`,false);
}
function selectProfile(p){
  profile=p;game.start=Date.now();game.cat=null;game.pcat=null;
  if(typeof touchDay==='function')touchDay(p);
  if(typeof overLimit==='function'&&overLimit(p))return screenLimitUp(p);
  const s=state[p],lv=levelOf(p),isKid=isYoung(p);
  // persistent total progress (always measured, even with free-roam) — owner ask, v2.03
  const tp=(typeof totalProgress==='function')?totalProgress(p):{pct:0,total:0};
  const totalBar=tp.total?`<div class="pathcard tp-meter"><div class="path-top"><b>📊 ჯამური პროგრესი</b><span class="path-pct">${tp.pct}%</span></div><div class="bar"><i style="width:${tp.pct}%"></i></div></div>`:'';
  let subjects;
  if(isKid){
    const tiny=isTiny(profile);
    subjects=`<div class="subj-grid">
      <div class="subj kids stack" data-sum="ციფრები 1-9 და დათვლა ხატულებით" onclick="openSubj(event,'counting')"><div class="s-ico">🔢</div><div class="s-name num">1 2 3</div></div>
      <div class="subj kids stack" data-sum="ქართული ასოები ხმითა და სურათით" onclick="openSubj(event,'ka-alpha')"><div class="s-ico">🇬🇪</div><div class="s-name">ა ბ გ</div></div>
      <div class="subj kids eng stack" data-sum="English ABC ხმითა და სურათით" onclick="openSubj(event,'en-alpha')"><div class="s-ico">🇬🇧</div><div class="s-name en">A B C</div></div>
      ${tiny
        ? `<div class="subj kids play" data-sum="ფიგურების ცნობა" onclick="startGame('shapes')">${PLAY_BADGE}<div class="s-ico">🔷</div><div class="s-name">ფიგურები</div></div>`
        : `<div class="subj kids maths stack" data-sum="შეკრება და გამოკლება" onclick="openSubj(event,'math')"><div class="s-ico">➕➖</div><div class="s-name num">➕</div></div>`}
      <div class="subj kids move play" data-sum="მოკლე მოძრაობის შესვენება" onclick="showBreak(true)">${PLAY_BADGE}<div class="s-ico">🤸</div><div class="s-name">მოძრაობა</div></div>
    </div>`;
  } else {
    const wc=Object.values(s.words).filter(w=>w.correct>=3).length;
    subjects=`<div class="subj-grid">
      <div class="subj crown stack" data-sum="Cambridge YLE ტესტი: სურათი, თარგმანი, მართლწერა, გრამატიკა" onclick="openSubj(event,'kings-eng')"><span class="s-badge">${premiumOn()?'👑 გამოცდა':'🔒 Premium'}</span><div class="s-ico">👑</div><div class="s-name">კინგსი ინგლისური</div><div class="s-sub">Cambridge YLE</div></div>
      <div class="subj crown maths stack" data-sum="ოლიმპიადა: ამოცანები და ლოგიკა" onclick="openSubj(event,'kings-math')"><span class="s-badge">${premiumOn()?'👑 გამოცდა':'🔒 Premium'}</span><div class="s-ico">📐</div><div class="s-name">კინგსი მათემატიკა</div><div class="s-sub">ოლიმპიადა</div></div>
      <div class="subj eng stack" data-sum="5 რეჟიმი · 13 თემა · 180+ სიტყვა · ფრაზები" onclick="openSubj(event,'english')"><span class="s-badge">${wc} სიტყვა</span><div class="s-ico">🔤</div><div class="s-name">ინგლისური</div><div class="s-sub">5 რეჟიმი</div></div>
      <div class="subj maths stack" data-sum="შეკრება, გამოკლება, გამრავლება, ფიგურები, ფული, საათი" onclick="openSubj(event,'math')"><div class="s-ico">🧮</div><div class="s-name">მათემატიკა</div><div class="s-sub">დონეებით 1–100</div></div>
      <div class="subj stack" data-sum="ანბანი · კითხვა · წერა · ამოწერა" onclick="openSubj(event,'ka-alpha')"><div class="s-ico">🇬🇪</div><div class="s-name">ქართული</div><div class="s-sub">კითხვა · წერა · ამოწერა</div></div>
      <div class="subj move play" data-sum="მოკლე მოძრაობის შესვენება ვარჯიშებით" onclick="showBreak(true)">${PLAY_BADGE}<div class="s-ico">🤸</div><div class="s-name">მოძრაობა</div><div class="s-sub">პატარა შესვენება</div></div>
    </div>`;
  }
  render(`<div class="screen">
    ${topbar(nameOf(p),lv.name+' · '+lv.ic,'goHome()')}
    ${isKid?'':`<div class="levelcard">
      <div class="lvl-top"><span class="rankpill"><span class="rk">${lv.ic}</span>${lv.name}</span><span class="lvl-num">${lv.learned} სიტყვა</span></div>
      <div class="bar"><i style="width:${lv.pct}%"></i></div>
      <div class="lvl-hint">${lv.need>=999?'მაქსიმალური დონე! 🎉':`შემდეგ დონემდე: ${lv.need-lv.learned} სიტყვა`}</div>
    </div>`}
    ${totalBar}
    ${subjects}
  </div>`,'home');
}

/* ── mode menu ── */
const MODE_TITLES={english:'🔤 ინგლისური',math:'🧮 მათემატიკა','kings-eng':'👑 კინგსი ინგლისური','kings-math':'👑 კინგსი მათემატიკა',counting:'🔢 დათვლა','ka-alpha':'🇬🇪 ანბანი','en-alpha':'🇬🇧 ანბანი'};

/* ── card-depth language (v1.98): a "stack" card opens MORE cards, a "play" card starts a game.
   On a stack tap: voice the destination + "აირჩიე" (recorded ka clips only) and unfold-animate.
   Voicing fires ONLY on the tap (not in openMenu), so back-navigation stays quiet. ── */
const NAV_SPOKEN={counting:'დათვლა','ka-alpha':'ქართული ანბანი','en-alpha':'ინგლისური ანბანი',math:'მათემატიკა',english:'ინგლისური','kings-eng':'კინგსი ინგლისური','kings-math':'კინგსი მათემატიკა'};
function unfoldThen(ev,go){
  const el=ev&&ev.currentTarget;
  let rm=false; try{rm=matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){}
  if(el&&!rm){ el.classList.add('unfolding'); setTimeout(go,200); } else go();
}
function openSubj(ev,subj){
  if(typeof isPremiumSubj==='function' && isPremiumSubj(subj) && !premiumOn()){ return unfoldThen(ev,()=>upsellPremium(subj)); }
  if(window.playClipSeq)playClipSeq([NAV_SPOKEN[subj],'აირჩიე'].filter(Boolean));
  unfoldThen(ev,()=>openMenu(subj));
}
// D2 (v2.05): premium content stays VISIBLE; tapping it (when premium is off) shows an upsell, never a dead end.
function upsellPremium(subj){
  const name=MODE_TITLES[subj]||subj;
  render(`<div class="screen" style="justify-content:center;text-align:center;gap:14px;padding:24px">
    <div style="font-size:3.6rem">👑</div>
    <h2>${name} — Premium</h2>
    <p style="color:var(--muted);max-width:300px;line-height:1.5">ეს გაღრმავებული, საგამოცდო ნაწილია. უფასო ვერსიაში ხელმისაწვდომია მთელი საბაზისო სწავლა, Premium კი ხსნის გამოცდისთვის მზადებას და დამატებით სიღრმეს.</p>
    <div class="perm-points" style="max-width:320px;margin:0 auto;text-align:left">
      <div class="perm-point">${I.check} Cambridge YLE / ოლიმპიადის ტესტები</div>
      <div class="perm-point">${I.check} 8-12 წლის გაღრმავებული დონე</div>
      <div class="perm-point">${I.check} მშობლის მიზნები და დეტალური ანალიტიკა</div>
    </div>
    <button class="btn btn-primary btn-block" style="max-width:300px" onclick="openGate()">${I.lock} მშობლის სივრცე →</button>
    <button class="btn btn-ghost btn-block" style="max-width:300px" onclick="selectProfile(profile)">უკან</button>
  </div>`,false);
}
function openPhrases(ev){
  if(window.playClipSeq)playClipSeq(['ფრაზები','აირჩიე']);
  unfoldThen(ev,openPhraseCats);
}
const PLAY_BADGE='<span class="play-badge" aria-hidden="true">▶</span>';
function openMenu(subj){
  game.subj=subj;
  if(window.Analytics)Analytics.screen('subject/'+subj);
  // per-subject diagnostic offer (first time) OR the visible Path (გზა) for the path subjects
  let pathHead='';
  if(typeof PATH_SUBJS!=='undefined' && PATH_SUBJS.indexOf(subj)>=0){
    if(typeof subjDiagNeeded==='function' && subjDiagNeeded(profile,subj)){
      const nq=(SUBJ_DIAG[subj]||[]).length;
      pathHead=`<div class="pathcard diag-offer"><div class="path-top"><b>🧭 ვნახოთ რა იცი ${pathLocName(subj)}</b></div>
        <div class="path-hint">სულ რაღაც ${nq} კითხვა, რომ გითხრა საიდან დაიწყო.</div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary" style="flex:1" onclick="startSubjDiag('${profile}','${subj}')">დავიწყოთ →</button>
          <button class="btn btn-ghost" onclick="skipSubjDiag('${profile}','${subj}')">გამოტოვება</button>
        </div></div>`;
    } else {
      pathHead=renderPathStrip(subj);
    }
  }
  let body;
  if(subj==='english'){
    const cat=game.cat;
    body=`<div class="cat-chip-row">
        <button class="cat-chip ${cat?'on':''}" onclick="openTopics()">📚 ${cat?cat:'ყველა თემა'} ${cat?'<span class="cx">✕</span>':'▾'}</button>
      </div>
      <div class="mode-grid">
      ${mode('quiz','🎯','მოისმინე','ქართ → ინგლ')}
      ${mode('reverse','🔄','კითხვა','ინგლ → ქართ')}
      ${mode('listen','👂','სურათი','🔊 → ხატულა')}
      ${mode('match','🧩','დააწყვილე','ქართ ↔ ინგლ')}
      ${mode('spell','✍️','დაწერე','მართლწერა')}
      <div class="mode stack" onclick="openPhrases(event)"><div class="m-ico">💬</div><div class="m-name">ფრაზები</div><div class="m-sub">ყოველდღიური</div></div>
    </div>`;
  } else if(subj==='kings-eng'){
    body=`<div class="mode-grid">
      <div class="mode feature play" onclick="startKings('eng')">${PLAY_BADGE}<div class="m-ico">👑</div><div><div class="m-name">კინგსის ტესტი</div><div class="m-sub">სურათი · თარგმანი · მართლწერა · გრამატიკა</div></div></div>
      ${mode('quiz','🎯','ლექსიკა','')}
      ${mode('listen','👂','მოსმენა','')}
      ${mode('spell','✍️','მართლწერა','')}
      ${mode('match','🧩','დააწყვილე','')}
    </div>`;
  } else if(subj==='kings-math'){
    body=`<div class="mode-grid">
      <div class="mode feature play" onclick="startKings('math')">${PLAY_BADGE}<div class="m-ico">👑</div><div><div class="m-name">კინგსის ოლიმპიადა</div><div class="m-sub">ამოცანები + ლოგიკა</div></div></div>
      ${mode('math-add','➕','შეკრება','1–100')}
      ${mode('math-sub','➖','გამოკლება','1–100')}
      ${mode('math-mul','✖️','გამრავლება','×2–×9')}
    </div>`;
  } else if(subj==='math'){
    const kid=isYoung(profile);
    const tiny=isTiny(profile);
    body=`<div class="mode-grid">
      ${tiny?'':mode('math-add','➕',kid?'':'შეკრება',kid?'':mathRangeLabel('math-add'))}
      ${tiny?'':mode('math-sub','➖',kid?'':'გამოკლება',kid?'':mathRangeLabel('math-sub'))}
      ${kid?'':mode('math-mul','✖️','გამრავლება',mathRangeLabel('math-mul'))}
      ${tiny?'':mode('math-pat','🧩',kid?'':'პატერნები','')}
      ${kid?'':mode('compare','⚖️','შედარება','&gt; &lt; =')}
      ${kid?'':mode('skip','🔢','დათვლა','ხუთობით · ათობით')}
      ${mode('shapes','🔷','ფიგურები','')}
      ${kid?'':mode('money','💰','ფული','₾ · თეთრი')}
      ${kid?'':mode('clock','🕐','საათი','დრო')}
    </div>`;
  } else if(subj==='counting'){
    // F2: digits come BEFORE counting, learn the numeral 1-9, quiz, THEN count.
    body=`<div class="mode-grid">
      <div class="mode play" style="min-height:120px" onclick="digitLearn(0)">${PLAY_BADGE}<div class="kids-ico">🔢</div><div class="m-name">ისწავლე ციფრები</div><div class="m-sub">1 – 9</div></div>
      <div class="mode play" style="min-height:120px" onclick="startDigitQuiz()">${PLAY_BADGE}<div class="kids-ico">🎯</div><div class="m-name">ციფრების ტესტი</div></div>
      <div class="mode play" style="min-height:130px;grid-column:span 2" onclick="startCount('pick')">${PLAY_BADGE}<div class="kids-ico">🍎🍎🍎</div><div class="m-name">დათვალე</div><div class="m-sub">რამდენია? აირჩიე რიცხვი</div></div>
    </div>`;
  } else { /* alphabets, Georgian & English */
    // Georgian also gets READING (syllable→word), the #1 gap + Georgian-first differentiator.
    const reading = subj==='ka-alpha' ? `<div class="mode play" style="min-height:120px" onclick="readLearn(0)">${PLAY_BADGE}<div class="kids-ico">📖</div><div class="m-name">კითხვა</div><div class="m-sub">მარცვალი → სიტყვა</div></div>` : '';
    const sentence = subj==='ka-alpha' ? `<div class="mode play" style="min-height:120px" onclick="sentLearn(0)">${PLAY_BADGE}<div class="kids-ico">📝</div><div class="m-name">წინადადება</div><div class="m-sub">წაიკითხე და გაიგე</div></div>` : '';
    const build = subj==='ka-alpha' ? `<div class="mode play" style="min-height:120px" onclick="startBuild()">${PLAY_BADGE}<div class="kids-ico">🧩</div><div class="m-name">ააწყვე</div><div class="m-sub">მარცვლებით სიტყვა</div></div>` : '';
    const trace = subj==='ka-alpha' ? `<div class="mode play" style="min-height:120px" onclick="traceLearn(0)">${PLAY_BADGE}<div class="kids-ico">✍️</div><div class="m-name">ამოწერა</div><div class="m-sub">ასოს წერა თითით</div></div>` : '';
    body=`<div class="mode-grid">
      <div class="mode play" style="min-height:120px" onclick="alphaLearn('${subj}',0)">${PLAY_BADGE}<div class="kids-ico">🔡</div><div class="m-name">ისწავლე ასოები</div></div>
      <div class="mode play" style="min-height:120px" onclick="alphaQuiz('${subj}')">${PLAY_BADGE}<div class="kids-ico">🎯</div><div class="m-name">ტესტები</div></div>
      ${reading}
      ${sentence}
      ${build}
      ${trace}
    </div>`;
  }
  render(`<div class="screen">
    ${topbar(MODE_TITLES[subj]||subj,null,'selectProfile(profile)')}
    ${pathHead}
    ${body}
  </div>`,'home');
}
function mode(m,ic,name,sub){
  return `<div class="mode play" onclick="startGame('${m}')">${PLAY_BADGE}<div class="m-ico">${ic}</div><div class="m-name">${name||'&nbsp;'}</div>${sub?`<div class="m-sub">${sub}</div>`:''}</div>`;
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
function pickTopic(c){game.cat=c||null;if(c&&window.Analytics)Analytics.event('topic_usage',{topic:c});openMenu('english');}
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

