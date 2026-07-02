import re, os
D = os.path.dirname(__file__)
talk = open(os.path.join(D,'..','niko','talk.js'), encoding='utf-8').read()
man  = open(os.path.join(D,'..','niko','audio-manifest.js'), encoding='utf-8').read()

# all q: '...' values in talk.js (single-quoted). Handles escaped \' inside.
qs = re.findall(r"q:'((?:[^'\\]|\\.)*)'", talk)
qs = [q.replace("\\'","'") for q in qs]

# manifest tlk entries: "text": "tlk_NNN.mp3"
man_pairs = re.findall(r'"([^"]+)":\s*"(tlk_\d+\.mp3)"', man)
man_keys = {t for t,_ in man_pairs}

q_set = set(qs)
# q texts that have NO manifest key (drifted q, clip unreachable)
q_missing = [q for q in qs if q not in man_keys]
# manifest keys that are no longer any q (orphan old text)
orphans = [t for t,_ in man_pairs if t not in q_set]

with open(os.path.join(D,'_talk_diff.txt'),'w',encoding='utf-8') as f:
    f.write(f'TOTAL q in talk.js: {len(qs)}\n')
    f.write(f'TOTAL tlk manifest entries: {len(man_pairs)}\n\n')
    f.write(f'=== q MISSING from manifest ({len(q_missing)}) ===\n')
    for q in q_missing: f.write('  Q: '+q+'\n')
    f.write(f'\n=== manifest ORPHAN keys ({len(orphans)}) ===\n')
    for t,fn in man_pairs:
        if t in orphans: f.write(f'  {fn}: {t}\n')
print(f'q={len(qs)} man={len(man_pairs)} q_missing={len(q_missing)} orphans={len(orphans)} -> tools/_talk_diff.txt')
