/* NikoLearn — Kings g4-6 content (eng+math), authored from real kings.ge PDFs 2026-06-26. Loads BEFORE kings-exam.js. */

// ke4 — Kings English grade 4. NOTES: reading rebuilt self-contained (img-free); GR 'no word' option; BONUS LIBERTY=3 (agent recomputed, flag vs official key)
const KEX_RD4 = [
  {q:'The sun is shining. The weather is ___.', a:'sunny', opts:['sunny','snowy','rainy']},
  {q:'The children are building a sandcastle. They are ___.', a:'playing', opts:['playing','sleeping','crying']},
  {q:'They are at the beach near the ___.', a:'sea', opts:['sea','mountain','forest']},
  {q:'There are small ___ on the beach.', a:'stones', opts:['stones','books','cars']},
  {q:'The kids are smiling. They are very ___.', a:'happy', opts:['happy','sad','cold']},
  {q:'It is raining. The weather is ___.', a:'rainy', opts:['rainy','sunny','windy']},
  {q:'The boy is running fast. He is ___.', a:'running', opts:['running','reading','eating']},
  {q:'The girl is in the water. She is ___.', a:'swimming', opts:['swimming','writing','singing']}
];
const KEX_SP4 = [
  {w:'cit_', a:'y', opts:['y','o','i']},{w:'sno_man', a:'w', opts:['w','v','u']},{w:'fri_nd', a:'e', opts:['e','a','o']},
  {w:'umbrel_a', a:'l', opts:['l','j','d']},{w:'ga_den', a:'r', opts:['r','c','e']},{w:'hol_day', a:'i', opts:['i','e','a']},
  {w:'mushro_m', a:'o', opts:['o','e','a']},{w:'paren_', a:'t', opts:['t','h','l']},{w:'oni_n', a:'o', opts:['o','u','a']},
  {w:'pa_e', a:'g', opts:['g','a','j']},{w:'hou_e', a:'s', opts:['s','z','c']},{w:'ta_le', a:'b', opts:['b','d','p']},{w:'ap_le', a:'p', opts:['p','b','t']}
];
const KEX_TR4 = [
  {ka:'თვე', a:'a month', opts:['a month','a day','a year']},{ka:'ყვავილი', a:'a flower', opts:['a flower','a tree','grass']},
  {ka:'პომიდორი', a:'a tomato', opts:['a tomato','a potato','a carrot']},{ka:'თავი', a:'a head', opts:['a head','a leg','a hand']},
  {ka:'აქლემი', a:'a camel', opts:['a camel','a lion','a tiger']},{ka:'მრგვალი საათი', a:'a round clock', opts:['a round clock','a big clock','a good clock']},
  {ka:'კარგი საავადმყოფო', a:'a good hospital', opts:['a good hospital','a dirty hospital','a good hotel']},{ka:'მწვანე კაბა', a:'a green dress', opts:['a green dress','a short dress','a green scarf']},
  {ka:'სასაცილო მაიმუნი', a:'a funny monkey', opts:['a funny monkey','a funny dog','a happy monkey']},{ka:'ზარმაცი მოსწავლე', a:'a lazy pupil', opts:['a lazy pupil','a good pupil','a lazy boy']},
  {ka:'წელი', a:'a year', opts:['a year','a month','a week']},{ka:'ფეხი', a:'a leg', opts:['a leg','a hand','a head']},{ka:'ლომი', a:'a lion', opts:['a lion','a tiger','a camel']}
];
const KEX_GR4 = [
  {q:'He ___ very kind.', a:'is', opts:['is','am','are']},{q:'It is ___ Sunday today.', a:'no word', opts:['no word','a','the']},
  {q:'My sister ___ milk.', a:'loves', opts:['loves','love','loving']},{q:'Stars ___ in the sky.', a:'are', opts:['are','is','am']},
  {q:'I ___ a brown dog.', a:'have', opts:['have','has','does']},{q:'It ___ very cold in winter.', a:'is', opts:['is','are','am']},
  {q:'We have two ___.', a:'hands', opts:['hands','hand','a hand']},{q:'___ apple is red.', a:'This', opts:['This','These','Those']},
  {q:'Kids play ___ the garden.', a:'in', opts:['in','to','of']},{q:'We go ___ school.', a:'to', opts:['to','on','with']},
  {q:'She ___ a cat.', a:'has', opts:['has','have','having']},{q:'They ___ my friends.', a:'are', opts:['are','is','am']},{q:'I ___ a student.', a:'am', opts:['am','is','are']}
];
const KEX_BN4 = [
  {q:'How many times is LIBERTY here? LIBERTY · BTLY · LIBERTY · LIBLTY · LIBERTY', a:'3', opts:['3','2','4']},
  {q:'How many times is SUN here? SUN · MAP · SUN · CAR · SUN', a:'3', opts:['3','2','4']},
  {q:'How many times is STAR here? STAR · MOON · STAR · STAR', a:'3', opts:['3','2','1']},
  {q:'How many times is CAT here? DOG · CAT · CAT · FOX · CAT', a:'3', opts:['3','2','4']},
  {q:'How many times is BOOK here? BOOK · PEN · BOOK · CUP', a:'2', opts:['2','3','1']},
  {q:'How many times is TREE here? TREE · TREE · BUSH · TREE · LEAF', a:'3', opts:['3','2','4']},
  {q:'How many times is FISH here? FISH · BIRD · FISH', a:'2', opts:['2','1','3']}
];
const BLUEPRINT_eng4 = [
  {label:'📖 READING', instr:'წაიკითხე და აირჩიე სწორი პასუხი', pts:10, n:5, pool:KEX_RD4, type:'gr'},
  {label:'🔤 VOCABULARY', instr:'აირჩიე გამოტოვებული ასო და ააწყვე სიტყვა', pts:30, n:10, pool:KEX_SP4, type:'sp'},
  {label:'🔁 TRANSLATION', instr:'აირჩიე ქართული სიტყვის სწორი ინგლისური თარგმანი', pts:30, n:10, pool:KEX_TR4, type:'tr'},
  {label:'📝 GRAMMAR', instr:'აირჩიე სწორი ვარიანტი', pts:30, n:10, pool:KEX_GR4, type:'gr'},
  {label:'⭐ BONUS', instr:'დათვალე და აირჩიე სწორი პასუხი', pts:5, n:1, pool:KEX_BN4, type:'gr', bonus:true}
];

