import asyncio, edge_tts, os

AUD = os.path.join(os.path.dirname(__file__), '..', 'niko', 'audio')
# v1.186 — 3 grammar-corrected clips (owner fixes) + 6 new Talk & Think cards (deck -> 33).
# Text MUST match talk.js TALK.ka q + audio-manifest.js key EXACTLY (playClip looks up by the q text).
CLIPS = {
  # corrected (regenerate so the spoken audio matches the fixed text)
  'tlk_013.mp3': 'ჯიბეში პატარა დრაკონი რომ გეპოვა, რას დაარქმევდი და რას აჭმევდი?',
  'tlk_016.mp3': 'ყველაზე სასაცილო ზებუნებრივი ძალა რომელი იქნებოდა?',
  'tlk_025.mp3': 'დილით რომ გაიღვიძებდი და ყველაფერი თავდაყირა იყოს, რას იზამდი?',
  # new (expansion #4)
  'tlk_027.mp3': 'ზღვის ფსკერზე ერთ დღეს რომ გაატარებდი, ვის შეხვდებოდი?',
  'tlk_028.mp3': 'მარტო და მოწყენილი ბავშვი რომ დაინახო, რას ეტყოდი?',
  'tlk_029.mp3': 'ფერებს ხმა რომ ჰქონდეთ, წითელი როგორ იჟღერებდა?',
  'tlk_030.mp3': 'დღეს რა გააკეთე ისეთი, რითაც ამაყობ?',
  'tlk_031.mp3': 'ბევრი ბუშტი რომ აგაფრენდა ცაში, პირველად სად გაფრინდებოდი?',
  'tlk_032.mp3': 'ხვალ ერთ კეთილ საქმეს რომ გააკეთებდი, რა იქნებოდა?',
}

async def gen():
    for fn, q in CLIPS.items():
        await edge_tts.Communicate(q, 'ka-GE-EkaNeural').save(os.path.join(AUD, fn))
        print('ok', fn)

asyncio.run(gen())
print('TALK CLIPS WRITTEN', len(CLIPS))
