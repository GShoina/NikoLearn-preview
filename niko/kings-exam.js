/* ═══════════════════════════════════════════════════════════
   NikoLearn — KINGS-format EXAM (sectioned). ORIGINAL NikoLearn content (CLAUDE.md §11): all questions
   are our own, authored in the Kings task FORMAT (section labels, sequence, question counts, point
   weights, which are not copyrightable), scored out of 100 (+ a 5-pt bonus that only helps if the main
   score isn't maxed). Loads AFTER games.js (reuses gameShell/winStep/shuffle/ri/state).
   VARIETY (owner 2026-06-24): ALPHABET + BONUS are GENERATED (effectively unlimited); the other sections
   draw n items from pools of ~18-22, so a second attempt rarely repeats. Option order is shuffled every time.
   Grades 4-6 (reading comprehension / definition→word / odd-one-out) are parked → docs/ROADMAP.md.
   ═══════════════════════════════════════════════════════════ */

function kxP1(a){ return a[ri(0,a.length-1)]; }

/* ── GENERATED tasks (no repetition) ── */
const KX_AZ='abcdefghijklmnopqrstuvwxyz'.split('');
// ALPHABET — show a lowercase letter, pick the matching CAPITAL (A/B/C).
function kxGenCap(){
  const low=kxP1(KX_AZ), cap=low.toUpperCase();
  const others=shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c=>c!==cap)).slice(0,2);
  return {l:low, a:cap, opts:[cap].concat(others)};
}
// BONUS — count how many times the word NIKO appears (NikoLearn original task), generated.
const KX_SCR=['NKIO','INKO','NIOK','KNIO','ONIK','IKNO','NOIK'];
function kxGenBonus(){
  const n=ri(2,4), m=ri(2,3), toks=[];
  for(let i=0;i<n;i++)toks.push('NIKO');
  for(let i=0;i<m;i++)toks.push(kxP1(KX_SCR));
  const seq=shuffle(toks).join('  ');
  const set=[String(n),String(n+1),String(Math.max(1,n-1))].filter((v,i,a)=>a.indexOf(v)===i);
  while(set.length<3){ const c=String(ri(1,6)); if(set.indexOf(c)<0)set.push(c); }
  return {seq, a:String(n), opts:set.slice(0,3)};
}

