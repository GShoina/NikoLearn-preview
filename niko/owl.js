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
    if(!fab){fab=document.createElement('button');fab.id='aifab';fab.className='ai-fab';fab.onclick=openHint;fab.innerHTML=`<span class="ping"></span>🦉`;$('.device').appendChild(fab);}
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
    <div class="ai-top"><div class="ai-ava alive">🦉</div><div class="ai-name">${t.name}</div></div>
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
    idle:{s:'დააჭირე და თქვი',h:'წარმოთქვი სიტყვა ხმამაღლა — ბუ მოგისმენს',ava:'🦉'},
    listening:{s:'გისმენ…',h:'ლაპარაკობ ნათლად 🎙️',ava:'👂'},
    thinking:{s:'ვფიქრობ…',h:'',ava:'🦉'},
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
      <div class="v-ava">🦉</div>
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

/* ═══════════════ MOVEMENT BREAK (O2) ═══════════════ */
// Each exercise: name (ka, voiced via recorded clip), emoji, n (count), unit.
// 'reps' counts UP and voices each number (1-20 clips); 'secs' holds + counts DOWN.
const MOVE_POOL=[
  {name:'ბუქნი',            emoji:'🏋️', n:5,  unit:'reps'},
  {name:'ახტომა',           emoji:'🤸', n:8,  unit:'reps'},
  {name:'პლანკა',           emoji:'🧘', n:10, unit:'secs'},
  {name:'ცალ ფეხზე დგომა',  emoji:'🦩', n:10, unit:'secs'},
  {name:'ხელების ტრიალი',   emoji:'🙆', n:8,  unit:'reps'},
  {name:'წვერებზე აწევა',   emoji:'🦵', n:8,  unit:'reps'},
  {name:'დათვივით სიარული', emoji:'🐻', n:6,  unit:'reps'},
  {name:'კენგურუსავით ხტომა',emoji:'🦘', n:6,  unit:'reps'}
];
let _mvTimer=null;
// exit the break at any moment (stops the timer, returns to the screen underneath)
function closeBreak(){
  clearInterval(_mvTimer);_mvTimer=null;
  try{speechSynthesis.cancel();}catch(e){}
  const el=document.getElementById('breakscr');if(el)el.remove();
}
// manual=true when the child taps the 🤸 tile; false on the auto 15-min break.
function showBreak(manual){
  if(document.getElementById('breakscr'))return; // guard against a double-open
  const ex=MOVE_POOL[ri(0,MOVE_POOL.length-1)];
  const intro=manual?'მოდი ვიმოძრაოთ':'დროა მოძრაობის';
  const unitLabel=ex.unit==='secs'?(ex.n+' წამი'):(ex.n+'-ჯერ');
  const el=document.createElement('div');el.className='breakscreen';el.id='breakscr';
  el.innerHTML=`
    <button class="b-back" onclick="closeBreak()" aria-label="უკან">←</button>
    <div class="b-ico">${ex.emoji}</div>
    <div class="b-txt" id="mvTxt">${manual?'მოდი ცოტა ვიმოძრაოთ! 🤸':'ყოჩაღ! ცოტა ვისწავლეთ.<br>დროა მოძრაობის 🤸'}</div>
    <div class="b-act mv-name">${ex.name} · <b>${unitLabel}</b></div>
    <div class="mv-count" id="mvCount" style="display:none">0</div>
    <button class="btn mv-go" id="mvGo">დაიწყე 🎬</button>`;
  if(window.applyLang)applyLang(el);
  $('.device').appendChild(el);
  // voice the prompt + the exercise name (recorded ka clips, no robot TTS)
  try{speakSeq([{t:intro,lang:'ka-GE'},{t:ex.name,lang:'ka-GE'}]);}catch(e){}
  const go=document.getElementById('mvGo');if(go)go.onclick=()=>runMove(ex);
}
function runMove(ex){
  const go=document.getElementById('mvGo');if(!go)return;
  const countEl=document.getElementById('mvCount');
  go.style.display='none';countEl.style.display='';
  clearInterval(_mvTimer);
  if(ex.unit==='secs'){            // hold: count seconds DOWN
    let t=ex.n;countEl.textContent=t;
    _mvTimer=setInterval(()=>{
      t--;
      if(t<=0){countEl.textContent=0;clearInterval(_mvTimer);_mvTimer=null;setTimeout(finishMove,700);return;}
      countEl.textContent=t;pulseTap(countEl);
    },1000);
  } else {                          // reps: count UP, voice each number
    let i=0;
    const step=()=>{
      i++;countEl.textContent=i;pulseTap(countEl);
      try{speak(String(i),'ka-GE');}catch(e){}
      if(i>=ex.n){clearInterval(_mvTimer);_mvTimer=null;setTimeout(finishMove,1000);}
    };
    _mvTimer=setInterval(step,1100);step();
  }
}
function finishMove(){
  clearInterval(_mvTimer);_mvTimer=null;
  const el=document.getElementById('breakscr');if(!el)return;
  const c=el.querySelector('#mvCount');if(c)c.style.display='none';
  const txt=el.querySelector('#mvTxt');if(txt)txt.innerHTML='ყოჩაღ! 💪';
  const name=el.querySelector('.mv-name');if(name)name.style.display='none';
  const btn=el.querySelector('#mvGo');
  if(btn){btn.style.display='';btn.textContent='მზად ვარ! ✅';btn.onclick=()=>el.remove();}
  try{speak('ყოჩაღ','ka-GE');}catch(e){}
}

