// NikoLearn content layer — expand freely; keep item shapes. See docs/HANDOFF.md §3.
const COUNTING = [
  {n:1, emoji:'🍎', ka:'ერთი',  en:'one'},
  {n:2, emoji:'🍌', ka:'ორი',   en:'two'},
  {n:3, emoji:'🍓', ka:'სამი',  en:'three'},
  {n:4, emoji:'🐟', ka:'ოთხი',  en:'four'},
  {n:5, emoji:'⭐', ka:'ხუთი',  en:'five'},
  {n:6, emoji:'🌸', ka:'ექვსი', en:'six'},
  {n:7, emoji:'🍇', ka:'შვიდი', en:'seven'},
  {n:8, emoji:'🐝', ka:'რვა',   en:'eight'},
  {n:9, emoji:'🚗', ka:'ცხრა',  en:'nine'},
  {n:10,emoji:'🎈', ka:'ათი',   en:'ten'}
];

const WORDS = {
  'ცხოველები 🐾':[{ka:'კატა',en:'cat',emoji:'🐈'},{ka:'ძაღლი',en:'dog',emoji:'🐕'},{ka:'თევზი',en:'fish',emoji:'🐟'},{ka:'ფრინველი',en:'bird',emoji:'🐦'},{ka:'ცხენი',en:'horse',emoji:'🐴'},{ka:'ლომი',en:'lion',emoji:'🦁'}],
  'ფერები 🎨':[{ka:'წითელი',en:'red',emoji:'🟥'},{ka:'ლურჯი',en:'blue',emoji:'🟦'},{ka:'მწვანე',en:'green',emoji:'🟩'},{ka:'ყვითელი',en:'yellow',emoji:'🟨'}],
  'საკვები 🍎':[{ka:'პური',en:'bread',emoji:'🍞'},{ka:'რძე',en:'milk',emoji:'🥛'},{ka:'კვერცხი',en:'egg',emoji:'🥚'},{ka:'ვაშლი',en:'apple',emoji:'🍎'},{ka:'ბანანი',en:'banana',emoji:'🍌'}],
  'ოჯახი 👨‍👩‍👧':[{ka:'დედა',en:'mother',emoji:'👩'},{ka:'მამა',en:'father',emoji:'👨'},{ka:'და',en:'sister',emoji:'👧'},{ka:'ძმა',en:'brother',emoji:'👦'},{ka:'ბავშვი',en:'baby',emoji:'👶'}],
  'სხეული 🖐️':[{ka:'ხელი',en:'hand',emoji:'✋'},{ka:'თვალი',en:'eye',emoji:'👁️'},{ka:'ფეხი',en:'foot',emoji:'🦶'},{ka:'ცხვირი',en:'nose',emoji:'👃'},{ka:'ყური',en:'ear',emoji:'👂'}],
  'ბუნება 🌳':[{ka:'მზე',en:'sun',emoji:'☀️'},{ka:'მთვარე',en:'moon',emoji:'🌙'},{ka:'ხე',en:'tree',emoji:'🌳'},{ka:'ყვავილი',en:'flower',emoji:'🌼'},{ka:'წვიმა',en:'rain',emoji:'🌧️'}]
};

