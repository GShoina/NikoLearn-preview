/* ═══════════════════════════════════════════════════════════
   NikoLearn — KINGS faithful EXAM (sectioned, mirrors the real kings.ge sample tests)
   Built from the REAL grade-2 & grade-3 English sample PDFs (kings.ge, fetched 2026-06-24). Each grade
   runs the real task SEQUENCE with the real section labels, instructions, question counts and POINT
   weights, and scores out of 100 (+ a 5-pt bonus that only helps if the main score isn't maxed — the
   real Kings rule). Loads AFTER games.js (reuses gameShell/winStep/shuffle/ri/state).
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
// BONUS — count how many times the word LIBERTY appears (the real Liberty-Bank task), generated.
const KX_SCR=['LIBETRY','LIBRTEY','LBIERTY','LIBRETY','LIBTREY','LIEBRTY','ILBERTY'];
function kxGenBonus(){
  const n=ri(2,4), m=ri(2,3), toks=[];
  for(let i=0;i<n;i++)toks.push('LIBERTY');
  for(let i=0;i<m;i++)toks.push(kxP1(KX_SCR));
  const seq=shuffle(toks).join('  ');
  const set=[String(n),String(n+1),String(Math.max(1,n-1))].filter((v,i,a)=>a.indexOf(v)===i);
  while(set.length<3){ const c=String(ri(1,6)); if(set.indexOf(c)<0)set.push(c); }
  return {seq, a:String(n), opts:set.slice(0,3)};
}

/* ── POOL tasks (drawn n-of-pool each attempt; pools sized for low repetition) ── */
// VOCABULARY (picture) grade 2 — emoji + "It is a ___." → pick the word.
const KEX_PIC2=[
  {e:'🐮',a:'cow',opts:['cow','cat','horse']},{e:'🐭',a:'mouse',opts:['mouse','pig','chicken']},
  {e:'🐱',a:'cat',opts:['cat','mouse','car']},{e:'🌳',a:'tree',opts:['tree','plane','book']},
  {e:'🐦',a:'bird',opts:['frog','bird','dog']},{e:'🍌',a:'banana',opts:['orange','banana','ball']},
  {e:'🐶',a:'dog',opts:['dog','frog','cat']},{e:'🐷',a:'pig',opts:['pig','cow','hen']},
  {e:'⭐',a:'star',opts:['star','car','sun']},{e:'🚗',a:'car',opts:['car','cat','cup']},
  {e:'🍎',a:'apple',opts:['apple','egg','ball']},{e:'🐰',a:'rabbit',opts:['rabbit','mouse','cat']},
  {e:'🦁',a:'lion',opts:['lion','bear','dog']},{e:'🐟',a:'fish',opts:['fish','bird','frog']},
  {e:'🏠',a:'house',opts:['house','box','tree']},{e:'☀️',a:'sun',opts:['sun','star','moon']},
  {e:'🌸',a:'flower',opts:['flower','tree','grass']},{e:'🐝',a:'bee',opts:['bee','fly','bird']},
  {e:'🍊',a:'orange',opts:['orange','apple','ball']},{e:'🐸',a:'frog',opts:['frog','fish','duck']}
];
// VOCABULARY (picture) grade 3 — jobs, "Who am I? I am a ___."
const KEX_PIC3=[
  {e:'👮',a:'policeman',opts:['policeman','singer','nurse']},{e:'👩‍⚕️',a:'doctor',opts:['nurse','doctor','princess']},
  {e:'👨‍🏫',a:'teacher',opts:['teacher','driver','nurse']},{e:'👨‍🎨',a:'painter',opts:['driver','builder','painter']},
  {e:'👷',a:'builder',opts:['builder','baker','farmer']},{e:'🧑‍🍳',a:'cook',opts:['cook','clown','pilot']},
  {e:'👨‍✈️',a:'pilot',opts:['pilot','painter','postman']},{e:'👩‍🌾',a:'farmer',opts:['farmer','fisher','dancer']},
  {e:'👨‍🚒',a:'firefighter',opts:['firefighter','driver','doctor']},{e:'💃',a:'dancer',opts:['dancer','singer','nurse']},
  {e:'🧑‍🚀',a:'astronaut',opts:['astronaut','pilot','driver']},{e:'🎤',a:'singer',opts:['singer','dancer','teacher']}
];
// TRANSLATION grade 2 (single words) — Georgian → pick the English.
const KEX_TR2=[
  {ka:'ჩანთა',a:'a bag',opts:['a pen','a book','a bag']},{ka:'ავტობუსი',a:'a bus',opts:['a bus','a car','a cat']},
  {ka:'გოგონა',a:'a girl',opts:['a girl','a boy','a child']},{ka:'რძე',a:'milk',opts:['water','tea','milk']},
  {ka:'ვარსკვლავი',a:'a star',opts:['a star','a car','a dog']},{ka:'წიგნი',a:'a book',opts:['a pen','a book','a bag']},
  {ka:'ძაღლი',a:'a dog',opts:['a cat','a dog','a doll']},{ka:'მაგიდა',a:'a table',opts:['a chair','a room','a table']},
  {ka:'ყუთი',a:'a box',opts:['a cup','a box','a book']},{ka:'თოჯინა',a:'a doll',opts:['a dog','a doll','a ball']},
  {ka:'კატა',a:'a cat',opts:['a cat','a dog','a cow']},{ka:'სახლი',a:'a house',opts:['a house','a horse','a mouse']},
  {ka:'ვაშლი',a:'an apple',opts:['an apple','an egg','an orange']},{ka:'მზე',a:'the sun',opts:['the sun','the moon','a star']},
  {ka:'ყვავილი',a:'a flower',opts:['a flower','a tree','grass']},{ka:'თევზი',a:'a fish',opts:['a fish','a bird','a frog']},
  {ka:'წყალი',a:'water',opts:['water','milk','tea']},{ka:'ბავშვი',a:'a child',opts:['a child','a girl','a boy']}
];
// TRANSLATION grade 3 (phrases).
const KEX_TR3=[
  {ka:'მსხალი',a:'a pear',opts:['a peach','a carrot','a pear']},{ka:'ვახშამი',a:'supper',opts:['supper','breakfast','lunch']},
  {ka:'კუდი',a:'a tail',opts:['a tale','a tile','a tail']},{ka:'სასაცილო ბაყაყი',a:'a funny frog',opts:['a funny dog','a funny frog','a happy frog']},
  {ka:'კარგი ძაღლი',a:'a good dog',opts:['a good dog','a good cat','a bad dog']},{ka:'მწვანე კაბა',a:'a green dress',opts:['a short dress','a green scarf','a green dress']},
  {ka:'ზარმაცი მოსწავლე',a:'a lazy pupil',opts:['a good pupil','a lazy pupil','a lazy boy']},{ka:'თვე',a:'a month',opts:['a day','a year','a month']},
  {ka:'აქლემი',a:'a camel',opts:['a lion','a camel','a tiger']},{ka:'ცარიელი ჭიქა',a:'an empty glass',opts:['an empty glass','a full glass','an empty bottle']},
  {ka:'ახლო მეგობარი',a:'a close friend',opts:['a close friend','a near friend','a closed friend']},{ka:'მძიმე ჩანთა',a:'a heavy bag',opts:['a full bag','a thick bag','a heavy bag']},
  {ka:'ღრმა ტბა',a:'a deep lake',opts:['a deep lake','a deep sea','a big lake']},{ka:'ხმაურიანი წვეულება',a:'a noisy party',opts:['a noisy party','a quiet party','a happy party']},
  {ka:'სუფთა იატაკი',a:'a clean floor',opts:['a clean floor','a clean wall','a dirty floor']},{ka:'ყვავილი',a:'a flower',opts:['a tree','a flower','grass']}
];
// SPELLING grade 2 — add one letter (A/B/C). `_` marks the gap. Gaps + distractors curated to stay unambiguous.
const KEX_SP2=[
  {w:'b_y',a:'o',opts:['o','k','y']},{w:'_ar',a:'c',opts:['c','z','m']},{w:'fro_',a:'g',opts:['h','g','i']},
  {w:'ca_e',a:'k',opts:['i','k','u']},{w:'he_',a:'n',opts:['o','n','z']},{w:'hor_e',a:'s',opts:['e','k','s']},
  {w:'ba_',a:'g',opts:['v','g','y']},{w:'gam_',a:'e',opts:['u','i','e']},{w:'fi_h',a:'s',opts:['s','t','r']},
  {w:'st_r',a:'a',opts:['a','o','u']},{w:'tr_e',a:'e',opts:['e','a','i']},{w:'mil_',a:'k',opts:['k','t','p']},
  {w:'du_k',a:'c',opts:['c','b','t']},{w:'ne_t',a:'s',opts:['s','z','r']},{w:'ki_g',a:'n',opts:['n','m','r']},
  {w:'la_p',a:'m',opts:['m','n','b']},{w:'shi_',a:'p',opts:['p','d','t']},{w:'do_l',a:'l',opts:['l','r','n']}
];
// SPELLING grade 3 (longer words).
const KEX_SP3=[
  {w:'chi_ken',a:'c',opts:['s','c','z']},{w:'bab_',a:'y',opts:['y','o','i']},{w:'cha_r',a:'i',opts:['e','i','a']},
  {w:'h_use',a:'o',opts:['e','a','o']},{w:'le_ter',a:'t',opts:['t','h','l']},{w:'ga_den',a:'r',opts:['c','e','r']},
  {w:'cit_',a:'y',opts:['y','o','i']},{w:'paren_',a:'t',opts:['t','h','l']},{w:'mushro_m',a:'o',opts:['e','a','o']},
  {w:'oni_n',a:'o',opts:['u','o','a']},{w:'flo_er',a:'w',opts:['w','v','u']},{w:'wi_dow',a:'n',opts:['n','m','r']},
  {w:'bas_et',a:'k',opts:['k','c','t']},{w:'pen_il',a:'c',opts:['c','s','z']},{w:'rab_it',a:'b',opts:['b','d','p']},
  {w:'ora_ge',a:'n',opts:['n','m','g']}
];
// GRAMMAR grade 3 — fill the blank (A/B/C). `___` marks the gap.
const KEX_GR3=[
  {q:'I ___ happy.',a:'am',opts:['am','is','are']},{q:'___ name is Maria.',a:'Her',opts:['She','Her','Him']},
  {q:'We ___ a big house.',a:'have',opts:['has','have','haves']},{q:'A cup is ___ the table.',a:'on',opts:['in','from','on']},
  {q:'He ___ very kind.',a:'is',opts:['is','am','are']},{q:'My sister ___ milk.',a:'loves',opts:['love','loving','loves']},
  {q:'Stars ___ in the sky.',a:'are',opts:['is','are','am']},{q:'___ apple is red.',a:'This',opts:['Those','These','This']},
  {q:'They ___ my friends.',a:'are',opts:['is','am','are']},{q:'She ___ a nice cat.',a:'has',opts:['have','has','haves']},
  {q:'The book is ___ the bag.',a:'in',opts:['in','on','at']},{q:'I have ___ apple.',a:'an',opts:['a','an','the']},
  {q:'We ___ football on Sunday.',a:'play',opts:['plays','play','playing']},{q:'There ___ two birds.',a:'are',opts:['is','are','am']},
  {q:'This is ___ pen.',a:'a',opts:['a','an','the']},{q:'He goes ___ school.',a:'to',opts:['to','in','at']},
  {q:'The cat is ___ the box.',a:'in',opts:['in','from','of']},{q:'My mother ___ tea.',a:'makes',opts:['make','makes','making']},
  {q:'I can ___ very fast.',a:'run',opts:['run','runs','running']},{q:'My dog ___ big.',a:'is',opts:['are','is','am']},
  {q:'___ you like tea?',a:'Do',opts:['Do','Are','Is']},{q:'I play ___ my dog.',a:'with',opts:['with','to','of']}
];

