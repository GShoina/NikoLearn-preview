#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════
   NikoLearn — VISUAL QA GATE (assertion-based, headless)
   ────────────────────────────────────────────────────────────────────────
   WHY: qa-check.mjs is static-only (strings/version/audio); it renders NOTHING,
   so a broken LAYOUT (e.g. the v1.320 water-dock HOME button clipping on mobile)
   passed every gate. This actually RENDERS the app at phone widths, drives to the
   real screens, and ASSERTS (not pixel-diff — that's flaky) that key controls are
   inside the viewport, not clipped, not overflowing, and ≥44px tap targets.

   RUN:  node qa/visual-gate.mjs            # gate (exit 1 on any offender)
         node qa/visual-gate.mjs --shots    # also save screenshots to output/

   Uses the already-installed Playwright Chromium (no download); serves the app
   from a tiny local static server; mutes audio; sets ?notrack=1 (owner-excluded).
   ════════════════════════════════════════════════════════════════════════ */
import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync, readdirSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

const ROOT = process.cwd();
const WIDTHS = [320, 360, 390];
const SHOTS = process.argv.includes('--shots');

// Pre-existing sub-44px controls surfaced when NB-94 added section-screen coverage (draw palette +
// dayq). Tracked as NB-95 (a deliberate tap-target design pass, not a regression). Baselined here so
// the gate hard-blocks any NEW sub-44 target on ANY screen while tolerating these known ones — each
// key is removed from this list as NB-95 fixes it, tightening the gate automatically.
const TAP_DEBT = new Set(['dw-stamp', 'dw-color', 'dw-size', 'dayq-say', 'dayq-dot']);
const isTapDebt = (o) => o.problems.length === 1 && o.problems[0].startsWith('tap<') && TAP_DEBT.has(o.el);

// ---- find installed Playwright Chromium (newest), like lighthouse.mjs ----
function findChrome() {
  const base = join(process.env.USERPROFILE || process.env.HOME, 'AppData/Local/ms-playwright');
  let best = '';
  try {
    for (const d of readdirSync(base)) {
      if (d.startsWith('chromium-') && !d.includes('headless_shell')) {
        const exe = join(base, d, 'chrome-win64', 'chrome.exe');
        if (existsSync(exe)) best = exe; // last = newest (sorted asc)
      }
    }
  } catch {}
  return best;
}

// ---- tiny static server ----
const MIME = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.mp3':'audio/mpeg', '.webmanifest':'application/manifest+json',
  '.woff2':'font/woff2', '.ttf':'font/ttf', '.ico':'image/x-icon' };
