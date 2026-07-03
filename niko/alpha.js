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
        <div class="alpha-word">${alphaIsKa(subj)
          ? `${it.l}: <b class="lead">${it.w.slice(0,it.l.length)}</b>${it.w.slice(it.l.length)}`
          : `<b class="lead">${it.l}</b> is for ${it.w.charAt(0).toUpperCase()+it.w.slice(1)}`}</div>
        <button class="speakbtn big" onclick="event.stopPropagation();alphaSay('${subj}',game.alphaIt);pulseTap(this)">${I.speaker} მოისმინე</button>
      </div>
    </div>
    <div class="alpha-nav">
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="alphaLearn('${subj}',${idx-1})">&lt;</button>
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
    // Wire the alphabet quiz into the shared owl tutor. It was SILENT on wrong answers (only a passive
    // help-nudge, no teaching) — the red-team's confirmed gap. Now it behaves like every other mode:
    // 1st miss = owl hint, 2nd miss = teachAndConfirm (encourage → the alpha lesson from Tutor.build →
    // reveal the correct letter + „გაიგე?" gate). cor = the letter; lang=null marks the correct option
    // WITHOUT unreliable Georgian TTS (the word was already voiced via alphaSay); nextAlpha advances/re-queues.
    btn.classList.add('wrong');state[profile].streak=0;game.wrong++;alphaRec(false);save();
    reQueueWrong(cor,null,nextAlpha);
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
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="digitLearn(${idx-1})">&lt;</button>
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
    reQueueWrong(cor,null,nextDigit); // red-team 07-03: digits were SILENT on wrong (only spoke the wrong number). Now owl hint (1st miss) → teach + „გაიგე?" gate (2nd), like answerCount/answerAlpha.
  }
}

/* ═══════════════════════════════════════════════════════════
   #1 GEORGIAN READING (V1) — syllable → word blending.
   The biggest gap + Georgian-first differentiator: today ka has only the
   alphabet. Here the child taps each syllable (hears it), then blends the
   whole word. Recorded ka clips per syllable + word — never robot TTS.
   ═══════════════════════════════════════════════════════════ */
function readSay(t){ if(window.playClip && playClip(t)) return; speak(t,'ka-GE',{rate:isYoung(profile)?0.58:0.7}); }
// record a Georgian-path milestone as completed (read / build / trace) so the subject Path can progress.
function markAlphaDone(k){ const s=state[profile]; if(s){ s[k]=s[k]||{}; s[k].done=true; save(); } }
let _blendGen=0;
function readBlend(it){ // sound out each syllable (HIGHLIGHTING the chip as it sounds), then blend the whole word
  if(!it||!it.syl)return;
  const gen=++_blendGen;                                   // newest blend supersedes any in-flight one (rapid taps)
  const chips=[...document.querySelectorAll('.read-word .syl')];
  const word=document.querySelector('.read-word');
  const clear=()=>{chips.forEach(c=>c.classList.remove('saying'));if(word)word.classList.remove('blending');};
  clear();
  let i=0;
  const step=()=>{
    if(gen!==_blendGen)return;                             // a newer blend started: stop this chain
    chips.forEach(c=>c.classList.remove('saying'));
    if(i>=it.syl.length)return blendWhole();
    const ch=chips[i];if(ch)ch.classList.add('saying');    // light THIS syllable while it sounds
    if(window.playClipThen)playClipThen(it.syl[i],()=>{i++;step();},0.82); // slower = clearer sounding-out
    else{i++;setTimeout(()=>{if(gen===_blendGen)step();},420);}
  };
  const blendWhole=()=>{
    if(gen!==_blendGen)return;
    chips.forEach(c=>c.classList.remove('saying'));
    if(word)word.classList.add('blending');                // light the WHOLE word: syllables → word
    const fin=()=>{if(gen===_blendGen)setTimeout(()=>{if(gen===_blendGen)clear();},450);};
    if(window.playClipThen)playClipThen(it.w,fin,0.96);
    else fin();
  };
  step();
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
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="readLearn(${idx-1})">&lt;</button>
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
  if(game.i>=game.qs.length){markAlphaDone('read');return results();}
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
    reQueueWrong(cor,null,nextRead); // red-team 07-03: Georgian reading was SILENT on wrong. Now owl teaches (1st hint → 2nd teach + gate).
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
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="sentLearn(${idx-1})">&lt;</button>
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
  if(game.i>=game.qs.length){markAlphaDone('read');return results();}
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
    reQueueWrong(cor,null,nextSent); // red-team 07-03: sentence-reading was SILENT on wrong. Now owl teaches (1st hint → 2nd teach + gate).
  }
}

