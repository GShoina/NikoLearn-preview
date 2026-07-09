# NikoLearn — NB-10: append-only clip generator for the CURRENT MOVE_POOL move NAMES
# that are not yet in the manifest. Idempotent: derives manifest max clip index,
# clears strays above it, generates contiguous clips, writes a manifest fragment.
# Build-time only (edge_tts) — runtime ka-TTS ban is device-only.
import asyncio, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
REPO = r"C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand\niko"
ADIR = os.path.join(REPO, "audio")
MANI = os.path.join(REPO, "audio-manifest.js")
VOICE = "ka-GE-EkaNeural"

import edge_tts

# The 9 current MOVE_POOL ka-names with NO manifest clip (checked 2026-07-09).
TARGETS = [
    "ახტომა მაღლა",
    "ხელების აწევა",
    "ვარსკვლავური ხტომა",
    "გვერდითი მოხრა",
    "ტაში მაღლა",
    "ადგილზე სირბილი",
    "ბოქსი",
    "ბაყაყივით ხტომა",
    "ფლამინგო",
]

mani_txt = open(MANI, encoding="utf-8").read()
orig_max = max(int(n) for n in re.findall(r"clip_(\d+)\.mp3", mani_txt))
print("manifest original max clip index:", orig_max)

for f in os.listdir(ADIR):
    m = re.match(r"clip_(\d+)\.mp3$", f)
    if m and int(m.group(1)) > orig_max:
        os.remove(os.path.join(ADIR, f)); print("removed stray", f)

start = orig_max + 1
print("new clips start at", start)

manifest = {}
async def gen(idx, text):
    fn = "clip_%03d.mp3" % idx
    out = os.path.join(ADIR, fn)
    await edge_tts.Communicate(text, voice=VOICE).save(out)
    if os.path.getsize(out) < 200:
        raise RuntimeError("clip too small")
    return fn

async def main():
    ok = fail = 0
    for i, t in enumerate(TARGETS):
        try:
            fn = await gen(start + i, t)
            manifest[t.strip().lower()] = fn
            ok += 1; print("ok ->", fn, "|", t)
        except Exception as e:
            fail += 1; print("FAIL", repr(t), str(e)[:120])
    return ok, fail

ok, fail = asyncio.run(main())
print("\nclips ok=%d fail=%d" % (ok, fail))
frag = "".join("  '%s': '%s',\n" % (k, v) for k, v in manifest.items())
open(os.path.join(REPO, "_move2_manifest_fragment.txt"), "w", encoding="utf-8").write(frag)
print("\n--- FRAGMENT (also niko/_move2_manifest_fragment.txt) ---")
print(frag)