// ke5b — Kings English g5. Flags: reading self-contained; GR "(none)"=no-article; LIBERTY=3. TR5 instr fixed ქართული→ინგლისური
const KEX_RC5 = [
  {q:'Sarah is having a big party next week. What is Sarah having?', a:'a party', opts:['a party','a lesson','a school trip']},
  {q:"The party is at Sarah's house. Where is the party?", a:"at Sarah's house", opts:["at Sarah's house","at Melissa's house","at Sam's house"]},
  {q:'Sam is going to decorate the house. Who is going to decorate the house?', a:'Sam', opts:['Sam','Sarah','John']},
  {q:'Her mother is going to bake a cake. What is her mother going to bake?', a:'a cake', opts:['a cake','a pie','bread']},
  {q:'Sarah thinks the party will be great. The party will be ___', a:'great', opts:['great','boring','sad']},
  {q:'John will be the DJ at the party. Who will be the DJ?', a:'John', opts:['John','Sam','Sarah']},
  {q:'The theme of the party is Harry Potter. What is the theme of the party?', a:'Harry Potter', opts:['Harry Potter','football','music']},
  {q:"Melissa can stay over at Sarah's house. Where can Melissa stay?", a:"at Sarah's house", opts:["at Sarah's house","at school","at the park"]}
];
const KEX_SP5 = [
  {w:'bot_le', a:'t', opts:['t','c','k']},{w:'s_issors', a:'c', opts:['s','k','c']},{w:'dinosa_r', a:'u', opts:['v','u','w']},
  {w:'c_rtoon', a:'a', opts:['a','u','e']},{w:'g_itar', a:'u', opts:['e','i','u']},{w:'lo_ry', a:'r', opts:['h','r','c']},
  {w:'f_mily', a:'a', opts:['e','h','a']},{w:'_nife', a:'k', opts:['k','c','e']},{w:'t_morrow', a:'o', opts:['u','o','e']},{w:'vill_ge', a:'a', opts:['a','e','i']}
];
const KEX_TR5 = [
  {ka:'ცარიელი ჭიქა', a:'an empty glass', opts:['an empty glass','a full glass','an empty bottle']},
  {ka:'ახლო მეგობარი', a:'a close friend', opts:['a close friend','a near friend','a closed friend']},
  {ka:'საშიში ქუჩა', a:'a dangerous street', opts:['a dangerous street','a safe street','a scared street']},
  {ka:'მძიმე ჩანთა', a:'a heavy bag', opts:['a heavy bag','a full bag','a thick bag']},
  {ka:'სუფთა იატაკი', a:'a clean floor', opts:['a clean floor','a dirty floor','a dusty floor']},
  {ka:'იღბლიანი მშობელი', a:'a lucky parent', opts:['a lucky parent','a happy parent','a glad parent']},
  {ka:'მარჯვენა კუთხე', a:'a right corner', opts:['a right corner','a left corner','a right place']},
  {ka:'კარგი პრიზი', a:'a good prize', opts:['a good prize','a rich prize','a good price']},
  {ka:'ღრმა ტბა', a:'a deep lake', opts:['a deep lake','a tall lake','a deep brook']},
  {ka:'ხმაურიანი წვეულება', a:'a noisy party', opts:['a noisy party','a sound party','a huge party']}
];
const KEX_GR5 = [
  {q:'I ___ very hungry.', a:'am', opts:['am','is','are']},
  {q:'They are my ___ .', a:'babies', opts:['babies','baby','babys']},
  {q:'We ___ tea.', a:'like', opts:['likes','like','liking']},
  {q:"Don't look at ___ sun.", a:'the', opts:['a','the','(none)']},
  {q:'My brother ___ two bikes.', a:'has', opts:['have','does','has']},
  {q:'How many ___ are there in the house?', a:'rooms', opts:['rooms','room','a room']},
  {q:'What ___ you do? I am a doctor.', a:'do', opts:['have','do','are']},
  {q:'___ bread is very tasty.', a:'This', opts:['Those','These','This']},
  {q:'I play ___ my dog.', a:'with', opts:['from','with','in']},
  {q:'We are going on holiday ___ spring.', a:'in', opts:['at','on','in']}
];
const KEX_BONUS5 = [
  {q:"How many times does LIBERTY appear in: LERTLIBETYBTLYLIBERTYBETLYRLYTIBETYLIBERTYLIBLTYLIBERTYTYLBELIERTY ?", a:'3', opts:['3','2','4']},
  {q:'How many times does BANK appear in: TBANKRLYBANKBETYBANKLY ?', a:'3', opts:['3','2','4']},
  {q:'How many times does SUN appear in: SUNXSUNYSUNZSUN ?', a:'4', opts:['4','3','5']},
  {q:'How many times does CAT appear in: RLCATBETYCATLY ?', a:'2', opts:['2','1','3']},
  {q:'How many times does STAR appear in: STARLYRTSTARBE ?', a:'2', opts:['2','3','1']},
  {q:'How many times does FISH appear in: FISHXFISHYFISHZ ?', a:'3', opts:['3','2','4']},
  {q:'How many times does KING appear in: KINGRKINGTKINGYKING ?', a:'4', opts:['4','3','5']}
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
  {q:'Penguins only live at the ___ Pole.', a:'South', opts:['South','North','both']},
  {q:'How many different kinds of penguins are there?', a:'seventeen', opts:['seventeen','seven','seventy']},
  {q:'Penguins live in ___ areas.', a:'cold', opts:['cold','hot','warm']},
  {q:'Penguins are great at ___.', a:'swimming', opts:['swimming','flying','singing']},
  {q:'Killer whales are penguins ___.', a:'enemies', opts:['enemies','friends','relatives']},
  {q:'The largest penguin is the ___ Penguin.', a:'Emperor', opts:['Emperor','Little Blue','King']},
  {q:'The smallest penguin is the Little ___ Penguin.', a:'Blue', opts:['Blue','Green','Red']},
  {q:'Penguins have thick layers of ___ to protect from the cold.', a:'fat', opts:['fat','fur','feathers']},
  {q:'None of the penguins can ___.', a:'fly', opts:['fly','swim','dive']}
];
const KEX_VOC6 = [
  {q:'The colour of fresh grass:', a:'green', opts:['green','grey','white']},
  {q:'A woman who has the care of a young child:', a:'a nurse', opts:['a nurse','a pilot','a doctor']},
  {q:'A brown or grey animal with a long, fluffy tail that lives in trees:', a:'a squirrel', opts:['a squirrel','a rabbit','an ox']},
  {q:'A place where a lot of books are kept:', a:'a library', opts:['a library','a school','a museum']},
  {q:'A thick growth of trees:', a:'woods', opts:['woods','a road','a pond']},
  {q:'A brightly coloured bird that can mimic speech:', a:'a parrot', opts:['a parrot','a sparrow','an eagle']},
  {q:'A bag filled with soft material used for the head of a person:', a:'a pillow', opts:['a pillow','a glove','a scarf']},
  {q:'A small container for money:', a:'a purse', opts:['a purse','a box','a drawer']},
  {q:'A large house where kings and queens live:', a:'a palace', opts:['a palace','a hut','a church']},
  {q:'A person who lives near another:', a:'a neighbour', opts:['a neighbour','a friend','a relative']},
  {q:'A person who flies a plane:', a:'a pilot', opts:['a pilot','a driver','a sailor']},
  {q:'A place where many animals are kept and shown to people:', a:'a zoo', opts:['a zoo','a farm','a forest']}
];
const KEX_ODD6 = [
  {q:'Choose the odd one: shorts, trousers, ring', a:'ring', opts:['ring','shorts','trousers']},
  {q:'Choose the odd one: brick, egg, butter', a:'brick', opts:['brick','egg','butter']},
  {q:'Choose the odd one: garden, kitchen, bathroom', a:'garden', opts:['garden','kitchen','bathroom']},
  {q:'Choose the odd one: classmate, neighbour, story', a:'story', opts:['story','classmate','neighbour']},
  {q:'Choose the odd one: gift, bus, metro', a:'gift', opts:['gift','bus','metro']},
  {q:'Choose the odd one: cake, ink, biscuit', a:'ink', opts:['ink','cake','biscuit']},
  {q:'Choose the odd one: suitcases, jokes, bags', a:'jokes', opts:['jokes','suitcases','bags']},
  {q:'Choose the odd one: money, coins, twins', a:'twins', opts:['twins','money','coins']},
  {q:'Choose the odd one: tomato, pork, cucumber', a:'pork', opts:['pork','tomato','cucumber']},
  {q:'Choose the odd one: giraffe, dolphin, lion', a:'dolphin', opts:['dolphin','giraffe','lion']},
  {q:'Choose the odd one: apple, banana, chair', a:'chair', opts:['chair','apple','banana']},
  {q:'Choose the odd one: red, green, table', a:'table', opts:['table','red','green']}
];
const KEX_GR6 = [
  {q:'We have two new pupils in our class: ___ boy and ___ girl.', a:'a / a', opts:['a / a','- / -','the / the']},
  {q:'My parents ___ very pleased to see me.', a:'were', opts:['were','was','did not be']},
  {q:'There is not ___ water in this glass.', a:'any', opts:['any','some','no']},
  {q:'My wife is more intelligent ___ me.', a:'than', opts:['than','to','from']},
  {q:'We greeted our friends ___.', a:'happily', opts:['happily','happy','happyly']},
  {q:'Where ___ going to study?', a:'are you', opts:['are you','you are','do you']},
  {q:'How ___ milk do we have?', a:'much', opts:['much','many','long']},
  {q:'___ talk to John, he is busy.', a:'Do not', opts:['Do not','No','Not']},
  {q:'Ann ___ watching TV when Dad came in.', a:'was not', opts:['was not','not was','did not']},
  {q:'I saw Mark ___ Friday afternoon.', a:'on', opts:['on','in','in the']},
  {q:'There are not ___ apples in the basket.', a:'many', opts:['many','much','any of']},
  {q:'This book is ___ than that one.', a:'better', opts:['better','more good','gooder']}
];
const KEX_BONUS6 = [
  {q:'A large copper statue of a woman holding a burning torch on Liberty Island, in New York harbor:', a:'The Statue of Liberty', opts:['The Statue of Liberty','The Great Sphinx','The Statue of David']},
  {q:'A tall iron tower in Paris, France:', a:'The Eiffel Tower', opts:['The Eiffel Tower','Big Ben','The Tower of London']},
  {q:'A famous clock tower in London, England:', a:'Big Ben', opts:['Big Ben','The Eiffel Tower','The Colosseum']},
  {q:'A very long ancient wall built in China:', a:'The Great Wall', opts:['The Great Wall','The Great Sphinx','The Pyramids']},
  {q:'Ancient huge stone tombs of pharaohs in Egypt:', a:'The Pyramids', opts:['The Pyramids','The Colosseum','Big Ben']},
  {q:'A large ancient stone arena for games in Rome, Italy:', a:'The Colosseum', opts:['The Colosseum','The Great Wall','The Eiffel Tower']},
  {q:'A huge ancient statue with a lion body and a human head in Egypt:', a:'The Great Sphinx', opts:['The Great Sphinx','The Statue of Liberty','The Statue of David']}
];
const BLUEPRINT_eng6 = [
  {label:'📖 READING', instr:'წაიკითხე ტექსტი და აირჩიე სწორი პასუხი', pts:10, n:5, pool:KEX_RC6, type:'gr'},
  {label:'📚 VOCABULARY', instr:'გამოიცანი სიტყვა აღწერის მიხედვით', pts:30, n:10, pool:KEX_VOC6, type:'gr'},
  {label:'🔎 VOCABULARY', instr:'აირჩიე ზედმეტი სიტყვა', pts:30, n:10, pool:KEX_ODD6, type:'gr'},
  {label:'✏️ GRAMMAR', instr:'აირჩიე სწორი პასუხი', pts:30, n:10, pool:KEX_GR6, type:'gr'},
  {label:'⭐ BONUS', instr:'აირჩიე სწორი პასუხი აღწერის მიხედვით', pts:5, n:1, pool:KEX_BONUS6, type:'gr', bonus:true}
];

