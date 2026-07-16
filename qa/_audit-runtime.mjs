// Runtime verdict-deciders for audit findings 14, 15, 27, 28 (§6c / §14 step 3).
// One-off: these DECIDE verdicts the source cannot decide. Not a regression test (the `_` prefix
// is this dir's convention for one-shot harnesses). Reuses _harness.mjs so the chromium path and
// the static server keep ONE source, per its own header note.
//
// METHOD RULE (earned the hard way on #5, 2026-07-15): drive the real control, never a synthetic
// click; and before writing any NEGATIVE verdict, prove the harness can go POSITIVE. Every
// "absent" claim below is paired with a discriminator showing the check can detect presence.
import { launchBrowser, startStaticServer } from './_harness.mjs';

const { port, close } = await startStaticServer();
const U = `http://localhost:${port}`;
const browser = await launchBrowser();
const say = (s) => console.log(s);

// ================================================================================================
say('\n=== #27 - do the share tables ACTUALLY overflow? (agent predicts NO; audit says YES) ===');
// Agent's static read: all widths are percentages, no min-width, no nowrap => they COMPRESS.
// Audit: "wide tables, no responsive rule => overflow on mobile". Only a render decides it.
const SHARE = ['decision-model.html', 'guidebook.html', 'index.html', 'strategy-v2.html', 'strategy-v2-2026-06-10.html', 'lane-b-2026-06-10.html'];
let overflowSeen = 0;
for (const w of [320, 360, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 800 } });
  for (const f of SHARE) {
    await page.goto(`${U}/share/7731b5f78d82/${f}`, { waitUntil: 'load' });
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const tabs = [...document.querySelectorAll('table')].map((t, i) => ({
        i, tw: Math.round(t.scrollWidth), cw: Math.round(t.parentElement.clientWidth),
      })).filter(t => t.tw > t.cw + 1);
      return { page: Math.round(de.scrollWidth), client: Math.round(de.clientWidth), nTables: document.querySelectorAll('table').length, tabs };
    });
    const pageOver = r.page > r.client + 1;
    if (pageOver || r.tabs.length) { overflowSeen++; say(`  ${w}px ${f}: PAGE ${r.page}>${r.client} ${pageOver ? 'OVERFLOWS' : 'ok'} | overflowing tables: ${JSON.stringify(r.tabs)}`); }
    else { say(`  ${w}px ${f}: OK - page ${r.page}<=${r.client}, all ${r.nTables} table(s) fit`); }
  }
  await page.close();
}
say(`  => overflow instances across 6 pages x 3 widths: ${overflowSeen}`);

// ================================================================================================
say('\n=== #28 - is #themeBtn the real target? (agent says the audit names the WRONG element) ===');
const p28 = await browser.newPage({ viewport: { width: 390, height: 844 } });
await p28.goto(`${U}/landing.html`, { waitUntil: 'load' });
await p28.waitForTimeout(400);
const r28 = await p28.evaluate(() => {
  const btn = document.querySelector('#themeBtn');
  const pop = document.querySelector('.theme-pop');
  const lang = document.querySelector('#langtgl');
  const cb = getComputedStyle(btn), cp = getComputedStyle(pop);
  return {
    themeBtn_pointerEvents: cb.pointerEvents,
    themeBtn_ariaExpanded: String(btn.getAttribute('aria-expanded')),
    pop_visibility: cp.visibility, pop_opacity: cp.opacity, pop_display: cp.display,
    lang_ariaPressed: lang ? String(lang.getAttribute('aria-pressed')) : '(no #langtgl)',
    lang_ariaExpanded: lang ? String(lang.getAttribute('aria-expanded')) : '(no #langtgl)',
  };
});
say('  ' + JSON.stringify(r28));
const lies = r28.themeBtn_pointerEvents === 'none' && r28.themeBtn_ariaExpanded === 'false' &&
             r28.pop_visibility === 'visible' && r28.pop_opacity === '1';
say(`  => #themeBtn says aria-expanded=false while its pop IS visible AND it cannot be clicked: ${lies ? 'CONFIRMED' : 'NOT reproduced'}`);
say(`  => #langtgl aria-pressed=${r28.lang_ariaPressed}, aria-expanded=${r28.lang_ariaExpanded} => the audit's named target is ${r28.lang_ariaExpanded === 'null' ? 'WRONG (it has no aria-expanded to lie with)' : 'right'}`);
await p28.screenshot({ path: 'C:/Users/gela.shonia/audit-28-themebtn.jpeg', quality: 80, type: 'jpeg' });

// ================================================================================================
say('\n=== #14 - does the carousel auto-advance with ZERO interaction? are the dots focusable? ===');
const p14 = await browser.newPage({ viewport: { width: 390, height: 844 } });
await p14.goto(`${U}/landing.html`, { waitUntil: 'load' });
await p14.waitForTimeout(300);
const before = await p14.evaluate(() => [...document.querySelectorAll('.phone-dots i')].map(d => d.className || '-').join('|'));
await p14.waitForTimeout(3600);
const after = await p14.evaluate(() => [...document.querySelectorAll('.phone-dots i')].map(d => d.className || '-').join('|'));
say(`  dots before: "${before}"   after 3.6s of doing NOTHING: "${after}"`);
say(`  => auto-advances unattended: ${before !== after ? 'CONFIRMED' : 'NOT reproduced'}`);
// Discriminator: prove the harness CAN observe focus before claiming the dots refuse it.
const foc = await p14.evaluate(() => {
  const d = document.querySelector('.phone-dots i');
  d.focus(); const dotTakesFocus = document.activeElement === d;
  const b = document.querySelector('.menu-toggle');
  b.focus(); const harnessCanSeeFocus = document.activeElement === b;
  return { dotTag: d.tagName, dotTabIndex: d.tabIndex, dotTakesFocus, harnessCanSeeFocus };
});
say(`  ${JSON.stringify(foc)}`);
say(`  => dots unfocusable, discriminator passed (a real button DID take focus = ${foc.harnessCanSeeFocus}): ${!foc.dotTakesFocus && foc.harnessCanSeeFocus ? 'CONFIRMED' : 'CHECK'}`);

// ================================================================================================
say('\n=== #15 - does the mobile menu expose an expanded state? ===');
const p15 = await browser.newPage({ viewport: { width: 390, height: 844 } });
await p15.goto(`${U}/landing.html`, { waitUntil: 'load' });
await p15.waitForTimeout(300);
const pre = await p15.evaluate(() => ({ aria: String(document.querySelector('.menu-toggle').getAttribute('aria-expanded')), cls: document.querySelector('.nav-links').className }));
await p15.click('.menu-toggle');   // METHOD RULE: the browser's own click, not el.click()
await p15.waitForTimeout(300);
const post = await p15.evaluate(() => ({ aria: String(document.querySelector('.menu-toggle').getAttribute('aria-expanded')), cls: document.querySelector('.nav-links').className }));
say(`  before click: ${JSON.stringify(pre)}`);
say(`  after  click: ${JSON.stringify(post)}`);
say(`  => the menu REALLY opened (class changed), so the click worked = harness positive: ${pre.cls !== post.cls}`);
say(`  => aria-expanded still absent after opening: ${post.aria === 'null' ? 'CONFIRMED' : 'NOT reproduced'}`);
await p15.screenshot({ path: 'C:/Users/gela.shonia/audit-15-menu-open.jpeg', quality: 80, type: 'jpeg' });

await browser.close();
close();
say('\ndone');
