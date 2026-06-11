import asyncio, edge_tts, re, os
AUD='niko/audio'; MAN='niko/audio-manifest.js'
words=[
 ('ხელი',['ხე','ლი'],'✋',1),
 ('ფეხი',['ფე','ხი'],'🦶',1),
 ('თევზი',['თევ','ზი'],'🐟',2),
 ('ჩიტი',['ჩი','ტი'],'🐦',1),
 ('კარი',['კა','რი'],'🚪',1),
 ('ნავი',['ნა','ვი'],'⛵',1),
 ('ფული',['ფუ','ლი'],'💰',1),
 ('პეპელა',['პე','პე','ლა'],'🦋',2),
]
sents=[('ბავშვი ხატავს','🎨'),('კურდღელი ხტება','🐰'),('ჩიტი მღერის','🐦'),
       ('გოგო ცეკვავს','💃'),('ბიჭი დარბის','🏃'),('ფუტკარი დაფრინავს','🐝')]
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
print('NEWCLIPS %d (of %d needed; rest reused from manifest)'%(len(newman),len(need)))
print('===MANIFEST===')
for t,fn in newman.items(): print(' "%s": "%s",'%(t.lower(),fn))
print('===WORDS===')
for w,syl,e,l in words: print("  {w:'%s', syl:[%s], e:'%s', lvl:%d},"%(w,','.join("'%s'"%s for s in syl),e,l))
print('===SENTS===')
for s,e in sents: print("  {s:'%s', e:'%s'},"%(s,e))