// km4 — Kings math g4. Flags: single PDF variant; LIBERTY=3, Magti=კი (agent recomputed)
const KMX_PAT4 = [
  {q:'დაადგინე კანონზომიერება და იპოვე შემდეგი რიცხვი: 9, 2, 7, 4, 5, 6, 3, 8, ?', a:'1', opts:['1','5','3']},
  {q:'იპოვე გამოტოვებული რიცხვი: 2, 3, 5, 5, ?, 8, 8, 9, 11, 11, 12, 14', a:'6', opts:['6','7','5']},
  {q:'იპოვე შემდეგი რიცხვი: 1, 9, 2, 7, 3, 5, 4, 3, ?', a:'5', opts:['5','3','6']},
  {q:'იპოვე შემდეგი რიცხვი: 1, 2, 4, 7, 11, ?', a:'16', opts:['16','15','14']},
  {q:'იპოვე შემდეგი რიცხვი: 2, 4, 8, 16, ?', a:'32', opts:['32','24','30']},
  {q:'იპოვე გამოტოვებული რიცხვი: 1, 2, 4, 4, ?, 7, 7, 8, 10, 10, 11, 13', a:'5', opts:['5','6','4']},
  {q:'იპოვე შემდეგი რიცხვი: 20, 1, 17, 2, 14, 3, 11, 4, ?', a:'8', opts:['8','9','7']},
  {q:'იპოვე შემდეგი რიცხვი: 5, 6, 8, 11, 15, ?', a:'20', opts:['20','19','21']}
];
const KMX_ARI4 = [
  {q:'ორი განსხვავებული ორნიშნა რიცხვის შეკრებით ყველაზე დიდი რა პასუხის მიღება შეგვიძლია?', a:'197', opts:['197','199','198']},
  {q:'სულ მცირე რამდენი ორნიშნა რიცხვი უნდა დავწეროთ დაფაზე, რომ დაფაზე ყველა კენტი ციფრი ეწეროს?', a:'3', opts:['3','5','10']},
  {q:'მარი ფორთოხლის გაფცქვნას 3 წუთს ანდომებს, ხოლო მის შეჭმას 1 წუთს. რამდენი ფორთოხლის შეჭმას მოასწრებს ის 10 წუთში, თუ ჯერ უნდა გაფცქვნას?', a:'2', opts:['2','3','4']},
  {q:'ორი განსხვავებული ორნიშნა რიცხვის შეკრებით ყველაზე პატარა რა პასუხის მიღება შეგვიძლია?', a:'21', opts:['21','20','22']},
  {q:'ყველაზე დიდ ორნიშნა რიცხვს გამოვაკლოთ ყველაზე პატარა ორნიშნა რიცხვი. რა მივიღეთ?', a:'89', opts:['89','88','90']},
  {q:'სულ მცირე რამდენი ორნიშნა რიცხვი უნდა დავწეროთ დაფაზე, რომ დაფაზე ყველა ლუწი ციფრი ეწეროს?', a:'3', opts:['3','2','5']},
  {q:'ნიკა კანფეტის გახსნას 2 წუთს ანდომებს, ხოლო შეჭმას 1 წუთს. რამდენი კანფეტის შეჭმას მოასწრებს ის 12 წუთში, თუ ჯერ უნდა გახსნას?', a:'4', opts:['4','3','5']},
  {q:'ყველაზე დიდი ორნიშნა რიცხვი და ყველაზე პატარა ორნიშნა რიცხვი შევკრიბოთ. რა მივიღეთ?', a:'109', opts:['109','108','110']}
];
const KMX_LOG4 = [
  {q:'კინგსის ოლიმპიადაზე ქეთიმ შაკოზე 5-ით მეტი ქულა დააგროვა, ხოლო თეომ 7-ით ნაკლები, ვიდრე ქეთიმ. თუ თეო მეორე ტურში გადავიდა, კიდევ ვინ გადავიდოდა მეორე ტურში?', a:'შაკო და ქეთი', opts:['შაკო და ქეთი','მხოლოდ ქეთი','მხოლოდ შაკო']},
  {q:'რა დროშიც სანდრო 2 ქადას შეჭამს, იმ დროში ბექა 3 ქადას ჭამს. ერთად დაიწყეს და ერთდროულად დაასრულეს. რამდენი ქადა შეჭამა სანდრომ, თუ ორივემ ერთად 10 ქადა შეჭამა?', a:'4', opts:['4','6','10']},
  {q:'მულტფილმის დასრულებამდე ტელევიზორში ყოველდღე აჩვენებდნენ ერთ სერიას. ნინიმ მხოლოდ სამი სერია ნახა და სამივე სხვადასხვა კვირაში. სულ მცირე რამდენი სერიისგან შედგებოდა მულტფილმი?', a:'15', opts:['15','14','21']},
  {q:'რა დროშიც ნინო 3 გვერდს კითხულობს, იმ დროში გიო 5 გვერდს კითხულობს. ერთად დაიწყეს და ერთდროულად დაასრულეს. რამდენი გვერდი წაიკითხა ნინომ, თუ ერთად 16 გვერდი წაიკითხეს?', a:'6', opts:['6','10','8']},
  {q:'ანამ ბესოზე 4-ით მეტი ქულა დააგროვა, ხოლო გიამ 6-ით ნაკლები, ვიდრე ანამ. თუ გია მეორე ტურში გადავიდა, კიდევ ვინ გადავიდოდა?', a:'ანა და ბესო', opts:['ანა და ბესო','მხოლოდ ანა','მხოლოდ ბესო']},
  {q:'რა დროშიც ლუკა 2 ხინკალს ჭამს, იმ დროში ნიკა 4 ხინკალს ჭამს. ერთად დაიწყეს და ერთდროულად დაასრულეს. რამდენი ხინკალი შეჭამა ლუკამ, თუ ერთად 18 ხინკალი შეჭამეს?', a:'6', opts:['6','12','9']},
  {q:'ტელევიზორში ყოველდღე აჩვენებდნენ ერთ სერიას. მარიმ მხოლოდ ორი სერია ნახა, ორივე სხვადასხვა კვირაში. სულ მცირე რამდენი სერიისგან შედგებოდა მულტფილმი?', a:'8', opts:['8','7','14']},
  {q:'რა დროშიც გიორგი 4 წრეს გარბენს, იმ დროში საბა 6 წრეს გარბენს. ერთად დაიწყეს და ერთდროულად დაასრულეს. რამდენი წრე გაირბინა გიორგიმ, თუ ერთად 20 წრე გაირბინეს?', a:'8', opts:['8','12','10']}
];
const KMX_GUESS4 = [
  {q:'რომელი რიცხვია 17-ზე 10-ით მეტი?', a:'27', opts:['27','17','7']},
  {q:'გამოიცანი ჩაფიქრებული რიცხვი, თუ ის მეტია 23-ზე, ნაკლებია 26-ზე და კენტია.', a:'25', opts:['25','37','28']},
  {q:'გამოიცანი ჩაფიქრებული რიცხვი, თუ ის მეტია 40-ზე, ნაკლებია 44-ზე და ლუწია.', a:'42', opts:['42','41','43']},
  {q:'რომელი რიცხვია 30-ზე 5-ით ნაკლები?', a:'25', opts:['25','35','24']},
  {q:'გამოიცანი ჩაფიქრებული რიცხვი, თუ ის მეტია 17-ზე, ნაკლებია 20-ზე და კენტია.', a:'19', opts:['19','18','21']},
  {q:'რომელი რიცხვია 35-ზე 10-ით მეტი?', a:'45', opts:['45','25','40']},
  {q:'გამოიცანი ჩაფიქრებული რიცხვი, თუ ის მეტია 50-ზე, ნაკლებია 53-ზე და ლუწია.', a:'52', opts:['52','51','53']},
  {q:'რომელი რიცხვია 14-ის ორმაგი?', a:'28', opts:['28','24','30']}
];
const KMX_BON4 = [
  {q:'მარიამს მშობლებმა ჯიბის ფულის სახით 10 ლარი მისცეს, ბებიამ კი დამატებით 5 ლარი აჩუქა. შემდეგ მარიამმა ძმას 4 ლარი მისცა. საბოლოოდ რამდენი ლარი აქვს მარიამს?', a:'11', opts:['11','15','19']},
  {q:'ნიკას სათამაშო მატარებლის ყიდვა უნდა. სახლთან ახლოს მაღაზიაში ის 30 ლარი ღირს, ხოლო საზღვარგარეთ ინტერნეტ-მაღაზიაში 20 ლარი, საქართველოში ჩამოტანა კი დამატებით 10 ლარი ჯდება. რომელ შემთხვევაში დახარჯავს ნიკა ნაკლებ თანხას?', a:'ორივე შემთხვევაში ერთნაირ თანხას დახარჯავს', opts:['ორივე შემთხვევაში ერთნაირ თანხას დახარჯავს','სახლთან ახლოს მაღაზიაში','საზღვარგარეთიდან გამოწერით']},
  {q:'კრისტალის ბონუს კითხვა: ნიკა სახლიდან 3 საათით გავიდა და სინათლის ჩაქრობა დაავიწყდა. რა თანხით მეტის გადახდა მოუწევს ელექტროენერგიაში, თუ 1 საათში 1 თეთრის ღირებულების ელექტროენერგია იხარჯება?', a:'3 თეთრი', opts:['3 თეთრი','2 თეთრი','1 თეთრი']},
  {q:'ლიბერთი ბანკის ბონუს კითხვა: ირაკლიმ 2 წლის წინ ლიბერთი ბანკში ანაბარი გახსნა. რამდენი წლისაა ის ახლა, თუ მაშინ 17 წლის იყო?', a:'19', opts:['19','15','17']},
  {q:'ბიუ-ბიუს ბონუს კითხვა: ბიუ-ბიუს ქათმის ხორცის პროდუქცია ხელმისაწვდომია ქალაქებში: თბილისი, რუსთავი, ხაშური, გორი, ზუგდიდი, ქუთაისი, ბათუმი. სულ რამდენ ქალაქში ყოფილა შესაძლებელი მისი შეძენა?', a:'7', opts:['7','5','6']},
  {q:'მაგთის ბონუს კითხვა: ნიკუშას ტელეფონის ნომერი იწყება ციფრებით 599000 და შემდეგ კიდევ 3 ციფრია. შეიძლება თუ არა დანარჩენი 3 ციფრი ისე შევარჩიოთ, რომ ნომრის ციფრთა ჯამი 23-ს უდრიდეს?', a:'კი', opts:['კი','არა','ვერ დავადგენთ']},
  {q:'საბას ჰქონდა 20 ლარი, წიგნში დახარჯა 7 ლარი, შემდეგ დედამ 5 ლარი მისცა. რამდენი ლარი აქვს ახლა საბას?', a:'18', opts:['18','22','12']},
  {q:'სათამაშო A მაღაზიაში 40 ლარი ღირს. B მაღაზიაში 25 ლარია, მიწოდება კი დამატებით 15 ლარი ჯდება. რომელ შემთხვევაში დახარჯავ ნაკლებ თანხას?', a:'ორივეგან ერთნაირ თანხას', opts:['ორივეგან ერთნაირ თანხას','A მაღაზიაში','B მაღაზიაში']},
  {q:'ნინო ყოველ კვირას 3 ლარს ზოგავს. რამდენ ლარს დააგროვებს ის 4 კვირაში?', a:'12', opts:['12','7','9']}
];
const BLUEPRINT_math4 = [
  {label:'🧩 კანონზომიერება', instr:'დაადგინე კანონზომიერება და იპოვე რიცხვი', pts:20, n:2, pool:KMX_PAT4, type:'mq'},
  {label:'➕ არითმეტიკა', instr:'ამოხსენი ამოცანა', pts:20, n:3, pool:KMX_ARI4, type:'mq'},
  {label:'🧠 ლოგიკა', instr:'დაფიქრდი და უპასუხე', pts:30, n:3, pool:KMX_LOG4, type:'mq'},
  {label:'🔢 გამოიცანი უცნობი რიცხვი', instr:'იპოვე სწორი რიცხვი', pts:30, n:2, pool:KMX_GUESS4, type:'mq'},
  {label:'🎁 ბონუსი', instr:'ბონუს კითხვები', pts:30, n:6, pool:KMX_BON4, type:'mq', bonus:true}
];

