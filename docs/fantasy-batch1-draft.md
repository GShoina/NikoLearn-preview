# ფანტაზიის კონტენტი — Batch 1 (Gemini-QA'd 2026-06-17, awaiting OWNER §6f)

Variant A: new themed cards ADDED into the existing „საუბარი და ფიქრი" deck. ka clip via edge-tts AFTER owner-final.
EN = runtime voice (no clip). Poems = reading, 7+ gate, NO audio. End-interaction = v1.187 row.
NO em dash anywhere EXCEPT poems (owner poetic exception). Gemini fixes marked [G].

## New TALK_THEMES
- impossible 🚀 „შეუძლებელი ისტორიები"  color var(--sky)
- finish     🖍️ „დაასრულე ამბავი"       color var(--green)
- whatif     🦄 „რა მოხდებოდა თუ..."     color var(--purple)
- theater    🎭 „წარმოსახვის თეატრი"     color var(--primary)
- poem       🐸 „სასაცილო ლექსები"        7+ gate, reading

---
## 🚀 შეუძლებელი ისტორიები
1. ka: ერთ დილას მზე დაიღალა და დაიძინა. ცაში მხოლოდ ერთი პატარა ვარსკვლავი დარჩა. რა მოხდა მერე?
   en: One morning the sun got tired and fell asleep. Only one little star was left in the sky. What happened next?
2. ka: თევზს ფეხები ამოუვიდა და ხმელეთზე გამოვიდა სასეირნოდ. პირველად ვის შეხვდა?
   en: A fish grew legs and came out for a walk on land. Who did it meet first?
3. ka [G]: ღამით სათამაშოები გაცოცხლდნენ და სამზარეულოში დიდი წვეულება გამართეს. რა მოამზადეს?
   en: At night the toys came alive and threw a big party in the kitchen. What did they cook?

## 🖍️ დაასრულე ამბავი
1. ka: პატარა ღრუბელს ცისარტყელის დახატვა უნდოდა, მაგრამ მხოლოდ ლურჯი საღებავი ჰქონდა. ამიტომ მან...
   en: A little cloud wanted to paint a rainbow, but it only had blue paint. So it...
2. ka: ჭიანჭველამ უზარმაზარი ნამცეცი იპოვა და სახლში წაღება მოინდომა. გზად კი...
   en: An ant found a giant crumb and wanted to carry it home. But on the way...

## 🦄 რა მოხდებოდა თუ...
1. ka: რა მოხდებოდა, შენი ჩრდილი შენგან რომ გაქცეულიყო და თვითონ ეცეკვა?
   en: What would happen if your shadow ran away from you and danced on its own?
2. ka [G]: რა მოხდებოდა, წიგნებს ზღაპრების ხმამაღლა კითხვა რომ შეძლებოდათ მაშინ, როცა მათ არავინ უსმენს?
   en: What would happen if books could read their stories out loud when no one is listening?
3. ka: რა მოხდებოდა, წვიმის წვეთები ზევით, ცისკენ რომ ცვიოდნენ?
   en: What would happen if raindrops fell upward, toward the sky?

## 🎭 წარმოსახვის თეატრი
1. ka: წარმოიდგინე, რომ პატარა ღრუბელი ხარ. მაჩვენე, როგორ მოძრაობ, როცა ქარი გიბერავს.
   en: Pretend you are a little cloud. Show me how you move when the wind blows you.
2. ka: წარმოიდგინე, რომ მამაცი კატა ხარ, რომელმაც პირველად ნახა თოვლი. რას იზამ?
   en: Pretend you are a brave cat seeing snow for the first time. What do you do?
3. ka: გახდი რობოტი, რომელმაც ახლახან ისწავლა სიცილი. როგორ იცინი?
   en: Become a robot that just learned to laugh. How do you laugh?

## 🐸 სასაცილო ლექსები (7+, reading, em-dash = owner poetic exception)
1. [OWNER-FINAL 2026-06-16, ship as is]
   ბაყაყმა იყიდა წითელი ჩექმა,
   ტბაში აღარ შედის — ნახეთ, როგორ მოიქცა!
   დადის და ტრაბახობს: „ვინ მნახა ასეთი —
   ფეხსაცმელიანი ბაყაყი ერთადერთი!"
   en (needs own pass): My socks went off on holiday, they packed a tiny shoe, / they left a note that simply said: too stinky here, we flew!
2. [G — Gemini rhyme/meter fix; NEEDS owner-final]
   საათში თაგვი ცხოვრობდა, ტიკ-ტაკის ხმაზე ხტოდა,
   ცეკვაში დრო გაეპარა, დროს სულაც არ ნაღვლობდა.
   ამიტომ მთელმა ქალაქმა, ერთი საათით დააგვიანა.

---
## WIRE-READY (apply to talk.js ONLY after owner §6f) — TALK_THEMES + cards
```js
// add to TALK_THEMES:
impossible:{ic:'🚀', label:'შეუძლებელი ისტორიები', color:'var(--sky)'},
finish:    {ic:'🖍️', label:'დაასრულე ამბავი',      color:'var(--green)'},
whatif:    {ic:'🦄', label:'რა მოხდებოდა თუ...',     color:'var(--purple)'},
theater:   {ic:'🎭', label:'წარმოსახვის თეატრი',     color:'var(--primary)'},
// poem theme handled separately (7+ gate + reading layout)

// add to TALK.ka (and parallel TALK.en) — emoji/by chosen per card:
{theme:'impossible', emoji:'🌙⭐', by:'owl',  q:'ერთ დილას მზე დაიღალა და დაიძინა...'},
// ...etc (see lists above)
```
NOTE: 🐸 poems need a 7+ age gate + reading treatment (not the voiced talk-card path) → small structural add, do in the poem sub-step.
