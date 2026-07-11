// NB-19 sweep: drive the app in ENGLISH through the main INTERFACE surfaces and dump every
// Georgian-containing VISIBLE text node still showing, per screen. This finds real interface gaps
// empirically (§14: run the app for UI classes) instead of guessing from noisy static literals.
// Teaching content will also appear — classify by hand; only interface chrome gets mapped.
// 2026-07-11: extended to parent-dashboard deep screens (goal insight, goal/delete modals,
// admin, feedback, transfer) + v1.357 worlds home (age≤7) — the NB-19 dynamic-chrome tail.
import { startStaticServer, launchBrowser, SHOT_DIR } from './_harness.mjs';

const { port, close:closeServer } = await startStaticServer();
const browser = await launchBrowser();

const SEED = { onboarded: true, authed: true, kids: [
  { id: 'k5', name: 'ნიკა', age: 5 }, { id: 'k9', name: 'თაკო', age: 9 }] };

const ctx = await browser.newContext({ viewport:{width:412,height:915} });
const page = await ctx.newPage();
await page.addInitScript(s => {
  localStorage.setItem('nikolearn_p2', JSON.stringify(s));
  localStorage.setItem('niko_uilang', 'en');
}, SEED);
page.on('pageerror', e=>console.log('  [pageerror]', String(e).slice(0,160)));

await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
await page.evaluate(()=>{ try{ window.speechSynthesis&&(window.speechSynthesis.speak=()=>{}); }catch{} window.playClipSeq=()=>true; });
await page.evaluate(()=>{ window.setUILang && window.setUILang('en'); });

const collectKa = ()=>page.evaluate(()=>{
  const ka=/[Ⴀ-ჿ]/;
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
  const out=new Set(); let n;
  while((n=w.nextNode())){
    const v=(n.nodeValue||'').trim();
    if(!v||!ka.test(v))continue;
    const el=n.parentElement;
    if(!el)continue;
    const r=el.getBoundingClientRect();
    if(r.width===0&&r.height===0)continue;             // skip hidden
    out.add(v.replace(/\s+/g,' ').slice(0,80));
  }
  return [...out];
});

async function screen(name, setup){
  try{ await page.evaluate(setup); }catch(e){ console.log('  ('+name+' setup err '+String(e).slice(0,80)+')'); }
  await page.waitForTimeout(350);
  await page.evaluate(()=>{ window.UILANG==='en' && window.applyLang && window.applyLang(document.body); }); // re-apply after re-render
  await page.waitForTimeout(120);
  const ka = await collectKa();
  await page.screenshot({ path: `${SHOT_DIR}/i18n-en-${name}.png`, fullPage:true });
  console.log(`\n===== ${name} — Georgian still visible (${ka.length}) =====`);
  console.log(ka.map(s=>'  '+s).join('\n'));
}

await screen('home', ()=>{ startDemo(6); });
await screen('menu-math', ()=>{ openMenu('math'); });
await screen('menu-kaalpha', ()=>{ openMenu('ka-alpha'); });
await screen('round-math', ()=>{ startGame('math'); });
// ── NB-19 tail surfaces (2026-07-11) ──
await screen('worlds-home-age5', ()=>{ selectProfile('k5'); });
await screen('parent-dash-goal', ()=>{ pickGoal('k5','words',30,'30 ინგლისური სიტყვა'); }); // saves + re-renders parentDash
await screen('goal-modal', ()=>{ kidGoalModal('k5'); });
await screen('delete-modal', ()=>{ const m=document.getElementById('goalmodal'); if(m)m.remove(); confirmDelete('k5'); });
await screen('admin', ()=>{ const m=document.getElementById('delmodal'); if(m)m.remove(); adminView(); });
await screen('feedback', ()=>{ feedbackForm(); });
await screen('transfer', ()=>{ backupCode(); });

await browser.close();
closeServer();
console.log('\nscreens in '+SHOT_DIR);
process.exit(0);
