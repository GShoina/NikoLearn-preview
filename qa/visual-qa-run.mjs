#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════
   NikoLearn — §8 RUN-THE-APP VISUAL QA (AGENT_TEAM_STANDARD.md §8, full matrix)
   ────────────────────────────────────────────────────────────────────────
   Drives EVERY subject tile and EVERY mode tile the rendered app actually
   shows (enumerated from the live DOM — never a hardcoded list, CLAUDE.md §14)
   at 320/360/390 px, ages 5/7/9 (≤5 young · 6-7 worlds-Kings · 8+ classic),
   in KA and EN. Opens the tutor per subject. Screenshots every state to
   output/visual-qa/<date>/ and asserts programmatically:
     overflow-x / clipped / unreachable-under-dock · tap targets <44px ·
     AI-fab overlapping controls · text contrast <4.5:1 on rendered pixels ·
     answer-printed-in-stem · KA-chrome leaking while UILANG=en · tutor label
     vs subject · JS pageerrors.
   Silent (audio + TTS neutered), offline-safe (non-local requests aborted).

   RUN:  node qa/visual-qa-run.mjs [--date 2026-07-13] [--widths 320,360,390]
   OUT:  output/visual-qa/<date>/*.jpg + findings.json + ledger.json
   ════════════════════════════════════════════════════════════════════════ */
import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'C:/Users/gela.shonia/Documents/NGT 2020-07/AI_Projects/NikoLand';
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const DATE = arg('date', '2026-07-13');
const WIDTHS = arg('widths', '320,360,390').split(',').map(Number);
const LANGS = arg('langs', 'ka,en').split(',');
const AGES = arg('ages', '5,7,9').split(',').map(Number);
const OUT = join(ROOT, 'output', 'visual-qa', DATE);
mkdirSync(OUT, { recursive: true });

