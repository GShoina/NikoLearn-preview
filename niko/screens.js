/* ═══════════════════════════════════════════════════════════
   NIKO LEARN: screens: home, auth, onboarding, profile, menu
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════ SCREENS ═══════════════ */
const APP_VERSION='1.349'; // MVP stays v1.1xx until the real v2.00 (all 7 phases). v2.00-v2.07 = v1.100-v1.107.
function goHome(){
  if(typeof clearCeleb==='function')clearCeleb(); if(typeof closeFeedback==='function')closeFeedback(); // CE-2: kill pending celebration timers so they can't re-render the round over home
  // A4: if a round was in progress, count it as abandoned before we leave it
  if(typeof game!=='undefined'&&game&&game.roundActive){ try{ if(window.Analytics)Analytics.event('round_abandon',{mode:coarseMode(),q:(game.i>=8?'8+':String(game.i||0))}); }catch(e){} game.roundActive=false; }
  if(window.Analytics)Analytics.screen('home');
  profile=null;state=load();
  if(!state.onboarded){state.onboarded=true;save();} // landing already explains the app, skip the duplicate welcome
  const kids=state.kids||[];
  const isNew=kids.length===0;
  const cards=kids.map(k=>{
    const p=k.id,s=state[p],lv=levelOf(p),init=(k.name||'?')[0];
    const meta=s.shields>0?`<div class="pmeta"><span>🪙</span> ${s.shields} · ${lv.ic} ${lv.name}</div>`
      :`<div class="pmeta">დაიწყე →</div>`;
    return `<div class="pcard" role="button" tabindex="0" aria-label="${k.name}, დაიწყე სწავლა" onclick="selectProfile('${p}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectProfile('${p}')}">
      <button class="pcard-del" onclick="event.stopPropagation();deleteKid('${p}')" aria-label="${k.name}-ს წაშლა">🗑️</button>
      <div class="avatar a-${k.color||'sky'}">${init}</div>
      <div class="pname">${k.name}</div>
      <div class="page">${k.age} წლის</div>
      ${meta}
    </div>`;
  }).join('');
  const addCard=`<button type="button" class="pcard add"${isNew?' style="grid-column:span 2"':''} onclick="addChild()" aria-label="${isNew?'შექმენი პროფილი, პროგრესი შეინახება':'დაამატე ბავშვი'}">
      <div class="avatar add-av">＋</div>
      <div><div class="pname">${isNew?'შექმენი პროფილი':'დაამატე ბავშვი'}</div>${isNew?'<div class="pmeta">პროგრესი შეინახება</div>':''}</div>
    </button>`;
  // COLD START: a brand-new visitor used to see only the "create profile" card, so the FIRST
  // thing the app asked was a 3-4 screen profile+consent flow before a single question — a likely
  // big slice of the abandon rate. Give an instant, zero-commitment taste: play as the guest
  // profile right now, create a real (saved) profile only once they want to keep progress.
  const demoCard=isNew?`<button type="button" class="pcard demo" style="grid-column:span 2" onclick="tryDemo()" aria-label="გამოსცადე ახლავე, პროფილის გარეშე">
      <div class="avatar a-green">🎮</div>
      <div><div class="pname">გამოსცადე ახლავე</div>
      <div class="pmeta">ისწავლე თამაშით ერთ წუთში, პროფილის გარეშე 👇</div></div>
    </button>`:'';
  render(`<div class="screen home">
    <div class="brand brand-btn" onclick="landing()" title="მთავარი გვერდი">
      <div class="sun-badge" style="background:none;box-shadow:none;padding:0"><img src="owl-logo.png" alt="" style="width:100%;height:100%;object-fit:contain"></div>
      <h1 class="mark" style="margin:0">NikoLearn</h1>
      <div class="tag${isNew?' tag-welcome':''}">${isNew?'<span class="tw-hi">მოგესალმები 👋</span><span class="tw-step">ჯერ გამოსცადე</span><span class="tw-step">მერე შექმენი პროფილი</span>':'ვინ სწავლობს?'}</div>
    </div>
    <div class="profile-grid">
      ${demoCard}
      ${cards}
      ${addCard}
      <button type="button" class="pcard parent" style="grid-column:span 2" onclick="openGate()" aria-label="მშობლის სივრცე">
        <div class="avatar a-purple">${I.lock}</div>
        <div><div class="pname">მშობლის სივრცე</div>
        <div class="lockwrap">${I.lock} დაცულია</div></div>
      </button>
    </div>
    <div class="trustline">${I.privacy} მონაცემები ამ მოწყობილობაზე რჩება</div>
    <div class="gate-foot"><button class="foot-lang" onclick="appLang(event)" aria-label="ინტერფეისის ენა / interface language">🌐 ${window.UILANG==='en'?'ქართული':'English'}</button></div>
    <div style="margin-top:8px;font-size:.78rem;color:var(--muted);text-align:center">NikoLearn v${APP_VERSION}</div>
  </div>`,false); // gate is a chooser, not a play surface → hide bottom-nav (AB/calc subject-jumps are redundant here). owner 2026-06-25
}

