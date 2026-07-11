// NB-19 verify: the chrome strings backfilled into I18N_MAP actually translate ka→en at runtime,
// and teaching CONTENT stays Georgian. Renders the app, switches UI to English, checks t_en().
import { startStaticServer, launchBrowser, makeChk, SHOT_DIR } from './_harness.mjs';

const { port, close:closeServer } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:915} });
page.on('pageerror', e=>console.log('  [pageerror]', String(e).slice(0,200)));
const { chk, fails } = makeChk();

await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });

// chrome strings that SHOULD now translate
const CHROME = ['დახმარება','PIN-კოდის მოხსნა','დათვლა და ლოგიკა','ანბანი · კითხვა',
  'გააგრძელე, სადაც გაჩერდი','დაამატე ბავშვი','მოგესალმები 👋','მოისმინე ხმა 🔊',
  'ინგლისურის მასწავლებელი','კიდევ ერთი','✓ მიღწეულია!','30 ინგლისური სიტყვა',
  // NB-19 tail 2026-07-11: v1.357 worlds chrome + emoji-prefix retry + comma goal title + delete sentence
  'ითამაშე!','რიცხვების სამეფო','შეკრების ბილიკი','🦉 ბუს ქვეყანა','🌿 დათვლის ჯუნგლები',
  '🎯 დაუსახე მიზანი, ნიკა','ეს სამუდამოდ წაშლის ნიკა-ს და მთელ პროგრესს. დასადასტურებლად საჭიროა'];
// teaching content that MUST stay Georgian (translating these would break the lesson)
const CONTENT = ['ცხენი','წყალი','წითელი','ვაშლი'];

const r = await page.evaluate(({CHROME,CONTENT})=>{
  const t = window.t_en;
  const chrome = CHROME.map(k=>({k, en:t(k), changed:t(k)!==k}));
  const content = CONTENT.map(k=>({k, en:t(k), stayed:t(k)===k}));
  return { hasEngine:typeof t==='function', chrome, content };
}, {CHROME,CONTENT});

chk('i18n engine loaded (t_en present)', r.hasEngine);
r.chrome.forEach(x=>chk(`chrome translates: "${x.k}" -> "${x.en}"`, x.changed));
r.content.forEach(x=>chk(`content STAYS Georgian: "${x.k}"`, x.stayed));

// NB-19 2026-07-11: data-noi18n opt-out must cover ATTRIBUTES too — the delete-confirm
// placeholder is the literal word the parent must TYPE; a translated placeholder breaks the match.
const attrOk = await page.evaluate(()=>{
  const d=document.createElement('div');
  d.innerHTML='<input data-noi18n placeholder="წაშლა"><input id="tr" placeholder="დაწერე…">';
  document.body.appendChild(d);
  window.setUILang && window.setUILang('en');
  window.applyLang && window.applyLang(d);
  const keep=d.querySelector('[data-noi18n]').getAttribute('placeholder')==='წაშლა';
  const tr=d.querySelector('#tr').getAttribute('placeholder')!=='დაწერე…';
  d.remove();
  return {keep,tr};
});
chk('data-noi18n keeps attribute Georgian (delete confirm word)', attrOk.keep);
chk('normal Georgian placeholder still translates', attrOk.tr);

// switch the whole UI to English and screenshot the real rendered app (§6c)
await page.evaluate(()=>{ window.setUILang && window.setUILang('en'); });
await page.waitForTimeout(300);
await page.screenshot({ path: SHOT_DIR+'/i18n-en-app.png', fullPage:true });
console.log('screenshot: '+SHOT_DIR+'/i18n-en-app.png');

await browser.close();
closeServer();
const F=fails();
console.log(`\n${F===0?'✅ ALL PASS':'❌ '+F+' FAIL(S)'}`);
process.exit(F===0?0:1);
