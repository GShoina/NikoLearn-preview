import asyncio, edge_tts, os, json

AUD=os.path.join(os.path.dirname(__file__),'..','niko','audio')
# v1.162 — Talk & Think expansion #3 (15 quirkier Georgian prompts). Text MUST match talk.js TALK.ka q exactly.
Q=[
 'წინდები რომ ქრებიან, სად მიდიან, როგორ ფიქრობ?',
 'ჯიბეში პატარა დრაკონი რომ გეპოვა, რა დაარქმევდი და რას აჭმევდი?',
 'ეზოში ახალი ბავშვი მარტო დგას — შენ რას იზამდი?',
 'ცის ერთ ვარსკვლავს ქილაში რომ დაიჭერდი, მის შუქს რას უზამდი?',
 'ყველაზე სასაცილო ზესძალა რომელი იქნებოდა?',
 'სახლი ფეხებზე რომ დადიოდეს, სასეირნოდ სად წავიდოდა?',
 'მთელ მსოფლიოს ერთ წესს რომ უყენებდე, რა იქნებოდა?',
 'წვიმას გემო რომ ჰქონდეს, რა გემოს ისურვებდი?',
 'ერთი საათით უჩინარი რომ გამხდარიყავი, რას გააკეთებდი?',
 'დღევანდელი სიზმარი ფილმი რომ ყოფილიყო, რაზე იქნებოდა?',
 'ერთი დღით ჭიანჭველასავით პატარა იქნებოდი თუ შენობასავით დიდი? რატომ?',
 'მეგობარი მოწყენილია — როგორ გააცინებდი?',
 'ახალ დღესასწაულს რომ მოიგონებდი, ხალხი იმ დღეს რას აკეთებდა?',
 'დილით რომ გაიღვიძებდი და ყველაფერი თავდაყირა იყო, რას იზამდი?',
 'ძილის წინ დღეს ერთ სიტყვას რომ ეტყოდი, რას ეტყვი?',
]
START=12
m={}
async def gen():
    for k,q in enumerate(Q):
        fn='tlk_%03d.mp3'%(START+k)
        await edge_tts.Communicate(q,'ka-GE-EkaNeural').save(os.path.join(AUD,fn))
        m[q.lower()]=fn
        print('ok', fn)
asyncio.run(gen())
open(os.path.join(os.path.dirname(__file__),'_talk3_map.json'),'w',encoding='utf-8').write(json.dumps(m,ensure_ascii=False,indent=1))
print('NEW TALK CLIPS', len(m))