/* ── cold-start demo: play immediately as the guest profile, no profile/consent flow first.
   Reuses the fully-tested guest path (state, levels, back-nav to home all already wired), so the
   new visitor lands on the real, playable subject grid one tap from a question. They create a
   saved profile only when they want progress kept. ── */
function tryDemo(){
  // UX-2: ask one quick age band so the demo opens at the RIGHT altitude. Guest age was 0 (not "young"),
  // so the highest-traffic CTA used to lead with Kings & Cambridge / ოლიმპიადა for parents of pre-readers.
  render(`<div class="screen">${topbarPlain('სტუმარი','goHome()')}
    <div class="center" style="margin:18px 0 8px"><div style="font-size:52px;line-height:1">🦉</div>
      <h2 style="margin:8px 0 4px;font-size:1.35rem">ვინ სწავლობს თამაშით?</h2>
      <p style="color:var(--muted);margin:0 0 16px">აირჩიე ასაკი და სწორ გამოწვევებს შემოგთავაზებთ</p></div>
    <div style="display:flex;flex-direction:column;gap:10px;max-width:340px;margin:0 auto;padding:0 16px">
      <button class="btn btn-primary btn-block" onclick="startDemo(4)">🧸 3-5 წელი</button>
      <button class="btn btn-primary btn-block" onclick="startDemo(7)">🎒 6-8 წელი</button>
      <button class="btn btn-primary btn-block" onclick="startDemo(10)">📚 9-12 წელი</button>
    </div></div>`, false);
}
function startDemo(age){
  try{ state.guestAge=age; save(); }catch(e){}
  try{ if(window.Analytics) Analytics.event('demo_age',{age_band: age<=5?'3-5':age<=8?'6-8':'9-12'}); }catch(e){}
  selectProfile('guest');
}

/* ── landing page (real marketing landing: what + why; desktop + mobile) ── */
function enterApp(){ state.authed=true; save(); goHome(); }
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
        <div class="lp-card"><div class="lp-ic">🔤</div><div class="lp-ct">ინგლისური</div><div class="lp-cs">სიტყვები, ფრაზები, მართლწერა, 13 თემა</div></div>
        <div class="lp-card"><div class="lp-ic">🧮</div><div class="lp-ct">მათემატიკა</div><div class="lp-cs">შეკრება, გამოკლება, გამრავლება, დონეებით</div></div>
        <div class="lp-card"><div class="lp-ic">🇬🇪</div><div class="lp-ct">ანბანი</div><div class="lp-cs">ქართული და English, სწავლა და ქვიზი</div></div>
        <div class="lp-card"><div class="lp-ic">👑</div><div class="lp-ct">Kings</div><div class="lp-cs">Kings & Cambridge მზადება</div></div>
      </div>
    </div>
    <div class="lp-section">
      <div class="lp-h2">რატომ NikoLearn</div>
      <div class="lp-grid">
        <div class="lp-card"><div class="lp-ic">🔒</div><div class="lp-ct">სრული კონფიდენციალურობა</div><div class="lp-cs">ყველა მონაცემი ტელეფონზე რჩება. ონლაინ სინქრონიზაციის გარეშე.</div></div>
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

