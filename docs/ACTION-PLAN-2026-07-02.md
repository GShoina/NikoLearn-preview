# NikoLearn — სამოქმედო გეგმა v2 (მფლობლის მიერ დამტკიცებული 2026-07-02)

> SSOT ამ სპრინტისთვის. baseline რიცხვები ცოცხალი `/v1/stats` pull-იდან (17 დღე, 2026-06-16→07-02).
> სტანდარტი: თითო item = განმარტება + baseline + გაზომვადი outcome + done-კრიტერიუმი + red-team.
> (იხ. `~/.claude/.../memory/feedback_plan_rigor_standard.md`.)

## მოდელი [USER DECISION]
მასობრივი უფასო მოცულობა: სკოლა/მასწავლებელი + დიასპორის FB → 3000 აქტ. ბავშვი/დღეს; მონეტიზაცია ბაზის 5-10%.

## baseline (ცოცხალი, 17 დღე 2026-06-16→07-02, `/v1/stats` pull)
- მოცულობა: **24.6 page_view/დღეს**, 51 პროფილი (~3/დღეს), ასაკი 6-8 = 49%. → ყველა ციფრი **directional**, სტატისტიკურად სუსტი.
- მიტოვება: საერთო **29.8%**; math **65%**, kings **59%**, english **50%**, alphabet 40%, reading 38%.
- **q0 (I კითხვა) = მიტოვების 53%.** first_win/page_view = 9% (within-session).
- გარე წყარო: FB მთავარი (59).

## რა იზომება / არა (ინსტრუმენტაციის სიმართლე)
- ✅ Q1 მიტოვება submode-ით — იზომება ახლა.
- ❌ ტუტორის „teach→retry წარმატება" — **არ იზომება** (ივენთი უნდა დაემატოს).
- ❌ წერის დასრულება — **არ იზომება** (ივენთი უნდა დაემატოს).
- ❌ Retention/დაბრუნება — **პრინციპში არ იზომება** (COPPA, persistent ID არ გვაქვს). retention KPI არ დაისმის; პროქსი = first_win + ცოცხალი ბავშვის ყურება + მასწ./მშობლის feedback.

## „სიღრმის" და „ტუტორის" ზუსტი განმარტება
- **სიღრმე := CDS = item-ბი × დონეები.** ბარიერი: core უნარზე pool ≥24 (3× სესია) × ≥2 დონე. baseline (CDS): Colours **11**, Shapes **8**, en-alpha **26**, ka-alpha **33**, grammar **30** = ჩავარდნა; math პროცედურული **∞**, vocab **250**, kings-math **180** = OK. 3-დონიანი ლეველინგი დაწერილია (17 math+17 eng) მაგრამ კოდში ჩართული **არაა**; ასაკის gate-ები არსებობს, კონტენტზე **არ მუშაობს**.
- **ტუტორის გაუმჯობესება :=** შეცდომაზე ბუ: (1) პასუხს ვერ ამხელს (leak-fix), (2) ხსნის **პრინციპს** რეჟიმზე მორგებით (math=ნაბიჯი, reading=სტრატეგია, vocab=მნიშვნელობა), (3) აძლევს scaffolded retry-ს მსგავს item-ზე, (4) retry-ს შედეგი **ლოგდება**. baseline: D7=4/10, leak-fix დაწერილი-არა-deployed, სწავლა გაუზომავი.

---

## FAZA 0 — პირველი ღირებულების იატაკი (მე ვასრულებ)

### 0.1 ვიზუალური QA გეითი [ჯერ — რომ დანარჩენი უსაფრთხოდ გავიდეს]
- **განმარტება:** Playwright headless render 320/360/390px → **assertion-based** შემოწმება (key ელემენტი viewport-შია, ოვერლაპი/overflow არა, `getBoundingClientRect`) + screenshot. `npm test`/pre-push-ში. (არა pixel-diff — flaky.)
- **baseline:** qa-check.mjs 0 ვიზუალურ შემოწმებას აკეთებს; გატეხილი footer გავიდა.
- **target/outcome:** გეითი აჩერებს ვიზუალურ რეგრესიას; footer bug დაჭერილი + გასწორებული.
- **done:** გეითი წითელდება footer-ის მაგ. bug-ზე, გამწვანდება fix-ის მერე; <60წმ; pre-push-ში ჩართული.
- **challenge:** ვიზუალური გეითი flaky ხდება → assertion-based (არა screenshot-diff); მხოლოდ კრიტიკული ელემენტები.

