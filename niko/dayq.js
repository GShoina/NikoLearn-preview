/* ═══════════════════════════════════════════════════════════
   NIKO LEARN — "დღის კითხვა" / Daily curious question  (W7 v3, 2026-07-22)
   One curiosity question per day (rotated deterministically by date). Each
   question has its own quiet MOVING scene that reinforces the answer
   (kid-visual-standard §7 "motion only as a helper", owner-approved v3
   2026-07-22, favourite = "რატომ არ ვარდება მთვარე?"). Tap "მიპასუხე, ბუბუ!"
   to reveal a warm, simple explanation + one English word as a reward.

   Content = ORIGINAL NikoLearn IP (§11), authored for W7. No runtime Georgian
   TTS: the answer is parent/child-read text (same policy as talk.js); the
   English word is a silent visual pairing (avoids the open PI-104 voice gate).
   Self-contained: own `dq` state, reuses render()/goHome(). Chrome bilingual.
   The 6 nav dots let a curious child browse the other days; the DAY default is
   today's rotated question. Scenes + text are copied verbatim from the approved
   v3 mockup (output/2026-07-20-დღის კითხვა 6 ვერსია v3 by Niko.html).
   ═══════════════════════════════════════════════════════════ */

let dq = null; // { i:int }

/* the 6 approved bespoke scenes (each animation reinforces the answer, never decoration) */
const DAYQ_SV = {
  duck:'<svg viewBox="0 0 240 150" role="img" aria-label="იხვი ყინულზე ცივ წყალში"><rect width="240" height="150" rx="14" fill="#DFF1FB"/><circle cx="34" cy="30" r="14" fill="#FFE9A8"/><circle cx="34" cy="30" r="9" fill="#FFD166"/><circle cx="80" cy="22" r="2.5" fill="#fff" class="twinkle"/><circle cx="196" cy="34" r="3" fill="#fff" class="twinkle" style="animation-delay:.6s"/><circle cx="150" cy="18" r="2" fill="#fff" class="twinkle" style="animation-delay:1s"/><circle cx="216" cy="70" r="2.5" fill="#fff" class="twinkle" style="animation-delay:1.4s"/><rect x="0" y="100" width="240" height="50" rx="14" fill="#5FA8D3"/><ellipse cx="42" cy="112" rx="20" ry="4" fill="#A8D8EA" opacity=".7" class="shimmer"/><ellipse cx="206" cy="122" rx="24" ry="4" fill="#A8D8EA" opacity=".7" class="shimmer" style="animation-delay:1.2s"/><ellipse cx="120" cy="112" rx="54" ry="15" fill="#F4FAFF"/><ellipse cx="120" cy="108" rx="54" ry="13" fill="#fff"/><path d="M96 103 L104 103 L100 110 Z" fill="#F59B4C"/><path d="M128 103 L136 103 L132 110 Z" fill="#F59B4C"/><rect x="98" y="96" width="4" height="9" rx="2" fill="#F59B4C"/><rect x="130" y="96" width="4" height="9" rx="2" fill="#F59B4C"/><g class="breathe"><ellipse cx="116" cy="80" rx="27" ry="19" fill="#FFD166"/><ellipse cx="108" cy="82" rx="13" ry="9" fill="#F0A93C"/><path d="M89 74 Q80 70 84 62 Q92 68 94 72 Z" fill="#F0A93C"/><circle cx="140" cy="58" r="14" fill="#FFD166"/><path d="M133 68 Q140 74 148 68 L146 74 Q140 78 134 74 Z" fill="#E4572E"/><path d="M152 55 L167 58 L152 63 Z" fill="#F59B4C"/><circle cx="143" cy="54" r="2.2" fill="#3E5C76"/><path d="M136 50 Q140 47 144 49" stroke="#E8B84B" stroke-width="1.5" fill="none"/></g></svg>',
  moon:'<svg viewBox="0 0 240 150" role="img" aria-label="მთვარე დედამიწის გარშემო ბრუნავს"><rect width="240" height="150" rx="14" fill="#2E4057"/><circle cx="196" cy="24" r="1.6" fill="#fff" class="twinkle"/><circle cx="150" cy="44" r="1.3" fill="#fff" class="twinkle" style="animation-delay:.5s"/><circle cx="216" cy="96" r="1.6" fill="#fff" class="twinkle" style="animation-delay:.9s"/><circle cx="96" cy="20" r="1.3" fill="#fff" class="twinkle" style="animation-delay:1.3s"/><circle cx="176" cy="128" r="1.3" fill="#fff" class="twinkle" style="animation-delay:1.7s"/><path d="M210 52 l2.4 5 5 2.4 -5 2.4 -2.4 5 -2.4 -5 -5 -2.4 5 -2.4 Z" fill="#FFE9A8" class="twinkle" style="animation-delay:.3s"/><path d="M92 116 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#FFE9A8" class="twinkle" style="animation-delay:1.1s"/><circle cx="52" cy="118" r="80" fill="none" stroke="#FFD166" stroke-width="1.6" stroke-dasharray="5 7" opacity=".75"/><circle cx="52" cy="118" r="38" fill="none" stroke="#A8D8EA" stroke-width="2" opacity=".45"/><circle cx="52" cy="118" r="34" fill="#5FA8D3"/><ellipse cx="38" cy="106" rx="10" ry="7" fill="#7FB069"/><ellipse cx="62" cy="124" rx="12" ry="8" fill="#7FB069"/><ellipse cx="46" cy="134" rx="7" ry="5" fill="#7FB069"/><g class="orbit"><circle cx="108" cy="60" r="14" fill="#E8E8F0"/><circle cx="103" cy="56" r="3" fill="#C9C9DC"/><circle cx="113" cy="64" r="2.2" fill="#C9C9DC"/><circle cx="110" cy="52" r="1.6" fill="#C9C9DC"/><circle cx="104" cy="63" r="1.4" fill="#3E5C76" opacity=".55"/><path d="M104 66 Q108 69 112 66" stroke="#6B6B85" stroke-width="1.4" fill="none"/><circle cx="103" cy="60" r="1.5" fill="#6B6B85"/><circle cx="112" cy="57" r="1.5" fill="#6B6B85"/></g><path d="M126 44 Q136 36 148 36" stroke="#FFD166" stroke-width="2" fill="none" opacity=".45"/><path d="M144 31 L150 36 L143 40 Z" fill="#FFD166" opacity=".45"/></svg>',
  yummy:'<svg viewBox="0 0 240 150" role="img" aria-label="ბავშვი გემრიელ ნამცხვარს უყურებს"><rect width="240" height="150" rx="14" fill="#FFF3E2"/><rect x="0" y="108" width="240" height="42" rx="14" fill="#EAB464"/><ellipse cx="172" cy="112" rx="42" ry="10" fill="#fff"/><ellipse cx="172" cy="109" rx="42" ry="9" fill="#FDFDFD"/><path d="M150 104 L172 68 L196 104 Z" fill="#F7C59F"/><path d="M150 104 L172 68 L196 104 Q172 96 150 104 Z" fill="#F7C59F"/><path d="M158 92 Q165 87 172 92 Q179 87 188 92 L186 96 Q172 90 160 96 Z" fill="#fff"/><circle cx="172" cy="64" r="6" fill="#E4572E"/><path d="M172 57 Q174 54 177 55" stroke="#7FB069" stroke-width="2" fill="none"/><path d="M160 52 Q156 42 162 34" stroke="#F59B4C" stroke-width="2.4" fill="none" opacity=".65" class="rise"/><path d="M184 50 Q188 40 182 32" stroke="#F59B4C" stroke-width="2.4" fill="none" opacity=".65" class="rise" style="animation-delay:1.1s"/><path d="M206 74 l2.2 4.6 4.6 2.2 -4.6 2.2 -2.2 4.6 -2.2 -4.6 -4.6 -2.2 4.6 -2.2 Z" fill="#FFD166" class="twinkle"/><g class="breathe"><circle cx="70" cy="78" r="34" fill="#FFE0B5"/><path d="M38 68 Q44 38 70 42 Q96 38 102 68 Q88 52 70 54 Q52 52 38 68 Z" fill="#6B4226"/><circle cx="58" cy="74" r="5" fill="#fff"/><circle cx="82" cy="74" r="5" fill="#fff"/><circle cx="60" cy="75" r="2.6" fill="#3E5C76"/><circle cx="84" cy="75" r="2.6" fill="#3E5C76"/><circle cx="50" cy="88" r="5" fill="#F4A6A0" opacity=".75"/><circle cx="90" cy="88" r="5" fill="#F4A6A0" opacity=".75"/><path d="M58 94 Q70 106 82 94 Q76 104 70 104 Q64 104 58 94 Z" fill="#B5573F"/><ellipse cx="70" cy="99" rx="6" ry="3.4" fill="#F4847C"/></g><path d="M85 100 q4 3 2 7 q-4 -1 -2 -7 Z" fill="#A8D8EA" class="drip"/></svg>',
  tree:'<svg viewBox="0 0 240 150" role="img" aria-label="ხე შემოდგომაზე ფოთლებს ისვრის"><rect width="240" height="150" rx="14" fill="#DFF1FB"/><rect x="0" y="112" width="240" height="38" rx="14" fill="#F5E6C8"/><rect x="104" y="66" width="18" height="52" rx="8" fill="#A9714B"/><path d="M108 84 Q98 78 94 70" stroke="#A9714B" stroke-width="5" fill="none" stroke-linecap="round"/><g class="sway"><circle cx="113" cy="44" r="26" fill="#F59B4C"/><circle cx="90" cy="54" r="18" fill="#FFD166"/><circle cx="138" cy="52" r="18" fill="#E4572E"/><circle cx="113" cy="60" r="15" fill="#F59B4C"/></g><path d="M104 96 Q108 94 112 96" stroke="#6B4226" stroke-width="1.6" fill="none"/><path d="M105 90 q3 -2 5 0" stroke="#6B4226" stroke-width="1.4" fill="none"/><path d="M114 90 q3 -2 5 0" stroke="#6B4226" stroke-width="1.4" fill="none"/><text x="132" y="82" font-size="9" fill="#6B4226" opacity=".7" font-family="sans-serif" class="twinkle">z z</text><ellipse cx="167" cy="96" rx="6" ry="3.4" fill="#E4572E" class="fall"/><ellipse cx="57" cy="102" rx="6" ry="3.4" fill="#F59B4C" class="fall" style="animation-delay:1.2s"/><ellipse cx="193" cy="68" rx="5.4" ry="3" fill="#FFD166" class="fall" style="animation-delay:2.3s"/><ellipse cx="96" cy="116" rx="8" ry="3.6" fill="#E4572E"/><ellipse cx="132" cy="118" rx="9" ry="3.6" fill="#F59B4C"/><ellipse cx="114" cy="120" rx="7" ry="3.2" fill="#FFD166"/></svg>',
  ice:'<svg viewBox="0 0 240 150" role="img" aria-label="ყინული წყალზე ცურავს, ქვემოთ თევზები"><rect width="240" height="150" rx="14" fill="#DFF1FB"/><circle cx="204" cy="24" r="11" fill="#FFE9A8"/><rect x="0" y="46" width="240" height="16" fill="#F0F8FF"/><path d="M40 46 l8 16 M96 46 l-6 16 M150 46 l7 16 M198 46 l-5 16" stroke="#C9E2F0" stroke-width="1.6"/><rect x="0" y="62" width="240" height="88" rx="14" fill="#5FA8D3"/><g class="bob"><rect x="150" y="50" width="34" height="22" rx="6" fill="#fff"/><rect x="150" y="62" width="34" height="10" rx="5" fill="#E8F4FA" opacity=".85"/></g><g class="swim"><ellipse cx="86" cy="100" rx="20" ry="11" fill="#F59B4C"/><path d="M66 100 L52 90 L52 110 Z" fill="#F59B4C"/><circle cx="96" cy="97" r="2.2" fill="#3E5C76"/><path d="M92 104 Q96 107 100 104" stroke="#B5573F" stroke-width="1.6" fill="none"/></g><g class="swim" style="animation-delay:1.6s"><ellipse cx="168" cy="122" rx="16" ry="9" fill="#FFD166"/><path d="M184 122 L196 114 L196 130 Z" fill="#FFD166"/><circle cx="160" cy="120" r="2" fill="#3E5C76"/><path d="M156 126 Q160 128 164 126" stroke="#B5573F" stroke-width="1.4" fill="none"/></g><circle cx="112" cy="86" r="3" fill="#fff" opacity=".7" class="rise"/><circle cx="118" cy="76" r="2.2" fill="#fff" opacity=".7" class="rise" style="animation-delay:.8s"/><circle cx="146" cy="108" r="2.6" fill="#fff" opacity=".7" class="rise" style="animation-delay:1.4s"/><circle cx="122" cy="68" r="1.7" fill="#fff" opacity=".7" class="rise" style="animation-delay:2s"/></svg>',
  shell:'<svg viewBox="0 0 240 150" role="img" aria-label="ბავშვი ნიჟარას ყურთან იჭერს"><rect width="240" height="150" rx="14" fill="#DFF1FB"/><rect x="0" y="116" width="240" height="34" rx="14" fill="#F5E6C8"/><path d="M196 128 l4 -9 4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 Z" fill="#F59B4C" class="twinkle"/><g class="breathe"><circle cx="96" cy="76" r="36" fill="#FFE0B5"/><path d="M62 64 Q70 32 96 36 Q122 32 130 64 Q114 46 96 48 Q78 46 62 64 Z" fill="#6B4226"/><path d="M80 74 q4 -3 8 0" stroke="#3E5C76" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M104 74 q4 -3 8 0" stroke="#3E5C76" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="74" cy="88" r="5" fill="#F4A6A0" opacity=".75"/><circle cx="118" cy="88" r="5" fill="#F4A6A0" opacity=".75"/><path d="M86 96 Q96 104 106 96" stroke="#B5573F" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="137" cy="94" r="9" fill="#FFE0B5"/><path d="M128 66 Q150 58 154 80 Q156 96 138 96 Q126 96 124 82 Q123 70 128 66 Z" fill="#F4A6A0"/><path d="M133 70 Q146 66 148 80 Q149 90 139 90" fill="none" stroke="#E8909C" stroke-width="2"/><path d="M138 74 Q143 73 144 80" fill="none" stroke="#E8909C" stroke-width="1.6"/><ellipse cx="130" cy="90" rx="6" ry="4" fill="#E8909C"/></g><path d="M162 62 Q170 76 162 90" stroke="#5FA8D3" stroke-width="2.4" fill="none" class="sound"/><path d="M172 54 Q184 76 172 98" stroke="#5FA8D3" stroke-width="2" fill="none" class="sound" style="animation-delay:.6s"/><path d="M182 46 Q198 76 182 106" stroke="#5FA8D3" stroke-width="1.6" fill="none" class="sound" style="animation-delay:1.2s"/></svg>'
};

