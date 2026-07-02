import re, os, asyncio, edge_tts
D = os.path.dirname(__file__)
AUDIO = os.path.join(D,'..','niko','audio')
VOICE = 'ka-GE-EkaNeural'
man = open(os.path.join(D,'..','niko','audio-manifest.js'), encoding='utf-8').read()
pairs = dict((fn,t) for t,fn in re.findall(r'"([^"]+)":\s*"(tlk_\d+\.mp3)"', man))
TARGETS = ['tlk_000.mp3','tlk_018.mp3','tlk_025.mp3','tlk_026.mp3']  # the 4 grammar/drift-fixed cards

async def main():
    for fn in TARGETS:
        text = pairs.get(fn)
        if not text:
            print('MISSING key for', fn); continue
        await edge_tts.Communicate(text, VOICE).save(os.path.join(AUDIO, fn))
        print('regenerated', fn)

asyncio.run(main())
