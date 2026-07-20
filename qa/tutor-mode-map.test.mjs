// ================================================================================================
// NB-81 — static guard against the recurring "unmapped game.mode falls through to the vocab
// default" class. gameSubject() in niko/owl.js maps game.mode -> tutor subject; anything it does
// NOT map returns 'vocab', which in niko/tutor.js paints the owl "ბუ · ინგლისურის მასწავლებელი"
// (English teacher). That is correct for real English content and WRONG for anything else.
//
// This class has recurred repeatedly on owner-visible screens:
//   - 2026-07-01  reasoning strands (pattern/rebus/model/triangle) -> English teacher on a math puzzle
//   - 2026-07-04  Georgian reading modes (read/sent/rtext/build/shead) -> English teacher on ka reading
//   - 2026-07-20  counting (NB-80): 'count'/'digit' -> English teacher on a Georgian counting task
// Per NB-55 ("every owner-visible bug leaves behind the test that would have caught it"), a static
// map-vs-assignment guard is the mechanism that stops the next recurrence at commit time, not in
// production. Run: node qa/tutor-mode-map.test.mjs
// ================================================================================================
import fs from 'node:fs';
import path from 'node:path';

const NIKO = path.resolve('niko');
let failures = 0;
const ok  = (name) => console.log(`  PASS  ${name}`);
const bad = (name, detail) => { failures++; console.log(`  FAIL  ${name}\n        ${detail}`); };
const assert = (cond, name, detail) => cond ? ok(name) : bad(name, detail);

const files = fs.readdirSync(NIKO).filter(f => f.endsWith('.js'));
const read  = (f) => fs.readFileSync(path.join(NIKO, f), 'utf8');

// ── whitelist A: modes that legitimately fall through to the vocab/English-teacher tutor because
//    they ARE English content. Each needs a one-line reason. (listen-yle/yesno/story/speak are also
//    intercepted earlier in tutor.js by ctx.mode, but they resolve to English either way.) ────────
const VOCAB_OK = {
  colour:       'English colour-learning game (game.subj=english)',
  quiz:         'English themed-vocabulary quiz (game.subj=english)',
  phrases:      'English everyday-phrases practice (game.subj=english)',
  'listen-yle': 'Cambridge YLE listening — English (also intercepted early by ctx.mode in tutor.js)',
  yesno:        'Cambridge YLE true/false — English (intercepted early by ctx.mode)',
  story:        'Cambridge YLE reading story — English (intercepted early by ctx.mode)',
  speak:        'Cambridge YLE speaking practice — English (intercepted early by ctx.mode)',
};

// ── whitelist B: modes that CURRENTLY fall through to the vocab/English default but are NOT English
//    content — latent NB-80-class mislabels, reported to the team-lead 2026-07-20. Listed so this
//    guard stays green while the product decision (which tutor a calendar / a Kings-math mock exam
//    should show) is pending. REMOVE an entry the moment it gets a real subject mapping in
//    gameSubject(); do NOT add new modes here to silence the test — map them instead. ─────────────
const KNOWN_NONVOCAB_FALLTHROUGH = {
  cal:  'calendar (weekdays/seasons), content-language-aware — should NOT be English teacher',
  exam: 'Kings-math mock exam (pattern/rebus/model reasoning) — should be math teacher',
};

// ── 1. collect every game.mode='<value>' assignment across niko/*.js ─────────────────────────────
const assigned = new Map();   // mode -> file where first seen
const dynamic  = [];          // unresolvable game.mode='x'+<expr> concatenations
for (const f of files) {
  const src = read(f);
  const re = /game\.mode\s*=\s*(['"])([^'"]*)\1(\s*\+)?/g;
  let m;
  while ((m = re.exec(src))) {
    const lit = m[2], isConcat = !!m[3];
    if (isConcat) {
      // the only dynamic assignment is kings-exam.js `game.mode='kings-'+subject` -> kings-eng|kings-math
      if (lit === 'kings-') { assigned.set('kings-eng', f); assigned.set('kings-math', f); }
      else dynamic.push(`${f}: game.mode='${lit}'+<dynamic>`);
      continue;
    }
    if (!assigned.has(lit)) assigned.set(lit, f);
  }
}

// ── 2. derive what gameSubject() resolves BY MODE (exact m==='x' + m.startsWith('x') prefixes) ────
const owl = read('owl.js');
const gsMatch = owl.match(/function\s+gameSubject\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(!!gsMatch, 'gameSubject() located in niko/owl.js', 'could not find the function body to parse');
const gsBody = gsMatch ? gsMatch[1] : '';
const exact = new Set();
for (const mm of gsBody.matchAll(/m===(['"])([^'"]+)\1/g)) exact.add(mm[2]);
const prefixes = [];
for (const mm of gsBody.matchAll(/m\.startsWith\((['"])([^'"]+)\1\)/g)) prefixes.push(mm[2]);
assert(/return\s+'vocab'/.test(gsBody), "gameSubject() still ends in the 'vocab' default", 'this guard assumes a vocab fall-through exists');
const isMapped = (mode) => exact.has(mode) || prefixes.some(p => mode.startsWith(p));

if (dynamic.length) console.log('  NOTE  dynamic game.mode assignments (not statically resolved): ' + dynamic.join('; '));

// positive discriminator: the NB-80 counting modes must stay mapped (regression trip-wire)
assert(isMapped('count') && isMapped('digit'),
  "counting modes 'count' + 'digit' are mapped by gameSubject()",
  "NB-80 regression: a counting mode fell out of gameSubject() -> vocab/English-teacher");

// ── 3. no assigned mode may reach the English-teacher default unless it is whitelisted ───────────
for (const [mode, file] of [...assigned].sort()) {
  if (isMapped(mode))                    { ok(`mode '${mode}' -> mapped by gameSubject()  [${file}]`); continue; }
  if (VOCAB_OK[mode])                    { ok(`mode '${mode}' -> vocab (English) — allowed: ${VOCAB_OK[mode]}`); continue; }
  if (KNOWN_NONVOCAB_FALLTHROUGH[mode])  { ok(`mode '${mode}' -> vocab — KNOWN latent (flagged): ${KNOWN_NONVOCAB_FALLTHROUGH[mode]}`); continue; }
  bad(`mode '${mode}' falls through gameSubject() to the 'vocab'/English-teacher default  [${file}]`,
      "Map it in niko/owl.js gameSubject(); or, if it is genuinely English content, add it to VOCAB_OK in this test with a one-line reason.");
}

// ── 4. the tutor.js coach-label ternary must give 'counting' its own (non-English) branch ────────
const tutor = read('tutor.js');
assert(/ctx\.subject===['"]counting['"]/.test(tutor),
  "tutor.js coach-label routing has a 'counting' branch (NB-80)",
  "without it, subject 'counting' hits the mathish/English default -> 'ბუ · ინგლისურის მასწავლებელი' on a Georgian counting task");

console.log(failures === 0
  ? '\nNB-81 tutor mode-map guard: ALL CHECKS PASS — no game.mode silently maps to the English-teacher default.\n'
  : `\nNB-81 tutor mode-map guard: ${failures} CHECK(S) FAILED\n`);
process.exit(failures === 0 ? 0 : 1);
