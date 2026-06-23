/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — core: icons, state, helpers, levels, languages, TTS
   ═══════════════════════════════════════════════════════════ */


/* ── inline icons ── */
const I = {
  shield:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.6" fill="none" stroke="#fff" stroke-width="1.7" opacity="0.6"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3-2 4-2 7a2 2 0 104 0c0-1 1-2 1-2 2 2 3 4 3 7a6 6 0 11-12 0c0-4 3-6 4-9 1 0 2-2 2-3z"/></svg>',
  speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/><path d="M18.5 6a8 8 0 010 12"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/></svg>',
  abc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18l3.5-10L10 18M4 14.5h5"/><path d="M14 18V8h2.6a2.4 2.4 0 010 4.8H14m0 0h3a2.5 2.5 0 010 5.2h-3"/></svg>',
  calc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M8 15h2M14 11h2M14 15h2M12 11v0M12 15v0"/></svg>',
  privacy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5" fill="#fff"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>',
  spark:'✦'
};

/* ── state ── */
const SK='nikolearn_p2';
let state, profile, game={}, ai={role:'companion'};
const $=(s,r=document)=>r.querySelector(s);

function blankKid(){return{shields:0,streak:0,maxStreak:0,dayStreak:0,maxDayStreak:0,lastDay:null,todayMs:0,todayDate:null,words:{},sessions:0,math:{},best:{},lastPlayed:null,totalTime:0,dadMessages:[]};}
function load(){
  let s=null;try{s=JSON.parse(localStorage.getItem(SK));}catch{}
  if(!s)return def();
  if(!Array.isArray(s.kids))s.kids=[];
  // one-time cleanup: drop legacy seeded demo profiles so each parent sees only their own
  // (seed used ids 'niko'/'masho'; real profiles use 'k'+timestamp)
  s.kids=s.kids.filter(k=>k.id!=='niko'&&k.id!=='masho'); delete s.niko; delete s.masho;
  if(s.onboarded===undefined)s.onboarded=true;
  s.kids.forEach(k=>{if(!s[k.id])s[k.id]=blankKid();});
  if(!s.guest)s.guest=blankKid();
  return s;
}
function def(){return{
  onboarded:false,
  kids:[],
  guest:blankKid()
};}
function save(){try{localStorage.setItem(SK,JSON.stringify(state));}catch(e){/* private mode / quota: keep running on in-memory state */}}
/* ── real date-based day streak + per-day screen-time (truth pass v1.99) ── */
function todayStr(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function touchDay(p){
  const s=state[p];if(!s)return;
  const today=todayStr();
  if(s.lastDay!==today){
    const y=new Date();y.setDate(y.getDate()-1);
    s.dayStreak=(s.lastDay===todayStr(y))?((s.dayStreak||0)+1):1; // yesterday → continue, gap → restart at 1
    s.maxDayStreak=Math.max(s.maxDayStreak||0,s.dayStreak);
    s.lastDay=today;
  }
  if(s.todayDate!==today){s.todayMs=0;s.todayDate=today;} // reset today's screen-time at day rollover
  save();
}
// daily screen-time limit (parent-set, 0 = off). Enforced at session entry + end of each round.
function overLimit(p){
  const lim=state.screenLimitMin||0;if(!lim)return false;
  const s=state[p];if(!s||s.todayDate!==todayStr())return false;
  return (s.todayMs||0)>=lim*60000;
}
const AV_COLORS=['sky','primary','green','sun','purple'];
function kidObj(p){return ((state&&state.kids)||[]).find(k=>k.id===p)||(p==='guest'?{id:'guest',name:'სტუმარი',age:0,color:'green'}:{id:p,name:p,age:7,color:'sky'});}
function isYoung(p){const a=kidObj(p).age;return a>0&&a<=5;}
function isTiny(p){const a=kidObj(p).age;return a>0&&a<=4;} // pre-arithmetic: counting/alphabet/shapes only
function isBig(p){const a=kidObj(p).age;return a>=7;} // 7+ : harder math (division / missing-number / 2-digit) + faster celebration. Owner 2026-06-13: 7-8 yos need age-appropriate challenge.
/* ── D2 (v2.05): free vs paid scaffold. Default = everything UNLOCKED (free launch); the boundary is a
   previewable demo, never a hard-hide — premium content stays visible, just badged + parent-gated. ── */
function premiumOn(){return !state||state.premium!==false;}
const PREMIUM_SUBJ=['kings-eng','kings-math']; // example paid tier: Kings / Cambridge / olympiad exam prep
function isPremiumSubj(subj){return PREMIUM_SUBJ.indexOf(subj)>=0;}
// FREEMIUM PREVIEW (owner 2026-06-23): when premium is OFF, a premium subject is NOT hard-walled — its menu
// opens so the parent SEES every topic (transparency), with a few "taster" modes playable free + the Kings
// test as the hook; the rest are badged 🔒 and tap → upsell. The headline test (`kings`) is free everywhere.
// NOTE: premium defaults ON, so by default EVERYTHING is open (free launch + the owner's universal test access);
// this split only takes effect in the "preview the free version" demo. Free/paid split = [HYPOTHESIS], demo-only.
const FREE_PREVIEW_MODES={'kings-eng':['kings','quiz','listen'],'kings-math':['kings','pattern']};
function isFreeMode(subj,m){ return premiumOn() || m==='kings' || (FREE_PREVIEW_MODES[subj]||[]).indexOf(m)>=0; }
// ── Kings = Cambridge YLE level ladder (1 Starters / 2 Movers / 3 Flyers), owner 2026-06-22.
// Defaults to the child's age band; the parent/child can override in the Kings menu. Stored per profile.
function kingsLevel(p){p=p||profile;const s=state&&state[p];if(s&&s.kingsLevel)return s.kingsLevel;const a=(kidObj(p).age)||7;return a>=9?3:a>=8?2:1;}
function setKingsLevel(n){n=Math.max(1,Math.min(3,n|0));if(state&&state[profile]){state[profile].kingsLevel=n;save();}}
function kLevelName(n){return n>=3?'Flyers':n>=2?'Movers':'Starters';}
/* ── tutor animal (O1): the child picks who teaches them; visual only, voice unchanged ── */
const TUTOR_ANIMALS=['🦉','🐱','🦁','🐶','🐰','🐼','🦊','🐵'];
function tutorAva(p){const k=kidObj(p);return (k&&k.tutor)||'🦉';}
// Display face for the tutor. The DEFAULT owl renders as the brand mascot image (owl-logo.png) instead of
// the flat 🦉 emoji, so the tutor everywhere matches the app's owl branding (owner 2026-06-13). A kid who
// picked a different animal (🦊🐱…) still gets that emoji. Pass a CSS size for inline contexts; omit it to
// let the container size the image via the .owl-face CSS rules. (Selection grids keep the raw emoji.)
function tutorFace(p,size){
  const a=tutorAva(p);
  if(a!=='🦉')return a;
  const sz=size?`width:${size};height:${size};`:'';
  return `<img src="owl-logo.png" alt="ბუ" class="owl-face" style="${sz}object-fit:contain;display:inline-block;vertical-align:middle">`;
}
function setTutor(p,emoji){const k=kidObj(p);if(k){k.tutor=emoji;save();}}

/* ── voicing language (F5): pick ka vs en for spoken praise/numbers/words, ANY time.
   SAFE rule: never read Georgian-only text with an English voice — ka uses recorded
   clips, en uses the device English voice + English equivalents. ── */
function voiceLang(p){const k=kidObj(p);return (k&&k.voice)?k.voice:(knows(p,'en')?'en':'ka');}
function setVoice(p,l){const k=kidObj(p);if(k){k.voice=(l==='en')?'en':'ka';save();}}
function vCode(p){return voiceLang(p)==='en'?'en-US':'ka-GE';}
const EN_NUM=['','one','two','three','four','five','six','seven','eight','nine','ten'];
function numWord(n,p){return voiceLang(p)==='en'?(EN_NUM[n]||String(n)):String(n);} // ka digit → recorded clip
function retryWord(p){return voiceLang(p)==='en'?'try again':'კიდევ სცადე.';}
function voiceToggleBtn(){return `<button class="vtgl" onclick="toggleVoice(event)" aria-label="გახმოვანების ენა" title="გახმოვანების ენა">🔊 ${voiceLang(profile)==='en'?'ENG':'ქარ'}</button>`;}
function toggleVoice(e){if(e)e.stopPropagation();setVoice(profile,voiceLang(profile)==='en'?'ka':'en');document.querySelectorAll('.vtgl').forEach(b=>{b.innerHTML='🔊 '+(voiceLang(profile)==='en'?'ENG':'ქარ');});}
function catsFor(p){return isYoung(p)?AGE_CATS.masho:AGE_CATS.niko;}
function demoNiko(){ // seeded so the prototype shows realistic data
  const k=blankKid();k.shields=148;k.streak=6;k.maxStreak=11;k.sessions=23;k.lastPlayed=new Date().toISOString();k.totalTime=3600000*2.4;
  ['red','blue','green','dog','cat','apple','book','sun','star','mother','father','horse','fish','milk','tree'].forEach(w=>k.words[w]={correct:4,wrong:0});
  ['lion','elephant','pencil','cheese','moon','flower','rabbit'].forEach(w=>k.words[w]={correct:3,wrong:0});
  ['rain','snow','bag','teacher','grandmother'].forEach(w=>k.words[w]={correct:1,wrong:3});
  k.math={'math-add':{correct:54,wrong:6},'math-sub':{correct:38,wrong:9},'math-mul':{correct:22,wrong:14}};
  k.best={quiz:9,'kings-eng':10,'kings-math':8,'math-add':10};
  k.dadMessages=[
    {date:new Date(Date.now()-3600000*5).toLocaleString('ka-GE'),text:'🏅 ნიკოლოზი ახალ დონეზე გავიდა: 🚀 მოსწავლე!'},
    {date:new Date(Date.now()-86400000).toLocaleString('ka-GE'),text:'ნიკოლოზმ Kings English-ში 10 🪙 მოაგროვა (100%)!'}
  ];
  return k;
}

/* ── render helpers ── */
function render(html,nav){
  $('#app').innerHTML=html;
  if(window.applyLang)applyLang($('#app'));
  $('#app').scrollTop=0;
  document.body.classList.remove('on-landing');
  const n=$('#bottomnav');
  if(nav){ n.classList.remove('hidden'); n.classList.toggle('slim', nav==='slim'); setNav(nav==='slim'?'':nav); }
  else { n.classList.add('hidden'); n.classList.remove('slim'); }
  syncAiFab();
}
function setNav(active){
  $('#bottomnav').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.nav===active));
}
function topbar(title,sub,back){
  const s=state[profile]||{shields:0,dayStreak:0};
  // Day-streak chip is a return-pressure mechanic. Developmentally inappropriate for under-6
  // (Duolingo Kids removed child-side streaks for the same reason). Show only for age>=6;
  // this also hides it for the guest profile (age 0). The streak data still tracks silently
  // (parent dashboard can still use it) — we only suppress the child-facing pressure cue.
  const showStreak=kidObj(profile).age>=6;
  return `<div class="topbar">
    ${back?`<button class="iconbtn" onclick="${back}">←</button>`:''}
    <div class="who">${title}${sub?`<small>${sub}</small>`:''}</div>
    <div class="chips">
      ${voiceToggleBtn()}
      <span class="chip shield">🪙<span class="num">${s.shields}</span></span>
      ${showStreak?`<span class="chip streak" title="დღის სერია">${I.flame}<span class="num">${s.dayStreak||0}</span></span>`:''}
    </div>
  </div>`;
}
function nameOf(p){return kidObj(p).name;}
function voc(){if(profile==='niko')return'ნიკოლოზ';if(profile==='masho')return'მაშო';if(profile==='guest')return'მეგობარ';return nameOf(profile);}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function ri(a,b){return a+Math.floor(Math.random()*(b-a+1));}
// brief visual pulse when a child taps something (so silent taps still give feedback)
function pulseTap(el){if(!el)return;el.classList.remove('tapped');void el.offsetWidth;el.classList.add('tapped');}
// reveal text letter-by-letter ("writing" effect) into an element
function spellOut(el,text,opts){
  if(!el)return;opts=opts||{};
  clearInterval(el._tw);el.textContent='';el.classList.add('typing');
  const chars=[...String(text)];let i=0;
  el._tw=setInterval(()=>{
    if(i>=chars.length){clearInterval(el._tw);el._tw=null;el.classList.remove('typing');return;}
    el.textContent+=chars[i++];
  },opts.speed||150);
}