/* ── MATH pools (faithful variants of the real grade-2/3 olympiad items). A/B/C, Georgian stems. ── */
// grade 2
const KMX_PAT2=[
  {q:'5, 7, 10, 12, 15, 17, ?, 22',a:'20',opts:['19','20','21']},{q:'2, 4, 6, 8, ?',a:'10',opts:['9','10','12']},
  {q:'1, 3, 5, 7, ?',a:'9',opts:['8','9','11']},{q:'10, 9, 8, 7, ?',a:'6',opts:['6','5','8']},
  {q:'5, 10, 15, 20, ?',a:'25',opts:['25','22','30']},{q:'3, 6, 9, 12, ?',a:'15',opts:['14','15','18']},
  {q:'← ↑ → ↓ ← ↑ → ↓ ?',a:'←',opts:['←','↑','↓']}
];
const KMX_LOG2=[
  {q:'საათი ახლა 7-ს აჩვენებს. რამდენი საათის შემდეგ იქნება ისევ 7?',a:'12 სთ',opts:['6 სთ','12 სთ','24 სთ']},
  {q:'თაკოს 10 თუთიყუში ჰყავს. სულ მცირე რამდენი გალია უნდა, თუ ერთში 3 ეტევა?',a:'4',opts:['3','4','5']},
  {q:'სამკუთხედს სამივე წვერო რომ მოვაჭრათ სწორი ხაზით, რამდენი წვერო ექნება?',a:'6',opts:['6','7','3']},
  {q:'რომელია ლუწი რიცხვი?',a:'8',opts:['7','8','9']},
  {q:'ნიკას 3 ვაშლი აქვს, ლუკას 2-ით მეტი. რამდენი აქვს ლუკას?',a:'5',opts:['5','1','6']},
  {q:'კვირაში რამდენი დღეა?',a:'7',opts:['5','7','12']}
];
const KMX_CAL2=[
  {q:'ნიკას სამშ. და ხუთშ. 2-2 გაკვეთილი აქვს, ორშ/ოთხ/პარ — 3-3, შაბ-კვ ისვენებს. სულ რამდენი კვირაში?',a:'13',opts:['5','4','13']},
  {q:'თოჯინა 6₾, გემი 11₾. რატის 10₾ აქვს. კიდევ რამდენი ₾ სჭირდება ორივესთვის?',a:'7',opts:['17','27','7']},
  {q:'დემნა 2 წლის შემდეგ იქნება 10, მერაბი 2 წლის წინ იყო 10. რამდენით უფროსია მერაბი?',a:'4',opts:['2','4','6']},
  {q:'მარიამს 8 კანფეტი ჰქონდა, 3 შეჭამა. რამდენი დარჩა?',a:'5',opts:['5','11','4']},
  {q:'5 + 7 = ?',a:'12',opts:['12','11','13']},
  {q:'კალათში 4 წითელი და 5 ლურჯი ბურთია. სულ რამდენი?',a:'9',opts:['9','1','8']}
];
const KMX_REB2=[
  {q:'⋈ = 7, ≬ = 4. რას უდრის ⨀, თუ 1 + ⋈ − ≬ − ≬ = ⨀?',a:'0',opts:['0','3','11']},
  {q:'△ + 5 = 7, ∎ = △ + 3. რას უდრის ∎?',a:'5',opts:['9','7','5']},
  {q:'★ = 3. რას უდრის ★ + ★ + ★?',a:'9',opts:['6','9','12']},
  {q:'◆ + 2 = 6. რას უდრის ◆?',a:'4',opts:['4','8','3']},
  {q:'● = 5, ○ = 2. რას უდრის ● + ○?',a:'7',opts:['7','3','10']},
  {q:'🔺 = 6. რას უდრის 🔺 − 2?',a:'4',opts:['4','8','3']}
];
const KMX_BON2=[
  {q:'მარიამს მშობლებმა 10₾, ბებიამ 5₾ მისცა. ძმას 4₾ მისცა. რამდენი ₾ დარჩა?',a:'11',opts:['15','11','19']},
  {q:'ნიკა 3 საათით გავიდა, შუქი დარჩა ჩართული (1 სთ = 1 თეთრი). რამდენი თეთრი დაიხარჯა?',a:'3',opts:['3','2','1']},
  {q:'ბურთი 8₾ ღირს. ნიკას 5₾ აქვს. კიდევ რამდენი ₾ სჭირდება?',a:'3',opts:['3','13','2']},
  {q:'ლუკამ 20₾-დან 12₾ დახარჯა. რამდენი ₾ დარჩა?',a:'8',opts:['8','32','12']},
  {q:'1₾ = 100 თეთრი. რამდენი თეთრია 2₾?',a:'200',opts:['200','20','2']}
];
// grade 3
const KMX_PAT3=[
  {q:'1, 5, 10, 16, ?',a:'23',opts:['20','23','25']},{q:'2, 4, 8, 16, ?',a:'32',opts:['24','32','30']},
  {q:'1, 4, 9, 16, ?',a:'25',opts:['20','25','24']},{q:'3, 6, 12, 24, ?',a:'48',opts:['36','48','30']},
  {q:'1, 2, 4, 7, 11, ?',a:'16',opts:['15','16','14']},{q:'100, 90, 80, 70, ?',a:'60',opts:['60','65','75']}
];
const KMX_CAL3=[
  {q:'17 ივლისი ხუთშაბათი იყო. რა დღე იყო 15 ივლისი?',a:'სამშაბათი',opts:['შაბათი','ორშაბათი','სამშაბათი']},
  {q:'რამდენი წლის იქნება ანი 8 წლის შემდეგ, თუ 2 წლის წინ იყო 7?',a:'17',opts:['17','15','9']},
  {q:'არჩილი 20კგ-ზე მეტს ვერ წევს. საზამთროები: 8,6,5,5,5,3კგ (არ იჭრება). მაქს. რამდენ კგ წაიღებს?',a:'19',opts:['20','19','18']},
  {q:'24 ÷ 6 = ?',a:'4',opts:['4','6','3']},
  {q:'6 კალამი 12₾ ღირს. 1 კალამი რამდენი ₾?',a:'2',opts:['2','3','6']},
  {q:'45 + 38 = ?',a:'83',opts:['83','73','85']}
];
const KMX_LOG3=[
  {q:'ყუთში 8 შავი და 7 თეთრი ბურთი. 1 ამოვიღეთ და თანაბრად დარჩა. რომელი ამოვიღეთ?',a:'შავი',opts:['შავი','თეთრი','ვერ დავადგენთ']},
  {q:'რომელი თანხის დახურდავება ვერ მოხდება მხოლოდ 10-თეთრიანებად?',a:'65 თეთრი',opts:['70 თეთრი','65 თეთრი','40 თეთრი']},
  {q:'1 კინდერში 5 სათამაშო. ლუკამ 11-ზე მეტი მოაგროვა. სულ მცირე რამდენი აქვს?',a:'15',opts:['15','17','21']},
  {q:'5 ჩიტი მავთულზე ზის. 2 გაფრინდა. რამდენი დარჩა?',a:'3',opts:['3','7','2']},
  {q:'რომელი რიცხვი იყოფა 3-ზე ნაშთის გარეშე?',a:'9',opts:['9','8','10']},
  {q:'2 მეგობარს 12 კანფეტი თანაბრად უნდა გაიყოს. თითო რამდენს მიიღებს?',a:'6',opts:['6','4','12']}
];
const KMX_REB3=[
  {q:'გამოიცანი N, თუ 5 + N = 11',a:'6',opts:['8','6','5']},
  {q:'⊗ = 5, ⊛ = 3. რას უდრის ⊗ + ⊗ + ⊛?',a:'13',opts:['11','13','15']},
  {q:'△ × 2 = 8. რას უდრის △?',a:'4',opts:['4','6','16']},
  {q:'★ + ★ = 10. რას უდრის ★?',a:'5',opts:['5','10','2']},
  {q:'◆ = 9, ○ = 4. რას უდრის ◆ − ○?',a:'5',opts:['5','13','3']},
  {q:'2 × ● + 1 = 7. რას უდრის ●?',a:'3',opts:['3','4','2']}
];
const KMX_BON3=[
  {q:'მარიამს 10₾ მისცეს, ბებიამ 5₾, ძმას 4₾ მისცა. რამდენი ₾ დარჩა?',a:'11',opts:['15','11','19']},
  {q:'ბიუ-ბიუ ქალაქებში მუშაობს: თბილისი, რუსთავი, ხაშური, გორი, ზუგდიდი, ქუთაისი, ბათუმი. სულ რამდენი?',a:'7',opts:['5','6','7']},
  {q:'ირაკლიმ 2 წლის წინ ანაბარი გახსნა 17 წლის ასაკში. რამდენი წლისაა ახლა?',a:'19',opts:['19','15','17']},
  {q:'ველოსიპედი 80₾ ღირს. ნიკომ 50₾ დააგროვა. კიდევ რამდენი ₾ სჭირდება?',a:'30',opts:['30','130','20']},
  {q:'შარვალი 45₾ იყო, ფასდაკლება 10₾. ახლა რამდენი ₾ ღირს?',a:'35',opts:['35','55','40']}
];

