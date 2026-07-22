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
  // reasoning strands (Kings-math): pattern/rebus/model/triangle share the {q,a,opts,rule} shape and are
  // taught from q.rule. Without this they fell to the 'vocab' default → the owl showed the listening hint
  // ("მოისმინე ხმა 🔊") + the "ინგლისურის მასწავლებელი" label on a math puzzle (owner 2026-07-01).
  if(m==='pattern'||m==='rebus'||m==='model'||m==='triangle')return 'pattern';
  // NB-83: the 'exam' mode is the Kings-math mock (reasoning strands). Unmapped it fell to 'vocab' →
  // "ინგლისურის მასწავლებელი" on a math exam. Route to the same reasoning 'pattern' tutor → math label.
  if(m==='exam')return 'pattern';
  // Georgian reading / spell-building modes carry game.subj='ka-alpha' but their game.mode
  // (read/sent/rtext/build/shead) was UNMAPPED → fell to 'vocab' → the "ინგლისურის მასწავლებელი" label +
  // an English-vocab first message on a Georgian reading task (owner 2026-07-04, class-level fix). Route
  // them to a Georgian 'reading' tutor so the label + first message match the subject.
  if(m==='read'||m==='sent'||m==='rtext'||m==='build'||m==='shead')return 'reading';
  if(m==='digit')return 'counting';
  // safety net: any other unmapped mode honours the round's declared subject so the label/message still fit
  if(game.subj==='ka-alpha'||game.subj==='en-alpha')return 'reading';
  if(game.subj==='counting')return 'counting';
  return 'vocab';
}
function curQ(){var m=game.mode||''; if(m.startsWith('kings-'))return null; /* CM-1: Kings exam runs its own kx state, not game.qs — a stale game.qs[i] here crashed the owl hint */ return m.startsWith('math-')?game.cur:(game.qs?game.qs[game.i]:null);}
function syncAiFab(){
  let fab=$('#aifab');const inGame=$('#gscreen');
  if(inGame){
    if(!fab){fab=document.createElement('button');fab.id='aifab';fab.className='ai-fab';fab.onclick=openHint;
      fab.setAttribute('aria-label','დახმარება');
      // dock in the game top bar (never over the play tiles); fall back to .device if the row isn't found
      const row=$('#gscreen .progress-row'); (row||$('.device')).appendChild(fab);}
    fab.innerHTML=`<span class="ping"></span>${tutorFace(profile)}`;   // brand owl (or the chosen animal)
  } else if(fab) fab.remove();
}
// D4 (v2.04): the owl's most concrete job — after a WRONG tap, show (and for English, say) the correct
// answer, so a mistake actually teaches instead of just bouncing the child back to guess again.
function revealCorrect(cor,lang){
  const t=String(cor);
  setTimeout(()=>{
    const right=[...document.querySelectorAll('.opt')].find(b=>b.textContent.trim()===t);
    if(right){ right.classList.remove('dim'); right.classList.add('correct'); }
    if(lang){ try{ speak(t,lang); }catch(e){} }
  },500);
}
let helpTimer=null;
function maybeOfferHelp(){
  if(aiRole()==='coach'){clearTimeout(helpTimer);helpTimer=setTimeout(openHint,300);}
  else{const f=$('#aifab');if(f){f.style.transform='scale(1.14)';setTimeout(()=>{const g=$('#aifab');if(g)g.style.transform='';},600);}}
}
/* ── Idle-help (v1.232): a stuck child shows NO activity — no tap, no answer. Until now the owl only
   reacted on the 2nd WRONG tap, so a child who simply freezes got nothing. Now the owl NOTICES the
   pause and gently offers help: companion = a soft, dismissible "გჭირდება დახმარება?" bubble; coach =
   auto-open the hint. Re-armed per question by gameShell, cleared the moment the child answers, opens
   a hint, or leaves the round. Visual-only (no TTS — the ka hint voice is gated, never garble). ── */