/* ── levels (YLE proxy) ── */
const LEVELS=[{n:'დამწყები',ic:'🐣',need:8},{n:'მზარდი',ic:'🌱',need:20},{n:'მსწავლელი',ic:'🚀',need:40},{n:'მკვლევარი',ic:'⭐',need:60},{n:'ჩემპიონი',ic:'🏆',need:999}];
function levelOf(p){
  const s=state[p];const learned=Object.values(s.words).filter(w=>w.correct>=3).length;
  let i=0;for(;i<LEVELS.length-1;i++){if(learned<LEVELS[i].need)break;}
  const cur=LEVELS[i],prev=i>0?LEVELS[i-1].need:0;
  return{name:cur.n,ic:cur.ic,learned,need:cur.need,pct:cur.need>=999?100:Math.round(((learned-prev)/(cur.need-prev))*100)};
}
function levelIdx(p){const n=levelOf(p).name;return LEVELS.findIndex(x=>x.n===n);}

/* ── languages the child KNOWS (drives instruction/voicing language) ── */
function kidLangs(p){const k=kidObj(p);if(Array.isArray(k.langs)&&k.langs.length)return k.langs;return isYoung(p)?['ka']:['ka','en'];}
function knows(p,c){return kidLangs(p).includes(c);}
const LANG_CODE={ka:'ka-GE',en:'en-US',ru:'ru-RU'};
function instrCode(p){const ls=kidLangs(p);const c=ls.includes('ka')?'ka':ls[0];return LANG_CODE[c]||'ka-GE';}

