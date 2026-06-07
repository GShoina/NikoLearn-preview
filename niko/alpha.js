/* ═══════════════════════════════════════════════════════════
   NikoLearn — Alphabet module (Georgian ა-ჰ & English A-Z)
   Learn (flip + sound) and Quiz (find the starting letter).
   Voicing follows the child's language; pictures carry meaning.
   ═══════════════════════════════════════════════════════════ */

function alphaData(subj){return subj==='ka-alpha'?KA_ALPHA:EN_ALPHA;}
function alphaIsKa(subj){return subj==='ka-alpha';}
// each letter holds several example words (x:[[word,emoji],...]); pick one at random for variety
function alphaItem(entry){const p=entry.x[ri(0,entry.x.length-1)];return {l:entry.l,w:p[0],e:p[1]};}

/* speak one alphabet item, age- & language-appropriate */
function alphaSay(subj,it){
  if(alphaIsKa(subj)){
    // letter sound lives inside the example word → say the word, slowly
    speak(it.w,'ka-GE',{rate:isYoung(profile)?0.5:0.6});
  } else {
    // English letter name + example word
    speak(it.l+'. '+it.w,'en-US',{rate:isYoung(profile)?0.66:0.78});
  }
}

/* ── LEARN: one card per letter, flip with big arrows ── */
function alphaLearn(subj,idx){
  const data=alphaData(subj),n=data.length;
  idx=Math.max(0,Math.min(idx,n-1));
  game.subj=subj;
  const entry=data[idx],last=idx>=n-1,first=idx<=0;
  const it=alphaItem(entry); game.alphaIt=it;   // random example word, kept so re-taps say the same one
  render(`<div class="screen">
    ${topbar(MODE_TITLES[subj]||subj,`ისწავლე · ${idx+1}/${n}`,`openMenu('${subj}')`)}
    <div class="alpha-stage">
      <div class="alpha-card" onclick="alphaSay('${subj}',game.alphaIt)">
        <div class="alpha-letter">${it.l}</div>
        ${alphaIsKa(subj)?`<div class="alpha-variants" aria-hidden="true" title="იგივე ასო სხვადასხვა შრიფტში">
          <span style="font-family:'Noto Sans Georgian',sans-serif">${it.l}</span>
          <span style="font-family:'Noto Serif Georgian',serif">${it.l}</span>
          <span style="font-family:'FiraGO',sans-serif">${it.l}</span>
        </div>`:''}
        <div class="alpha-pic">${it.e}</div>
        <div class="alpha-word">${it.w}</div>
        <button class="speakbtn big" onclick="event.stopPropagation();alphaSay('${subj}',game.alphaIt);pulseTap(this)">${I.speaker} მოისმინე</button>
      </div>
    </div>
    <div class="alpha-nav">
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="alphaLearn('${subj}',${idx-1})">←</button>
      <div class="alpha-dots">${idx+1} / ${n}</div>
      ${last
        ? `<button class="abtn go" onclick="alphaQuiz('${subj}')">ტესტები 🎯</button>`
        : `<button class="abtn" onclick="alphaLearn('${subj}',${idx+1})">→</button>`}
    </div>
  </div>`,false);
  setTimeout(()=>alphaSay(subj,it),220);
}