// km5 — Kings math g5. Flag: Keso=15 (PDF key, plant-and-water-same-Tuesday)
const KMX_CMP5 = [
{q:'დილის 6 საათიდან საღამოს 5 საათამდე მეტი დროა, თუ საღამოს 5 საათიდან დილის 6 საათამდე?', a:'საღამოს 5-დან დილის 6-მდე', opts:['დილის 6-დან საღამოს 5-მდე','საღამოს 5-დან დილის 6-მდე','თანაბარია']},
{q:'გიორგის 6-ით მეტი მარკა აქვს, ვიდრე დავითს. გიორგი დავითს 4 მარკას თუ მისცემს, ვის ექნება მეტი?', a:'დავითს', opts:['გიორგის','დავითს','თანაბრად']},
{q:'ნინოს 8-ით მეტი კანფეტი აქვს, ვიდრე ლიკას. ნინო ლიკას 5 კანფეტს თუ მისცემს, ვის ექნება მეტი?', a:'ლიკას', opts:['ნინოს','ლიკას','თანაბრად']},
{q:'ანას 10-ით მეტი წიგნი აქვს, ვიდრე ბექას. ანა ბექას 5 წიგნს თუ მისცემს, ვის ექნება მეტი?', a:'თანაბრად', opts:['ანას','ბექას','თანაბრად']},
{q:'პირველ კალათაში 3-ით მეტი ვაშლია, ვიდრე მეორეში. პირველი მეორეს 1 ვაშლს თუ მისცემს, რომელ კალათას ექნება მეტი?', a:'პირველ კალათას', opts:['პირველ კალათას','მეორე კალათას','თანაბრად']},
{q:'დილის 8 საათიდან საღამოს 9 საათამდე მეტი დროა, თუ საღამოს 9 საათიდან დილის 8 საათამდე?', a:'დილის 8-დან საღამოს 9-მდე', opts:['დილის 8-დან საღამოს 9-მდე','საღამოს 9-დან დილის 8-მდე','თანაბარია']},
{q:'დილის 7 საათიდან საღამოს 7 საათამდე მეტი დროა, თუ საღამოს 7 საათიდან დილის 7 საათამდე?', a:'თანაბარია', opts:['დილის 7-დან საღამოს 7-მდე','საღამოს 7-დან დილის 7-მდე','თანაბარია']}
];
const KMX_ARITH5 = [
{q:'მწკრივში 12 ბიჭი დგას და ყოველ ორ მომდევნო ბიჭს შორის ზუსტად 2 გოგონაა. რამდენი ბავშვია სულ, თუ პირველიც და ბოლოც ბიჭია?', a:'34', opts:['32','34','36']},
{q:'ავტომობილი 100 კმ-ის გავლისას წვავს 10 ლიტრ საწვავს. რამდენ კილომეტრს გაივლის ის 20 ლიტრით?', a:'200 კმ', opts:['50 კმ','120 კმ','200 კმ']},
{q:'ფუნთუშა 40 თეთრი ღირს. 2 ხაჭაპურის ფასად მხოლოდ 7 ფუნთუშის ყიდვა შეგვიძლია. რა შეიძლება ღირდეს ერთი ხაჭაპური?', a:'1 ლ 50 თ', opts:['1 ლ 30 თ','1 ლ 50 თ','2 ლ 20 თ']},
{q:'მწკრივში 8 ბიჭი დგას და ყოველ ორ მომდევნო ბიჭს შორის ზუსტად 3 გოგონაა. რამდენი ბავშვია სულ, თუ პირველიც და ბოლოც ბიჭია?', a:'29', opts:['27','29','31']},
{q:'ხეივანში 10 ხეა ერთ რიგში და ყოველ ორ მომდევნო ხეს შორის 1 ბუჩქია. რამდენი მცენარეა სულ, თუ პირველიც და ბოლოც ხეა?', a:'19', opts:['18','19','20']},
{q:'ავტობუსი 100 კმ-ის გავლისას წვავს 15 ლიტრ საწვავს. რამდენ კილომეტრს გაივლის ის 45 ლიტრით?', a:'300 კმ', opts:['200 კმ','300 კმ','450 კმ']},
{q:'ფანქარი 30 თეთრი ღირს. 2 კალმის ფასად მხოლოდ 5 ფანქრის ყიდვა შეგვიძლია. რა შეიძლება ღირდეს ერთი კალამი?', a:'80 თეთრი', opts:['70 თეთრი','80 თეთრი','1 ლარი']},
{q:'მანქანა 100 კმ-ზე წვავს 8 ლიტრს. რამდენ კილომეტრს გაივლის ის 24 ლიტრით?', a:'300 კმ', opts:['250 კმ','300 კმ','320 კმ']}
];
const KMX_LOGIC5 = [
{q:'პარიზი თბილისს 3 საათით ჩამორჩება. თვითმფრინავი თბილისიდან პარიზამდე 4 საათში დაფრინავს. თბილისის დროით რომელ საათზე უნდა გაფრინდეს, რომ პარიზში პარიზის დროით 17 საათზე ჩაფრინდეს?', a:'16 საათზე', opts:['13 საათზე','15 საათზე','16 საათზე']},
{q:'2 სპილო მეტს იწონის, ვიდრე 2 ბეჰემოტი და 1 მარტორქა ერთად. 2 ბეჰემოტი მეტს იწონის, ვიდრე 1 სპილო და 1 მარტორქა ერთად. დაალაგე ცხოველები წონის კლებით.', a:'სპილო, ბეჰემოტი, მარტორქა', opts:['სპილო, ბეჰემოტი, მარტორქა','სპილო, მარტორქა, ბეჰემოტი','მარტორქა, სპილო, ბეჰემოტი']},
{q:'მელა ერთ ფიალა თაფლს ჭამს 10 წუთში, კურდღელი 12 წუთში, დათვი 8 წუთში. სხვადასხვა დროს დაიწყეს, ერთად დაასრულეს და თაფლი თანაბრად შეხვდათ. ვინ დაიწყო ჭამა ყველაზე ადრე?', a:'კურდღელმა', opts:['მელამ','კურდღელმა','დათვმა']},
{q:'ლონდონი თბილისს 4 საათით ჩამორჩება. ფრენა თბილისიდან ლონდონამდე 5 საათია. თბილისის დროით რომელ საათზე უნდა გაფრინდეს, რომ ლონდონში ლონდონის დროით 14 საათზე ჩაფრინდეს?', a:'13 საათზე', opts:['13 საათზე','14 საათზე','18 საათზე']},
{q:'თვითმფრინავი 3 საათში დაფრინავს, დანიშნულების ადგილი 2 საათით ჩამორჩება. ადგილობრივი დროით რომელ საათზე უნდა გაფრინდეს, რომ იქ ადგილობრივი დროით 12 საათზე ჩაფრინდეს?', a:'11 საათზე', opts:['10 საათზე','11 საათზე','12 საათზე']},
{q:'2 ლომი მეტს იწონის, ვიდრე 2 ვეფხვი და 1 მგელი ერთად. 2 ვეფხვი მეტს იწონის, ვიდრე 1 ლომი და 1 მგელი ერთად. დაალაგე ცხოველები წონის კლებით.', a:'ლომი, ვეფხვი, მგელი', opts:['ლომი, ვეფხვი, მგელი','ლომი, მგელი, ვეფხვი','ვეფხვი, ლომი, მგელი']},
{q:'სამმა მხატვარმა ერთი ღობე უნდა შეღებოს: პირველი მარტო 6 საათში ღებავს, მეორე 9 საათში, მესამე 18 საათში. თითოეულმა თანაბარი ნაწილი შეღება და ერთად დაასრულეს. ვინ დაიწყო ღებვა ყველაზე ადრე?', a:'მესამემ', opts:['პირველმა','მეორემ','მესამემ']},
{q:'კატა ერთ ფიალა რძეს ჭამს 15 წუთში, ძაღლი 10 წუთში, თაგვი 30 წუთში. სხვადასხვა დროს დაიწყეს, ერთად დაასრულეს და თანაბრად შეხვდათ. ვინ დაიწყო ყველაზე ადრე?', a:'თაგვმა', opts:['კატამ','ძაღლმა','თაგვმა']}
];
const KMX_MINMAX5 = [
{q:'კესომ ყვავილები დარგო და ის მათ მხოლოდ სამშაბათობით, დღეში ერთხელ რწყავს. ამჟამად 3-ჯერ აქვს მორწყული. სულ მცირე, მერამდენე დღეა, რაც მან ყვავილები დარგო?', a:'15', opts:['15','18','21']},
{q:'რამდენით მეტია განსხვავებული კენტი ციფრებით ჩაწერილი უდიდესი სამნიშნა რიცხვი განსხვავებული ლუწი ციფრებით ჩაწერილ უმცირეს სამნიშნა რიცხვზე?', a:'771-ით', opts:['336-ით','568-ით','771-ით']},
{q:'რამდენით მეტია განსხვავებული ლუწი ციფრებით ჩაწერილი უდიდესი სამნიშნა რიცხვი განსხვავებული კენტი ციფრებით ჩაწერილ უმცირეს სამნიშნა რიცხვზე?', a:'729-ით', opts:['729-ით','680-ით','555-ით']},
{q:'მებაღემ ყვავილები დარგო და მათ მხოლოდ კვირაობით, დღეში ერთხელ რწყავს. ამჟამად 4-ჯერ აქვს მორწყული. სულ მცირე, მერამდენე დღეა, რაც დარგო?', a:'22', opts:['22','28','29']},
{q:'სანდრომ ყვავილები დარგო და მათ მხოლოდ ორშაბათობით, დღეში ერთხელ რწყავს. ამჟამად 2-ჯერ აქვს მორწყული. სულ მცირე, მერამდენე დღეა, რაც დარგო?', a:'8', opts:['8','14','15']},
{q:'რომელია უდიდესი სამნიშნა რიცხვი, რომელშიც ყველა ციფრი ერთმანეთისგან განსხვავებულია?', a:'987', opts:['987','999','978']},
{q:'რომელია უმცირესი სამნიშნა რიცხვი, რომელიც განსხვავებული ლუწი ციფრებითაა ჩაწერილი?', a:'204', opts:['204','246','420']},
{q:'რომელია უდიდესი სამნიშნა რიცხვი, რომელიც განსხვავებული კენტი ციფრებითაა ჩაწერილი?', a:'975', opts:['975','999','997']}
];
const KMX_BONUS5 = [
{q:'მაისში სანდროს შემოსავალი 100 ლარით გაიზარდა, მაგრამ მისი ყოველდღიური ხარჯიც გაიზარდა 2 ლარით. რამდენი ლარით გაიზრდება მაისში სანდროს დანაზოგი?', a:'38', opts:['38','40','160']},
{q:'სახლის გვერდით შაქარი 2 ლარი ღირს, გარეუბანში კი 1 ლარი და 70 თეთრი. გარეუბანში მისვლა-მოსვლა 1 ლარი და 50 თეთრი ჯდება. სულ მცირე რამდენი კილოგრამი შაქრისთვის ღირს გარეუბანში წასვლა, რომ მაინც 2 ლარი დავზოგოთ?', a:'12 კგ', opts:['12 კგ','15 კგ','18 კგ']},
{q:'ნიკა სახლიდან 3 საათით გავიდა და სინათლის ჩაქრობა დაავიწყდა. რა თანხით მეტი მოუწევს გადახდა, თუ 1 საათში 1 თეთრის ელექტროენერგია იხარჯება?', a:'3 თეთრი', opts:['3 თეთრი','2 თეთრი','1 თეთრი']},
{q:'ირაკლიმ 2 წლის წინ ანაბარი გახსნა. რამდენი წლისაა ის ახლა, თუ მაშინ 17 წლის იყო?', a:'19', opts:['15','17','19']},
{q:'ქათმის ხორცის პროდუქცია ხელმისაწვდომია ქალაქებში: თბილისი, რუსთავი, ხაშური, გორი, ზუგდიდი, ქუთაისი, ბათუმი. სულ რამდენ ქალაქშია შესაძლებელი მისი შეძენა?', a:'7', opts:['5','6','7']},
{q:'ნიკუშას ტელეფონის ნომერი იწყება ციფრებით 599000, შემდეგ კი 3 ციფრი აკლია. შეიძლება თუ არა ისე შევარჩიოთ ბოლო 3 ციფრი, რომ ნომრის ციფრთა ჯამი 23 იყოს?', a:'კი', opts:['კი','არა','ვერ დავადგენთ']},
{q:'ივნისში ნინოს შემოსავალი 150 ლარით გაიზარდა, ხარჯი კი ყოველდღიურად 3 ლარით. რამდენი ლარით გაიზრდება ივნისში ნინოს დანაზოგი?', a:'60', opts:['60','90','150']},
{q:'ლუკამ 5 წლის წინ ანაბარი გახსნა. რამდენი წლისაა ის ახლა, თუ მაშინ 12 წლის იყო?', a:'17', opts:['15','17','19']},
{q:'ტელეფონის ნომერი იწყება ციფრებით 577111, შემდეგ 3 ციფრი აკლია. შეიძლება თუ არა ისე შევარჩიოთ ბოლო 3 ციფრი, რომ ნომრის ციფრთა ჯამი 30 იყოს?', a:'კი', opts:['კი','არა','ვერ დავადგენთ']}
];
const BLUEPRINT_math5 = [
{label:'⚖️ რაოდენობრივი შედარება', instr:'შეადარე და აირჩიე სწორი პასუხი', pts:20, n:2, pool:KMX_CMP5, type:'mq'},
{label:'➗ არითმეტიკა', instr:'ამოხსენი ამოცანა', pts:20, n:3, pool:KMX_ARITH5, type:'mq'},
{label:'🧠 ლოგიკა', instr:'იფიქრე ლოგიკურად', pts:30, n:3, pool:KMX_LOGIC5, type:'mq'},
{label:'🔢 უდიდესი და უმცირესი', instr:'იპოვე უდიდესი ან უმცირესი რიცხვი', pts:30, n:2, pool:KMX_MINMAX5, type:'mq'},
{label:'💰 ბონუსი: ფინანსები', instr:'ბონუს კითხვები ფინანსურ განათლებაზე', pts:30, n:6, pool:KMX_BONUS5, type:'mq', bonus:true}
];