/* ── entry (no password gate; landing.html is the public front door, parent space stays PIN-gated) ── */
function boot(){
  try{ if(new URLSearchParams(location.search).get('admin')==='1') return adminGate(); }catch(e){}
  var enter=false;
  try{ enter=(new URLSearchParams(location.search).get('app')==='1')||sessionStorage.getItem('niko_enter')==='1'; }catch(e){}
  // Native app (Capacitor APK): there is no marketing landing inside the installed app — open straight into it.
  try{ if(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) enter=true; }catch(e){}
  if(!state.authed && !enter){ location.href='landing.html'; return; }   // first stop = owner's landing page (web only)
  try{sessionStorage.setItem('niko_enter','1');}catch(e){}
  if(!state.authed){ state.authed=true; save(); }
  goHome();
  try{ deepLinkGo(); }catch(e){}
}
/* ?go=<target> deep-link (owner 07-03): jump straight to the screen where a fix is visible, so any
   change can be validated in ONE click (see validate.html). Uses the guest demo — the already-wired,
   safe play path — then the confirmed per-mode start fn. No effect on a normal boot (no ?go). */
function deepLinkGo(){
  var go; try{ go=new URLSearchParams(location.search).get('go'); }catch(e){}
  if(!go) return;
  if(go==='home') return;                 // goHome() already showed the profile chooser (greeting fix)
  try{ startDemo(7); }catch(e){}          // guest → dock home (footer Home fix is visible here)
  if(go==='dock'||go==='footer') return;  // stay on the dock home
  var start={ math:function(){mathRound('math-add');}, 'kings-eng':function(){startKings('eng');},
    count:function(){startCount('count');}, triangle:function(){reasonRound('triangle');},
    alpha:function(){alphaQuiz('ka-alpha');}, digit:function(){startDigitQuiz();},
    read:function(){startReadQuiz();}, sent:function(){startSentQuiz();} }[go];
  if(start) setTimeout(function(){ try{ start(); }catch(e){} }, 90);
}
/* parent „გასვლა (ჩაკეტვა)": leave the parent space back to the kid profile chooser.
   No password to re-enter; the parent space re-locks via its own PIN/math gate (openGate). */
function logout(){ goHome(); }

/* ── admin (owner only): version + insights. URL: ?admin=1 ── */
function adminGate(){
  // No fake gate: this view holds NO secrets (version + this-browser counts + a local owner-device toggle).
  // Real protection is server-side (worker STATS_KEY) + the parent-space PIN. (B4: removed the niko-admin theater.)
  adminView();
}
function adminView(){
  state=load();
  const kids=state.kids||[];
  const sessions=kids.reduce((a,k)=>a+(((state[k.id]||{}).sessions)||0),0);
  const ownerDev=(function(){try{return localStorage.getItem('niko_owner')==='1';}catch(e){return false;}})();
  render(`<div class="screen home" style="gap:16px;justify-content:flex-start">
    <div class="brand" style="margin-top:8px">
      <div class="sun-badge" style="width:64px;height:64px;background:none;box-shadow:none;padding:0"><img src="owl-logo.png" alt="" style="width:100%;height:100%;object-fit:contain"></div>
      <div class="mark">NikoLearn · Owner</div>
      <div class="tag">v${APP_VERSION}</div>
    </div>
    <div class="perm-points" style="max-width:360px;margin:0 auto;text-align:left">
      <div class="perm-point">${I.check} ვერსია: <b>v${APP_VERSION}</b></div>
      <div class="perm-point">${I.check} პროფილები ამ ბრაუზერში: <b>${kids.length}</b></div>
      <div class="perm-point">${I.check} სესიები ამ ბრაუზერში: <b>${sessions}</b></div>
      <div class="perm-point">ℹ️ ეს რიცხვები მხოლოდ ამ ბრაუზერს ეხება. ყველა მოწყობილობის ნამდვილ რიცხვებს Desktop-ის stats-viewer-ში ხედავ.</div>
    </div>
    <button class="btn btn-ghost btn-block" style="max-width:360px" onclick="toggleOwnerDevice();adminView()">📱 ეს ჩემი მოწყობილობაა <b>${ownerDev?'✓':''}</b></button>
    <div class="pset-hint" style="max-width:360px;margin:-6px auto 0">ჩართულზე ამ მოწყობილობის გამოყენება ნამდვილ-მომხმარებლის სტატისტიკაში არ ითვლება (მხოლოდ შენთვის).</div>
    <button class="btn btn-ghost btn-block" style="max-width:360px;margin-top:10px" onclick="togglePremium();adminView()">💎 Paywall preview: <b>${premiumOn()?'OFF (ყველაფერი ღია)':'ON (locks ჩანს)'}</b></button>
    <div class="pset-hint" style="max-width:360px;margin:-6px auto 0">მხოლოდ შენთვის: ნახე როგორ გამოიყურება მომავალი ფასიანი გეგმა (Kings locks). MVP-ში მომხმარებელი ამას ვერ ხედავს. ყველაფერი უფასოა.</div>
    <button class="btn btn-ghost btn-block" style="max-width:360px;margin-top:10px" onclick="location.href='index.html?app=1'">&lt; აპში დაბრუნება</button>
  </div>`,false);
}