/* ── QUIZ: see picture+word, pick the starting letter ── */
function alphaQuiz(subj){
  const data=alphaData(subj);
  game.mode=subj;game.subj=subj;game.i=0;game.shields=0;game.wrong=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=shuffle(data).slice(0,8).map(alphaItem);
  nextAlpha();
}
function alphaOpts(data,correct){
  const set=new Set([correct.l]);
  for(const it of shuffle(data)){if(set.size>=4)break;set.add(it.l);}
  return shuffle([...set]);
}
// voice the tapped letter via its example word (recorded clip), so a pre-reader hears each letter
function alphaTapSay(subj,L){ const e=alphaData(subj).find(x=>x.l===L); if(e)alphaSay(subj,alphaItem(e)); }
function nextAlpha(){
  if(game.i>=game.qs.length)return results();
  const subj=game.mode,data=alphaData(subj),q=game.qs[game.i];
  const opts=alphaOpts(data,q);
  alphaSay(subj,q);
  // visual-first: picture carries meaning, word shows the missing FIRST letter as a slot.
  const rest=q.w.slice(q.l.length);
  const area=`<div class="prompt alpha-q">
      <div class="p-emoji" style="font-size:4.6rem">${q.e}</div>
      <div class="alpha-wordgap ${alphaIsKa(subj)?'':'en'}"><span class="gap-slot">?</span><span>${rest}</span></div>
      <button class="speakbtn pulse-tap" onclick="alphaSay('${subj}',game.qs[${game.i}]);pulseTap(this)">${I.speaker} მოისმინე</button>
      <div class="finger-hint">👆 აირჩიე ასო</div>
    </div>
    <div class="options alpha-opts">${opts.map(L=>`<button class="opt letter ${alphaIsKa(subj)?'':'en'}" onclick="alphaTapSay('${subj}','${L}');answerAlpha(this,'${L}','${q.l}')">${L}</button>`).join('')}</div>`;
  gameShell(area);
  const c=$('#gcount');if(c)c.textContent=`${game.i+1}/${game.qs.length}`;
}
function alphaRec(ok){
  const s=state[profile];if(!s.alpha)s.alpha={};
  if(!s.alpha[game.mode])s.alpha[game.mode]={correct:0,wrong:0};
  s.alpha[game.mode][ok?'correct':'wrong']++;
}
function answerAlpha(btn,sel,cor){
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.remove('dim');btn.classList.add('correct');
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);
    alphaRec(true);save();praise();feedback(true);
    setTimeout(()=>{game.i++;closeFeedback();nextAlpha();},1000);
  } else {
    btn.classList.add('wrong','dim');state[profile].streak=0;game.wrong++;alphaRec(false);save();
    setTimeout(maybeOfferHelp,350);
  }
}

/* ═══════════════════════════════════════════════════════════
   DIGITS 1-9 — learn the numeral (shape + name + sound) FIRST,
   then a recognition quiz, BEFORE counting. (F2: under-5 kids
   don't know the digits yet, so counting can't be the first step.)
   ═══════════════════════════════════════════════════════════ */
function digitData(){return COUNTING.slice(0,9);}            // {num,emoji,ka,en} for 1..9
function digitSay(num){speak(numWord(num,profile),vCode(profile),{rate:isYoung(profile)?0.6:0.7});} // ka clip or en voice
function digitLearn(idx){
  const data=digitData(),n=data.length;
  idx=Math.max(0,Math.min(idx,n-1));
  const d=data[idx],last=idx>=n-1,first=idx<=0;
  render(`<div class="screen">
    ${topbar('🔢 ციფრები',`ისწავლე · ${idx+1}/${n}`,"openMenu('counting')")}
    <div class="alpha-stage">
      <div class="alpha-card" onclick="digitSay(${d.num})">
        <div class="alpha-letter">${d.num}</div>
        <div class="alpha-pic">${d.emoji}</div>
        <div class="alpha-word">${d.ka}</div>
        <button class="speakbtn big" onclick="event.stopPropagation();digitSay(${d.num});pulseTap(this)">${I.speaker} მოისმინე</button>
      </div>
    </div>
    <div class="alpha-nav">
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="digitLearn(${idx-1})">←</button>
      <div class="alpha-dots">${idx+1} / ${n}</div>
      ${last
        ? `<button class="abtn go" onclick="startDigitQuiz()">ტესტები 🎯</button>`
        : `<button class="abtn" onclick="digitLearn(${idx+1})">→</button>`}
    </div>
  </div>`,false);
  setTimeout(()=>digitSay(d.num),220);
}
function startDigitQuiz(){
  game.mode='digit';game.subj='counting';game.i=0;game.shields=0;game.wrong=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=shuffle(digitData()).slice(0,8);
  nextDigit();
}
function nextDigit(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];
  const opts=new Set([q.num]);while(opts.size<4)opts.add(ri(1,9));
  digitSay(q.num);  // hear the number, then find its numeral
  const area=`<div class="prompt">
      <div class="count-q">რომელია?</div>
      <button class="speakbtn pulse-tap" onclick="digitSay(${q.num});pulseTap(this)">${I.speaker} მოისმინე</button>
      <div class="finger-hint">👆 აირჩიე ციფრი</div>
    </div>
    <div class="options">${shuffle([...opts]).map(nn=>`<button class="opt num" onclick="answerDigit(this,${nn},${q.num})">${nn}</button>`).join('')}</div>`;
  gameShell(area);
  const c=$('#gcount');if(c)c.textContent=`${game.i+1}/${game.qs.length}`;
}
function answerDigit(btn,sel,cor){
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
    sayThenPraise(numWord(cor,profile),vCode(profile),()=>{game.i++;closeFeedback();nextDigit();});   // number first, pause, then praise
  } else {
    btn.classList.add('wrong','dim');state[profile].streak=0;game.wrong++;save();
    try{speakSeq([{t:numWord(sel,profile),lang:vCode(profile)},{t:retryWord(profile),lang:vCode(profile)}]);}catch(e){}
  }
}

