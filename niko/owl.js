/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — owl: tutor hints, voice mode, break
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
    <button class="ai-listen-big" onclick="speakHint(this)">${I.speaker} მისმინე</button>
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
  // no native voice (e.g. Georgian on iOS): don't read garbled — speak the English target if it makes sense
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
    <p>ბუ მოგისმენს, როცა მიკროფონს დააჭერ — და დაგეხმარება გამოთქმაში.</p>
    <div class="perm-points">
      <div class="perm-point">${I.check} ვსმენთ მხოლოდ მაშინ, როცა მიკროფონს დააჭერ</div>
      <div class="perm-point">${I.privacy} ხმა მუშავდება <b>შენს მოწყობილობაზე</b> — არსად იგზავნება</div>
      <div class="perm-point">${I.check} არაფერი ინახება და არ ზიარდება</div>
    </div>
    <button class="btn btn-primary btn-block" style="max-width:320px" onclick="grantMic()">დართე ნება (მშობელი)</button>
    <button class="btn btn-ghost btn-block" style="max-width:320px" onclick="game.subj?openMenu(game.subj):selectProfile(profile)">ახლა არა</button>
    <p class="consent-note">ეს ერთჯერადი თანხმობაა. ხმის დამუშავება ხდება მხოლოდ მოწყობილობაზე — ღრუბელში არ იგზავნება.</p>
  </div>`,false);
}
function grantMic(){game.micOk=true;voiceScreen('idle');}
function voiceScreen(stateName){
  const target=game.qs&&game.qs[game.i]?(game.qs[game.i].en||game.qs[game.i].q):'apple';
  const tk=game.qs&&game.qs[game.i]?(game.qs[game.i].ka||''):'ვაშლი';
  const states={
    idle:{s:'დააჭირე და თქვი',h:'წარმოთქვი სიტყვა ხმამაღლა — მასწავლებელი მოგისმენს',ava:tutorAva(profile)},
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

/* ═══════════════ MOVEMENT BREAK (O2) — animated character (V1) ═══════════════ */
// A friendly SVG character actually PERFORMS each move (arms/legs animate), so a
// pre-reader child mirrors it. Text is secondary (one short playful caption).
//   name = voiced ka clip · emoji = small accent · play = playful caption ·
//   fig = the figure-motion class · tiny = safe for ages 3-4 · n/unit = count.
const MOVE_POOL=[
  {name:'ბუქნი',            emoji:'🏋️', n:5,  unit:'reps', play:'დავიჩუჩქოთ!',           tiny:true,  fig:'fig-squat'  },
  {name:'ახტომა',           emoji:'⬆️', n:8,  unit:'reps', play:'ვიხტუნოთ მაღლა!',        tiny:true,  fig:'fig-jump'   },
  {name:'პლანკა',           emoji:'💪', n:10, unit:'secs', play:'გავიჭიმოთ, დავიჭიროთ!',  tiny:false, fig:'fig-plank'  },
  {name:'ცალ ფეხზე დგომა',  emoji:'🦩', n:10, unit:'secs', play:'ერთ ფეხზე დავდგეთ!',      tiny:false, fig:'fig-balance'},
  {name:'ხელების ტრიალი',   emoji:'🔄', n:8,  unit:'reps', play:'ხელები ვატრიალოთ!',       tiny:true,  fig:'fig-arms'   },
  {name:'წვერებზე აწევა',   emoji:'⬆️', n:8,  unit:'reps', play:'წვერებზე ავიწიოთ!',       tiny:true,  fig:'fig-reach'  },
  {name:'დათვივით სიარული', emoji:'🐻', n:6,  unit:'reps', play:'დათვებივით ვიაროთ!',      tiny:true,  fig:'fig-sway'   },
  {name:'კენგურუსავით ხტომა',emoji:'🦘', n:6,  unit:'reps', play:'კენგურუსავით ვიხტუნოთ!',  tiny:true,  fig:'fig-jump'   }
];
// TWO friendly characters do the move together on a mat (ref: owner's kids-workout image).
// Flat + CSS-animated (V1, offline, no assets). Real 3D/studio look = V2 (garnamatac/Lottie).
function oneChar(){
  return `<g class="fig">
      <g class="leg leg-l"><rect x="56" y="120" width="13" height="40" rx="6.5"/></g>
      <g class="leg leg-r"><rect x="71" y="120" width="13" height="40" rx="6.5"/></g>
      <ellipse class="body" cx="70" cy="96" rx="30" ry="30"/>
      <g class="arm arm-l"><rect x="33" y="74" width="12" height="42" rx="6"/></g>
      <g class="arm arm-r"><rect x="95" y="74" width="12" height="42" rx="6"/></g>
      <g class="head">
        <circle cx="70" cy="42" r="27"/>
        <circle class="cheek" cx="54" cy="49" r="5"/><circle class="cheek" cx="86" cy="49" r="5"/>
        <circle class="eye" cx="61" cy="40" r="3.6"/><circle class="eye" cx="79" cy="40" r="3.6"/>
        <path class="smile" d="M60 50 q10 9 20 0"/>
      </g>
    </g>`;
}
function moveFigure(){
  return `<svg class="mv-fig" viewBox="0 0 250 152" aria-hidden="true">
    <ellipse class="mat" cx="125" cy="145" rx="118" ry="9"/>
    <g class="char a" transform="translate(2,9) scale(0.82)">${oneChar()}</g>
    <g class="char b" transform="translate(126,9) scale(0.82)">${oneChar()}</g>
  </svg>`;
}
let _mvTimer=null;
function closeBreak(){
  clearInterval(_mvTimer);_mvTimer=null;
  try{speechSynthesis.cancel();}catch(e){}
  const el=document.getElementById('breakscr');if(el)el.remove();
}
// manual=true when the child taps the 🤸 tile; false on the auto 15-min break.
function showBreak(manual){
  if(document.getElementById('breakscr'))return;
  const pool=isTiny(profile)?MOVE_POOL.filter(e=>e.tiny):MOVE_POOL;
  const ex=pool[ri(0,pool.length-1)];
  const intro=manual?'მოდი ვიმოძრაოთ':'დროა მოძრაობის';
  const el=document.createElement('div');el.className='breakscreen';el.id='breakscr';
  el.innerHTML=`
    <button class="b-back" onclick="closeBreak()" aria-label="უკან">←</button>
    <div class="mv-stage">${moveFigure()}</div>
    <div class="mv-play" id="mvPlay">${ex.play} <span class="mv-emoji">${ex.emoji}</span></div>
    <div class="mv-prog" id="mvProg"></div>
    <button class="btn mv-go" id="mvGo">დავიწყოთ! 🎬</button>`;
  el.querySelector('.mv-fig').classList.add(ex.fig);   // character demos the move on a loop
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
  try{speakSeq([{t:intro,lang:'ka-GE'},{t:ex.name,lang:'ka-GE'}]);}catch(e){}
  const go=el.querySelector('#mvGo');if(go)go.onclick=()=>runMove(ex);
}
function runMove(ex){
  const el=document.getElementById('breakscr');if(!el)return;
  const go=el.querySelector('#mvGo'),prog=el.querySelector('#mvProg');
  if(go)go.style.display='none';
  clearInterval(_mvTimer);
  if(ex.unit==='reps'){            // visual progress = filling dots (not just a number)
    prog.className='mv-prog dots';
    prog.innerHTML=Array.from({length:ex.n},()=>'<i></i>').join('');
    const dots=[...prog.children];
    let done=0;
    const step=()=>{
      if(dots[done])dots[done].classList.add('on');
      done++; pulseTap(prog);
      try{speak(numWord(done,profile),vCode(profile));}catch(e){}
      if(done>=ex.n){clearInterval(_mvTimer);_mvTimer=null;setTimeout(finishMove,1000);}
    };
    _mvTimer=setInterval(step,1100);step();
  } else {                          // hold = a depleting ring with the seconds inside
    prog.className='mv-prog ring';
    let t=ex.n;
    const draw=()=>{prog.style.setProperty('--p',Math.round(t/ex.n*100)+'%');prog.innerHTML='<b>'+t+'</b>';};
    draw();
    _mvTimer=setInterval(()=>{
      t--;
      if(t<=0){prog.style.setProperty('--p','0%');prog.innerHTML='<b>0</b>';clearInterval(_mvTimer);_mvTimer=null;setTimeout(finishMove,600);return;}
      draw();pulseTap(prog);
    },1000);
  }
}
function finishMove(){
  clearInterval(_mvTimer);_mvTimer=null;
  const el=document.getElementById('breakscr');if(!el)return;
  const fig=el.querySelector('.mv-fig');if(fig)fig.setAttribute('class','mv-fig fig-cheer');   // happy jump (SVG: setAttribute, not .className)
  const play=el.querySelector('#mvPlay');if(play)play.innerHTML='ყოჩაღ! 🎉';
  const prog=el.querySelector('#mvProg');if(prog)prog.innerHTML='';
  const go=el.querySelector('#mvGo');
  if(go){go.style.display='';go.textContent='მზად ვარ! ✅';go.onclick=()=>el.remove();}
  try{ if(typeof confettiEl==='function') el.appendChild(confettiEl()); }catch(e){}
  try{speak('ყოჩაღ','ka-GE');}catch(e){}
}

