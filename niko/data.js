/* NikoLearn, data (expanded) */

const WORDS = {
  "ფერები 🎨":[
    {ka:"წითელი",en:"red",emoji:"🔴"},{ka:"ლურჯი",en:"blue",emoji:"🔵"},{ka:"მწვანე",en:"green",emoji:"🟢"},
    {ka:"ყვითელი",en:"yellow",emoji:"🟡"},{ka:"შავი",en:"black",emoji:"⬛"},{ka:"თეთრი",en:"white",emoji:"⬜"},
    {ka:"იისფერი",en:"purple",emoji:"🟣"},{ka:"ნარინჯისფერი",en:"orange",emoji:"🟠"},{ka:"ვარდისფერი",en:"pink",emoji:"💗"},
    {ka:"ყავისფერი",en:"brown",emoji:"🟤"}
  ],
  "ცხოველები 🐾":[
    {ka:"ძაღლი",en:"dog",emoji:"🐕"},{ka:"კატა",en:"cat",emoji:"🐱"},{ka:"ცხენი",en:"horse",emoji:"🐴"},
    {ka:"თევზი",en:"fish",emoji:"🐟"},{ka:"ლომი",en:"lion",emoji:"🦁"},{ka:"სპილო",en:"elephant",emoji:"🐘"},
    {ka:"კურდღელი",en:"rabbit",emoji:"🐰"},{ka:"დათვი",en:"bear",emoji:"🐻"},{ka:"მაიმუნი",en:"monkey",emoji:"🐵"},
    {ka:"ფრინველი",en:"bird",emoji:"🐦"},{ka:"ბაყაყი",en:"frog",emoji:"🐸"},{ka:"ზებრა",en:"zebra",emoji:"🦓"}
  ],
  "საკვები 🍎":[
    {ka:"ვაშლი",en:"apple",emoji:"🍎"},{ka:"პური",en:"bread",emoji:"🍞"},{ka:"რძე",en:"milk",emoji:"🥛"},
    {ka:"წყალი",en:"water",emoji:"💧"},{ka:"ბანანი",en:"banana",emoji:"🍌"},{ka:"კვერცხი",en:"egg",emoji:"🥚"},
    {ka:"ყველი",en:"cheese",emoji:"🧀"},{ka:"ნაყინი",en:"ice cream",emoji:"🍦"},{ka:"ტორტი",en:"cake",emoji:"🎂"},
    {ka:"ჩაი",en:"tea",emoji:"🍵"}
  ],
  "ოჯახი 👨‍👩‍👧‍👦":[
    {ka:"დედა",en:"mother",emoji:"👩"},{ka:"მამა",en:"father",emoji:"👨"},{ka:"ძმა",en:"brother",emoji:"👦"},
    {ka:"და",en:"sister",emoji:"👧"},{ka:"ბებია",en:"grandmother",emoji:"👵"},{ka:"ბაბუა",en:"grandfather",emoji:"👴"},
    {ka:"ბავშვი",en:"child",emoji:"🧒"},{ka:"ოჯახი",en:"family",emoji:"👨‍👩‍👧‍👦"}
  ],
  "ბუნება 🌿":[
    {ka:"მზე",en:"sun",emoji:"☀️"},{ka:"მთვარე",en:"moon",emoji:"🌙"},{ka:"ვარსკვლავი",en:"star",emoji:"⭐"},
    {ka:"წვიმა",en:"rain",emoji:"🌧️"},{ka:"ხე",en:"tree",emoji:"🌳"},{ka:"ყვავილი",en:"flower",emoji:"🌸"},
    {ka:"ზღვა",en:"sea",emoji:"🌊"},{ka:"თოვლი",en:"snow",emoji:"❄️"},{ka:"მთა",en:"mountain",emoji:"⛰️"},
    {ka:"ღრუბელი",en:"cloud",emoji:"☁️"}
  ],
  "სკოლა 🏫":[
    {ka:"წიგნი",en:"book",emoji:"📖"},{ka:"კალამი",en:"pen",emoji:"🖊️"},{ka:"ფანქარი",en:"pencil",emoji:"✏️"},
    {ka:"მასწავლებელი",en:"teacher",emoji:"👨‍🏫"},{ka:"სკოლა",en:"school",emoji:"🏫"},{ka:"ჩანთა",en:"bag",emoji:"🎒"},
    {ka:"რვეული",en:"notebook",emoji:"📓"},{ka:"სკამი",en:"chair",emoji:"🪑"}
  ],
  "ტანსაცმელი 👕":[
    {ka:"პერანგი",en:"shirt",emoji:"👕"},{ka:"კაბა",en:"dress",emoji:"👗"},{ka:"ქურთუკი",en:"jacket",emoji:"🧥"},
    {ka:"ჯინსი",en:"jeans",emoji:"👖"},{ka:"ფეხსაცმელი",en:"shoes",emoji:"👟"},{ka:"ქუდი",en:"hat",emoji:"🎩"},
    {ka:"წინდა",en:"socks",emoji:"🧦"},{ka:"სათვალე",en:"glasses",emoji:"👓"}
  ],
  "ტრანსპორტი 🚗":[
    {ka:"მანქანა",en:"car",emoji:"🚗"},{ka:"ავტობუსი",en:"bus",emoji:"🚌"},{ka:"თვითმფრინავი",en:"plane",emoji:"✈️"},
    {ka:"მატარებელი",en:"train",emoji:"🚂"},{ka:"ველოსიპედი",en:"bike",emoji:"🚲"},{ka:"ნავი",en:"boat",emoji:"⛵"}
  ],
  "სხეული 🧍":[
    {ka:"თავი",en:"head",emoji:"🧠"},{ka:"ხელი",en:"hand",emoji:"✋"},{ka:"ფეხი",en:"foot",emoji:"🦶"},
    {ka:"თვალი",en:"eye",emoji:"👁️"},{ka:"ყური",en:"ear",emoji:"👂"},{ka:"ცხვირი",en:"nose",emoji:"👃"},
    {ka:"პირი",en:"mouth",emoji:"👄"},{ka:"კბილი",en:"tooth",emoji:"🦷"}
  ],
  "სპორტი ⚽":[
    {ka:"ფეხბურთი",en:"football",emoji:"⚽"},{ka:"კალათბურთი",en:"basketball",emoji:"🏀"},{ka:"ცურვა",en:"swimming",emoji:"🏊"},
    {ka:"სირბილი",en:"running",emoji:"🏃"},{ka:"ტენისი",en:"tennis",emoji:"🎾"},{ka:"ცეკვა",en:"dancing",emoji:"💃"}
  ],
  "ამინდი 🌦️":[
    {ka:"მზიანი",en:"sunny",emoji:"☀️"},{ka:"წვიმიანი",en:"rainy",emoji:"🌧️"},{ka:"ცივი",en:"cold",emoji:"🥶"},
    {ka:"ცხელი",en:"hot",emoji:"🔥"},{ka:"ქარიანი",en:"windy",emoji:"💨"},{ka:"თოვლიანი",en:"snowy",emoji:"🌨️"}
  ],
  "პლანეტები 🪐":[
    {ka:"მზე",en:"the Sun",emoji:"☀️"},{ka:"დედამიწა",en:"Earth",emoji:"🌍"},{ka:"მთვარე",en:"the Moon",emoji:"🌙"},
    {ka:"მარსი",en:"Mars",emoji:"🔴"},{ka:"იუპიტერი",en:"Jupiter",emoji:"🟠"},{ka:"სატურნი",en:"Saturn",emoji:"🪐"},
    {ka:"ვენერა",en:"Venus",emoji:"🌕"},{ka:"მერკური",en:"Mercury",emoji:"🌑"},{ka:"ვარსკვლავი",en:"a star",emoji:"⭐"},
    {ka:"კომეტა",en:"a comet",emoji:"☄️"},{ka:"რაკეტა",en:"a rocket",emoji:"🚀"},{ka:"კოსმოსი",en:"space",emoji:"🌌"}
  ],
  "პროფესიები 👩‍🚀":[
    {ka:"ასტრონავტი",en:"astronaut",emoji:"👩‍🚀"},{ka:"ექიმი",en:"doctor",emoji:"👩‍⚕️"},{ka:"მასწავლებელი",en:"teacher",emoji:"👨‍🏫"},
    {ka:"პილოტი",en:"pilot",emoji:"👨‍✈️"},{ka:"მეცნიერი",en:"scientist",emoji:"👨‍🔬"},{ka:"ინჟინერი",en:"engineer",emoji:"👷"},
    {ka:"პროგრამისტი",en:"programmer",emoji:"👨‍💻"},{ka:"მხატვარი",en:"artist",emoji:"👨‍🎨"},{ka:"მზარეული",en:"chef",emoji:"👨‍🍳"},
    {ka:"მეხანძრე",en:"firefighter",emoji:"👨‍🚒"},{ka:"ვეტერინარი",en:"vet",emoji:"🧑‍⚕️"},{ka:"მუსიკოსი",en:"musician",emoji:"🎤"}
  ]
};