/* ── TTS ── */
function pickVoice(lang){
  const vs=speechSynthesis.getVoices();
  if(lang&&lang.startsWith('ka')){return vs.find(x=>x.lang.startsWith('ka'))||null;} // ka-gate: never substitute ru/en for Georgian
  if(lang&&lang.startsWith('ru')){return vs.find(x=>x.lang.startsWith('ru'))||null;}
  const warmEn=['Samantha','Karen','Moira','Tessa','Google US English','Microsoft Aria','Microsoft Jenny','Fiona'];
  for(const n of warmEn){const v=vs.find(x=>x.name.includes(n)&&x.lang.startsWith('en'));if(v)return v;}
  return vs.find(x=>x.lang.startsWith('en'))||null;
}
// young children need a noticeably slower, calmer pace
// English words are spoken a touch slower so a child hears each sound clearly (owner 2026-06-13: Kings/Listen
// felt too fast). ka stays slow as before. (0.72 base for en, 0.6 for ka; younger kids slower still.)
function defaultRate(lang){const slow=isYoung(profile)?0.86:1;return (lang&&lang.startsWith('ka')?0.6:0.72)*slow;}
function speakOne(t,lang,opts){
  if(!('speechSynthesis'in window)||!t)return;
  // central ka gate: by here no recorded clip exists (audio.js handles clips first). With no real
  // device ka voice, stay SILENT rather than read Georgian with an en/ru voice (garbled "kochar").
  if((lang||'').slice(0,2)==='ka' && (typeof hasVoiceFor!=='function' || !hasVoiceFor('ka'))) return;
  const u=new SpeechSynthesisUtterance(t);
  u.lang=lang||'en-US';
  u.rate=(opts&&opts.rate!=null)?opts.rate:defaultRate(u.lang);
  u.pitch=u.lang.startsWith('ka')?1.04:1.1;u.volume=0.85; // softened 2026-06-22 (owner: a bit too loud for kids)
  const v=pickVoice(u.lang);if(v)u.voice=v;
  speechSynthesis.speak(u);
}
// iOS Safari sometimes leaves speechSynthesis stuck in a paused state after many utterances, so new
// speak() calls go silent until reload (owner 2026-06-15: "didn't say the words"). resume() unsticks it
// and is a harmless no-op when not paused.
function speak(t,lang,opts){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();try{speechSynthesis.resume();}catch(e){}speakOne(t,lang,opts);}
// queue several utterances back-to-back, e.g. Georgian then English
function speakSeq(parts){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();parts.forEach(p=>speakOne(p.t,p.lang,p.rate!=null?{rate:p.rate}:null));}
// say an English word, but for a child who only speaks Georgian, give the meaning first
function sayWord(ka,en){if(voiceLang(profile)==='en')speak(en,'en-US');else speakSeq([{t:ka,lang:'ka-GE'},{t:en,lang:'en-US'}]);}
function praise(){ // warm spoken encouragement in the chosen voicing language
  const code=vCode(profile);
  // ka praise pool widened 2026-06-22 (was just 4 words → felt repetitive). Every word here has a
  // recorded clip in AUDIO_MANIFEST (ბრავო/მართალია/შესანიშნავია/ყოჩაღ + the prs_* set), so it is
  // actually SPOKEN on devices with no Georgian TTS voice instead of falling back to English.
  const sets={'ka-GE':['ბრავო','მართალია','შესანიშნავია','ყოჩაღ','ზუსტად','სწორია','ძალიან კარგი','გენიოსი ხარ','გაიხარე','აი, ასე'],'ru-RU':['молодец','отлично','верно'],'en-US':['well done','great job','you did it','nice work','excellent','perfect','clever','bravo']};
  const list=sets[code]||sets['ka-GE'];
  let word=list[ri(0,list.length-1)], useCode=code;
  // NEVER read Georgian/Russian with an English voice (it sounds like garbage, e.g. „ყოჩაღ"→"kochas").
  // If there's no recorded clip AND no real device voice for the language, praise in English instead —
  // the English voice says it correctly and the app teaches English anyway.
  const clip=window.AUDIO_MANIFEST&&window.AUDIO_MANIFEST[(word||'').toLowerCase()];
  if(code!=='en-US' && !clip && (typeof hasVoiceFor!=='function' || !hasVoiceFor(code))){
    const en=sets['en-US']; word=en[ri(0,en.length-1)]; useCode='en-US';
  }
  speak(word,useCode);
}
if('speechSynthesis'in window)speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices();

