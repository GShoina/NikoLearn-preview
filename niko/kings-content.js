/* NikoLearn — Kings g4-6 content (eng+math), authored from real kings.ge PDFs 2026-06-26. Loads BEFORE kings-exam.js. */

// ke4 — Kings English grade 4. NikoLearn ORIGINAL content (authored 2026-06-27, replaces PDF-transcribed items per CLAUDE.md §11). UK spelling. Self-contained reading; bonus counts code-verified.
const KEX_RD4 = [
  {q:'The cat is sleeping on the warm ___.', a:'mat', opts:['mat','sky','rain']},
  {q:'Birds can fly because they have ___.', a:'wings', opts:['wings','wheels','boots']},
  {q:'We eat hot soup with a ___.', a:'spoon', opts:['spoon','brush','pencil']},
  {q:'The baby is laughing. The baby is ___.', a:'happy', opts:['happy','angry','tired']},
  {q:'At night the sky is full of bright ___.', a:'stars', opts:['stars','shoes','apples']},
  {q:'The little boat is sailing on the ___.', a:'river', opts:['river','table','wall']},
  {q:'It is cold today, so put on a warm ___.', a:'coat', opts:['coat','fork','cup']},
  {q:'The teacher writes on the ___ with white chalk.', a:'board', opts:['board','spoon','river']}
];
const KEX_SP4 = [
  {w:'colo_r', a:'u', opts:['u','o','a']},{w:'harbo_r', a:'u', opts:['u','o','e']},{w:'penc_l', a:'i', opts:['i','e','a']},
  {w:'wind_w', a:'o', opts:['o','e','a']},{w:'bana_a', a:'n', opts:['n','m','l']},{w:'fath_r', a:'e', opts:['e','a','o']},
  {w:'bri_ge', a:'d', opts:['d','t','b']},{w:'pota_o', a:'t', opts:['t','d','k']},
  {w:'tab_e', a:'l', opts:['l','b','r']},{w:'flow_r', a:'e', opts:['e','a','o']}
];
const KEX_TR4 = [
  {ka:'წიგნი', a:'a book', opts:['a book','a pen','a desk']},{ka:'მზე', a:'the sun', opts:['the sun','the moon','the star']},
  {ka:'წყალი', a:'water', opts:['water','milk','bread']},{ka:'კატა', a:'a cat', opts:['a cat','a dog','a bird']},
  {ka:'წითელი ვაშლი', a:'a red apple', opts:['a red apple','a green apple','a red ball']},{ka:'დიდი სახლი', a:'a big house', opts:['a big house','a small house','a big garden']},
  {ka:'ცხელი ჩაი', a:'hot tea', opts:['hot tea','cold tea','hot soup']},{ka:'ხუთი თითი', a:'five fingers', opts:['five fingers','four fingers','five hands']},
  {ka:'მწვანე ხე', a:'a green tree', opts:['a green tree','a green leaf','a tall tree']},{ka:'პატარა ძაღლი', a:'a small dog', opts:['a small dog','a small cat','a big dog']}
];
const KEX_GR4 = [
  {q:'She ___ a teacher.', a:'is', opts:['is','are','am']},{q:'I have three ___.', a:'books', opts:['books','book','a book']},
  {q:'The cat is ___ the box.', a:'in', opts:['in','at','of']},{q:'We ___ to the park on Sunday.', a:'go', opts:['go','goes','going']},
  {q:'I can see ___ elephant.', a:'an', opts:['an','a','of']},{q:'There are many ___ in the sky.', a:'clouds', opts:['clouds','cloud','a cloud']},
  {q:'My brother ___ football every day.', a:'plays', opts:['plays','play','playing']},{q:'This book is ___ the table.', a:'on', opts:['on','in','to']},
  {q:'They ___ in the garden now.', a:'are', opts:['are','is','am']},{q:'He ___ a red car.', a:'has', opts:['has','have','haves']}
];
const KEX_BN4 = [
  {q:'How many times is MOON here? MOON · STAR · MOON · SUN · MOON', a:'3', opts:['3','2','4']},
  {q:'How many times is BEE here? BEE · ANT · BEE · BEE · ANT', a:'3', opts:['3','4','2']},
  {q:'How many times is RED here? RED · BLUE · RED · GREEN', a:'2', opts:['2','3','1']},
  {q:'How many times is DOG here? DOG · DOG · CAT · DOG · BIRD · DOG', a:'4', opts:['4','3','5']},
  {q:'How many times is LEAF here? LEAF · ROOT · LEAF', a:'2', opts:['2','1','3']},
  {q:'How many times is RAIN here? RAIN · SNOW · WIND · RAIN · RAIN', a:'3', opts:['3','2','4']},
  {q:'How many times is SHIP here? SHIP · BOAT · SHIP · RAFT · SHIP · BOAT', a:'3', opts:['3','2','4']},
  {q:'How many times is KITE here? KITE · BALL · KITE', a:'2', opts:['2','3','1']}
];
const BLUEPRINT_eng4 = [
  {label:'📖 READING', instr:'წაიკითხე და აირჩიე სწორი პასუხი', pts:10, n:5, pool:KEX_RD4, type:'gr'},
  {label:'🔤 VOCABULARY', instr:'აირჩიე გამოტოვებული ასო და ააწყვე სიტყვა', pts:30, n:10, pool:KEX_SP4, type:'sp'},
  {label:'🔁 TRANSLATION', instr:'აირჩიე ქართული სიტყვის სწორი ინგლისური თარგმანი', pts:30, n:10, pool:KEX_TR4, type:'tr'},
  {label:'📝 GRAMMAR', instr:'აირჩიე სწორი ვარიანტი', pts:30, n:10, pool:KEX_GR4, type:'gr'},
  {label:'⭐ BONUS', instr:'დათვალე და აირჩიე სწორი პასუხი', pts:5, n:1, pool:KEX_BN4, type:'gr', bonus:true}
];