/* ── PHRASES, ~100 short, everyday English (grouped by theme) ── */
const PHRASES = {
  "მისალმება 👋":[
    {ka:"გამარჯობა!",en:"Hello!"},{ka:"სალამი!",en:"Hi!"},{ka:"დილა მშვიდობისა!",en:"Good morning!"},
    {ka:"საღამო მშვიდობისა!",en:"Good evening!"},{ka:"ღამე მშვიდობისა!",en:"Good night!"},{ka:"ნახვამდის!",en:"Goodbye!"},
    {ka:"მოგვიანებით ნახვამდის!",en:"See you later!"},{ka:"როგორ ხარ?",en:"How are you?"},{ka:"კარგად ვარ, მადლობა.",en:"I'm fine, thanks."},
    {ka:"რა გქვია?",en:"What's your name?"},{ka:"მე მქვია ნიკა.",en:"My name is Nika."},{ka:"სამი წლის ვარ.",en:"I'm three."},
    {ka:"სასიამოვნოა.",en:"Nice to meet you."},{ka:"საიდან ხარ?",en:"Where are you from?"}
  ],
  "თავაზიანობა 🙏":[
    {ka:"გთხოვ.",en:"Please."},{ka:"მადლობა.",en:"Thank you."},{ka:"დიდი მადლობა!",en:"Thank you very much!"},
    {ka:"არაფრის.",en:"You're welcome."},{ka:"ბოდიში.",en:"Sorry."},{ka:"უკაცრავად.",en:"Excuse me."},
    {ka:"არა უშავს.",en:"No problem."},{ka:"ყველაფერი რიგზეა.",en:"It's OK."},{ka:"შენ პირველი.",en:"After you."},
    {ka:"იყავი კეთილი.",en:"Be kind."},{ka:"ძალიან კარგი!",en:"Very good!"}
  ],
  "სკოლა 🏫":[
    {ka:"დაჯექი, გთხოვ.",en:"Sit down, please."},{ka:"ადექი.",en:"Stand up."},{ka:"გახსენი წიგნი.",en:"Open your book."},
    {ka:"დახურე წიგნი.",en:"Close your book."},{ka:"მომისმინე, გთხოვ.",en:"Listen, please."},{ka:"გაჩუმდი, გთხოვ.",en:"Be quiet, please."},
    {ka:"ხელი ასწიე.",en:"Raise your hand."},{ka:"შემიძლია გავიდე?",en:"May I go out?"},{ka:"ვერ გავიგე.",en:"I don't understand."},
    {ka:"შეგიძლია დამეხმარო?",en:"Can you help me?"},{ka:"ბრავო!",en:"Well done!"},{ka:"კიდევ სცადე.",en:"Try again."},
    {ka:"დავამთავრე!",en:"I'm finished!"},{ka:"არ ვიცი.",en:"I don't know."}
  ],
  "სახლი 🏠":[
    {ka:"მშია.",en:"I'm hungry."},{ka:"მწყურია.",en:"I'm thirsty."},{ka:"ძილის დროა.",en:"Time for bed."},
    {ka:"ხელები დაიბანე.",en:"Wash your hands."},{ka:"მოდი ვჭამოთ.",en:"Let's eat."},{ka:"გემრიელია!",en:"It's yummy!"},
    {ka:"დაღლილი ვარ.",en:"I'm tired."},{ka:"კბილები გაიხეხე.",en:"Brush your teeth."},{ka:"მოდი ვითამაშოთ.",en:"Let's play."},
    {ka:"დროა წავიდეთ.",en:"Time to go."}
  ],
  "გრძნობები 😊":[
    {ka:"ბედნიერი ვარ.",en:"I'm happy."},{ka:"მოწყენილი ვარ.",en:"I'm sad."},{ka:"მეშინია.",en:"I'm scared."},
    {ka:"გიყვარვარ.",en:"I love you."},{ka:"გაბრაზებული ვარ.",en:"I'm angry."},{ka:"აღელვებული ვარ.",en:"I'm excited."},
    {ka:"მომწონს.",en:"I like it."},{ka:"არ მომწონს.",en:"I don't like it."},{ka:"მშვენიერია!",en:"It's wonderful!"}
  ],
  "კითხვები ❓":[
    {ka:"ეს რა არის?",en:"What is this?"},{ka:"სად არის?",en:"Where is it?"},{ka:"ეს ვინ არის?",en:"Who is this?"},
    {ka:"შემიძლია მქონდეს?",en:"Can I have it?"},{ka:"რამდენია?",en:"How many?"},{ka:"რომელი საათია?",en:"What time is it?"},
    {ka:"რატომ?",en:"Why?"},{ka:"ეს ვისია?",en:"Whose is this?"},{ka:"რა ფერია?",en:"What colour is it?"},
    {ka:"სად მიდიხარ?",en:"Where are you going?"}
  ],
  "ყოველდღიური ⭐":[
    {ka:"დიახ.",en:"Yes."},{ka:"არა.",en:"No."},{ka:"მეც.",en:"Me too."},{ka:"რა თქმა უნდა.",en:"Of course."},
    {ka:"წავედით!",en:"Let's go!"},{ka:"მოიცადე წუთით.",en:"Wait a minute."},{ka:"ფრთხილად!",en:"Be careful!"},
    {ka:"შეხედე!",en:"Look!"},{ka:"აქ მოდი.",en:"Come here."},{ka:"ეს ჩემია.",en:"It's mine."},
    {ka:"მზად ვარ.",en:"I'm ready."},{ka:"მშვენიერია!",en:"Great!"}
  ]
};
window.PHRASES = PHRASES;

