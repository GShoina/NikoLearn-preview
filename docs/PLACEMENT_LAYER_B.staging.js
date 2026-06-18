/* ═══════════════════════════════════════════════════════════════════════════════════════════════
   PLACEMENT — LAYER (b) STAGING CONTENT  (authored 2026-06-18, NOT YET LIVE)
   These are the full ~30/subject/age adaptive pools. They contain NEW Georgian copy (words,
   syllables, en2ka meaning-mappings, new Georgian distractors) that MUST pass Gemini KA-QA +
   owner gate (Georgian Copy Standard §6f) BEFORE going into the live placement.js.

   Layer (a) (engine + 4-option + guessing-correction on the EXISTING questions) shipped first.
   To ship layer (b): run Gemini-QA → owner review → replace the SUBJ_DIAG object in
   niko/placement.js with the QA'd version of the object below → 3-spot version bump → deploy.

   NEW Georgian needing QA is flagged // QA below. English-option / numeric / single-letter items
   carry no translatable copy and need no QA.
   ═══════════════════════════════════════════════════════════════════════════════════════════════ */
const SUBJ_DIAG_LAYER_B = {
  english:{
    young:[ // 3-5: English options only → no Georgian QA needed
      {kind:'pic', emoji:'🍎', q:'რომელია?', a:'apple',  opts:['apple','ball','sun','cat'],    d:1},
      {kind:'pic', emoji:'🐶', q:'რომელია?', a:'dog',    opts:['dog','cat','cow','pig'],       d:1},
      {kind:'pic', emoji:'🐱', q:'რომელია?', a:'cat',    opts:['cat','dog','fish','bird'],     d:1},
      {kind:'pic', emoji:'☀️', q:'რომელია?', a:'sun',    opts:['sun','star','moon','sky'],     d:1},
      {kind:'pic', emoji:'⚽', q:'რომელია?', a:'ball',   opts:['ball','book','box','bell'],    d:1},
      {kind:'pic', emoji:'🐟', q:'რომელია?', a:'fish',   opts:['fish','frog','bird','fox'],    d:1},
      {kind:'pic', emoji:'🚗', q:'რომელია?', a:'car',    opts:['car','bus','cup','can'],       d:1},
      {kind:'pic', emoji:'⭐', q:'რომელია?', a:'star',   opts:['star','sun','heart','moon'],   d:1},
      {kind:'pic', emoji:'🍌', q:'რომელია?', a:'banana', opts:['banana','apple','lemon','orange'], d:1},
      {kind:'pic', emoji:'🐻', q:'რომელია?', a:'bear',   opts:['bear','bee','bird','boy'],     d:1},
      {kind:'pic', emoji:'🏠', q:'რომელია?', a:'house',  opts:['house','mouse','horse','hat'], d:2},
      {kind:'pic', emoji:'🌙', q:'რომელია?', a:'moon',   opts:['moon','sun','star','man'],     d:2},
      {kind:'pic', emoji:'🐮', q:'რომელია?', a:'cow',    opts:['cow','dog','cat','owl'],       d:2},
      {kind:'pic', emoji:'🌳', q:'რომელია?', a:'tree',   opts:['tree','three','free','bee'],   d:2},
      {kind:'pic', emoji:'🥛', q:'რომელია?', a:'milk',   opts:['milk','water','juice','tea'],  d:2},
      {kind:'pic', emoji:'🐸', q:'რომელია?', a:'frog',   opts:['frog','fish','dog','fox'],     d:2},
      {kind:'pic', emoji:'🎈', q:'რომელია?', a:'balloon',opts:['balloon','ball','moon','bell'],d:2},
      {kind:'pic', emoji:'🐰', q:'რომელია?', a:'rabbit', opts:['rabbit','rat','bear','cat'],   d:2},
      {kind:'pic', emoji:'🚌', q:'რომელია?', a:'bus',    opts:['bus','car','van','bike'],      d:2},
      {kind:'pic', emoji:'🌺', q:'რომელია?', a:'flower', opts:['flower','tree','grass','leaf'],d:2},
      {kind:'pic', emoji:'🐘', q:'რომელია?', a:'elephant',opts:['elephant','lion','tiger','zebra'], d:3},
      {kind:'pic', emoji:'🦒', q:'რომელია?', a:'giraffe',opts:['giraffe','horse','deer','camel'], d:3},
      {kind:'pic', emoji:'🦋', q:'რომელია?', a:'butterfly',opts:['butterfly','bee','bird','bug'], d:3},
      {kind:'pic', emoji:'🍓', q:'რომელია?', a:'strawberry',opts:['strawberry','cherry','apple','berry'], d:3},
      {kind:'pic', emoji:'🌈', q:'რომელია?', a:'rainbow',opts:['rainbow','sky','cloud','rain'],d:3},
      {kind:'pic', emoji:'🐧', q:'რომელია?', a:'penguin',opts:['penguin','duck','bird','seal'],d:3},
      {kind:'pic', emoji:'🚁', q:'რომელია?', a:'helicopter',opts:['helicopter','plane','rocket','car'], d:3},
      {kind:'pic', emoji:'🦁', q:'რომელია?', a:'lion',   opts:['lion','tiger','cat','bear'],   d:3},
      {kind:'pic', emoji:'🐢', q:'რომელია?', a:'turtle', opts:['turtle','frog','snail','fish'],d:3},
      {kind:'pic', emoji:'🍉', q:'რომელია?', a:'watermelon',opts:['watermelon','melon','apple','fruit'], d:3}
    ],
    big:[ // 6-9: tr prompts + en2ka answers/distractors are Georgian → QA the // QA lines
      {kind:'pic', emoji:'🍎', q:'რომელია?', a:'apple', opts:['apple','book','dog','ball'], d:1},
      {kind:'pic', emoji:'🐱', q:'რომელია?', a:'cat',   opts:['cat','dog','cow','bird'],   d:1},
      {kind:'tr',  q:'ცხენი', a:'horse', opts:['horse','house','mouse','horn'],  d:1},
      {kind:'tr',  q:'წიგნი', a:'book',  opts:['book','look','cook','foot'],     d:1},
      {kind:'tr',  q:'წყალი', a:'water', opts:['water','winter','wonder','weather'], d:1},
      {kind:'tr',  q:'სახლი', a:'house', opts:['house','horse','mouse','hose'],  d:1}, // QA prompt სახლი
      {kind:'spell', emoji:'🐶', q:'რომელია სწორად დაწერილი?', a:'dog', opts:['dog','dawg','doog','dogg'], d:1},
      {kind:'spell', emoji:'🐱', q:'რომელია სწორად დაწერილი?', a:'cat', opts:['cat','kat','catt','cad'],  d:1},
      {kind:'en2ka', q:'happy', a:'ბედნიერი', opts:['ბედნიერი','მწუხარე','დაღლილი','მშიერი'], d:1}, // QA distractor მშიერი
      {kind:'en2ka', q:'big', a:'დიდი', opts:['დიდი','პატარა','მაღალი','მძიმე'], d:1}, // QA distractor მძიმე
      {kind:'tr',  q:'მზე', a:'sun',   opts:['sun','son','sand','soon'],   d:2}, // QA prompt მზე
      {kind:'tr',  q:'ვაშლი', a:'apple', opts:['apple','able','april','ample'], d:2}, // QA prompt ვაშლი
      {kind:'tr',  q:'წითელი', a:'red', opts:['red','read','ride','rod'],  d:2}, // QA prompt წითელი
      {kind:'tr',  q:'ძაღლი', a:'dog',  opts:['dog','dig','dug','dock'],   d:2}, // QA prompt ძაღლი
      {kind:'spell', emoji:'⭐', q:'რომელია სწორად დაწერილი?', a:'star', opts:['star','stahr','starr','stair'], d:2},
      {kind:'spell', emoji:'🌳', q:'რომელია სწორად დაწერილი?', a:'tree', opts:['tree','tri','tre','three'], d:2},
      {kind:'en2ka', q:'run', a:'სირბილი', opts:['სირბილი','ხტომა','ცურვა','სიარული'], d:2}, // QA distractor სიარული
      {kind:'en2ka', q:'cold', a:'ცივი', opts:['ცივი','ცხელი','თბილი','სველი'], d:2}, // QA all-new
      {kind:'en2ka', q:'small', a:'პატარა', opts:['პატარა','დიდი','გრძელი','მრგვალი'], d:2}, // QA all-new
      {kind:'en2ka', q:'fast', a:'სწრაფი', opts:['სწრაფი','ნელი','მაღალი','ძლიერი'], d:2}, // QA all-new
      {kind:'tr',  q:'მთვარე', a:'moon', opts:['moon','mon','mood','noon'],  d:3}, // QA prompt მთვარე
      {kind:'tr',  q:'ფრინველი', a:'bird', opts:['bird','beard','bread','board'], d:3}, // QA prompt ფრინველი
      {kind:'tr',  q:'მდინარე', a:'river', opts:['river','rever','ruler','robber'], d:3}, // QA prompt მდინარე
      {kind:'tr',  q:'პეპელა', a:'butterfly', opts:['butterfly','bumblebee','butter','beetle'], d:3}, // QA prompt პეპელა
      {kind:'spell', emoji:'🦋', q:'რომელია სწორად დაწერილი?', a:'butterfly', opts:['butterfly','buterfly','butterflie','buterfli'], d:3},
      {kind:'spell', emoji:'🐘', q:'რომელია სწორად დაწერილი?', a:'elephant', opts:['elephant','elefant','eliphant','elephent'], d:3},
      {kind:'en2ka', q:'beautiful', a:'ლამაზი', opts:['ლამაზი','ჭკვიანი','ძლიერი','მხიარული'], d:3}, // QA all-new
      {kind:'en2ka', q:'strong', a:'ძლიერი', opts:['ძლიერი','სუსტი','სწრაფი','მაღალი'], d:3}, // QA all-new
      {kind:'en2ka', q:'difficult', a:'რთული', opts:['რთული','ადვილი','საინტერესო','მოკლე'], d:3}, // QA all-new (Gemini: dropped synonym „მარტივი")
      {kind:'en2ka', q:'clever', a:'ჭკვიანი', opts:['ჭკვიანი','ზარმაცი','ცელქი','მორცხვი'], d:3} // QA all-new
    ]
  },
  math:[ // numeric → no QA
    {kind:'num', q:'1 + 1', a:'2',  opts:['2','3','1','4'],   d:1},
    {kind:'num', q:'2 + 1', a:'3',  opts:['3','2','4','5'],   d:1},
    {kind:'num', q:'3 + 2', a:'5',  opts:['5','4','6','3'],   d:1},
    {kind:'num', q:'4 + 3', a:'7',  opts:['7','6','8','5'],   d:1},
    {kind:'num', q:'4 + 4', a:'8',  opts:['8','7','9','6'],   d:1},
    {kind:'num', q:'2 + 5', a:'7',  opts:['7','6','8','3'],   d:1},
    {kind:'num', q:'5 − 2', a:'3',  opts:['3','2','4','7'],   d:1},
    {kind:'num', q:'6 − 3', a:'3',  opts:['3','4','2','9'],   d:1},
    {kind:'num', q:'7 − 4', a:'3',  opts:['3','2','4','11'],  d:1},
    {kind:'num', q:'8 − 5', a:'3',  opts:['3','4','2','13'],  d:1},
    {kind:'num', q:'2 + 3', a:'5',  opts:['5','4','6','8'],   d:2},
    {kind:'num', q:'7 + 5', a:'12', opts:['12','11','13','10'], d:2},
    {kind:'num', q:'10 + 6', a:'16',opts:['16','15','17','4'],  d:2},
    {kind:'num', q:'14 + 8', a:'22',opts:['22','21','24','20'], d:2},
    {kind:'num', q:'12 + 9', a:'21',opts:['21','19','22','23'], d:2},
    {kind:'num', q:'9 − 4', a:'5',  opts:['5','6','4','13'],  d:2},
    {kind:'num', q:'13 − 5', a:'8', opts:['8','7','9','18'],  d:2},
    {kind:'num', q:'15 − 6', a:'9', opts:['9','8','10','21'], d:2},
    {kind:'num', q:'20 − 7', a:'13',opts:['13','12','14','27'], d:2},
    {kind:'num', q:'4 × 3', a:'12', opts:['12','7','9','15'], d:2},
    {kind:'num', q:'6 × 7', a:'42', opts:['42','36','48','49'], d:3},
    {kind:'num', q:'8 × 6', a:'48', opts:['48','42','54','56'], d:3},
    {kind:'num', q:'7 × 8', a:'56', opts:['56','48','64','54'], d:3},
    {kind:'num', q:'9 × 6', a:'54', opts:['54','45','63','56'], d:3},
    {kind:'num', q:'7 × 9', a:'63', opts:['63','56','72','54'], d:3},
    {kind:'num', q:'24 ÷ 3', a:'8', opts:['8','6','9','12'],  d:3},
    {kind:'num', q:'36 ÷ 6', a:'6', opts:['6','5','7','8'],   d:3},
    {kind:'num', q:'45 ÷ 9', a:'5', opts:['5','4','6','9'],   d:3},
    {kind:'num', q:'25 + 38', a:'63', opts:['63','53','73','62'], d:3},
    {kind:'num', q:'64 − 29', a:'35', opts:['35','45','25','36'], d:3}
  ],
  'ka-alpha':{
    young:[ // single letters → factual recognition (not translatable copy); still worth a Gemini sanity pass
      {kind:'letter', q:'რომელია „ა"?', a:'ა', opts:['ა','ბ','გ','ო'], d:1},
      {kind:'letter', q:'რომელია „ბ"?', a:'ბ', opts:['ბ','ვ','გ','დ'], d:1},
      {kind:'letter', q:'რომელია „გ"?', a:'გ', opts:['გ','კ','ქ','ბ'], d:1},
      {kind:'letter', q:'რომელია „დ"?', a:'დ', opts:['დ','ტ','თ','ბ'], d:1},
      {kind:'letter', q:'რომელია „ე"?', a:'ე', opts:['ე','ა','ო','ვ'], d:1},
      {kind:'letter', q:'რომელია „ვ"?', a:'ვ', opts:['ვ','ბ','კ','გ'], d:1},
      {kind:'letter', q:'რომელია „ი"?', a:'ი', opts:['ი','უ','ე','ო'], d:1},
      {kind:'letter', q:'რომელია „კ"?', a:'კ', opts:['კ','ქ','გ','ხ'], d:1},
      {kind:'letter', q:'რომელია „ო"?', a:'ო', opts:['ო','ე','უ','ა'], d:1},
      {kind:'letter', q:'რომელია „მ"?', a:'მ', opts:['მ','ნ','ლ','შ'], d:1},
      {kind:'letter', q:'რომელია „ლ"?', a:'ლ', opts:['ლ','რ','მ','ნ'], d:2},
      {kind:'letter', q:'რომელია „ნ"?', a:'ნ', opts:['ნ','მ','ლ','რ'], d:2},
      {kind:'letter', q:'რომელია „რ"?', a:'რ', opts:['რ','ლ','ნ','მ'], d:2},
      {kind:'letter', q:'რომელია „ს"?', a:'ს', opts:['ს','შ','ზ','ც'], d:2},
      {kind:'letter', q:'რომელია „ტ"?', a:'ტ', opts:['ტ','თ','დ','ფ'], d:2},
      {kind:'letter', q:'რომელია „უ"?', a:'უ', opts:['უ','ი','ო','ე'], d:2},
      {kind:'letter', q:'რომელია „პ"?', a:'პ', opts:['პ','ფ','ბ','ღ'], d:2},
      {kind:'letter', q:'რომელია „ზ"?', a:'ზ', opts:['ზ','ს','შ','ძ'], d:2},
      {kind:'letter', q:'რომელია „თ"?', a:'თ', opts:['თ','დ','ტ','ფ'], d:2},
      {kind:'letter', q:'რომელია „ქ"?', a:'ქ', opts:['ქ','კ','გ','ხ'], d:2},
      {kind:'letter', q:'რომელია „ფ"?', a:'ფ', opts:['ფ','პ','თ','ტ'], d:3},
      {kind:'letter', q:'რომელია „ღ"?', a:'ღ', opts:['ღ','გ','ყ','ხ'], d:3},
      {kind:'letter', q:'რომელია „ყ"?', a:'ყ', opts:['ყ','ღ','ხ','ქ'], d:3},
      {kind:'letter', q:'რომელია „შ"?', a:'შ', opts:['შ','ს','ჩ','ზ'], d:3},
      {kind:'letter', q:'რომელია „ჩ"?', a:'ჩ', opts:['ჩ','ჭ','წ','ც'], d:3},
      {kind:'letter', q:'რომელია „ც"?', a:'ც', opts:['ც','წ','ძ','ს'], d:3},
      {kind:'letter', q:'რომელია „ძ"?', a:'ძ', opts:['ძ','წ','ჯ','ზ'], d:3},
      {kind:'letter', q:'რომელია „წ"?', a:'წ', opts:['წ','ჭ','ც','ჩ'], d:3},
      {kind:'letter', q:'რომელია „ჭ"?', a:'ჭ', opts:['ჭ','ჩ','წ','ჯ'], d:3},
      {kind:'letter', q:'რომელია „ჯ"?', a:'ჯ', opts:['ჯ','ჟ','ძ','ზ'], d:3}
    ],
    big:[ // letters (factual) + syllables + WORDS → QA all syl/word lines (real Georgian words + distractors)
      {kind:'letter', q:'რომელია „ჭ"?', a:'ჭ', opts:['ჭ','ჩ','წ','ც'], d:1},
      {kind:'letter', q:'რომელია „ჯ"?', a:'ჯ', opts:['ჯ','ჟ','ძ','ზ'], d:1},
      {kind:'letter', q:'რომელია „ღ"?', a:'ღ', opts:['ღ','გ','ყ','ხ'], d:1},
      {kind:'letter', q:'რომელია „ყ"?', a:'ყ', opts:['ყ','ღ','ქ','ხ'], d:1},
      {kind:'letter', q:'რომელია „ჟ"?', a:'ჟ', opts:['ჟ','ჯ','ძ','შ'], d:1},
      {kind:'letter', q:'რომელია „ფ"?', a:'ფ', opts:['ფ','პ','თ','ქ'], d:1},
      {kind:'syl', emoji:'🍎', q:'რომელი მარცვლით იწყება „ვაშლი"?', a:'ვა', opts:['ვა','მა','სა','და'], d:1}, // QA
      {kind:'syl', emoji:'🐶', q:'რომელი მარცვლით იწყება „ძაღლი"?', a:'ძა', opts:['ძა','ცა','წა','ზა'], d:1}, // QA
      {kind:'syl', emoji:'🐱', q:'რომელი მარცვლით იწყება „კატა"?', a:'კა', opts:['კა','გა','ქა','ხა'], d:1}, // QA all-new
      {kind:'syl', emoji:'🏠', q:'რომელი მარცვლით იწყება „სახლი"?', a:'სა', opts:['სა','შა','ზა','ცა'], d:1}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „დედა"?', a:'დედა', opts:['დედა','მამა','ბაბუა','ბებია'], d:2}, // QA distractors
      {kind:'word', q:'წაიკითხე: რომელია „მამა"?', a:'მამა', opts:['მამა','დედა','ბაბუა','ძმა'], d:2}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „წიგნი"?', a:'წიგნი', opts:['წიგნი','ჩიტი','ცხენი','კალამი'], d:2}, // QA distractor კალამი
      {kind:'word', q:'წაიკითხე: რომელია „სახლი"?', a:'სახლი', opts:['სახლი','თაგვი','კარი','ფანჯარა'], d:2}, // QA distractor ფანჯარა
      {kind:'word', q:'წაიკითხე: რომელია „მზე"?', a:'მზე', opts:['მზე','ცა','ღამე','მთვარე'], d:2}, // QA distractor მთვარე
      {kind:'word', q:'წაიკითხე: რომელია „ცხენი"?', a:'ცხენი', opts:['ცხენი','ცხვარი','ცოცხი','ცხელი'], d:2}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „კარი"?', a:'კარი', opts:['კარი','ქარი','კაცი','ფანჯარა'], d:2}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „ბურთი"?', a:'ბურთი', opts:['ბურთი','ბუნება','ბაღი','ბავშვი'], d:2}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „თაგვი"?', a:'თაგვი', opts:['თაგვი','თავი','თაფლი','თოვლი'], d:2}, // QA all-new
      {kind:'syl', emoji:'🦋', q:'რომელი მარცვლით იწყება „პეპელა"?', a:'პე', opts:['პე','ბე','გე','თე'], d:2}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „ფანჯარა"?', a:'ფანჯარა', opts:['ფანჯარა','ფარდა','ფანქარი','ფაბრიკა'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „მასწავლებელი"?', a:'მასწავლებელი', opts:['მასწავლებელი','მოსწავლე','მკითხველი','მეცნიერი'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „პეპელა"?', a:'პეპელა', opts:['პეპელა','ბაყაყი','კალია','ჭიამაია'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „ავტობუსი"?', a:'ავტობუსი', opts:['ავტობუსი','მანქანა','ველოსიპედი','მატარებელი'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „ცისარტყელა"?', a:'ცისარტყელა', opts:['ცისარტყელა','ღრუბელი','ცისფერი','ელვა'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „მთვარე"?', a:'მთვარე', opts:['მთვარე','მზე','ვარსკვლავი','ცა'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „დათვი"?', a:'დათვი', opts:['დათვი','მგელი','მელია','კურდღელი'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „ყვავილი"?', a:'ყვავილი', opts:['ყვავილი','ბალახი','ფოთოლი','ხე'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „წყალი"?', a:'წყალი', opts:['წყალი','რძე','წვენი','ჩაი'], d:3}, // QA all-new
      {kind:'word', q:'წაიკითხე: რომელია „ბაღი"?', a:'ბაღი', opts:['ბაღი','ბურთი','ბატი','ბალი'], d:3} // QA all-new (Gemini: dropped rare/dialectal ბაღჩა/ბაგა → common kid words)
    ]
  }
};
if(typeof module!=='undefined') module.exports = SUBJ_DIAG_LAYER_B;
