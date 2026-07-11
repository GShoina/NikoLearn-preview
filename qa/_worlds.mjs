// „ბუს ქვეყანა" behavioral harness (concept v2, 2026-07-10).
// Verifies: ≤5 world-home, 6-7 world-home with Kings gold (names kept), 8+ classic home (regression),
// world tap → correct menu with play-labels, inner-label↔clip mirror, zero pageerrors.
// Run: node qa/_worlds.mjs   (wired into qa/behavioral.mjs → pre-push)
import { launchBrowser, startStaticServer, makeChk, ROOT, SHOT_DIR } from './_harness.mjs';
import fs from 'node:fs';

const { chk, fails } = makeChk();
const srv = await startStaticServer();
const URL = `http://localhost:${srv.port}/index.html?app=1`;
const browser = await launchBrowser();

const SEED = { onboarded: true, authed: true, kids: [
  { id: 'k5', name: 'ნიკა', age: 5 }, { id: 'k7', name: 'გიო', age: 7 }, { id: 'k9', name: 'თაკო', age: 9 }] };

async function open(profileId) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  const page = await ctx.newPage();
  await page.addInitScript(s => localStorage.setItem('nikolearn_p2', JSON.stringify(s)), SEED);
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof selectProfile === 'function' && typeof worldsOn === 'function', null, { timeout: 10000 });
  await page.evaluate(id => selectProfile(id), profileId);
  await page.waitForTimeout(350);
  return { ctx, page, errs };
}
const txt = (page) => page.evaluate(() => document.body.innerText);

