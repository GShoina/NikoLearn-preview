import { startStaticServer, launchBrowser, SHOT_DIR } from './_harness.mjs';
const { port, close } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:915}, deviceScaleFactor:2 });
page.on('pageerror', e=>console.log('[pageerror]', String(e).slice(0,150)));
await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
await page.evaluate(()=>{ try{ window.speechSynthesis&&(window.speechSynthesis.speak=()=>{}); }catch{} });
await page.evaluate(()=>{ startDemo(6); });          // guest profile age 6 → home
await page.waitForTimeout(600);
await page.screenshot({ path: `${SHOT_DIR}/home-current.png`, fullPage:true });
console.log(`${SHOT_DIR}/home-current.png`);
await browser.close(); close(); process.exit(0);
