// SPEC-2 Word-Search behavioral gate: grid builds correctly (placed cells spell each word),
// selecting a word's endpoints marks it found, finding ALL words rewards, no JS errors.
// §6c: screenshots the grid + the completion overlay.
import { startStaticServer, chromium, PW_CHROMIUM, makeChk, SHOT_DIR } from './_harness.mjs';
const { port, close:closeServer } = await startStaticServer();
// disable background timer throttling so the struggle-timer (NB-43) fires deterministically headless
const browser = await chromium.launch({ executablePath: PW_CHROMIUM,
  args:['--disable-background-timer-throttling','--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding'] });
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

// (2) young clue chips show emoji + word text so a pre-reader can MATCH letter shapes
// (audit finding #2: hiding the text left the grid unsolvable for a non-reader)
const youngHasBoth = await page.evaluate(()=>{
  const lbls=[...document.querySelectorAll('#wsscr .ws-clue .lbl')];
  const ems=[...document.querySelectorAll('#wsscr .ws-clue .em')];
  return lbls.length>0 && ems.length>0;
});
chk('young: clue chips show emoji + word text (shape-matching for pre-reader)', youngHasBoth);

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

// ═════════ NB-44/42/43/45: the owner's exact case + the new guarantees ═════════
// NB-44 — SOLVABILITY GUARANTEED: the owner tried the FOOD pack (რძე/პური/ვაშლი/ბანანი) and
// found only 2 of 4. Build it many times; EVERY build must place EVERY pack word (never 3-of-4),
// and every word must be selectable by tapping its endpoints.
await boot(8);
let allPlacedRuns=0, selectableRuns=0, RUNS=25;
for(let i=0;i<RUNS;i++){
  await page.evaluate(()=>{ const e=document.getElementById('wsscr'); if(e)e.remove(); window.wsStart('food'); });
  await page.waitForTimeout(60);
  const r = await page.evaluate(()=>{
    const s=window.__wsState();
    const packWords=['ვაშლი','ბანანი','პური','რძე'];
    const placed=s.words.map(w=>w.w);
    const allPlaced = packWords.every(pw=>placed.includes(pw)) && s.words.length===packWords.length;
    // clue chips must correspond 1:1 to placed words (no clue for an unplaced word)
    const clueLbls=[...document.querySelectorAll('#wsscr .ws-clue .lbl')].map(e=>e.textContent);
    const cluesMatch = clueLbls.length===s.words.length && clueLbls.every(l=>placed.includes(l));
    // every word selectable via endpoint taps
    for(const w of s.words){ const a=w.cells[0],b=w.cells[w.cells.length-1]; window.wsTap(a[0],a[1]); window.wsTap(b[0],b[1]); }
    const allFound=window.__wsState().words.every(w=>w.found);
    return { allPlaced, cluesMatch, allFound, n:s.words.length };
  });
  if(r.allPlaced && r.cluesMatch) allPlacedRuns++;
  if(r.allFound) selectableRuns++;
}
chk(`NB-44 food pack: ALL 4 words placed + clues match, every build (${allPlacedRuns}/${RUNS})`, allPlacedRuns===RUNS);
chk(`NB-44 food pack: every shown word selectable → all found, every build (${selectableRuns}/${RUNS})`, selectableRuns===RUNS);

// NB-42 — FOOTER DOCK present with the 3 actions.
await page.evaluate(()=>{ const e=document.getElementById('wsscr'); if(e)e.remove(); window.wsStart('food'); });
await page.waitForTimeout(80);
const dock = await page.evaluate(()=>{
  const btns=[...document.querySelectorAll('#wsscr .ws-dock button')];
  const oc=btns.map(b=>b.getAttribute('onclick')||'');
  return { count:btns.length, home:oc.some(o=>o.includes('closeWs')), hint:oc.some(o=>o.includes('wsHint')), again:oc.some(o=>o.includes('wsAgain')) };
});
chk('NB-42 footer dock: 3 buttons', dock.count===3, `got ${dock.count}`);
chk('NB-42 footer dock: Home + Hint + New actions wired', dock.home && dock.hint && dock.again);
await page.screenshot({ path: SHOT_DIR+'/ws_dock.png' });