// ── 1. age 5: world-home ──
{
  const { ctx, page, errs } = await open('k5');
  const t = await txt(page);
  chk('age5: ბუს ქვეყანა kicker', t.includes('ბუს ქვეყანა'));
  chk('age5: bigplay ითამაშე!', await page.locator('.bigplay').count() === 1);
  chk('age5: world cards render', await page.locator('.subj.wld').count() === 8);
  for (const nm of ['რიცხვების სამეფო', 'ასოების ქალაქი', 'ინგლისურის კუნძული', 'დათვლის ჯუნგლები', 'საუბრის ბუდე', 'მოძრაობის მოედანი', 'სიტყვების ძებნა', 'ხატვის სტუდია'])
    chk(`age5: world "${nm}"`, t.includes(nm));
  chk('age5: NO Kings on home', !t.includes('კინგსი'));
  // owner 2026-07-11: world-card icon+name must sit BALANCED (equal space top/bottom), not jammed low,
  // and be legibly sized. Guards the base-.subj justify-content:flex-end from silently re-leaking in.
  const bal = await page.evaluate(() => {
    const c = document.querySelector('.subj.wld'); const ic = c.querySelector('.w-ico'); const nm = c.querySelector('.w-nm');
    const cr = c.getBoundingClientRect(), ir = ic.getBoundingClientRect(), nr = nm.getBoundingClientRect();
    return { top: ir.top - cr.top, bot: cr.bottom - nr.bottom, ico: parseFloat(getComputedStyle(ic).fontSize), nmF: parseFloat(getComputedStyle(nm).fontSize) };
  });
  chk(`age5: card content vertically balanced (top ${Math.round(bal.top)} ≈ bot ${Math.round(bal.bot)})`, Math.abs(bal.top - bal.bot) <= 14);
  chk(`age5: icon legible (${Math.round(bal.ico)}px ≥ 33)`, bal.ico >= 33);
  chk(`age5: name legible (${Math.round(bal.nmF)}px ≥ 14)`, bal.nmF >= 14);
  await page.screenshot({ path: `${SHOT_DIR}/worlds_age5_home.png` });
  // tap რიცხვების სამეფო → counting menu with play-label + world topbar
  await page.locator('.subj.wld', { hasText: 'რიცხვების სამეფო' }).click();
  await page.waitForTimeout(500);
  const m = await txt(page);
  chk('age5: counting menu opens (დათვალე)', m.includes('დათვალე'));
  chk('age5: ციფრების გამოცანა (was ტესტი)', m.includes('ციფრების გამოცანა') && !m.includes('ციფრების ტესტი'));
  chk('age5: topbar = world name', m.includes('რიცხვების სამეფო'));
  chk('age5: no pageerrors', errs.length === 0);
  await ctx.close();
}
// ── 2. age 5: ka-alpha + en-alpha inner play-labels ──
{
  const { ctx, page, errs } = await open('k5');
  await page.locator('.subj.wld', { hasText: 'ასოების ქალაქი' }).click();
  await page.waitForTimeout(500);
  const ka = await txt(page);
  for (const nm of ['ასოების სახლები', 'გამოცანების კოშკი', 'ზღაპრების ხე', 'ჯადოსნური კალამი'])
    chk(`age5 ka-alpha: "${nm}"`, ka.includes(nm));
  chk('age5 ka-alpha: ააწყვე kept (play verb)', ka.includes('ააწყვე'));
  chk('age5 ka-alpha: NB-16 gate intact (no წინადადება)', !ka.includes('წინადადება'));
  await page.screenshot({ path: `${SHOT_DIR}/worlds_age5_ka.png` });
  await page.evaluate(() => selectProfile('k5'));
  await page.waitForTimeout(300);
  await page.locator('.subj.wld', { hasText: 'ინგლისურის კუნძული' }).click();
  await page.waitForTimeout(500);
  const en = await txt(page);
  chk('age5 en-alpha: ABC ნაპირი', en.includes('ABC ნაპირი'));
  chk('age5 en-alpha: განძის ძიება', en.includes('განძის ძიება'));
  chk('age5 inner: no pageerrors', errs.length === 0);
  await ctx.close();
}
// ── 3. age 7: world-home with Kings gold, names kept; math inner names ──
{
  const { ctx, page, errs } = await open('k7');
  const t = await txt(page);
  chk('age7: bigplay present', await page.locator('.bigplay').count() === 1);
  chk('age7: Kings cards kept by name', t.includes('კინგსი ინგლისური') && t.includes('კინგსი მათემატიკა'));
  chk('age7: Kings gold class', await page.locator('.subj.wld.whue-kings').count() === 2);
  chk('age7: worlds for own subjects', t.includes('ინგლისურის კუნძული') && t.includes('დათვლის ჯუნგლები'));
  await page.screenshot({ path: `${SHOT_DIR}/worlds_age7_home.png` });
  await page.locator('.subj.wld', { hasText: 'დათვლის ჯუნგლები' }).click();
  await page.waitForTimeout(500);
  const m = await txt(page);
  chk('age7 math: შეკრების ბილიკი', m.includes('შეკრების ბილიკი'));
  chk('age7 math: გამოკლების მდინარე', m.includes('გამოკლების მდინარე'));
  chk('age7 math: იპოვე წესი (was კანონზომიერება)', m.includes('იპოვე წესი'));
  await page.locator('.cat-chip', { hasText: 'ყველა თემა' }).first().click(); // shapes lives past CAP-8 → picker
  await page.waitForTimeout(400);
  const pk = await txt(page);
  chk('age7 topics picker: ფიგურების ქვეყანა', pk.includes('ფიგურების ქვეყანა'));
  chk('age7 topics picker: შეკრების ბილიკი (sweep)', pk.includes('შეკრების ბილიკი'));
  chk('age7: no pageerrors', errs.length === 0);
  await ctx.close();
}
// ── 4. age 9: classic home regression (NO worlds) ──
{
  const { ctx, page, errs } = await open('k9');
  const t = await txt(page);
  chk('age9: NO bigplay', await page.locator('.bigplay').count() === 0);
  chk('age9: NO world cards', await page.locator('.subj.wld').count() === 0);
  chk('age9: classic subjects kept', t.includes('მათემატიკა') && t.includes('ინგლისური'));
  chk('age9: continue card kept', await page.locator('.home-cont').count() === 1);
  // ka-alpha menu keeps classic labels for readers
  await page.evaluate(() => openMenu('ka-alpha'));
  await page.waitForTimeout(300);
  const ka = await txt(page);
  chk('age9 ka-alpha: classic ისწავლე ასოები', ka.includes('ისწავლე ასოები'));
  chk('age9 ka-alpha: classic ტესტები', ka.includes('ტესტები') && !ka.includes('გამოცანების კოშკი'));
  await page.screenshot({ path: `${SHOT_DIR}/worlds_age9_home.png` });
  chk('age9: no pageerrors', errs.length === 0);
  await ctx.close();
}
// ── 5. mirror: every WORLDS/WORLD_INNER name has a manifest clip on disk ──
{
  const worlds = fs.readFileSync(`${ROOT}/niko/worlds.js`, 'utf8');
  const mani = fs.readFileSync(`${ROOT}/niko/audio-manifest.js`, 'utf8');
  const names = [...worlds.matchAll(/nm:'([^']+)'/g)].map(m => m[1])
    .concat([...worlds.matchAll(/(?:learn|quiz|read|trace|shapes|'math-add'|'math-sub'|'math-pat'):'([^']+)'/g)].map(m => m[1]));
  let missing = [];
  for (const nm of new Set(names)) {
    const key = nm.trim().toLowerCase();
    const m = mani.match(new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}":\\s*"([^"]+)"`));
    if (!m) { missing.push(nm); continue; }
    if (!fs.existsSync(`${ROOT}/niko/audio/${m[1]}`) || fs.statSync(`${ROOT}/niko/audio/${m[1]}`).size < 2000) missing.push(nm + ' (file)');
  }
  chk(`mirror: all ${new Set(names).size} world/inner names have real clips${missing.length ? ' [missing: ' + missing.join(', ') + ']' : ''}`, missing.length === 0);
}

await browser.close(); srv.close();
console.log(fails() ? `\n❌ ${fails()} FAILED` : '\n✅ ALL PASS — _worlds.mjs');
process.exit(fails() ? 1 : 0);
