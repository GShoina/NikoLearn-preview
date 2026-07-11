// VOICE + AUDIO-OUTPUT QUALITY EVALUATOR (owner ask 2026-07-11: give the PO an autonomous standard to
// judge TTS/NotebookLM audio WITHOUT the owner's ear). Honest premise: a text model cannot hear a WAV,
// so quality is triangulated from THREE independent signals, none of which needs a human:
//   (1) PHYSICS   — measured from the PCM bytes (loudness, clipping, silence, duration, speech rate).
//   (2) ROUND-TRIP— transcribe the audio with an ASR pass; word-error vs the INTENDED text = a hard,
//                    model-agnostic proxy for intelligibility/pronunciation (a mispronounced word
//                    transcribes wrong). For NotebookLM (no fixed script) this yields language-purity.
//   (3) PROXY EAR — Gemini accepts audio input; it rates prosody/warmth/clarity + flags mispronounced
//                    Georgian phonemes on a fixed rubric. Run TWICE; disagreement lowers confidence.
// Standard + weights: docs/VOICE_QUALITY_STANDARD.md (SSOT). Output: JSON verdict per artifact.
// Usage: node tools/voice-eval.mjs   (evaluates output/tts-pilot/*.wav against the manifest below)
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const creds = fs.readFileSync(process.env.USERPROFILE + '/.claude/.bivision-creds.env', 'utf8');
const KEY = (creds.match(/^GEMINI_API_KEY=(.+)$/m) || [])[1]?.trim();
const DIR = path.resolve('output/tts-pilot');
const JUDGE_MODEL = 'gemini-2.5-flash';

// what each clip was ASKED to say (round-trip target). NotebookLM has no fixed script → purity mode.
const MANIFEST = [
  { file: 'gemini_ka_greet_Kore.wav', engine: 'gemini-tts', intended: 'გამარჯობა! როგორ ხარ? მე ძალიან კარგად ვარ, გმადლობ.' },
  { file: 'gemini_ka_num_Kore.wav',   engine: 'gemini-tts', intended: 'ერთი, ორი, სამი. სამი ვაშლი მაქვს.' },
  { file: 'gemini_ka_kids_Puck.wav',  engine: 'gemini-tts', intended: 'მოდი ვითამაშოთ! რა ფერია ცა? ცა ცისფერია.' },
  { file: 'notebooklm_ka_overview.wav', engine: 'notebooklm', intended: null } // purity/faithfulness mode
];

// detect audio container from magic bytes → correct mimeType for the judge + format check
function detectMime(buf) {
  const h = buf.slice(0, 12);
  if (h.slice(0, 4).toString() === 'RIFF' && h.slice(8, 12).toString() === 'WAVE') return 'audio/wav';
  if (h.slice(4, 8).toString() === 'ftyp') return 'audio/mp4';
  if (h.slice(0, 3).toString() === 'ID3' || (buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0)) return 'audio/mpeg';
  if (h.slice(0, 4).toString() === 'OggS') return 'audio/ogg';
  return 'application/octet-stream';
}