/* ═══════════════════════════════════════════════════════════
   #1 GEORGIAN READING (V1) — syllable → word blending.
   The biggest gap + Georgian-first differentiator: today ka has only the
   alphabet. Here the child taps each syllable (hears it), then blends the
   whole word. Recorded ka clips per syllable + word — never robot TTS.
   ═══════════════════════════════════════════════════════════ */
function readSay(t){speak(t,'ka-GE',{rate:isYoung(profile)?0.58:0.7});}
function readBlend(it){ // sound out each syllable, then say the whole word
  speakSeq(it.syl.map(s=>({t:s,lang:'ka-GE',rate:0.62})).concat([{t:it.w,lang:'ka-GE',rate:0.68}]));
}
function readLearn(idx){
  const data=READING_KA,n=data.length;
  idx=Math.max(0,Math.min(idx,n-1));
  const it=data[idx],last=idx>=n-1,first=idx<=0;
  game.readIt=it;
  const chips=it.syl.map(s=>`<button class="syl" onclick="readSay('${s}');pulseTap(this)">${s}</button>`).join('<span class="syl-plus">+</span>');
  render(`<div class="screen">
    ${topbar('📖 კითხვა',`ისწავლე · ${idx+1}/${n}`,"openMenu('ka-alpha')")}
    <div class="read-stage">
      <div class="read-emoji">${it.e}</div>
      <div class="read-word">${chips}</div>
      <button class="speakbtn big" onclick="readBlend(game.readIt);pulseTap(this)">${I.speaker} წაიკითხე</button>
    </div>
    <div class="alpha-nav">
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="readLearn(${idx-1})">←</button>
      <div class="alpha-dots">${idx+1} / ${n}</div>
      ${last
        ? `<button class="abtn go" onclick="startReadQuiz()">ტესტები 🎯</button>`
        : `<button class="abtn" onclick="readLearn(${idx+1})">→</button>`}
    </div>
  </div>`,false);
  setTimeout(()=>readBlend(it),260);
}
function startReadQuiz(){
  game.mode='read';game.subj='ka-alpha';game.i=0;game.shields=0;game.wrong=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=shuffle(READING_KA).slice(0,8);
  nextRead();
}
function nextRead(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];
  const opts=new Set([q.w]);while(opts.size<4)opts.add(READING_KA[ri(0,READING_KA.length-1)].w);
  readSay(q.w);   // hear the word, then find it written
  const area=`<div class="prompt">
      <div class="count-q">რომელია?</div>
      <div class="p-emoji" style="font-size:3.4rem">${q.e}</div>
      <button class="speakbtn pulse-tap" onclick="readSay('${q.w}');pulseTap(this)">${I.speaker} მოისმინე</button>
      <div class="finger-hint">👆 აირჩიე სიტყვა</div>
    </div>
    <div class="options">${shuffle([...opts]).map(w=>`<button class="opt" style="font-size:1.18rem" onclick="answerRead(this,'${w}','${q.w}')">${w}</button>`).join('')}</div>`;
  gameShell(area);
  const c=$('#gcount');if(c)c.textContent=`${game.i+1}/${game.qs.length}`;
}
function answerRead(btn,sel,cor){
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
    sayThenPraise(cor,'ka-GE',()=>{game.i++;closeFeedback();nextRead();});
  } else {
    btn.classList.add('wrong','dim');state[profile].streak=0;game.wrong++;save();
    try{speakSeq([{t:sel,lang:'ka-GE'},{t:'კიდევ სცადე.',lang:'ka-GE'}]);}catch(e){}
  }
}

