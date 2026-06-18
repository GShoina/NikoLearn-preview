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
  bedtime: {ic:'🌙', label:'ძილისწინა საუბრები',    color:'var(--primary)'},
  // v1.188 — ფანტაზიის კუთხე batch 1 (owner-approved 2026-06-17, Gemini-QA'd)
  impossible:{ic:'🚀', label:'შეუძლებელი ისტორია', color:'var(--sky)'},
  finish:    {ic:'🖍️', label:'დაასრულე ამბავი',    color:'var(--green)'},
  whatif:    {ic:'🦄', label:'რა მოხდებოდა თუ...',   color:'var(--purple)'},
  theater:   {ic:'🎭', label:'წარმოსახვის თეატრი',   color:'var(--sun)'},
  poem:      {ic:'🐸', label:'სასაცილო ლექსი',        color:'var(--green)'},
  // v1.193 — ჟანრების კუთხე (curriculum-mined: ESG ქართ. ენა-ლიტ. „მხატვრული ჟანრები"). open-ended, Talk-engine.
  tale:      {ic:'🏰', label:'ზღაპრის გაგრძელება',    color:'var(--purple)'},
  fable:     {ic:'🐢', label:'პატარა იგავი',          color:'var(--sun)'}
};
/* who asks (the app's characters: Niko the owl + Nikoloz + Masho) */
const TALK_CHARS = {
  owl:   {emoji:'🦉', img:'owl-logo.png', say:'ნიკო ბუ გეკითხება'}, // v1.191 — owl = the brand mascot image, not the grey emoji
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
    {theme:'imagine', emoji:'🐲', by:'owl',   q:'ჯიბეში პატარა დრაკონი რომ გეპოვა, რას დაარქმევდი და რას აჭმევდი?', subs:['სად დაამალავდი, რომ არავის შეეშინდეს?']},
    {theme:'values',  emoji:'🛝', by:'masho', q:'ეზოში ახალი ბავშვი მარტო დგას. შენ რას იზამდი?', subs:[]},
    {theme:'bedtime', emoji:'⭐', by:'owl',   q:'ცის ერთ ვარსკვლავს ქილაში რომ დაიჭერდი, მის შუქს რას უზამდი?', subs:['ბნელ ოთახში რას გააკეთებდი იმ შუქით?']},
    {theme:'think',   emoji:'🦸', by:'niko',  q:'ყველაზე სასაცილო ზებუნებრივი ძალა რომელი იქნებოდა?', subs:[]},
    {theme:'imagine', emoji:'🏠', by:'masho', q:'სახლი ფეხებზე რომ დადიოდეს, სასეირნოდ სად წავიდოდა?', subs:[]},
    {theme:'values',  emoji:'🌍', by:'owl',   q:'მთელ მსოფლიოს ერთ წესს რომ უყენებდე, რა იქნებოდა?', subs:['ეს წესი შენც მოგეწონებოდა?']},
    {theme:'think',   emoji:'🌧️', by:'niko',  q:'წვიმას გემო რომ ჰქონდეს, რა გემოს ისურვებდი?', subs:[]},
    {theme:'imagine', emoji:'🫥', by:'owl',   q:'ერთი საათით უჩინარი რომ გამხდარიყავი, რას გააკეთებდი?', subs:['ვის უჩუმრად დაეხმარებოდი?']},
    {theme:'bedtime', emoji:'🎬', by:'masho', q:'დღევანდელი სიზმარი ფილმი რომ ყოფილიყო, რაზე იქნებოდა?', subs:[]},
    {theme:'think',   emoji:'🐜', by:'owl',   q:'ერთი დღით ჭიანჭველასავით პატარა იქნებოდი თუ შენობასავით დიდი? რატომ?', subs:['რა ნახავდი, რასაც ახლა ვერ ხედავ?']},
    {theme:'values',  emoji:'😄', by:'masho', q:'მეგობარი მოწყენილია. როგორ გააცინებდი?', subs:[]},
    {theme:'imagine', emoji:'🎉', by:'niko',  q:'ახალ დღესასწაულს რომ მოიგონებდი, ხალხი იმ დღეს რას აკეთებდა?', subs:['რა იქნებოდა დღესასწაულის სახელი?']},
    {theme:'think',   emoji:'🙃', by:'niko',  q:'დილით რომ გაიღვიძებდი და ყველაფერი თავდაყირა იყოს, რას იზამდი?', subs:[]},
    {theme:'bedtime', emoji:'💬', by:'owl',   q:'ძილის წინ დღეს ერთ სიტყვას რომ ეტყოდი, რას ეტყვი?', subs:[]},
    // v1.186 — Talk & Think expansion #4 (6 new; clips tlk_027-032) → deck = 33
    {theme:'imagine', emoji:'🐙', by:'owl',   q:'ზღვის ფსკერზე ერთ დღეს რომ გაატარებდი, ვის შეხვდებოდი?', subs:['რას უამბობდი იქაურ თევზებს?']},
    {theme:'values',  emoji:'🤲', by:'masho', q:'მარტო და მოწყენილი ბავშვი რომ დაინახო, რას ეტყოდი?', subs:[]},
    {theme:'think',   emoji:'🎵', by:'niko',  q:'ფერებს ხმა რომ ჰქონდეთ, წითელი როგორ იჟღერებდა?', subs:[]},
    {theme:'bedtime', emoji:'🛏️', by:'owl',   q:'დღეს რა გააკეთე ისეთი, რითაც ამაყობ?', subs:['ხვალ რისი გაკეთება გინდა?']},
    {theme:'imagine', emoji:'🎈', by:'masho', q:'ბევრი ბუშტი რომ აგაფრენდა ცაში, პირველად სად გაფრინდებოდი?', subs:[]},
    {theme:'values',  emoji:'🌱', by:'niko',  q:'ხვალ ერთ კეთილ საქმეს რომ გააკეთებდი, რა იქნებოდა?', subs:[]},
    // ── v1.188 ფანტაზიის კუთხე batch 1 — 11 voiced cards (clips tlk_033-043) + 2 poems (7+, no audio) ──
    {theme:'impossible', emoji:'🌙⭐', by:'owl',  q:'ერთ დილას მზე დაიღალა და დაიძინა. ცაში მხოლოდ ერთი პატარა ვარსკვლავი დარჩა. რა მოხდა მერე?', subs:[]},
    {theme:'impossible', emoji:'🐟',   by:'niko', q:'თევზს ფეხები ამოუვიდა და ხმელეთზე გამოვიდა სასეირნოდ. პირველად ვის შეხვდა?', subs:[]},
    {theme:'impossible', emoji:'🧸',   by:'masho',q:'ღამით სათამაშოები გაცოცხლდნენ და სამზარეულოში დიდი წვეულება გამართეს. რა მოამზადეს?', subs:[]},
    {theme:'finish',     emoji:'☁️🎨', by:'owl',  q:'პატარა ღრუბელს ცისარტყელის დახატვა უნდოდა, მაგრამ მხოლოდ ლურჯი საღებავი ჰქონდა. ამიტომ მან...', subs:[]},
    {theme:'finish',     emoji:'🐜',   by:'niko', q:'ჭიანჭველამ უზარმაზარი ნამცეცი იპოვა და სახლში წაღება მოინდომა. გზად კი...', subs:[]},
    {theme:'whatif',     emoji:'🌗',   by:'owl',  q:'რა მოხდებოდა, შენი ჩრდილი შენგან რომ გაქცეულიყო და თვითონ ეცეკვა?', subs:[]},
    {theme:'whatif',     emoji:'📚',   by:'masho',q:'რა მოხდებოდა, წიგნებს ზღაპრების ხმამაღლა კითხვა რომ შეძლებოდათ მაშინ, როცა მათ არავინ უსმენს?', subs:[]},
    {theme:'whatif',     emoji:'🌧️',  by:'niko', q:'რა მოხდებოდა, წვიმის წვეთები ზევით, ცისკენ რომ ცვიოდნენ?', subs:[]},
    {theme:'theater',    emoji:'☁️',   by:'owl',  q:'წარმოიდგინე, რომ პატარა ღრუბელი ხარ. მაჩვენე, როგორ მოძრაობ, როცა ქარი გიბერავს.', subs:[]},
    {theme:'theater',    emoji:'🐱❄️', by:'masho',q:'წარმოიდგინე, რომ მამაცი კატა ხარ, რომელმაც პირველად ნახა თოვლი. რას იზამ?', subs:[]},
    {theme:'theater',    emoji:'🤖',   by:'niko', q:'გახდი რობოტი, რომელმაც ახლახან ისწავლა სიცილი. როგორ იცინი?', subs:[]},
    // v1.192 (owner 2026-06-17): one verse-line per \n (split crammed lines), em-dash → hyphen. Audio (tlk_044/045) unaffected (text-only).
    {theme:'poem', min:5, emoji:'🐸',  q:'ბაყაყმა იყიდა წითელი ჩექმა,\nტბაში აღარ შედის - ნახეთ, როგორ მოიქცა!\nდადის და ტრაბახობს: „ვინ მნახა ასეთი -\nფეხსაცმელიანი ბაყაყი ერთადერთი!"', subs:[]},
    {theme:'poem', min:5, emoji:'🐭',  q:'საათში თაგვი ცხოვრობდა,\nტიკ-ტაკის ხმაზე ხტოდა,\nცეკვაში დრო გაეპარა,\nდროს სულაც არ ნაღვლობდა.\nამიტომ მთელმა ქალაქმა,\nერთი საათით დააგვიანა.', subs:[]},
    // ── v1.193 ჟანრების კუთხე — ზღაპარი (გაგრძელება) + იგავი (გაკვეთილით). open-ended, clip არ სჭირდება (მშობელი კითხულობს). ──
    {theme:'tale',  emoji:'🌟', by:'owl',   q:'პატარა სოფელში ცხოვრობდა გოგონა, რომელსაც ვარსკვლავების დათვლა უყვარდა. ერთ ღამეს ცაში ერთი ვარსკვლავი დააკლდა. სად წავიდა, როგორ ფიქრობ?', subs:['ვინ შეიძლება დაეხმაროს, რომ უკან დაბრუნდეს?']},
    {theme:'tale',  emoji:'🐉', by:'niko',  q:'პატარა დრაკონს, რომელიც მანამდე ცეცხლს აფრქვევდა, სურდო შეეყარა და ახლა ცეცხლის ნაცვლად ფიფქებს აცემინებდა. როგორ გგონია, რა მოხდა შემდეგ?', subs:[]},
    {theme:'tale',  emoji:'🌳', by:'masho', q:'ეზოში ერთ ხეს ყველა ფოთოლი დასცვივდა და გული დასწყდა. ერთ დილას კი თავის ტოტებზე რაღაც საოცრება შენიშნა. შენი აზრით, რა იქნებოდა?', subs:['შენ რას ეტყოდი ამ ხეს, რომ გაამხნევო?']},
    {theme:'fable', emoji:'🐢', by:'owl',   q:'კურდღელი კუს დასცინოდა, რა ნელა დადიხარო. შეჯიბრში კი კუმ გაიმარჯვა, რადგან კურდღელს გზაში ჩაეძინა. შენ რას ისწავლიდი ამ ამბიდან?', subs:[]},
    {theme:'fable', emoji:'🦊', by:'masho', q:'მელას მაღლა დაკიდებული ყურძენი მოუნდა, მაგრამ ვერ მისწვდა. ბოლოს თქვა: ალბათ მჟავეა და სულაც არ მინდაო. როგორ ფიქრობ, მართლა მჟავე იყო თუ მელა თავს იტყუებოდა?', subs:[]}
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
    {theme:'bedtime', emoji:'💬', by:'owl',   q:'If you could say one word to today before sleep, what would it be?', subs:[]},
    // v1.186 — Talk & Think expansion #4 (English deck; runtime English voice)
    {theme:'imagine', emoji:'🐙', by:'owl',   q:'If you spent one day at the bottom of the sea, who would you meet?', subs:['What would you tell the fish down there?']},
    {theme:'values',  emoji:'🤲', by:'masho', q:'If you saw a child all alone and sad, what would you say?', subs:[]},
    {theme:'think',   emoji:'🎵', by:'niko',  q:'If colors had a sound, how would red sound?', subs:[]},
    {theme:'bedtime', emoji:'🛏️', by:'owl',   q:'What did you do today that made you proud?', subs:['What do you want to do tomorrow?']},
    {theme:'imagine', emoji:'🎈', by:'masho', q:'If lots of balloons lifted you into the sky, where would you fly first?', subs:[]},
    {theme:'values',  emoji:'🌱', by:'niko',  q:'If you did one kind thing tomorrow, what would it be?', subs:[]},
    // ── v1.188 ფანტაზიის კუთხე batch 1 — parallel EN deck (runtime English voice, no clips; poems are ka-only) ──
    {theme:'impossible', emoji:'🌙⭐', by:'owl',  q:'One morning the sun got tired and fell asleep. Only one little star was left in the sky. What happened next?', subs:[]},
    {theme:'impossible', emoji:'🐟',   by:'niko', q:'A fish grew legs and came out for a walk on land. Who did it meet first?', subs:[]},
    {theme:'impossible', emoji:'🧸',   by:'masho',q:'At night the toys came alive and threw a big party in the kitchen. What did they cook?', subs:[]},
    {theme:'finish',     emoji:'☁️🎨', by:'owl',  q:'A little cloud wanted to paint a rainbow, but it only had blue paint. So it...', subs:[]},
    {theme:'finish',     emoji:'🐜',   by:'niko', q:'An ant found a giant crumb and wanted to carry it home. But on the way...', subs:[]},
    {theme:'whatif',     emoji:'🌗',   by:'owl',  q:'What would happen if your shadow ran away from you and danced on its own?', subs:[]},
    {theme:'whatif',     emoji:'📚',   by:'masho',q:'What would happen if books could read their stories out loud when no one is listening?', subs:[]},
    {theme:'whatif',     emoji:'🌧️',  by:'niko', q:'What would happen if raindrops fell upward, toward the sky?', subs:[]},
    {theme:'theater',    emoji:'☁️',   by:'owl',  q:'Pretend you are a little cloud. Show me how you move when the wind blows you.', subs:[]},
    {theme:'theater',    emoji:'🐱❄️', by:'masho',q:'Pretend you are a brave cat seeing snow for the first time. What do you do?', subs:[]},
    {theme:'theater',    emoji:'🤖',   by:'niko', q:'Become a robot that just learned to laugh. How do you laugh?', subs:[]},
    // ── v1.193 ჟანრების კუთხე — parallel EN deck (runtime English voice) ──
    {theme:'tale',  emoji:'🌟', by:'owl',   q:'In a small village lived a girl who loved counting stars. One night, one star was missing from the sky. Where do you think it went?', subs:['Who could help it find its way back?']},
    {theme:'tale',  emoji:'🐉', by:'niko',  q:'A little fire-breathing dragon caught a cold and sneezed snowflakes instead of fire. What happened next?', subs:[]},
    {theme:'tale',  emoji:'🌳', by:'masho', q:'A tree in the yard lost all its leaves and felt sad. But one morning it noticed something wonderful on its branches. What was it?', subs:['What would you say to cheer the tree up?']},
    {theme:'fable', emoji:'🐢', by:'owl',   q:'A hare laughed at the slow tortoise. But the tortoise won the race, because the hare fell asleep along the way. What can we learn from this?', subs:[]},
    {theme:'fable', emoji:'🦊', by:'masho', q:'A fox wanted the grapes hanging up high but could not reach them. She walked off saying: they are probably sour anyway. Were they really sour, or was the fox making excuses?', subs:[]}
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

// v1.190 — age-gate via `min` (card's minimum age). Poems were 7+ (reading); now they are VOICED, so the only
// group to skip is the text-free tinies (age <= 4) — 5+ get them (listen + early word exposure). Owner 2026-06-17.
// Never mutate source TALK. age 0 = guest/unknown → show (likely a parent/older tester).
function talkPool(lang){
  let pool=TALK[lang].slice();
  const age=(typeof kidObj==='function')?(kidObj(profile).age||0):0;
  // v1.201: tale/fable (genres with a moral) are a 5+ cognitive task → gate like poems even without an explicit min.
  pool=pool.filter(c=>{ const m=c.min||(['tale','fable'].includes(c.theme)?5:0); return !m || age===0 || age>=m; });
  return pool;
}
function talkDeck(lang){
  lang=(lang==='en')?'en':'ka';
  // shuffle a COPY each entry so the set feels fresh and isn't always in the same order
  // (owner 2026-06-13). Never mutate the source TALK array. shuffle() is the global Fisher-Yates helper.
  const deck=(typeof shuffle==='function')?shuffle(talkPool(lang)):talkPool(lang);
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
  const deck=(typeof shuffle==='function')?shuffle(talkPool(lang)):talkPool(lang);
  tl={lang, i:0, deck};
  talkCard();
});