/* ── exam blueprint: section sequence + point weights, faithful to the real PDFs ── */
const KINGS_EXAM={
  eng:{
    2:[
      {label:'🔠 ALPHABET',  instr:'იპოვე პატარა ასოს დიდი ვარიანტი (A, B ან C)', pts:10, n:5, gen:kxGenCap, type:'cap'},
      {label:'🖼️ VOCABULARY',instr:'აირჩიე სწორი პასუხი სურათის მიხედვით', pts:30, n:8, pool:KEX_PIC2, type:'pic', stem:'It is a ___.'},
      {label:'🔁 TRANSLATION',instr:'რომელია სწორი ინგლისური თარგმანი?', pts:30, n:8, pool:KEX_TR2, type:'tr'},
      {label:'✍️ SPELLING',  instr:'დაამატე ასო (A, B ან C) და ააწყვე სიტყვა', pts:30, n:8, pool:KEX_SP2, type:'sp'},
      {label:'🎁 BONUS',     instr:'რამდენჯერ მეორდება სიტყვა LIBERTY?', pts:5, n:1, gen:kxGenBonus, type:'bonus', bonus:true}
    ],
    3:[
      {label:'🖼️ VOCABULARY',instr:'აირჩიე სწორი პასუხი სურათის მიხედვით', pts:20, n:5, pool:KEX_PIC3, type:'pic', stem:'Who am I? I am a ___.'},
      {label:'✍️ SPELLING',  instr:'დაამატე ასო და ააწყვე სიტყვა', pts:30, n:8, pool:KEX_SP3, type:'sp'},
      {label:'🔁 TRANSLATION',instr:'რომელია სწორი ინგლისური თარგმანი?', pts:30, n:8, pool:KEX_TR3, type:'tr'},
      {label:'📝 GRAMMAR',    instr:'აირჩიე სწორი ვარიანტი', pts:20, n:8, pool:KEX_GR3, type:'gr'},
      {label:'🎁 BONUS',     instr:'რამდენჯერ მეორდება სიტყვა LIBERTY?', pts:5, n:1, gen:kxGenBonus, type:'bonus', bonus:true}
    ]
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
    ]
  }
};