### 0.2 ტუტორის სწავლების მომენტი (b)
- **baseline:** D7=4/10; leak-fix (674/674, 0 leak) დაწერილი, ცოცხალზე არ არის; teach→retry გაუზომავი.
- **outcome:** (1) leak-fix live; (2) ბუ ხსნის პრინციპს **ყველა** მთავარ რეჟიმში; (3) ახალი ივენთი `teach_then_retry_result` → directional წარმატება ≥60%.
- **done:** 0 leak (ვერიფიც.), ბუ ასწავლის N/N რეჟიმში, ივენთი live + directional ≥60% + 5/5 ნანახ ბავშვზე retry გამოსდის.
- **challenge:** ≥60% target directional-ია (მცირე n); ცოცხალი ბავშვის ყურება = გადამწყვეტი, არა მარტო ციფრი.

### 0.3 Q1 მიტოვება (data-driven #1)
- **baseline:** q0 = მიტოვების 53%; math 65% / kings 59% / english 50% რეჟიმ-მიტოვება.
- **განმარტება:** ყოველი რეჟიმის I კითხვა = გარანტ. მარტივი warm-up + მოსაწვევი პირველი ეკრანი + ადრეული მოგება.
- **outcome (directional):** math რეჟიმ-მიტოვება 65%→<45%, kings 59%→<45%, q0-წილი ↓; N კვირაზე.
- **done:** warm-up primer live math+kings+english; directional ↓ + 5/5 ნანახი ბავშვი გადის Q1-ს.
- **challenge:** მოცულობა მცირეა → ციფრი ხმაურია; target directional + qualitative. warm-up ზედმეტად მარტივი არ იყოს (მოწყენა) — ბალანსი loop-წესით.

### 0.4 ანბანის წერა (მშობლის საჩივარი)
- **baseline:** free-draw, ვალიდაცია 0, ი/ო გატეხილი, 0 ასო live stroke-order-ით (parked branch); დასრულება გაუზომავი.
- **outcome:** centerline live + 33/33 ასო სწორი მიმდევრობა/მიმართულება + per-stroke ვალიდაცია + feedback + scaffolding; ივენთი `writing_complete`.
- **done:** 33/33 ასო (Gemini+მასწ. ვალიდ.), ი/ო სწორი, ვალიდაცია+feedback live, writing_complete live.
- **challenge:** 33 ასო სრულად = დიდი; **ჯერ 8-10 ხშირი ასოთი მექანიკა დავამტკიცოთ**, მერე დანარჩენი — რომ 3 კვირა ერთ ფიჩაში არ გავჩერდე.

### 0.5 აბსურდის ამოგდება (c-ის მინიმუმი, არა სიღრმე)
- **baseline:** აუდიტი D3=5/D4=5, ცნობილი ალოგიკური item-ბი (მაგ. triangle).
- **outcome:** ცოცხალ კონტენტში 0 აბსურდი/უამოხსნელი item (loop-წესი 5 კრიტერიუმი).
- **done:** ყოველი core რეჟიმის item-ბანკი გავლილი, თითო item ≥8 ხუთივე კრიტერიუმზე.
- **challenge:** ეს ხარისხის იატაკია, არა სიღრმე — არ ავურიო; სიღრმე Faza 2.

---

## FAZA 1 — დისტრიბუციის ძრავა (მფლობელი ლიდერობს, მე ინსტრუმენტს)
- **baseline:** მასწ./დიასპორის ადოპცია = **0 დადასტურებული adopter**. FB უკვე #1 გარე წყარო (59).
- **challenge (მთავარი):** არ ავაშენო კლას-tooling არხისთვის, სადაც ერთი მასწავლებელიც არ დაუდასტურებია. **წინაპირობა: მფლობელი 1-2 რეალურ მასწავლებელს ადასტურებს რომ გამოიყენებს.**
- **outcome/done:** კლას-რეჟიმი + მასწ. onboarding + გასაზიარებელი; done = 1 რეალური კლასი (≥15 ბავშვი) onboarded, აქტ. ბავშვი/დღეს ↑.
- **არდადაგების wedge:** ზაფხულის უფასო „streak" = გაშვების მომენტი. [HYPOTHESIS — ვალიდაცია]

