import asyncio, edge_tts, os, json

AUD=os.path.join(os.path.dirname(__file__),'..','niko','audio')
# 6 new Georgian Talk & Think questions (no right answer; warm parent-child prompts)
Q=[
 'რომელი ფერი ხარ დღეს და რატომ?',
 'ჯადოსნური კარი რომ გქონდეს, სად გაგეხსნებოდა?',
 'რა გაგახარა დღეს ყველაზე მეტად?',
 'დღეს რა ისწავლე ახალი?',
 'ნივთები რომ ლაპარაკობდნენ, შენი ფეხსაცმელი რას იტყოდა?',
 'რას ნიშნავს გამბედავი? შენ როდის იყავი გამბედავი?',
]
START=6
m={}
async def gen():
    for k,q in enumerate(Q):
        fn='tlk_%03d.mp3'%(START+k)
        await edge_tts.Communicate(q,'ka-GE-EkaNeural').save(os.path.join(AUD,fn))
        m[q.lower()]=fn
asyncio.run(gen())
open(os.path.join(os.path.dirname(__file__),'_talk2_map.json'),'w',encoding='utf-8').write(json.dumps(m,ensure_ascii=False,indent=1))
print('NEW TALK CLIPS', len(m))
