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
    if (rc.left < -1 || rc.right > vw + 1) problems.push('overflow-x');
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
  return out;
};

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
  const STATES = [
    { name: 'entry', drive: async () => {} },
    { name: 'home2', drive: async (p) => { await p.evaluate(() => { try { enterApp(); } catch {} }); } },
    { name: 'game',  drive: async (p) => { await p.evaluate(() => { try { startDemo(7); } catch {} }); } },
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
      if (SHOTS) await page.screenshot({ path: join('output', `vg-${w}-${st.name}.png`), fullPage: false }).catch(()=>{});
      const bad = r.overflowX || r.offenders.length;
      if (bad) fail++;
      console.log(`\n[${w}px ${st.name}] screen=${r.screen} vh=${r.vh} overflowX=${r.overflowX} offenders=${r.offenders.length}`);
      for (const o of r.offenders) console.log(`   • ${o.el.padEnd(18)} ${o.size.padEnd(9)} ${o.pos.padEnd(30)} ${o.problems.join(',')}`);
    }
    await ctx.close();
  }
  await browser.close(); server.close();
  console.log(`\nvisual-gate: ${fail ? '❌ '+fail+' width(s) with issues' : '✅ all widths clean'}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('visual-gate ERROR:', e.message); process.exit(2); });
