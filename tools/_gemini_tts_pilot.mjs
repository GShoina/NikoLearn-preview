// Gemini TTS pilot (owner ask 2026-07-11): voice Georgian conversational lines via Gemini TTS and
// save as WAV so the owner can compare voice quality vs our build-time edge_tts (EkaNeural) clips.
// Reads GEMINI_API_KEY from the shared creds env. Output → output/tts-pilot/.
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const creds = fs.readFileSync(process.env.USERPROFILE + '/.claude/.bivision-creds.env', 'utf8');
const KEY = (creds.match(/^GEMINI_API_KEY=(.+)$/m) || [])[1]?.trim();
if (!KEY) { console.error('no GEMINI_API_KEY'); process.exit(1); }

const OUT = path.resolve('output/tts-pilot');
fs.mkdirSync(OUT, { recursive: true });

// PCM (24kHz, 16-bit, mono) → WAV wrapper
function pcmToWav(pcm, rate = 24000) {
  const b = pcm.length, hdr = Buffer.alloc(44);
  hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + b, 4); hdr.write('WAVE', 8);
  hdr.write('fmt ', 12); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20);
  hdr.writeUInt16LE(1, 22); hdr.writeUInt32LE(rate, 24); hdr.writeUInt32LE(rate * 2, 28);
  hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(b, 40);
  return Buffer.concat([hdr, pcm]);
}

function tts(model, text, voice) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
    }
  });
  const opts = { host: 'generativelanguage.googleapis.com', path: `/v1beta/models/${model}:generateContent?key=${KEY}`, method: 'POST', headers: { 'Content-Type': 'application/json' } };
  return new Promise((res, rej) => {
    const req = https.request(opts, r => { let d = ''; r.on('data', c => d += c); r.on('end', () => res({ status: r.statusCode, body: d })); });
    req.on('error', rej); req.write(body); req.end();
  });
}

// simple conversational lines (§11 original, §8 no em dash) — the pilot content.
// Prefix forces TTS mode (else the model tries to ANSWER the text): "Say warmly in Georgian:".
const SAY = 'Say warmly and clearly in Georgian, in a friendly voice for a young child: ';
const LINES = [
  { id: 'ka_greet', voice: 'Kore', text: SAY + 'გამარჯობა! როგორ ხარ? მე ძალიან კარგად ვარ, გმადლობ.' },
  { id: 'ka_num',   voice: 'Kore', text: SAY + 'ერთი, ორი, სამი. სამი ვაშლი მაქვს.' },
  { id: 'ka_kids',  voice: 'Puck', text: SAY + 'მოდი ვითამაშოთ! რა ფერია ცა? ცა ცისფერია.' },
  { id: 'ka_num3',  voice: 'Kore', text: 'გამოთქვი ნათლად, ბავშვური ხმით, ქართულად: სამი.' }
];

const model = 'gemini-2.5-flash-preview-tts';
const report = [];
for (const l of LINES) {
  try {
    const r = await tts(model, l.text, l.voice);
    if (r.status !== 200) { report.push(`${l.id}: HTTP ${r.status} — ${r.body.slice(0, 180)}`); continue; }
    const j = JSON.parse(r.body);
    const b64 = j?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (!b64) { report.push(`${l.id}: no audio in response — ${r.body.slice(0, 180)}`); continue; }
    const wav = pcmToWav(Buffer.from(b64, 'base64'));
    const f = path.join(OUT, `gemini_${l.id}_${l.voice}.wav`);
    fs.writeFileSync(f, wav);
    report.push(`${l.id}: OK ${l.voice} → ${f} (${(wav.length / 1024).toFixed(0)}KB)`);
  } catch (e) { report.push(`${l.id}: ERR ${String(e).slice(0, 120)}`); }
}
console.log('model: ' + model);
console.log(report.join('\n'));
