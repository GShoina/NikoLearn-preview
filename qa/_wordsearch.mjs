// SPEC-2 Word-Search behavioral gate: grid builds correctly (placed cells spell each word),
// selecting a word's endpoints marks it found, finding ALL words rewards, no JS errors.
// §6c: screenshots the grid + the completion overlay.
import { startStaticServer, launchBrowser, makeChk, SHOT_DIR } from './_harness.mjs';
const { port, close:closeServer } = await startStaticServer();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport:{width:412,height:915} });
const errs=[]; page.on('pageerror', e=>errs.push(String(e).slice(0,180)));
const { chk, fails } = makeChk();

async function boot(age){
  await page.goto(`http://localhost:${port}/index.html?app=1&notrack=1`, { waitUntil:'networkidle' });
  await page.evaluate(()=>{ window.playClipFor=()=>false; });   // silence audio
  await page.evaluate((a)=>{ startDemo(a); }, age);
  await page.waitForTimeout(150);
}

// ───────── YOUNG (age 5): animals pack ─────────
await boot(5);
await page.evaluate(()=>window.wsStart('animals'));
await page.waitForTimeout(200);
let st = await page.evaluate(()=>window.__wsState());
console.log(`young: size ${st.size}, words placed ${st.words.length}`);

// (1) every placed word's cells actually spell the word in the grid
const spellOK = await page.evaluate(()=>{
  const s=window.__wsState(); let ok=true;
  for(const w of s.words){ const read=w.cells.map(([r,c])=>s.grid[r][c]).join(''); if(read!==w.w) ok=false; }
  return ok;
});
chk('young grid: every word spelled by its cells', spellOK);
chk('young: >=3 words placed', st.words.length>=3, `got ${st.words.length}`);
chk('young grid size 6-8', st.size>=6 && st.size<=8, `size ${st.size}`);

// (2) clue chips hide the WORD text for pre-readers (emoji only)
const youngNoText = await page.evaluate(()=>{
  const lbls=[...document.querySelectorAll('#wsscr .ws-clue .lbl')]; return lbls.length===0;
});
chk('young: clue chips show emoji only (no word text)', youngNoText);

await page.screenshot({ path: SHOT_DIR+'/ws_young_grid.png' });

// (3) find EVERY word by tapping its first + last cell → all found → reward
const rewardBefore = await page.evaluate(()=>{ try{return (state[profile].shields)||0;}catch(e){return 0;} });
const words = st.words;
for(const w of words){
  const a=w.cells[0], b=w.cells[w.cells.length-1];
  await page.evaluate(([ar,ac,br,bc])=>{ window.wsTap(ar,ac); window.wsTap(br,bc); }, [a[0],a[1],b[0],b[1]]);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(700);
const afterFind = await page.evaluate(()=>{
  const s=window.__wsState();
  return { allFound:s.words.every(w=>w.found), doneOverlay: !!document.querySelector('#wsscr .ws-done'),
           shields:(()=>{try{return state[profile].shields||0;}catch(e){return 0;}})() };
});
chk('all words found via endpoint taps', afterFind.allFound);
chk('completion overlay shown', afterFind.doneOverlay);
chk('reward coins added on completion', afterFind.shields>rewardBefore, `${rewardBefore}->${afterFind.shields}`);
await page.screenshot({ path: SHOT_DIR+'/ws_young_done.png' });

// (4) wrong selection does NOT mark a word (guard against false positives)
await page.evaluate(()=>window.wsAgain());        // fresh round
await page.waitForTimeout(200);
const falsePos = await page.evaluate(()=>{
  const s=window.__wsState();
  // tap two random non-collinear-ish cells unlikely to be a word: (0,0)->(0,1) single step
  const before=s.words.filter(w=>w.found).length;
  window.wsTap(0,0); window.wsTap(0,0);   // same cell twice = cancel, no find
  const after=window.__wsState().words.filter(w=>w.found).length;
  return after===before;
});
chk('cancel-tap does not falsely mark a word', falsePos);

// ───────── READER (age 8): reader grid is bigger + diagonals allowed ─────────
await boot(8);
await page.evaluate(()=>window.wsStart('colors'));
await page.waitForTimeout(200);
const rst = await page.evaluate(()=>window.__wsState());
const readerText = await page.evaluate(()=>[...document.querySelectorAll('#wsscr .ws-clue .lbl')].length>0);
chk('reader grid size 9-11', rst.size>=9 && rst.size<=11, `size ${rst.size}`);
chk('reader: clue chips show the word text', readerText);
const rSpell = await page.evaluate(()=>{ const s=window.__wsState(); return s.words.every(w=>w.cells.map(([r,c])=>s.grid[r][c]).join('')===w.w); });
chk('reader grid: every word spelled by its cells', rSpell);
await page.screenshot({ path: SHOT_DIR+'/ws_reader_grid.png' });

chk('no pageerrors', errs.length===0, errs.join(' | '));
console.log('screens ->', SHOT_DIR+'/ws_young_grid.png , ws_young_done.png , ws_reader_grid.png');
await browser.close(); await closeServer();
process.exit(fails()?1:0);