// ke5 — Kings English g5. ORIGINAL NikoLearn content (CLAUDE.md §11): own reading/spelling/translation/grammar/count items.
const KEX_RC5 = [
  {q:'Tom found an old map in the attic. What did Tom find?', a:'a map', opts:['a map','a book','a key']},
  {q:'The map showed a hidden cave by the river. Where was the cave?', a:'by the river', opts:['by the river','on the hill','near the school']},
  {q:'Tom and his sister Ann decided to explore it. Who went with Tom?', a:'Ann', opts:['Ann','Ben','his father']},
  {q:'They packed water and two torches. What did they pack?', a:'water and two torches', opts:['water and two torches','bread and a blanket','maps and a compass']},
  {q:'Inside the cave it was very dark. How was it inside the cave?', a:'very dark', opts:['very dark','very bright','very warm']},
  {q:'Ann was a little afraid of the dark. How did Ann feel?', a:'afraid', opts:['afraid','happy','bored']},
  {q:'They saw a small wooden box on the ground. What did they see?', a:'a wooden box', opts:['a wooden box','a golden ring','a sleeping bat']},
  {q:'The box was full of old silver coins. What was in the box?', a:'old silver coins', opts:['old silver coins','dusty letters','broken toys']}
];
const KEX_SP5 = [
  {w:'umbre_la', a:'l', opts:['l','r','n']},{w:'kitc_en', a:'h', opts:['h','i','e']},{w:'sci_nce', a:'e', opts:['e','a','i']},
  {w:'neig_bour', a:'h', opts:['h','t','g']},{w:'choc_late', a:'o', opts:['o','a','u']},{w:'br_dge', a:'i', opts:['i','e','a']},
  {w:'wh_stle', a:'i', opts:['i','e','y']},{w:'jew_l', a:'e', opts:['e','a','o']},{w:'rhy_hm', a:'t', opts:['t','d','m']},{w:'colo_r', a:'u', opts:['u','o','e']}
];
const KEX_TR5 = [
  {ka:'მაღალი ხე', a:'a tall tree', opts:['a tall tree','a wide tree','a long tree']},
  {ka:'ძველი ხიდი', a:'an old bridge', opts:['an old bridge','an old bench','a new bridge']},
  {ka:'ცივი ამინდი', a:'cold weather', opts:['cold weather','cold water','warm weather']},
  {ka:'მძიმე წვიმა', a:'heavy rain', opts:['heavy rain','strong rain','big rain']},
  {ka:'მაგარი ყავა', a:'strong coffee', opts:['strong coffee','hard coffee','heavy coffee']},
  {ka:'სწრაფი მატარებელი', a:'a fast train', opts:['a fast train','a slow train','a fast bus']},
  {ka:'მაღალი ფასი', a:'a high price', opts:['a high price','a tall price','an expensive price']},
  {ka:'ლამაზი ხმა', a:'a beautiful voice', opts:['a beautiful voice','a beautiful noise','a loud voice']},
  {ka:'ღია კარი', a:'an open door', opts:['an open door','an opened door','a closed door']},
  {ka:'ბევრი ფული', a:'a lot of money', opts:['a lot of money','many money','much moneys']}
];
const KEX_GR5 = [
  {q:'There is some ___ in the cup.', a:'milk', opts:['milk','milks','a milk']},
  {q:'She ___ to school every day.', a:'goes', opts:['go','goes','going']},
  {q:'There are three ___ on the table.', a:'knives', opts:['knifes','knives','knife']},
  {q:'I have ___ apple in my bag.', a:'an', opts:['a','an','of']},
  {q:"He doesn't have ___ money.", a:'any', opts:['some','any','a']},
  {q:'The sun ___ in the east.', a:'rises', opts:['rise','rises','rising']},
  {q:'These ___ are very old.', a:'photos', opts:['photo','photos','photoes']},
  {q:'We were tired, ___ we went home.', a:'so', opts:['but','so','or']},
  {q:'Look! The children ___ playing.', a:'are', opts:['is','are','am']},
  {q:'How much ___ do you need?', a:'sugar', opts:['sugar','sugars','a sugar']}
];
const KEX_BONUS5 = [
  {q:'How many times does NIKO appear in: NIKOXNIKOYNIKOZ ?', a:'3', opts:['3','2','4']},
  {q:'How many times does STORM appear in: RTSTORMBESTORMLY ?', a:'2', opts:['2','3','1']},
  {q:'How many times does MOON appear in: MOONAMOONBMOONCMOOND ?', a:'4', opts:['4','3','5']},
  {q:'How many times does LEAF appear in: BTLEAFRYLEAFKL ?', a:'2', opts:['2','1','3']},
  {q:'How many times does TIGER appear in: TIGERXTIGERYTIGERZTIGERW ?', a:'4', opts:['4','5','3']},
  {q:'How many times does CLOUD appear in: RLCLOUDBE ?', a:'1', opts:['1','2','3']},
  {q:'How many times does RIVER appear in: RIVERXRIVERYRIVER ?', a:'3', opts:['3','4','2']},
  {q:'How many times does PLANET appear in: PLANETAPLANETBPLANETCPLANETD ?', a:'4', opts:['4','3','5']}
];
const BLUEPRINT_eng5 = [
  {label:'📖 READING', instr:'წაიკითხე და აირჩიე სწორი პასუხი', pts:10, n:5, pool:KEX_RC5, type:'gr'},
  {label:'🔤 SPELLING', instr:'დაამატე ერთი ასო და შეადგინე სიტყვა', pts:30, n:10, pool:KEX_SP5, type:'sp'},
  {label:'🌍 TRANSLATION', instr:'აირჩიე სწორი ინგლისური თარგმანი', pts:30, n:10, pool:KEX_TR5, type:'tr'},
  {label:'✏️ GRAMMAR', instr:'აირჩიე სწორი პასუხი', pts:30, n:10, pool:KEX_GR5, type:'gr'},
  {label:'🎁 BONUS', instr:'დათვალე რამდენჯერ მეორდება სიტყვა', pts:5, n:1, pool:KEX_BONUS5, type:'gr', bonus:true}
];

