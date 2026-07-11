// NB-19 (line-28) DEEP EN-SECTION AUDIT (2026-07-11): enumerate the LIVE English menus (english /
// kings-eng / en-alpha) and drive every mode — not just q0. Choice modes are auto-played to the
// results screen by parsing each option's onclick and clicking the CORRECT one (answer(this,sel,cor)
// family: sel===cor). spell is auto-typed. Interaction-special modes (match/speak/exam picker) get
// structural q0 asserts. Defect classes this catches: no-correct-option rendered, engine marks a
// correct click wrong, round never completes, pageerrors, empty prompts.
// Run: node qa/_en-audit.mjs
import { launchBrowser, startStaticServer, makeChk, SHOT_DIR } from './_harness.mjs';

const { chk, fails } = makeChk();
const srv = await startStaticServer();
const URL = `http://localhost:${srv.port}/index.html?app=1&notrack=1`;
const browser = await launchBrowser();

const SEED = { onboarded: true, authed: true, kids: [{ id: 'k8', name: 'დემო', age: 8 }] };

const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
const page = await ctx.newPage();
await page.addInitScript(s => localStorage.setItem('nikolearn_p2', JSON.stringify(s)), SEED);
const errs = []; page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => typeof selectProfile === 'function' && typeof startGame === 'function', null, { timeout: 10000 });
await page.evaluate(() => { try { window.speechSynthesis && (window.speechSynthesis.speak = () => {}); } catch {} });
await page.evaluate(() => selectProfile('k8'));
await page.waitForTimeout(300);

