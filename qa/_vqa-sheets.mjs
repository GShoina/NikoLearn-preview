#!/usr/bin/env node
/* LOOK-phase helper (§6c / AGENT_TEAM_STANDARD §8): build contact sheets from a visual-QA
   shot directory so every state gets actually LOOKED at, then screenshot each sheet.
   Usage: node qa/_vqa-sheets.mjs --dir output/visual-qa/2026-07-13 [--per 20]
   Output: <dir>-sheets/sheet-NN.jpg (+ index.txt listing which states are on which sheet). */
import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync, readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join, extname, basename } from 'path';

const ROOT = 'C:/Users/gela.shonia/Documents/NGT 2020-07/AI_Projects/NikoLand';
const EXE = 'C:/Users/gela.shonia/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe';
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i >= 0 ? argv[i + 1] : d; };
const DIR = arg('dir', 'output/visual-qa/2026-07-13').replace(/\\/g, '/');
const PER = +arg('per', 20);
const ABS = join(ROOT, DIR);
const OUT = ABS + '-sheets';
mkdirSync(OUT, { recursive: true });

const MIME = { '.html': 'text/html', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };
const serve = () => new Promise(res => { const s = createServer((req, r) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  const fp = join(ROOT, p);
  if (!existsSync(fp) || statSync(fp).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream' }); r.end(readFileSync(fp));
}); s.listen(0, '127.0.0.1', () => res(s)); });

const shots = readdirSync(ABS).filter(f => /\.(jpe?g|png)$/i.test(f)).sort();
// collapse byte-identical files (e.g. a burned-in crash overlay repeated 50×): keep first per size+first16bytes
const seen = new Map(); const uniq = []; const dupes = [];
for (const f of shots) {
  const st = statSync(join(ABS, f));
  const head = readFileSync(join(ABS, f)).subarray(0, 16).toString('hex');
  const key = st.size + ':' + head;
  if (seen.has(key)) { dupes.push(f + '  == ' + seen.get(key)); continue; }
  seen.set(key, f); uniq.push(f);
}
console.log(`${shots.length} shots · ${uniq.length} unique · ${dupes.length} byte-identical dupes collapsed`);

const server = await serve();
const port = server.address().port;
const browser = await chromium.launch({ headless: true, executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewportSize({ width: 1180, height: 900 });

const index = [];
let n = 0;
for (let i = 0; i < uniq.length; i += PER) {
  n++;
  const batch = uniq.slice(i, i + PER);
  const cells = batch.map(f =>
    `<figure><img src="http://127.0.0.1:${port}/${DIR}/${encodeURIComponent(f)}"><figcaption>${f.replace(/\.(jpe?g|png)$/i, '')}</figcaption></figure>`).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:8px;background:#222;font-family:system-ui}
    main{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
    figure{margin:0;background:#333;border-radius:6px;padding:4px}
    img{width:100%;display:block;border-radius:4px}
    figcaption{color:#eee;font-size:11px;padding:3px 1px;word-break:break-all;line-height:1.25}</style><main>${cells}</main>`;
  await page.setContent(html, { waitUntil: 'networkidle' });
  const out = join(OUT, `sheet-${String(n).padStart(2, '0')}.jpg`);
  await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 72 });
  index.push(`sheet-${String(n).padStart(2, '0')}: ${batch.join(' | ')}`);
  console.log(`sheet-${String(n).padStart(2, '0')} · ${batch.length} states`);
}
writeFileSync(join(OUT, 'index.txt'), index.join('\n') + '\n\nDUPES COLLAPSED:\n' + dupes.join('\n'));
await browser.close(); server.close();
console.log(`done → ${OUT}`);