// km6 — Kings math g6. Note: some long trick-answer options (bank/chicken/Magti) faithful to PDF; check render width
const KMX_ARITH6 = [
  {q:'რომელი გამოსახულების მნიშვნელობაა უმცირესი?', a:'(16:8):(4:2)', opts:['16:(8:(4:2))','(16:8):(4:2)','16:(8:4):2']},
  {q:'9∎8∎7∎6∎3 გამოსახულებაში ∎-ების ნაცვლად ჩასვი +, -, :, × (თითო-თითოჯერ). ყველაზე დიდი მიღებული პასუხია:', a:'77', opts:['77','65','63']},
  {q:'რომელი გამოსახულების მნიშვნელობაა უმცირესი?', a:'(24:12):(6:3)', opts:['24:(12:(6:3))','(24:12):(6:3)','24:(12:6):3']},
  {q:'გამოთვალე: 36 : 6 + 4 × 3 - 5', a:'13', opts:['13','25','11']},
  {q:'გამოთვალე: 100 - 6 × 8 + 12 : 4', a:'55', opts:['55','52','58']},
  {q:'8∎6∎5∎4∎2 გამოსახულებაში ∎-ების ნაცვლად ჩასვი +, -, ×, : (თითო-თითოჯერ). ყველაზე დიდი პასუხია:', a:'51', opts:['51','45','36']},
  {q:'გამოთვალე: (18 - 6) : 3 + 7 × 2', a:'18', opts:['18','24','16']}
];
const KMX_NAT6 = [
  {q:'რამდენი კენტი რიცხვია 46-დან 78-მდე?', a:'16', opts:['16','17','18']},
  {q:'რა ნაშთს გვაძლევს 2019 თავისი ციფრების ჯამზე გაყოფისას?', a:'3', opts:['3','9','1']},
  {q:'რამდენით მეტია 3-დან 102-ის ჩათვლით რიცხვების ჯამი 1-დან 100-ის ჩათვლით რიცხვების ჯამზე?', a:'200', opts:['200','201','1']},
  {q:'რამდენი ლუწი რიცხვია 23-დან 67-მდე?', a:'22', opts:['22','23','21']},
  {q:'რა ნაშთს გვაძლევს 2024 თავისი ციფრების ჯამზე გაყოფისას?', a:'0', opts:['0','2','4']},
  {q:'რამდენით მეტია 5-დან 104-ის ჩათვლით რიცხვების ჯამი 1-დან 100-ის ჩათვლით რიცხვების ჯამზე?', a:'400', opts:['400','404','4']},
  {q:'რამდენი სამნიშნა რიცხვი იყოფა 100-ზე ნაშთის გარეშე?', a:'9', opts:['9','10','8']},
  {q:'რა ნაშთს გვაძლევს 1000 7-ზე გაყოფისას?', a:'6', opts:['6','3','5']}
];
const KMX_CALC6 = [
  {q:'ვანომ თანაბარი სიჩქარით 4 სთ-ში 280 კმ გაიარა. უკან დასაბრუნებლად რა სიჩქარით უნდა იაროს, რომ 30 წუთით ადრე დაბრუნდეს?', a:'80 კმ/სთ', opts:['80 კმ/სთ','70 კმ/სთ','65 კმ/სთ']},
  {q:'სოფოს 4 სამაჯური აქვს, ლანას სოფოზე მეტი, თამარს კი ლანასა და სოფოს ჯამზე მეტი. სულ მცირე რამდენი სამაჯური შეიძლება ჰქონდეთ სამივეს ერთად?', a:'19', opts:['19','18','17']},
  {q:'კლასში 24 მოსწავლეა. გოგონები ბიჭებზე 8-ით ნაკლებია. მთელი კლასის რა ნაწილია ბიჭები?', a:'2/3', opts:['2/3','3/4','2/5']},
  {q:'მანქანამ 3 სთ-ში 240 კმ გაიარა თანაბარი სიჩქარით. უკან რა სიჩქარით უნდა იაროს, რომ 1 სთ-ით ადრე ჩავიდეს?', a:'120 კმ/სთ', opts:['120 კმ/სთ','100 კმ/სთ','80 კმ/სთ']},
  {q:'ნიკას 3 მანქანა აქვს, გიოს ნიკაზე მეტი, ლუკას კი ნიკასა და გიოს ჯამზე მეტი. სულ მცირე რამდენი მანქანა შეიძლება ჰქონდეთ სამივეს ერთად?', a:'15', opts:['15','14','16']},
  {q:'კალათში 30 ხილია. ვაშლი მსხალზე 6-ით მეტია. კალათის რა ნაწილია მსხალი?', a:'2/5', opts:['2/5','3/5','1/3']},
  {q:'მატარებელი 60 კმ/სთ სიჩქარით 5 სთ-ში გადის მანძილს. რამდენ ხანში გაივლის იმავე მანძილს 75 კმ/სთ სიჩქარით?', a:'4 სთ', opts:['4 სთ','3 სთ','4 სთ 30 წთ']},
  {q:'ორი მუშა ერთად 1 დღეში ღებავს 12 მ ღობეს. ერთნაირი ტემპით რამდენ მეტრს შეღებავს 5 ასეთი მუშა 1 დღეში?', a:'30 მ', opts:['30 მ','24 მ','36 მ']}
];
const KMX_OPT6 = [
  {q:'რიცხვებიდან 749, 827, 573, 341, 516, 459, 923 სულ მცირე რამდენი უნდა წავშალოთ, რომ დარჩენილ ნებისმიერ ორ რიცხვს ჰქონდეს ერთი საერთო ციფრი მაინც?', a:'2', opts:['2','3','5']},
  {q:'კვადრატს მაქსიმუმ რამდენი მასზე დიდი კვადრატი შეიძლება ესაზღვრებოდეს? (მხოლოდ საერთო წვეროს მქონე კვადრატები მოსაზღვრედ არ ითვლება)', a:'4', opts:['4','3','2']},
  {q:'5, 6, 7, 8, 9 ციფრებით (გამეორების გარეშე) შედგენილი უდიდესი და უმცირესი ხუთნიშნა რიცხვების სხვაობა რისი ტოლია?', a:'41976', opts:['41976','40976','42876']},
  {q:'ყუთში 5 წითელი, 7 ლურჯი და 9 მწვანე ბურთია. სულ მცირე რამდენი ბურთი ამოვიღოთ თვალდახუჭულმა, რომ ნამდვილად გვქონდეს ერთი ფერის 3 ბურთი მაინც?', a:'7', opts:['7','3','9']},
  {q:'ყუთში 10 წითელი და 8 შავი წინდაა. სიბნელეში სულ მცირე რამდენი წინდა ამოვიღოთ, რომ ნამდვილად გვქონდეს ერთი ფერის წყვილი მაინც?', a:'3', opts:['3','2','9']},
  {q:'სულ მცირე რამდენი მოსწავლე უნდა იყოს კლასში, რომ ნამდვილად ორი მათგანი ერთსა და იმავე თვეში იყოს დაბადებული?', a:'13', opts:['13','12','24']},
  {q:'1-დან 20-მდე რიცხვებიდან სულ მცირე რამდენი ავიღოთ, რომ ნამდვილად ორი მათგანის ჯამი იყოს 21?', a:'11', opts:['11','10','21']},
  {q:'რიცხვებიდან 12, 23, 34, 45, 56 სულ მცირე რამდენი უნდა წავშალოთ, რომ დარჩენილ ნებისმიერ ორს ჰქონდეს საერთო ციფრი მაინც?', a:'3', opts:['3','2','4']}
];
const KMX_BONUS6 = [
  {q:'მაისში სანდროს შემოსავალი 100 ლარით გაიზარდა, მაგრამ ყოველდღიური ხარჯიც გაეზარდა 2 ლარით. რამდენი ლარით გაიზრდება მაისში სანდროს დანაზოგი? (მაისი 31 დღეა)', a:'38', opts:['38','40','160']},
  {q:'უბნის მაღაზიაში შაქარი 2 ლარი ღირს, გარეუბანში 1 ლარი და 70 თეთრი. გარეუბანში მისვლა-მოსვლა 1 ლარი და 50 თეთრი ჯდება. სულ მცირე რამდენი კილოგრამი შაქრის ყიდვისას იღირება გარეუბანში წასვლა, რომ სულ მცირე 2 ლარი დავზოგოთ?', a:'12 კგ', opts:['12 კგ','15 კგ','18 კგ']},
  {q:'კვადრატული ფანჯრის მინაზე გია გამჭვირვალე ფირს აკრავს. რა იქნება ფირის ფართობი, თუ მინის გვერდის სიგრძე 20 სანტიმეტრია?', a:'400 კვ.სმ', opts:['400 კვ.სმ','40 კვ.სმ','ვერ დავადგენთ']},
  {q:'რა თანხა ექნება კოკას ანგარიშზე წლის ბოლოს, თუ ბანკი ყოველ შეტანილ ლარზე წელიწადში 9,25 თეთრს არიცხავს და კოკამ წლის დასაწყისში 100 ლარი შეიტანა?', a:'ვერ დავადგენთ', opts:['ვერ დავადგენთ','109,25 ლარი','100 ლარი და 9,25 თეთრი']},
  {q:'რამდენ კილოგრამს იწონის ნედლი ქათამი, თუ მისი წონა უდრის 1 კგ-ს დამატებული საკუთარი წონის ნახევარს?', a:'2 კგ', opts:['2 კგ','1 კგ და 500 გრამი','ვერ დავადგენთ']},
  {q:'რატი თვეში ხარჯავს 300 წუთს საუბარში, 300 SMS-ს და 1000 მბ ინტერნეტს. რომელი შეთავაზებაა მისთვის ყველაზე იაფი?', a:'„მარტივი 25" 25 ლარად', opts:['„მარტივი 25" 25 ლარად','პაკეტი 37,5 ლარად','ცალკე 190 ლარად']},
  {q:'ნინომ მაღაზიაში 50 ლარი დახარჯა, რაც მისი ფულის 2/5 იყო. რამდენი ლარი ჰქონდა თავიდან?', a:'125 ლარი', opts:['125 ლარი','100 ლარი','150 ლარი']},
  {q:'მაღაზია პროდუქტს 20%-იანი ფასდაკლებით ყიდის. ფასდაკლების შემდეგ ის 80 ლარი ღირს. რა იყო საწყისი ფასი?', a:'100 ლარი', opts:['100 ლარი','96 ლარი','120 ლარი']}
];
const BLUEPRINT_math6 = [
  {label:'➗ მარტივი არითმეტიკა', instr:'აირჩიე სწორი პასუხი', pts:20, n:2, pool:KMX_ARITH6, type:'mq'},
  {label:'🔢 ნატურალური რიცხვები', instr:'აირჩიე სწორი პასუხი', pts:20, n:3, pool:KMX_NAT6, type:'mq'},
  {label:'🧮 ამოცანები გამოთვლაზე', instr:'ამოხსენი ამოცანა და აირჩიე სწორი პასუხი', pts:30, n:3, pool:KMX_CALC6, type:'mq'},
  {label:'🎯 მაქსიმუმი და მინიმუმი', instr:'იპოვე მაქსიმუმი ან მინიმუმი', pts:30, n:2, pool:KMX_OPT6, type:'mq'},
  {label:'💰 ბონუსი — ფინანსები', instr:'ფინანსური წიგნიერების ბონუს კითხვა', pts:30, n:3, pool:KMX_BONUS6, type:'mq', bonus:true}
];