// ── (1) PHYSICS from a PCM/WAV file (only meaningful for WAV; others need a decode step) ──
function physics(buf) {
  if (buf.slice(0, 4).toString() !== 'RIFF') return { format: detectMime(buf), note: 'non-WAV container; byte-level physics need an ffmpeg decode (app clips must be MP3 anyway)' };
  let p = 12, rate = 24000, bits = 16, ch = 1, dataOff = 44, dataLen = buf.length - 44;
  while (p + 8 <= buf.length) {
    const id = buf.slice(p, p + 4).toString(), sz = buf.readUInt32LE(p + 4);
    if (id === 'fmt ') { ch = buf.readUInt16LE(p + 10); rate = buf.readUInt32LE(p + 12); bits = buf.readUInt16LE(p + 22); }
    if (id === 'data') { dataOff = p + 8; dataLen = sz; break; }
    p += 8 + sz + (sz & 1);
  }
  const n = Math.floor(dataLen / (bits / 8) / ch);
  let sumSq = 0, peak = 0, clipped = 0;
  const win = Math.floor(rate * 0.02); // 20ms silence windows
  const winRms = [];
  let wSum = 0, wCnt = 0;
  for (let i = 0; i < n; i++) {
    const s = buf.readInt16LE(dataOff + i * 2 * ch) / 32768;
    const a = Math.abs(s);
    sumSq += s * s; if (a > peak) peak = a; if (a > 0.985) clipped++;
    wSum += s * s; if (++wCnt === win) { winRms.push(Math.sqrt(wSum / wCnt)); wSum = 0; wCnt = 0; }
  }
  const rms = Math.sqrt(sumSq / n);
  const dbfs = v => v > 0 ? 20 * Math.log10(v) : -120;
  // lead/trail silence (windows below -45dBFS)
  const silent = winRms.map(r => dbfs(r) < -45);
  let lead = 0; for (const s of silent) { if (s) lead++; else break; }
  let trail = 0; for (let i = silent.length - 1; i >= 0; i--) { if (silent[i]) trail++; else break; }
  const speechWin = silent.filter(s => !s).length;
  return {
    durSec: +(n / rate).toFixed(2), rate, bits, ch,
    rmsDbfs: +dbfs(rms).toFixed(1), peakDbfs: +dbfs(peak).toFixed(1),
    clipPct: +(clipped / n * 100).toFixed(3),
    leadSilenceMs: Math.round(lead * 20), trailSilenceMs: Math.round(trail * 20),
    speechSec: +(speechWin * 0.02).toFixed(2)
  };
}