let kx=null;
function kxGrade(){ const l=(typeof kingsLevel==='function')?kingsLevel():1; return l>=2?3:2; } // app level → real grade
// grade chooser: the real exam differs by grade, so let the child/parent pick (MVP = grade 2 & 3).
function kxPick(subject){
  const def=kxGrade();
  render(`<div class="screen kx-result"><div class="kx-card">
    <div class="kx-trophy">👑</div>
    <div class="kx-title">კინგსის ${subject==='eng'?'ინგლისურის ':''}ტესტი</div>
    <div class="p-sub" style="margin:4px 0 14px">აირჩიე კლასი (ნამდვილი კინგსის ფორმატი)</div>
    <button class="btn btn-primary btn-block" onclick="startKingsExam('${subject}',2)">📘 მე-2 კლასი${def===2?' ⭐':''}</button>
    <button class="btn btn-primary btn-block mt" onclick="startKingsExam('${subject}',3)">📗 მე-3 კლასი${def===3?' ⭐':''}</button>
    <button class="btn btn-ghost btn-block mt" onclick="openMenu('kings-${subject}')">უკან</button>
  </div></div>`, false);
}
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
  const body=`<div class="prompt">
      <div class="section-label">${sec.label} <span class="kx-pts">${sec.pts} ქ.</span></div>
      ${stem}
      <div class="p-sub" style="margin-top:8px">${sec.instr}</div></div>
    <div class="opt-list">${oo.map(o=>{const e=String(o).replace(/'/g,"\\'");return `<button class="opt ${optCls}" onclick="${speakEn?`speak('${e}');`:''}kxAnswer(this,'${e}','${String(correct).replace(/'/g,"\\'")}')">${o}</button>`;}).join('')}</div>`;
  gameShell(body);
  $('#gcount').textContent=`${kx.i+1}/${kx.qs.length}`;
}
function kxAnswer(btn,sel,cor){
  if(!kx)return; const {sec,per}=kx.qs[kx.i];
  if(String(sel)===String(cor)){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim')); btn.classList.remove('dim'); btn.classList.add('correct');
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
  const msg=total>=90?'შესანიშნავია! 🏆':total>=70?'ძალიან კარგი! 🌟':total>=50?'კარგი დასაწყისი — კიდევ ვივარჯიშოთ 💪':'ნუ ღელავ, ერთად გავიმეოროთ 🦉';
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
