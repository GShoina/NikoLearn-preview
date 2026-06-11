import asyncio, edge_tts, re, os
# Generate Georgian voice clips for the "საუბარი და ფიქრი" KA talk cards.
# Parses niko/talk.js directly so the manifest key == the exact runtime c.q string.
AUD='niko/audio'; MAN='niko/audio-manifest.js'; TALK='niko/talk.js'

src=open(TALK,encoding='utf-8').read()
# isolate the ka:[ ... ] block (up to the en:[ that follows)
ka_start=src.index('ka:[')
en_start=src.index('en:[', ka_start)
ka_block=src[ka_start:en_start]
# pull each q:'...' (ka strings use single-quote delims and contain no apostrophes)
qs=re.findall(r"q:'((?:[^'\\]|\\.)*)'", ka_block)
print('PARSED %d ka questions'%len(qs))

man=open(MAN,encoding='utf-8').read()
exist_lc={k.lower() for k in re.findall(r'"((?:[^"\\]|\\.)*)":', man)}
need=[]; seen=set()
for q in qs:
    k=q.lower()
    if k in seen or k in exist_lc: continue
    seen.add(k); need.append(q)

nums=[int(m) for m in re.findall(r'tlk_(\d+)\.mp3', man)]
i=(max(nums)+1) if nums else 0
newman={}
async def gen():
    global i
    for q in need:
        fn='tlk_%03d.mp3'%i; i+=1
        await edge_tts.Communicate(q,'ka-GE-EkaNeural').save(os.path.join(AUD,fn))
        newman[q]=fn
asyncio.run(gen())
print('NEWCLIPS %d (of %d needed; rest reused)'%(len(newman),len(need)))
print('===MANIFEST===')
for q,fn in newman.items(): print(' "%s": "%s",'%(q.lower(),fn))