// Alphabets — letter + example word + emoji. Item {l, word, emoji}.
const KA_ALPHA = [
  {l:'ა',word:'ანანასი',emoji:'🍍'},{l:'ბ',word:'ბურთი',emoji:'⚽'},{l:'გ',word:'გული',emoji:'❤️'},
  {l:'დ',word:'დათვი',emoji:'🐻'},{l:'ე',word:'ეზო',emoji:'🏡'},{l:'ვ',word:'ვაშლი',emoji:'🍎'},
  {l:'ზ',word:'ზებრა',emoji:'🦓'},{l:'თ',word:'თევზი',emoji:'🐟'},{l:'ი',word:'ია',emoji:'🌸'},
  {l:'კ',word:'კატა',emoji:'🐈'},{l:'ლ',word:'ლომი',emoji:'🦁'},{l:'მ',word:'მზე',emoji:'☀️'},
  {l:'ნ',word:'ნავი',emoji:'⛵'},{l:'ო',word:'ობობა',emoji:'🕷️'},{l:'პ',word:'პინგვინი',emoji:'🐧'},
  {l:'ჟ',word:'ჟირაფი',emoji:'🦒'},{l:'რ',word:'რძე',emoji:'🥛'},{l:'ს',word:'სახლი',emoji:'🏠'},
  {l:'ტ',word:'ტორტი',emoji:'🎂'},{l:'უ',word:'ურემი',emoji:'🛒'},{l:'ფ',word:'ფრინველი',emoji:'🐦'},
  {l:'ქ',word:'ქუდი',emoji:'🧢'},{l:'ღ',word:'ღორი',emoji:'🐷'},{l:'ყ',word:'ყურძენი',emoji:'🍇'},
  {l:'შ',word:'შოკოლადი',emoji:'🍫'},{l:'ჩ',word:'ჩანთა',emoji:'🎒'},{l:'ც',word:'ცხენი',emoji:'🐴'},
  {l:'ძ',word:'ძაღლი',emoji:'🐕'},{l:'წ',word:'წყალი',emoji:'💧'},{l:'ჭ',word:'ჭიქა',emoji:'🥤'},
  {l:'ხ',word:'ხე',emoji:'🌳'},{l:'ჯ',word:'ჯადოქარი',emoji:'🧙'},{l:'ჰ',word:'ჰიპო',emoji:'🦛'}
];
const EN_ALPHA = [
  {l:'A',word:'Apple',emoji:'🍎'},{l:'B',word:'Ball',emoji:'⚽'},{l:'C',word:'Cat',emoji:'🐈'},
  {l:'D',word:'Dog',emoji:'🐕'},{l:'E',word:'Egg',emoji:'🥚'},{l:'F',word:'Fish',emoji:'🐟'},
  {l:'G',word:'Goat',emoji:'🐐'},{l:'H',word:'Hat',emoji:'🎩'},{l:'I',word:'Ice',emoji:'🧊'},
  {l:'J',word:'Juice',emoji:'🧃'},{l:'K',word:'Key',emoji:'🔑'},{l:'L',word:'Lion',emoji:'🦁'},
  {l:'M',word:'Moon',emoji:'🌙'},{l:'N',word:'Nest',emoji:'🪺'},{l:'O',word:'Orange',emoji:'🍊'},
  {l:'P',word:'Pig',emoji:'🐷'},{l:'Q',word:'Queen',emoji:'👑'},{l:'R',word:'Rain',emoji:'🌧️'},
  {l:'S',word:'Sun',emoji:'☀️'},{l:'T',word:'Tree',emoji:'🌳'},{l:'U',word:'Umbrella',emoji:'☂️'},
  {l:'V',word:'Van',emoji:'🚐'},{l:'W',word:'Water',emoji:'💧'},{l:'X',word:'Box',emoji:'📦'},
  {l:'Y',word:'Yo-yo',emoji:'🪀'},{l:'Z',word:'Zebra',emoji:'🦓'}
];

// ~100 everyday English phrases (Kings prep). Starter bank — expand each group freely. Item {ka,en}.
const PHRASES = {
  '👋 მისალმება':[{ka:'გამარჯობა',en:'Hello'},{ka:'როგორ ხარ?',en:'How are you?'},{ka:'კარგად ვარ',en:"I'm fine"},{ka:'ნახვამდის',en:'Goodbye'}],
  '🙏 თავაზიანობა':[{ka:'გმადლობ',en:'Thank you'},{ka:'გთხოვ',en:'Please'},{ka:'ბოდიში',en:'Sorry'},{ka:'არაუშავს',en:"It's okay"}],
  '🏫 სკოლა':[{ka:'შემიძლია წყალი დავლიო?',en:'Can I drink water?'},{ka:'არ მესმის',en:"I don't understand"},{ka:'მზად ვარ',en:"I'm ready"},{ka:'დამეხმარე',en:'Help me, please'}],
  '😊 გრძნობები':[{ka:'მშია',en:"I'm hungry"},{ka:'დავიღალე',en:"I'm tired"},{ka:'ბედნიერი ვარ',en:"I'm happy"},{ka:'მიყვარს ეს',en:'I like it'}],
  '❓ კითხვები':[{ka:'ეს რა არის?',en:'What is this?'},{ka:'სად არის?',en:'Where is it?'},{ka:'რა ფერია?',en:'What colour is it?'},{ka:'შემიძლია?',en:'Can I?'}],
  '⭐ ყოველდღე':[{ka:'დილა მშვიდობისა',en:'Good morning'},{ka:'ღამე მშვიდობისა',en:'Good night'},{ka:'წავიდეთ',en:"Let's go"},{ka:'მიყვარხარ',en:'I love you'}]
};

const PRAISE_KA = ['ყოჩაღ!','ბრავო!','მართალია!','სუპერ!','აფერი!'];
