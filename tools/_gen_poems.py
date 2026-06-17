import asyncio, edge_tts, os, json

HERE = os.path.dirname(__file__)
AUD = os.path.join(HERE, '..', 'niko', 'audio')
# v1.189 — voice the 2 ფანტაზიის-კუთხე poems (owner 2026-06-17: voicing is better, add it to poems too).
# Text comes from _poems.json (extracted byte-exact from talk.js TALK.ka, real newlines) so it matches c.q.
with open(os.path.join(HERE, '_poems.json'), encoding='utf-8') as f:
    CLIPS = json.load(f)

async def gen():
    for fn, q in CLIPS.items():
        await edge_tts.Communicate(q, 'ka-GE-EkaNeural').save(os.path.join(AUD, fn))
        print('ok', fn)

asyncio.run(gen())
print('POEM CLIPS WRITTEN', len(CLIPS))