/* ── POOL tasks (drawn n-of-pool each attempt; pools sized for low repetition) ── */
// VOCABULARY (picture) grade 2 — emoji + "It is a ___." → pick the word. ORIGINAL NikoLearn content.
const KEX_PIC2=[
  {e:'🐘',a:'elephant',opts:['elephant','umbrella','envelope']},{e:'🍇',a:'grapes',opts:['grapes','glass','grass']},
  {e:'🚌',a:'bus',opts:['bus','box','bag']},{e:'🥕',a:'carrot',opts:['carrot','candle','curtain']},
  {e:'🦆',a:'duck',opts:['duck','deer','dove']},{e:'🐻',a:'bear',opts:['bear','bird','bee']},
  {e:'🎈',a:'balloon',opts:['balloon','button','basket']},{e:'🌙',a:'moon',opts:['moon','map','mug']},
  {e:'🍞',a:'bread',opts:['bread','brush','brick']},{e:'🐍',a:'snake',opts:['snake','swan','spoon']},
  {e:'🦋',a:'butterfly',opts:['butterfly','bottle','bicycle']},{e:'⚽',a:'ball',opts:['ball','bell','bowl']},
  {e:'🐑',a:'sheep',opts:['sheep','snail','swan']},{e:'🍋',a:'lemon',opts:['lemon','ladder','lizard']},
  {e:'🪑',a:'chair',opts:['chair','cherry','cheese']},{e:'🐧',a:'penguin',opts:['penguin','pencil','pigeon']},
  {e:'🌈',a:'rainbow',opts:['rainbow','ribbon','rabbit']},{e:'🦊',a:'fox',opts:['fox','fan','frog']},
  {e:'🧦',a:'sock',opts:['sock','soap','spoon']},{e:'🕷️',a:'spider',opts:['spider','sister','sandwich']}
];
// VOCABULARY (picture) grade 3 — jobs, "Who am I? I am a ___." ORIGINAL NikoLearn content.
const KEX_PIC3=[
  {e:'👨‍⚖️',a:'judge',opts:['judge','guard','waiter']},{e:'🧑‍🔬',a:'scientist',opts:['scientist','soldier','sailor']},
  {e:'🕵️',a:'detective',opts:['detective','dentist','driver']},{e:'🧙',a:'wizard',opts:['wizard','warrior','waiter']},
  {e:'👨‍🔧',a:'mechanic',opts:['mechanic','musician','magician']},{e:'🧑‍💻',a:'programmer',opts:['programmer','plumber','painter']},
  {e:'🪖',a:'soldier',opts:['soldier','sailor','singer']},{e:'⚓',a:'sailor',opts:['sailor','soldier','tailor']},
  {e:'🦷',a:'dentist',opts:['dentist','doctor','driver']},{e:'🚕',a:'driver',opts:['driver','diver','dancer']},
  {e:'🤹',a:'juggler',opts:['juggler','jeweller','janitor']},{e:'💈',a:'barber',opts:['barber','builder','butcher']}
];
// TRANSLATION grade 2 (single words) — Georgian → pick the English. ORIGINAL NikoLearn content.
const KEX_TR2=[
  {ka:'ვაჟი',a:'a boy',opts:['a boy','a tree','a key']},{ka:'ფანქარი',a:'a pencil',opts:['a pencil','a window','a spoon']},
  {ka:'ფანჯარა',a:'a window',opts:['a window','a garden','a chair']},{ka:'სკამი',a:'a chair',opts:['a chair','a shoe','a cloud']},
  {ka:'პური',a:'bread',opts:['bread','cheese','rice']},{ka:'ხელი',a:'a hand',opts:['a hand','a star','a boat']},
  {ka:'თვალი',a:'an eye',opts:['an eye','an owl','an egg']},{ka:'ფეხი',a:'a foot',opts:['a foot','a fork','a fish']},
  {ka:'ცხენი',a:'a horse',opts:['a horse','a hat','a hen']},{ka:'ქუდი',a:'a hat',opts:['a hat','a cup','a cat']},
  {ka:'ბურთი',a:'a ball',opts:['a ball','a bell','a doll']},{ka:'ვარდი',a:'a rose',opts:['a rose','a leaf','a lake']},
  {ka:'რვეული',a:'a notebook',opts:['a notebook','a teacher','a garden']},{ka:'მთვარე',a:'the moon',opts:['the moon','the rain','the road']},
  {ka:'კარი',a:'a door',opts:['a door','a duck','a desk']},{ka:'ხე',a:'a tree',opts:['a tree','a road','a lamp']},
  {ka:'ლომი',a:'a lion',opts:['a lion','a lemon','a leg']},{ka:'ყველი',a:'cheese',opts:['cheese','butter','sugar']}
];
// TRANSLATION grade 3 (phrases). ORIGINAL NikoLearn content.
const KEX_TR3=[
  {ka:'წითელი ვაშლი',a:'a red apple',opts:['a red apple','a ripe apple','a red onion']},{ka:'ცივი ამინდი',a:'cold weather',opts:['cold weather','warm weather','wet weather']},
  {ka:'პატარა თაგვი',a:'a little mouse',opts:['a little mouse','a little mouth','a little house']},{ka:'ძველი წიგნი',a:'an old book',opts:['an old book','a new book','an old box']},
  {ka:'თბილი ქურთუკი',a:'a warm coat',opts:['a warm coat','a warm cake','a cold coat']},{ka:'სწრაფი მატარებელი',a:'a fast train',opts:['a fast train','a slow train','a fast tram']},
  {ka:'მაღალი ხე',a:'a tall tree',opts:['a tall tree','a small tree','a tall wall']},{ka:'ლამაზი ბაღი',a:'a pretty garden',opts:['a pretty garden','a pretty curtain','an ugly garden']},
  {ka:'ბედნიერი ბავშვი',a:'a happy child',opts:['a happy child','a happy chair','a sad child']},{ka:'მრგვალი მაგიდა',a:'a round table',opts:['a round table','a square table','a round candle']},
  {ka:'ნაცრისფერი კატა',a:'a grey cat',opts:['a grey cat','a green cat','a grey hat']},{ka:'გრძელი მდინარე',a:'a long river',opts:['a long river','a short river','a long ruler']},
  {ka:'რბილი ბალიში',a:'a soft pillow',opts:['a soft pillow','a hard pillow','a soft pillar']},{ka:'ჭკვიანი მასწავლებელი',a:'a clever teacher',opts:['a clever teacher','a lazy teacher','a clever doctor']},
  {ka:'სველი ქოლგა',a:'a wet umbrella',opts:['a wet umbrella','a dry umbrella','a wet uncle']},{ka:'ღია ფანჯარა',a:'an open window',opts:['an open window','a closed window','an open garden']}
];
// SPELLING grade 2 — add one letter (A/B/C). `_` marks the gap. ORIGINAL NikoLearn content.
const KEX_SP2=[
  {w:'su_',a:'n',opts:['n','f','j']},{w:'pe_',a:'n',opts:['n','v','z']},{w:'cu_',a:'p',opts:['p','q','x']},
  {w:'be_',a:'d',opts:['d','f','j']},{w:'le_',a:'g',opts:['g','v','z']},{w:'bo_',a:'x',opts:['x','f','j']},
  {w:'ha_',a:'t',opts:['t','f','j']},{w:'ja_',a:'m',opts:['m','v','z']},{w:'fi_e',a:'r',opts:['r','m','z']},
  {w:'ro_e',a:'s',opts:['s','f','j']},{w:'na_l',a:'i',opts:['i','u','e']},{w:'mo_n',a:'o',opts:['o','i','y']},
  {w:'ra_n',a:'i',opts:['i','o','y']},{w:'sh_e',a:'o',opts:['o','a','u']},{w:'go_t',a:'a',opts:['a','i','e']},
  {w:'be_r',a:'a',opts:['a','i','o']},{w:'fl_g',a:'a',opts:['a','i','u']},{w:'sn_ke',a:'a',opts:['a','i','u']}
];
// SPELLING grade 3 (longer words). ORIGINAL NikoLearn content.
const KEX_SP3=[
  {w:'eleph_nt',a:'a',opts:['a','o','u']},{w:'umbrel_a',a:'l',opts:['l','r','n']},{w:'butter_ly',a:'f',opts:['f','v','p']},
  {w:'kit_hen',a:'c',opts:['c','s','z']},{w:'bro_her',a:'t',opts:['t','d','p']},{w:'morn_ng',a:'i',opts:['i','e','a']},
  {w:'pota_o',a:'t',opts:['t','d','k']},{w:'pen_uin',a:'g',opts:['g','q','k']},{w:'gra_es',a:'p',opts:['p','b','f']},
  {w:'sci_sors',a:'s',opts:['s','c','z']},{w:'choco_ate',a:'l',opts:['l','r','n']},{w:'tea_her',a:'c',opts:['c','s','k']},
  {w:'mou_tain',a:'n',opts:['n','m','r']},{w:'bicy_le',a:'c',opts:['c','s','k']},{w:'sandwi_h',a:'c',opts:['c','s','t']},
  {w:'birth_ay',a:'d',opts:['d','b','t']}
];
// GRAMMAR grade 3 — fill the blank (A/B/C). `___` marks the gap. ORIGINAL NikoLearn content.
const KEX_GR3=[
  {q:'She ___ a doctor.',a:'is',opts:['is','are','am']},{q:'They ___ in the garden.',a:'are',opts:['are','is','am']},
  {q:'I ___ a new bike.',a:'have',opts:['have','has','having']},{q:'My brother ___ tall.',a:'is',opts:['is','are','be']},
  {q:'The cat sits ___ the chair.',a:'on',opts:['on','of','to']},{q:'We ___ to school every day.',a:'go',opts:['go','goes','going']},
  {q:'He ___ his bag at home.',a:'has',opts:['has','have','haves']},{q:'I see ___ owl in the tree.',a:'an',opts:['an','a','and']},
  {q:'___ children are happy.',a:'These',opts:['These','This','That']},{q:'My friend ___ football well.',a:'plays',opts:['plays','play','playing']},
  {q:'The birds ___ in the tree.',a:'sing',opts:['sing','sings','singing']},{q:'I am ___ an apple now.',a:'eating',opts:['eating','eat','eats']},
  {q:'This pencil is ___ the box.',a:'in',opts:['in','at','of']},{q:'Anna ___ a red dress.',a:'wears',opts:['wears','wear','wearing']},
  {q:'We are ___ friends.',a:'good',opts:['good','goods','well']},{q:'___ she like milk?',a:'Does',opts:['Does','Do','Is']},
  {q:'A dog has four ___.',a:'legs',opts:['legs','leg','leges']},{q:'I ___ not like cold tea.',a:'do',opts:['do','does','am']},
  {q:'She has two ___.',a:'boxes',opts:['boxes','box','boxs']},{q:'The sun ___ in the morning.',a:'rises',opts:['rises','rise','rising']},
  {q:'He can ___ very high.',a:'jump',opts:['jump','jumps','jumping']},{q:'___ is my book.',a:'This',opts:['This','These','Those']}
];