// ke6 — Kings English grade 6 (typo to fix at integ: წაკიტხე → წაიკითხე)
const KEX_RC6 = [
  {q:'Honeybees live together in a large group called a ___.', a:'colony', opts:['colony','herd','flock']},
  {q:'Every honeybee colony is led by one ___.', a:'queen', opts:['queen','king','captain']},
  {q:'Bees make honey from a sweet liquid called ___.', a:'nectar', opts:['nectar','water','milk']},
  {q:'Bees collect this sweet liquid from ___.', a:'flowers', opts:['flowers','rocks','leaves']},
  {q:'The bees that gather food and build the hive are called ___ bees.', a:'worker', opts:['worker','lazy','baby']},
  {q:'Bees make a sweet, sticky food called ___.', a:'honey', opts:['honey','bread','soup']},
  {q:'Bees build their honeycomb out of ___.', a:'wax', opts:['wax','mud','paper']},
  {q:'As bees move from flower to flower, they help plants by spreading ___.', a:'pollen', opts:['pollen','smoke','soil']}
];
const KEX_VOC6 = [
  {q:'A person who bakes and sells bread and cakes:', a:'a baker', opts:['a baker','a butcher','a farmer']},
  {q:'A small room or building where a car is kept:', a:'a garage', opts:['a garage','a kitchen','a cellar']},
  {q:'The first meal of the day, eaten in the morning:', a:'breakfast', opts:['breakfast','supper','lunch']},
  {q:'A very large area of salt water:', a:'an ocean', opts:['an ocean','a river','a lake']},
  {q:'A doctor who takes care of sick animals:', a:'a vet', opts:['a vet','a nurse','a chemist']},
  {q:'A long yellow fruit with a thick skin that monkeys like to eat:', a:'a banana', opts:['a banana','an apple','a cherry']},
  {q:'A tool with a handle and metal teeth, used to cut wood:', a:'a saw', opts:['a saw','a hammer','a brush']},
  {q:'A person who paints pictures:', a:'a painter', opts:['a painter','a singer','a writer']},
  {q:'The season when the leaves turn brown and fall from the trees:', a:'autumn', opts:['autumn','summer','spring']},
  {q:'A small shelter made of cloth that you sleep in when camping:', a:'a tent', opts:['a tent','a castle','a barn']}
];
const KEX_ODD6 = [
  {q:'Choose the odd one: apple, pear, carrot', a:'carrot', opts:['carrot','apple','pear']},
  {q:'Choose the odd one: blue, yellow, spoon', a:'spoon', opts:['spoon','blue','yellow']},
  {q:'Choose the odd one: dog, cat, table', a:'table', opts:['table','dog','cat']},
  {q:'Choose the odd one: run, jump, hat', a:'hat', opts:['hat','run','jump']},
  {q:'Choose the odd one: Monday, Tuesday, January', a:'January', opts:['January','Monday','Tuesday']},
  {q:'Choose the odd one: rose, tulip, oak', a:'oak', opts:['oak','rose','tulip']},
  {q:'Choose the odd one: hammer, saw, apple', a:'apple', opts:['apple','hammer','saw']},
  {q:'Choose the odd one: teacher, doctor, pencil', a:'pencil', opts:['pencil','teacher','doctor']},
  {q:'Choose the odd one: arm, leg, shoe', a:'shoe', opts:['shoe','arm','leg']},
  {q:'Choose the odd one: rain, snow, desk', a:'desk', opts:['desk','rain','snow']}
];
const KEX_GR6 = [
  {q:'An elephant is ___ than a mouse.', a:'bigger', opts:['bigger','more big','biggest']},
  {q:'This box is ___ than that one.', a:'heavier', opts:['heavier','more heavy','heaviest']},
  {q:'The children sang very ___.', a:'loudly', opts:['loudly','loud','loudness']},
  {q:'She finished the test very ___.', a:'quickly', opts:['quickly','quick','quicker']},
  {q:'They ___ football when it started to rain.', a:'were playing', opts:['were playing','was playing','are playing']},
  {q:"I ___ a book at eight o'clock last night.", a:'was reading', opts:['was reading','were reading','am reading']},
  {q:'Today the weather is ___ than yesterday.', a:'better', opts:['better','gooder','more good']},
  {q:'He speaks English very ___.', a:'well', opts:['well','good','goodly']},
  {q:'We ___ sleeping when the phone rang.', a:'were not', opts:['were not','was not','did not']},
  {q:'A train is ___ than a bicycle.', a:'faster', opts:['faster','more fast','fastest']}
];
const KEX_BONUS6 = [
  {q:'The large, bright star that gives the Earth light and heat during the day:', a:'The Sun', opts:['The Sun','The Moon','A cloud']},
  {q:'The arch of many colours that appears in the sky after rain:', a:'A rainbow', opts:['A rainbow','A shadow','A storm']},
  {q:'The largest ocean on the Earth:', a:'The Pacific Ocean', opts:['The Pacific Ocean','The Black Sea','The Caspian Sea']},
  {q:'The soft, frozen water that falls from the sky in winter:', a:'Snow', opts:['Snow','Rain','Sand']},
  {q:'The planet that we live on:', a:'The Earth', opts:['The Earth','The Moon','Mars']},
  {q:'A small tool with a needle that always points to the north:', a:'A compass', opts:['A compass','A clock','A ruler']},
  {q:'The season that comes after winter, when flowers begin to grow:', a:'Spring', opts:['Spring','Autumn','Winter']},
  {q:'The tallest animal in the world, with a very long neck:', a:'A giraffe', opts:['A giraffe','An elephant','A horse']}
];
const BLUEPRINT_eng6 = [
  {label:'📖 READING', instr:'წაიკითხე და აირჩიე სწორი პასუხი', pts:10, n:5, pool:KEX_RC6, type:'gr'},
  {label:'📚 VOCABULARY', instr:'გამოიცანი სიტყვა აღწერის მიხედვით', pts:30, n:10, pool:KEX_VOC6, type:'gr'},
  {label:'🔎 VOCABULARY', instr:'აირჩიე ზედმეტი სიტყვა', pts:30, n:10, pool:KEX_ODD6, type:'gr'},
  {label:'✏️ GRAMMAR', instr:'აირჩიე სწორი პასუხი', pts:30, n:10, pool:KEX_GR6, type:'gr'},
  {label:'⭐ BONUS', instr:'აირჩიე სწორი პასუხი აღწერის მიხედვით', pts:5, n:1, pool:KEX_BONUS6, type:'gr', bonus:true}
];

