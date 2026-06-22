import asyncio, edge_tts, os, json

# v1.210 — widen the SPOKEN praise pool. The child heard only 4 ka praise words on every correct
# answer (ბრავო/მართალია/შესანიშნავია/ყოჩაღ) which felt repetitive (owner 2026-06-22). Add warm,
# natural Georgian praise variants as recorded clips (most devices have no ka TTS voice, so praise
# MUST be a recorded clip or it falls back to English). Same voice as all other ka clips.
ROOT = os.path.join(os.path.dirname(__file__), '..')
AUD  = os.path.join(ROOT, 'niko', 'audio')

# word -> clip filename. Natural praise a Georgian parent/teacher says to a small child.
WORDS = {
  'ზუსტად':        'prs_01.mp3',
  'სწორია':        'prs_02.mp3',
  'ძალიან კარგი':  'prs_03.mp3',
  'გენიოსი ხარ':   'prs_04.mp3',
  'გაიხარე':       'prs_05.mp3',
  'აი, ასე':       'prs_06.mp3',
}

async def gen():
    os.makedirs(AUD, exist_ok=True)
    for w, fn in WORDS.items():
        await edge_tts.Communicate(w, 'ka-GE-EkaNeural').save(os.path.join(AUD, fn))
        print('ok', fn, '-', w)

asyncio.run(gen())
print('\n--- MANIFEST LINES (insert into niko/audio-manifest.js) ---')
for w, fn in WORDS.items():
    print('  %s: "%s",' % (json.dumps(w, ensure_ascii=False), fn))
print('PRAISE CLIPS WRITTEN', len(WORDS))