/* ── MATH pools — ORIGINAL NikoLearn content (public-domain archetypes, own numbers/scenarios). A/B/C, Georgian stems. ── */
// grade 2
const KMX_PAT2=[
  {q:'4, 8, 12, 16, ?',a:'20',opts:['18','20','24']},{q:'11, 13, 15, 17, ?',a:'19',opts:['18','19','21']},
  {q:'20, 18, 16, 14, ?',a:'12',opts:['12','10','13']},{q:'5, 10, 15, 20, 25, ?',a:'30',opts:['28','30','35']},
  {q:'10, 20, 30, 40, ?',a:'50',opts:['45','50','60']},{q:'2, 6, 10, 14, ?',a:'18',opts:['16','18','20']},
  {q:'🔴 🔵 🔴 🔵 🔴 ?',a:'🔵',opts:['🔴','🔵','🟢']}
];
const KMX_LOG2=[
  {q:'რომელია კენტი რიცხვი?',a:'7',opts:['6','7','8']},
  {q:'ნიკოს 4 ფანქარი აქვს, ანას 1-ით ნაკლები. რამდენი აქვს ანას?',a:'3',opts:['3','5','2']},
  {q:'წელიწადში რამდენი თვეა?',a:'12',opts:['10','12','7']},
  {q:'თუ დღეს ხუთშაბათია, ხვალ რა დღე იქნება?',a:'პარასკევი',opts:['ოთხშაბათი','პარასკევი','შაბათი']},
  {q:'სამ ბავშვს თითო ბურთი აქვს. სულ რამდენი ბურთია?',a:'3',opts:['3','6','1']},
  {q:'ყუთში 5 წითელი და 2 მწვანე ვაშლია. რომელია მეტი?',a:'წითელი',opts:['წითელი','მწვანე','თანაბრად']}
];
const KMX_CAL2=[
  {q:'დათოს 7 ბურთი აქვს, 3 აჩუქა. რამდენი დარჩა?',a:'4',opts:['4','10','3']},
  {q:'ანას 5 კანფეტი ჰქონდა, დედამ 6 დაამატა. სულ რამდენი?',a:'11',opts:['11','1','12']},
  {q:'8 + 6 = ?',a:'14',opts:['14','13','15']},
  {q:'გიორგის 15 თეთრი ჰქონდა, 8 დახარჯა. რამდენი დარჩა?',a:'7',opts:['7','23','6']},
  {q:'პარკში 6 ჩიტი იჯდა, 4 მოფრინდა. სულ რამდენი?',a:'10',opts:['10','2','9']},
  {q:'ნინოს 12 ყვავილი აქვს, 5 თეთრია, დანარჩენი წითელი. რამდენი წითელია?',a:'7',opts:['7','17','6']}
];
const KMX_REB2=[
  {q:'◆ + 3 = 8. რას უდრის ◆?',a:'5',opts:['5','11','4']},
  {q:'★ = 4. რას უდრის ★ + ★?',a:'8',opts:['8','6','4']},
  {q:'● = 6, ○ = 2. რას უდრის ● − ○?',a:'4',opts:['4','8','3']},
  {q:'▲ = 3. რას უდრის ▲ + ▲ + ▲?',a:'9',opts:['6','9','12']},
  {q:'■ + 5 = 9. რას უდრის ■?',a:'4',opts:['4','14','5']},
  {q:'♥ = 7, ♦ = 1. რას უდრის ♥ + ♦?',a:'8',opts:['8','6','9']}
];
const KMX_BON2=[
  {q:'ნიკოს 7₾ აქვს, დედამ 5₾ მისცა. სულ რამდენი ₾?',a:'12',opts:['12','2','13']},
  {q:'ფანქარი 3₾ ღირს. ანას 2₾ აქვს. კიდევ რამდენი ₾ სჭირდება?',a:'1',opts:['1','5','2']},
  {q:'1₾ = 100 თეთრი. რამდენი თეთრია ნახევარი ლარი?',a:'50',opts:['50','10','100']},
  {q:'ლუკამ 10₾-დან 6₾ დახარჯა. რამდენი ₾ დარჩა?',a:'4',opts:['4','16','5']},
  {q:'ბურთი 5₾, თოჯინა 4₾. სულ რამდენი ₾ ღირს ორივე?',a:'9',opts:['9','1','8']}
];
// grade 3
const KMX_PAT3=[
  {q:'2, 6, 18, ?',a:'54',opts:['36','54','24']},{q:'2, 5, 9, 14, ?',a:'20',opts:['18','20','19']},
  {q:'5, 10, 20, 40, ?',a:'80',opts:['60','80','50']},{q:'7, 14, 21, 28, ?',a:'35',opts:['33','35','42']},
  {q:'90, 81, 72, 63, ?',a:'54',opts:['54','55','52']},{q:'1, 1, 2, 3, 5, 8, ?',a:'13',opts:['11','13','12']}
];
const KMX_CAL3=[
  {q:'6 × 4 = ?',a:'24',opts:['24','20','28']},
  {q:'36 ÷ 4 = ?',a:'9',opts:['9','8','6']},
  {q:'54 + 29 = ?',a:'83',opts:['83','73','85']},
  {q:'72 − 38 = ?',a:'34',opts:['34','46','44']},
  {q:'5 ყუთში თითო 8 ვაშლი. სულ რამდენი ვაშლი?',a:'40',opts:['40','13','35']},
  {q:'24 კანფეტი 3 ბავშვს თანაბრად გაუნაწილდა. თითო რამდენს მიიღებს?',a:'8',opts:['8','6','9']}
];
const KMX_LOG3=[
  {q:'ნიკო ანაზე 3 წლით უფროსია. ანა 8 წლისაა. რამდენი წლის იქნება ნიკო 2 წელში?',a:'13',opts:['13','11','10']},
  {q:'რომელი რიცხვი იყოფა 5-ზე ნაშთის გარეშე?',a:'25',opts:['25','22','18']},
  {q:'ყუთში 4 წითელი და 6 ლურჯი ბურთი. თვალდახუჭული სულ მცირე რამდენი უნდა ამოვიღოთ, რომ აუცილებლად გვქონდეს 1 წითელი?',a:'7',opts:['5','7','4']},
  {q:'3 მეგობარს 18 წიგნი თანაბრად გაუნაწილდა. თითო რამდენს მიიღებს?',a:'6',opts:['6','9','5']},
  {q:'რიცხვები 1-დან 10-მდე. რამდენი ლუწი რიცხვია?',a:'5',opts:['5','4','6']},
  {q:'ხუთ კალათში თითო 2 ვაშლი. 3 ვაშლი შევჭამეთ. რამდენი დარჩა?',a:'7',opts:['7','10','8']}
];
const KMX_REB3=[
  {q:'◆ × 3 = 12. რას უდრის ◆?',a:'4',opts:['4','9','6']},
  {q:'★ + ★ + ★ = 21. რას უდრის ★?',a:'7',opts:['7','18','3']},
  {q:'● = 8, ○ = 3. რას უდრის ● + ○ + ○?',a:'14',opts:['14','11','19']},
  {q:'▲ × 2 + 4 = 14. რას უდრის ▲?',a:'5',opts:['5','9','7']},
  {q:'⊙ + ⊙ = 16. რას უდრის ⊙?',a:'8',opts:['8','16','4']},
  {q:'♥ = 6, ♣ = 2. რას უდრის ♥ × ♣?',a:'12',opts:['12','8','10']}
];
const KMX_BON3=[
  {q:'წიგნი 25₾ ღირდა, ფასდაკლება 8₾. ახლა რამდენი ₾ ღირს?',a:'17',opts:['17','33','15']},
  {q:'ნიკომ 15₾ დააგროვა, ველოსიპედი 60₾ ღირს. კიდევ რამდენი ₾ სჭირდება?',a:'45',opts:['45','75','40']},
  {q:'3 ფანქარი თითო 4₾. სულ რამდენი ₾ ღირს?',a:'12',opts:['12','7','15']},
  {q:'ანას 50₾ ჰქონდა, წიგნში 22₾ გადაიხადა. რამდენი ₾ დარჩა?',a:'28',opts:['28','72','32']},
  {q:'მაისური 30₾ იყო, ფასდაკლების შემდეგ 24₾. რამდენი ₾ დაიზოგა?',a:'6',opts:['6','54','4']}
];