// km4 — Kings math g4. ORIGINAL NikoLearn content (rewritten 2026-06-27, CLAUDE.md §11):
// public-domain archetypes only, own numbers/scenarios, no brand names. All answers code-verified.
const KMX_PAT4 = [
  {q:'იპოვე შემდეგი რიცხვი: 3, 6, 9, 12, 15, ?', a:'18', opts:['18','17','21']},
  {q:'იპოვე შემდეგი რიცხვი: 1, 3, 6, 10, 15, ?', a:'21', opts:['21','20','22']},
  {q:'იპოვე შემდეგი რიცხვი: 2, 5, 11, 23, ?', a:'47', opts:['47','46','35']},
  {q:'იპოვე შემდეგი რიცხვი: 100, 90, 81, 73, 66, ?', a:'60', opts:['60','59','61']},
  {q:'იპოვე შემდეგი რიცხვი: 1, 4, 9, 16, 25, ?', a:'36', opts:['36','30','35']},
  {q:'იპოვე შემდეგი რიცხვი: 7, 8, 10, 13, 17, ?', a:'22', opts:['22','21','23']},
  {q:'იპოვე შემდეგი რიცხვი: 64, 32, 16, 8, ?', a:'4', opts:['4','6','2']},
  {q:'იპოვე შემდეგი რიცხვი: 2, 6, 18, 54, ?', a:'162', opts:['162','108','160']}
];
const KMX_ARI4 = [
  {q:'ორი განსხვავებული ერთნიშნა რიცხვის ნამრავლი ყველაზე დიდი რა შეიძლება იყოს?', a:'72', opts:['72','81','63']},
  {q:'ყველაზე დიდ ორნიშნა რიცხვს დავუმატოთ ყველაზე დიდი ერთნიშნა რიცხვი. რა მივიღებთ?', a:'108', opts:['108','107','109']},
  {q:'ორი ორნიშნა რიცხვის სხვაობა ყველაზე დიდი რა შეიძლება იყოს?', a:'89', opts:['89','90','88']},
  {q:'ნინომ სამი ზედიზედ მომდევნო რიცხვი შეკრიბა და ჯამში 30 მიიღო. რომელია შუა რიცხვი?', a:'10', opts:['10','9','11']},
  {q:'ლუკას აქვს 5-ლარიანი და 2-ლარიანი მონეტები, სულ 4 მონეტა და ჯამში 14 ლარი. რამდენი 5-ლარიანი მონეტა აქვს?', a:'2', opts:['2','1','3']},
  {q:'ერთი ორნიშნა რიცხვის ციფრების ჯამი 9-ის ტოლია. ყველაზე დიდი ასეთი რიცხვი რომელია?', a:'90', opts:['90','81','99']},
  {q:'რამდენი ორნიშნა რიცხვი ბოლოვდება ციფრით 5?', a:'9', opts:['9','10','8']},
  {q:'მაგიდაზე 24 ვაშლი იდო. ნინომ ჯერ ნახევარი აიღო, შემდეგ კი დარჩენილის ნახევარი. რამდენი ვაშლი დარჩა მაგიდაზე?', a:'6', opts:['6','12','8']}
];
const KMX_LOG4 = [
  {q:'ნინო, გია და სანდრო რიგში დგანან. ნინო გიას წინ დგას, სანდრო კი ყველაზე უკან. ვინ დგას რიგში პირველი?', a:'ნინო', opts:['ნინო','გია','სანდრო']},
  {q:'კალათში წითელი და მწვანე ბურთებია, სულ 12 ცალი. წითელი ბურთი მწვანეზე 2-ით მეტია. რამდენი წითელი ბურთია კალათში?', a:'7', opts:['7','5','6']},
  {q:'დღეს ხუთშაბათია. რომელი დღე იქნება 3 დღის შემდეგ?', a:'კვირა', opts:['კვირა','შაბათი','ორშაბათი']},
  {q:'ნინო ძმაზე 3 წლით უფროსია. ახლა ნინო 9 წლისაა. რამდენი წლის იქნება ძმა 2 წლის შემდეგ?', a:'8', opts:['8','6','11']},
  {q:'ხუთი ბავშვი ერთმანეთს ხელს ჩამოართმევს, ყველა ყველას ზუსტად ერთხელ. სულ რამდენი ხელის ჩამორთმევა იქნება?', a:'10', opts:['10','20','25']},
  {q:'თაროზე ერთ რიგში 5 წიგნი დგას. მათემატიკის წიგნი ზუსტად შუაშია. მის მარცხნივ რამდენი წიგნია?', a:'2', opts:['2','3','1']},
  {q:'ნინომ 3 დღეში 18 ლარი დააგროვა, ყოველდღე თანაბრად. რამდენ ლარს აგროვებდა დღეში?', a:'6', opts:['6','9','5']},
  {q:'ანა საათში 4 ფურცელს კეცავს, დათო კი საათში 6-ს. ისინი ერთად მუშაობენ. სულ რამდენ ფურცელს დაკეცავენ 1 საათში?', a:'10', opts:['10','24','8']}
];
const KMX_GUESS4 = [
  {q:'რომელი რიცხვია 18-ზე 7-ით მეტი?', a:'25', opts:['25','11','24']},
  {q:'გამოიცანი ჩაფიქრებული რიცხვი, თუ ის 30-ზე მეტია, 35-ზე ნაკლები და 4-ზე იყოფა.', a:'32', opts:['32','33','36']},
  {q:'რომელი რიცხვის ნახევარია 16?', a:'32', opts:['32','8','18']},
  {q:'გამოიცანი ორნიშნა რიცხვი, თუ ის 40-სა და 50-ს შორისაა და მისი ციფრების ჯამი 8-ის ტოლია.', a:'44', opts:['44','45','43']},
  {q:'გამოიცანი ჩაფიქრებული რიცხვი, თუ ის 20-ზე მეტია, 25-ზე ნაკლები, კენტია და 3-ზე იყოფა.', a:'21', opts:['21','23','24']},
  {q:'რომელი რიცხვი 50-ის ნახევარს 5-ით აღემატება?', a:'30', opts:['30','20','45']},
  {q:'რომელი რიცხვია 7-ის სამმაგი?', a:'21', opts:['21','10','4']},
  {q:'გამოიცანი ორნიშნა რიცხვი, თუ მისი ათეულის ციფრი 5-ია, ხოლო ერთეულის ციფრი ათეულის ციფრზე 3-ით მეტია.', a:'58', opts:['58','53','85']}
];
const KMX_BON4 = [
  {q:'ნინომ მაღაზიაში 7 ლარის რვეული და 5 ლარის კალამი იყიდა და გამყიდველს 20 ლარი მისცა. რამდენ ლარს დაუბრუნებს გამყიდველი?', a:'8', opts:['8','12','7']},
  {q:'ლუკას ჰქონდა 25 ლარი. ჯერ 8 ლარი დახარჯა, შემდეგ ბებიამ 10 ლარი აჩუქა. რამდენი ლარი აქვს ახლა ლუკას?', a:'27', opts:['27','17','23']},
  {q:'ერთი ფანქარი 2 ლარი ღირს. რამდენი ლარი ჯდება 6 ფანქარი?', a:'12', opts:['12','8','14']},
  {q:'ნინო ყოველდღე 4 ლარს ზოგავს. რამდენ ლარს დააგროვებს ერთ კვირაში?', a:'28', opts:['28','11','24']},
  {q:'ბურთი 15 ლარი ღირს, მაგრამ ფასდაკლებით 3 ლარით იაფია. რა ღირს ბურთი ფასდაკლებით?', a:'12', opts:['12','18','13']},
  {q:'დათოს აქვს 3 ცალი 5-ლარიანი მონეტა. შეუძლია თუ არა მას 12 ლარის წიგნის ყიდვა?', a:'კი', opts:['კი','არა','ვერ დავადგენთ']},
  {q:'ანამ 18 ლარი 3 მეგობარს თანაბრად გაუნაწილა. რამდენი ლარი ერგო თითოეულს?', a:'6', opts:['6','9','5']},
  {q:'ბაზარში ვაშლის კილოგრამი 4 ლარი ღირს. ნინომ 2 კილოგრამი იყიდა და გამყიდველს 10 ლარი მისცა. რამდენ ლარს დაუბრუნებენ?', a:'2', opts:['2','8','4']}
];
const BLUEPRINT_math4 = [
  {label:'🧩 კანონზომიერება', instr:'დაადგინე კანონზომიერება და იპოვე რიცხვი', pts:20, n:2, pool:KMX_PAT4, type:'mq'},
  {label:'➕ არითმეტიკა', instr:'ამოხსენი ამოცანა', pts:20, n:3, pool:KMX_ARI4, type:'mq'},
  {label:'🧠 ლოგიკა', instr:'დაფიქრდი და უპასუხე', pts:30, n:3, pool:KMX_LOG4, type:'mq'},
  {label:'🔢 გამოიცანი უცნობი რიცხვი', instr:'იპოვე სწორი რიცხვი', pts:30, n:2, pool:KMX_GUESS4, type:'mq'},
  {label:'🎁 ბონუსი', instr:'ბონუს კითხვები', pts:30, n:6, pool:KMX_BON4, type:'mq', bonus:true}
];