/* ── ALPHABETS (letter → example word + picture) ── */
const KA_ALPHA = [
  {l:'ა',x:[['ავტობუსი','🚌'],['ანანასი','🍍'],['არწივი','🦅']]},
  {l:'ბ',x:[['ბურთი','⚽'],['ბაყაყი','🐸'],['ბანანი','🍌']]},
  {l:'გ',x:[['გული','❤️'],['გველი','🐍'],['გიტარა','🎸']]},
  {l:'დ',x:[['დათვი','🐻'],['დინოზავრი','🦕'],['დოლი','🥁']]},
  {l:'ე',x:[['ეზო','🏡'],['ექიმი','👨‍⚕️'],['ერბო','🧈']]},
  {l:'ვ',x:[['ვაშლი','🍎'],['ვარდი','🌹'],['ვეშაპი','🐳']]},
  {l:'ზ',x:[['ზღვა','🌊'],['ზებრა','🦓'],['ზარი','🔔']]},
  {l:'თ',x:[['თევზი','🐟'],['თოვლი','❄️'],['თაგვი','🐭']]},
  {l:'ი',x:[['ია','🌸'],['ისარი','🏹'],['ინდაური','🦃']]},
  {l:'კ',x:[['კატა','🐱'],['კიბე','🪜'],['კენგურუ','🦘']]},
  {l:'ლ',x:[['ლომი','🦁'],['ლიმონი','🍋'],['ლამპა','💡']]},
  {l:'მ',x:[['მზე','☀️'],['მანქანა','🚗'],['მელა','🦊']]},
  {l:'ნ',x:[['ნავი','⛵'],['ნიანგი','🐊'],['ნემსი','🪡']]},
  {l:'ო',x:[['ობობა','🕷️'],['ომარი','🦞'],['ოთხი','4️⃣']]},
  {l:'პ',x:[['პური','🍞'],['პომიდორი','🍅'],['პინგვინი','🐧']]},
  {l:'ჟ',x:[['ჟირაფი','🦒'],['ჟოლო','🫐']]},
  {l:'რ',x:[['რძე','🥛'],['რაკეტა','🚀'],['რგოლი','💍']]},
  {l:'ს',x:[['სახლი','🏠'],['სოკო','🍄'],['სკამი','🪑']]},
  {l:'ტ',x:[['ტორტი','🎂'],['ტრაქტორი','🚜'],['ტელეფონი','📱']]},
  {l:'უ',x:[['უჯრა','🗄️'],['უთო','🔌']]},
  {l:'ფ',x:[['ფანქარი','✏️'],['ფეხსაცმელი','👟'],['ფუტკარი','🐝']]},
  {l:'ქ',x:[['ქოლგა','☂️'],['ქუდი','🎩'],['ქათამი','🐔']]},
  {l:'ღ',x:[['ღორი','🐷'],['ღრუბელი','☁️']]},
  {l:'ყ',x:[['ყვავილი','🌷'],['ყურძენი','🍇'],['ყველი','🧀']]},
  {l:'შ',x:[['შარვალი','👖'],['შაქარი','🍬'],['შუშა','🫙']]},
  {l:'ჩ',x:[['ჩანთა','🎒'],['ჩიტი','🐦'],['ჩექმა','🥾']]},
  {l:'ც',x:[['ცხენი','🐎'],['ცეცხლი','🔥'],['ცხვარი','🐑']]},
  {l:'ძ',x:[['ძაღლი','🐕'],['ძეხვი','🌭'],['ძროხა','🐄']]},
  {l:'წ',x:[['წიგნი','📖'],['წყალი','💧'],['წითელი','🔴']]},
  {l:'ჭ',x:[['ჭია','🐛'],['ჭიქა','🥤']]},
  {l:'ხ',x:[['ხე','🌳'],['ხახვი','🧅'],['ხილი','🍉']]},
  {l:'ჯ',x:[['ჯიხვი','🐐'],['ჯვარი','✝️'],['ჯადოქარი','🧙']]},
  {l:'ჰ',x:[['ჰიპოპოტამი','🦛'],['ჰაერი','💨']]}
];
const EN_ALPHA = [
  {l:'A',x:[['apple','🍎'],['ant','🐜'],['airplane','✈️']]},
  {l:'B',x:[['ball','⚽'],['bear','🐻'],['banana','🍌']]},
  {l:'C',x:[['cat','🐱'],['car','🚗'],['cake','🎂']]},
  {l:'D',x:[['dog','🐕'],['duck','🦆'],['drum','🥁']]},
  {l:'E',x:[['elephant','🐘'],['egg','🥚'],['eagle','🦅']]},
  {l:'F',x:[['fish','🐟'],['frog','🐸'],['flower','🌸']]},
  {l:'G',x:[['giraffe','🦒'],['goat','🐐'],['grapes','🍇']]},
  {l:'H',x:[['house','🏠'],['hat','🎩'],['horse','🐴']]},
  {l:'I',x:[['igloo','🧊'],['ice cream','🍦'],['island','🏝️']]},
  {l:'J',x:[['juice','🧃'],['jellyfish','🪼'],['jacket','🧥']]},
  {l:'K',x:[['kite','🪁'],['key','🔑'],['kangaroo','🦘']]},
  {l:'L',x:[['lion','🦁'],['lemon','🍋'],['leaf','🍃']]},
  {l:'M',x:[['moon','🌙'],['mouse','🐭'],['monkey','🐵']]},
  {l:'N',x:[['nest','🪺'],['nose','👃'],['net','🥅']]},
  {l:'O',x:[['orange','🍊'],['octopus','🐙'],['owl','🦉']]},
  {l:'P',x:[['pen','🖊️'],['pig','🐷'],['pizza','🍕']]},
  {l:'Q',x:[['queen','👑'],['question','❓'],['quilt','🛏️']]},
  {l:'R',x:[['rainbow','🌈'],['rabbit','🐰'],['rocket','🚀']]},
  {l:'S',x:[['sun','☀️'],['star','⭐'],['snake','🐍']]},
  {l:'T',x:[['tree','🌳'],['tiger','🐯'],['train','🚂']]},
  {l:'U',x:[['umbrella','☂️'],['unicorn','🦄'],['up','⬆️']]},
  {l:'V',x:[['violin','🎻'],['van','🚐'],['volcano','🌋']]},
  {l:'W',x:[['water','💧'],['whale','🐳'],['watch','⌚']]},
  {l:'X',x:[['xylophone','🎹'],['box','📦'],['fox','🦊']]},
  {l:'Y',x:[['yo-yo','🪀'],['yacht','⛵'],['yarn','🧶']]},
  {l:'Z',x:[['zebra','🦓'],['zoo','🦁'],['zero','0️⃣']]}
];