/* ── exam blueprint: section sequence + point weights, faithful to the real PDFs ── */
const KINGS_EXAM={
  eng:{
    2:[
      {label:'🔠 ALPHABET',  instr:'იპოვე პატარა ასოს დიდი ვარიანტი (A, B ან C)', pts:10, n:5, gen:kxGenCap, type:'cap'},
      {label:'🖼️ VOCABULARY',instr:'აირჩიე სწორი პასუხი სურათის მიხედვით', pts:30, n:8, pool:KEX_PIC2, type:'pic', stem:'It is a ___.'},
      {label:'🔁 TRANSLATION',instr:'რომელია სწორი ინგლისური თარგმანი?', pts:30, n:8, pool:KEX_TR2, type:'tr'},
      {label:'✍️ SPELLING',  instr:'დაამატე ასო (A, B ან C) და ააწყვე სიტყვა', pts:30, n:8, pool:KEX_SP2, type:'sp'},
      {label:'🎁 BONUS',     instr:'რამდენჯერ მეორდება სიტყვა NIKO?', pts:5, n:1, gen:kxGenBonus, type:'bonus', bonus:true}
    ],
    3:[
      {label:'🖼️ VOCABULARY',instr:'აირჩიე სწორი პასუხი სურათის მიხედვით', pts:20, n:5, pool:KEX_PIC3, type:'pic', stem:'Who am I? I am a ___.'},
      {label:'✍️ SPELLING',  instr:'დაამატე ასო და ააწყვე სიტყვა', pts:30, n:8, pool:KEX_SP3, type:'sp'},
      {label:'🔁 TRANSLATION',instr:'რომელია სწორი ინგლისური თარგმანი?', pts:30, n:8, pool:KEX_TR3, type:'tr'},
      {label:'📝 GRAMMAR',    instr:'აირჩიე სწორი ვარიანტი', pts:20, n:8, pool:KEX_GR3, type:'gr'},
      {label:'🎁 BONUS',     instr:'რამდენჯერ მეორდება სიტყვა NIKO?', pts:5, n:1, gen:kxGenBonus, type:'bonus', bonus:true}
    ],
    4:BLUEPRINT_eng4, 5:BLUEPRINT_eng5, 6:BLUEPRINT_eng6
  },
  math:{
    2:[
      {label:'🧩 კანონზომიერება', instr:'გამოიცანი გამოტოვებული', pts:20, n:3, pool:KMX_PAT2, type:'mq'},
      {label:'🧠 ლოგიკა',        instr:'დაფიქრდი და აირჩიე სწორი პასუხი', pts:20, n:3, pool:KMX_LOG2, type:'mq'},
      {label:'🧮 გამოთვლა',       instr:'ამოხსენი ამოცანა', pts:30, n:3, pool:KMX_CAL2, type:'mq'},
      {label:'🔢 რებუსი',         instr:'სიმბოლო = რიცხვი. გამოიცანი', pts:30, n:3, pool:KMX_REB2, type:'mq'},
      {label:'🎁 ბონუსი',         instr:'ფულის ამოცანა', pts:30, n:3, pool:KMX_BON2, type:'mq', bonus:true}
    ],
    3:[
      {label:'🧩 კანონზომიერება', instr:'გამოიცანი გამოტოვებული', pts:20, n:3, pool:KMX_PAT3, type:'mq'},
      {label:'🧮 გამოთვლა',       instr:'ამოხსენი ამოცანა', pts:20, n:3, pool:KMX_CAL3, type:'mq'},
      {label:'🧠 ლოგიკა',        instr:'დაფიქრდი და აირჩიე სწორი პასუხი', pts:30, n:3, pool:KMX_LOG3, type:'mq'},
      {label:'🔢 რებუსი',         instr:'სიმბოლო = რიცხვი. გამოიცანი', pts:30, n:3, pool:KMX_REB3, type:'mq'},
      {label:'🎁 ბონუსი',         instr:'ფულის ამოცანა', pts:30, n:3, pool:KMX_BON3, type:'mq', bonus:true}
    ],
    4:BLUEPRINT_math4, 5:BLUEPRINT_math5, 6:BLUEPRINT_math6
  }
};

