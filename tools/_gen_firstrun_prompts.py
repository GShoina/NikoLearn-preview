# NikoLearn — NB-21/NB-22 (first-run pre-reader class fix): voice the 9 first-run TASK prompts.
# Build-time edge_tts (ka-GE-EkaNeural). frPlay() plays niko/audio/<name>.mp3 directly (no manifest).
import asyncio, os, sys
sys.stdout.reconfigure(encoding="utf-8")
ADIR = r"C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand\niko\audio"
VOICE = "ka-GE-EkaNeural"
import edge_tts

# name -> exact spoken text (Georgian instruction; matches FR_SUBJ task prompts)
CLIPS = {
    "fr_tc1": "დაითვალე ვაშლები. რამდენია?",
    "fr_tc2": "ახლა დაითვალე. რამდენია?",
    "fr_tc3": "კიდევ ერთხელ. რამდენია?",
    "fr_ta1": "იპოვე ასო ა.",
    "fr_ta2": "იპოვე ასო ბ.",
    "fr_ta3": "იპოვე ასო ო.",
    "fr_te1": "რომელია კატა ინგლისურად?",
    "fr_te2": "რომელია ძაღლი ინგლისურად?",
    "fr_te3": "რომელია მზე ინგლისურად?",
}

async def gen(name, text):
    out = os.path.join(ADIR, name + ".mp3")
    await edge_tts.Communicate(text, voice=VOICE).save(out)
    if os.path.getsize(out) < 200:
        raise RuntimeError("clip too small")
    return os.path.getsize(out)

async def main():
    ok = 0
    for name, text in CLIPS.items():
        try:
            sz = await gen(name, text); ok += 1; print(f"ok -> {name}.mp3 ({sz}b) | {text}")
        except Exception as e:
            print("FAIL", name, str(e)[:120])
    print(f"\ndone ok={ok}/{len(CLIPS)}")

asyncio.run(main())
