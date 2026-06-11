/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — "საუბარი და ფიქრი" / Talk & Think  (v1.110, 2026-06-11)
   totolino-style discussion cards: there is NO right answer; the card is a
   prompt for a parent⇄child conversation (emotional intelligence, values,
   imagination, reflection). Two decks:
     • ka — Georgian expression / values / identity (content stays Georgian)
     • en — light English talk practice (content stays English)
   No scoring, no win/lose. No runtime Georgian TTS (parent reads aloud);
   the EN deck offers an optional 🔊 (English voice is allowed).
   Self-contained: own `tl` state, reuses render/goHome. Chrome strings are
   Georgian + mirrored in i18n-strings.js so ka↔en toggle translates them.
   ═══════════════════════════════════════════════════════════ */

let tl = null; // {lang:'ka'|'en', i:int, deck:[]}

/* theme of each card — totolino's four the owner liked */
const TALK_THEMES = {
  think:   {ic:'🤔', label:'როგორ ფიქრობ?',       color:'var(--sky)'},
  imagine: {ic:'🦸', label:'თუ მე ვიქნებოდი',      color:'var(--purple)'},
  values:  {ic:'💛', label:'ღირებულებები',         color:'var(--green)'},
  bedtime: {ic:'🌙', label:'ძილისწინა საუბრები',    color:'var(--primary)'}
};
/* who asks (the app's characters: Niko the owl + Nikoloz + Masho) */
const TALK_CHARS = {
  owl:   {emoji:'🦉', say:'ნიკო ბუ გეკითხება'},
  niko:  {emoji:'👦🏻', say:'ნიკოლოზი გეკითხება'},
  masho: {emoji:'👧🏻', say:'მაშო გეკითხება'}
};

const TALK = {
  ka:[
    {theme:'think',   emoji:'☁️🍬', by:'owl',   q:'რა მოხდებოდა, ღრუბლები ტკბილეულისგან რომ ყოფილიყო? შენ რას გააკეთებდი?', subs:['ახლა შენ მოიგონე ერთი „რა მოხდება, თუ..." კითხვა.']},
    {theme:'imagine', emoji:'🦸',   by:'niko',  q:'ერთი დღით ზღაპრის გმირი რომ გამხდარიყავი, ვინ იქნებოდი? რას გააკეთებდი პირველად?', subs:['რა ძალა გექნებოდა და ვის დაეხმარებოდი?']},
    {theme:'values',  emoji:'🤝',   by:'masho', q:'დღეს ვინმეს დაეხმარე? როგორ იგრძენი თავი მერე?', subs:['ხვალ ვის შეგიძლია დაეხმარო?']},
    {theme:'bedtime', emoji:'🌙',   by:'owl',   q:'დღის ყველაზე სასიამოვნო წუთი რომელი იყო? ყველაზე რთული კი?', subs:['ხვალ რისი მოლოდინი გაქვს?']},
    {theme:'think',   emoji:'🐾',   by:'niko',  q:'ცხოველებს ლაპარაკი რომ შეეძლოთ, შენი საყვარელი ცხოველი რას გეტყოდა?', subs:[]},
    {theme:'values',  emoji:'🧒🧒', by:'masho', q:'რას ნიშნავს ნამდვილი მეგობარი? შენ როგორი მეგობარი ხარ?', subs:['მეგობართან თუ წაიჩხუბე, როგორ უხდი ბოდიშს?']}
  ],
  en:[
    {theme:'think',   emoji:'☁️🍬', by:'owl',   q:'What would happen if clouds were made of candy? What would you do?', subs:["Now you make up a 'What if...' question!"]},
    {theme:'imagine', emoji:'🦸',   by:'niko',  q:'If you were a superhero for one day, what would you do first?', subs:['What power would you have, and who would you help?']},
    {theme:'values',  emoji:'🤝',   by:'masho', q:'Did you help someone today? How did it feel?', subs:['Who can you help tomorrow?']},
    {theme:'bedtime', emoji:'🌙',   by:'owl',   q:'What made you smile today? What was a little hard?', subs:['What are you looking forward to?']},
    {theme:'think',   emoji:'🐾',   by:'niko',  q:'If animals could talk, what would your favorite animal say?', subs:[]},
    {theme:'values',  emoji:'🧒🧒', by:'masho', q:'What makes a real friend? Are you a good friend?', subs:['How do you say sorry to a friend?']}
  ]
};