const AGE_CATS = {
  masho:["ფერები 🎨","ცხოველები 🐾","საკვები 🍎","ოჯახი 👨‍👩‍👧‍👦"],
  niko:Object.keys(WORDS),
  guest:Object.keys(WORDS)
};

// reverse lookup: english -> {ka, emoji, cat}
const WORD_INDEX = {};
Object.entries(WORDS).forEach(([cat,arr])=>arr.forEach(w=>{WORD_INDEX[w.en]={...w,cat};}));
window.WORD_INDEX = WORD_INDEX;

const COUNTING = [];
(function(){
  const e=['🍎','⭐','🐟','🌸','🎈','🍌','🦋','⚽','🐰','🍓'];
  const ka=['','ერთი','ორი','სამი','ოთხი','ხუთი','ექვსი','შვიდი','რვა','ცხრა','ათი'];
  const en=['','one','two','three','four','five','six','seven','eight','nine','ten'];
  for(let i=1;i<=10;i++)COUNTING.push({num:i,emoji:e[i-1].repeat(i),ka:ka[i],en:en[i]});
})();

/* ── #1 GEORGIAN READING (V1): syllable→word blending. lvl = difficulty (extensible
   per the v2.00 level-tag architecture: lvl 1 = 2 syllables, lvl 2 = 3 syllables). ── */