/* ═══════════════════════════════════════════════════════════
   #1 next step — GEORGIAN SENTENCE READING. Read a short sentence,
   hear it (recorded EkaNeural clip, never robot TTS), then pick the
   matching picture (comprehension). Source: READING_SENT_KA.
   ═══════════════════════════════════════════════════════════ */
function sentSay(s){speak(s,'ka-GE');}   // recorded clip via AUDIO_MANIFEST
function sentLearn(idx){
  const data=READING_SENT_KA,n=data.length;
  idx=Math.max(0,Math.min(idx,n-1));
  const it=data[idx],last=idx>=n-1,first=idx<=0;
  game.sentIt=it;
  render(`<div class="screen">
    ${topbar('📝 წინადადება',`ისწავლე · ${idx+1}/${n}`,"openMenu('ka-alpha')")}
    <div class="read-stage">
      <div class="read-emoji">${it.e}</div>
      <div class="read-sent">${it.s}</div>
      <button class="speakbtn big" onclick="sentSay('${it.s}');pulseTap(this)">${I.speaker} წაიკითხე</button>
    </div>
    <div class="alpha-nav">
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="sentLearn(${idx-1})">←</button>
      <div class="alpha-dots">${idx+1} / ${n}</div>
      ${last
        ? `<button class="abtn go" onclick="startSentQuiz()">ტესტები 🎯</button>`
        : `<button class="abtn" onclick="sentLearn(${idx+1})">→</button>`}
    </div>
  </div>`,false);
  setTimeout(()=>sentSay(it.s),260);
}
function startSentQuiz(){
  game.mode='sent';game.subj='ka-alpha';game.i=0;game.shields=0;game.wrong=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=shuffle(READING_SENT_KA).slice(0,Math.min(8,READING_SENT_KA.length));
  nextSent();
}
function nextSent(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;
  const opts=new Set([q.e]);while(opts.size<4)opts.add(READING_SENT_KA[ri(0,READING_SENT_KA.length-1)].e);
  sentSay(q.s);   // hear/read the sentence, then pick the matching picture
  const area=`<div class="prompt">
      <div class="read-sent" style="font-size:1.5rem">${q.s}</div>
      <button class="speakbtn pulse-tap" onclick="sentSay('${q.s}');pulseTap(this)">${I.speaker} მოისმინე</button>
      <div class="finger-hint">👆 აირჩიე სურათი</div>
    </div>
    <div class="options">${shuffle([...opts]).map(e=>`<button class="opt emoji" onclick="answerSent(this,'${e}','${q.e}')">${e}</button>`).join('')}</div>`;
  gameShell(area);
  const c=$('#gcount');if(c)c.textContent=`${game.i+1}/${game.qs.length}`;
}
function answerSent(btn,sel,cor){
  if(sel===cor){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
    sayThenPraise((game.cur&&game.cur.s)||'','ka-GE',()=>{game.i++;closeFeedback();nextSent();});   // re-read sentence, pause, praise
  } else {
    btn.classList.add('wrong','dim');state[profile].streak=0;game.wrong++;save();
    try{speak('კიდევ სცადე.','ka-GE');}catch(e){}
  }
}

/* ═══════════════════════════════════════════════════════════
   #2 — INTERACTIVE SYLLABLE BUILDER ("our მარცვლობანა"). The child
   ASSEMBLES the word from shuffled syllable chips (active, not pick-one).
   Each tap plays that syllable's recorded clip; correct = whole word + praise.
   ═══════════════════════════════════════════════════════════ */
