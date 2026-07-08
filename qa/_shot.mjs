import { startStaticServer, launchBrowser, SHOT_DIR } from './_harness.mjs';
const rel = process.argv[2];               // path relative to ROOT, e.g. output/foo.html
const out = process.argv[3] || 'shot';
const { port, close } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:1100}, deviceScaleFactor:2 });
await page.goto(`http://localhost:${port}/${encodeURI(rel)}`, { waitUntil:'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: `${SHOT_DIR}/${out}.png`, fullPage:true });
console.log(`${SHOT_DIR}/${out}.png`);
await browser.close(); close(); process.exit(0);
