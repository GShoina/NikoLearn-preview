import re, os
MANIFEST = os.path.join(os.path.dirname(__file__), '..', 'niko', 'audio-manifest.js')
with open(MANIFEST, encoding='utf-8') as f:
    src = f.read()
# match  "<text>": "tlk_NNN.mp3",
pairs = re.findall(r'"([^"]+)":\s*"(tlk_\d+\.mp3)"', src)
out = os.path.join(os.path.dirname(__file__), '_talk_texts.txt')
with open(out, 'w', encoding='utf-8') as f:
    for text, fn in pairs:
        f.write(f'{fn}\t{text}\n')
print('extracted', len(pairs), 'talk texts to tools/_talk_texts.txt')