function findChrome() {
  const cands = [
    'C:/Users/gela.shonia/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe',
  ];
  const base = 'C:/Users/gela.shonia/AppData/Local/ms-playwright';
  try {
    for (const d of readdirSync(base)) {
      if (d.startsWith('chromium_headless_shell')) cands.push(join(base, d, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe'));
      if (d.startsWith('chromium-')) cands.push(join(base, d, 'chrome-win64', 'chrome.exe'));
    }
  } catch {}
  return cands.reverse().find(existsSync);
}

const MIME = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg',
  '.mp3':'audio/mpeg', '.webmanifest':'application/manifest+json', '.woff2':'font/woff2', '.ttf':'font/ttf', '.ico':'image/x-icon' };
function serve() {
  return new Promise(res => {
    const s = createServer((req, r) => {
      let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
      const fp = join(ROOT, p);
      if (!fp.startsWith(ROOT.replace(/\//g, '\\')) && !fp.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
      if (!existsSync(fp) || statSync(fp).isDirectory()) { r.writeHead(404); return r.end('404'); }
      r.writeHead(200, { 'Content-Type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream' });
      r.end(readFileSync(fp));
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

/* ── in-page probes ─────────────────────────────────────────────────── */
// layout probe: overflow, clip, tap<44, under-dock, AI-fab overlap (superset of visual-gate PROBE)
const PROBE = (minPx) => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const out = { offenders: [], overflowX: document.documentElement.scrollWidth > vw + 1,
    screen: '', vw, vh, fabOverlap: [], scrollable: false };
  const active = document.querySelector('.screen.show, .screen.active, #gscreen, .screen') || document.body;
  out.screen = (active && (active.id || String(active.className).split(' ').slice(0,2).join('.'))) || '(none)';
  const sc = document.scrollingElement || document.documentElement;
  out.scrollable = sc.scrollHeight > sc.clientHeight + 40;
  const isPinned = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) {
    const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky' || p === 'absolute') return true; } return false; };
  const visible = (el) => { const s = getComputedStyle(el);
    return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0); };
  let dock = null;
  for (const n of document.querySelectorAll('.bottomnav')) { const r = n.getBoundingClientRect();
    if (r.height > 0 && visible(n) && !n.classList.contains('hidden')) dock = r; }
  const SEL = 'button,[onclick],.opt,.speakbtn,.chip,.ctl,input,.ai-chip,.mic,.vtgl,.navemoji,[data-nav],.pcard,.subj,.mode,.tnav,.talk-deck';
  const seen = new Set();
  const fab = document.querySelector('#aifab'); const fr = fab && visible(fab) ? fab.getBoundingClientRect() : null;
  for (const el of document.querySelectorAll(SEL)) {
    const rc = el.getBoundingClientRect();
    if ((rc.width === 0 && rc.height === 0) || !visible(el)) continue;
    const raw = el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className;
    const key = (String(raw || '').split(' ')[0] || el.tagName.toLowerCase());
    const problems = [];
    const pinned = isPinned(el);
    if (rc.top < -1) problems.push('clip-top');
    if (rc.left < -1 || rc.right > vw + 1) problems.push('overflow-x');
    if (pinned && rc.bottom > vh + 1) problems.push('pinned-offscreen');
    const inNav = el.closest('.bottomnav');
    if (dock && !inNav && !pinned) {
      const hov = Math.min(rc.right, dock.right) - Math.max(rc.left, dock.left);
      if (hov > 14) {
        const scEl = el.closest('#app') || document.scrollingElement || document.documentElement;
        const sr = scEl.getBoundingClientRect();
        const maxScroll = Math.max(0, scEl.scrollHeight - scEl.clientHeight);
        const contentBottom = (rc.bottom - sr.top) + (scEl.scrollTop || 0);
        const atMaxScroll = sr.top + (contentBottom - maxScroll);
        if (atMaxScroll > dock.top + 6) problems.push('under-dock');
      }
    }
    if ((el.tagName === 'BUTTON' || el.matches('[onclick],[data-nav],input,.opt')) && !el.matches('.mode,.subj,.pcard,.talk-deck') &&
        Math.min(rc.width, rc.height) < minPx) problems.push('tap<' + minPx);
    if (fr && el !== fab && !el.contains(fab) && !fab.contains(el)) {
      const ox = Math.min(rc.right, fr.right) - Math.max(rc.left, fr.left);
      const oy = Math.min(rc.bottom, fr.bottom) - Math.max(rc.top, fr.top);
      const minA = Math.min(rc.width * rc.height, fr.width * fr.height);
      if (ox > 0 && oy > 0 && (ox * oy) > 0.25 * minA) out.fabOverlap.push(key + ' ' + Math.round(ox) + 'x' + Math.round(oy));
    }
    if (!problems.length) continue;
    const sig = key + problems.join();
    if (seen.has(sig)) continue; seen.add(sig);
    out.offenders.push({ el: key, txt: (el.textContent || '').trim().slice(0, 20), size: Math.round(rc.width) + 'x' + Math.round(rc.height),
      pos: 't' + Math.round(rc.top) + ' b' + Math.round(rc.bottom), problems });
  }
  return out;
};

// contrast on real rendered pixels (from visual-gate, selector set widened for worlds/talk/home states)
const CONTRAST_PROBE = ({ b64 }) => new Promise(async (resolve) => {
  try {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
    const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
    const dpr = img.width / window.innerWidth;
    const px = (x, y) => { const d = g.getImageData(Math.max(0, Math.min(cv.width - 1, Math.round(x * dpr))),
      Math.max(0, Math.min(cv.height - 1, Math.round(y * dpr))), 1, 1).data; return [d[0], d[1], d[2]]; };
    const lin = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    const lum = ([r, gg, b]) => .2126 * lin(r) + .7152 * lin(gg) + .0722 * lin(b);
    const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };
    const toRGB = (() => { const c = document.createElement('canvas'); c.width = c.height = 4; const x = c.getContext('2d', { willReadFrequently: true });
      return col => { x.clearRect(0, 0, 4, 4); x.fillStyle = '#000'; x.fillRect(0, 0, 4, 4); x.fillStyle = col; x.fillRect(0, 0, 4, 4); const d = x.getImageData(1, 1, 1, 1).data; return [d[0], d[1], d[2]]; }; })();
    const vw = window.innerWidth, vh = window.innerHeight;
    const vis = el => { const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0); };
    const TEXT = '.s-name,.s-sub,.m-name,.m-sub,.w-nm,.td-name,.td-sub,.hc-name,.hc-kick,.hc-sub,.ykick,.yheap,.path-hint,.pset-hint,.lp-cs';
    const BADGE = '.play-badge,.s-badge,.tap-hint,.lock-badge,.w-spk';
    const badges = [...document.querySelectorAll(BADGE)].filter(vis).map(b => b.getBoundingClientRect()).filter(r => r.width);
    const lineRects = t => { try { const rg = document.createRange(); rg.selectNodeContents(t);
      const rl = [...rg.getClientRects()].filter(r => r.width > 1 && r.height > 1);
      return rl.length ? rl : [t.getBoundingClientRect()]; } catch { return [t.getBoundingClientRect()]; } };
    const out = [];
    for (const t of document.querySelectorAll(TEXT)) {
      if (!vis(t)) continue;
      const lines = lineRects(t); const u = t.getBoundingClientRect();
      if (!u.width || u.top >= vh || u.bottom <= 0) continue;
      const txt = (t.textContent || '').trim().slice(0, 18); if (!txt) continue;
      const st = getComputedStyle(t); const fs = parseFloat(st.fontSize); const bold = +st.fontWeight >= 700;
      const large = fs >= 24 || (bold && fs >= 18.66); const need = large ? 3.0 : 4.5;
      const inBadge = (x, y) => badges.some(b => x >= b.left - 1 && x <= b.right + 1 && y >= b.top - 1 && y <= b.bottom + 1);
      let worst = 99;
      for (const r of lines) { if (r.top >= vh || r.bottom <= 0) continue;
        const sy = Math.min(Math.max(r.top + r.height / 2, 2), vh - 2);
        const cands = [Math.min(r.right + 8, vw - 2), Math.max(r.left - 8, 2)].filter(x => !inBadge(x, sy));
        for (const sx of cands) worst = Math.min(worst, ratio(toRGB(st.color), px(sx, sy))); }
      const c = worst === 99 ? 99 : +worst.toFixed(2);
      const problems = [];
      if (c < need) problems.push('contrast' + c + '<' + need);
      for (const b of badges) for (const r of lines) { const ox = Math.min(r.right, b.right) - Math.max(r.left, b.left);
        const oy = Math.min(r.bottom, b.bottom) - Math.max(r.top, b.top);
        if (ox > 6 && oy > 6) { problems.push('badge-overlap'); break; } }
      if (problems.length) out.push({ el: String(t.className).split(' ')[0], txt, c, size: Math.round(fs) + 'px', problems: [...new Set(problems)] });
    }
    resolve(out);
  } catch (e) { resolve([{ el: 'PROBE-ERR', txt: String(e).slice(0, 60), problems: ['probe-error'] }]); }
});

// i18n leak: Georgian glyphs in CHROME strings while UILANG=en. Content areas (words being
// taught, options, talk-card bodies) are legitimately Georgian → excluded by design.
const I18N_PROBE = () => {
  if (window.UILANG !== 'en') return [];
  const KA = /[Ⴀ-ჿ]/;
  const CHROME = '.topbar,.m-name,.m-sub,.s-sub,.home-seclabel,.hc-kick,.hc-bar span,.btn,.tnav,.cat-chip,.cat-more,.path-top,.path-hint,.pset-hint,.abtn,.hh-hi span,.ai-name,.idle-hint-btn,.bigplay,.ykick,.yheap,.teach-btns button,.lp-note';
  const skip = el => el.closest('[data-noi18n],#garea .opt,.opt,.p-word,.p-emoji,.talk-q,.td-name,.w-nm,.s-name,.ka-samp');
  const vis = el => { const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return r.width > 0 && !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0); };
  const out = []; const seen = new Set();
  for (const el of document.querySelectorAll(CHROME)) {
    if (!vis(el) || skip(el)) continue;
    const txt = (el.textContent || '').trim();
    if (KA.test(txt)) { const sig = txt.slice(0, 30); if (seen.has(sig)) continue; seen.add(sig);
      out.push({ el: String(el.className).split(' ')[0] || el.tagName, txt: sig }); }
  }
  return out.slice(0, 12);
};

// answer-in-stem: does the CORRECT answer literally appear in the visible stem/prompt?
const ANSWER_PROBE = () => {
  try {
    // `game` is a top-level `let` (global lexical binding, NOT on window) — window.game is always
    // undefined, which silently disabled this probe in earlier runs. Bare identifier works in evaluate.
    const g = (typeof game !== 'undefined') ? game : null; if (!g || !document.querySelector('#gscreen')) return null;
    const m = g.mode || '';
    const q = m.startsWith('math-') ? g.cur : (g.qs ? g.qs[g.i] : null);
    if (!q) return null;
    const a = q.a !== undefined ? q.a : (q.answer !== undefined ? q.answer : (q.cor !== undefined ? q.cor : q.correct));
    if (a === undefined || a === null || String(a).trim() === '') return null;
    const area = document.querySelector('#garea'); if (!area) return null;
    const clone = area.cloneNode(true);
    clone.querySelectorAll('.opt,.opts,button,.pat-rule,.teach-btns').forEach(n => n.remove());
    const stem = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    const A = String(a).trim();
    if (!A || !stem) return null;
    let hit = false;
    if (/^\d+$/.test(A)) { const re = new RegExp('(^|[^\\d])' + A + '([^\\d]|$)'); hit = re.test(stem); }
    else if (A.length >= 2) hit = stem.toLowerCase().includes(A.toLowerCase());
    else hit = stem.includes(A); // single glyph (letter answers)
    return hit ? { mode: m, answer: A.slice(0, 30), stem: stem.slice(0, 90) } : null;
  } catch (e) { return null; }
};

/* ── driver ─────────────────────────────────────────────────────────── */
const findings = [];   // {id?,sev,cat,state,detail}
const ledger = [];     // every state visited
let shotN = 0;
let curState = '';     // pageerror attribution

const slug = s => String(s).replace(/[^\wႠ-ჿ-]+/g, '_').slice(0, 40);

async function captureState(page, ctxInfo, stateName, opts = {}) {
  const { width, lang, age } = ctxInfo;
  curState = `${age}/${lang}/${width}/${stateName}`;
  await page.waitForTimeout(opts.wait ?? 650);
  const file = `${age}-${lang}-${width}-${slug(stateName)}.jpg`;
  let probe = null, contrast = [], i18n = [], ans = null;
  try { probe = await page.evaluate(PROBE, 44); } catch (e) { probe = { error: String(e).slice(0, 80) }; }
  let shotBuf = null;
  try { shotBuf = await page.screenshot({ type: 'jpeg', quality: 74 }); writeFileSync(join(OUT, file), shotBuf); shotN++; } catch {}
  if (shotBuf && !opts.skipContrast) {
    try { contrast = await page.evaluate(CONTRAST_PROBE, { b64: shotBuf.toString('base64') }); } catch {}
  }
  try { i18n = await page.evaluate(I18N_PROBE); } catch {}
  try { ans = await page.evaluate(ANSWER_PROBE); } catch {}
  // crash detection: the recovery overlay is appended to <body> (NOT inside .screen) and persists
  // for the page lifetime (index.html shown-once guard) — so detect the ELEMENT, and RELOAD to
  // recover, else every later state in this combo screenshots the same dead overlay.
  let crashed = false;
  try { crashed = await page.evaluate(() => { const ov = document.querySelector('div[style*="99999"]'); return !!ov && ov.getBoundingClientRect().width > 0; }); } catch {}
  if (crashed) {
    findings.push({ sev: 'CRITICAL', cat: 'error-screen', state: `${age}/${lang}/${width}/${stateName}`, detail: 'crash recovery overlay („უი, რაღაც აირია") visible — uncaught JS error at/just before this state (see pageerror findings for the stack)' });
    try {
      await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(900);
      await page.evaluate(a => { try { startDemo(a); } catch (e) {} }, age); await page.waitForTimeout(500);
      if (lang === 'en') { await page.evaluate(() => { try { setUILang('en'); selectProfile('guest'); } catch (e) {} }); await page.waitForTimeout(400); }
    } catch {}
  }
  // bottom-scrolled second shot when the state scrolls (home/menu tails)
  if (!crashed && probe && probe.scrollable && opts.scrollShot) {
    try { await page.evaluate(() => { (document.scrollingElement || document.documentElement).scrollTop = 99999; });
      await page.waitForTimeout(250);
      writeFileSync(join(OUT, `${age}-${lang}-${width}-${slug(stateName)}-btm.jpg`), await page.screenshot({ type: 'jpeg', quality: 74 })); shotN++;
      await page.evaluate(() => { (document.scrollingElement || document.documentElement).scrollTop = 0; });
    } catch {}
  }
  const key = `${age}/${lang}/${width}/${stateName}`;
  ledger.push({ key, screen: probe && probe.screen, file, ...(crashed ? { crashed: true } : {}),
    checks: { layout: !!probe && !probe.error, contrast: !opts.skipContrast, i18n: lang === 'en', answerInStem: !!ans || 'checked' } });
  if (probe && probe.overflowX) findings.push({ sev: 'HIGH', cat: 'overflow', state: key, detail: 'horizontal overflow (scrollWidth > viewport)' });
  if (probe && probe.offenders) for (const o of probe.offenders)
    findings.push({ sev: o.problems.includes('under-dock') || o.problems.includes('overflow-x') ? 'HIGH' : 'MEDIUM', cat: o.problems.join(','), state: key, detail: `${o.el} "${o.txt}" ${o.size} ${o.pos}` });
  if (probe && probe.fabOverlap && probe.fabOverlap.length)
    findings.push({ sev: 'HIGH', cat: 'fab-overlap', state: key, detail: probe.fabOverlap.join('; ') });
  for (const c of contrast) findings.push({ sev: 'MEDIUM', cat: c.problems.join(','), state: key, detail: `${c.el} "${c.txt}" ${c.size} ratio=${c.c}` });
  for (const l of i18n) findings.push({ sev: 'MEDIUM', cat: 'i18n-leak', state: key, detail: `${l.el}: "${l.txt}"` });
  if (ans) findings.push({ sev: 'HIGH', cat: 'answer-in-stem', state: key, detail: `mode=${ans.mode} answer="${ans.answer}" stem="${ans.stem}"` });
  return probe;
}

async function openTutorAndCapture(page, ctxInfo, subj) {
  const hasFab = await page.evaluate(() => !!document.querySelector('#aifab'));
  if (!hasFab) { ledger.push({ key: `${ctxInfo.age}/${ctxInfo.lang}/${ctxInfo.width}/${subj}-tutor`, screen: 'NO-FAB', file: null, checks: {} }); return; }
  try {
    await page.evaluate(() => { try { openHint(); } catch (e) {} });
    await page.waitForTimeout(700);
    const info = await page.evaluate(() => {
      const ov = document.querySelector('#aiov'); if (!ov) return null;
      const name = (ov.querySelector('.ai-name') || {}).textContent || '';
      const body = (ov.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160);
      return { name: name.trim(), body };
    });
    await captureState(page, ctxInfo, `${subj}-tutor`, { wait: 120, skipContrast: true });
    if (info) {
      const key = `${ctxInfo.age}/${ctxInfo.lang}/${ctxInfo.width}/${subj}-tutor`;
      const isEnglishSubj = /english|en-alpha|kings-eng/.test(subj);
      if (/ინგლისურის მასწავლებელი|English teacher/i.test(info.name) && !isEnglishSubj)
        findings.push({ sev: 'HIGH', cat: 'wrong-label', state: key, detail: `tutor label "${info.name}" on subject ${subj}` });
      ledger.push({ key, screen: 'tutor', file: null, checks: { label: info.name, first: info.body.slice(0, 100) } });
    }
    await page.evaluate(() => { try { closeHint(); } catch (e) {} });
  } catch (e) { findings.push({ sev: 'LOW', cat: 'drive-fail', state: `${ctxInfo.age}/${ctxInfo.lang}/${ctxInfo.width}/${subj}-tutor`, detail: String(e).slice(0, 100) }); }
}

async function driveCombo(browser, url, width, lang, age) {
  const ctxInfo = { width, lang, age };
  const ctx = await browser.newContext({ viewport: { width, height: 780 }, deviceScaleFactor: width === 360 ? 2 : 1,
    isMobile: true, hasTouch: true, permissions: [] });
  await ctx.route(/^(?!http:\/\/127\.0\.0\.1)/, r => r.abort().catch(() => {}));
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(curState + ' :: ' + String(e.stack || e).slice(0, 300)));
  await page.addInitScript(() => {
    try { HTMLMediaElement.prototype.play = () => Promise.resolve(); } catch {}
    try { window.speechSynthesis && (window.speechSynthesis.speak = () => {}); } catch {}
    try { window.Audio = class { constructor(){} play(){ return Promise.resolve(); } pause(){} addEventListener(){} removeEventListener(){} set src(v){} }; } catch {}
  });
  await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(900);
  if (age === AGES[0]) await captureState(page, ctxInfo, 'entry', { scrollShot: true }); // entry is age-independent: once per (w,lang)
  // profile + language
  await page.evaluate(a => { try { startDemo(a); } catch (e) {} }, age);
  await page.waitForTimeout(500);
  if (lang === 'en') { await page.evaluate(() => { try { setUILang('en'); selectProfile('guest'); } catch (e) {} }); await page.waitForTimeout(400); }
  await captureState(page, ctxInfo, 'home', { scrollShot: true });
  // enumerate home tiles from the LIVE DOM
  const tiles = await page.evaluate(() => [...document.querySelectorAll('.subj')].map((el, i) => ({
    i, name: ((el.querySelector('.s-name,.w-nm') || {}).textContent || 'tile' + i).trim(),
    onclick: (el.getAttribute('onclick') || '').slice(0, 120) })));
  const goHome = async () => { await page.evaluate(l => { try { if (l === 'en' && window.UILANG !== 'en') setUILang('en'); selectProfile('guest'); } catch (e) {} }, lang); await page.waitForTimeout(450); };
  for (const t of tiles) {
    const m = t.onclick.match(/openSubj\(event,'([^']+)'\)/);
    const subj = m ? m[1] : null;
    try {
      await goHome();
      await page.evaluate(i => { const el = document.querySelectorAll('.subj')[i]; if (el) el.click(); }, t.i);
      await page.waitForTimeout(750);
      if (subj) {
        // diag offer? capture as the placement state, then skip into the menu
        const diag = await page.evaluate(() => !!document.querySelector('.diag-offer'));
        if (diag) {
          await captureState(page, ctxInfo, `${subj}-diag-offer`, { wait: 100 });
          // drive ONE real diagnostic question for math (the placement/diagnostic §8 state)
          if (subj === 'math' || subj === 'english') {
            await page.evaluate(() => { const b = document.querySelector('.diag-offer .btn-primary'); if (b) b.click(); });
            await captureState(page, ctxInfo, `${subj}-diag-q1`, { wait: 900 });
            await goHome();
            await page.evaluate(i => { const el = document.querySelectorAll('.subj')[i]; if (el) el.click(); }, t.i);
            await page.waitForTimeout(600);
          }
          await page.evaluate(() => { const b = document.querySelector('.diag-offer .btn-ghost'); if (b) b.click(); });
          await page.waitForTimeout(500);
        }
        const isMenu = await page.evaluate(() => !!document.querySelector('.mode-grid'));
        await captureState(page, ctxInfo, `${subj}-menu`, { scrollShot: true, wait: 150 });
        if (!isMenu) continue;
        const modes = await page.evaluate(() => [...document.querySelectorAll('.mode')].map((el, i) => ({
          i, name: ((el.querySelector('.m-name') || {}).textContent || 'mode' + i).trim(),
          locked: el.classList.contains('locked'), stack: el.classList.contains('stack') })));
        let upsellShot = false, tutorDone = false;
        for (const md of modes) {
          try {
            // reset via the Node-side goHome helper (selectProfile('guest')), NOT the app's goHome():
            // app goHome() nulls `profile` and shows the picker — openMenu() after it renders a menu
            // with profile=null and the next mode start crashes at levelOf (2026-07-13 run, 186 pageerrors).
            await goHome();
            await page.evaluate(s => { try { openMenu(s); } catch (e) {} }, subj);
            await page.waitForTimeout(450);
            // dismiss a re-shown diag offer
            await page.evaluate(() => { const b = document.querySelector('.diag-offer .btn-ghost'); if (b) b.click(); });
            await page.waitForTimeout(200);
            await page.evaluate(i => { const el = document.querySelectorAll('.mode')[i]; if (el) el.click(); }, md.i);
            await page.waitForTimeout(850);
            if (md.locked) {
              if (!upsellShot) { await captureState(page, ctxInfo, `${subj}-upsell`, { wait: 100 }); upsellShot = true; }
              continue;
            }
            // teach gate?
            await page.evaluate(() => { const b = document.querySelector('#teachov button,#teachYes2,.teach-yes'); if (b) b.click(); });
            await page.waitForTimeout(350);
            if (md.stack) { // a stack opens more cards (phrases/topics): shoot, then enter first play tile
              await captureState(page, ctxInfo, `${subj}-${md.name}-cards`, { wait: 100, scrollShot: true });
              await page.evaluate(() => { const el = document.querySelector('.mode.play,.mode:not(.stack)'); if (el) el.click(); });
              await page.waitForTimeout(800);
            }
            await captureState(page, ctxInfo, `${subj}-${md.name}`);
            if (!tutorDone) { await openTutorAndCapture(page, ctxInfo, subj); tutorDone = true; }
          } catch (e) {
            findings.push({ sev: 'LOW', cat: 'drive-fail', state: `${age}/${lang}/${width}/${subj}-${md.name}`, detail: String(e).slice(0, 100) });
          }
        }
      } else {
        // non-menu tile: talk / move / wordsearch / draw / direct game — shoot whatever rendered
        await captureState(page, ctxInfo, `${t.name}`, { scrollShot: true });
        // talk: one level deeper into a deck card
        if (/openTalk/.test(t.onclick)) {
          await page.evaluate(l => { const d = document.querySelector('.talk-deck.' + (l === 'en' ? 'en' : 'ka')) || document.querySelector('.talk-deck'); if (d) d.click(); }, lang);
          await captureState(page, ctxInfo, `talk-card`, { wait: 800 });
        }
        // wordsearch / draw / shapes / break render directly; already shot. Try tutor if a game appeared.
        const inGame = await page.evaluate(() => !!document.querySelector('#gscreen'));
        if (inGame) await openTutorAndCapture(page, ctxInfo, slug(t.name));
      }
    } catch (e) {
      findings.push({ sev: 'LOW', cat: 'drive-fail', state: `${age}/${lang}/${width}/${t.name}`, detail: String(e).slice(0, 100) });
    }
  }
  for (const e of [...new Set(errs)]) findings.push({ sev: 'HIGH', cat: 'pageerror', state: `${age}/${lang}/${width}`, detail: e });
  await ctx.close();
  console.log(`[done] w=${width} lang=${lang} age=${age} · tiles=${tiles.length} · findings so far=${findings.length} · shots=${shotN}`);
}

(async () => {
  const exe = findChrome();
  if (!exe) { console.error('no chromium found'); process.exit(2); }
  const server = await serve();
  const url = `http://127.0.0.1:${server.address().port}/index.html?app=1&notrack=1`;
  const browser = await chromium.launch({ headless: true, executablePath: exe, args: ['--no-sandbox', '--mute-audio'] });
  console.log(`§8 visual QA · ${url} · widths=${WIDTHS} langs=${LANGS} ages=${AGES}`);
  for (const width of WIDTHS) for (const lang of LANGS) for (const age of AGES) {
    try { await driveCombo(browser, url, width, lang, age); }
    catch (e) { findings.push({ sev: 'HIGH', cat: 'combo-fail', state: `${age}/${lang}/${width}`, detail: String(e).slice(0, 140) }); console.error('combo-fail', width, lang, age, e.message); }
  }
  await browser.close(); server.close();
  writeFileSync(join(OUT, 'findings.json'), JSON.stringify(findings, null, 1));
  writeFileSync(join(OUT, 'ledger.json'), JSON.stringify(ledger, null, 1));
  const bySev = findings.reduce((a, f) => (a[f.sev] = (a[f.sev] || 0) + 1, a), {});
  console.log(`\nDONE · states=${ledger.length} · shots=${shotN} · findings=${findings.length}`, bySev);
})().catch(e => { console.error('FATAL', e); process.exit(2); });
