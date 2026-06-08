/* ═══════════════════════════════════════════════════════════
   NIKO LEARN: owl: tutor hints, voice mode, break
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════ AI TUTOR ═══════════════ */
function aiRole(){return (window.NIKO_TWEAKS&&window.NIKO_TWEAKS.aiRole)||'companion';}
function gameSubject(){
  const m=game.mode||'';
  if(m==='kings-eng')return 'kings-eng';
  if(m==='kings-math')return 'kings-math';
  if(m.startsWith('math-'))return 'math';
  if(m==='count')return 'counting';
  if(m==='ka-alpha'||m==='en-alpha')return 'alpha';
  if(m==='compare')return 'compare';
  if(m==='skip')return 'skip';
  if(m==='shapes')return 'shapes';
  if(m==='money')return 'money';
  if(m==='clock')return 'clock';
  return 'vocab';
}
function curQ(){return (game.mode||'').startsWith('math-')?game.cur:(game.qs?game.qs[game.i]:null);}
function syncAiFab(){
  let fab=$('#aifab');const inGame=$('#gscreen');
  if(inGame){
    if(!fab){fab=document.createElement('button');fab.id='aifab';fab.className='ai-fab';fab.onclick=openHint;$('.device').appendChild(fab);}
    fab.innerHTML=`<span class="ping"></span>${tutorAva(profile)}`;   // shows the chosen tutor animal
  } else if(fab) fab.remove();
}
let helpTimer=null;
function maybeOfferHelp(){
  if(aiRole()==='coach'){clearTimeout(helpTimer);helpTimer=setTimeout(openHint,300);}
  else{const f=$('#aifab');if(f){f.style.transform='scale(1.14)';setTimeout(()=>{const g=$('#aifab');if(g)g.style.transform='';},600);}}
}
function ensureTutor(){
  const q=curQ();if(!q)return null;
  const subject=gameSubject();
  const key=subject+'#'+game.i+'#'+(q.q||q.en||'');
  if(game.hintKey!==key){game.hintKey=key;game.hintLevel=0;game.tutor=Tutor.build({subject,q,mode:game.mode,profile,aiRole:aiRole()});}
  return game.tutor;
}
function openHint(){
  const t=ensureTutor();if(!t)return;
  const total=t.hints.length;
  const atExplain=game.hintLevel>=total;
  const text=atExplain?t.explain:t.hints[game.hintLevel];
  game.hintText=text;
  const subject=gameSubject();
  const showVoice=(subject==='vocab'||subject==='kings-eng')&&knows(profile,'en');
  // step dots instead of "hint 1/3" text (5–7 yo can't read that)
  const dots=Array.from({length:total+1},(_,i)=>`<span class="hint-dot ${i===(atExplain?total:game.hintLevel)?'on':''} ${i===total?'star':''}">${i===total?'★':''}</span>`).join('');
  let chips='';
  if(!atExplain){
    chips+=`<button class="ai-chip" onclick="advanceHint()">${game.hintLevel<total-1?'კიდევ →':'💡 სტრატეგია'}</button>`;
    if(showVoice)chips+=`<button class="ai-chip" onclick="openVoice()">${I.mic} ხმით</button>`;
  }
  let ov=$('#aiov');
  if(!ov){ov=document.createElement('div');ov.className='overlay';ov.id='aiov';ov.style.alignItems='flex-end';ov.style.padding='0 16px 96px';ov.onclick=closeHint;$('.device').appendChild(ov);}
  ov.innerHTML=`<div class="ai-bubble" onclick="event.stopPropagation()">
    <button class="ai-close" onclick="closeHint()" aria-label="დახურვა">✕</button>
    <div class="ai-top"><div class="ai-ava alive" onclick="event.stopPropagation();pickTutor()" title="შეცვალე მასწავლებელი">${tutorAva(profile)}</div><div class="ai-name">${t.name}</div></div>
    <div class="ai-text">${text}</div>
    <div class="hint-dots">${dots}</div>
    <button class="ai-listen-big" onclick="speakHint(this)">${I.speaker} მოისმინე</button>
    <div class="ai-chips">
      ${chips}
      <button class="ai-chip primary" onclick="closeHint()">${atExplain?'გასაგებია 👍':'მივხვდი 👍'}</button>
    </div>
  </div>`;
  if(window.applyLang)applyLang(ov);
  if(isYoung(profile))setTimeout(()=>speakHint(),250);
}
function speakHint(btn){
  if(btn)pulseTap(btn);
  const raw=(game.hintText||'').replace(/<[^>]+>/g,'').trim();
  if(!raw)return;
  const code=instrCode(profile);
  // device has a real voice for the instruction language → read the hint
  if(typeof hasVoiceFor==='function'&&hasVoiceFor(code)){speak(raw,code,{rate:isYoung(profile)?0.62:0.78});return;}
  // no native voice (e.g. Georgian on iOS): don't read garbled, speak the English target if it makes sense
  const q=curQ();
  // can't voice the hint text → at least voice the example WORD/letter (a recorded ka clip exists for it)
  if(q&&q.w){ speak(q.w,(typeof alphaIsKa==='function'&&alphaIsKa(game.mode))?'ka-GE':'en-US',{rate:isYoung(profile)?0.6:0.78}); return; }
  const en=q&&(q.en||q.a);
  if(en&&knows(profile,'en')&&typeof en==='string')speak(en,'en-US',{rate:isYoung(profile)?0.7:0.82});
  // else: stay silent rather than mispronounce; the visual pulse already gave feedback
}
function advanceHint(){game.hintLevel++;openHint();}
function explainNow(){const t=game.tutor;if(t)game.hintLevel=t.hints.length;openHint();}
function closeHint(){const o=$('#aiov');if(o)o.remove();}