/* ═══════════════════════════════════════════════════════════
   #1 top rung — READING COMPREHENSION (გაგება). A 2-3 sentence mini-text
   the CHILD reads themselves (the skill), then a comprehension question.
   No audio: reading is the point. Gemini KA-QA'd 2026-06-18 (all KEEP).
   ═══════════════════════════════════════════════════════════ */
const READING_TEXT_KA=[
  {e:'🐱', t:'პატარა კატა ეზოში თამაშობდა. მან წითელი ბურთი ნახა და გაუხარდა.', q:'რა ფერი იყო ბურთი?', a:'წითელი', opts:['ლურჯი','მწვანე','ყვითელი']},
  {e:'🐦', t:'ჩიტმა ხეზე ბუდე ააშენა. ბუდეში სამი კვერცხი იდო.', q:'სად ააშენა ჩიტმა ბუდე?', a:'ხეზე', opts:['სახლზე','მიწაზე','წყალში']},
  {e:'🌧️', t:'დილით წვიმდა. ნიკომ ქოლგა აიღო და სკოლაში წავიდა.', q:'რა აიღო ნიკომ?', a:'ქოლგა', opts:['ჩანთა','წიგნი','ბურთი']},
  {e:'🐶', t:'მაშოს ძაღლი ჰყავს. ძაღლს ბარბი ჰქვია და ბურთით თამაში უყვარს.', q:'რა ჰქვია ძაღლს?', a:'ბარბი', opts:['რექსი','ჯეკი','ლუნა']},
  {e:'⛄', t:'ზამთარში თოვს. ლუკამ თოვლის ბაბუა გააკეთა და ქუდი დაახურა.', q:'რა გააკეთა ლუკამ?', a:'თოვლის ბაბუა', opts:['სახლი','ბურთი','ნავი']}
];
function startTextQuiz(){
  game.mode='rtext';game.subj='ka-alpha';game.i=0;game.shields=0;game.wrong=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=shuffle(READING_TEXT_KA).slice(0,Math.min(8,READING_TEXT_KA.length));
  nextText();
}
function nextText(){
  if(game.i>=game.qs.length){markAlphaDone('read');return results();}
  const q=game.qs[game.i];game.cur=q;
  const esc=s=>String(s).replace(/'/g,"\\'");
  const opts=shuffle([q.a].concat(q.opts).slice(0,4));
  const area=`<div class="prompt">
      <div class="p-emoji" style="font-size:2.8rem">${q.e}</div>
      <div class="read-sent" style="font-size:1.16rem;line-height:1.5">${q.t}</div>
      <div class="count-q" style="margin-top:8px">${q.q}</div>
      <div class="finger-hint">👆 წაიკითხე და აირჩიე პასუხი</div>
    </div>
    <div class="options">${opts.map(o=>`<button class="opt" style="font-size:1.05rem" onclick="answerText(this,'${esc(o)}','${esc(q.a)}')">${o}</button>`).join('')}</div>`;
  gameShell(area);
  const c=$('#gcount');if(c)c.textContent=`${game.i+1}/${game.qs.length}`;
}
function answerText(btn,sel,cor){
  if(String(sel)===String(cor)){
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));btn.classList.remove('dim');btn.classList.add('correct');
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);
    save();try{praise();feedback(true);}catch(e){}
    setTimeout(()=>{game.i++;closeFeedback();nextText();},1000);
  } else {
    // v1.201: no free guess-through — dim all, reveal the correct answer, re-queue, then advance.
    document.querySelectorAll('.opt').forEach(b=>b.classList.add('dim'));
    btn.classList.add('wrong');
    const r=[...document.querySelectorAll('.opt')].find(b=>b.textContent===String(cor));
    if(r){r.classList.remove('dim');r.classList.add('correct');}
    state[profile].streak=0;game.wrong++;
    game.requeues=game.requeues||0; if(game.requeues<6){game.qs.push(game.cur);game.requeues++;}
    save();
    setTimeout(()=>{game.i++;closeFeedback();nextText();},1300);
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
  if(game.i>=game.qs.length){markAlphaDone('build');return results();}
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
  if(window.preloadClips) preloadClips(game.chips.map(c=>c.s).concat([q.w]));   // instant taps, no load lag
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
   🔤 შეადგინე სიტყვა (SPELL FROM LETTERS). Pre-reader spelling with NO
   keyboard: the child taps shuffled LETTER tiles to build the pictured
   word, one letter per slot. Works for both alphabets (ka & en) off the
   alphabet example words. ka: silent letter taps (never robot a bare
   Georgian letter through TTS); en: each tap says the letter. The whole
   word is voiced at the start and on success only. Reuses the build
   mode's .syl-slot / .syl-bank visuals.
   ═══════════════════════════════════════════════════════════ */
function sheadWords(subj){
  const out=[];
  alphaData(subj).forEach(e=>e.x.forEach(p=>{
    const w=p[0]; if(/[\s-]/.test(w))return;        // skip multi-token (ice cream, x-ray, yo-yo)
    const n=[...w].length; if(n<3||n>6)return;      // short, pre-reader friendly
    out.push({w:w,e:p[1]});
  }));
  return out;
}
function startShead(subj){
  game.mode='shead';game.subj=subj;game.i=0;game.shields=0;game.wrong=0;
  game.start=Date.now();game.preLvl=levelIdx(profile);
  game.qs=shuffle(sheadWords(subj)).slice(0,8);
  nextShead();
}
function sheadDisp(s){ return alphaIsKa(game.subj)?s:s.toUpperCase(); }            // en tiles in CAPS (kids learn caps first)
function sheadSayWord(w){ speak(w, alphaIsKa(game.subj)?'ka-GE':'en-US', {rate:isYoung(profile)?0.66:0.8}); }
function nextShead(){
  if(game.i>=game.qs.length)return results();
  const q=game.qs[game.i];game.cur=q;game.built=[];
  game.chips=shuffle([...q.w].map((s,idx)=>({s,id:idx,used:false})));
  sheadSayWord(q.w);                                 // hear the target word once
  renderShead();
}
function renderShead(){
  const q=game.cur;
  const slots=[...q.w].map((_,i)=>{const v=game.built[i];return `<span class="syl-slot ${v!=null?'filled':''}" onclick="sheadUndo(${i})">${v!=null?sheadDisp(v):''}</span>`;}).join('');
  const chips=game.chips.map(c=>`<button class="syl ${c.used?'used':''}" ${c.used?'disabled':''} onclick="sheadTap(${c.id})">${sheadDisp(c.s)}</button>`).join('');
  gameShell(`<div class="prompt">
      <div class="p-emoji" style="font-size:4.2rem">${q.e}</div>
      <button class="speakbtn pulse-tap" onclick="sheadSayWord('${q.w}');pulseTap(this)">${I.speaker} მოისმინე</button>
      <div class="finger-hint">👆 ააწყვე სიტყვა ასოებით</div>
    </div>
    <div class="syl-slots">${slots}</div>
    <div class="finger-hint sylhint">👇 აიღე ასო და ჩასვი</div>
    <div class="syl-bank">${chips}</div>`);
  const c=$('#gcount');if(c)c.textContent=`${game.i+1}/${game.qs.length}`;
}
function sheadTap(id){
  const len=[...game.cur.w].length;
  if(game.built.length>=len)return;
  const chip=game.chips.find(c=>c.id===id); if(!chip||chip.used)return;
  chip.used=true; game.built.push(chip.s);
  if(!alphaIsKa(game.subj)){ try{speak(chip.s,'en-US',{rate:0.8});}catch(e){} }   // en: say the letter; ka stays silent (no robot bare letter)
  renderShead();
  if(game.built.length===len) checkShead();
}
function sheadUndo(i){
  if(game.built[i]==null)return;
  const s=game.built[i]; game.built.splice(i,1);
  const chip=game.chips.find(c=>c.used&&c.s===s); if(chip)chip.used=false;
  renderShead();
}
function checkShead(){
  const isKa=alphaIsKa(game.subj);
  if(game.built.join('')===game.cur.w){
    document.querySelectorAll('.syl-slot').forEach(b=>b.classList.add('correct'));
    const s=state[profile];s.shields++;game.shields++;s.streak++;s.maxStreak=Math.max(s.maxStreak,s.streak);save();
    sayThenPraise(game.cur.w, isKa?'ka-GE':'en-US',()=>{game.i++;closeFeedback();nextShead();});
  } else {
    document.querySelectorAll('.syl-slot').forEach(b=>b.classList.add('wrong'));
    state[profile].streak=0;game.wrong++;save();
    try{speak(isKa?'კიდევ სცადე.':'Try again', isKa?'ka-GE':'en-US');}catch(e){}
    setTimeout(()=>{ game.built=[]; game.chips.forEach(c=>c.used=false); renderShead(); },950);
  }
}

/* ═══════════════════════════════════════════════════════════
   ✍️ ამოწერა (WRITING/TRACING). High-quality FiraGO guide letter +
   stroke-order ANIMATION (the guide draws each stroke 1→2→3 in the right
   direction, numbered) so the child sees HOW to write it, then traces with
   the finger. Letters with stroke data animate; others fall back to free trace.
   Stroke paths (SVG d, writing direction) over a 0..100 box; pilot: ა ბ გ დ.
   ═══════════════════════════════════════════════════════════ */
// ✍️ ამოწერა — the letter draws itself AUTOMATICALLY from the font (opentype.js): every letter
// matches its real shape with no hand-authored paths. The pen traces the glyph, then it fills in.
let _kaFont=null, _kaRetry=0, _otLoading=false;
function loadKaFont(){ try{ if(window.opentype && !_kaFont) opentype.load('niko/fonts/ka.ttf',(e,f)=>{ if(!e) _kaFont=f; }); }catch(_){} }
// lazy-load opentype.js (~170KB) only when the ✍️ tracing screen is first opened — every other
// screen boots without paying for it. Served from the SW cache, so it's instant + offline-safe.
function ensureOpentype(){
  if(window.opentype){ loadKaFont(); return; }
  if(_otLoading) return;
  _otLoading=true;
  const s=document.createElement('script'); s.src='niko/opentype.min.js';
  s.onload=()=>loadKaFont();
  s.onerror=()=>{ _otLoading=false; };
  document.head.appendChild(s);
}
function glyphPathD(ch){
  if(!_kaFont) return null;
  // raw glyph outline; fitGuide() sets the SVG viewBox to this path's real bbox so it always
  // fits + centers regardless of the font's own metrics (opentype's bbox math under-reads on BPG).
  try{ return _kaFont.getPath(ch,0,0,100).toPathData(2); }catch(_){ return null; }
}
// fit the rendered glyph into the square stage with even padding, via the real DOM bbox
function fitGuide(){
  const svg=document.getElementById('sgsvg'), gd=document.getElementById('gd'); if(!svg||!gd) return;
  let b; try{ b=gd.getBBox(); }catch(_){ return; }
  if(!b||!b.width||!b.height) return;
  const pad=Math.max(b.width,b.height)*0.16;
  svg.setAttribute('viewBox', `${(b.x-pad).toFixed(2)} ${(b.y-pad).toFixed(2)} ${(b.width+pad*2).toFixed(2)} ${(b.height+pad*2).toFixed(2)}`);
}
function traceLearn(idx){
  ensureOpentype();   // first open: pull opentype.js; the retry loop below re-renders once the font parses
  const data=KA_ALPHA,n=data.length;
  idx=Math.max(0,Math.min(idx,n-1));
  const entry=data[idx]; const it=alphaItem(entry); game.traceIt={it,idx};
  const last=idx>=n-1,first=idx<=0;
  const d=glyphPathD(entry.l);   // null only if the font is not parsed yet
  const guide = d ? `<svg id="sgsvg" class="stroke-guide" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"><path id="gd" class="gd" d="${d}"/><text class="sg-pen" style="opacity:0" font-size="13">✏️</text></svg>` : '';
  render(`<div class="screen">
    ${topbar('✍️ ამოწერა',`ასო ${idx+1}/${n}`,"openMenu('ka-alpha')")}
    <div class="trace-stage">
      ${d?'':`<div class="trace-letter">${entry.l}</div>`}
      ${guide}
      <canvas id="tracecv" class="trace-canvas"></canvas>
    </div>
    <div class="trace-tools">
      ${d?`<button class="btn btn-sky" onclick="watchStrokes()">👀 უყურე</button>`:''}
      <button class="btn btn-ghost" onclick="traceClear()">🧽 თავიდან</button>
      <button class="speakbtn" onclick="alphaSay('ka-alpha',game.traceIt.it);pulseTap(this)">${I.speaker} მოისმინე</button>
    </div>
    <div class="finger-hint" style="margin-top:6px">👆 ამოწერე ასო თითით</div>
    <div class="alpha-nav">
      <button class="abtn ${first?'off':''}" ${first?'disabled':''} onclick="traceLearn(${idx-1})">&lt;</button>
      <div class="alpha-dots">${idx+1} / ${n}</div>
      ${last?`<button class="abtn go" onclick="markAlphaDone('trace');openMenu('ka-alpha')">დასასრული ✓</button>`:`<button class="abtn" onclick="traceLearn(${idx+1})">→</button>`}
    </div>
  </div>`,false);
  setTimeout(()=>{ traceSetup();
    if(d){ _kaRetry=0; fitGuide(); watchStrokes(); }
    else if(!_kaFont && _kaRetry<10){ _kaRetry++; setTimeout(()=>{ if(game.traceIt&&game.traceIt.idx===idx) traceLearn(idx); },350); } // font still loading: retry shortly
    alphaSay('ka-alpha',it);
  },220);
}
// split a path 'd' into its separate contours (each starts at a Move command), so multi-part letters
// are drawn part-by-part (closer to how a letter is written) instead of one perimeter sweep.
function _splitContours(d){ return (d.match(/[Mm][^Mm]*/g)||[d]).map(s=>s.trim()).filter(Boolean); }
// the pen draws the letter contour-by-contour, slowly, with a clear pen, then the letter fills in.
// (parent 2026-06-28: the old single static outline read as "not moving"; this makes the writing
//  motion obvious. NOTE: this follows the FONT outline, not true human stroke-order — see #9.)
function watchStrokes(){
  const svg=document.getElementById('sgsvg'); if(!svg)return;
  const full=svg.querySelector('#gd'), pen=svg.querySelector('.sg-pen'); if(!full)return;
  const d=full.getAttribute('d')||''; if(!d) return;
  const contours=_splitContours(d);
  full.style.transition='none'; full.style.fillOpacity='0';
  svg.querySelectorAll('.sg-stroke').forEach(n=>n.remove());
  const NS='http://www.w3.org/2000/svg';
  const layers=contours.map(cd=>{ const p=document.createElementNS(NS,'path'); p.setAttribute('d',cd); p.setAttribute('class','sg-stroke'); svg.insertBefore(p,pen||null); return p; });
  if(pen)pen.style.opacity='1';
  let ci=0;
  const animContour=()=>{
    if(ci>=layers.length){ if(pen)pen.style.opacity='0'; layers.forEach(l=>l.remove()); full.style.transition='fill-opacity .5s ease'; full.style.fillOpacity='1'; return; }
    const p=layers[ci]; let L; try{L=p.getTotalLength();}catch(_){L=0;}
    const dur=Math.max(1100,Math.min(2600,L*10)); let st=null;
    p.style.transition='none'; p.style.strokeDasharray=L; p.style.strokeDashoffset=L; p.getBoundingClientRect();
    const frame=ts=>{ if(st==null)st=ts; const t=Math.min(1,(ts-st)/dur); p.style.strokeDashoffset=L*(1-t);
      if(pen){ try{const pt=p.getPointAtLength(t*L); pen.setAttribute('x',pt.x-1); pen.setAttribute('y',pt.y+4);}catch(_){} }
      if(t<1) requestAnimationFrame(frame); else { ci++; setTimeout(animContour,300); } };
    requestAnimationFrame(frame);
  };
  animContour();
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