// km5 — Kings math g5. Original NikoLearn content (archetypes only; numbers/scenarios authored fresh)
const KMX_CMP5 = [
{q:'დილის 9 საათიდან საღამოს 8 საათამდე მეტი დროა, თუ საღამოს 8 საათიდან დილის 9 საათამდე?', a:'საღამოს 8-დან დილის 9-მდე', opts:['დილის 9-დან საღამოს 8-მდე','საღამოს 8-დან დილის 9-მდე','თანაბარია']},
{q:'ლევანს 8-ით მეტი ბურთი აქვს, ვიდრე ნიკას. ლევანი ნიკას 3 ბურთს თუ მისცემს, ვის ექნება მეტი?', a:'ლევანს', opts:['ლევანს','ნიკას','თანაბრად']},
{q:'მარიამს 12-ით მეტი სტიკერი აქვს, ვიდრე ელენეს. მარიამი ელენეს 6 სტიკერს თუ მისცემს, ვის ექნება მეტი?', a:'თანაბრად', opts:['მარიამს','ელენეს','თანაბრად']},
{q:'სანდროს 4-ით მეტი ფანქარი აქვს, ვიდრე გიოს. სანდრო გიოს 3 ფანქარს თუ მისცემს, ვის ექნება მეტი?', a:'გიოს', opts:['სანდროს','გიოს','თანაბრად']},
{q:'ერთ ყუთში 6 რიგად 4 ცომეულია დაწყობილი, მეორეში კი 5 რიგად 5 ცომეული. რომელ ყუთშია მეტი ცომეული?', a:'მეორე ყუთში', opts:['პირველ ყუთში','მეორე ყუთში','თანაბრად']},
{q:'დღის 11 საათიდან ღამის 11 საათამდე მეტი დროა, თუ ღამის 11 საათიდან დღის 11 საათამდე?', a:'თანაბარია', opts:['დღის 11-დან ღამის 11-მდე','ღამის 11-დან დღის 11-მდე','თანაბარია']},
{q:'პირველ კალათში 5-ით მეტი ატამია, ვიდრე მეორეში. თუ პირველიდან მეორეში 2 ატამს გადავიტანთ, რომელ კალათს ექნება მეტი?', a:'პირველ კალათს', opts:['პირველ კალათს','მეორე კალათს','თანაბრად']},
{q:'ნინო დღეში 3 გვერდს კითხულობს 8 დღის განმავლობაში, ბექა კი დღეში 4 გვერდს 6 დღის განმავლობაში. ვინ წაიკითხავს მეტ გვერდს?', a:'თანაბრად', opts:['ნინო','ბექა','თანაბრად']}
];
const KMX_ARITH5 = [
{q:'სატვირთო მანქანა 100 კმ-ის გავლისას წვავს 12 ლიტრ საწვავს. რამდენ კილომეტრს გაივლის ის 36 ლიტრით?', a:'300 კმ', opts:['250 კმ','300 კმ','360 კმ']},
{q:'ბაღის ბილიკზე 9 ნაძვია და ყოველ ორ მომდევნო ნაძვს შორის ზუსტად 2 ვარდია. სულ რამდენი მცენარეა, თუ პირველიც და ბოლოც ნაძვია?', a:'25', opts:['23','25','27']},
{q:'ერთი რვეული 50 თეთრი ღირს. 9 რვეული იმდენი ღირს, რამდენიც 3 ნამცხვარი. რა ღირს ერთი ნამცხვარი?', a:'1 ლ 50 თ', opts:['1 ლ 20 თ','1 ლ 50 თ','2 ლარი']},
{q:'მწკრივში 7 დროშაა და ყოველ ორ მომდევნო დროშას შორის 4 ბუშტია. სულ რამდენი საგანია, თუ პირველიც და ბოლოც დროშაა?', a:'31', opts:['28','31','35']},
{q:'ერთი რვეული 80 თეთრი ღირს. დათომ 5 რვეული იყიდა და 10 ლარი გადაიხადა. რამდენი ხურდა დაუბრუნდა?', a:'6 ლარი', opts:['5 ლ 20 თ','6 ლარი','6 ლ 50 თ']},
{q:'ტრაქტორი 100 კმ-ის გავლისას წვავს 20 ლიტრ საწვავს. რამდენ კილომეტრს გაივლის ის 50 ლიტრით?', a:'250 კმ', opts:['200 კმ','250 კმ','300 კმ']},
{q:'ერთ ყუთში 8 ვაშლი ეტევა. ყველაზე ცოტა რამდენი ყუთი დასჭირდება 50 ვაშლის ჩასაწყობად?', a:'7', opts:['6','7','8']},
{q:'კალათში 4-ჯერ მეტი მსხალია, ვიდრე ვაშლი. სულ 30 ხილია. რამდენი მსხალია?', a:'24', opts:['20','24','26']}
];
const KMX_LOGIC5 = [
{q:'ბათუმი მადრიდს 3 საათით უსწრებს. ფრენა ბათუმიდან მადრიდამდე 6 საათია. ბათუმის დროით რომელ საათზე უნდა გაფრინდეს, რომ მადრიდში მადრიდის დროით 20 საათზე ჩაფრინდეს?', a:'17 საათზე', opts:['14 საათზე','17 საათზე','23 საათზე']},
{q:'ქალაქი B ქალაქ A-ს 4 საათით ჩამორჩება. ფრენა A-დან B-მდე 5 საათია. A-ს დროით რომელ საათზე უნდა გაფრინდეს, რომ B-ში B-ს დროით 15 საათზე ჩაფრინდეს?', a:'14 საათზე', opts:['11 საათზე','14 საათზე','19 საათზე']},
{q:'2 ცხენი მეტს იწონის, ვიდრე 2 სახედარი და 1 თხა ერთად. 2 სახედარი მეტს იწონის, ვიდრე 1 ცხენი და 1 თხა ერთად. დაალაგე ცხოველები წონის კლებით.', a:'ცხენი, სახედარი, თხა', opts:['ცხენი, სახედარი, თხა','ცხენი, თხა, სახედარი','სახედარი, ცხენი, თხა']},
{q:'2 აქლემი მეტს იწონის, ვიდრე 2 ცხვარი და 1 ბატკანი ერთად. 2 ცხვარი მეტს იწონის, ვიდრე 1 აქლემი და 1 ბატკანი ერთად. დაალაგე ცხოველები წონის კლებით.', a:'აქლემი, ცხვარი, ბატკანი', opts:['აქლემი, ცხვარი, ბატკანი','აქლემი, ბატკანი, ცხვარი','ცხვარი, აქლემი, ბატკანი']},
{q:'ჭიანჭველა ერთ მარცვალს ეზიდება 9 წუთში, ფუტკარი 6 წუთში, ხოჭო 12 წუთში. სხვადასხვა დროს დაიწყეს, თანაბარი ნაწილი შეასრულეს და ერთად დაასრულეს. ვინ დაიწყო ყველაზე ადრე?', a:'ხოჭომ', opts:['ჭიანჭველამ','ფუტკარმა','ხოჭომ']},
{q:'სამმა მუშამ ერთი კედელი უნდა შეათეთროს: პირველი მარტო 4 საათში ათეთრებს, მეორე 12 საათში, მესამე 6 საათში. თითოეულმა თანაბარი ნაწილი შეათეთრა და ერთად დაასრულეს. ვინ დაიწყო ყველაზე ადრე?', a:'მეორემ', opts:['პირველმა','მეორემ','მესამემ']},
{q:'კატა ერთ ფიალა წყალს სვამს 8 წუთში, ძაღლი 20 წუთში, კურდღელი 10 წუთში. ერთად დაიწყეს და თანაბარი ნაწილი დალიეს. ვინ დაასრულა ყველაზე გვიან?', a:'ძაღლმა', opts:['კატამ','ძაღლმა','კურდღელმა']},
{q:'ანა მაღალია ბექაზე, ბექა მაღალია გიოზე, ხოლო დავითი ანაზეც მაღალია. დაალაგე ისინი სიმაღლის კლებით.', a:'დავითი, ანა, ბექა, გიო', opts:['დავითი, ანა, ბექა, გიო','ანა, დავითი, ბექა, გიო','დავითი, ბექა, ანა, გიო']}
];
const KMX_MINMAX5 = [
{q:'ლუკამ ნერგი დარგო და მას მხოლოდ პარასკევობით, დღეში ერთხელ რწყავს. ამჟამად 5-ჯერ აქვს მორწყული. სულ მცირე, მერამდენე დღეა, რაც მან ნერგი დარგო?', a:'29', opts:['29','35','36']},
{q:'თამარმა ბოსტანი დარგო და მას მხოლოდ ოთხშაბათობით, დღეში ერთხელ რწყავს. ამჟამად 6-ჯერ აქვს მორწყული. სულ მცირე, მერამდენე დღეა, რაც მან ბოსტანი დარგო?', a:'36', opts:['36','42','43']},
{q:'რომელია უდიდესი სამნიშნა რიცხვი, რომელშიც ყველა ციფრი ერთმანეთისგან განსხვავებული და ლუწია?', a:'864', opts:['864','886','888']},
{q:'რომელია უმცირესი სამნიშნა რიცხვი, რომელშიც ყველა ციფრი ერთმანეთისგან განსხვავებული და კენტია?', a:'135', opts:['135','113','111']},
{q:'რამდენით მეტია უდიდესი სამნიშნა რიცხვი, რომელშიც ყველა ციფრი განსხვავებულია, უმცირეს ისეთ სამნიშნა რიცხვზე, რომელშიც ყველა ციფრი განსხვავებულია?', a:'885-ით', opts:['885-ით','864-ით','877-ით']},
{q:'ორნიშნა რიცხვებიდან რომელია უდიდესი, რომელშიც ციფრების ჯამი 12-ის ტოლია?', a:'93', opts:['93','84','66']},
{q:'სამნიშნა რიცხვებიდან რომელია უმცირესი, რომელშიც ციფრების ჯამი 20-ის ტოლია?', a:'299', opts:['299','389','992']},
{q:'რომელია უდიდესი სამნიშნა რიცხვი, რომელშიც ციფრების ჯამი 7-ის ტოლია და ყველა ციფრი ერთმანეთისგან განსხვავებულია?', a:'610', opts:['610','700','520']}
];
const KMX_BONUS5 = [
{q:'ივლისში გიორგის შემოსავალი 200 ლარით გაიზარდა, მაგრამ მისი ყოველდღიური ხარჯიც გაიზარდა 5 ლარით. რამდენი ლარით გაიზრდება ივლისში გიორგის დანაზოგი? (ივლისი 31 დღეა)', a:'45', opts:['45','155','200']},
{q:'უბანში შაქარი 2 ლარი და 50 თეთრი ღირს, ბაზარში კი 2 ლარი. ბაზარში მისვლა-მოსვლა 2 ლარი ჯდება. სულ მცირე რამდენი კილოგრამი შაქრისთვის ღირს ბაზარში წასვლა, რომ მაინც 1 ლარი დავზოგოთ?', a:'6 კგ', opts:['6 კგ','8 კგ','10 კგ']},
{q:'ნინი სახლიდან 5 საათით გავიდა და ნათურის ჩაქრობა დაავიწყდა. რა თანხა დაიხარჯა ზედმეტად, თუ 1 საათში 2 თეთრის ელექტროენერგია იხარჯება?', a:'10 თეთრი', opts:['10 თეთრი','7 თეთრი','5 თეთრი']},
{q:'ნათიამ 4 წლის წინ ანაბარი გახსნა. რამდენი წლისაა ის ახლა, თუ მაშინ 15 წლის იყო?', a:'19', opts:['11','17','19']},
{q:'ნინომ 3 წიგნი იყიდა, თითო 12 ლარად, და 50 ლარით გადაიხადა. რამდენი ხურდა დააბრუნეს?', a:'14', opts:['14','16','12']},
{q:'ტელეფონის ნომერი იწყება ციფრებით 555222, შემდეგ 3 ციფრი აკლია. შეიძლება თუ არა ბოლო 3 ციფრი ისე შევარჩიოთ, რომ ნომრის ციფრთა ჯამი 40 იყოს?', a:'კი', opts:['კი','არა','ვერ დავადგენთ']},
{q:'სექტემბერში ნინოს შემოსავალი 180 ლარით გაიზარდა, ხარჯი კი ყოველდღიურად 4 ლარით. რამდენი ლარით გაიზრდება სექტემბერში ნინოს დანაზოგი? (სექტემბერი 30 დღეა)', a:'60', opts:['60','120','180']},
{q:'ლუკას ანაბარი 6 წლის წინ გაუხსნეს. რამდენი წლისაა ის ახლა, თუ მაშინ 11 წლის იყო?', a:'17', opts:['11','17','19']},
{q:'ტელეფონის ნომერი იწყება ციფრებით 598888, შემდეგ 3 ციფრი აკლია. შეიძლება თუ არა ბოლო 3 ციფრი ისე შევარჩიოთ, რომ ნომრის ციფრთა ჯამი 80 იყოს?', a:'არა', opts:['კი','არა','ვერ დავადგენთ']}
];
const BLUEPRINT_math5 = [
{label:'⚖️ რაოდენობრივი შედარება', instr:'შეადარე და აირჩიე სწორი პასუხი', pts:20, n:2, pool:KMX_CMP5, type:'mq'},
{label:'➗ არითმეტიკა', instr:'ამოხსენი ამოცანა', pts:20, n:3, pool:KMX_ARITH5, type:'mq'},
{label:'🧠 ლოგიკა', instr:'იფიქრე ლოგიკურად', pts:30, n:3, pool:KMX_LOGIC5, type:'mq'},
{label:'🔢 უდიდესი და უმცირესი', instr:'იპოვე უდიდესი ან უმცირესი რიცხვი', pts:30, n:2, pool:KMX_MINMAX5, type:'mq'},
{label:'💰 ბონუსი: ფინანსები', instr:'ბონუს კითხვები ფინანსურ განათლებაზე', pts:30, n:6, pool:KMX_BONUS5, type:'mq', bonus:true}
];