let kx=null;
// Unified 3-level model → exam content grade: დამწყები→2, საშუალო→4, მაღალი→6.
function levelToGrade(){ const l=(typeof kingsLevel==='function')?kingsLevel():1; return l>=3?6:(l>=2?4:2); }
// No separate grade chooser: the exam runs at the child's currently selected LEVEL (set via the level bar),
// exactly like the practice modes. kxPick stays as the entry the exam tiles + the "retry" button call.
function kxPick(subject){ startKingsExam(subject, levelToGrade()); }
function startKingsExam(subject, grade){
  const secs=(KINGS_EXAM[subject]||{})[grade];
  if(!secs){ if(typeof startKings==='function')return startKings(subject); return; }  // fallback to the old test
  const qs=[];
  secs.forEach(sec=>{
    let items;
    if(sec.gen){ items=[]; const seen={}; let g=0;
      while(items.length<sec.n && g++<sec.n*10){ const it=sec.gen(); const k=(it.l||it.w||it.q||it.ka||it.seq||'')+'|'+it.a;
        if(!seen[k]){ seen[k]=1; items.push(it); } } }
    else { items=shuffle(sec.pool.slice()).slice(0, sec.n); }
    const per=sec.pts/sec.n;
    items.forEach(it=>qs.push({sec,it,per}));
  });
  kx={subject,grade,qs,i:0,score:0,bonusScore:0};
  game.mode='kings-'+subject; game.kind=subject; game.subj='kings-'+subject;
  game.shields=0; game.wrong=0; game.start=Date.now(); game.preLvl=levelIdx(profile);
  try{ if(window.Analytics)Analytics.event('kings_exam_start',{grade:String(grade)}); }catch(e){}
  kxNext();
}
function kxNext(){
  if(!kx)return; if(kx.i>=kx.qs.length)return kxFinish();
  const {sec,it}=kx.qs[kx.i]; let stem='', opts=it.opts, correct=it.a, speakEn=false;
  if(sec.type==='cap'){ stem=`<div class="kx-big">${it.l}</div>`; }
  else if(sec.type==='pic'){ stem=`<div class="p-emoji" style="font-size:3.2rem">${it.e}</div><div class="p-word en" style="font-size:1.12rem">${sec.stem}</div>`; speakEn=true; }
  else if(sec.type==='tr'){ stem=`<div class="p-word" style="font-size:1.5rem">${it.ka}</div>`; speakEn=true; }
  else if(sec.type==='sp'){ stem=`<div class="p-word en kx-word">${it.w.replace('_','<u>＿</u>')}</div>`; }
  else if(sec.type==='gr'){ stem=`<div class="p-word en" style="font-size:1.28rem">${it.q.replace('___','<u>＿＿</u>')}</div>`; speakEn=true; }
  else if(sec.type==='bonus'){ stem=`<div class="kx-seq en">${it.seq}</div>`; }
  else if(sec.type==='mq'){ stem=`<div class="kx-mq">${it.q}</div>`; }  // math question (Georgian stem, A/B/C, no voice)
  const oo=shuffle(opts.slice());
  const optCls=(sec.type==='tr'||sec.type==='pic')?'en':(sec.type==='gr'||sec.type==='sp'||sec.type==='cap'||sec.type==='bonus'?'en kx-opt':'');
  // C-1 fix: escape for BOTH the JS string literal AND the surrounding double-quoted onclick="" attribute.
  // A literal double-quote in an option/answer string used to close the onclick="" attribute early and
  // break every button -> tapping any answer threw and dumped the child to the error screen.
  const ja=s=>String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  const ht=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const body=`<div class="prompt">
      <div class="section-label">${sec.label} <span class="kx-pts">${sec.pts} ქ.</span></div>
      ${stem}
      <div class="p-sub" style="margin-top:8px">${sec.instr}</div></div>
    <div class="opt-list">${oo.map(o=>{const e=ja(o);return `<button class="opt ${optCls}" onclick="${speakEn?`speak('${e}');`:''}kxAnswer(this,'${e}','${ja(correct)}')">${ht(o)}</button>`;}).join('')}</div>`;
  gameShell(body);
  $('#gcount').textContent=`${kx.i+1}/${kx.qs.length}`;
}
function kxAnswer(btn,sel,cor){
  if(!kx)return; const {sec,per}=kx.qs[kx.i];
  if(String(sel)===String(cor)){
    document.querySelectorAll('.opt').forEach(b=>{b.classList.add('dim'); b.style.pointerEvents='none';}); btn.classList.remove('dim'); btn.classList.add('correct'); // CM-3: lock input during the win celebration so extra taps can't re-enter and stall the exam
    if(sec.bonus)kx.bonusScore+=per; else kx.score+=per;
    const s=state[profile]; s.shields++; game.shields++; s.streak++; s.maxStreak=Math.max(s.maxStreak,s.streak); save();
    winStep(null,null,()=>{kx.i++;kxNext();});
  } else {
    btn.classList.add('wrong','dim'); document.querySelectorAll('.opt').forEach(b=>{b.style.pointerEvents='none'; if(String(b.textContent).trim()===String(cor))b.classList.add('correct');});
    state[profile].streak=0; save();
    setTimeout(()=>{kx.i++;kxNext();}, 950); // exam: mark, show the right one briefly, move on (no re-queue)
  }
}
function kxFinish(){
  const main=Math.min(100,Math.round(kx.score)), bonus=Math.round(kx.bonusScore);
  const total=Math.min(100, main+(main<100?bonus:0));   // bonus tops up toward 100, never beyond (real rule)
  try{ if(window.Analytics)Analytics.event('kings_exam_done',{grade:String(kx.grade)}); }catch(e){}
  const msg=total>=90?'შესანიშნავია! 🏆':total>=70?'ძალიან კარგი! 🌟':total>=50?'კარგი დასაწყისი. კიდევ ვივარჯიშოთ 💪':'ნუ ღელავ, ერთად გავიმეოროთ 🦉';
  const g=kx.grade, subj=kx.subject;
  render(`<div class="screen kx-result"><div class="kx-card">
    <div class="kx-trophy">👑</div>
    <div class="kx-title">კინგსის ტესტი · მე-${g} კლასი</div>
    <div class="kx-score">${total}<span>/100</span></div>
    ${(bonus&&main<100)?`<div class="kx-bonus">+${bonus} ბონუსი ჩაგერთო 🎁</div>`:''}
    <div class="kx-msg">${msg}</div>
    <button class="btn btn-primary btn-block" onclick="kxPick('${subj}')">🔁 თავიდან ცადე</button>
    <button class="btn btn-ghost btn-block mt" onclick="openMenu('kings-${subj}')">უკან</button>
  </div></div>`, false);
  // v1.232: bring the exam finish to parity with a normal round's celebration — a confetti burst on a
  // strong score (coins stay OFF by design: a /100 exam is graded, not a coin round). Self-removes.
  if(total>=70){ try{ if(typeof confettiEl==='function'){ const c=confettiEl(); (document.querySelector('.device')||document.body).appendChild(c); setTimeout(()=>{try{c.remove();}catch(e){}},2200); } }catch(e){} }
  kx=null;
}

