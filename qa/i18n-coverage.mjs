// NB-19: i18n EN-coverage scanner + build-guard.
// The app's English is a "translate-the-rendered-Georgian" overlay (niko/i18n.js): any Georgian
// string literal with no entry in I18N_MAP / no I18N_PATTERNS match stays Georgian on ka->en switch.
// This scans the UI source for Georgian string literals and reports which are NOT covered, so the
// gap can be backfilled and can't silently regrow. Run: node qa/i18n-coverage.mjs [--list]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(DIR, '..');
const NIKO = path.join(ROOT, 'niko');

// ── load the string tables the same way the browser does (files assign window.*) ──
function loadWin(file){
  const src = fs.readFileSync(path.join(NIKO, file), 'utf8');
  const win = {};
  // eslint-disable-next-line no-new-func
  new Function('window', src)(win);
  return win;
}
const s = loadWin('i18n-strings.js');
let LAND = {}; try { LAND = loadWin('i18n-landing.js').I18N_LANDING || {}; } catch(e){}
const MAP = Object.assign({}, LAND, s.I18N_MAP || {});
const PATTERNS = s.I18N_PATTERNS || [];

// replicate i18n.js toEn(): MAP exact (trim+collapse ws) then PATTERNS
function toEn(raw){
  const core = String(raw).trim().replace(/\s+/g,' ');
  if(core==='') return raw;
  if(MAP[core]!=null) return MAP[core];
  for(const [re,fn] of PATTERNS){ const m=core.match(re); if(m) return fn(m); }
  return raw; // stays Georgian
}

const KA = /[Ⴀ-ჿ]/;
// strings that legitimately stay Georgian (proper names, native autonym, single teaching letters)
const ALLOW = new Set(['ნიკო','მაშო','ქართული','ნიკო 🦉','მაშო 🐱']);
const isSingleLetter = t => /^[Ⴀ-ჿ]{1,2}[!?.]?$/.test(t.trim());

// UI source files whose rendered text a user sees
const FILES = ['screens.js','screens-menu.js','games.js','tutor.js','owl.js','parent.js','placement.js','core.js','draw.js','alpha.js','reco.js','talk.js'];

// extract single/double-quoted literals containing Georgian (skip template literals: dynamic → PATTERNS)
const litRe = /(['"])((?:\\.|(?!\1).)*?)\1/g;
const uncovered = {}; let totalLit=0, coveredN=0, dynN=0;
for(const f of FILES){
  const p = path.join(NIKO, f);
  if(!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p,'utf8');
  // count template-literal Georgian chunks (rough, for the dynamic backlog note)
  const tmpl = src.match(/`[^`]*[Ⴀ-ჿ][^`]*`/g) || [];
  dynN += tmpl.length;
  const seen = new Set();
  let m;
  while((m = litRe.exec(src))){
    const t = m[2];
    if(!KA.test(t)) continue;
    const core = t.trim().replace(/\s+/g,' ');
    if(!core || seen.has(core)) continue; seen.add(core);
    totalLit++;
    if(ALLOW.has(core) || isSingleLetter(core)){ coveredN++; continue; }
    if(toEn(core)!==core){ coveredN++; continue; }
    (uncovered[f] = uncovered[f] || []).push(core);
  }
}

const files = Object.keys(uncovered).sort((a,b)=>(uncovered[b].length)-(uncovered[a].length));
const totalUncovered = files.reduce((a,f)=>a+uncovered[f].length,0);
console.log(`i18n EN-coverage: MAP ${Object.keys(MAP).length} entries, ${PATTERNS.length} patterns`);
console.log(`static Georgian literals scanned: ${totalLit} | covered: ${coveredN} | UNCOVERED: ${totalUncovered}`);
console.log(`template-literal (dynamic) Georgian chunks (separate backlog): ~${dynN}`);
console.log('\nUNCOVERED by file:');
files.forEach(f=>console.log(`  ${f}: ${uncovered[f].length}`));

if(process.argv.includes('--list')){
  const out = files.map(f=>`\n## ${f} (${uncovered[f].length})\n`+uncovered[f].map(x=>'  '+x).join('\n')).join('\n');
  const dest = path.join(DIR, '_i18n_uncovered.txt');
  fs.writeFileSync(dest, out, 'utf8');
  console.log('\nfull list written to qa/_i18n_uncovered.txt');
}

// guard mode: fail if uncovered exceeds a baseline (set after backfill)
if(process.argv.includes('--gate')){
  const BASELINE = Number((process.argv.find(a=>a.startsWith('--max='))||'--max=0').split('=')[1]);
  if(totalUncovered > BASELINE){ console.log(`\n❌ GATE: ${totalUncovered} uncovered > baseline ${BASELINE}`); process.exit(1); }
  console.log(`\n✅ GATE: ${totalUncovered} <= baseline ${BASELINE}`);
}
