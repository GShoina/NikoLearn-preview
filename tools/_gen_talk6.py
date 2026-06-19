import asyncio, edge_tts, os, re, json

ROOT = os.path.join(os.path.dirname(__file__), '..')
AUD = os.path.join(ROOT, 'niko', 'audio')
TALK = os.path.join(ROOT, 'niko', 'talk.js')

# v1.204 — voice the new „ჟანრების კუთხე" Georgian cards (tale/fable). Niko noticed they were silent
# (owner 2026-06-19). Poems are intentionally left as-is. Read the q text STRAIGHT from talk.js so the
# AUDIO_MANIFEST key matches the card exactly (playClip resolves by the q text).
src = open(TALK, encoding='utf-8').read()
GEO = re.compile('[Ⴀ-ჿ]')
clips = {}   # filename -> spoken text
manifest = []
n = 46
for m in re.finditer(r"theme:'(tale|fable)',[^\n]*?q:'([^']*)'", src):
    q = m.group(2)
    if not GEO.search(q):     # skip the English deck cards
        continue
    fn = 'tlk_%03d.mp3' % n
    clips[fn] = q
    manifest.append('  %s: "%s",' % (json.dumps(q.lower(), ensure_ascii=False), fn))
    n += 1

async def gen():
    for fn, q in clips.items():
        await edge_tts.Communicate(q, 'ka-GE-EkaNeural').save(os.path.join(AUD, fn))
        print('ok', fn, '-', q[:34])

asyncio.run(gen())
print('\n--- MANIFEST LINES (insert into niko/audio-manifest.js) ---')
print('\n'.join(manifest))
print('TALK CLIPS WRITTEN', len(clips))