// ── Gemini call with an audio part (mime auto-detected), retrying on 429 with backoff ──
function geminiAudioOnce(model, b64, mime, prompt) {
  const body = JSON.stringify({
    contents: [{ parts: [{ inlineData: { mimeType: mime, data: b64 } }, { text: prompt }] }],
    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
  });
  const opts = { host: 'generativelanguage.googleapis.com', path: `/v1beta/models/${model}:generateContent?key=${KEY}`, method: 'POST', headers: { 'Content-Type': 'application/json' } };
  return new Promise((res, rej) => {
    const req = https.request(opts, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => res({ status: r.statusCode, body: d })); });
    req.on('error', rej); req.write(body); req.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function geminiAudio(model, b64, mime, prompt) {
  for (let a = 0; a < 3; a++) {
    const r = await geminiAudioOnce(model, b64, mime, prompt);
    if (r.status !== 429) return r;
    await sleep(2000 * (a + 1)); // 2s,4s,6s backoff on quota
  }
  return geminiAudioOnce(model, b64, mime, prompt);
}

function parseJson(s) { try { return JSON.parse(s); } catch { const m = s.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : null; } }

// word error rate (token-level Levenshtein / reference length), Georgian-punctuation-stripped
function wer(ref, hyp) {
  const norm = t => (t || '').toLowerCase().replace(/[.,!?„""«»]/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const a = norm(ref), b = norm(hyp);
  if (!a.length) return null;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] : 1 + Math.min(d[i - 1][j - 1], d[i - 1][j], d[i][j - 1]);
  return +(d[a.length][b.length] / a.length).toFixed(3);
}

const RUBRIC = (intended) => `You are a strict Georgian-language childrens-audio quality judge for a kids (age 3-7) learning app.
You are LISTENING to the attached audio. Respond ONLY as JSON with this exact shape:
{"transcript":"<verbatim Georgian you hear>","is_georgian":true/false,"english_leak":true/false,
"scores":{"intelligibility":1-10,"naturalness":1-10,"warmth":1-10,"clarity":1-10},
"mispronounced":["<georgian words said wrong, esp. ქ კ ყ ჭ წ ცხ clusters>"],"notes":"<=25 words"}
${intended ? `The speaker was asked to say EXACTLY: "${intended}". Judge how accurately and naturally it was said.` : `This is a Georgian podcast-style overview; judge if it is fully Georgian (no English), natural and warm.`}
Score honestly: intelligibility<8 if ANY word is unclear or mispronounced (in a learning app a wrong sound teaches the child wrong).`;

async function judgeOnce(b64, mime, intended) {
  let r;
  try { r = await geminiAudio(JUDGE_MODEL, b64, mime, RUBRIC(intended)); }
  catch (e) { return { err: 'net:' + String(e.code || e).slice(0, 40) }; } // never let a socket reset crash the run
  if (r.status !== 200) return { err: `HTTP ${r.status}: ${r.body.slice(0, 120)}` };
  const outer = parseJson(r.body);
  const txt = outer?.candidates?.[0]?.content?.parts?.[0]?.text;
  const j = parseJson(txt) || { err: 'no-parse', raw: (txt || r.body).slice(0, 160) };
  // degenerate-judge guard: all-identical scores with no notes = low-information rubber-stamp; flag it
  if (j.scores) { const v = Object.values(j.scores); j._degenerate = v.every(x => x === v[0]) && !(j.notes || '').trim(); }
  return j;
}

// weighted aggregate per the app-clip rubric (docs/VOICE_QUALITY_STANDARD.md)
function aggregate(sc) {
  if (!sc) return null;
  const w = { intelligibility: .35, naturalness: .2, warmth: .2, clarity: .25 };
  let t = 0; for (const k in w) t += (sc[k] || 0) * w[k];
  return +t.toFixed(2);
}

(async () => {
  const results = [];
  for (const m of MANIFEST) {
    const f = path.join(DIR, m.file);
    if (!fs.existsSync(f)) { results.push({ file: m.file, err: 'missing' }); continue; }
    const buf = fs.readFileSync(f);
    const mime = detectMime(buf);
    const phys = physics(buf);
    const isBig = buf.length > 7_000_000; // inline audio cap safety
    let judge1 = null, judge2 = null, werScore = null, aggScore = null, conf = 'n/a';
    // inline audio cap: base64 inflates ~1.33x; keep the request body well under limits + reliable
    const INLINE_CAP = 3_500_000;
    if (KEY && buf.length <= INLINE_CAP) {
      const b64 = buf.toString('base64');
      judge1 = await judgeOnce(b64, mime, m.intended);
      judge2 = await judgeOnce(b64, mime, m.intended);
      if (m.intended && judge1?.transcript) werScore = wer(m.intended, judge1.transcript);
      // conservative aggregate: drop a degenerate judge; if judges disagree, take the LOWER (safer gate)
      const cand = [judge1, judge2].filter(j => j?.scores && !j._degenerate).map(j => aggregate(j.scores));
      if (cand.length === 2) { aggScore = +Math.min(...cand).toFixed(2); conf = Math.abs(cand[0] - cand[1]) <= 1 ? 'high' : 'medium(judges split→took lower)'; }
      else if (cand.length === 1) { aggScore = cand[0]; conf = 'medium(1 usable judge)'; }
      else conf = 'judge-failed';
    } else if (KEY) {
      conf = `deferred(${(buf.length / 1e6).toFixed(1)}MB > inline cap; use Files API or ffmpeg→short MP3 segment)`;
    }
    results.push({ file: m.file, engine: m.engine, mime, phys, wer: werScore, agg: aggScore, conf,
      judge1: judge1?.scores ? { ...judge1.scores, is_georgian: judge1.is_georgian, english_leak: judge1.english_leak, mispronounced: judge1.mispronounced, transcript: judge1.transcript, notes: judge1.notes, degenerate: judge1._degenerate } : judge1,
      judge2: judge2?.scores ? { ...judge2.scores, degenerate: judge2._degenerate } : (judge2?.err || null) });
  }
  console.log(JSON.stringify(results, null, 1));
})();

// take first ~60s of a WAV (keeps header, truncates data) to stay under the inline-audio cap
function clip60(buf) {
  let p = 12, rate = 24000, dataOff = 44;
  while (p + 8 <= buf.length) { const id = buf.slice(p, p + 4).toString(), sz = buf.readUInt32LE(p + 4); if (id === 'fmt ') rate = buf.readUInt32LE(p + 12); if (id === 'data') { dataOff = p + 8; break; } p += 8 + sz + (sz & 1); }
  const bytes = Math.min(buf.length - dataOff, rate * 2 * 60);
  const head = Buffer.from(buf.slice(0, dataOff)); head.writeUInt32LE(bytes, dataOff - 4); head.writeUInt32LE(36 + bytes, 4);
  return Buffer.concat([head, buf.slice(dataOff, dataOff + bytes)]);
}
