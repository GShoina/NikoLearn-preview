import asyncio, edge_tts, os

OUT = os.path.join(os.path.dirname(__file__), '..', 'niko', 'audio')
VOICE = 'ka-GE-EkaNeural'
CLIPS = {
    'reco_start.mp3': 'დაიწყე აქედან',
}

async def main():
    lines = []
    for fn, phrase in CLIPS.items():
        path = os.path.join(OUT, fn)
        await edge_tts.Communicate(phrase, VOICE).save(path)
        lines.append(f'  "{phrase.lower()}":"{fn}",')
    # write manifest lines to a utf-8 file (Windows cp1252 stdout can't print Georgian)
    with open(os.path.join(os.path.dirname(__file__), '_reco_manifest.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print('generated', len(CLIPS), 'clip(s); manifest lines in tools/_reco_manifest.txt')

asyncio.run(main())
