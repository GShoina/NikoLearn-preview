/* ═══════════════════════════════════════════════════════════
   NikoLearn — KINGS faithful EXAM (sectioned, mirrors the real kings.ge sample tests)
   Built from the REAL grade-2 & grade-3 English sample PDFs (kings.ge, fetched 2026-06-24). Each grade
   runs the real task SEQUENCE with the real section labels, instructions, question counts and POINT
   weights, and scores out of 100 (+ a 5-pt bonus that only helps if the main score isn't maxed — the
   real Kings rule). Loads AFTER games.js (reuses gameShell/winStep/shuffle/state). Grades 4-6 (reading
   comprehension / definition→word / odd-one-out) are parked for the roadmap (docs/ROADMAP.md). owner 2026-06-24.
   ═══════════════════════════════════════════════════════════ */

/* ── content pools (faithful variants of the real items, same style + difficulty) ── */
// Task: ALPHABET — given a lowercase letter, pick the matching CAPITAL (A/B/C).
const KEX_CAPITAL=[
  {l:'d',opts:['B','D','P'],a:'D'},{l:'m',opts:['N','M','W'],a:'M'},{l:'g',opts:['G','Q','C'],a:'G'},
  {l:'f',opts:['E','F','T'],a:'F'},{l:'r',opts:['P','R','B'],a:'R'},{l:'q',opts:['O','Q','G'],a:'Q'},
  {l:'h',opts:['K','H','N'],a:'H'},{l:'e',opts:['F','E','B'],a:'E'},{l:'a',opts:['A','R','H'],a:'A'},
  {l:'k',opts:['X','K','R'],a:'K'}
];
// Task: VOCABULARY (picture) grade 2 — emoji + "It is a ___." → pick the word.
const KEX_PIC2=[
  {e:'🐮',a:'cow',opts:['cow','cat','horse']},{e:'🐭',a:'mouse',opts:['mouse','pig','chicken']},
  {e:'🐱',a:'cat',opts:['cat','mouse','car']},{e:'🌳',a:'tree',opts:['tree','plane','book']},
  {e:'🐦',a:'bird',opts:['frog','bird','dog']},{e:'🍌',a:'banana',opts:['orange','banana','ball']},
  {e:'🐶',a:'dog',opts:['dog','frog','cat']},{e:'🐷',a:'pig',opts:['pig','cow','hen']},
  {e:'⭐',a:'star',opts:['star','car','sun']},{e:'🚗',a:'car',opts:['car','cat','cup']}
];
// Task: VOCABULARY (picture) grade 3 — jobs, "Who am I? I am a ___."
const KEX_PIC3=[
  {e:'👮',a:'policeman',opts:['policeman','singer','nurse']},{e:'👩‍⚕️',a:'doctor',opts:['nurse','doctor','princess']},
  {e:'👨‍🏫',a:'teacher',opts:['teacher','driver','nurse']},{e:'👨‍🎨',a:'painter',opts:['driver','builder','painter']},
  {e:'👷',a:'builder',opts:['builder','baker','farmer']},{e:'🧑‍🍳',a:'cook',opts:['cook','clown','pilot']},
  {e:'👨‍✈️',a:'pilot',opts:['pilot','painter','postman']},{e:'👩‍🌾',a:'farmer',opts:['farmer','fisher','dancer']}
];
// Task: TRANSLATION grade 2 (single words) — Georgian → pick the English.
const KEX_TR2=[
  {ka:'ჩანთა',a:'a bag',opts:['a pen','a book','a bag']},{ka:'ავტობუსი',a:'a bus',opts:['a bus','a car','a cat']},
  {ka:'გოგონა',a:'a girl',opts:['a girl','a boy','a child']},{ka:'რძე',a:'milk',opts:['water','tea','milk']},
  {ka:'ვარსკვლავი',a:'a star',opts:['a star','a car','a dog']},{ka:'წიგნი',a:'a book',opts:['a pen','a book','a bag']},
  {ka:'ძაღლი',a:'a dog',opts:['a cat','a dog','a doll']},{ka:'მაგიდა',a:'a table',opts:['a chair','a room','a table']},
  {ka:'ყუთი',a:'a box',opts:['a cup','a box','a book']},{ka:'თოჯინა',a:'a doll',opts:['a dog','a doll','a ball']}
];
// Task: TRANSLATION grade 3 (phrases).
const KEX_TR3=[
  {ka:'მსხალი',a:'a pear',opts:['a peach','a carrot','a pear']},{ka:'ვახშამი',a:'supper',opts:['supper','breakfast','lunch']},
  {ka:'კუდი',a:'a tail',opts:['a tale','a tile','a tail']},{ka:'სასაცილო ბაყაყი',a:'a funny frog',opts:['a funny dog','a funny frog','a happy frog']},
  {ka:'კარგი ძაღლი',a:'a good dog',opts:['a good dog','a good cat','a bad dog']},{ka:'ყვავილი',a:'a flower',opts:['a tree','a flower','grass']},
  {ka:'მწვანე კაბა',a:'a green dress',opts:['a short dress','a green scarf','a green dress']},{ka:'ზარმაცი მოსწავლე',a:'a lazy pupil',opts:['a good pupil','a lazy pupil','a lazy boy']}
];
// Task: SPELLING grade 2 — add one letter (A/B/C) to make the word. `_` marks the gap.
const KEX_SP2=[
  {w:'a b_y',a:'o',opts:['o','k','y']},{w:'a _ar',a:'c',opts:['c','z','a']},{w:'a fro_',a:'g',opts:['h','g','i']},
  {w:'a ca_e',a:'k',opts:['i','k','u']},{w:'a he_',a:'n',opts:['o','n','z']},{w:'a hor_e',a:'s',opts:['e','k','s']},
  {w:'a b_g',a:'a',opts:['v','a','y']},{w:'a gam_',a:'e',opts:['u','i','e']}
];
// Task: SPELLING grade 3 (harder words).
const KEX_SP3=[
  {w:'a chi_ken',a:'c',opts:['s','c','z']},{w:'a bab_',a:'y',opts:['y','o','i']},{w:'a cha_r',a:'i',opts:['e','i','a']},
  {w:'a h_use',a:'o',opts:['e','a','o']},{w:'a le_ter',a:'t',opts:['t','h','l']},{w:'a ga_den',a:'r',opts:['c','e','r']},
  {w:'a cit_',a:'y',opts:['y','o','i']},{w:'a paren_',a:'t',opts:['t','h','l']}
];
// Task: GRAMMAR grade 3 — fill the blank (A/B/C). `___` marks the gap.
const KEX_GR3=[
  {q:'I ___ happy.',a:'am',opts:['am','is','are']},{q:'___ name is Maria.',a:'Her',opts:['She','Her','Him']},
  {q:'We ___ a big house.',a:'have',opts:['has','have','haves']},{q:'A cup is ___ the table.',a:'on',opts:['in','from','on']},
  {q:'He ___ very kind.',a:'is',opts:['is','am','are']},{q:'My sister ___ milk.',a:'loves',opts:['love','loving','loves']},
  {q:'Stars ___ in the sky.',a:'are',opts:['is','are','am']},{q:'___ apple is red.',a:'This',opts:['Those','These','This']}
];
// BONUS — count how many times the word LIBERTY appears (the real Liberty-Bank sponsored task).
const KEX_BONUS=[
  {seq:'LIBERTY LIBRTEY LIBERTY LIBETRY LIBERTY',a:'3',opts:['3','2','4']},
  {seq:'LIBETRY LIBERTY LIBERTY LBIERTY',a:'2',opts:['2','3','1']},
  {seq:'LIBERTY LIBERTY LIBRETY LIBERTY LIBTREY LIBERTY',a:'4',opts:['4','3','5']}
];