const READING_KA=[
  {w:'მამა',   syl:['მა','მა'],       e:'👨', lvl:1},
  {w:'დედა',   syl:['დე','და'],       e:'👩', lvl:1},
  {w:'ბაბუ',   syl:['ბა','ბუ'],       e:'👴', lvl:1},
  {w:'კატა',   syl:['კა','ტა'],       e:'🐱', lvl:1},
  {w:'პური',   syl:['პუ','რი'],       e:'🍞', lvl:1},
  {w:'ბანანი', syl:['ბა','ნა','ნი'],  e:'🍌', lvl:2},
  {w:'ლიმონი', syl:['ლი','მო','ნი'],  e:'🍋', lvl:2},
  {w:'ბაყაყი', syl:['ბა','ყა','ყი'],  e:'🐸', lvl:2},
  {w:'ტომატი', syl:['ტო','მა','ტი'],  e:'🍅', lvl:2},
  {w:'მანქანა',syl:['მან','ქა','ნა'], e:'🚗', lvl:2}
];

/* #1 (next step) Georgian SENTENCE reading: read a short sentence, hear it (recorded EkaNeural
   clips, never robot TTS), then pick the matching picture. Subject + verb, early-reader simple. */
const READING_SENT_KA=[
  {s:'კატა დარბის',     e:'🐱'},
  {s:'ძაღლი ყეფს',      e:'🐶'},
  {s:'მზე ანათებს',     e:'☀️'},
  {s:'ჩიტი ფრინავს',    e:'🐦'},
  {s:'თევზი ცურავს',    e:'🐟'},
  {s:'ბაყაყი ხტება',    e:'🐸'},
  {s:'ბავშვი თამაშობს', e:'🧒'},
  {s:'ყვავილი იზრდება', e:'🌸'}
];

