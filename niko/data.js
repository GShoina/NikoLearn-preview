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
    {ka:"ფრინველი",en:"bird",emoji:"🐦"},{ka:"ბაყაყი",en:"frog",emoji:"🐸"},{ka:"ზებრა",en:"zebra",emoji:"🦓"},
    {ka:"ძროხა",en:"cow",emoji:"🐄"},{ka:"ღორი",en:"pig",emoji:"🐷"},{ka:"ცხვარი",en:"sheep",emoji:"🐑"},
    {ka:"თხა",en:"goat",emoji:"🐐"},{ka:"მგელი",en:"wolf",emoji:"🐺"},{ka:"ვეფხვი",en:"tiger",emoji:"🐯"},
    {ka:"პინგვინი",en:"penguin",emoji:"🐧"},{ka:"ირემი",en:"deer",emoji:"🦌"},
    {ka:"ბუ",en:"owl",emoji:"🦉"},{ka:"ფუტკარი",en:"bee",emoji:"🐝"},{ka:"კენგურუ",en:"kangaroo",emoji:"🦘"},
    {ka:"ჟირაფი",en:"giraffe",emoji:"🦒"},{ka:"გველი",en:"snake",emoji:"🐍"},{ka:"კუ",en:"turtle",emoji:"🐢"}
  ],
  "საკვები 🍎":[
    {ka:"ვაშლი",en:"apple",emoji:"🍎"},{ka:"პური",en:"bread",emoji:"🍞"},{ka:"რძე",en:"milk",emoji:"🥛"},
    {ka:"წყალი",en:"water",emoji:"💧"},{ka:"ბანანი",en:"banana",emoji:"🍌"},{ka:"კვერცხი",en:"egg",emoji:"🥚"},
    {ka:"ყველი",en:"cheese",emoji:"🧀"},{ka:"ნაყინი",en:"ice cream",emoji:"🍦"},{ka:"ტორტი",en:"cake",emoji:"🎂"},
    {ka:"ჩაი",en:"tea",emoji:"🍵"},
    {ka:"სტაფილო",en:"carrot",emoji:"🥕"},{ka:"პომიდორი",en:"tomato",emoji:"🍅"},{ka:"ყურძენი",en:"grapes",emoji:"🍇"},
    {ka:"მარწყვი",en:"strawberry",emoji:"🍓"},{ka:"მსხალი",en:"pear",emoji:"🍐"},{ka:"სიმინდი",en:"corn",emoji:"🌽"},
    {ka:"შოკოლადი",en:"chocolate",emoji:"🍫"},{ka:"ნამცხვარი",en:"cookie",emoji:"🍪"},
    {ka:"ლიმონი",en:"lemon",emoji:"🍋"},{ka:"სოკო",en:"mushroom",emoji:"🍄"},{ka:"თაფლი",en:"honey",emoji:"🍯"},
    {ka:"ბურგერი",en:"burger",emoji:"🍔"}
  ],
  "ოჯახი 👨‍👩‍👧‍👦":[
    {ka:"დედა",en:"mother",emoji:"👩"},{ka:"მამა",en:"father",emoji:"👨"},{ka:"ძმა",en:"brother",emoji:"👦"},
    {ka:"და",en:"sister",emoji:"👧"},{ka:"ბებია",en:"grandmother",emoji:"👵"},{ka:"ბაბუა",en:"grandfather",emoji:"👴"},
    {ka:"ბავშვი",en:"child",emoji:"🧒"},{ka:"ოჯახი",en:"family",emoji:"👨‍👩‍👧‍👦"},
    {ka:"ჩვილი",en:"baby",emoji:"👶"},{ka:"ბიძა",en:"uncle",emoji:"🧔"},
    {ka:"დეიდა",en:"aunt",emoji:"👩"},{ka:"ბიძაშვილი",en:"cousin",emoji:"🧑"}
  ],
  "ბუნება 🌿":[
    {ka:"მზე",en:"sun",emoji:"☀️"},{ka:"მთვარე",en:"moon",emoji:"🌙"},{ka:"ვარსკვლავი",en:"star",emoji:"⭐"},
    {ka:"წვიმა",en:"rain",emoji:"🌧️"},{ka:"ხე",en:"tree",emoji:"🌳"},{ka:"ყვავილი",en:"flower",emoji:"🌸"},
    {ka:"ზღვა",en:"sea",emoji:"🌊"},{ka:"თოვლი",en:"snow",emoji:"❄️"},{ka:"მთა",en:"mountain",emoji:"⛰️"},
    {ka:"ღრუბელი",en:"cloud",emoji:"☁️"},
    {ka:"ცეცხლი",en:"fire",emoji:"🔥"},{ka:"მდინარე",en:"river",emoji:"🏞️"},{ka:"ფოთოლი",en:"leaf",emoji:"🍃"},
    {ka:"ბალახი",en:"grass",emoji:"🌱"},{ka:"ქვა",en:"stone",emoji:"🪨"},{ka:"კუნძული",en:"island",emoji:"🏝️"}
  ],
  "სკოლა 🏫":[
    {ka:"წიგნი",en:"book",emoji:"📖"},{ka:"კალამი",en:"pen",emoji:"🖊️"},{ka:"ფანქარი",en:"pencil",emoji:"✏️"},
    {ka:"მასწავლებელი",en:"teacher",emoji:"👨‍🏫"},{ka:"სკოლა",en:"school",emoji:"🏫"},{ka:"ჩანთა",en:"bag",emoji:"🎒"},
    {ka:"რვეული",en:"notebook",emoji:"📓"},{ka:"სკამი",en:"chair",emoji:"🪑"},
    {ka:"სახაზავი",en:"ruler",emoji:"📏"},{ka:"საღებავი",en:"paint",emoji:"🎨"},{ka:"კომპიუტერი",en:"computer",emoji:"💻"},
    {ka:"რუკა",en:"map",emoji:"🗺️"},{ka:"მაკრატელი",en:"scissors",emoji:"✂️"},{ka:"გლობუსი",en:"globe",emoji:"🌐"}
  ],
  "ტანსაცმელი 👕":[
    {ka:"პერანგი",en:"shirt",emoji:"👕"},{ka:"კაბა",en:"dress",emoji:"👗"},{ka:"ქურთუკი",en:"jacket",emoji:"🧥"},
    {ka:"ჯინსი",en:"jeans",emoji:"👖"},{ka:"ფეხსაცმელი",en:"shoes",emoji:"👟"},{ka:"ქუდი",en:"hat",emoji:"🎩"},
    {ka:"წინდა",en:"socks",emoji:"🧦"},{ka:"სათვალე",en:"glasses",emoji:"👓"},
    {ka:"ხელთათმანი",en:"gloves",emoji:"🧤"},{ka:"შარფი",en:"scarf",emoji:"🧣"},{ka:"ჩექმა",en:"boots",emoji:"🥾"},
    {ka:"ბეჭედი",en:"ring",emoji:"💍"},{ka:"გვირგვინი",en:"crown",emoji:"👑"}
  ],
  "ტრანსპორტი 🚗":[
    {ka:"მანქანა",en:"car",emoji:"🚗"},{ka:"ავტობუსი",en:"bus",emoji:"🚌"},{ka:"თვითმფრინავი",en:"plane",emoji:"✈️"},
    {ka:"მატარებელი",en:"train",emoji:"🚂"},{ka:"ველოსიპედი",en:"bike",emoji:"🚲"},{ka:"ნავი",en:"boat",emoji:"⛵"},
    {ka:"ტაქსი",en:"taxi",emoji:"🚕"},{ka:"სასწრაფო",en:"ambulance",emoji:"🚑"},{ka:"სახანძრო",en:"fire truck",emoji:"🚒"},
    {ka:"პოლიციის მანქანა",en:"police car",emoji:"🚓"},{ka:"ვერტმფრენი",en:"helicopter",emoji:"🚁"},{ka:"სატვირთო",en:"truck",emoji:"🚚"},
    {ka:"მოტოციკლი",en:"motorbike",emoji:"🏍️"},{ka:"გემი",en:"ship",emoji:"🚢"},{ka:"ტრაქტორი",en:"tractor",emoji:"🚜"}
  ],
  "სხეული 🧍":[
    {ka:"თავი",en:"head",emoji:"🧠"},{ka:"ხელი",en:"hand",emoji:"✋"},{ka:"ფეხი",en:"foot",emoji:"🦶"},
    {ka:"თვალი",en:"eye",emoji:"👁️"},{ka:"ყური",en:"ear",emoji:"👂"},{ka:"ცხვირი",en:"nose",emoji:"👃"},
    {ka:"პირი",en:"mouth",emoji:"👄"},{ka:"კბილი",en:"tooth",emoji:"🦷"},
    {ka:"თმა",en:"hair",emoji:"💇"},{ka:"თითი",en:"finger",emoji:"👆"},{ka:"მუხლი",en:"knee",emoji:"🦵"},
    {ka:"ენა",en:"tongue",emoji:"👅"},{ka:"მკლავი",en:"arm",emoji:"💪"}
  ],
  "სპორტი ⚽":[
    {ka:"ფეხბურთი",en:"football",emoji:"⚽"},{ka:"კალათბურთი",en:"basketball",emoji:"🏀"},{ka:"ცურვა",en:"swimming",emoji:"🏊"},
    {ka:"სირბილი",en:"running",emoji:"🏃"},{ka:"ტენისი",en:"tennis",emoji:"🎾"},{ka:"ცეკვა",en:"dancing",emoji:"💃"},
    {ka:"ფრენბურთი",en:"volleyball",emoji:"🏐"},{ka:"კრივი",en:"boxing",emoji:"🥊"},{ka:"ველოსპორტი",en:"cycling",emoji:"🚴"},
    {ka:"სრიალი",en:"skating",emoji:"⛸️"},{ka:"მაგიდის ჩოგბურთი",en:"table tennis",emoji:"🏓"},
    {ka:"რაგბი",en:"rugby",emoji:"🏉"}
  ],
  "ამინდი 🌦️":[
    {ka:"მზიანი",en:"sunny",emoji:"☀️"},{ka:"წვიმიანი",en:"rainy",emoji:"🌧️"},{ka:"ცივი",en:"cold",emoji:"🥶"},
    {ka:"ცხელი",en:"hot",emoji:"🔥"},{ka:"ქარიანი",en:"windy",emoji:"💨"},{ka:"თოვლიანი",en:"snowy",emoji:"🌨️"},
    {ka:"ღრუბლიანი",en:"cloudy",emoji:"☁️"},{ka:"ნისლიანი",en:"foggy",emoji:"🌫️"},{ka:"ჭექა-ქუხილი",en:"stormy",emoji:"⛈️"},
    {ka:"ცისარტყელა",en:"rainbow",emoji:"🌈"},{ka:"ელვა",en:"lightning",emoji:"⚡"}
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
    {ka:"მეხანძრე",en:"firefighter",emoji:"👨‍🚒"},{ka:"ვეტერინარი",en:"vet",emoji:"🧑‍⚕️"},{ka:"მუსიკოსი",en:"musician",emoji:"🎤"},
    {ka:"პოლიციელი",en:"police officer",emoji:"👮"},{ka:"ფერმერი",en:"farmer",emoji:"🧑‍🌾"}
  ]
};