/* ── standalone PRACTICE modes ported from the Kings pools into the REGULAR English subject (owner 2026-06-24).
   Verified gap: regular English had NO grammar and no single-letter spelling (only full-word „spell"); regular
   math already had word-problems/patterns/logic, so nothing was ported there. Repeatable practice (re-queues
   misses, awards coins, ends on the standard results screen) — NOT an exam. ── */
function kxPracticeRound(mode){
  let pool, render;
  if(mode==='engram'){
    pool=KEX_GR3;
    render=it=>`<div class="section-label">📝 გრამატიკა</div><div class="p-word en" style="font-size:1.3rem">${it.q.replace('___','<u>＿＿</u>')}</div><div class="p-sub" style="margin-top:8px">აირჩიე სწორი ვარიანტი</div>`;
  } else { // addlet — single-letter spelling (phonics), level-appropriate pool
    const lv=(typeof kingsLevel==='function')?kingsLevel():1; pool=(lv>=2?KEX_SP3:KEX_SP2);
    render=it=>`<div class="section-label">🔡 ასოს დამატება</div><div class="p-word en kx-word">${it.w.replace('_','<u>＿</u>')}</div><div class="p-sub" style="margin-top:8px">დაამატე ასო და ააწყვე სიტყვა</div>`;
  }
  game.mode=mode; game.kind=mode; game.subj=game.subj||'english'; game.shields=0; game.wrong=0; game.i=0;
  game.missMap=new Map(); game.requeues=0; game.start=Date.now(); game.preLvl=levelIdx(profile);
  game.qs=shuffle(pool.slice()).slice(0,8); game._prRender=render;
  kxprNext();
}
function kxprNext(){
  if(game.i>=game.qs.length)return results();
  const it=game.qs[game.i], cor=it.a, oo=shuffle(it.opts.slice());
  const body=`<div class="prompt">${game._prRender(it)}</div>
    <div class="opt-list">${oo.map(o=>{const e=String(o).replace(/'/g,"\\'");return `<button class="opt en kx-opt" onclick="speak('${e}');kxprAnswer(this,'${e}','${String(cor).replace(/'/g,"\\'")}')">${o}</button>`;}).join('')}</div>`;
  gameShell(body); $('#gcount').textContent=`${game.i+1}/${game.qs.length}`;
}
function kxprAnswer(btn,sel,cor){
  const s=state[profile];
  if(String(sel)===String(cor)){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim')); btn.classList.remove('dim'); btn.classList.add('correct');
    s.shields++; game.shields++; s.streak++; s.maxStreak=Math.max(s.maxStreak,s.streak); save();
    winStep(null,null,()=>{game.i++;kxprNext();});
  } else {
    btn.classList.add('wrong','dim'); s.streak=0; game.wrong++; save();
    if(typeof reQueueWrong==='function')reQueueWrong(cor,'en-US');
    else { document.querySelectorAll('.opt').forEach(b=>{b.style.pointerEvents='none'; if(String(b.textContent).trim()===String(cor))b.classList.add('correct');}); setTimeout(()=>{game.i++;kxprNext();},900); }
  }
}
