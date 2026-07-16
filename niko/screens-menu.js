/* ═══════════════════════════════════════════════════════════
   NIKO LEARN: menu + subject navigation (split out of screens.js, B1 2026-06-28).
   Behaviour-identical: all functions stay global; loaded right AFTER screens.js. ═══ */
/* ── mode menu ── */
const MODE_TITLES={english:'🔤 ინგლისური',math:'🧮 მათემატიკა','kings-eng':'👑 კინგსი ინგლისური','kings-math':'👑 კინგსი მათემატიკა',counting:'🔢 დათვლა','ka-alpha':'🇬🇪 ანბანი','en-alpha':'🇬🇧 ანბანი'};

/* ── card-depth language (v1.98): a "stack" card opens MORE cards, a "play" card starts a game.
   On a stack tap: voice the destination + "აირჩიე" (recorded ka clips only) and unfold-animate.
   Voicing fires ONLY on the tap (not in openMenu), so back-navigation stays quiet. ── */
const NAV_SPOKEN={counting:'დათვლა','ka-alpha':'ქართული ანბანი','en-alpha':'ინგლისური ანბანი',math:'მათემატიკა',english:'ინგლისური','kings-eng':'კინგსი ინგლისური','kings-math':'კინგსი მათემატიკა'};
function unfoldThen(ev,go){
  const el=ev&&ev.currentTarget;
  let rm=false; try{rm=matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){}
  if(el&&!rm){ el.classList.add('unfolding'); setTimeout(go,200); } else go();
}
function openSubj(ev,subj){
  // FREEMIUM (owner 2026-06-23): a premium subject is NO LONGER hard-walled when premium is off. We OPEN the
  // menu so the parent can SEE every topic and play the free tasters; locked modes inside badge 🔒 → upsell.
  // „ბუს ქვეყანა": ≤7 hears the world name (wclip_*), 8+ keeps the classic nav word (nav_*).
  const spoken=(typeof worldsOn==='function'&&worldsOn(profile)&&typeof worldName==='function'&&worldName(subj))||NAV_SPOKEN[subj];
  if(window.playClipSeq)playClipSeq([spoken,'აირჩიე'].filter(Boolean));
  unfoldThen(ev,()=>openMenu(subj));
}
// D2 (v2.05): premium content stays VISIBLE; tapping it (when premium is off) shows an upsell, never a dead end.
function upsellPremium(subj){
  const name=MODE_TITLES[subj]||subj;
  render(`<div class="screen" style="justify-content:center;text-align:center;gap:14px;padding:24px">
    <div style="font-size:3.6rem">👑</div>
    <h2>${name} · Premium</h2>
    <p style="color:var(--muted);max-width:300px;line-height:1.5">ეს გაღრმავებული, საგამოცდო ნაწილია. უფასო ვერსიაში ხელმისაწვდომია მთელი საბაზისო სწავლა, Premium კი ხსნის გამოცდისთვის მზადებას და დამატებით სიღრმეს.</p>
    <div class="perm-points" style="max-width:320px;margin:0 auto;text-align:left">
      <div class="perm-point">${I.check} Kings & Cambridge / ოლიმპიადის სტილის ტესტები</div>
      <div class="perm-point">${I.check} 8-12 წლის გაღრმავებული დონე</div>
      <div class="perm-point">${I.check} მშობლის მიზნები და დეტალური ანალიტიკა</div>
    </div>
    <button class="btn btn-primary btn-block" style="max-width:300px" onclick="openGate()">${I.lock} მშობლის სივრცე →</button>
    <button class="btn btn-ghost btn-block" style="max-width:300px" onclick="selectProfile(profile)">უკან</button>
  </div>`,false);
}
function openPhrases(ev){
  if(window.playClipSeq)playClipSeq(['ფრაზები','აირჩიე']);
  unfoldThen(ev,openPhraseCats);
}
const PLAY_BADGE='<span class="play-badge" aria-hidden="true">▶</span>';
function openMenu(subj){
  game.subj=subj;
  if(window.Analytics)Analytics.screen('subject/'+subj);
  // per-subject diagnostic offer (first time) OR the visible Path (გზა) for the path subjects
  let pathHead='';
  if(typeof PATH_SUBJS!=='undefined' && PATH_SUBJS.indexOf(subj)>=0){
    if(typeof subjDiagNeeded==='function' && subjDiagNeeded(profile,subj)){
      const nq=(typeof plAskCount==='function'?plAskCount(profile,subj):(typeof diagSet==='function'?diagSet(profile,subj):(SUBJ_DIAG[subj]||[])).length);
      pathHead=`<div class="pathcard diag-offer"><div class="path-top"><b>🧭 ვნახოთ რა იცი ${pathLocName(subj)}</b></div>
        <div class="path-hint">სულ რაღაც ${nq} კითხვა, რომ გითხრა საიდან დაიწყო.</div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary" style="flex:1;padding:11px 14px;min-height:44px;font-size:.98rem" onclick="startSubjDiag('${profile}','${subj}')">დავიწყოთ →</button>
          <button class="btn btn-ghost" style="padding:11px 14px;min-height:44px;font-size:.98rem" onclick="skipSubjDiag('${profile}','${subj}')">გამოტოვება</button>
        </div></div>`;
    } else {
      pathHead=renderPathStrip(subj);
    }
  }
  let body;
  if(subj==='english'){
    const cat=game.cat;
    body=`<div class="cat-chip-row">
        <button class="cat-chip ${cat?'on':''}" onclick="openTopics()">📚 ${cat?cat:'ყველა თემა'} ${cat?'<span class="cx">✕</span>':'▾'}</button>
      </div>
      <div class="mode-grid">
      ${mode('quiz','🎯','მოისმინე','ქართ → ინგლ')}
      ${mode('reverse','🔄','კითხვა','ინგლ → ქართ')}
      ${mode('listen','👂','სურათი','🔊 → ხატულა')}
      ${mode('colour','🎨','ფერები','რა ფერია?')}
      ${mode('match','🧩','დააწყვილე','ქართ ↔ ინგლ')}
      ${mode('spell','✍️','დაწერე','მართლწერა')}
      ${mode('addlet','🔡','ასოს დამატება','ააწყვე სიტყვა')}
      ${!isYoung(profile)?mode('engram','📝','გრამატიკა','am / is / are…'):''}
      <div class="mode stack" ${kt("openPhrases(event)",mlabel('ფრაზები','ყოველდღიური'))}><div class="m-ico">💬</div><div class="m-name">ფრაზები</div><div class="m-sub">ყოველდღიური</div></div>
      ${(typeof weakWords==='function'&&weakWords().length)?`<div class="mode play review-tile" ${kt("startReview()",mlabel('გაიმეორე','რთული სიტყვები'))}>${PLAY_BADGE}<div class="m-ico">🔁</div><div class="m-name">გაიმეორე</div><div class="m-sub">რთული სიტყვები</div></div>`:''}
      ${(!isYoung(profile)&&typeof dueWords==='function'&&dueWords().length)?`<div class="mode play refresh-tile" ${kt("startRefresh()",mlabel('დღევანდელი გამეორება',`${dueWords().length} ${window.UILANG==='en'?'words':'სიტყვა'}`))}>${PLAY_BADGE}<div class="m-ico">🔄</div><div class="m-name">დღევანდელი გამეორება</div><div class="m-sub">${dueWords().length} ${window.UILANG==='en'?'words':'სიტყვა'}</div></div>`:''}
    </div>`;
  } else if(subj==='kings-eng'){
    body=`${kingsLevelBar('kings-eng')}
    <div class="mode-grid">
      <div class="mode feature play" ${kt("kxPick('eng')",mlabel('კინგსის ტესტი','ნამდვილი ფორმატი, შენი დონე, 100 ქულა'))}>${PLAY_BADGE}<div class="m-ico">👑</div><div><div class="m-name">კინგსის ტესტი</div><div class="m-sub">ნამდვილი ფორმატი · შენი დონე · 100 ქულა</div></div></div>
      ${kmode('kings-eng','quiz','🎯','ლექსიკა','')}
      ${kmode('kings-eng','listen','👂','მოსმენა','სიტყვა')}
      ${kmode('kings-eng','listen-yle','🎧','მოსმენა+','წინადადება')}
      ${kmode('kings-eng','yesno','✅','კი / არა','სწორია?')}
      ${kmode('kings-eng','story','📖','კითხვა','ამბავი')}
      ${kmode('kings-eng','speak','🗣️','ლაპარაკი','ხმამაღლა')}
      ${kmode('kings-eng','spell','✍️','მართლწერა','')}
      ${kmode('kings-eng','match','🧩','დააწყვილე','')}
    </div>`;
  } else if(subj==='kings-math'){
    body=`${kingsLevelBar('kings-math')}
    <div class="mode-grid">
      <div class="mode feature play" ${kt("kxPick('math')",mlabel('კინგსის ოლიმპიადა','ნამდვილი ფორმატი, შენი დონე, 100 ქულა'))}>${PLAY_BADGE}<div class="m-ico">👑</div><div><div class="m-name">კინგსის ოლიმპიადა</div><div class="m-sub">ნამდვილი ფორმატი · შენი დონე · 100 ქულა</div></div></div>
      ${kmode('kings-math','pattern','🧩','კანონზომიერება','იპოვე წესი')}
      ${kmode('kings-math','rebus','🔢','რებუსი','სიმბოლო=რიცხვი')}
      ${kmode('kings-math','model','📝','ამოცანები','ცხოვრებისეული')}
      ${kmode('kings-math','triangle','🔺','სამკუთხედი','იპოვე წესი')}
      ${(typeof isFreeMode==='function'&&!isFreeMode('kings-math','exam'))
        ?`<div class="mode play locked" ${kt("upsellPremium('kings-math')",mlabel('სავარჯიშო გამოცდა','დროზე, ნამდვილივით')+', ჩაკეტილია')}><span class="lock-badge">🔒</span><div class="m-ico">🏆</div><div class="m-name">სავარჯიშო გამოცდა</div><div class="m-sub">დროზე · ნამდვილივით</div></div>`
        :`<div class="mode play exam-tile" ${kt("startGame('exam')",mlabel('სავარჯიშო გამოცდა','დროზე, ნამდვილივით'))}>${PLAY_BADGE}<div class="m-ico">🏆</div><div class="m-name">სავარჯიშო გამოცდა</div><div class="m-sub">დროზე · ნამდვილივით</div></div>`}
    </div>
    <div class="pset-hint" style="margin-top:10px">ჩვეულებრივი შეკრება/გამოკლება/გამრავლება „🧮 მათემატიკაშია". Kings = ოლიმპიადური აზროვნება: წესის პოვნა, რებუსი, მრავალბიჯიანი ამოცანა.</div>`;
  } else if(subj==='math'){
    const kid=isYoung(profile);
    const tiny=isTiny(profile);
    const big=isBig(profile); // 7+ : division, missing-number, 2-digit ramp
    // Build the full age-gated tile list, but show only the first 4 rows (8 cards = one phone screen);
    // the rest live in the „ყველა თემა" picker so the menu never becomes a long scroll (owner 2026-06-13).
    const mtiles=[
      tiny?'':mode('math-add','➕',innerName('math','math-add',kid?'':'შეკრება'),kid?'':mathRangeLabel('math-add')),
      tiny?'':mode('math-sub','➖',innerName('math','math-sub',kid?'':'გამოკლება'),kid?'':mathRangeLabel('math-sub')),
      kid?'':mode('math-mul','✖️','გამრავლება',mathRangeLabel('math-mul')),
      kid?'':mode('math-word','📝','ამოცანები','ცხოვრებისეული'),
      big?mode('math-pic','🧠','თავსატეხი','ფასები · ლოგიკა'):'',
      big?mode('math-div','➗','გაყოფა',mathRangeLabel('math-div')):'',
      big?mode('math-miss','❓','გამოტოვებული',mathRangeLabel('math-miss')):'',
      tiny?'':mode('math-pat','🧩',innerName('math','math-pat',kid?'':'კანონზომიერება'),''),
      mode('shapes','🔷',innerName('math','shapes','ფიგურები'),''),
      kid?'':mode('compare','⚖️','შედარება','&gt; &lt; ='),
      kid?'':mode('skip','🔢','დათვლა','ხუთობით · ათობით'),
      kid?'':mode('money','💰','ფული','₾ · თეთრი'),
      kid?'':mode('clock','🕐','საათი','დრო')
    ].filter(Boolean);
    const CAP=8, hidden=Math.max(0,mtiles.length-CAP);
    const moreHint=hidden>0?`<button class="cat-more" onclick="openMathTopics()">+ ${hidden} თემა · ყველა თემა ▾</button>`:'';
    body=`<div class="cat-chip-row">
        <button class="cat-chip" onclick="openMathTopics()">📚 ყველა თემა ▾</button>
      </div>
      <div class="mode-grid">
      ${mtiles.slice(0,CAP).join('')}
    </div>${moreHint}`;
  } else if(subj==='counting'){
    // F2: digits come BEFORE counting, learn the numeral 1-9, quiz, THEN count.
    body=`<div class="mode-grid">
      <div class="mode play" style="min-height:120px" ${kt("digitLearn(0)",mlabel('ისწავლე ციფრები','1 – 9'))}>${PLAY_BADGE}<div class="kids-ico">🔢</div><div class="m-name">ისწავლე ციფრები</div><div class="m-sub">1 – 9</div></div>
      <div class="mode play" style="min-height:120px" ${kt("window.wSay&&wSay(this);startDigitQuiz()",mlabel(innerName('counting','quiz','ციფრების ტესტი'),''))}>${PLAY_BADGE}<div class="kids-ico">🎯</div><div class="m-name">${innerName('counting','quiz','ციფრების ტესტი')}</div></div>
      <div class="mode play" style="min-height:130px;grid-column:span 2" ${kt("startCount('pick')",mlabel('დათვალე','რამდენია? აირჩიე რიცხვი'))}>${PLAY_BADGE}<div class="kids-ico">🍎🍎🍎</div><div class="m-name">დათვალე</div><div class="m-sub">რამდენია? აირჩიე რიცხვი</div></div>
    </div>`;
  } else { /* alphabets, Georgian & English */
    // NB-16 pre-reader gate (owner 2026-07-06): a ≤5 must never be routed into a mode that ASSUMES reading.
    // KEEP for young — audio-scaffolded reading ACQUISITION: ისწავლე / ტესტები (letter, voiced), კითხვა +
    // ააწყვე (every syllable tap plays its clip), ამოწერა (writing). GATE for young — modes that assume the
    // child already reads: წინადადება (sentence), გაგება (no-audio text comprehension), შეადგინე სიტყვა
    // (whole-word letter ordering; ka letter tiles are silent by the voice standard).
    const preReader = isYoung(profile);
    // Georgian also gets READING (syllable→word), the #1 gap + Georgian-first differentiator.
    const reading = subj==='ka-alpha' ? `<div class="mode play" style="min-height:120px" ${kt("window.wSay&&wSay(this);readLearn(0)",mlabel(innerName('ka-alpha','read','კითხვა'),'მარცვალი, სიტყვა'))}>${PLAY_BADGE}<div class="kids-ico">📖</div><div class="m-name">${innerName('ka-alpha','read','კითხვა')}</div><div class="m-sub">მარცვალი → სიტყვა</div></div>` : '';
    const sentence = (subj==='ka-alpha'&&!preReader) ? `<div class="mode play" style="min-height:120px" ${kt("sentLearn(0)",mlabel('წინადადება','წაიკითხე და გაიგე'))}>${PLAY_BADGE}<div class="kids-ico">📝</div><div class="m-name">წინადადება</div><div class="m-sub">წაიკითხე და გაიგე</div></div>` : '';
    const comprehend = (subj==='ka-alpha'&&!preReader) ? `<div class="mode play" style="min-height:120px" ${kt("startTextQuiz()",mlabel('გაგება','წაიკითხე და უპასუხე'))}>${PLAY_BADGE}<div class="kids-ico">📚</div><div class="m-name">გაგება</div><div class="m-sub">წაიკითხე და უპასუხე</div></div>` : '';
    const build = subj==='ka-alpha' ? `<div class="mode play" style="min-height:120px" ${kt("startBuild()",mlabel('ააწყვე','მარცვლებით სიტყვა'))}>${PLAY_BADGE}<div class="kids-ico">🧩</div><div class="m-name">ააწყვე</div><div class="m-sub">მარცვლებით სიტყვა</div></div>` : '';
    const trace = subj==='ka-alpha' ? `<div class="mode play" style="min-height:120px" ${kt("window.wSay&&wSay(this);traceLearn(0)",mlabel(innerName('ka-alpha','trace','ამოწერა'),'ასოს წერა თითით'))}>${PLAY_BADGE}<div class="kids-ico">✍️</div><div class="m-name">${innerName('ka-alpha','trace','ამოწერა')}</div><div class="m-sub">ასოს წერა თითით</div></div>` : '';
    // Georgian-alphabet tiles must SHOW Georgian letters (ა ბ გ), not the Latin-letter emoji (🔤/🔡).
    // en-alpha keeps the Latin emoji — that is correct for English. (owner fix v1.319)
    const isKa = subj==='ka-alpha';
    const learnIco = isKa ? `<div class="kids-ico ka-samp">ა ბ გ</div>` : `<div class="kids-ico">🔡</div>`;
    // build-a-word tile wears a puzzle glyph, NOT the "ა ბ გ" alphabet sample — that sample belongs to the
    // "learn the letters" tile above; sharing it made the two tiles look identical (owner fix 2026-07-04).
    const spellIco = `<div class="kids-ico">🧩</div>`;
    // 🔤 tap-to-spell (no keyboard) — both alphabets, readers (6+) only per the NB-16 gate above
    const spell = preReader ? '' : `<div class="mode play" style="min-height:120px" ${kt(`startShead('${subj}')`,mlabel('შეადგინე სიტყვა','ასოებით ააწყვე'))}>${PLAY_BADGE}${spellIco}<div class="m-name">შეადგინე სიტყვა</div><div class="m-sub">ასოებით ააწყვე</div></div>`;
    body=`<div class="mode-grid">
      <div class="mode play" style="min-height:120px" ${kt(`window.wSay&&wSay(this);alphaLearn('${subj}',0)`,mlabel(innerName(subj,'learn','ისწავლე ასოები'),''))}>${PLAY_BADGE}${learnIco}<div class="m-name">${innerName(subj,'learn','ისწავლე ასოები')}</div></div>
      <div class="mode play" style="min-height:120px" ${kt(`window.wSay&&wSay(this);alphaQuiz('${subj}')`,mlabel(innerName(subj,'quiz','ტესტები'),''))}>${PLAY_BADGE}<div class="kids-ico">🎯</div><div class="m-name">${innerName(subj,'quiz','ტესტები')}</div></div>
      ${spell}
      ${reading}
      ${sentence}
      ${comprehend}
      ${build}
      ${trace}
    </div>`;
  }
  const wTitle=(typeof worldsOn==='function'&&worldsOn(profile)&&typeof WORLDS!=='undefined'&&WORLDS[subj])?`${WORLDS[subj].ic} ${WORLDS[subj].nm}`:null;
  render(`<div class="screen">
    ${topbar(wTitle||MODE_TITLES[subj]||subj,null,'selectProfile(profile)')}
    ${pathHead}
    ${body}
  </div>`,'home');
}
// aria-label for a tile: the visible name plus its subtitle, so a screen reader announces the same
// thing a sighted child sees. Strips the &nbsp; placeholder, any markup, and quotes that would end
// the attribute early.
function mlabel(name,sub){
  const clean=s=>String(s||'').replace(/&nbsp;/g,' ').replace(/<[^>]*>/g,'').replace(/"/g,'').trim();
  const n=clean(name), s=clean(sub);
  return n&&s ? `${n}, ${s}` : (n||s||'თამაში');
}
function mode(m,ic,name,sub){
  // wSay = „ბუს ქვეყანა" voicing: reads the rendered name clip on tap (silent no-op for reader labels).
  // kt() (screens.js) is what makes a div behave like a real button: role, tabindex, aria-label and
  // Enter/Space. EVERY subject's mode grid renders through this one function, so the semantics cannot
  // drift per-subject the way they did before (NB-54).
  return `<div class="mode play" ${kt(`window.wSay&&wSay(this);startGame('${m}')`,mlabel(name,sub))}>${PLAY_BADGE}<div class="m-ico">${ic}</div><div class="m-name">${name||'&nbsp;'}</div>${sub?`<div class="m-sub">${sub}</div>`:''}</div>`;
}
// Kings mode tile with freemium gating: free taster → normal playable tile; locked → 🔒 badge + tap = upsell.
function kmode(subj,m,ic,name,sub){
  if(typeof isFreeMode!=='function' || isFreeMode(subj,m)) return mode(m,ic,name,sub);
  // „ჩაკეტილია" is in the label on purpose: the 🔒 badge is visual-only, so without it a screen-reader
  // user hears a normal tile and lands on an upsell they had no way to see coming.
  return `<div class="mode play locked" ${kt(`upsellPremium('${subj}')`,mlabel(name,sub)+', ჩაკეტილია')}><span class="lock-badge">🔒</span><div class="m-ico">${ic}</div><div class="m-name">${name||'&nbsp;'}</div>${sub?`<div class="m-sub">${sub}</div>`:''}</div>`;
}
/* Kings = Cambridge YLE level ladder selector (Starters/Movers/Flyers). Tapping a band sets it on the
   profile and re-renders the Kings menu so every mode then draws level-appropriate items. */
function setKLevel(n,subj){ if(typeof setKingsLevel==='function')setKingsLevel(n); openMenu(subj||'kings-eng'); }
function kingsLevelBar(subj){
  const cur=(typeof kingsLevel==='function')?kingsLevel():1;
  const L=[[1,'Starters','დამწყები'],[2,'Movers','საშუალო'],[3,'Flyers','მაღალი']];
  return `<div class="klevel-bar">${L.map(([n,en,ka])=>`<button class="klevel${n===cur?' on':''}" aria-pressed="${n===cur}" onclick="setKLevel(${n},'${subj||'kings-eng'}')"><b>${en}</b><small>${ka}</small></button>`).join('')}</div>`;
}

/* ── category pickers ── */
function openTopics(){
  const cats=Object.keys(WORDS);
  const card=(c)=>{const m=c.match(/(.+?)\s*(\p{Emoji})\s*$/u);const name=m?m[1]:c;const ic=m?m[2]:'📚';
    return `<button class="topic-card" onclick="pickTopic('${c.replace(/'/g,"\\'")}')"><div class="topic-ic">${ic}</div><div class="topic-name">${name}</div><div class="topic-n">${WORDS[c].length} სიტყვა</div></button>`;};
  render(`<div class="screen">
    ${topbar('📚 კატეგორიები','აირჩიე თემა',"openMenu('english')")}
    <button class="topic-all ${game.cat?'':'on'}" onclick="pickTopic('')">🌈 ყველა თემა <span class="topic-n">${Object.values(WORDS).reduce((a,v)=>a+v.length,0)} სიტყვა</span></button>
    <div class="topic-grid">${cats.map(card).join('')}</div>
  </div>`,'home');
}
function pickTopic(c){game.cat=c||null;if(c&&window.Analytics)Analytics.event('topic_usage',{topic:c});openMenu('english');}
// Math themes picker (owner 2026-06-13: wants the same „ყველა თემა" affordance as English). Math has game-TYPES
// rather than a word pool, so each theme launches its game directly. Age-gated to match the Math menu tiles.
function openMathTopics(){
  const kid=isYoung(profile), tiny=isTiny(profile), big=isBig(profile);
  const T=[
    {ic:'➕',name:innerName('math','math-add','შეკრება'),     go:"startGame('math-add')",  show:!tiny},
    {ic:'➖',name:innerName('math','math-sub','გამოკლება'),   go:"startGame('math-sub')",  show:!tiny},
    {ic:'✖️',name:'გამრავლება',  go:"startGame('math-mul')",  show:!kid},
    {ic:'📝',name:'ამოცანები',   go:"startGame('math-word')", show:!kid},
    {ic:'🧠',name:'თავსატეხი',   go:"startGame('math-pic')",  show:big},
    {ic:'➗',name:'გაყოფა',      go:"startGame('math-div')",  show:big},
    {ic:'❓',name:'გამოტოვებული', go:"startGame('math-miss')", show:big},
    {ic:'🧩',name:innerName('math','math-pat','კანონზომიერება'),   go:"startGame('math-pat')",  show:!tiny},
    {ic:'⚖️',name:'შედარება',    go:"startGame('compare')",   show:!kid},
    {ic:'🔢',name:'დათვლა',      go:"startGame('skip')",      show:!kid},
    {ic:'🔷',name:innerName('math','shapes','ფიგურები'),    go:"startGame('shapes')",    show:true},
    {ic:'💰',name:'ფული',        go:"startGame('money')",     show:!kid},
    {ic:'🕐',name:'საათი',       go:"startGame('clock')",     show:!kid},
    {ic:'📅',name:'კალენდარი',   go:"startGame('cal')",       show:!kid}
  ].filter(t=>t.show);
  const card=t=>`<button class="topic-card" onclick="${t.go}"><div class="topic-ic">${t.ic}</div><div class="topic-name">${t.name}</div></button>`;
  render(`<div class="screen">
    ${topbar('🧮 მათემატიკის თემები','აირჩიე თემა',"openMenu('math')")}
    <div class="topic-grid">${T.map(card).join('')}</div>
  </div>`,'home');
}
function openPhraseCats(){
  const cats=Object.keys(PHRASES);
  const card=(c)=>{const m=c.match(/(.+?)\s*(\p{Emoji})\s*$/u);const name=m?m[1]:c;const ic=m?m[2]:'💬';
    return `<button class="topic-card" onclick="startPhrases('${c.replace(/'/g,"\\'")}')"><div class="topic-ic">${ic}</div><div class="topic-name">${name}</div><div class="topic-n">${PHRASES[c].length} ფრაზა</div></button>`;};
  render(`<div class="screen">
    ${topbar('💬 ფრაზები','აირჩიე თემა',"openMenu('english')")}
    <button class="topic-all on" onclick="startPhrases('')">🌈 ყველა ფრაზა <span class="topic-n">${Object.values(PHRASES).reduce((a,v)=>a+v.length,0)} ფრაზა</span></button>
    <div class="topic-grid">${cats.map(card).join('')}</div>
  </div>`,'home');
}