## FAZA 2 — მონეტიზაცია (5-10%) + სიღრმე
- **სიღრმის outcome:** ყოველი core რეჟიმი CDS ≥40 (pool ≥24 × ≥2 დონე); repeat <30%/კვ.
  - ნაბიჯები: (1) ასაკის band-gate-ები ჩავრთოთ (არსებობს, გამორთულია), (2) drafted 17+17 leveled bank ჩავრთოთ, (3) კრიტიკ. თხელი გავაფართოვოთ: Colours 11→24+, Shapes 8→24+.
- **done:** core რეჟიმები CDS≥40, band-gate live (count-ით ვერიფიც.).
- **მონეტიზაცია:** ფასიანი = სიღრმე + პროგრესის რეპორტი + Kings premium; ფასი = მფლობელი.

---

## PLAN-LEVEL RED-TEAM (გამჭოლი challenge)
1. **Sample-size:** 24 სესია/დღეს, tester-heavy → **ვერცერთი metric სტატისტიკურად ვერ დამტკიცდება.** ყველა target = directional + ცოცხალი ბავშვის ყურება.
2. **Retention un-measurable (COPPA):** არასდროს დავსვათ retention KPI რომელსაც ვერ გავზომავთ; პროქსი = first_win + qualitative.
3. **სექვენირება:** სიღრმის გაფართოება Q1-ის გასწორებამდე = ტყუილი შრომა (ბავშვი q0-ზე ტოვებს). Q1 + ტუტორი **წინ**, სიღრმე Faza 2.
4. **დისტრიბუცია:** მოდელი ეყრდნობა მასწ. ადოპციას (0-ია) → build-მდე 1-2 adopter დადასტურდეს.
5. **ჩემი გეგმის თვით-challenge:** 2 ახალი ივენთი (teach→retry, writing_complete) = მეტი telemetry მცირე მოცულობაზე. მიმღები: ამის გარეშე „ტუტორი გავაუმჯობესე" გაუზომავია.

## ვინ რას ფლობს
- მე: build/self-test/ვიზ.ვერიფიკაცია/preview + 2 ივენთის ინსტრუმენტაცია.
- შენ: ცოცხალზე go (§7b), მასწ./დიასპორა outreach + adopter დადასტურება, ფასი.

## პირველი ნაბიჯი go-ს მერე
0.1 ვიზუალური გეითი → 0.2 leak-fix ატანა → 0.3 Q1 warm-up (math/kings) → 0.4 ანბანი (8-10 ასოს პილოტი).

---

## პროგრესის ჟურნალი (ვანახლებ build-ისას)
- 2026-07-02: გეგმა დამტკიცდა. 0.1 დაწყებულია — qa harness წაკითხული.
- 2026-07-02: **0.1 ვიზუალური QA გეითი აშენდა და მუშაობს** — `qa/visual-gate.mjs` (playwright-core devDep, არსებული Chromium-1223, download არა). რენდერავს 320/360/390px, ატარებს app-ში (entry→home2→game global fn-ებით), screenshot → output/vg-*, assertion-based (clip-top / overflow-x / pinned-offscreen / **under-dock** / tap<44). package.json: `qa:visual` + `qa:visual:shots`. **ჯერ არ ჩავრთე blocking `npm test`-ში** (დაბლოკავდა ყველა push-ს სანამ ცნობილი bug-ბი გასწორდება).
  - **გეითმა დაიჭირა 2 რეალური bug (screenshot-ით დადასტ.):** (1) entry screen — „🌐 English" ღილაკი 33px (`.foot-lang`, <44 tap floor); (2) home2 — subject tile **under-dock** (მცურავი water-dock ფარავს ბოლო sub-tile-ს; + raised HOME ღილაკი მარცხენა კუთხეში მიწებული = მფლობლის „footer badly placed"). ორივე customer-facing → fix §7b preview→GO.
  - **fix STAGED (branch, uncommitted, ცოცხალზე არა):** `niko/styles.css` — `#app` padding-bottom 96→112px (ბოლო subject tile აღარ იმალება dock-ის უკან) + `.foot-lang` min-height 44px (tap floor). გეითი გამწვანდა 3/3 width (`under-dock` check გადაკეთდა reachability-ზე, false-positive მოიხსნა). visual verify §6c: after-shot ok.
  - **OPEN (owner taste + §7b go):** (a) raised HOME ღილაკის ადგილი (მარცხენა კუთხე) — ჩემი რეკ.: dock-ში ცენტრში; (b) ცოცხალზე გატანა შენს go-ს ელოდება. staged რჩება.
  - შემდეგი go-ს მერე: fix commit+deploy → live-verify → გეითი blocking `npm test`/pre-push-ში.
