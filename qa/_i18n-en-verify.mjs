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
  'ინგლისურის მასწავლებელი','კიდევ ერთი','✓ მიღწეულია!','30 ინგლისური სიტყვა'];
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