/* ── PHRASES, ~100 short, everyday English (grouped by theme) ── */
const PHRASES = {
  "მისალმება 👋":[
    {ka:"გამარჯობა!",en:"Hello!"},{ka:"სალამი!",en:"Hi!"},{ka:"დილა მშვიდობისა!",en:"Good morning!"},
    {ka:"საღამო მშვიდობისა!",en:"Good evening!"},{ka:"ღამე მშვიდობისა!",en:"Good night!"},{ka:"ნახვამდის!",en:"Goodbye!"},
    {ka:"კიდევ შევხვდებით!",en:"See you later!"},{ka:"როგორ ხარ?",en:"How are you?"},{ka:"კარგად ვარ, მადლობა.",en:"I'm fine, thanks."},
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
  {l:'ჟ',x:[['ჟირაფი','🦒']]},
  {l:'რ',x:[['რძე','🥛'],['რაკეტა','🚀'],['რგოლი','💍']]},
  {l:'ს',x:[['სახლი','🏠'],['სოკო','🍄'],['სკამი','🪑']]},
  {l:'ტ',x:[['ტორტი','🎂'],['ტრაქტორი','🚜'],['ტელეფონი','📱']]},
  {l:'უ',x:[['უჯრა','🗄️']]},
  {l:'ფ',x:[['ფანქარი','✏️'],['ფეხსაცმელი','👟'],['ფუტკარი','🐝']]},
  {l:'ქ',x:[['ქოლგა','☂️'],['ქუდი','🎩'],['ქათამი','🐔']]},
  {l:'ღ',x:[['ღორი','🐷'],['ღრუბელი','☁️']]},
  {l:'ყ',x:[['ყვავილი','🌷'],['ყურძენი','🍇'],['ყველი','🧀']]},
  {l:'შ',x:[['შარვალი','👖'],['შაქარი','🍬'],['შოკოლადი','🍫']]},
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
  {l:'X',x:[['xylophone','🎹'],['x-ray','🩻']]},
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
  {w:'პომიდორი', syl:['პო','მი','დო','რი'], e:'🍅', lvl:2},
  {w:'მანქანა',syl:['მან','ქა','ნა'], e:'🚗', lvl:2},
  {w:'ვაშლი', syl:['ვაშ','ლი'],       e:'🍎', lvl:2},
  {w:'ლომი',  syl:['ლო','მი'],        e:'🦁', lvl:1},
  {w:'ძაღლი', syl:['ძაღ','ლი'],       e:'🐶', lvl:2},
  {w:'წიგნი', syl:['წიგ','ნი'],       e:'📖', lvl:2},
  {w:'ბურთი', syl:['ბურ','თი'],       e:'⚽', lvl:2},
  {w:'სახლი', syl:['სახ','ლი'],       e:'🏠', lvl:2},
  {w:'მელა',  syl:['მე','ლა'],        e:'🦊', lvl:1},
  {w:'ცხენი', syl:['ცხე','ნი'],       e:'🐴', lvl:2},
  // v1.118 — Georgian reading expansion (clips: edge-tts ka-GE-EkaNeural)
  {w:'ხელი',   syl:['ხე','ლი'],       e:'✋', lvl:1},
  {w:'ფეხი',   syl:['ფე','ხი'],       e:'🦶', lvl:1},
  {w:'თევზი',  syl:['თევ','ზი'],      e:'🐟', lvl:2},
  {w:'ჩიტი',   syl:['ჩი','ტი'],       e:'🐦', lvl:1},
  {w:'კარი',   syl:['კა','რი'],       e:'🚪', lvl:1},
  {w:'ნავი',   syl:['ნა','ვი'],       e:'⛵', lvl:1},
  {w:'ფული',   syl:['ფუ','ლი'],       e:'💰', lvl:1},
  {w:'პეპელა', syl:['პე','პე','ლა'],  e:'🦋', lvl:2},
  // v1.131 — Georgian reading expansion #2 (clips: edge-tts ka-GE-EkaNeural, krd_017+)
  {w:'გოგო',   syl:['გო','გო'],       e:'👧', lvl:1},
  {w:'ბიჭი',   syl:['ბი','ჭი'],       e:'👦', lvl:1},
  {w:'ყური',   syl:['ყუ','რი'],       e:'👂', lvl:1},
  {w:'ხილი',   syl:['ხი','ლი'],       e:'🍇', lvl:1},
  {w:'თვალი',  syl:['თვა','ლი'],      e:'👁️', lvl:2},
  {w:'წყალი',  syl:['წყა','ლი'],      e:'💧', lvl:2},
  {w:'თოვლი',  syl:['თოვ','ლი'],      e:'❄️', lvl:2},
  {w:'მთვარე', syl:['მთვა','რე'],     e:'🌙', lvl:2},
  {w:'ფანჯარა',syl:['ფან','ჯა','რა'], e:'🪟', lvl:2},
  {w:'კვერცხი',syl:['კვერ','ცხი'],    e:'🥚', lvl:2}
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
  {s:'ყვავილი იზრდება', e:'🌸'},
  {s:'ლომი ღრიალებს',    e:'🦁'},
  {s:'ცხენი დარბის',     e:'🐴'},
  {s:'დათვს სძინავს',    e:'🐻'},
  {s:'მელა გარბის',      e:'🦊'},
  {s:'ბავშვი კითხულობს', e:'📖'},
  {s:'დედა მღერის',      e:'👩'},
  // v1.118 — Georgian reading expansion (clips: edge-tts ka-GE-EkaNeural)
  {s:'ბავშვი ხატავს',     e:'🎨'},
  {s:'კურდღელი ხტება',    e:'🐰'},
  {s:'ჩიტი მღერის',       e:'🐦'},
  {s:'გოგო ცეკვავს',      e:'💃'},
  {s:'ბიჭი დარბის',       e:'🏃'},
  {s:'ფუტკარი დაფრინავს', e:'🐝'},
  // v1.131 — Georgian reading expansion #2 (clips: edge-tts ka-GE-EkaNeural, krd_034+)
  {s:'ძაღლი ჭამს',      e:'🐶'},
  {s:'კატა თამაშობს',   e:'🐱'},
  {s:'თოვლი მოდის',     e:'❄️'},
  {s:'წვიმა მოდის',     e:'🌧️'},
  {s:'გოგო მღერის',     e:'👧'},
  {s:'ბიჭი ხტება',      e:'🤸'},
  {s:'ბავშვს სძინავს',  e:'😴'},
  {s:'მზე ბრწყინავს',   e:'☀️'}
];

/* ── KINGS ENGLISH (Cambridge YLE) — each item carries `lv` = YLE band (1 Starters / 2 Movers /
   3 Flyers) so startKings ladders it exactly like the other YLE pools (cumulative lv<=selected).
   Levels assigned 2026-06-22 per real YLE wordlists/grammar: single common nouns + basic be = Starters;
   2-word phrases, less-common vocab, prepositions, teen numbers = Movers; 3rd-person -s, present
   continuous, irregular plurals, 3-word number+adjective+noun = Flyers. ── */
const KINGS_ENG = [
  // Task: picture → word
  {lv:1,type:'pic2word',emoji:'🖊️',q:'It is a _____.',opts:['pen','book','car'],a:'pen',hint:'ცი (c)'},
  {lv:1,type:'pic2word',emoji:'📖',q:'It is a _____.',opts:['table','box','book'],a:'book'},
  {lv:1,type:'pic2word',emoji:'🏠',q:'It is a _____.',opts:['house','car','desk'],a:'house'},
  {lv:1,type:'pic2word',emoji:'⭐',q:'It is a _____.',opts:['desk','box','star'],a:'star'},
  {lv:1,type:'pic2word',emoji:'🚲',q:'It is a _____.',opts:['bike','bus','car'],a:'bike'},
  {lv:2,type:'pic2word',emoji:'🦒',q:'It is a _____.',opts:['giraffe','zebra','horse'],a:'giraffe'},
  {lv:2,type:'pic2word',emoji:'🌂',q:'It is an _____.',opts:['apple','umbrella','orange'],a:'umbrella'},
  {lv:2,type:'pic2word',emoji:'📖🖊️',q:'I see _____.',opts:['a book and a pen','a pen and a ball','a bag and a pen'],a:'a book and a pen'},
  {lv:2,type:'pic2word',emoji:'🐕🐱',q:'I see _____.',opts:['a dog and a cat','a dog and a ball','a cat and a book'],a:'a dog and a cat'},
  // Task: Georgian → English
  {lv:1,type:'translate',q:'ბაყაყი',opts:['a dog','a frog','a star'],a:'a frog'},
  {lv:1,type:'translate',q:'პატარა',opts:['small','big','red'],a:'small'},
  {lv:2,type:'translate',q:'ლურჯი ჭიქა',opts:['a black cup','a blue cup','a yellow cup'],a:'a blue cup'},
  {lv:2,type:'translate',q:'ბედნიერი ოჯახი',opts:['a big family','a happy family','a small family'],a:'a happy family'},
  {lv:2,type:'translate',q:'წვიმიანი დღე',opts:['a sunny day','a cold day','a rainy day'],a:'a rainy day'},
  {lv:3,type:'translate',q:'სამი თეთრი იხვი',opts:['three white ducks','two white ducks','three white dogs'],a:'three white ducks'},
  // Task: spelling
  {lv:1,type:'spelling',q:'Which is correct?',opts:['book','buuk','bok'],a:'book'},
  {lv:1,type:'spelling',q:'Which is correct?',opts:['happy','hapy','happi'],a:'happy'},
  {lv:2,type:'spelling',q:'შენობა: Which is correct?',opts:['bulding','bilding','building'],a:'building'},
  {lv:2,type:'spelling',q:'პარასკევი: Which is correct?',opts:['Friday','Fridey','Friady'],a:'Friday'},
  {lv:2,type:'spelling',q:'მეგობარი: Which is correct?',opts:['freind','friend','frend'],a:'friend'},
  // Task: numbers
  {lv:1,type:'number',emoji:'7️⃣',q:'7',opts:['seven','one','six'],a:'seven'},
  {lv:1,type:'number',emoji:'🔟',q:'10',opts:['nine','ten','seven'],a:'ten'},
  {lv:2,type:'number',emoji:'1️⃣2️⃣',q:'12',opts:['twenty','twelve','twenty-two'],a:'twelve'},
  // Task: grammar
  {lv:1,type:'grammar',q:'I _____ happy.',opts:['am','is','are'],a:'am'},
  {lv:1,type:'grammar',q:'This is _____ apple.',opts:['a','an','the'],a:'an'},
  {lv:2,type:'grammar',q:'Your books _____ here.',opts:['are','is','do'],a:'are'},
  {lv:2,type:'grammar',q:'_____ name is Maria.',opts:['She','Her','Him'],a:'Her'},
  {lv:2,type:'grammar',q:'There _____ two cats.',opts:['are','is','am'],a:'are'},
  {lv:2,type:'grammar',q:'Fish live _____ water.',opts:['in','on','of'],a:'in'},
  {lv:2,type:'grammar',q:'_____ you like apples?',opts:['Do','Does','Is'],a:'Do'},
  {lv:3,type:'grammar',q:'She _____ to school every day.',opts:['go','goes','going'],a:'goes'},
  {lv:3,type:'grammar',q:'Look! The dog _____ running.',opts:['is','are','am'],a:'is'},
  {lv:3,type:'grammar',q:'I have two _____.',opts:['foot','foots','feet'],a:'feet'}
];
const TYPE_LABEL={pic2word:'🖼️ Picture',translate:'🇬🇪→🇬🇧 Translate',spelling:'✍️ Spelling',number:'🔢 Number',grammar:'📝 Grammar'};

/* ── YLE LISTENING comprehension (sentence level) — owner 2026-06-22; level-laddered 2026-06-22 ──
   Real Cambridge YLE Listening format: the child HEARS a short English sentence and taps the matching
   PICTURE. `lv` = YLE band (1 Starters / 2 Movers / 3 Flyers); rounds draw items with lv<=selected so
   higher bands are cumulative supersets. Distractors differ by ONE attribute so it tests careful
   listening, not guessing. Answers are UNAMBIGUOUS emoji combos. */
const LISTEN_YLE = [
  // lv1 Starters — simple nouns + small numbers
  {lv:1,en:'three cats',          a:'🐱🐱🐱',     opts:['🐱🐱🐱','🐱🐱','🐶🐶🐶']},
  {lv:1,en:'two dogs',            a:'🐕🐕',       opts:['🐕🐕','🐕🐕🐕','🐱🐱']},
  {lv:1,en:'a dog and a ball',    a:'🐕⚽',       opts:['🐕⚽','🐱⚽','🐕📕']},
  {lv:1,en:'five apples',         a:'🍎🍎🍎🍎🍎', opts:['🍎🍎🍎🍎🍎','🍎🍎🍎','🍎🍎🍎🍎']},
  {lv:1,en:'a happy face',        a:'😀',         opts:['😀','😢','😠']},
  {lv:1,en:'a big elephant',      a:'🐘',         opts:['🐘','🐭','🐰']},
  {lv:1,en:'four stars',          a:'⭐⭐⭐⭐',     opts:['⭐⭐⭐⭐','⭐⭐⭐','⭐⭐⭐⭐⭐']},
  {lv:1,en:'two ducks',           a:'🦆🦆',       opts:['🦆🦆','🦆🦆🦆','🐱🐱']},
  {lv:1,en:'three balls',         a:'⚽⚽⚽',     opts:['⚽⚽⚽','⚽⚽','⚽⚽⚽⚽']},
  {lv:1,en:'a fish',              a:'🐟',         opts:['🐟','🐦','🐰']},
  {lv:1,en:'two apples',          a:'🍎🍎',       opts:['🍎🍎','🍎🍎🍎','🍌🍌']},
  // lv2 Movers — two objects, adjectives
  {lv:2,en:'a cat and a fish',    a:'🐱🐟',       opts:['🐱🐟','🐕🐟','🐱🐦']},
  {lv:2,en:'the sun and a tree',  a:'☀️🌳',       opts:['☀️🌳','🌙🌳','☀️🌸']},
  {lv:2,en:'a boy and a girl',    a:'👦👧',       opts:['👦👧','👦👦','👧👧']},
  {lv:2,en:'a cake and a candle', a:'🍰🕯️',      opts:['🍰🕯️','🍰🎈','🍪🕯️']},
  {lv:2,en:'a bird and a flower', a:'🐦🌸',       opts:['🐦🌸','🐦🌳','🦆🌸']},
  {lv:2,en:'a sad face',          a:'😢',         opts:['😢','😀','😮']},
  // lv3 Flyers — longer noun groups, contrast
  {lv:3,en:'three boys and two girls', a:'👦👦👦👧👧', opts:['👦👦👦👧👧','👦👦👧👧👧','👦👦👦👧']},
  {lv:3,en:'a car and a bike',         a:'🚗🚲',       opts:['🚗🚲','🚌🚲','🚗🛴']},
  {lv:3,en:'a cat, a dog and a bird',  a:'🐱🐕🐦',     opts:['🐱🐕🐦','🐱🐕🐟','🐱🐰🐦']},
  {lv:2,en:'two cakes and a candle',   a:'🍰🍰🕯️',     opts:['🍰🍰🕯️','🍰🕯️🕯️','🍪🍪🕯️']}
];

/* ── YLE SPEAKING practice (say-aloud + model self-check + OPTIONAL record→playback) — owner 2026-06-23 ──
   Mirrors the real YLE Speaking format: the examiner shows a picture and asks. The owl reads the English
   prompt aloud, the child answers OUT LOUD, optionally RECORDS & plays back their own voice (in-memory only,
   never saved/sent, deleted on advancing — see games.js speakRec*), then taps „✓ ვთქვი" to see a spoken
   model answer to compare against. NO speech-recognition/grading by design (privacy + accuracy). Self-paced;
   every card spoken earns a coin so the loop stays warm. `lv` = YLE band. `m` = model answer, `s:1` = sample. */
const SPEAK_YLE = [
  // lv1 Starters — name it / colour / count. `m` = spoken MODEL answer revealed AFTER the child speaks
  // (offline self-check, nothing recorded/recognised). `s:1` = open-ended → model is ONE sample, not "the" answer.
  {lv:1,e:'🐶', q:'What is this animal?', m:'It is a dog.'},
  {lv:1,e:'🍎', q:'What colour is it?', m:'It is red.'},
  {lv:1,e:'🐱🐱🐱', q:'How many cats can you see?', m:'I can see three cats.'},
  {lv:1,e:'⭐', q:'What is this? Say it in English.', m:'It is a star.'},
  {lv:1,e:'🚗', q:'What is this? What colour can a car be?', m:'It is a car. A car can be red or blue.'},
  {lv:1,e:'🏠', q:'What is this? Who lives in a house?', m:'It is a house. A family lives in a house.'},
  {lv:1,e:'🐦', q:'What is this? What can a bird do?', m:'It is a bird. A bird can fly.'},
  {lv:1,e:'🌳', q:'What is this? What colour is a tree?', m:'It is a tree. A tree is green.'},
  // lv2 Movers — describe / action / place
  {lv:2,e:'🐘', q:'Tell me about this animal. Is it big or small?', m:'It is an elephant. It is very big.'},
  {lv:2,e:'🏃', q:'What is the boy doing?', m:'The boy is running.'},
  {lv:2,e:'🌳🐦', q:'Where is the bird?', m:'The bird is in the tree.'},
  {lv:2,e:'🍽️', q:'What food do you like to eat?', m:'I like to eat pizza and apples.', s:1},
  {lv:2,e:'🎒', q:'What do you take to school in your bag?', m:'I take my books and a pencil.', s:1},
  // lv3 Flyers — open-ended, past/opinion
  {lv:3,e:'🏖️', q:'Tell me about a fun day. What did you do?', m:'Last weekend I went to the beach. I played in the sea and ate ice cream. It was great.', s:1},
  {lv:3,e:'🍕', q:'What is your favourite food, and why do you like it?', m:'My favourite food is pizza because it is warm and tasty.', s:1},
  {lv:3,e:'🐾', q:'Do you have a pet, or which pet would you like? Why?', m:'I would like a dog because dogs are friendly and like to play.', s:1},
  {lv:3,e:'🌧️', q:'What do you like to do when it rains?', m:'When it rains, I like to read books and watch films at home.', s:1}
];

/* ── YLE Reading & Writing: TICK yes/no (Starters R&W Part 1 format) — owner 2026-06-22 ──
   Look at a picture + read an English sentence, decide if it is TRUE. A real YLE reading format
   we did not have (the old Kings was only 3-option MCQ). Sentences are simple, unambiguous. */
const YESNO_YLE = [
  // lv1 Starters — "It is a ___"
  {lv:1,e:'🍎', s:'It is an apple.',      a:'yes'},
  {lv:1,e:'🐱', s:'It is a dog.',         a:'no'},
  {lv:1,e:'☀️', s:'It is the sun.',       a:'yes'},
  {lv:1,e:'🚗', s:'It is a car.',         a:'yes'},
  {lv:1,e:'🦆', s:'It is a duck.',        a:'yes'},
  {lv:1,e:'🌳', s:'It is a tree.',        a:'yes'},
  {lv:1,e:'🐶', s:'It is a cat.',         a:'no'},
  {lv:1,e:'⭐', s:'It is a star.',        a:'yes'},
  {lv:1,e:'🐟', s:'It is a fish.',        a:'yes'},
  {lv:1,e:'⚽', s:'It is a ball.',        a:'yes'},
  {lv:1,e:'🌙', s:'It is the sun.',       a:'no'},
  // lv2 Movers — properties / can / has
  {lv:2,e:'🐘', s:'It is a big animal.',  a:'yes'},
  {lv:2,e:'🐭', s:'It is a big animal.',  a:'no'},
  {lv:2,e:'🐟', s:'It can fly.',          a:'no'},
  {lv:2,e:'🐦', s:'It can fly.',          a:'yes'},
  {lv:2,e:'🍌', s:'It is a blue banana.', a:'no'},
  {lv:2,e:'🐰', s:'It has long ears.',    a:'yes'},
  // lv3 Flyers — comparatives / actions
  {lv:3,e:'🐘🐭', s:'The elephant is bigger than the mouse.', a:'yes'},
  {lv:3,e:'🐢🐇', s:'The rabbit is slower than the turtle.',  a:'no'},
  {lv:3,e:'☀️',   s:'The sun comes out at night.',            a:'no'},
  {lv:3,e:'🐦',   s:'Birds can fly and sing.',                a:'yes'}
];

/* ── YLE Reading & Writing: READ A STORY + answer (Movers/Flyers R&W comprehension) — owner 2026-06-22 ──
   Read 2-3 short English sentences, then answer one question (3 options). Real reading comprehension,
   the deepest skill we were missing. A 🔊 reads the story so pre-readers can follow too. */
const STORY_YLE = [
  // lv1 Starters — 2 short sentences, present tense
  {lv:1,text:'Sam has a red ball. He likes to play with his dog.', q:'What does Sam have?', opts:['a red ball','a cat','a book'], a:'a red ball'},
  {lv:1,text:'Anna has a big blue bike. She goes to school on it.', q:'What colour is the bike?', opts:['blue','red','green'], a:'blue'},
  {lv:1,text:'Mum has two cats. One is black and one is white.', q:'How many cats does Mum have?', opts:['two','three','one'], a:'two'},
  {lv:1,text:'Pat has a small dog. The dog likes to run.', q:'What does the dog like to do?', opts:['run','sleep','eat'], a:'run'},
  {lv:1,text:'Lily has a big balloon. The balloon is green.', q:'What colour is the balloon?', opts:['green','red','blue'], a:'green'},
  {lv:1,text:'Tim can see a fish. The fish is in the water.', q:'Where is the fish?', opts:['in the water','in the tree','on the bed'], a:'in the water'},
  {lv:2,text:'The bird is in the tree. It is singing a song.', q:'What is the bird doing?', opts:['singing','sleeping','eating'], a:'singing'},
  // lv2 Movers — 3 sentences, more detail
  {lv:2,text:'The cat is on the table. It is sleeping. The dog is under the table.', q:'Where is the dog?', opts:['under the table','on the table','in the box'], a:'under the table'},
  {lv:2,text:'Tom likes apples and bananas. He does not like fish.', q:'What food does Tom not like?', opts:['fish','apples','bananas'], a:'fish'},
  {lv:2,text:'It is a sunny day. The children play football in the garden.', q:'What do the children play?', opts:['football','tennis','music'], a:'football'},
  {lv:2,text:'Ben has a green hat. He wears it when it is cold.', q:'When does Ben wear his hat?', opts:['when it is cold','when it is hot','at night'], a:'when it is cold'},
  // lv3 Flyers — longer, past tense
  {lv:3,text:'Yesterday Lucy went to the zoo. She saw a big elephant and three monkeys. The monkeys were funny.', q:'How many monkeys did Lucy see?', opts:['three','two','one'], a:'three'},
  {lv:3,text:'Last weekend Max played in the rain. He wore his red boots and a yellow coat. After that he had hot soup.', q:'What did Max wear on his feet?', opts:['red boots','yellow socks','blue shoes'], a:'red boots'},
  {lv:3,text:'Grandma made a cake on Sunday. It was a chocolate cake with ten candles. Everyone sang a happy song.', q:'How many candles were on the cake?', opts:['ten','six','five'], a:'ten'},
  {lv:3,text:'The little dog was lost in the park. A kind girl found it and gave it some water. Then she took it home.', q:'Who found the dog?', opts:['a kind girl','a boy','a man'], a:'a kind girl'}
];

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