/* ── entry: language chooser ── */
function openTalk(){
  if(window.Analytics)Analytics.screen('talk');
  render(`<div class="screen talk-pick">
    <button class="iconbtn talk-back" onclick="goHome()" aria-label="უკან">←</button>
    <div class="talk-hero"><div class="talk-hero-ic">💬</div>
      <h2>საუბარი და ფიქრი</h2>
      <p class="talk-lead">ერთად ისაუბრეთ. სწორი პასუხი არ არსებობს.</p></div>
    <div class="talk-decks">
      <button class="talk-deck ka" onclick="talkDeck('ka')"><span class="td-flag">🇬🇪</span><span class="td-name">ქართული საუბრები</span><span class="td-sub">${TALK.ka.length} ${UILANG==='en'?'cards':'ბარათი'}</span></button>
      <button class="talk-deck en" onclick="talkDeck('en')"><span class="td-flag">🇬🇧</span><span class="td-name">English talk</span><span class="td-sub">${TALK.en.length} ${UILANG==='en'?'cards':'ბარათი'}</span></button>
    </div>
  </div>`,false);
}

function talkDeck(lang){
  lang=(lang==='en')?'en':'ka';
  tl={lang, i:0, deck:TALK[lang]};
  if(window.Analytics)Analytics.screen('talk/'+lang);
  talkCard();
}

function talkCard(){
  if(!tl)return openTalk();
  const c=tl.deck[tl.i]; if(!c)return openTalk();
  const th=TALK_THEMES[c.theme]||TALK_THEMES.think;
  const ch=TALK_CHARS[c.by]||TALK_CHARS.owl;
  const subs=(c.subs&&c.subs.length)?`<div class="talk-subs"><span class="ts-lab">კიდევ ჰკითხე:</span> ${c.subs.join(' ')}</div>`:'';
  const dots=tl.deck.map((_,i)=>`<span class="tdot${i===tl.i?' on':''}"></span>`).join('');
  // Listen: KA plays the recorded edge-tts clip (v1.120, AUDIO_MANIFEST); EN uses the English voice.
  const listen=`<button class="btn btn-ghost talk-listen" onclick="talkSpeak()">🔊 ${UILANG==='en'?'Listen':'მოსმენა'}</button>`;
  render(`<div class="screen talk">
    <div class="talk-top">
      <button class="iconbtn talk-back" onclick="openTalk()" aria-label="უკან">←</button>
      <span class="talk-count">${tl.i+1} / ${tl.deck.length}</span>
      <button class="iconbtn talk-back" onclick="goHome()" aria-label="მთავარი">🏠</button>
    </div>
    <div class="talk-card" style="--tc:${th.color}">
      <div class="talk-theme"><span class="tt-ic">${th.ic}</span><b>${th.label}</b></div>
      <div class="talk-emoji">${c.emoji}</div>
      <div class="talk-q">${c.q}</div>
      ${subs}
      <div class="talk-by"><span class="tb-em">${ch.emoji}</span><span class="tb-say">${ch.say}</span></div>
    </div>
    ${listen}
    <div class="talk-nav">
      <button class="tnav" onclick="talkGo(-1)" ${tl.i===0?'disabled':''} aria-label="წინა">←</button>
      <span class="talk-dots">${dots}</span>
      <button class="tnav" onclick="talkGo(1)" ${tl.i===tl.deck.length-1?'disabled':''} aria-label="შემდეგი">→</button>
    </div>
    <div class="talk-note">ერთად ისაუბრეთ. სწორი პასუხი არ არსებობს.</div>
  </div>`,false);
}

function talkGo(d){
  if(!tl)return;
  const n=tl.i+d;
  if(n<0||n>=tl.deck.length)return;
  tl.i=n; talkCard();
}
function talkSpeak(){
  if(!tl)return;
  const c=tl.deck[tl.i]; if(!c)return;
  // KA: play the recorded clip (no runtime Georgian TTS). Missing clip → silent fallback, never garbled.
  if(tl.lang==='ka'){ try{ if(typeof playClip==='function') playClip(c.q); }catch(e){} return; }
  try{ if(typeof speak==='function') speak(c.q,'en-US',{rate:isYoung(profile)?0.8:0.92}); }catch(e){}
}
