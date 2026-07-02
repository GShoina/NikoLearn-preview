import asyncio, edge_tts, os

OUT = os.path.join(os.path.dirname(__file__), '..', 'niko', 'audio')
VOICE = 'ka-GE-EkaNeural'
# fixed voiceable ka strategy phrases for the English-practice modes that had NO owl voice
# (listen-yle / yesno / speak / story returned early with no r.say). No numbers/dynamic content.
CLIPS = {
    'yle_say.mp3':   'მოუსმინე ყურადღებით. ჯერ დაითვალე რამდენია, მერე იპოვე რა საგანია.',
    'yesno_say.mp3': 'დააკვირდი სურათს. თუ წინადადება ემთხვევა, თქვი კი. თუ არა, თქვი არა.',
    'speak_say.mp3': 'მოუსმინე კითხვას, მერე ხმამაღლა უპასუხე ინგლისურად. მთავარია სცადო.',
    'story_say.mp3': 'ჯერ წაიკითხე ამბავი, მერე კითხვა. პასუხი თვითონ ტექსტშია.',
}

async def main():
    lines = []
    for fn, phrase in CLIPS.items():
        await edge_tts.Communicate(phrase, VOICE).save(os.path.join(OUT, fn))
        lines.append(f' "{phrase.lower()}": "{fn}",')
    with open(os.path.join(os.path.dirname(__file__), '_mode_say_manifest.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print('generated', len(CLIPS), 'clips; manifest lines in tools/_mode_say_manifest.txt')

asyncio.run(main())
