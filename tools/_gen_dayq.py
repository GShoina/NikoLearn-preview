# NikoLearn — "დღის კითხვა" voicing: EkaNeural clips for the 6 questions + 6 answers (dayq v4).
# Build-time only (edge_tts); the device-side runtime ka-TTS ban does NOT apply to recorded clips.
# Idempotent: skips files that already exist (>2000b). Reads tools/dayq-tts.json (the drift-guarded
# extract of niko/dayq.js — regenerate it with `node tools/dayq-extract.mjs tools/dayq-tts.json`).
# The English reward word is deliberately NOT voiced (open PI-104 English-voice gate stays untouched).
import asyncio, os, sys, json
sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ADIR = os.path.join(ROOT, "niko", "audio")
JSON_PATH = os.path.join(ROOT, "tools", "dayq-tts.json")
VOICE = "ka-GE-EkaNeural"
import edge_tts

with open(JSON_PATH, encoding="utf-8") as f:
    TARGETS = json.load(f)

async def gen():
    made = 0
    for e in TARGETS:
        fn, speak = e["file"], e["text"]
        path = os.path.join(ADIR, fn)
        if os.path.exists(path) and os.path.getsize(path) > 2000:
            print(f"skip (exists): {fn}"); continue
        await edge_tts.Communicate(speak, VOICE).save(path)
        sz = os.path.getsize(path)
        assert sz > 2000, f"{fn} suspiciously small ({sz}b)"
        print(f"made {fn} ({sz}b) [{e['kind']}] ← {speak[:38]}…")
        made += 1
    print(f"\ndone: {made} generated, {len(TARGETS)-made} skipped, {len(TARGETS)} total")

asyncio.run(gen())