// ── in-page helpers ──
await page.evaluate(() => {
  // click the CORRECT option: parse onclick args of each .opt-like button; correct = sel===cor.
  // covers the whole handler family: answer / answerKings / answerPhrase / plAnswer / answerYesNo …
  window.__clickCorrect = () => {
    const btns = [...document.querySelectorAll('.opt, .options button, .yn-btn')];
    if (!btns.length) return 'no-options';
    for (const b of btns) {
      const oc = b.getAttribute('onclick') || '';
      const m = oc.match(/[a-zA-Z_$]*[Aa]nswer\w*\(\s*this\s*,\s*(.+)\)\s*;?\s*$/);
      if (!m) continue;
      // split top-level args (no nested parens expected in args)
      const args = m[1].split(/,(?![^(]*\))/).map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      if (args.length >= 2 && args[0] === args[1]) { b.click(); return 'clicked'; }
      if (args.length === 1 && (args[0] === 'true' || args[0] === '1')) { b.click(); return 'clicked'; }
    }
    return 'no-correct-found';
  };
  window.__spellSolve = () => {
    const inp = document.getElementById('sp'); if (!inp) return 'no-input';
    const btn = [...document.querySelectorAll('button')].find(b => (b.getAttribute('onclick') || '').includes('checkSpell'));
    if (!btn) return 'no-check-btn';
    const m = (btn.getAttribute('onclick') || '').match(/checkSpell\(\s*['"](.+?)['"]\s*\)/);
    if (!m) return 'no-cor-arg';
    inp.value = m[1]; btn.click(); return 'clicked';
  };
  // _celebGo is a script-scoped let (NOT a window property) — reach it lexically via eval
  window.__advance = () => { try { (0, eval)('typeof _celebGo!=="undefined" && _celebGo && _celebGo()'); } catch (e) {} };
  window.__atResults = () => !!document.querySelector('.res-card, .results') || /კიდევ ერთი|One more|შენი დონეა|your level in/.test(document.body.innerText);
  window.__q0ok = () => {
    const dv = document.querySelector('.device') || document.body;
    const txt = dv.innerText.trim();
    const act = dv.querySelector('.opt, .options button, .yn-btn, input, .speakbtn, .match-grid, .mic, button[onclick]');
    return txt.length > 0 && !!act;
  };
});

async function playMode(entry, mode, kind) { // kind: 'play' | 'spell' | 'struct'
  const eBefore = errs.length;
  try { await page.evaluate(e => eval(e), entry); } catch (e) { chk(`${mode}: entry runs`, false); return; }
  await page.waitForTimeout(450);
  const q0 = await page.evaluate(() => window.__q0ok());
  chk(`${mode}: q0 renders (prompt + action)`, q0);
  await page.screenshot({ path: `${SHOT_DIR}/enaudit-${mode.replace(/[^\w-]/g, '_')}.png` }).catch(() => {});
  if (kind !== 'struct') {
    let steps = 0, stuck = '', done = false;
    while (steps < 40) {
      if (await page.evaluate(() => window.__atResults())) { done = true; break; }
      const r = await page.evaluate(k => k === 'spell' ? window.__spellSolve() : window.__clickCorrect(), kind);
      if (r !== 'clicked') { stuck = r; break; }
      steps++;
      await page.waitForTimeout(160);
      await page.evaluate(() => window.__advance());
      await page.waitForTimeout(160);
    }
    if (!done && !stuck) done = await page.evaluate(() => window.__atResults());
    chk(`${mode}: auto-played to results (${steps} steps${stuck ? ', stuck: ' + stuck : ''})`, done);
    if (done) {
      const wrong = await page.evaluate(() => { try { return (0, eval)('game.wrong||0'); } catch (e) { return 0; } });
      chk(`${mode}: 0 wrong on correct-only clicks (got ${wrong})`, wrong === 0);
    }
  }
  chk(`${mode}: no pageerrors`, errs.length === eBefore);
  // goHome() nulls the active profile (returns to the chooser) — re-select for the next mode
  await page.evaluate(() => { try { goHome(); } catch (e) {} try { selectProfile('k8'); } catch (e) {} });
  await page.waitForTimeout(250);
}

// ── 1) the REAL first-run path: english entry diagnostic (placement) — audited as its own mode ──
await playMode(`startGame('quiz')`, 'english/entry-diagnostic', 'play');

// ── 2) skip further diagnostics so every mode opens directly (diag itself audited above) ──
await page.evaluate(() => {
  const s = state['k8']; s.subjDiag = s.subjDiag || {};
  for (const subj of ['english', 'math', 'ka-alpha', 'en-alpha', 'kings-eng', 'kings-math', 'counting'])
    s.subjDiag[subj] = { done: true, skipped: true, date: new Date().toISOString() };
  save();
});

// ── enumerate the LIVE english menu (no hardcoded list — §14) ──
await page.evaluate(() => openMenu('english'));
await page.waitForTimeout(350);
const enTiles = await page.evaluate(() =>
  [...document.querySelectorAll('.mode')].map(el => ({
    oc: el.getAttribute('onclick') || '', nm: (el.querySelector('.m-name') || {}).textContent || ''
  })));
console.log('LIVE english menu tiles: ' + enTiles.map(t => t.nm).join(' · '));
chk('english menu: ≥8 tiles', enTiles.length >= 8);

const PLAY = { quiz: 'play', reverse: 'play', listen: 'play', colour: 'play', engram: 'play', addlet: 'play', spell: 'spell', match: 'struct' };
for (const [m, kind] of Object.entries(PLAY)) {
  await page.evaluate(() => openMenu('english')); await page.waitForTimeout(250);
  await playMode(`startGame('${m}')`, `english/${m}`, kind);
}
// phrases: picker → first topic → phrase round (own handler answerPhrase → generic parser)
await page.evaluate(() => openMenu('english')); await page.waitForTimeout(250);
await playMode(`openPhrases()`, 'english/phrases-picker', 'struct');

// ── kings-eng ──
await page.evaluate(() => openMenu('kings-eng')); await page.waitForTimeout(350);
const kTiles = await page.evaluate(() => [...document.querySelectorAll('.mode')].map(el => (el.querySelector('.m-name') || {}).textContent || ''));
console.log('LIVE kings-eng menu tiles: ' + kTiles.join(' · '));
const KPLAY = { 'kings-eng': 'struct', 'listen-yle': 'play', yesno: 'play', story: 'play', speak: 'struct' };
for (const [m, kind] of Object.entries(KPLAY)) {
  await page.evaluate(() => openMenu('kings-eng')); await page.waitForTimeout(250);
  await playMode(`startGame('${m}')`, `kings-eng/${m}`, kind);
}

// ── en-alpha (reader variant): drive the LIVE tiles by their real onclicks ──
await page.evaluate(() => openMenu('en-alpha')); await page.waitForTimeout(350);
const aTiles = await page.evaluate(() => [...document.querySelectorAll('.mode')].map(el => ({
  nm: (el.querySelector('.m-name') || {}).textContent || '', oc: el.getAttribute('onclick') || '' })));
console.log('LIVE en-alpha menu tiles: ' + aTiles.map(t => t.nm + ' [' + t.oc.replace(/window\.wSay&&wSay\(this\);/, '') + ']').join(' · '));
for (let ti = 0; ti < aTiles.length; ti++) {
  const entry = aTiles[ti].oc.replace(/window\.wSay&&wSay\(this\);/, '').replace(/this/g, 'document.body');
  const isQuiz = /startGame|alphaStart/.test(entry);
  await page.evaluate(() => openMenu('en-alpha')); await page.waitForTimeout(250);
  await playMode(entry, `en-alpha/${aTiles[ti].nm.trim() || 'tile' + ti}`, isQuiz ? 'play' : 'struct');
}

await browser.close();
srv.close();
const F = fails();
console.log(`\n${F === 0 ? '✅ ALL PASS' : '❌ ' + F + ' FAIL(S)'} — _en-audit.mjs`);
process.exit(F === 0 ? 0 : 1);