let idleTimer=null;
function clearIdleHelp(){ if(idleTimer){clearTimeout(idleTimer);idleTimer=null;} if(helpTimer){clearTimeout(helpTimer);helpTimer=null;} closeIdleHint(); } // NB-73: also cancel a pending coach help-hint (maybeOfferHelp armed helpTimer→openHint); else a hint armed inside a task fires on the screen the child moved to
function armIdleHelp(){
  clearIdleHelp();
  if(!profile||!$('#aifab'))return;          // only inside a live game round
  const ms=isYoung(profile)?22000:16000;     // young kids get a longer, calmer think-pause
  idleTimer=setTimeout(idleNudge,ms);
}
function idleNudge(){
  idleTimer=null;
  if(!$('#aifab')||$('#aiov')||$('#teachov'))return;  // gone, or child already in a hint/teach gate
  if(aiRole()==='coach'){openHint();return;}           // coach: open the hint, as on the 2nd miss
  const fab=$('#aifab');if(fab){fab.style.transform='scale(1.12)';setTimeout(()=>{const g=$('#aifab');if(g)g.style.transform='';},700);}
  if($('#idlehint'))return;
  const b=document.createElement('div');b.className='idle-hint';b.id='idlehint';
  b.innerHTML=`<button class="idle-hint-btn" onclick="closeIdleHint();openHint()">💡 გჭირდება დახმარება?</button>`;
  $('.device').appendChild(b);
  setTimeout(closeIdleHint,7000);            // unobtrusive: fades itself if ignored
}
function closeIdleHint(){const e=$('#idlehint');if(e)e.remove();}
function ensureTutor(){
  const q=curQ();if(!q)return null;
  const subject=gameSubject();
  const key=subject+'#'+game.i+'#'+(q.q||q.en||'');
  if(game.hintKey!==key){game.hintKey=key;game.hintLevel=0;game.tutor=Tutor.build({subject,q,mode:game.mode,profile,aiRole:aiRole()});}
  return game.tutor;
}
function openHint(){
  clearIdleHelp();                 // the child engaged → cancel any pending idle nudge
  const t=ensureTutor();if(!t)return;
  const total=t.hints.length;
  const atExplain=game.hintLevel>=total;
  const text=atExplain?t.explain:t.hints[game.hintLevel];
  game.hintText=text;
  // fixed voiceable phrase (owl speaks even for DYNAMIC hints e.g. math number-hints): the tutor may supply
  // t.say (a number-free strategy phrase that has a recorded ka clip). speakHint prefers it over the text.
  game.hintVoice=t.say||'';
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
    <div class="ai-top"><div class="ai-ava alive" ${kt("event.stopPropagation();pickTutor()","შეცვალე მასწავლებელი")} title="შეცვალე მასწავლებელი">${tutorFace(profile)}</div><div class="ai-name">${(typeof tutorName==='function'?t.name.replace(/^ბუ/,tutorName(profile)):t.name)}</div></div>
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
  // CLIP-FIRST (INV-3, owner 2026-07-01): a recorded clip for this exact hint phrase plays on ANY device,
  // even one with no native Georgian voice (iOS). This is the root fix for "the owl never speaks Georgian":
  // speakHint used to jump straight to browser TTS, which iOS can't do for ka → silence. Fixed, voiceable
  // hint phrases now carry edge-tts clips, so the tutor actually talks. Falls through to TTS only if no clip.
  const voice=(game.hintVoice||'').replace(/<[^>]+>/g,'').trim();
  // clip-first: prefer the fixed voiceable phrase (so dynamic math hints still speak in ka), then the
  // displayed text's own clip, then fall through to TTS / the visual-only fallbacks below.
  if(typeof playClip==='function'){ if(voice&&playClip(voice))return; if(playClip(raw))return; }
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
    <div class="tutor-grid">${TUTOR_ANIMALS.map(a=>`<button class="tutor-pick ${tutorAva(profile)===a?'on':''}" onclick="chooseTutor('${a}')"><span class="tp-face">${a}</span><span class="tp-name">${(typeof TUTOR_PERSONA!=='undefined'&&TUTOR_PERSONA[a]?TUTOR_PERSONA[a].name:'')}</span></button>`).join('')}</div>
  </div>`;
  $('.device').appendChild(ov);
}
function chooseTutor(a){
  setTutor(profile,a);
  const o=$('#tutorpick');if(o)o.remove();
  syncAiFab();                       // update the floating tutor button
  if($('#aiov'))openHint();          // refresh the open hint bubble with the new face
  if($('.voice'))voiceScreen();      // refresh voice screen if open
}

/* ── VOICE MODE (honest, v1.232): real record → playback so the child HEARS THEIR OWN voice next to
   Niko's model word and self-compares. The old flow was theatre: `voiceListen` was a 2.6s FAKE timer
   ("გისმენ…") that NEVER touched the granted mic, then just replayed the word. Removed. Now it reuses the
   privacy-strict recorder from Speaking mode (speakRecStart/srRender/speakRecCleanup): in-memory only,
   never stored, never sent, mic released on stop, wiped the moment the child leaves the card. ── */
function openVoice(){
  if($('#aiov'))$('#aiov').remove();
  if(!game.micOk)return micPermission();   // one-time parent-facing consent before the OS mic prompt
  voiceScreen();
}
function micPermission(){
  render(`<div class="screen permwrap">
    <div class="perm-ico">${I.mic}</div>
    <h2>ხმოვანი რეჟიმი</h2>
    <p>ჩაიწერ შენს ხმას, მერე ნიკოს ნიმუშს მოუსმენ და შეადარებ. ასე გამოთქმას ივარჯიშებ.</p>
    <div class="perm-points">
      <div class="perm-point">${I.check}<span class="pp-tx">ვიწერთ მხოლოდ მაშინ, როცა ჩაწერას დააჭერ</span></div>
      <div class="perm-point">${I.privacy}<span class="pp-tx">ხმა მუშავდება <b>შენს მოწყობილობაზე</b>, არსად იგზავნება</span></div>
      <div class="perm-point">${I.check}<span class="pp-tx">არაფერი ინახება. შემდეგზე გადასვლისას იშლება</span></div>
    </div>
    <button class="btn btn-primary btn-block" style="max-width:320px" onclick="grantMic()">დართე ნება (მშობელი)</button>
    <button class="btn btn-ghost btn-block" style="max-width:320px" onclick="game.subj?openMenu(game.subj):selectProfile(profile)">ახლა არა</button>
    <p class="consent-note">ეს ერთჯერადი თანხმობაა. ხმის დამუშავება ხდება მხოლოდ მოწყობილობაზე, ღრუბელში არ იგზავნება.</p>
  </div>`,false);
}
function grantMic(){game.micOk=true;voiceScreen();}
function voiceExit(){ if(typeof speakRecCleanup==='function')speakRecCleanup(); game.subj?openMenu(game.subj):selectProfile(profile); }
function voiceScreen(){
  if(typeof speakRecCleanup==='function')speakRecCleanup();   // fresh card: no leftover recording
  const _q=game.qs&&game.qs[game.i]?game.qs[game.i]:null;
  // always pronounce the ENGLISH word. kings-eng "translate" cards have no .en (prompt is ka in .q) → use .a.
  const target=(_q&&(_q.en||_q.a))||'apple';
  const tk=_q?(_q.ka||''):'ვაშლი';
  const esc=String(target).replace(/'/g,"\\'");
  render(`<div class="screen voice">
    ${backBtn('voiceExit()','style="position:absolute;top:18px;left:18px"')}
    <div class="v-ava">${tutorFace(profile)}</div>
    <div class="v-target">${target}${tk?`<small>${tk}</small>`:''}</div>
    <div class="v-state">მოისმინე და გაიმეორე</div>
    <div class="v-hint">ჯერ ნიკოს მოუსმინე, მერე შენ ჩაიწერე და შეადარე 🙂</div>
    <button class="ai-listen-big" onclick="speak('${esc}','en-US')">${I.speaker} მოისმინე ნიკო</button>
    <div id="srbox" class="srbox" style="margin-top:16px"></div>
  </div>`,false);
  if(typeof srRender==='function')srRender();   // the real record→playback controls (Speaking-mode recorder)
  setTimeout(()=>{try{speak(target,'en-US');}catch(e){}},350);
}

/* ═══════════════ MOVEMENT BREAK v2, rigged-SVG kids in the Georgian kit ═══════════════
   Ported from the owner's reference design (movement/Movement Break v2 (Georgia kit).html).
   Two rigged SVG kids (named limb groups) loop the moves via CSS keyframes only, offline,
   vector, zero media. A player UI (now-playing + prev/play/next + a numbered rail) lets the
   child pick. Owner removed 3 moves (high-knees/march, torso-twist, toe-touch). Praise = ბრავო. */
/* Each move carries `tiny`: true = safe + simple enough for 3-4 year-olds. Sustained core holds
   (plank) and one-leg balances (one-leg stand, flamingo) are tiny:false — strain / fall risk for
   that age. showBreak() picks MOVE_POOL.filter(e=>e.tiny) when isTiny(profile), else the full pool. */
const MOVE_POOL=[
  {id:'squat',      ka:'ბუქნი',                en:'Squats',          short:'ბუქნი',     reps:18, dur:1.4, type:'rep',  tiny:true},
  {id:'jump',       ka:'ახტომა მაღლა',          en:'Jump Up',         short:'ახტომა',    reps:14, dur:1.3, type:'rep',  tiny:true},
  {id:'plank',      ka:'პლანკა',               en:'Plank Hold',      short:'პლანკა',    reps:20, dur:3.0, type:'hold', tiny:false},
  {id:'balance',    ka:'ცალ ფეხზე დგომა',       en:'One-leg Stand',   short:'ბალანსი',   reps:15, dur:2.4, type:'hold', tiny:false},
  {id:'armcircles', ka:'ხელების ტრიალი',        en:'Arm Circles',     short:'ტრიალი',    reps:18, dur:1.2, type:'rep',  tiny:true},
  {id:'overhead',   ka:'ხელების აწევა',         en:'Overhead Reach',  short:'აწევა',     reps:16, dur:1.4, type:'rep',  tiny:true},
  {id:'bear',       ka:'დათვივით სიარული',      en:'Bear Walk',       short:'დათვი',     reps:12, dur:1.1, type:'rep',  tiny:true},
  {id:'kangaroo',   ka:'კენგურუსავით ხტომა',    en:'Kangaroo Hops',   short:'კენგურუ',   reps:16, dur:0.9, type:'rep',  tiny:true},
  {id:'jacks',      ka:'ვარსკვლავური ხტომა',     en:'Jumping Jacks',   short:'ვარსკვლავი',reps:16, dur:0.85,type:'rep',  tiny:true},
  {id:'sidebend',   ka:'გვერდითი მოხრა',         en:'Side Bends',      short:'მოხრა',     reps:12, dur:1.8, type:'rep',  tiny:true},
  {id:'clap',       ka:'ტაში მაღლა',             en:'Overhead Claps',  short:'ტაში',      reps:18, dur:0.7, type:'rep',  tiny:true},
  {id:'run',        ka:'ადგილზე სირბილი',        en:'Run in Place',    short:'სირბილი',   reps:24, dur:0.5, type:'rep',  tiny:true},
  {id:'airplane',   ka:'თვითმფრინავი',           en:'Airplane',        short:'თვითმფ.',   reps:15, dur:2.4, type:'hold', tiny:true},
  {id:'punch',      ka:'ბოქსი',                  en:'Boxing',          short:'ბოქსი',     reps:20, dur:0.6, type:'rep',  tiny:true},
  {id:'dance',      ka:'ცეკვა',                  en:'Dance Wiggle',    short:'ცეკვა',      reps:16, dur:1.0, type:'rep',  tiny:true},
  {id:'frog',       ka:'ბაყაყივით ხტომა',        en:'Frog Jumps',      short:'ბაყაყი',    reps:14, dur:1.0, type:'rep',  tiny:true},
  {id:'flamingo',   ka:'ფლამინგო',               en:'Flamingo',        short:'ფლამინგო',  reps:15, dur:2.6, type:'hold', tiny:false}
];
let _mvList=MOVE_POOL;  // active list for the current break (filtered to tiny-safe moves for 3-4 yos)
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
// movement SESSION GOAL (owner 2026-07-04): the break used to be a passive player with no arc, no goal and
// no reward — the weakest section. Now it's a mini mission: finish _mvGoal distinct moves → celebration +
// coins, so movement earns its place like every other section. Additive: the per-move player is untouched.
let _mvGoal=3,_mvDone=null,_mvSessionDone=false;const MV_REWARD=3;
function closeBreak(){clearInterval(_mvTimer);_mvTimer=null;try{if(window.stopAudio)stopAudio();else speechSynthesis.cancel();}catch(e){}const el=document.getElementById('breakscr');if(el)el.remove();}
function showBreak(manual){
  if(document.getElementById('breakscr'))return;
  if(window.Analytics)Analytics.screen('movement');
  _mvList=isTiny(profile)?MOVE_POOL.filter(e=>e.tiny):MOVE_POOL;  // 3-4 yos: only the safe, simple moves
  // set the session goal BEFORE building the header (the header template reads ${_mvGoal} for its denominator)
  _mvGoal=Math.min(isTiny(profile)?3:5,_mvList.length);_mvDone=new Set();_mvSessionDone=false;
  const el=document.createElement('div');el.className='breakscreen mv2';el.id='breakscr';
  el.innerHTML=`
    <header class="mv-top">
      ${backBtn('closeBreak()')}
      <div class="who">მოძრაობის შესვენება<small>გავიმოძრაოთ ერთად 🙌</small></div>
      <div class="pill mv-goalpill" id="mvGoalPill">🎯 <b id="mvGoalN">0</b>/${_mvGoal}</div>
      <span id="mvProg" hidden>1</span><span id="mvPtot" hidden>${_mvList.length}</span>
    </header>
    <div class="scene" id="mvScene" data-move="squat" style="--dur:1.4s">
      <div class="room"></div><div class="cloud a"></div><div class="cloud b"></div><div class="cloud c"></div>
      <div class="mat"></div>
      <div class="chars" id="mvChars"></div>
      <div class="toast" id="mvToast">${tutorFace(profile,'1.3em')} ბრავო! 💛</div>
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
  _mvList.forEach((m,i)=>{const b=document.createElement('button');b.className='chip';b.dataset.i=i;
    b.innerHTML=`<span class="n">${i+1}</span><span class="t">${m.short}</span>`;b.onclick=()=>mvSelect(i);rail.appendChild(b);});
  el.querySelector('#mvPrev').onclick=()=>mvSelect(_mvIdx-1);
  el.querySelector('#mvNext').onclick=()=>mvSelect(_mvIdx+1);
  el.querySelector('#mvPlay').onclick=()=>mvSetPlay(!_mvPlaying);
  _mvIdx=0;_mvPlaying=true;_mvCount=0;
  mvRender();
}
// session complete: a distinct-move goal is reached → reward coins + a warm celebration overlay.
function mvSessionComplete(){
  if(_mvSessionDone)return; _mvSessionDone=true;
  try{const s=state[profile]; if(s){ s.shields=(s.shields||0)+MV_REWARD; if(typeof save==='function')save(); }}catch(e){}
  const el=document.getElementById('breakscr'); if(!el)return;
  const ov=document.createElement('div'); ov.className='mv-done-ov'; ov.id='mvDoneOv';
  ov.innerHTML=`<div class="mv-done-card">
    <div class="mv-done-em">🎉</div>
    <div class="mv-done-h">ბრავო! მოძრაობა დაასრულე</div>
    <div class="mv-done-rew">+${MV_REWARD} 🪙</div>
    <button class="btn btn-primary btn-block${(typeof isYoung==='function'&&isYoung(profile))?' tap-cue':''}" style="max-width:220px" onclick="(function(){var e=document.getElementById('mvDoneOv');if(e)e.remove();})()">${(typeof isYoung==='function'&&isYoung(profile))?`<span class="tap-finger" aria-hidden="true">👆</span><span class="tap-label">${waveText('კიდევ ერთი')} 💪</span>`:'კიდევ ერთი 💪'}</button>
    <button class="btn btn-ghost btn-block" style="max-width:220px" onclick="closeBreak()">მზად ვარ ✅</button>
  </div>`;
  el.appendChild(ov);
  try{ if(typeof confettiEl==='function') ov.appendChild(confettiEl()); }catch(e){}
  try{ praise(); }catch(e){}
}
function _mvFmt(s){const m=Math.floor(s/60),x=s%60;return m+':'+String(x).padStart(2,'0');}
function mvRender(){
  const el=document.getElementById('breakscr');if(!el)return;
  const m=_mvList[_mvIdx],sc=el.querySelector('#mvScene');
  sc.dataset.move=m.id;sc.style.setProperty('--dur',m.dur+'s');
  el.querySelector('#mvName').textContent=m.ka;el.querySelector('#mvEn').textContent=m.en.toUpperCase();
  try{ if(typeof playClipFor==='function') playClipFor(m.ka); }catch(e){}  // NB-10: voice the move NAME so a pre-reader HEARS which move to do (build-time ka clip)
  el.querySelector('#mvProg').textContent=_mvIdx+1;
  [...el.querySelectorAll('#mvRail .chip')].forEach((c,i)=>c.classList.toggle('on',i===_mvIdx));
  const chip=el.querySelector('#mvRail').children[_mvIdx];if(chip&&chip.scrollIntoView)chip.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});
  _mvCount=0;mvUpdateCount();mvRestartTimer();
}
function mvUpdateCount(){
  const el=document.getElementById('breakscr');if(!el)return;
  const m=_mvList[_mvIdx];
  if(m.type==='hold'){el.querySelector('#mvNow').textContent=_mvFmt(Math.max(0,m.reps-_mvCount));el.querySelector('#mvTot').textContent='';el.querySelector('#mvLbl').textContent=tx('დაიჭირე');}
  else{el.querySelector('#mvNow').textContent=_mvCount;el.querySelector('#mvTot').textContent='/'+m.reps;el.querySelector('#mvLbl').textContent=tx('გამეორება');}
  el.querySelector('#mvBar').style.width=(_mvCount/m.reps*100)+'%';
}
function mvRestartTimer(){
  clearInterval(_mvTimer);if(!_mvPlaying)return;
  const m=_mvList[_mvIdx],step=m.type==='hold'?1000:Math.round(m.dur*1000);
  _mvTimer=setInterval(()=>{_mvCount++;if(_mvCount>=m.reps){mvUpdateCount();mvCheer();_mvCount=0;setTimeout(mvUpdateCount,650);}else mvUpdateCount();},step);
}
function mvCheer(){
  const el=document.getElementById('breakscr');if(!el)return;
  const t=el.querySelector('#mvToast');if(t){t.classList.add('show');setTimeout(()=>t.classList.remove('show'),900);}
  try{praise();}catch(e){}   // voiced ბრავო/მართალია/შესანიშნავია (recorded clip, never garbled)
  // session goal: a move counts as DONE the first time its reps complete; hitting the goal fires the reward.
  if(_mvDone){
    const id=_mvList[_mvIdx]&&_mvList[_mvIdx].id;
    if(id&&!_mvDone.has(id)){
      _mvDone.add(id);
      const gn=el.querySelector('#mvGoalN'); if(gn)gn.textContent=Math.min(_mvDone.size,_mvGoal);
      const pill=el.querySelector('#mvGoalPill'); if(pill){pill.classList.add('bump');setTimeout(()=>{const p=document.getElementById('mvGoalPill');if(p)p.classList.remove('bump');},420);}
      if(_mvDone.size>=_mvGoal) mvSessionComplete();
    }
  }
}
function mvSelect(i){_mvIdx=(i+_mvList.length)%_mvList.length;mvRender();}
function mvSetPlay(p){const el=document.getElementById('breakscr');if(!el)return;_mvPlaying=p;el.querySelector('#mvScene').classList.toggle('paused',!p);el.querySelector('#mvPlay').textContent=p?'⏸':'▶';mvRestartTimer();}

