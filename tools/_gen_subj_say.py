import asyncio, edge_tts, os
# Fixed voiceable ka tutor phrases for the remaining subjects so the owl SPEAKS everywhere (INV-3 fan-out).
# Key == the exact tutor.js `say` string (lowercased) for owl.js speakHint()->playClip().
AUD='niko/audio'
PHRASES=[
  "დააკვირდი სურათს და მოისმინე. ბგერები გეტყვის სწორ სიტყვას.",
  "მოისმინე, როგორ იწყება სიტყვა. პირველი ბგერა გეტყვის სწორ ასოს.",
  "დააკვირდი და მოისმინე. იპოვე მთავარი სიტყვა, მერე შეამოწმე ფერი და რიცხვი.",
  "დაითვალე ნელა, თითო-თითო, ხმამაღლა.",
  "შეადარე ორი რიცხვი. ნიშნის ღია მხარე დიდი რიცხვისკენ იყურება.",
  "ყოველ ნაბიჯზე ერთი და იგივე რიცხვი ემატება. იპოვე ეს ნაბიჯი.",
  "დაითვალე ფიგურის გვერდები და კუთხეები. ისინი გეტყვის სახელს.",
  "დაითვალე მონეტები. დაიწყე დიდიდან და დაუმატე დანარჩენი.",
  "პატარა ისარი აჩვენებს საათს, დიდი ისარი წუთებს.",
]
async def gen():
    out={}
    for i,p in enumerate(PHRASES):
        fn='csay_%03d.mp3'%i
        await edge_tts.Communicate(p,'ka-GE-EkaNeural').save(os.path.join(AUD,fn))
        out[p]=fn
    return out
res=asyncio.run(gen())
with open('tools/_csay_manifest.txt','w',encoding='utf-8') as f:
    for p,fn in res.items(): f.write(' "%s": "%s",\n'%(p.lower(),fn))
print('done: %d clips'%len(res))
