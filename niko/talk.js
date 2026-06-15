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
    {theme:'values',  emoji:'🧒🧒', by:'masho', q:'რას ნიშნავს ნამდვილი მეგობარი? შენ როგორი მეგობარი ხარ?', subs:['მეგობართან თუ წაიჩხუბე, როგორ უხდი ბოდიშს?']},
    // v1.136 — Talk & Think expansion #2 (clips tlk_006-011)
    {theme:'think',   emoji:'🎨',   by:'owl',   q:'რომელი ფერი ხარ დღეს და რატომ?', subs:['ხვალ რომელი ფერი გინდა იყო?']},
    {theme:'imagine', emoji:'🚪✨', by:'niko',  q:'ჯადოსნური კარი რომ გქონდეს, სად გახვიდოდი?', subs:['ვის წაიყვანდი თან?']},
    {theme:'values',  emoji:'😊',   by:'masho', q:'რა გაგახარა დღეს ყველაზე მეტად?', subs:['შენ ვინ გაახარე?']},
    {theme:'bedtime', emoji:'📚',   by:'owl',   q:'დღეს რა ისწავლე ახალი?', subs:['ვის უამბობ ამის შესახებ?']},
    {theme:'think',   emoji:'👟',   by:'niko',  q:'ნივთები რომ ლაპარაკობდნენ, შენი ფეხსაცმელი რას იტყოდა?', subs:[]},
    {theme:'values',  emoji:'🦁',   by:'masho', q:'რას ნიშნავს გამბედავი? შენ როდის იყავი გამბედავი?', subs:['ვინ არის შენთვის ყველაზე გამბედავი?']},
    // v1.162 — Talk & Think expansion #3 (15 quirkier prompts; clips tlk_012-026)
    {theme:'think',   emoji:'🧦', by:'niko',  q:'წინდები რომ ქრებიან, სად მიდიან, როგორ ფიქრობ?', subs:[]},
    {theme:'imagine', emoji:'🐲', by:'owl',   q:'ჯიბეში პატარა დრაკონი რომ გეპოვა, რა დაარქმევდი და რას აჭმევდი?', subs:['სად დაამალავდი, რომ არავის შეეშინდეს?']},
    {theme:'values',  emoji:'🛝', by:'masho', q:'ეზოში ახალი ბავშვი მარტო დგას — შენ რას იზამდი?', subs:[]},
    {theme:'bedtime', emoji:'⭐', by:'owl',   q:'ცის ერთ ვარსკვლავს ქილაში რომ დაიჭერდი, მის შუქს რას უზამდი?', subs:['ბნელ ოთახში რას გააკეთებდი იმ შუქით?']},
    {theme:'think',   emoji:'🦸', by:'niko',  q:'ყველაზე სასაცილო ზესძალა რომელი იქნებოდა?', subs:[]},
    {theme:'imagine', emoji:'🏠', by:'masho', q:'სახლი ფეხებზე რომ დადიოდეს, სასეირნოდ სად წავიდოდა?', subs:[]},
    {theme:'values',  emoji:'🌍', by:'owl',   q:'მთელ მსოფლიოს ერთ წესს რომ უყენებდე, რა იქნებოდა?', subs:['ეს წესი შენც მოგეწონებოდა?']},
    {theme:'think',   emoji:'🌧️', by:'niko',  q:'წვიმას გემო რომ ჰქონდეს, რა გემოს ისურვებდი?', subs:[]},
    {theme:'imagine', emoji:'🫥', by:'owl',   q:'ერთი საათით უჩინარი რომ გამხდარიყავი, რას გააკეთებდი?', subs:['ვის უჩუმრად დაეხმარებოდი?']},
    {theme:'bedtime', emoji:'🎬', by:'masho', q:'დღევანდელი სიზმარი ფილმი რომ ყოფილიყო, რაზე იქნებოდა?', subs:[]},
    {theme:'think',   emoji:'🐜', by:'owl',   q:'ერთი დღით ჭიანჭველასავით პატარა იქნებოდი თუ შენობასავით დიდი? რატომ?', subs:['რა ნახავდი, რასაც ახლა ვერ ხედავ?']},
    {theme:'values',  emoji:'😄', by:'masho', q:'მეგობარი მოწყენილია — როგორ გააცინებდი?', subs:[]},
    {theme:'imagine', emoji:'🎉', by:'niko',  q:'ახალ დღესასწაულს რომ მოიგონებდი, ხალხი იმ დღეს რას აკეთებდა?', subs:['რა იქნებოდა დღესასწაულის სახელი?']},
    {theme:'think',   emoji:'🙃', by:'niko',  q:'დილით რომ გაიღვიძებდი და ყველაფერი თავდაყირა იყო, რას იზამდი?', subs:[]},
    {theme:'bedtime', emoji:'💬', by:'owl',   q:'ძილის წინ დღეს ერთ სიტყვას რომ ეტყოდი, რას ეტყვი?', subs:[]}
  ],
  en:[
    {theme:'think',   emoji:'☁️🍬', by:'owl',   q:'What would happen if clouds were made of candy? What would you do?', subs:["Now you make up a 'What if...' question!"]},
    {theme:'imagine', emoji:'🦸',   by:'niko',  q:'If you were a superhero for one day, what would you do first?', subs:['What power would you have, and who would you help?']},
    {theme:'values',  emoji:'🤝',   by:'masho', q:'Did you help someone today? How did it feel?', subs:['Who can you help tomorrow?']},
    {theme:'bedtime', emoji:'🌙',   by:'owl',   q:'What made you smile today? What was a little hard?', subs:['What are you looking forward to?']},
    {theme:'think',   emoji:'🐾',   by:'niko',  q:'If animals could talk, what would your favorite animal say?', subs:[]},
    {theme:'values',  emoji:'🧒🧒', by:'masho', q:'What makes a real friend? Are you a good friend?', subs:['How do you say sorry to a friend?']},
    // v1.136 — Talk & Think expansion #2 (English deck; runtime English voice)
    {theme:'think',   emoji:'🎨',   by:'owl',   q:'What color are you today, and why?', subs:['What color do you want to be tomorrow?']},
    {theme:'imagine', emoji:'🚪✨', by:'niko',  q:'If you had a magic door, where would it open?', subs:['Who would you take with you?']},
    {theme:'values',  emoji:'😊',   by:'masho', q:'What made you happiest today?', subs:['Who did you make happy?']},
    {theme:'bedtime', emoji:'📚',   by:'owl',   q:'What new thing did you learn today?', subs:['Who will you tell about it?']},
    {theme:'think',   emoji:'👟',   by:'niko',  q:'If your shoes could talk, what would they say?', subs:[]},
    {theme:'values',  emoji:'🦁',   by:'masho', q:"What does 'brave' mean? When were you brave?", subs:['Who is the bravest person you know?']},
    // v1.162 — Talk & Think expansion #3 (English deck; runtime English voice)
    {theme:'think',   emoji:'🧦', by:'niko',  q:'Where do you think socks go when they disappear?', subs:[]},
    {theme:'imagine', emoji:'🐲', by:'owl',   q:'If you found a tiny dragon in your pocket, what would you name it and feed it?', subs:['Where would you hide it so no one gets scared?']},
    {theme:'values',  emoji:'🛝', by:'masho', q:'A new kid is standing alone at the playground. What would you do?', subs:[]},
    {theme:'bedtime', emoji:'⭐', by:'owl',   q:'If you caught one star from the sky in a jar, what would you do with its light?', subs:['What would you do with that light in a dark room?']},
    {theme:'think',   emoji:'🦸', by:'niko',  q:'What would be the silliest superpower to have?', subs:[]},
    {theme:'imagine', emoji:'🏠', by:'masho', q:'If your house could walk on legs, where would it go for a stroll?', subs:[]},
    {theme:'values',  emoji:'🌍', by:'owl',   q:'If you could make one rule for the whole world, what would it be?', subs:['Would you like following that rule too?']},
    {theme:'think',   emoji:'🌧️', by:'niko',  q:'If rain had a taste, what flavor would you want?', subs:[]},
    {theme:'imagine', emoji:'🫥', by:'owl',   q:'If you could be invisible for one hour, what would you do?', subs:['Who would you secretly help?']},
    {theme:'bedtime', emoji:'🎬', by:'masho', q:"If tonight's dream were a movie, what would it be about?", subs:[]},
    {theme:'think',   emoji:'🐜', by:'owl',   q:'For one day, would you be tiny like an ant or huge like a building? Why?', subs:["What would you see that you can't see now?"]},
    {theme:'values',  emoji:'😄', by:'masho', q:'A friend is feeling sad. How would you make them laugh?', subs:[]},
    {theme:'imagine', emoji:'🎉', by:'niko',  q:'If you invented a new holiday, what would people do on that day?', subs:['What would the holiday be called?']},
    {theme:'think',   emoji:'🙃', by:'niko',  q:'If you woke up and everything was upside down, what would you do?', subs:[]},
    {theme:'bedtime', emoji:'💬', by:'owl',   q:'If you could say one word to today before sleep, what would it be?', subs:[]}
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
  // shuffle a COPY each entry so the (still small) set feels fresh and isn't always in the same order
  // (owner 2026-06-13). Never mutate the source TALK array. shuffle() is the global Fisher-Yates helper.
  const deck=(typeof shuffle==='function')?shuffle(TALK[lang].slice()):TALK[lang].slice();
  tl={lang, i:0, deck};
  // UNIFY language controls (owner 2026-06-13): picking a deck also sets the global UI language, so the
  // ka/en deck choice and the top-right EN/ქარ toggle never disagree. tl is set first → the lang-change
  // listener below sees tl.lang already == new lang and no-ops (no double render).
  if(typeof setUILang==='function' && window.UILANG!==lang) setUILang(lang);
  if(window.Analytics)Analytics.screen('talk/'+lang);
  talkCard();
}
// When the global EN/ქარ toggle flips WHILE viewing a Talk card, switch the card to that language too
// (owner 2026-06-13: the toggle „didn't translate the text" — Talk content is per-deck, so we re-deck here).
window.addEventListener('niko-lang-change', function(){
  if(!tl) return;
  if(!document.querySelector('.screen.talk')) return;          // only act while a Talk card is on screen
  const lang=(window.UILANG==='en')?'en':'ka';
  if(lang===tl.lang) return;
  const deck=(typeof shuffle==='function')?shuffle(TALK[lang].slice()):TALK[lang].slice();
  tl={lang, i:0, deck};
  talkCard();
});

function talkCard(){
  if(!tl)return openTalk();
  const c=tl.deck[tl.i]; if(!c)return openTalk();
  const th=TALK_THEMES[c.theme]||TALK_THEMES.think;
  const ch=TALK_CHARS[c.by]||TALK_CHARS.owl;
  const subs=(c.subs&&c.subs.length)?`<div class="talk-subs"><span class="ts-lab">კიდევ ჰკითხე:</span> ${c.subs.join(' ')}</div>`:'';
  // progress bar (scales to ANY deck size; the old per-card dot row overflowed once the deck grew to 27,
  // pushing the „next" button off-screen — owner 2026-06-14). Position is also shown as the „N / total" count.
  const prog=Math.round((tl.i+1)/tl.deck.length*100);
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
      <button class="tnav" onclick="talkGo(-1)" ${tl.i===0?'disabled':''} aria-label="წინა">← ${UILANG==='en'?'Back':'წინა'}</button>
      <div class="talk-prog" aria-hidden="true"><i style="width:${prog}%"></i></div>
      <button class="tnav" onclick="talkGo(1)" ${tl.i===tl.deck.length-1?'disabled':''} aria-label="შემდეგი">${UILANG==='en'?'Next':'შემდეგი'} →</button>
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
