// Shared config + helpers for the NikoLearn behavioral Playwright harnesses (NB-14).
// LOCAL absolute paths are intentional: these run pre-push on the dev machine, NEVER in CI.
// One SSOT here so the 3 young-lane harnesses (_alpha/_math/_shapes) stop duplicating the
// playwright import + chromium executablePath + static server. Change a path ONCE, here.
import { chromium } from 'file:///C:/Users/gela.shonia/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

export { chromium };
export const ROOT = 'C:/Users/gela.shonia/Documents/NGT 2020-07/AI_Projects/NikoLand';
export const PW_CHROMIUM = 'C:/Users/gela.shonia/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe';
export const SHOT_DIR = 'C:/Users/gela.shonia/niko-shot';
fs.mkdirSync(SHOT_DIR, { recursive:true }); // guarantee screenshot dir for whichever harness runs first

const MIME = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.mp3':'audio/mpeg','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};

// Static file server rooted at ROOT. Returns { port, close }.
export async function startStaticServer(){
  const srv = http.createServer((req,res)=>{
    let u = decodeURIComponent(req.url.split('?')[0]); if(u==='/')u='/index.html';
    fs.readFile(path.join(ROOT,u),(e,d)=>{ if(e){res.writeHead(404);res.end('x');return;} res.writeHead(200,{'content-type':MIME[path.extname(u)]||'application/octet-stream'}); res.end(d); });
  });
  await new Promise(r=>srv.listen(0,r));
  return { port: srv.address().port, close:()=>srv.close() };
}

// Headless chromium from the local install.
export function launchBrowser(){ return chromium.launch({ executablePath: PW_CHROMIUM }); }

// Assertion counter. Returns { chk, fails } — chk(name, ok) logs PASS/FAIL, fails() = count.
export function makeChk(){
  let FAILS=0;
  const chk=(name,ok)=>{ console.log(`ASSERT ${name}:`, ok?'PASS':'FAIL'); if(!ok)FAILS++; };
  return { chk, fails:()=>FAILS };
}