/* the 6 daily questions — original NikoLearn content, owner-approved v3 verbatim */
const DAYQ = [
  {ic:'🦆', col:'#4E8AB8', sv:'duck', tag:'ცხოველები', q:'რატომ არ უცივდებათ იხვებს ფეხები ცივ წყალში?', a:'იხვის ფეხში სისხლი ჭკვიანურად მოძრაობს: თბილი სისხლი ცივს გზაში ათბობს. ამიტომ იხვი ყინულზეც მშვიდად დგას. ჩვენ წინდები გვჭირდება, იხვს კი საკუთარი გამათბობელი აქვს!', en:'duck = იხვი'},
  {ic:'🌙', col:'#4A5A82', sv:'moon', tag:'ზეცა', q:'რატომ არ ვარდება მთვარე დედამიწაზე?', a:'მთვარე სულ ვარდნაშია! მაგრამ ისე სწრაფად მიფრინავს გვერდზე, რომ ვარდნისას სულ გვერდით ხვდება და დედამიწას გარს უვლის. ჰგავს ბურთს, რომელსაც ისე ძლიერად ისვრი, რომ ვეღარ დაეცემა.', en:'moon = მთვარე'},
  {ic:'😋', col:'#C96F4A', sv:'yummy', tag:'სხეული', q:'რატომ გვეთქმევა ნერწყვი, როცა გემრიელ საჭმელს ვხედავთ?', a:'შენი პირი საჭმელს წინასწარ ემზადება! ნერწყვი საჭმლის დაღეჭვასა და გადაყლაპვაში გვეხმარება. თვალები ხედავენ, ტვინი კი პირს ეუბნება: მოემზადე, გემრიელი მოდის!', en:'yummy = გემრიელი'},
  {ic:'🍂', col:'#B0762E', sv:'tree', tag:'ბუნება', q:'რატომ ისვრის ხე ფოთლებს შემოდგომაზე?', a:'ზამთარში ხისთვის ფოთლების გამოკვება ძალიან ძვირია: წყალი იყინება და საჭმელი ცოტაა. ამიტომ ხე ფოთლებს „შვებულებაში უშვებს" და თვითონ იძინებს. გაზაფხულზე ახლებს გამოიყვანს!', en:'tree = ხე'},
  {ic:'🧊', col:'#4187B5', sv:'ice', tag:'წყალი', q:'რატომ ცურავს ყინული წყალზე და არ იძირება?', a:'გაყინვისას წყალი უცნაურ რამეს აკეთებს: ფართოვდება და მსუბუქდება. ამიტომ ყინული წყალზე ტივივით ცურავს. ზამთარში ტბა ზემოდან იყინება, ქვემოთ კი თევზები თბილ წყალში ცხოვრობენ!', en:'ice = ყინული'},
  {ic:'🐚', col:'#B56E8A', sv:'shell', tag:'ხმა', q:'რატომ ისმის ნიჟარაში ზღვის ხმა?', a:'ეს ზღვა არ არის! ნიჟარა გარშემო ხმებს იჭერს, შიგნით ატრიალებს და გიბრუნებს. შენი ოთახის ჩუმი ხმაური ნიჟარაში ზღვასავით ჟღერს. სცადე ჭიქითაც: ისიც „ზღვასავით" ახმაურდება!', en:'sea = ზღვა'}
];