// km6 — Kings math g6. NikoLearn-original content (owner IP, CLAUDE.md §11). All answers code-verified 2026-06-27.
const KMX_ARITH6 = [
  {q:'გამოთვალე: 48 : 8 + 5 × 3 - 7', a:'14', opts:['14','20','26']},
  {q:'გამოთვალე: (15 - 3) : 4 + 9 × 2', a:'21', opts:['21','27','19']},
  {q:'რომელი გამოსახულების მნიშვნელობაა უმცირესი?', a:'(64:8):(4:2)', opts:['(64:8):(4:2)','64:(8:(4:2))','64:(8:4):2']},
  {q:'გამოთვალე: 100 - 7 × 6 + 18 : 3', a:'64', opts:['64','58','70']},
  {q:'გამოთვალე: 7 × 8 - 36 : 6 + 4', a:'54', opts:['54','50','58']},
  {q:'გამოთვალე: (45 + 15) : 5 - 2 × 3', a:'6', opts:['6','18','4']},
  {q:'გამოთვალე: 12 × 3 - (20 + 4) : 6', a:'32', opts:['32','30','8']},
  {q:'გამოთვალე: 90 : (3 × 3) + 6 × 5', a:'40', opts:['40','55','34']}
];
const KMX_NAT6 = [
  {q:'რამდენი კენტი რიცხვია 50-დან 90-მდე (ჩათვლით)?', a:'20', opts:['20','21','19']},
  {q:'რამდენი ლუწი რიცხვია 17-დან 63-მდე (ჩათვლით)?', a:'23', opts:['23','24','22']},
  {q:'რა ნაშთს გვაძლევს 2026 თავისი ციფრების ჯამზე გაყოფისას?', a:'6', opts:['6','0','4']},
  {q:'რა ნაშთს გვაძლევს 5000 9-ზე გაყოფისას?', a:'5', opts:['5','4','6']},
  {q:'რამდენი სამნიშნა რიცხვი იყოფა 50-ზე ნაშთის გარეშე?', a:'18', opts:['18','19','17']},
  {q:'რამდენით მეტია 4-დან 103-ის ჩათვლით რიცხვების ჯამი 1-დან 100-ის ჩათვლით რიცხვების ჯამზე?', a:'300', opts:['300','303','3']},
  {q:'რამდენი სამნიშნა რიცხვი იყოფა 9-ზე ნაშთის გარეშე?', a:'100', opts:['100','99','101']},
  {q:'1-დან 200-მდე (ჩათვლით) რამდენი რიცხვი იყოფა ერთდროულად 4-ზეც და 6-ზეც?', a:'16', opts:['16','17','15']}
];
const KMX_CALC6 = [
  {q:'მანქანამ თანაბარი სიჩქარით 5 სთ-ში 360 კმ გაიარა. უკან რა სიჩქარით უნდა იაროს, რომ 1 სთ-ით ადრე ჩავიდეს?', a:'90 კმ/სთ', opts:['90 კმ/სთ','100 კმ/სთ','80 კმ/სთ']},
  {q:'ნინოს 5 სტიკერი აქვს, მარის ნინოზე მეტი, თაკოს კი ნინოსა და მარის ჯამზე მეტი. სულ მცირე რამდენი სტიკერი შეიძლება ჰქონდეთ სამივეს ერთად?', a:'23', opts:['23','22','24']},
  {q:'კლასში 30 მოსწავლეა. გოგონები ბიჭებზე 6-ით ნაკლებია. მთელი კლასის რა ნაწილია გოგონები?', a:'2/5', opts:['2/5','3/5','1/3']},
  {q:'3 მუშა ერთად 1 დღეში ღებავს 18 მ ღობეს. ერთნაირი ტემპით რამდენ მეტრს შეღებავს 7 ასეთი მუშა 1 დღეში?', a:'42 მ', opts:['42 მ','36 მ','48 მ']},
  {q:'ავტობუსი 50 კმ/სთ სიჩქარით 6 სთ-ში გადის მანძილს. რამდენ ხანში გაივლის იმავე მანძილს 75 კმ/სთ სიჩქარით?', a:'4 სთ', opts:['4 სთ','5 სთ','4 სთ 30 წთ']},
  {q:'კალათში 32 ხილია. ვაშლი მსხალზე 8-ით მეტია. კალათის რა ნაწილია მსხალი?', a:'3/8', opts:['3/8','5/8','1/4']},
  {q:'მანქანამ თანაბარი სიჩქარით 6 სთ-ში 270 კმ გაიარა. უკან რა სიჩქარით უნდა იაროს, რომ 1 სთ-ით და 30 წთ-ით ადრე ჩავიდეს?', a:'60 კმ/სთ', opts:['60 კმ/სთ','54 კმ/სთ','45 კმ/სთ']},
  {q:'4 ერთნაირი ტუმბო აუზს ავსებს 3 სთ-ში. რამდენ ხანში აავსებს იმავე აუზს 6 ასეთი ტუმბო?', a:'2 სთ', opts:['2 სთ','2 სთ 30 წთ','1 სთ 30 წთ']}
];
const KMX_OPT6 = [
  {q:'უჯრაში 12 წითელი და 9 ლურჯი წინდაა. სიბნელეში სულ მცირე რამდენი წინდა ამოვიღოთ, რომ ნამდვილად გვქონდეს ერთი ფერის წყვილი მაინც?', a:'3', opts:['3','2','12']},
  {q:'ყუთში 6 წითელი, 8 ლურჯი და 10 მწვანე ბურთია. სულ მცირე რამდენი ბურთი ამოვიღოთ თვალდახუჭულმა, რომ ნამდვილად გვქონდეს ერთი ფერის 3 ბურთი მაინც?', a:'7', opts:['7','9','3']},
  {q:'სულ მცირე რამდენი მოსწავლე უნდა იყოს ჯგუფში, რომ ნამდვილად სამი მათგანი ერთსა და იმავე თვეში იყოს დაბადებული?', a:'25', opts:['25','13','24']},
  {q:'1-დან 30-მდე რიცხვებიდან სულ მცირე რამდენი ავიღოთ, რომ ნამდვილად ორი მათგანის ჯამი იყოს 31?', a:'16', opts:['16','15','31']},
  {q:'2, 4, 6, 8, 9 ციფრებით (გამეორების გარეშე) შედგენილი უდიდესი და უმცირესი ხუთნიშნა რიცხვების სხვაობა რისი ტოლია?', a:'73953', opts:['73953','73853','74953']},
  {q:'1-დან 50-მდე რიცხვებიდან სულ მცირე რამდენი ავიღოთ, რომ ნამდვილად ორი მათგანი ზედიზედ მდგომი (სხვაობა 1) იყოს?', a:'26', opts:['26','25','50']},
  {q:'0, 4, 5, 7 ციფრებით (გამეორების გარეშე) შედგენილ უდიდეს და უმცირეს ოთხნიშნა რიცხვებს შორის სხვაობა რისი ტოლია?', a:'3483', opts:['3483','3493','3383']},
  {q:'რიცხვებიდან 17, 28, 39, 46, 57 სულ მცირე რამდენი უნდა წავშალოთ, რომ დარჩენილ ნებისმიერ ორ რიცხვს ჰქონდეს საერთო ციფრი მაინც?', a:'3', opts:['3','2','4']}
];
const KMX_BONUS6 = [
  {q:'ერთ თვეში დათოს შემოსავალი 120 ლარით გაიზარდა, მაგრამ ყოველდღიური ხარჯიც გაეზარდა 3 ლარით. რამდენი ლარით გაიზრდება ამ თვეში დათოს დანაზოგი? (თვე 30 დღეა)', a:'30', opts:['30','120','210']},
  {q:'მაღაზია ნივთს 25%-იანი ფასდაკლებით ყიდის. ფასდაკლების შემდეგ ის 90 ლარი ღირს. რა იყო საწყისი ფასი?', a:'120 ლარი', opts:['120 ლარი','115 ლარი','112 ლარი']},
  {q:'ლიკამ მაღაზიაში 60 ლარი დახარჯა, რაც მისი ფულის 3/5 იყო. რამდენი ლარი ჰქონდა თავიდან?', a:'100 ლარი', opts:['100 ლარი','90 ლარი','150 ლარი']},
  {q:'უბნის მაღაზიაში შაქარი 3 ლარი ღირს, შორეულ ბაზარში 2 ლარი და 40 თეთრი. ბაზარში მისვლა-მოსვლა 1 ლარი და 80 თეთრი ჯდება. სულ მცირე რამდენი კილოგრამი შაქრის ყიდვისას იღირება ბაზარში წასვლა, რომ სულ მცირე 1 ლარი და 20 თეთრი დავზოგოთ?', a:'5 კგ', opts:['5 კგ','6 კგ','4 კგ']},
  {q:'გია თვეში ხარჯავს 250 წუთ ზარს და 3 გბ ინტერნეტს. გეგმა A: 18 ლარი (300 წთ + 4 გბ). გეგმა B: 12 ლარი (150 წთ + 1 გბ), ზედმეტი ყოველი 100 წუთი 3 ლარი, ზედმეტი ყოველი გბ 4 ლარი. რომელია უფრო იაფი?', a:'გეგმა A, 18 ლარი', opts:['გეგმა A, 18 ლარი','გეგმა B, 23 ლარი','ორივე თანაბარი']},
  {q:'ანას ჰქონდა 200 ლარი. ბანკი წელიწადში 10% შემოსავალს უმატებს (მარტივი პროცენტი, ყოველ წელს საწყის თანხაზე). რამდენი ექნება 2 წლის შემდეგ?', a:'240 ლარი', opts:['240 ლარი','220 ლარი','242 ლარი']},
  {q:'მაღაზიამ ნივთი 80 ლარად იყიდა და 25%-იანი მოგებით გაყიდა. რა ფასად გაყიდა?', a:'100 ლარი', opts:['100 ლარი','105 ლარი','95 ლარი']},
  {q:'ლუკას ხელფასი 900 ლარია. ყოველთვიურად ხარჯავს ხელფასის 2/3-ს, დანარჩენს ზოგავს. რამდენ ლარს დააგროვებს 4 თვეში?', a:'1200 ლარი', opts:['1200 ლარი','900 ლარი','600 ლარი']}
];
const BLUEPRINT_math6 = [
  {label:'➗ მარტივი არითმეტიკა', instr:'აირჩიე სწორი პასუხი', pts:20, n:2, pool:KMX_ARITH6, type:'mq'},
  {label:'🔢 ნატურალური რიცხვები', instr:'აირჩიე სწორი პასუხი', pts:20, n:3, pool:KMX_NAT6, type:'mq'},
  {label:'🧮 ამოცანები გამოთვლაზე', instr:'ამოხსენი ამოცანა და აირჩიე სწორი პასუხი', pts:30, n:3, pool:KMX_CALC6, type:'mq'},
  {label:'🎯 მაქსიმუმი და მინიმუმი', instr:'იპოვე მაქსიმუმი ან მინიმუმი', pts:30, n:2, pool:KMX_OPT6, type:'mq'},
  {label:'💰 ბონუსი: ფინანსები', instr:'ფინანსური წიგნიერების ბონუს კითხვა', pts:30, n:3, pool:KMX_BONUS6, type:'mq', bonus:true}
];
