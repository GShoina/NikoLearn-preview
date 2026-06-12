import asyncio, edge_tts, re, os
AUD='niko/audio'; MAN='niko/audio-manifest.js'
words=[
 ('გოგო',['გო','გო'],'👧',1),
 ('ბიჭი',['ბი','ჭი'],'👦',1),
 ('ყური',['ყუ','რი'],'👂',1),
 ('ხილი',['ხი','ლი'],'🍇',1),
 ('თვალი',['თვა','ლი'],'👁️',2),
 ('წყალი',['წყა','ლი'],'💧',2),
 ('თოვლი',['თოვ','ლი'],'❄️',2),
 ('მთვარე',['მთვა','რე'],'🌙',2),
 ('ფანჯარა',['ფან','ჯა','რა'],'🪟',2),
 ('კვერცხი',['კვერ','ცხი'],'🥚',2),
]
sents=[('ძაღლი ჭამს','🐶'),('კატა თამაშობს','🐱'),('თოვლი მოდის','❄️'),
       ('წვიმა მოდის','🌧️'),('გოგო მღერის','👧'),('ბიჭი ხტება','🤸'),
       ('ბავშვი სძინავს','😴'),('მზე ბრწყინავს','☀️')]
man=open(MAN,encoding='utf-8').read()
exist_lc={k.lower() for k in re.findall(r'"((?:[^"\\]|\\.)*)":', man)}
texts=[]
for w,syl,e,l in words: texts.append(w); texts+=syl
for s,e in sents: texts.append(s)
need=[]; seen=set()
for t in texts:
    k=t.lower()
    if k in seen or k in exist_lc: continue
    seen.add(k); need.append(t)
nums=[int(m) for m in re.findall(r'krd_(\d+)\.mp3', man)]
i=(max(nums)+1) if nums else 0
newman={}
async def gen():
    global i
    for t in need:
        fn='krd_%03d.mp3'%i; i+=1
        await edge_tts.Communicate(t,'ka-GE-EkaNeural').save(os.path.join(AUD,fn))
        newman[t]=fn
asyncio.run(gen())
import json
open('tools/_gen_map.json','w',encoding='utf-8').write(json.dumps({
  'manifest':newman,
  'words':[{'w':w,'syl':syl,'e':e,'lvl':l} for w,syl,e,l in words],
  'sents':[{'s':s,'e':e} for s,e in sents]},ensure_ascii=False,indent=1))
print('NEWCLIPS %d (of %d needed; rest reused from manifest)'%(len(newman),len(need)))
print('===MANIFEST===')
for t,fn in newman.items(): print(' "%s": "%s",'%(t.lower(),fn))
print('===WORDS===')
for w,syl,e,l in words: print("  {w:'%s', syl:[%s], e:'%s', lvl:%d},"%(w,','.join("'%s'"%s for s in syl),e,l))
print('===SENTS===')
for s,e in sents: print("  {s:'%s', e:'%s'},"%(s,e))