/* per-question theme: [bg-top, bg-bottom, accent, accent-dark] */
const DAYQ_TH = {
  duck:['#EAF6FF','#CDE9FB','#4E8AB8','#3C6E93'],
  moon:['#ECEBFA','#D6D8F0','#4A5A82','#374568'],
  yummy:['#FFF1E4','#FBDFC4','#C96F4A','#A65636'],
  tree:['#FFF4E0','#F6E2BE','#B0762E','#8E5D22'],
  ice:['#E7F5FF','#C9E9FB','#4187B5','#316A90'],
  shell:['#FCEDF3','#F6D8E4','#B56E8A','#8E5169']
};

/* deterministic "today" index — same question all UTC day, rotates through the deck */
function dayqToday(){
  const day = Math.floor(Date.now()/86400000);
  return ((day % DAYQ.length) + DAYQ.length) % DAYQ.length;
}

function openDayQ(){ dq = { i: dayqToday() }; renderDayQ(); }

function dayqGo(j){
  if(!dq) return;
  dq.i = ((j % DAYQ.length) + DAYQ.length) % DAYQ.length;
  renderDayQ();
}

/* reveal the answer in place (no re-render, so the scene keeps its motion) */
function dayqReveal(){
  const qc = document.querySelector('.dayq .qcard');
  if(!qc) return;
  qc.classList.add('open');
  const ch = qc.querySelector('.cheer');
  if(ch) ch.innerHTML = '<span>✨</span><span>⭐</span><span>✨</span>';
}