/* ── KINGS ENGLISH, expanded (Cambridge YLE Starters→Movers) ── */
const KINGS_ENG = [
  // Task: picture → word
  {type:'pic2word',emoji:'🖊️',q:'It is a _____.',opts:['pen','book','car'],a:'pen',hint:'ცი (c)'},
  {type:'pic2word',emoji:'📖',q:'It is a _____.',opts:['table','box','book'],a:'book'},
  {type:'pic2word',emoji:'🏠',q:'It is a _____.',opts:['house','car','desk'],a:'house'},
  {type:'pic2word',emoji:'⭐',q:'It is a _____.',opts:['desk','box','star'],a:'star'},
  {type:'pic2word',emoji:'🚲',q:'It is a _____.',opts:['bike','crocodile','car'],a:'bike'},
  {type:'pic2word',emoji:'🦒',q:'It is a _____.',opts:['giraffe','zebra','horse'],a:'giraffe'},
  {type:'pic2word',emoji:'🌂',q:'It is an _____.',opts:['apple','umbrella','orange'],a:'umbrella'},
  {type:'pic2word',emoji:'📖🖊️',q:'I see _____.',opts:['a book and a pen','a pen and a ball','a bag and a pen'],a:'a book and a pen'},
  {type:'pic2word',emoji:'🐕🐱',q:'I see _____.',opts:['a dog and a cat','a dog and a ball','a cat and a book'],a:'a dog and a cat'},
  // Task: Georgian → English
  {type:'translate',q:'ბაყაყი',opts:['a dog','a frog','a star'],a:'a frog'},
  {type:'translate',q:'პატარა',opts:['small','big','red'],a:'small'},
  {type:'translate',q:'ლურჯი ჭიქა',opts:['a black cup','a blue cup','a yellow cup'],a:'a blue cup'},
  {type:'translate',q:'ბედნიერი ოჯახი',opts:['a big family','a happy family','a small family'],a:'a happy family'},
  {type:'translate',q:'წვიმიანი დღე',opts:['a sunny day','a cold day','a rainy day'],a:'a rainy day'},
  {type:'translate',q:'სამი თეთრი იხვი',opts:['three white ducks','two white ducks','three white dogs'],a:'three white ducks'},
  // Task: spelling
  {type:'spelling',q:'Which is correct?',opts:['book','buuk','bok'],a:'book'},
  {type:'spelling',q:'Which is correct?',opts:['lovelly','lovly','lovely'],a:'lovely'},
  {type:'spelling',q:'შენობა: Which is correct?',opts:['bulding','bilding','building'],a:'building'},
  {type:'spelling',q:'პარასკევი: Which is correct?',opts:['Friday','Fridey','Friady'],a:'Friday'},
  {type:'spelling',q:'მეგობარი: Which is correct?',opts:['freind','friend','frend'],a:'friend'},
  // Task: numbers
  {type:'number',emoji:'7️⃣',q:'7',opts:['seven','one','six'],a:'seven'},
  {type:'number',emoji:'🔟',q:'10',opts:['nine','ten','seven'],a:'ten'},
  {type:'number',emoji:'1️⃣2️⃣',q:'12',opts:['twenty','twelve','twenty-two'],a:'twelve'},
  // Task: grammar (Movers)
  {type:'grammar',q:'I _____ happy.',opts:['am','is','are'],a:'am'},
  {type:'grammar',q:'Your books _____ here.',opts:['are','is','do'],a:'are'},
  {type:'grammar',q:'_____ name is Maria.',opts:['She','Her','Him'],a:'Her'},
  {type:'grammar',q:'There _____ two cats.',opts:['are','is','am'],a:'are'},
  {type:'grammar',q:'She _____ to school every day.',opts:['go','goes','going'],a:'goes'},
  {type:'grammar',q:'Look! The dog _____ running.',opts:['is','are','am'],a:'is'},
  {type:'grammar',q:'This is _____ apple.',opts:['a','an','the'],a:'an'},
  {type:'grammar',q:'The cat is _____ the box.',opts:['in','on','of'],a:'in'},
  {type:'grammar',q:'I have two _____.',opts:['foot','foots','feet'],a:'feet'},
  {type:'grammar',q:'_____ you like apples?',opts:['Do','Does','Is'],a:'Do'}
];
const TYPE_LABEL={pic2word:'🖼️ Picture',translate:'🇬🇪→🇬🇧 Translate',spelling:'✍️ Spelling',number:'🔢 Number',grammar:'📝 Grammar'};