function serve() {
  return new Promise(res => {
    const s = createServer((req, r) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p === '/' ) p = '/index.html';
      const fp = join(ROOT, p);
      if (!fp.startsWith(ROOT) || !existsSync(fp) || statSync(fp).isDirectory()) { r.writeHead(404); return r.end('404'); }
      r.writeHead(200, { 'Content-Type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream' });
      r.end(readFileSync(fp));
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

// runs INSIDE the page: checks every visible control is inside the viewport, not
// horizontally overflowing, and ≥44px. Returns offenders with rects.
const PROBE = (minPx) => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const out = { offenders: [], overflowX: false, screen: '', vw, vh };
  out.overflowX = document.documentElement.scrollWidth > vw + 1;
  const active = document.querySelector('.screen.show, .screen.active, #app .screen:not(.hidden)') ||
                 document.querySelector('#gscreen') || document.body;
  out.screen = (active && (active.id || active.className)) || '(none)';
  const isPinned = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) {
      const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky' || p === 'absolute') return true; } return false; };
  // an item inside a horizontal swipe-strip (overflow-x:auto/scroll ancestor) legitimately extends
  // past the viewport — you scroll to reach it. Don't false-flag it as broken overflow-x (NB-94
  // follow-up: section-screen coverage surfaced draw's strip thumbnails). The doc-level out.overflowX
  // still catches a strip that ITSELF overflows the viewport.
  const inHScroller = (el) => { for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const ox = getComputedStyle(n).overflowX; if (ox === 'auto' || ox === 'scroll') return true; } return false; };
  const visible = (el) => { const s = getComputedStyle(el);
    return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0); };
  // the floating bottom dock/nav, if shown — used to catch content it covers
  let dock = null;
  for (const n of document.querySelectorAll('.bottomnav')) { const r = n.getBoundingClientRect();
    if (r.height > 0 && visible(n) && !n.classList.contains('hidden')) dock = r; }
  const SEL = 'button,[onclick],.opt,.speakbtn,.chip,.ctl,input,.ai-chip,.mic,.vtgl,.navemoji,[data-nav],.pcard,.subj';
  const seen = new Set();
  for (const el of document.querySelectorAll(SEL)) {
    const rc = el.getBoundingClientRect();
    if (rc.width === 0 && rc.height === 0 || !visible(el)) continue;
    const raw = el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className;
    const key = (String(raw||'').split(' ')[0] || el.tagName.toLowerCase()) +
                (el.getAttribute && el.getAttribute('data-nav') ? '['+el.getAttribute('data-nav')+']' : '');
    const problems = [];
    const pinned = isPinned(el);
    if (rc.top < -1) problems.push('clip-top');                       // unreachable above scroll
    if ((rc.left < -1 || rc.right > vw + 1) && !inHScroller(el)) problems.push('overflow-x');
    if (pinned && rc.bottom > vh + 1) problems.push('pinned-offscreen'); // fixed control below fold
    // content UNREACHABLE behind the floating dock = the real bug (a tile that even at
    // max scroll stays under the dock). Mid-list tiles behind the dock AT REST are normal
    // (they scroll into view) — only flag if it can never clear the dock top.
    const inNav = el.closest('.bottomnav');
    if (dock && !inNav && !pinned) {
      const hov = Math.min(rc.right, dock.right) - Math.max(rc.left, dock.left);
      if (hov > 14) {
        const sc = el.closest('#app') || document.scrollingElement || document.documentElement;
        const sr = sc.getBoundingClientRect();
        const maxScroll = Math.max(0, sc.scrollHeight - sc.clientHeight);
        const contentBottom = (rc.bottom - sr.top) + (sc.scrollTop || 0);
        const atMaxScroll = sr.top + (contentBottom - maxScroll); // element bottom in viewport when fully scrolled
        if (atMaxScroll > dock.top + 6) problems.push('under-dock'); // still hidden even scrolled = unreachable
      }
    }
    if ((el.tagName === 'BUTTON' || el.matches('[onclick],[data-nav],input,.opt')) &&
        Math.min(rc.width, rc.height) < minPx) problems.push('tap<'+minPx);
    if (!problems.length) continue;
    if (seen.has(key + problems.join())) continue; seen.add(key + problems.join());
    out.offenders.push({ el: key, size: Math.round(rc.width)+'x'+Math.round(rc.height),
      pos: 't'+Math.round(rc.top)+' b'+Math.round(rc.bottom), problems });
  }
  // NB-94 CLASS (draw v1.371): horizontal swipe-strips (.dw-tmpls/.dw-stamps, .mv2 .rail, …) must
  // HIDE their native scrollbar on mobile — a child swipes, they never drag a grey bar. A shown
  // native h-scrollbar consumes box height (offsetHeight>clientHeight); scrollbar-width:none makes
  // them equal. The doc-level overflowX check above CAN'T see this (the strip scrolls on purpose),
  // which is exactly why draw shipped broken — plus the gate never rendered section screens at all.
  out.hbars = [];
  for (const el of document.querySelectorAll('*')) {
    if (el === document.documentElement || el === document.body) continue;
    const cs = getComputedStyle(el);
    if (cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') continue;
    if (el.scrollWidth <= el.clientWidth + 1) continue;   // not actually overflowing → no bar to show
    if (cs.scrollbarWidth === 'none') continue;           // explicitly hidden = the correct swipe-strip pattern
    if (!visible(el)) continue;
    // reaching here = an overflowing horizontal scroller that does NOT hide its native scrollbar.
    // We deliberately do NOT measure rendered bar height: headless chromium paints OVERLAY bars (0px),
    // so offsetHeight-clientHeight is always 0 here and would never fire (verified 2026-07-23). But on
    // the child's real device (Windows/Android classic bars) a grey native bar renders across the
    // strip — exactly NB-94. The computed-style condition is platform-independent, so it catches the
    // class on every push regardless of how this browser happens to paint scrollbars.
    const raw = el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className;
    out.hbars.push({ el: (String(raw||'').split(' ')[0] || el.tagName.toLowerCase()), sbw: cs.scrollbarWidth || 'auto' });
  }
  return out;
};

// runs INSIDE the page WITH a screenshot of the current viewport (base64) — samples the
// ACTUAL rendered pixel behind each label (canvas→sRGB, so oklch/gradients are handled) and
// asserts WCAG AA text contrast, plus flags any absolute badge (▶ / pill / tap-hint) that
// physically overlaps a text label. This closes the two blind spots PROBE never checked:
// low-contrast text on the jelly cards, and badge-over-text occlusion (VIS-7/VIS-9).
const CONTRAST_PROBE = ({ b64 }) => new Promise(async (resolve) => {
  const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
  const dpr = img.width / window.innerWidth; // screenshot is deviceScaleFactor-scaled
  const px = (x, y) => { const d = g.getImageData(Math.max(0, Math.min(cv.width - 1, Math.round(x * dpr))),
    Math.max(0, Math.min(cv.height - 1, Math.round(y * dpr))), 1, 1).data; return [d[0], d[1], d[2]]; };
  const lin = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const lum = ([r, gg, b]) => .2126 * lin(r) + .7152 * lin(gg) + .0722 * lin(b);
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };
  const toRGB = (() => { const c = document.createElement('canvas'); c.width = c.height = 4; const x = c.getContext('2d', { willReadFrequently: true });
    return col => { x.clearRect(0, 0, 4, 4); x.fillStyle = '#000'; x.fillRect(0, 0, 4, 4); x.fillStyle = col; x.fillRect(0, 0, 4, 4); const d = x.getImageData(1, 1, 1, 1).data; return [d[0], d[1], d[2]]; }; })();
  const vw = window.innerWidth, vh = window.innerHeight;
  const vis = el => { const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0); };
  const TEXT = '.s-name,.s-sub,.m-name,.m-sub,.mode .m-name,.mode .m-sub';
  const BADGE = '.play-badge,.s-badge,.tap-hint';
  const badges = [...document.querySelectorAll(BADGE)].filter(vis).map(b => b.getBoundingClientRect()).filter(r => r.width);
  // PER-LINE ink boxes (Range.getClientRects) — an .s-sub is card-width but its glyphs are
  // narrower and may wrap; using the union box false-flags the corner tap-hint AND samples bg in
  // the between-lines gap. Per-line rects fix both: sample bg just past each line's own ink, and
  // test badge overlap against each line box.
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
    // worst-case contrast across lines: sample the card bg just past each line's ink, but NEVER
    // on a badge (a ▶/pill would give a false low ratio vs the text). Try right-of-ink then
    // left-of-ink; skip any candidate that lands inside a badge rect.
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
    if (problems.length) out.push({ el: (String(t.className).split(' ')[0]), txt, c, size: Math.round(fs) + 'px', problems: [...new Set(problems)] });
  }
  resolve(out);
});

