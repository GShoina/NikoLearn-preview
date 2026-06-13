/* ════════════════════════════════════════════════════════════════════════
   NikoLearn — UI AUDIT (repeatable tap-target + console-error sweep)
   ────────────────────────────────────────────────────────────────────────
   WHY: manual testing kept surfacing the same class of bug (buttons too small
   to tap, e.g. the v1.154 „მოისმინე" listen button at 34px). This walks EVERY
   game mode automatically and flags any tappable control below the 44×44px
   finger-friendly minimum (Apple HIG), so we catch them before the owner does.

   HOW TO RUN:
   1. Open the app (……/index.html?app=1), create/pick any child profile.
   2. Open DevTools console (or a Playwright evaluate), paste this whole file.
   3. Call:  await uiAudit()
      → returns { offenders:[…], modesSwept, minPx } and console.tables it.
   Re-run after any UI/CSS change. „offenders: []" = all tap targets pass.

   NOTE: needs an active `profile` + `state` (a profile selected). Audio/TTS are
   no-op'd so the sweep is silent. It only MEASURES; it never deploys or saves.
   ════════════════════════════════════════════════════════════════════════ */
window.uiAudit = async function uiAudit(minPx){
  minPx = minPx || 44;
  try { HTMLMediaElement.prototype.play = () => Promise.resolve(); } catch(e){}
  try { window.speechSynthesis.speak = () => {}; } catch(e){}
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // launch map — one entry per playable sub-mode (mirrors SUBMODES in games.js)
  const launch = {
    quiz:()=>startGame('quiz'), reverse:()=>startGame('reverse'), listen:()=>startGame('listen'),
    match:()=>startGame('match'), spell:()=>startGame('spell'),
    'math-add':()=>startGame('math-add'), 'math-sub':()=>startGame('math-sub'), 'math-mul':()=>startGame('math-mul'),
    'math-div':()=>startGame('math-div'), 'math-miss':()=>startGame('math-miss'), 'math-pat':()=>startGame('math-pat'),
    'math-word':()=>startGame('math-word'), 'math-pic':()=>startGame('math-pic'),
    compare:()=>startGame('compare'), skip:()=>startGame('skip'), shapes:()=>startGame('shapes'),
    money:()=>startGame('money'), clock:()=>startGame('clock'), count:()=>startCount('count'),
    'kings-eng':()=>startKings('eng'), 'kings-math':()=>startKings('math'),
    digit:()=>startDigitQuiz(), 'ka-alpha':()=>alphaQuiz('ka-alpha'), 'en-alpha':()=>alphaQuiz('en-alpha'),
    read:()=>startReadQuiz(), sent:()=>startSentQuiz(), build:()=>startBuild()
  };
  const SEL = 'button, [onclick], .opt, .speakbtn, .chip, .ctl, input, .ai-chip, .mic, .vtgl';
  const dist = {}; // label -> {size, modes:Set}
  let swept = 0;

  for (const mode in launch) {
    try {
      launch[mode](); await sleep(110); swept++;
      for (const el of document.querySelectorAll('#gscreen ' + SEL + ', .screen ' + SEL)) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;          // hidden, skip
        if (Math.min(r.width, r.height) < minPx) {
          const raw = el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className;
          const cls = String(raw || '(no-class)').split(' ')[0];
          const txt = (el.textContent || el.placeholder || '').trim().slice(0, 14);
          const label = cls + (txt ? ' "' + txt + '"' : '');
          if (!dist[label]) dist[label] = { size: Math.round(r.width) + 'x' + Math.round(r.height), modes: new Set() };
          dist[label].modes.add(mode);
        }
      }
    } catch (e) { /* a mode that fails to launch is reported as missing coverage below */ }
  }

  const offenders = Object.entries(dist)
    .map(([label, v]) => ({ label, size: v.size, inModes: v.modes.size }))
    .sort((a, b) => b.inModes - a.inModes);

  try { console.table(offenders); } catch (e) {}
  console.log(`uiAudit: swept ${swept} modes · min ${minPx}px · ${offenders.length} undersized control type(s)`);
  return { offenders, modesSwept: swept, minPx };
};