/* ── KINGS MATH, expanded (word problems / logic / sequences) ── */
const KINGS_MATH = [
  {q:'რამდენი ფეხი აქვს 3 კატას ჯამში?',a:12,opts:[12,6,8],emoji:'🐱🐱🐱',kind:'mul',hintA:3,hintB:4},
  {q:'რამდენი ფეხი აქვს 2 ძაღლს ჯამში?',a:8,opts:[8,6,4],emoji:'🐕🐕',kind:'mul',hintA:2,hintB:4},
  {q:'3 ვაშლი + 4 ვაშლი = ?',a:7,opts:[7,6,8],emoji:'🍎🍎🍎 ➕ 🍎🍎🍎🍎',kind:'add',hintA:3,hintB:4},
  {q:'8 ბურთიდან 3 დაიკარგა. რამდენი დარჩა?',a:5,opts:[5,6,4],emoji:'⚽',kind:'sub',hintA:8,hintB:3},
  {q:'5 ბავშვს თითო 2 ტკბილეული აქვს. ჯამში რამდენია?',a:10,opts:[10,7,12],emoji:'🧒🧒🧒🧒🧒',kind:'mul',hintA:5,hintB:2},
  {q:'მაღაზიაში 6 ვაშლი იყო, კიდევ 7 მოიტანეს. ახლა რამდენია?',a:13,opts:[13,12,14],emoji:'🍎',kind:'add',hintA:6,hintB:7},
  {q:'5, 7, 9, ?, 13. რა უნდა იყოს ?-ის ნაცვლად?',a:11,opts:[11,15,10],emoji:'🔢',kind:'pat',step:2},
  {q:'2, 4, 6, 8, ?. შემდეგი?',a:10,opts:[10,9,12],emoji:'🔢',kind:'pat',step:2},
  {q:'19, 15, 11, 7, ?. შემდეგი?',a:3,opts:[3,5,6],emoji:'🔢',kind:'pat',step:-4},
  {q:'3, 6, 12, 24, ?. შემდეგი?',a:48,opts:[48,36,30],emoji:'🔢',kind:'double'},
  {q:'რომელი არ უდრის 11-ს?',a:'3+7',opts:['5+6','13-2','3+7'],emoji:'🤔',text:true,kind:'logic'},
  {q:'რომელი არ უდრის 10-ს?',a:'6+5',opts:['7+3','15-5','6+5'],emoji:'🤔',text:true,kind:'logic'},
  {q:'კიბეს 11 საფეხური აქვს. შუა საფეხური რომელია?',a:6,opts:[6,5,7],emoji:'🪜',kind:'logic'},
  {q:'10 ფანქარი 2 ბავშვმა თანაბრად გაიყო. რამდენი ერგო თითოს?',a:5,opts:[5,4,6],emoji:'✏️',kind:'div',hintA:10,hintB:2}
];

/* ── SHAPES (geometry, ka/en + emoji) ── */
const SHAPES = [
  {ka:'წრე',en:'circle',e:'⭕'},
  {ka:'კვადრატი',en:'square',e:'🟦'},
  {ka:'სამკუთხედი',en:'triangle',e:'🔺'},
  {ka:'ვარსკვლავი',en:'star',e:'⭐'},
  {ka:'გული',en:'heart',e:'❤️'},
  {ka:'რომბი',en:'diamond',e:'🔷'}
];