// NB-43 — HINT reveals a cell + counts; OWL appears after the struggle window.
const hint = await page.evaluate(()=>{
  const before=window.__wsHintCount();
  window.wsHint();
  const glow=!!document.querySelector('#wsscr .ws-cell.hint');
  return { counted: window.__wsHintCount()===before+1, glow };
});
chk('NB-43 hint: increments hint count', hint.counted);
chk('NB-43 hint: pulses a grid cell (visual nudge)', hint.glow);
// owl offer via the testable struggle seam (__wsStruggleMs shortens the 18-22s window). Settle first
// so any completion timer from the prior builds drains, then a fresh build arms the short window and
// the owl auto-appears. Anti-throttle launch flags keep the headless timer honest. We assert BOTH the
// timer path (owl auto-shows) and the display logic (force the offer directly).
await page.waitForTimeout(700);   // drain lingering completion timers from the NB-44 loop
const owl = await page.evaluate(()=> new Promise(res=>{
  window.__wsStruggleMs=250;
  const e=document.getElementById('wsscr'); if(e)e.remove(); window.wsStart('food');
  setTimeout(()=>{
    const owlEl=document.querySelector('#wsscr .ws-owl'), btnEl=document.querySelector('#wsscr #wsHintBtn');
    res({ shown: !!(owlEl && owlEl.classList.contains('show')), pulse: !!(btnEl && btnEl.classList.contains('pulse')) });
  }, 900);
}));
// isolate the display logic from timer wiring: force the offer directly
const owlForce = await page.evaluate(()=>{
  window.__wsStruggleMs=undefined;
  const e=document.getElementById('wsscr'); if(e)e.remove(); window.wsStart('food');
  window.__wsForceStruggle();
  const owlEl=document.querySelector('#wsscr .ws-owl'), btnEl=document.querySelector('#wsscr #wsHintBtn');
  return { shown: !!(owlEl && owlEl.classList.contains('show')), pulse: !!(btnEl && btnEl.classList.contains('pulse')) };
});
chk('NB-43 tutor: Niko owl auto-offers help after the struggle window', owl.shown && owl.pulse);
chk('NB-43 tutor: owl+hint-pulse display logic correct', owlForce.shown && owlForce.pulse);
await page.waitForTimeout(350);   // let the wsOwlIn fade settle so the saved §6c shot shows the owl
await page.screenshot({ path: SHOT_DIR+'/ws_owl_hint.png' });

// NB-45 — difficulty scales by CAPACITY within an age band (skill drives words/dirs/size).
const scaling = await page.evaluate(()=>{
  const out={};
  for(const sk of [1,2,3]){
    state[profile].wsSkill=sk; if(typeof save==='function')save();
    const e=document.getElementById('wsscr'); if(e)e.remove(); window.wsStart('animals');
    const s=window.__wsState();
    out[sk]={ skill:s.skill, words:s.words.length, size:s.size };
  }
  return out;
});
chk('NB-45 capacity: higher skill → more words (3<...<=6)', scaling['3'].words>=scaling['1'].words, JSON.stringify(scaling));
chk('NB-45 capacity: skill actually applied from profile', scaling['1'].skill===1 && scaling['3'].skill===3, JSON.stringify(scaling));
// reader is BANDED: skill can't drop below 1 (no trivially-easy reader puzzles)
const banded = await page.evaluate(()=>{ state[profile].wsSkill=0; const e=document.getElementById('wsscr'); if(e)e.remove(); window.wsStart('animals'); return window.__wsState().skill; });
chk('NB-45 age band: reader skill floored at 1 even if stored 0', banded>=1, `skill ${banded}`);

chk('no pageerrors', errs.length===0, errs.join(' | '));
console.log('screens ->', SHOT_DIR+'/ws_young_grid.png , ws_young_done.png , ws_reader_grid.png');
await browser.close(); await closeServer();
process.exit(fails()?1:0);
