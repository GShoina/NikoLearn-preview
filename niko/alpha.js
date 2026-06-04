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
        <div class="alpha-pic">${it.e}</div>
        <div class="alpha-word">${it.w}</div>
        <button class="speakbtn big" onclick="event.stopPropagation();alphaSay('${subj}',game.alphaIt);pulseTap(this)">${I.speaker} მისმინე</button>
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
      <button class="speakbtn pulse-tap" onclick="alphaSay('${subj}',game.qs[${game.i}]);pulseTap(this)">${I.speaker} მისმინე</button>
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
