# NikoLearn — „ბუს ქვეყანა" (concept v2): clip generator for world + inner play-names.
# Idempotent: skips files that already exist. Prints the manifest fragment to append.
# Build-time only (edge_tts) — runtime ka-TTS ban is device-only.
import asyncio, os, sys
sys.stdout.reconfigure(encoding="utf-8")
ADIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "niko", "audio")
VOICE = "ka-GE-EkaNeural"
import edge_tts

# (manifest key, spoken text, filename) — key must equal the rendered label lowercased (clipFor contract).
TARGETS = [
    ("რიცხვების სამეფო",    "რიცხვების სამეფო",    "wclip_01.mp3"),
    ("ასოების ქალაქი",      "ასოების ქალაქი",      "wclip_02.mp3"),
    ("ინგლისურის კუნძული",  "ინგლისურის კუნძული",  "wclip_03.mp3"),
    ("დათვლის ჯუნგლები",    "დათვლის ჯუნგლები",    "wclip_04.mp3"),
    ("საუბრის ბუდე",        "საუბრის ბუდე",        "wclip_05.mp3"),
    ("მოძრაობის მოედანი",   "მოძრაობის მოედანი",   "wclip_06.mp3"),
    ("სიტყვების ძებნა",     "სიტყვების ძებნა",     "wclip_07.mp3"),
    ("ხატვის სტუდია",       "ხატვის სტუდია",       "wclip_08.mp3"),
    ("ფიგურების ქვეყანა",   "ფიგურების ქვეყანა",   "wclip_09.mp3"),
    ("ციფრების გამოცანა",   "ციფრების გამოცანა",   "wclip_10.mp3"),
    ("ასოების სახლები",     "ასოების სახლები",     "wclip_11.mp3"),
    ("გამოცანების კოშკი",   "გამოცანების კოშკი",   "wclip_12.mp3"),
    ("ზღაპრების ხე",        "ზღაპრების ხე",        "wclip_13.mp3"),
    ("ჯადოსნური კალამი",    "ჯადოსნური კალამი",    "wclip_14.mp3"),
    ("abc ნაპირი",          "ეი ბი სი ნაპირი",      "wclip_15.mp3"),
    ("განძის ძიება",        "განძის ძიება",        "wclip_16.mp3"),
    ("შეკრების ბილიკი",     "შეკრების ბილიკი",     "wclip_17.mp3"),
    ("გამოკლების მდინარე",  "გამოკლების მდინარე",  "wclip_18.mp3"),
    ("იპოვე წესი",          "იპოვე წესი",          "wclip_19.mp3"),
]

async def gen():
    made = 0
    for key, speak, fn in TARGETS:
        path = os.path.join(ADIR, fn)
        if os.path.exists(path) and os.path.getsize(path) > 2000:
            print(f"skip (exists): {fn}"); continue
        await edge_tts.Communicate(speak, VOICE).save(path)
        sz = os.path.getsize(path)
        print(f"made {fn} ({sz}b) ← {speak}")
        assert sz > 2000, f"{fn} suspiciously small"
        made += 1
    print(f"\n--- manifest fragment (append before closing }}) ---")
    for key, _, fn in TARGETS:
        print(f' "{key}": "{fn}",')
    print(f"done: {made} generated, {len(TARGETS)-made} skipped")

asyncio.run(gen())