/* ── exam blueprint: section sequence + point weights, faithful to the real PDFs (sum = 100 + 5 bonus) ── */
const KINGS_EXAM={
  eng:{
    2:[
      {label:'🔠 ALPHABET',  instr:'იპოვე პატარა ასოს დიდი ვარიანტი (A, B ან C)', pts:10, n:5, pool:KEX_CAPITAL, type:'cap'},
      {label:'🖼️ VOCABULARY',instr:'აირჩიე სწორი პასუხი სურათის მიხედვით', pts:30, n:8, pool:KEX_PIC2, type:'pic', stem:'It is a ___.'},
      {label:'🔁 TRANSLATION',instr:'რომელია სწორი ინგლისური თარგმანი?', pts:30, n:8, pool:KEX_TR2, type:'tr'},
      {label:'✍️ SPELLING',  instr:'დაამატე ასო (A, B ან C) და ააწყვე სიტყვა', pts:30, n:8, pool:KEX_SP2, type:'sp'},
      {label:'🎁 BONUS',     instr:'რამდენჯერ მეორდება სიტყვა LIBERTY?', pts:5, n:1, pool:KEX_BONUS, type:'bonus', bonus:true}
    ],
    3:[
      {label:'🖼️ VOCABULARY',instr:'აირჩიე სწორი პასუხი სურათის მიხედვით', pts:20, n:5, pool:KEX_PIC3, type:'pic', stem:'Who am I? I am a ___.'},
      {label:'✍️ SPELLING',  instr:'დაამატე ასო და ააწყვე სიტყვა', pts:30, n:8, pool:KEX_SP3, type:'sp'},
      {label:'🔁 TRANSLATION',instr:'რომელია სწორი ინგლისური თარგმანი?', pts:30, n:8, pool:KEX_TR3, type:'tr'},
      {label:'📝 GRAMMAR',    instr:'აირჩიე სწორი ვარიანტი', pts:20, n:8, pool:KEX_GR3, type:'gr'},
      {label:'🎁 BONUS',     instr:'რამდენჯერ მეორდება სიტყვა LIBERTY?', pts:5, n:1, pool:KEX_BONUS, type:'bonus', bonus:true}
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
    const picked=shuffle(sec.pool.slice()).slice(0,sec.n);
    const per=sec.pts/sec.n;
    picked.forEach(it=>qs.push({sec,it,per}));
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
  const total=main+(main<100?bonus:0);
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
  kx=null;
}
