// NikoLearn — extract the exact 6 question + 6 answer strings from niko/dayq.js.
// WHY (drift-guard, §14): the TTS input, the AUDIO_MANIFEST key, and the in-app
// playClip() lookup MUST be byte-identical. This reads dayq.js directly (the SSOT),
// so re-running it after any content edit refreshes tools/dayq-tts.json with zero
// transcription risk. Pipeline: node tools/dayq-extract.mjs tools/dayq-tts.json
//                            → python tools/_gen_dayq.py
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(process.argv[1]), '..');
const src = fs.readFileSync(path.join(ROOT, 'niko/dayq.js'), 'utf8');
const ctx = { Date, Math, document: { querySelector: () => null }, window: {} };
vm.createContext(ctx);
// dayq.js only DECLARES consts + functions at top level (no calls) → running it is safe.
vm.runInContext(src + '\n; this.DAYQ = DAYQ;', ctx);

const entries = [];
ctx.DAYQ.forEach((c, i) => {
  const n = i + 1;
  entries.push({ kind: 'q', file: `dqq_${n}.mp3`, text: c.q, key: c.q.trim().toLowerCase() });
  entries.push({ kind: 'a', file: `dqa_${n}.mp3`, text: c.a, key: c.a.trim().toLowerCase() });
});

const outPath = process.argv[2] || path.join(ROOT, 'tools/dayq-tts.json');
fs.writeFileSync(outPath, JSON.stringify(entries, null, 1), 'utf8');
console.log('--- manifest fragment (insert before the closing }; of niko/audio-manifest.js) ---');
entries.forEach(e => console.log(` ${JSON.stringify(e.key)}: ${JSON.stringify(e.file)},`));
console.log(`--- ${entries.length} entries → ${outPath} ---`);