function talkCard(){
  if(!tl)return openTalk();
  const c=tl.deck[tl.i]; if(!c)return openTalk();
  const th=TALK_THEMES[c.theme]||TALK_THEMES.think;
  const ch=TALK_CHARS[c.by]||TALK_CHARS.owl;
  const subs=(c.subs&&c.subs.length)?`<div class="talk-subs"><span class="ts-lab">კიდევ ჰკითხე:</span> ${c.subs.join(' ')}</div>`:'';
  // v1.187 — end-of-card interaction (owner principle 2026-06-17): leave a CREATIVE residue, not just a read.
  // Offline prompts (draw on paper, say it in a real funny voice) — NO on-screen canvas/recording; more
  // screen-positive + keeps the parent⇄child „together" ethos. Theme-aware: imagine/think (fantasy) get the
  // creative trio; values/bedtime (EQ/reflection) get only „what would you add" so we never mislabel them.
  const ten=(UILANG==='en');
  const isPoem=(c.theme==='poem'); // reading content: multi-line, no character ask, no audio
  const creative=['imagine','think','impossible','finish','whatif','theater','tale'].includes(c.theme);
  const acts=[`<span class="td-chip">🤔 ${ten?'What would you add?':'შენ რას დაამატებდი?'}</span>`];
  if(creative){
    acts.push(`<span class="td-chip">🎨 ${ten?'Draw this scene':'დახატე ეს სცენა'}</span>`);
    acts.push(`<span class="td-chip">🎭 ${ten?'Say it in a funny voice':'თქვი სასაცილო ხმით'}</span>`);
  }
  const doRow=`<div class="talk-do"><span class="td-lab">${ten?'Now you:':'ახლა შენ:'}</span>${acts.join('')}</div>`;
  // progress bar (scales to ANY deck size; the old per-card dot row overflowed once the deck grew to 27,
  // pushing the „next" button off-screen — owner 2026-06-14). Position is also shown as the „N / total" count.
  const prog=Math.round((tl.i+1)/tl.deck.length*100);
  // Listen: KA plays the recorded edge-tts clip (v1.120, AUDIO_MANIFEST); EN uses the English voice.
  // v1.189 — poems are now VOICED too (owner: voicing is better) → clips tlk_044/045, keep the listen button.
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
      <div class="talk-q${isPoem?' talk-poem':''}">${isPoem?c.q.split('\n').map(l=>`<span class="pln">${l}</span>`).join(''):c.q}</div>
      ${subs}
      ${doRow}
      ${isPoem?'':`<div class="talk-by">${ch.img?`<img class="tb-logo" src="${ch.img}" alt="">`:`<span class="tb-em">${ch.emoji}</span>`}<span class="tb-say">${ch.say}</span></div>`}
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
