import asyncio, edge_tts, os
OUT = os.path.join(os.path.dirname(__file__), '..', 'niko', 'audio')
VOICE = 'ka-GE-EkaNeural'
CLIPS = {
    'mulprimer.mp3': 'გამრავლება ნიშნავს ერთი და იმავე რიცხვის რამდენჯერმე შეკრებას. დაითვალე ჯგუფებად და ერთად ვისწავლოთ.',
}
async def main():
    lines=[]
    for fn,ph in CLIPS.items():
        await edge_tts.Communicate(ph, VOICE).save(os.path.join(OUT, fn))
        lines.append(f' "{ph.lower()}": "{fn}",')
    with open(os.path.join(os.path.dirname(__file__),'_mulprimer_manifest.txt'),'w',encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print('generated', len(CLIPS), 'clip; manifest in tools/_mulprimer_manifest.txt')
asyncio.run(main())