function startBuild(){
  game.mode='build';game.subj='ka-alpha';game.i=0;game.shields=0;game.wrong=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=shuffle(READING_KA).slice(0,Math.min(8,READING_KA.length));
  nextBuild();
}
function nextBuild(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;game.built=[];
  game.chips=shuffle(q.syl.map((s,idx)=>({s,id:idx,used:false})));
  speak(q.w,'ka-GE');   // hear the target word once
  renderBuild();
  const c=$('#gcount');if(c)c.textContent=`${game.i+1}/${game.qs.length}`;
}
function renderBuild(){
  const q=game.cur;
  const slots=q.syl.map((_,i)=>{const v=game.built[i];return `<span class="syl-slot ${v!=null?'filled':''}" onclick="buildUndo(${i})">${v!=null?v:''}</span>`;}).join('<span class="syl-plus">+</span>');
  const chips=game.chips.map(c=>`<button class="syl ${c.used?'used':''}" ${c.used?'disabled':''} onclick="buildTap(${c.id})">${c.s}</button>`).join('');
  gameShell(`<div class="prompt">
      <div class="p-emoji" style="font-size:4.2rem">${q.e}</div>
      <button class="speakbtn pulse-tap" onclick="speak('${q.w}','ka-GE');pulseTap(this)">${I.speaker} მოისმინე</button>
      <div class="finger-hint">👆 ააწყვე სიტყვა მარცვლებით</div>
    </div>
    <div class="syl-slots">${slots}</div>
    <div class="finger-hint sylhint">👇 აიღე მარცვალი და ჩასვი</div>
    <div class="syl-bank">${chips}</div>`);
  const c=$('#gcount');if(c)c.textContent=`${game.i+1}/${game.qs.length}`;
}
function buildTap(id){
  if(game.built.length>=game.cur.syl.length)return;
  const chip=game.chips.find(c=>c.id===id); if(!chip||chip.used)return;
  chip.used=true; game.built.push(chip.s); readSay(chip.s);   // play the syllable clip
  renderBuild();
  if(game.built.length===game.cur.syl.length) checkBuild();
}
function buildUndo(i){
  if(game.built[i]==null)return;
  const s=game.built[i]; game.built.splice(i,1);
  const chip=game.chips.find(c=>c.used&&c.s===s); if(chip)chip.used=false;
  renderBuild();
}
function checkBuild(){
  const ok=game.built.join('')===game.cur.w;
  if(ok){
    document.querySelectorAll('.syl-slot').forEach(b=>b.classList.add('correct'));
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
    sayThenPraise(game.cur.w,'ka-GE',()=>{game.i++;closeFeedback();nextBuild();});
  } else {
    document.querySelectorAll('.syl-slot').forEach(b=>b.classList.add('wrong'));
    state[profile].streak=0;game.wrong++;save();
    try{speak('კიდევ სცადე.','ka-GE');}catch(e){}
    setTimeout(()=>{ game.built=[]; game.chips.forEach(c=>c.used=false); renderBuild(); },950);
  }
}

/* ═══════════════════════════════════════════════════════════
   ✍️ ამოწერა (WRITING/TRACING). High-quality FiraGO guide letter +
   stroke-order ANIMATION (the guide draws each stroke 1→2→3 in the right
   direction, numbered) so the child sees HOW to write it, then traces with
   the finger. Letters with stroke data animate; others fall back to free trace.
   Stroke paths (SVG d, writing direction) over a 0..100 box; pilot: ა ბ გ დ.
   ═══════════════════════════════════════════════════════════ */