function renderDayQ(){
  if(!dq) return;
  const en = (typeof UILANG !== 'undefined' && UILANG === 'en');
  const c = DAYQ[dq.i];
  const t = DAYQ_TH[c.sv];
  const isToday = dq.i === dayqToday();
  const nav = DAYQ.map((qq, j) => {
    const on = j === dq.i;
    const style = on ? `background:${t[2]};border-color:${t[2]};transform:scale(1.14)` : '';
    return `<button class="dayq-dot${on?' on':''}" style="${style}" onclick="dayqGo(${j})" aria-label="${en?'Question':'კითხვა'} ${j+1}">${qq.ic}</button>`;
  }).join('');
  render(`<div class="screen dayq">
    <div class="dayq-top">
      <button class="iconbtn" onclick="goHome()" aria-label="${en?'Home':'მთავარი'}">🏠</button>
      <span class="dayq-title">💡 ${en?"Niko's question of the day":'ნიკოს დღის კითხვა'}</span>
      <img src="owl-logo.png" alt="" class="dayq-owl">
    </div>
    <div class="dayq-stage" style="background:linear-gradient(165deg,${t[0]},${t[1]})">
      <div class="qcard" style="border-color:${t[2]}66;box-shadow:0 2px 6px ${t[2]}22,0 16px 34px ${t[2]}2e">
        <div class="cheer" aria-hidden="true"></div>
        <div class="scene">${DAYQ_SV[c.sv]}</div>
        <span class="dayq-tag" style="background:${c.col}">${c.tag}</span>
        <h3 class="dayq-q">${c.q}</h3>
        <button class="dayq-reveal" style="background:${t[2]};box-shadow:0 4px 0 ${t[3]}" onclick="dayqReveal()">🔍 ${en?'Tell me, Bubu!':'მიპასუხე, ბუბუ!'}</button>
        <div class="dayq-ans">${c.a}<br><span class="dayq-en">🇬🇧 ${c.en}</span></div>
      </div>
      <div class="dayq-nav">${nav}</div>
    </div>
    <div class="dayq-note">${isToday ? (en?"Today's question. A new one waits tomorrow.":'დღეს ეს კითხვაა. ხვალ ახალი გელოდება.') : (en?'A question from another day.':'სხვა დღის კითხვა.')}</div>
  </div>`, false);
}