/* ── onboarding ── */
function welcome(){
  render(`<div class="screen home" style="gap:22px">
    <div class="brand">
      <div class="sun-badge" style="width:74px;height:74px;background:none;box-shadow:none;padding:0"><img src="owl-logo.png" alt="" style="width:100%;height:100%;object-fit:contain"></div>
      <div class="mark">NikoLearn</div>
      <div class="tag">თბილი სასწავლო სივრცე შენი ბავშვისთვის</div>
    </div>
    <div class="perm-points" style="max-width:330px;margin:0 auto">
      <div class="perm-point">${I.check} ინგლისური · მათემატიკა · Kings & Cambridge მზადება</div>
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
  draft={name:'',age:6,color:AV_COLORS[(state.kids.length)%AV_COLORS.length],langs:['ka'],tutor:'🦉',by:'parent'};
  renderAddChild(true); // direct to registration; parent/child split removed (was security theater), consent is inline. owner 2026-06-25
}
function renderInitiator(){
  render(`<div class="screen" style="justify-content:flex-start">
    ${topbarPlain('ახალი პროფილი','goHome()')}
    <div class="init-intro">ვინ ქმნის პროფილს?</div>
    <div class="init-grid">
      <button class="init-card" onclick="draft.by='parent';renderAddChild(true)">
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
        <div class="perm-point">${I.check}<span class="pp-tx">პროფილი იქმნება ბავშვისთვის</span></div>
        <div class="perm-point">${I.privacy}<span class="pp-tx">ყველა მონაცემი <b>ამ მოწყობილობაზე</b> ინახება</span></div>
        <div class="perm-point">${I.check}<span class="pp-tx">რეკლამა: ნული · გარე ბმულების გარეშე</span></div>
      </div>
      <button class="btn btn-primary btn-block" onclick="renderAddChild(true)">მე, მშობელი, ვეთანხმები ✓</button>
      <button class="btn btn-ghost btn-block mt" onclick="renderInitiator()">უკან</button>
    </div>
  </div>`,false);
}
function toggleLang(c){ if(c==='ka')return; const i=draft.langs.indexOf(c); if(i>=0)draft.langs.splice(i,1); else draft.langs.push(c); renderAddChild(); }
function renderAddChild(focusName){
  const init=draft.name?draft.name[0]:'?';
  render(`<div class="screen" style="justify-content:flex-start">
    ${topbarPlain('ახალი ბავშვი','goHome()')}
    <div class="consent-banner" id="cbanner">${I.privacy}<span class="cb-tx">მონაცემები <b>ამ მოწყობილობაზე</b> რჩება · რეკლამა ნული · გარე ბმული ნული</span><button class="cb-x" onclick="this.parentElement.remove()" aria-label="დახურვა">✕</button></div>
    <div class="center" style="margin:14px 0 18px">
      <div class="avatar a-${draft.color}" style="width:84px;height:84px;border-radius:26px;font-size:2.2rem;margin:0 auto">${init}</div>
    </div>
    <div class="section-label">სახელი</div>
    <input class="spell-input" id="kid-name" style="text-align:left;letter-spacing:0;font-family:'Noto Sans Georgian'" placeholder="მაგ. ლუკა" value="${String(draft.name||'').replace(/[<>&"']/g,'')}" oninput="draft.name=this.value;document.querySelector('.avatar.a-${draft.color}').textContent=this.value?this.value[0]:'?'">
    <div class="section-label mt">ასაკი: <b class="num">${draft.age}</b> წლის</div>
    <div class="age-row" id="age-row">${[3,4,5,6,7,8,9,10,11,12].map(a=>`<button class="age-chip num ${draft.age===a?'on':''}" onclick="draft.age=${a};renderAddChild()">${a}</button>`).join('')}</div>
    <div class="lvl-hint" style="margin:6px 2px">${draft.age<=5?'🧸 პატარებისთვის: ტექსტის გარეშე, ხატულა + ხმა':'🎒 დაიწყებს ინგლისურს, მათემატიკას და Kings-ს'}</div>
    <div class="section-label mt">რა ენებზე საუბრობს ბავშვი?</div>
    <div class="lang-row">${[['ka','ქართული'],['en','English']].map(([c,n])=>`<button class="lang-chip ${draft.langs.includes(c)?'on':''} ${c==='ka'?'lock':''}" onclick="toggleLang('${c}')">${n}</button>`).join('')}</div><!-- 'ru' removed 2026-07-01: no Russian content/voicing wired yet, so the option was a false promise. Re-add when ru content ships. -->
    <div class="lvl-hint" style="margin:6px 2px">🔊 გახმოვანება და ახსნა ამ ენებზე. ინგლისურს მაინც ისწავლის თამაშით.</div>
    <div class="section-label mt">ფერი</div>
    <div class="color-row">${AV_COLORS.map(c=>`<button class="color-dot a-${c} ${draft.color===c?'on':''}" onclick="draft.color='${c}';renderAddChild()"></button>`).join('')}</div>
    <div class="section-label mt">მასწავლებელი 🐾</div>
    <div class="tutor-grid">${TUTOR_ANIMALS.map(a=>`<button class="tutor-pick ${(draft.tutor||'🦉')===a?'on':''}" onclick="draft.tutor='${a}';renderAddChild()">${a}</button>`).join('')}</div>
    <div class="lvl-hint" style="margin:6px 2px">ბავშვი აირჩევს, რომელი ცხოველი ასწავლის. შემდეგ შეცვლაც შეიძლება.</div>
    <div class="spacer"></div>
    <button class="btn btn-primary btn-block mt" onclick="createChild()">შექმენი პროფილი</button>
    <div class="consent-mini">${I.check} შექმნით ადასტურებ, რომ მშობელი ხარ და ეთანხმები</div>
  </div>`,false);
  // Focus ONLY on first entry, never on the chip/lang re-renders. On iOS every programmatic focus pops the
  // keyboard, so re-focusing after each age/color/tutor/lang tap made the keyboard appear on ANY tap
  // (owner-reported iPhone bug 2026-07-01). Chip onclicks now call renderAddChild() (no arg) = no re-focus.
  if(focusName){ const n=$('#kid-name'); if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);} }
}
function createChild(){
  const name=(draft.name||'').trim().replace(/[<>&"']/g,'');   // strip HTML-special chars (XSS: name flows into innerHTML)
  if(!name){const n=$('#kid-name');if(n){n.style.borderColor='var(--red)';n.focus();}return;}
  const wasFirst=!(state.kids&&state.kids.length); // no kids yet = the new-visitor / post-demo signup path
  const id='k'+Date.now();
  state.kids.push({id,name,age:draft.age,color:draft.color,langs:(draft.langs&&draft.langs.length?draft.langs:['ka']),tutor:draft.tutor||'🦉'});
  state[id]=blankKid();
  // post-demo conversion: if the visitor tried the guest demo and earned coins/progress, carry it into
  // their FIRST real profile so the demo effort isn't lost (makes "create a profile to save" honest, not
  // empty). Only on the first profile, and the guest is reset so it can't be re-claimed.
  try{ const g=state.guest;
    if(wasFirst && g && (((g.shields||0)>0)||((g.sessions||0)>0))){
      const k=state[id];
      k.shields=g.shields||0; k.sessions=g.sessions||0; k.totalTime=g.totalTime||0;
      k.maxStreak=g.maxStreak||0; k.words=g.words||{}; k.math=g.math||{}; k.best=g.best||{};
      state.guest=blankKid();
    } }catch(e){}
  save();
  // first-party, aggregate, no-PII: a bare "new registration" count. Age is NOT transmitted (honours the
  // privacy.html promise; audit 2026-06-28 — was sending an age band derived from the child's exact age).
  if(window.Analytics)Analytics.event('profile_created');
  // v2.0: a brand-new child gets the first-run activation flow (open → gentle task → first win < 1 min),
  // the data-backed fix for q0-abandonment. Runs once (state[id].firstRunSeen). Returning profiles skip it.
  if(typeof firstRunStart==='function' && state[id] && !state[id].firstRunSeen){ return firstRunStart(id); }
  selectProfile(id);
}
function topbarPlain(title,back){
  return `<div class="topbar">${backBtn(back)}<div class="who">${title}</div></div>`;
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
/* ── HOME re-skin v1.319 (design-06 "jelly cards + water dock", Sunlit warm palette) ──
   All handlers/data are the EXISTING ones (openSubj / totalProgress / subjProgress / dayStreak /
   shields) — no invented data. Header greeting + 🔥 streak + 🪙 coins, a "continue where you left
   off" hero, then the jelly subject grid. The bottom water dock = the global bottom-nav re-skinned
   (render(...,'dock')), so every dock tap uses a real, already-wired route. */
const RESUME_META={
  english:{name:'ინგლისური',sub:'სიტყვები · ფრაზები'},
  math:{name:'მათემატიკა',sub:'დათვლა და ლოგიკა'},
  'ka-alpha':{name:'ქართული',sub:'ანბანი · კითხვა'}
};
function homeResume(p){
  const list=(typeof PATH_SUBJS!=='undefined')?PATH_SUBJS:['english','math','ka-alpha'];
  const pr=(subj)=>(typeof subjProgress==='function')?subjProgress(p,subj):{pct:0};
  let best=null;
  list.forEach(subj=>{const x=pr(subj); if(x.pct>0&&x.pct<100&&(!best||x.pct>best.pct))best={subj,pct:x.pct};});
  if(!best){ for(const subj of list){ const x=pr(subj); if(x.pct<100){best={subj,pct:x.pct};break;} } }
  if(!best) best={subj:list[0],pct:100};
  return best;
}
function homeHeader(p,s){
  const showStreak=kidObj(p).age>=6; // developmental: no child-facing streak pressure under 6 (matches topbar)
  const streakChip=showStreak?`<span class="hh-chip streak">${I.flame||'🔥'}<b>${s.dayStreak||0}</b></span>`:'';
  return `<div class="home-head">
    <div class="hh-ava"><img src="owl-logo.png" alt="" onerror="this.style.display='none'"></div>
    <div class="hh-hi"><span>გამარჯობა,</span><b>${nameOf(p)}!</b></div>
    <div class="hh-chips">
      ${streakChip}
      <span class="hh-chip coin">🪙<b>${s.shields||0}</b></span>
    </div>
  </div>`;
}
function homeContinueCard(p){
  const r=homeResume(p), m=RESUME_META[r.subj]||{name:r.subj,sub:''};
  const done=r.pct>=100;
  return `<div class="home-cont" onclick="openSubj(event,'${r.subj}')" role="button" tabindex="0"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openSubj(event,'${r.subj}')}">
    <div class="hc-owl">🦉</div>
    <div class="hc-body">
      <div class="hc-kick">${done?'ყოჩაღ! გავიარეთ':'გააგრძელე, სადაც გაჩერდი'}</div>
      <div class="hc-name">${m.name}</div>
      ${m.sub?`<div class="hc-sub">${m.sub}</div>`:''}
      <div class="hc-bar"><div class="hc-track"><i style="width:${r.pct}%"></i></div><span>${r.pct}%</span></div>
    </div>
  </div>`;
}
function selectProfile(p){
  profile=p;game.start=Date.now();game.cat=null;game.pcat=null;game.subj='';  // reset so the subject grid shows the 🔊 voice toggle (audit fix)
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
      <div class="subj kids stack hue-orange" data-sum="ციფრები 1-9 და დათვლა ხატულებით" onclick="openSubj(event,'counting')"><span class="s-badge">1–9</span><div class="s-ico">🔢</div><div class="s-name num">1 2 3</div><span class="tap-hint">👆</span></div>
      <div class="subj kids stack hue-green" data-sum="ქართული ასოები ხმითა და სურათით" onclick="openSubj(event,'ka-alpha')"><span class="s-badge">33 ასო</span><div class="s-ico">🇬🇪</div><div class="s-name">ა ბ გ</div><span class="tap-hint">👆</span></div>
      <div class="subj kids eng stack hue-blue" data-sum="English ABC ხმითა და სურათით" onclick="openSubj(event,'en-alpha')"><span class="s-badge">26 ასო</span><div class="s-ico">🇬🇧</div><div class="s-name en">A B C</div><span class="tap-hint">👆</span></div>
      ${tiny
        ? `<div class="subj kids play hue-purple" data-sum="ფიგურების ცნობა" onclick="startGame('shapes')">${PLAY_BADGE}<div class="s-ico">🔷</div><div class="s-name">ფიგურები</div></div>`
        : `<div class="subj kids maths stack hue-orange" data-sum="შეკრება და გამოკლება" onclick="openSubj(event,'math')"><span class="s-badge">3 თემა</span><div class="s-ico">➕➖</div><div class="s-name num">➕</div><span class="tap-hint">👆</span></div>`}
      <div class="subj kids talk play hue-purple" data-sum="საუბრის ბარათები მშობელთან ერთად" onclick="openTalk()">${PLAY_BADGE}<span class="s-badge">4 თემა</span><div class="s-ico">💬</div><div class="s-name">საუბარი</div></div>
      <div class="subj kids move play hue-teal" data-sum="მოკლე მოძრაობის შესვენება" onclick="showBreak(true)">${PLAY_BADGE}<div class="s-ico">🤸</div><div class="s-name">მოძრაობა</div></div>
      <div class="subj kids draw play hue-pink" data-sum="ხატვა და გაფერადება" onclick="openDraw()">${PLAY_BADGE}<div class="s-ico">🎨</div><div class="s-name">ხატვა</div></div>
    </div>`;
  } else {
    const wc=Object.values(s.words).filter(w=>w.correct>=3).length;
    subjects=`<div class="subj-grid">
      <div class="subj crown stack hue-gold" data-sum="ინგლისური Kings-ისა და Cambridge-ისთვის: სიტყვა · თარგმანი · მართლწერა · გრამატიკა · კითხვა" onclick="openSubj(event,'kings-eng')"><span class="s-badge">${premiumOn()?'👑 გამოცდა':'🔒 Premium'}</span><div class="s-ico">👑</div><div class="s-name">კინგსი ინგლისური</div><div class="s-sub">Kings & Cambridge</div></div>
      <div class="subj crown maths stack hue-gold" data-sum="ოლიმპიადა: ამოცანები და ლოგიკა" onclick="openSubj(event,'kings-math')"><span class="s-badge">${premiumOn()?'👑 გამოცდა':'🔒 Premium'}</span><div class="s-ico">📐</div><div class="s-name">კინგსი მათემატიკა</div><div class="s-sub">ოლიმპიადა</div></div>
      <div class="subj eng stack hue-blue" data-sum="13 თემა · 180+ სიტყვა · ფრაზები" onclick="openSubj(event,'english')"><span class="s-badge">13 თემა</span><div class="s-ico">🔤</div><div class="s-name">ინგლისური</div><div class="s-sub">სიტყვები · ფრაზები</div><span class="tap-hint">👆</span></div>
      <div class="subj maths stack hue-orange" data-sum="შეკრება, გამოკლება, გამრავლება, ფიგურები, ფული, საათი" onclick="openSubj(event,'math')"><span class="s-badge">8 თემა</span><div class="s-ico">🧮</div><div class="s-name">მათემატიკა</div><div class="s-sub">დონეებით 1–100</div><span class="tap-hint">👆</span></div>
      <div class="subj stack hue-green" data-sum="ანბანი · კითხვა · წერა · ამოწერა" onclick="openSubj(event,'ka-alpha')"><span class="s-badge">4 თემა</span><div class="s-ico">🇬🇪</div><div class="s-name">ქართული</div><div class="s-sub">კითხვა · წერა · ამოწერა</div><span class="tap-hint">👆</span></div>
      <div class="subj talk play hue-purple" data-sum="საუბრის ბარათები მშობელთან ერთად (ემოციები, ღირებულებები, ფანტაზია)" onclick="openTalk()">${PLAY_BADGE}<span class="s-badge">4 თემა</span><div class="s-ico">💬</div><div class="s-name">საუბარი</div><div class="s-sub">ფიქრი · ღირებულებები</div></div>
      <div class="subj move play hue-teal" data-sum="მოკლე მოძრაობის შესვენება ვარჯიშებით" onclick="showBreak(true)">${PLAY_BADGE}<div class="s-ico">🤸</div><div class="s-name">მოძრაობა</div><div class="s-sub">პატარა შესვენება</div></div>
      <div class="subj draw play hue-pink" data-sum="ხატვა, გაფერადება და გასაფერადებელი შაბლონები" onclick="openDraw()">${PLAY_BADGE}<div class="s-ico">🎨</div><div class="s-name">ხატვა</div><div class="s-sub">ფუნჯი · ფერები · შაბლონები</div></div>
    </div>`;
  }
  render(`<div class="screen home2">
    ${homeHeader(p,s)}
    ${homeContinueCard(p)}
    <div class="home-seclabel">საგნები</div>
    ${subjects}
  </div>`,'dock');
}