// stroke centerlines (writing order/direction) per letter — drive the virtual-pen draw over the
// faint high-quality font letter. Rough is OK: the font is the visual, the pen shows how to write.
const KA_STROKES = {
  'ა':['M46,60 C36,58 36,71 45,71 C52,71 52,61 47,60','M56,30 C61,28 59,40 57,49 C55,61 54,70 63,75'],
  'ბ':['M52,30 C45,27 47,36 53,36 C58,35 56,45 54,52 L54,58','M54,58 C68,58 68,78 53,79','M53,79 C40,78 41,59 54,58'],
  'გ':['M46,33 C53,28 59,35 54,43 L54,58','M54,58 C68,58 68,78 53,79','M53,79 C40,78 41,59 54,58'],
  'დ':['M50,52 L66,79','M45,43 C40,30 53,28 52,43 C52,49 46,50 44,46','M55,43 C55,29 66,30 62,45 C61,50 56,50 54,46'],
};
function traceLearn(idx){
  const data=KA_ALPHA,n=data.length;
  idx=Math.max(0,Math.min(idx,n-1));
  const entry=data[idx]; const it=alphaItem(entry); game.traceIt={it,idx};
  const last=idx>=n-1,first=idx<=0;
  const sd=KA_STROKES[entry.l];
  // mask-reveal: the REAL font letter fills in as the pen sweeps along it (shape always matches)
  const guide = sd ? `<svg id="sgsvg" class="stroke-guide" viewBox="0 0 100 100"><defs><mask id="penmask"><rect width="100" height="100" fill="black"/>${sd.map(d=>`<path class="rev" d="${d}" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</mask></defs><text class="penletter" x="50" y="73" text-anchor="middle" mask="url(#penmask)">${entry.l}</text><text class="sg-pen" style="opacity:0" font-size="11">✏️</text></svg>` : '';
  render(`<div class="screen">
    ${topbar('✍️ ამოწერა',`ასო ${idx+1}/${n}`,"openMenu('ka-alpha')")}
    <div class="trace-stage">
      ${sd?'':`<div class="trace-letter">${entry.l}</div>`}
      ${guide}
      <canvas id="tracecv" class="trace-canvas"></canvas>
    </div>
    <div class="trace-tools">
      ${sd?`<button class="btn btn-sky" onclick="watchStrokes()">👀 უყურე</button>`:''}
      <button class="btn btn-ghost" onclick="traceClear()">🧽 თავიდან</button>
      <button class="speakbtn" onclick="alphaSay('ka-alpha',game.traceIt.it);pulseTap(this)">${I.speaker} მოისმინე</button>
    </div>
    <div class="finger-hint" style="margin-top:6px">👆 ამოწერე ასო თითით</div>
    <div class="alpha-nav">
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="traceLearn(${idx-1})">←</button>
      <div class="alpha-dots">${idx+1} / ${n}</div>
      ${last?`<button class="abtn go" onclick="openMenu('ka-alpha')">დასასრული ✓</button>`:`<button class="abtn" onclick="traceLearn(${idx+1})">→</button>`}
    </div>
  </div>`,false);
  setTimeout(()=>{ traceSetup(); if(sd) watchStrokes(); alphaSay('ka-alpha',it); },220);
}
// virtual pen sweeps along each stroke and REVEALS (fills in) the real font letter, in order.
function watchStrokes(){
  const svg=document.getElementById('sgsvg'); if(!svg)return;
  const letter=svg.querySelector('.penletter'); if(letter)letter.setAttribute('mask','url(#penmask)');
  const paths=[...svg.querySelectorAll('.rev')], pen=svg.querySelector('.sg-pen');
  paths.forEach(p=>{const L=p.getTotalLength(); p.style.transition='none'; p.style.strokeDasharray=L; p.style.strokeDashoffset=L;});
  let i=0;
  function stroke(){
    if(i>=paths.length){ if(pen)pen.style.opacity='0'; if(letter)setTimeout(()=>letter.removeAttribute('mask'),200); return; }
    const p=paths[i], L=p.getTotalLength(), dur=1100; let st=null;
    if(pen)pen.style.opacity='1';
    function frame(ts){
      if(st==null)st=ts; const t=Math.min(1,(ts-st)/dur);
      p.style.strokeDashoffset=L*(1-t);
      if(pen){const pt=p.getPointAtLength(t*L); pen.setAttribute('x',pt.x-1); pen.setAttribute('y',pt.y+4);}
      if(t<1) requestAnimationFrame(frame); else { i++; setTimeout(stroke,260); }
    }
    requestAnimationFrame(frame);
  }
  stroke();
}
function traceSetup(){
  const cv=document.getElementById('tracecv'); if(!cv)return;
  const r=cv.getBoundingClientRect();
  cv.width=Math.round(r.width); cv.height=Math.round(r.height);
  const ctx=cv.getContext('2d'); ctx.lineCap='round'; ctx.lineJoin='round'; ctx.lineWidth=13; ctx.strokeStyle='#00A651';
  let drawing=false,last=null;
  const pos=e=>{const b=cv.getBoundingClientRect();return {x:e.clientX-b.left,y:e.clientY-b.top};};
  const start=e=>{drawing=true;last=pos(e);try{cv.setPointerCapture(e.pointerId);}catch(_){}; e.preventDefault();};
  const move=e=>{if(!drawing)return;const p=pos(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;e.preventDefault();};
  const end=()=>{drawing=false;};
  cv.addEventListener('pointerdown',start); cv.addEventListener('pointermove',move);
  cv.addEventListener('pointerup',end); cv.addEventListener('pointerleave',end);
  game._traceClear=()=>ctx.clearRect(0,0,cv.width,cv.height);
}
function traceClear(){ if(game._traceClear) game._traceClear(); }