/* ── O1: pick the tutor animal (reachable any time by tapping the tutor face) ── */
function pickTutor(){
  if(!profile)return;
  const ov=document.createElement('div');ov.className='overlay';ov.id='tutorpick';ov.style.zIndex='80';
  ov.onclick=()=>ov.remove();
  ov.innerHTML=`<div class="tutor-modal" onclick="event.stopPropagation()">
    <button class="ai-close" onclick="document.getElementById('tutorpick').remove()" aria-label="დახურვა">✕</button>
    <div class="tutor-modal-h">აირჩიე მასწავლებელი</div>
    <div class="tutor-grid">${TUTOR_ANIMALS.map(a=>`<button class="tutor-pick ${tutorAva(profile)===a?'on':''}" onclick="chooseTutor('${a}')">${a}</button>`).join('')}</div>
  </div>`;
  $('.device').appendChild(ov);
}
function chooseTutor(a){
  setTutor(profile,a);
  const o=$('#tutorpick');if(o)o.remove();
  syncAiFab();                       // update the floating tutor button
  if($('#aiov'))openHint();          // refresh the open hint bubble with the new face
  if($('.voice'))voiceScreen('idle');// refresh voice screen if open
}

/* ── VOICE MODE ── */
function openVoice(){
  if($('#aiov'))$('#aiov').remove();
  // gate behind mic-permission once per session
  if(!game.micOk)return micPermission();
  voiceScreen('idle');
}
function micPermission(){
  render(`<div class="screen permwrap">
    <div class="perm-ico">${I.mic}</div>
    <h2>ხმოვანი რეჟიმი</h2>
    <p>ბუ მოგისმენს, როცა მიკროფონს დააჭერ, და დაგეხმარება გამოთქმაში.</p>
    <div class="perm-points">
      <div class="perm-point">${I.check} ვსმენთ მხოლოდ მაშინ, როცა მიკროფონს დააჭერ</div>
      <div class="perm-point">${I.privacy} ხმა მუშავდება <b>შენს მოწყობილობაზე</b>, არსად იგზავნება</div>
      <div class="perm-point">${I.check} არაფერი ინახება და არ ზიარდება</div>
    </div>
    <button class="btn btn-primary btn-block" style="max-width:320px" onclick="grantMic()">დართე ნება (მშობელი)</button>
    <button class="btn btn-ghost btn-block" style="max-width:320px" onclick="game.subj?openMenu(game.subj):selectProfile(profile)">ახლა არა</button>
    <p class="consent-note">ეს ერთჯერადი თანხმობაა. ხმის დამუშავება ხდება მხოლოდ მოწყობილობაზე, ღრუბელში არ იგზავნება.</p>
  </div>`,false);
}
function grantMic(){game.micOk=true;voiceScreen('idle');}
function voiceScreen(stateName){
  const target=game.qs&&game.qs[game.i]?(game.qs[game.i].en||game.qs[game.i].q):'apple';
  const tk=game.qs&&game.qs[game.i]?(game.qs[game.i].ka||''):'ვაშლი';
  const states={
    idle:{s:'დააჭირე და თქვი',h:'წარმოთქვი სიტყვა ხმამაღლა, მასწავლებელი მოგისმენს',ava:tutorAva(profile)},
    listening:{s:'გისმენ…',h:'ლაპარაკობ ნათლად 🎙️',ava:'👂'},
    thinking:{s:'ვფიქრობ…',h:'',ava:tutorAva(profile)},
    speaking:{s:'ბუ პასუხობს',h:'',ava:'🗣️'}
  };
  const st=states[stateName];
  let mid='';
  if(stateName==='idle')mid=`<button class="mic" id="micbtn" onclick="voiceListen()"><span class="pulse"></span>${I.mic}</button>`;
  else if(stateName==='listening')mid=`<div class="wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><button class="mic live" onclick="voiceResult()"><span class="pulse"></span>${I.mic}</button>`;
  else if(stateName==='thinking')mid=`<div class="dots"><i></i><i></i><i></i></div>`;
  else mid=`<div class="wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>`;
  render(`<div class="screen voice">
    <button class="iconbtn" style="position:absolute;top:18px;left:18px" onclick="game.subj?openMenu(game.subj):selectProfile(profile)">←</button>
    <div class="v-ava">${st.ava}</div>
    <div class="v-target">${target}<small>${tk}</small></div>
    <div class="v-state">${st.s}</div>
    ${st.h?`<div class="v-hint">${st.h}</div>`:''}
    ${mid}
  </div>`,false);
  if(stateName==='speaking')speak(target);
}
function voiceListen(){voiceScreen('listening');setTimeout(()=>{if($('.voice'))voiceResult();},2600);}
function voiceResult(){
  voiceScreen('thinking');
  setTimeout(()=>{
    const score=ri(72,96);
    const target=game.qs&&game.qs[game.i]?(game.qs[game.i].en||'apple'):'apple';
    const good=score>=85;
    render(`<div class="screen voice">
      <button class="iconbtn" style="position:absolute;top:18px;left:18px" onclick="game.subj?openMenu(game.subj):selectProfile(profile)">←</button>
      <div class="v-ava">${tutorAva(profile)}</div>
      <div class="scorering" style="--sc:${score}%"><i>${score}</i></div>
      <div class="v-state">${good?'ჩინებული გამოთქმა! 🌟':'კარგია! ცოტა გავაუმჯობესოთ'}</div>
      <div class="v-hint">${good?`„${target}" ნათლად წარმოთქვი.`:`სცადე ბგერა <b>/${target[0]}/</b> უფრო მკაფიოდ.`}</div>
      <div class="ai-chips" style="justify-content:center">
        <button class="ai-chip" onclick="voiceScreen('speaking')">${I.speaker} ისევ მომისმინე</button>
        <button class="ai-chip primary" onclick="voiceScreen('idle')">${I.mic} კიდევ ვცადო</button>
      </div>
    </div>`,false);
    speak(target);
  },1400);
}

/* ═══════════════ MOVEMENT BREAK v2, rigged-SVG kids in the Georgian kit ═══════════════
   Ported from the owner's reference design (movement/Movement Break v2 (Georgia kit).html).
   Two rigged SVG kids (named limb groups) loop the moves via CSS keyframes only, offline,
   vector, zero media. A player UI (now-playing + prev/play/next + a numbered rail) lets the
   child pick. Owner removed 3 moves (high-knees/march, torso-twist, toe-touch). Praise = ბრავო. */
const MV_MOVES=[
  {id:'squat',      ka:'ბუქნი',                en:'Squats',          short:'ბუქნი',     reps:18, dur:1.4, type:'rep'},
  {id:'jump',       ka:'ახტომა მაღლა',          en:'Jump Up',         short:'ახტომა',    reps:14, dur:1.3, type:'rep'},
  {id:'plank',      ka:'პლანკა',               en:'Plank Hold',      short:'პლანკა',    reps:20, dur:3.0, type:'hold'},
  {id:'balance',    ka:'ცალ ფეხზე დგომა',       en:'One-leg Stand',   short:'ბალანსი',   reps:15, dur:2.4, type:'hold'},
  {id:'armcircles', ka:'ხელების ტრიალი',        en:'Arm Circles',     short:'ტრიალი',    reps:18, dur:1.2, type:'rep'},
  {id:'overhead',   ka:'ხელების აწევა',         en:'Overhead Reach',  short:'აწევა',     reps:16, dur:1.4, type:'rep'},
  {id:'bear',       ka:'დათვივით სიარული',      en:'Bear Walk',       short:'დათვი',     reps:12, dur:1.1, type:'rep'},
  {id:'kangaroo',   ka:'კენგურუსავით ხტომა',    en:'Kangaroo Hops',   short:'კენგურუ',   reps:16, dur:0.9, type:'rep'},
  {id:'jacks',      ka:'ვარსკვლავური ხტომა',     en:'Jumping Jacks',   short:'ვარსკვლავი',reps:16, dur:0.85,type:'rep'},
  {id:'sidebend',   ka:'გვერდითი მოხრა',         en:'Side Bends',      short:'მოხრა',     reps:12, dur:1.8, type:'rep'},
  {id:'clap',       ka:'ტაში მაღლა',             en:'Overhead Claps',  short:'ტაში',      reps:18, dur:0.7, type:'rep'},
  {id:'run',        ka:'ადგილზე სირბილი',        en:'Run in Place',    short:'სირბილი',   reps:24, dur:0.5, type:'rep'},
  {id:'airplane',   ka:'თვითმფრინავი',           en:'Airplane',        short:'თვითმფ.',   reps:15, dur:2.4, type:'hold'},
  {id:'punch',      ka:'ბოქსი',                  en:'Boxing',          short:'ბოქსი',     reps:20, dur:0.6, type:'rep'},
  {id:'dance',      ka:'ცეკვა',                  en:'Dance Wiggle',    short:'ცეკვა',      reps:16, dur:1.0, type:'rep'},
  {id:'frog',       ka:'ბაყაყივით ხტომა',        en:'Frog Jumps',      short:'ბაყაყი',    reps:14, dur:1.0, type:'rep'},
  {id:'flamingo',   ka:'ფლამინგო',               en:'Flamingo',        short:'ფლამინგო',  reps:15, dur:2.6, type:'hold'}
];
// rigged character: .figure > .squash > [legs, body+flag, arms, head]; limbs pivot at the joint
function mvChar(c,lag){
  const arm=(cls,x)=>`<g class="limb ${cls}" transform="translate(${x},84)"><g class="seg up">
      <rect x="-6.3" y="0" width="12.6" height="13" rx="6" fill="#ffffff" stroke="#dcdcdc" stroke-width="0.6"/>
      <rect x="-6.3" y="10.5" width="12.6" height="3.2" rx="1.6" fill="#da291c"/>
      <rect x="-4.8" y="12.5" width="9.6" height="13" rx="4.8" fill="${c.skin}"/>
      <g class="jt" transform="translate(0,24)"><g class="seg2">
        <rect x="-4.6" y="0" width="9.2" height="19" rx="4.6" fill="${c.skin}"/>
        <circle cx="0" cy="20" r="6" fill="${c.skin}"/></g></g></g></g>`;
  const leg=(cls,x)=>`<g class="limb ${cls}" transform="translate(${x},133)"><g class="seg up">
      <rect x="-6.7" y="0" width="13.4" height="20" rx="5" fill="#da291c" stroke="#bf2317" stroke-width="0.5"/>
      <rect x="-4.8" y="17" width="9.6" height="9" rx="4.4" fill="${c.skin}"/>
      <g class="jt" transform="translate(0,24)"><g class="seg2">
        <rect x="-4.6" y="0" width="9.2" height="13" rx="4.4" fill="${c.skin}"/>
        <rect x="-5.2" y="11" width="10.4" height="8" rx="3" fill="#ffffff"/>
        <ellipse cx="1" cy="22" rx="9" ry="5.6" fill="#da291c"/></g></g></g></g>`;
  const sc=(cx,cy)=>`<rect x="${cx-1}" y="${cy-3}" width="2" height="6" rx="0.6" fill="#da291c"/><rect x="${cx-3}" y="${cy-1}" width="6" height="2" rx="0.6" fill="#da291c"/>`;
  return `<svg class="char${lag?' lag':''}" viewBox="0 0 120 210" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse class="shadow" cx="60" cy="201" rx="31" ry="7" fill="oklch(0.45 0.05 150 / .28)"/>
    <g class="figure"><g class="squash">
      ${leg('legL',53)}${leg('legR',67)}
      <rect class="body" x="42" y="70" width="36" height="66" rx="17" fill="#ffffff" stroke="#dcdcdc" stroke-width="0.8"/>
      <rect x="42" y="70" width="36" height="5" rx="6" fill="#da291c"/>
      <rect x="56.9" y="75" width="6.2" height="57" fill="#da291c"/>
      <rect x="43.5" y="100" width="33" height="6.2" fill="#da291c"/>
      ${sc(49,91)}${sc(71,91)}${sc(49,117)}${sc(71,117)}
      ${arm('armL',44)}${arm('armR',76)}
      <g class="head">
        <ellipse cx="60" cy="40.5" rx="26" ry="28.5" fill="${c.skin}"/>
        ${c.hair}
        <path d="M48.5 34.5 q4 -2.6 8.2 -0.8" stroke="${c.brow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <path d="M63.3 33.7 q4.2 -1.8 8.2 0.8" stroke="${c.brow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
        <g class="eyes"><circle cx="52.5" cy="40" r="3.6" fill="${c.ink}"/><circle cx="53.6" cy="38.8" r="1.1" fill="#fff"/>
        <circle cx="67.5" cy="40" r="3.6" fill="${c.ink}"/><circle cx="68.6" cy="38.8" r="1.1" fill="#fff"/></g>
        <path d="M60 42.5 q1.9 3.6 -1 5.3" stroke="${c.skin2}" stroke-width="1.7" fill="none" stroke-linecap="round"/>
        <circle cx="46.5" cy="49" r="3.8" fill="oklch(0.78 0.13 26 / .42)"/>
        <circle cx="73.5" cy="49" r="3.8" fill="oklch(0.78 0.13 26 / .42)"/>
        <path d="M53.5 50 q6.5 6 13 0" stroke="${c.mouth}" stroke-width="${c.mouthW}" fill="none" stroke-linecap="round"/>
      </g>
    </g></g></svg>`;
}
const MV_NIKO={skin:'#f3c79a', skin2:'#d59f6d', ink:'#33291f', brow:'#5a3d28', mouth:'#9c5a44', mouthW:2.8,
  hair:'<path d="M34 37 q1-27 26-27 q25 0 26 27 q-10-12-26-12 q-16 0-26 12z" fill="#5a3d28"/>'};
const MV_MASHO={skin:'#f6d1aa', skin2:'#dcab7e', ink:'#33291f', brow:'#3a2a1c', mouth:'#d24a5e', mouthW:3.6,
  hair:'<path d="M33 44 q-2-31 27-31 q29 0 27 31 q-5-12-13-13 q-2 6-14 6 q-12 0-14-6 q-8 1-13 13z" fill="#3a2a1c"/>'+
       '<ellipse cx="33" cy="41" rx="5" ry="5.5" fill="#3a2a1c"/><circle cx="24" cy="38" r="5.5" fill="#3a2a1c"/><circle cx="16" cy="35" r="4.3" fill="#3a2a1c"/><path d="M16 35 q-7 -2 -10 2 q5 1.5 10 -2z" fill="#3a2a1c"/><rect x="29.5" y="37" width="3.2" height="8" rx="1.6" fill="#e8b54a"/>'+
       '<ellipse cx="87" cy="41" rx="5" ry="5.5" fill="#3a2a1c"/><circle cx="96" cy="38" r="5.5" fill="#3a2a1c"/><circle cx="104" cy="35" r="4.3" fill="#3a2a1c"/><path d="M104 35 q7 -2 10 2 q-5 1.5 -10 -2z" fill="#3a2a1c"/><rect x="87.3" y="37" width="3.2" height="8" rx="1.6" fill="#e8b54a"/>'};
let _mvIdx=0,_mvPlaying=true,_mvCount=0,_mvTimer=null;
function closeBreak(){clearInterval(_mvTimer);_mvTimer=null;try{speechSynthesis.cancel();}catch(e){}const el=document.getElementById('breakscr');if(el)el.remove();}
function showBreak(manual){
  if(document.getElementById('breakscr'))return;
  if(window.Analytics)Analytics.screen('movement');
  const el=document.createElement('div');el.className='breakscreen mv2';el.id='breakscr';
  el.innerHTML=`
    <header class="mv-top">
      <button class="iconbtn" onclick="closeBreak()" aria-label="უკან">←</button>
      <div class="who">მოძრაობის შესვენება<small>გავიმოძრაოთ ერთად 🙌</small></div>
      <div class="pill"><span class="num" id="mvProg">1</span>/<span id="mvPtot">${MV_MOVES.length}</span></div>
    </header>
    <div class="scene" id="mvScene" data-move="squat" style="--dur:1.4s">
      <div class="room"></div><div class="cloud a"></div><div class="cloud b"></div><div class="cloud c"></div>
      <div class="mat"></div>
      <div class="chars" id="mvChars"></div>
      <div class="toast" id="mvToast">ბრავო! 💪</div>
    </div>
    <div class="now">
      <div class="name" id="mvName">ბუქნი</div>
      <div class="sub en" id="mvEn">SQUATS</div>
      <div class="count"><span class="big" id="mvNow">0</span><span class="tot" id="mvTot">/18</span><span class="lbl" id="mvLbl">გამეორება</span></div>
      <div class="bar"><i id="mvBar"></i></div>
    </div>
    <div class="controls">
      <button class="ctl" id="mvPrev" aria-label="წინა">‹</button>
      <button class="ctl play" id="mvPlay" aria-label="დაპაუზება">⏸</button>
      <button class="ctl" id="mvNext" aria-label="შემდეგი">›</button>
    </div>
    <div class="rail" id="mvRail"></div>`;
  $('.device').appendChild(el);
  el.querySelector('#mvChars').innerHTML=mvChar(MV_NIKO,false)+mvChar(MV_MASHO,true);
  const rail=el.querySelector('#mvRail');
  MV_MOVES.forEach((m,i)=>{const b=document.createElement('button');b.className='chip';b.dataset.i=i;
    b.innerHTML=`<span class="n">${i+1}</span><span class="t">${m.short}</span>`;b.onclick=()=>mvSelect(i);rail.appendChild(b);});
  el.querySelector('#mvPrev').onclick=()=>mvSelect(_mvIdx-1);
  el.querySelector('#mvNext').onclick=()=>mvSelect(_mvIdx+1);
  el.querySelector('#mvPlay').onclick=()=>mvSetPlay(!_mvPlaying);
  _mvIdx=0;_mvPlaying=true;_mvCount=0;
  mvRender();
}
function _mvFmt(s){const m=Math.floor(s/60),x=s%60;return m+':'+String(x).padStart(2,'0');}
function mvRender(){
  const el=document.getElementById('breakscr');if(!el)return;
  const m=MV_MOVES[_mvIdx],sc=el.querySelector('#mvScene');
  sc.dataset.move=m.id;sc.style.setProperty('--dur',m.dur+'s');
  el.querySelector('#mvName').textContent=m.ka;el.querySelector('#mvEn').textContent=m.en.toUpperCase();
  el.querySelector('#mvProg').textContent=_mvIdx+1;
  [...el.querySelectorAll('#mvRail .chip')].forEach((c,i)=>c.classList.toggle('on',i===_mvIdx));
  const chip=el.querySelector('#mvRail').children[_mvIdx];if(chip&&chip.scrollIntoView)chip.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
  _mvCount=0;mvUpdateCount();mvRestartTimer();
}
function mvUpdateCount(){
  const el=document.getElementById('breakscr');if(!el)return;
  const m=MV_MOVES[_mvIdx];
  if(m.type==='hold'){el.querySelector('#mvNow').textContent=_mvFmt(Math.max(0,m.reps-_mvCount));el.querySelector('#mvTot').textContent='';el.querySelector('#mvLbl').textContent='დაიჭირე';}
  else{el.querySelector('#mvNow').textContent=_mvCount;el.querySelector('#mvTot').textContent='/'+m.reps;el.querySelector('#mvLbl').textContent='გამეორება';}
  el.querySelector('#mvBar').style.width=(_mvCount/m.reps*100)+'%';
}
function mvRestartTimer(){
  clearInterval(_mvTimer);if(!_mvPlaying)return;
  const m=MV_MOVES[_mvIdx],step=m.type==='hold'?1000:Math.round(m.dur*1000);
  _mvTimer=setInterval(()=>{_mvCount++;if(_mvCount>=m.reps){mvUpdateCount();mvCheer();_mvCount=0;setTimeout(mvUpdateCount,650);}else mvUpdateCount();},step);
}
function mvCheer(){
  const el=document.getElementById('breakscr');if(!el)return;
  const t=el.querySelector('#mvToast');if(t){t.classList.add('show');setTimeout(()=>t.classList.remove('show'),900);}
  try{praise();}catch(e){}   // voiced ბრავო/მართალია/შესანიშნავია (recorded clip, never garbled)
}
function mvSelect(i){_mvIdx=(i+MV_MOVES.length)%MV_MOVES.length;mvRender();}
function mvSetPlay(p){const el=document.getElementById('breakscr');if(!el)return;_mvPlaying=p;el.querySelector('#mvScene').classList.toggle('paused',!p);el.querySelector('#mvPlay').textContent=p?'⏸':'▶';mvRestartTimer();}