(async () => {
  const exe = findChrome();
  const server = await serve();
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/index.html?app=1&notrack=1`;
  const browser = await chromium.launch({ headless: true, executablePath: exe || undefined,
    args: ['--no-sandbox'] });
  if (SHOTS) mkdirSync('output', { recursive: true });

  // states to sweep per width — drive via the app's own global fns, then probe.
  // home2 = water-dock footer (raised HOME button); game = in-round slim dock.
  // Section screens are seeded once by home2/game (guest profile persists on the page), then each
  // section opener is driven and probed. Added after NB-94: the gate used to stop at menu/game and
  // NEVER render a section screen, so draw's broken mobile header + native scrollbars shipped unseen.
  // The owner's class question ("is mobile-first respected in EVERY section?") is now answered by the
  // gate itself on every push, not a one-time manual sweep.
  const STATES = [
    { name: 'entry', drive: async () => {} },
    { name: 'home2', drive: async (p) => { await p.evaluate(() => { try { startDemo(7); selectProfile('guest'); } catch {} }); } },
    { name: 'menu',  drive: async (p) => { await p.evaluate(() => { try { openMenu('math'); } catch {} }); } },
    { name: 'game',  drive: async (p) => { await p.evaluate(() => { try { startDemo(7); } catch {} }); } },
    { name: 'draw',  drive: async (p) => { await p.evaluate(() => { try { startDemo(7); openDraw(); } catch {} }); } },
    { name: 'talk',  drive: async (p) => { await p.evaluate(() => { try { startDemo(7); openTalk(); } catch {} }); } },
    { name: 'dayq',  drive: async (p) => { await p.evaluate(() => { try { startDemo(7); openDayQ(); } catch {} }); } },
    { name: 'eng',   drive: async (p) => { await p.evaluate(() => { try { startDemo(7); openMenu('english'); } catch {} }); } },
  ];

  let fail = 0;
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 780 }, deviceScaleFactor: 2,
      isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    // mute audio/TTS before any app code runs
    await page.addInitScript(() => {
      try { HTMLMediaElement.prototype.play = () => Promise.resolve(); } catch {}
      try { window.speechSynthesis && (window.speechSynthesis.speak = () => {}); } catch {}
    });
    await page.goto(url, { waitUntil: 'networkidle' }).catch(()=>{});
    await page.waitForTimeout(500);
    for (const st of STATES) {
      await st.drive(page).catch(()=>{});
      await page.waitForTimeout(600);
      const r = await page.evaluate(PROBE, 44);
      const shotBuf = await page.screenshot().catch(() => null);
      if (SHOTS) await page.screenshot({ path: join('output', `vg-${w}-${st.name}.png`), fullPage: false }).catch(()=>{});
      let cprobe = [];
      if (shotBuf) cprobe = await page.evaluate(CONTRAST_PROBE, { b64: shotBuf.toString('base64') }).catch(() => []);
      const hardOff = r.offenders.filter(o => !isTapDebt(o));   // structural + any NEW sub-44 target
      const warnOff = r.offenders.filter(isTapDebt);            // known pre-existing tap-debt (NB-95)
      const bad = r.overflowX || hardOff.length || (r.hbars && r.hbars.length) || cprobe.length;
      if (bad) fail++;
      console.log(`\n[${w}px ${st.name}] screen=${r.screen} vh=${r.vh} overflowX=${r.overflowX} offenders=${hardOff.length} hbars=${(r.hbars||[]).length} text-issues=${cprobe.length}${warnOff.length?` (+${warnOff.length} known tap-debt NB-95)`:''}`);
      for (const o of hardOff) console.log(`   • ${o.el.padEnd(18)} ${o.size.padEnd(9)} ${o.pos.padEnd(30)} ${o.problems.join(',')}`);
      for (const o of (r.hbars||[])) console.log(`   ▭ ${o.el.padEnd(18)} h-scroller w/ scrollbar-width:${o.sbw} — must be 'none' on mobile (NB-94 class)`);
      for (const o of warnOff) console.log(`   ◦ ${o.el.padEnd(18)} ${o.size.padEnd(9)} known tap-debt (NB-95) ${o.problems.join(',')}`);
      for (const o of cprobe) console.log(`   ✎ ${o.el.padEnd(10)} "${o.txt}" ${o.size} ${o.problems.join(',')}`);
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\nvisual-gate: ${fail ? '❌ '+fail+' width(s) with issues' : '✅ all widths clean'}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('visual-gate ERROR:', e.message); process.exit(2); });
