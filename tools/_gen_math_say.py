import asyncio, edge_tts, os
# Fixed, voiceable ka math-tutor phrases (no numbers) so the owl SPEAKS in math via recorded clips.
# Key == the exact tutor.js math() `say` string (lowercased) for owl.js speakHint()->playClip().
AUD='niko/audio'
PHRASES=[
  "შეკრებაში დაიწყე დიდი რიცხვიდან და დაითვალე წინ, თითო-თითო. თუ გინდა, დიდი რიცხვი დაშალე ათეულებად და ერთეულებად.",
  "გამოკლებაში დიდი რიცხვიდან დაითვალე უკან. ან იფიქრე, რამდენი უნდა დაუმატო პატარას, რომ დიდი გამოვიდეს.",
  "გამრავლება ერთი რიცხვის რამდენჯერმე შეკრებაა. დაითვალე ჯგუფებად, თითო რიცხვით.",
  "ჯერ ის ფასები ნახე, რომლებიც უკვე იცი. მერე ჩაანაცვლე და უცნობი იპოვე.",
  "გამოთვალე ნაბიჯ-ნაბიჯ, მარცხნიდან მარჯვნივ. ჯერ პირველი ორი რიცხვი, მერე მესამე.",
  "იპოვე წესი: რა იცვლება ყოველ ბიჯზე. მერე იგივე წესი გაიმეორე გამოტოვებულ ადგილას.",
]
async def gen():
    out={}
    for i,p in enumerate(PHRASES):
        fn='msay_%03d.mp3'%i
        await edge_tts.Communicate(p,'ka-GE-EkaNeural').save(os.path.join(AUD,fn))
        out[p]=fn
    return out
res=asyncio.run(gen())
# write manifest lines to a utf-8 file (Windows stdout can't print Georgian)
with open('tools/_msay_manifest.txt','w',encoding='utf-8') as f:
    for p,fn in res.items(): f.write(' "%s": "%s",\n'%(p.lower(),fn))
print('done: %d clips'%len(res))
