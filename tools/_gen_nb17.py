import asyncio, edge_tts, os
# NB-17: voice young (<=5) abstract add/sub + visual take-away sub.
# Same voice as every other number clip (ka-GE-EkaNeural) so the sequence sounds consistent.
# Keys == the exact spoken text (lowercased) — the runtime voices by passing this text to playClipSeq/speak.
AUD = 'niko/audio'
VOICE = 'ka-GE-EkaNeural'

# dative (-ს) forms of 1..20 — the FIRST operand of subtraction ("ცხრას გამოვაკლოთ სამი"),
# owner-validated 2026-07-06 (nominative "ცხრა გამოვაკლოთ" is ungrammatical).
DAT = ['', 'ერთს','ორს','სამს','ოთხს','ხუთს','ექვსს','შვიდს','რვას','ცხრას','ათს',
       'თერთმეტს','თორმეტს','ცამეტს','თოთხმეტს','თხუთმეტს','თექვსმეტს','ჩვიდმეტს','თვრამეტს','ცხრამეტს','ოცს']

PHRASES = {

  'გამოვაკლოთ': 'nb17_minus.mp3',  # sub connective: "ცხრას გამოვაკლოთ სამი"
  'რამდენი დარჩა?': 'nb17_left.mp3',  # visual take-away sub prompt
}
for n in range(1, 21):
    PHRASES[DAT[n]] = 'nb17_dat_%02d.mp3' % n

async def gen():
    out = {}
    for text, fn in PHRASES.items():
        await edge_tts.Communicate(text, VOICE).save(os.path.join(AUD, fn))
        out[text] = fn
    return out

res = asyncio.run(gen())
# emit JS-ready manifest lines to a utf-8 file (Windows stdout can't print Georgian reliably)
with open('tools/_nb17_manifest.txt', 'w', encoding='utf-8') as f:
    for text, fn in res.items():
        f.write(' "%s": "%s",\n' % (text.lower(), fn))
print('done: %d clips' % len(res))
