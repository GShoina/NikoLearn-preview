# Stage 1.5 · W4: Stage-1 დასკვნების დამოუკიდებელი Challenge
**2026-07-16 · სამიზნე: `STAGE1_REPORT_KA.md` + `STAGE1_DECISION_BRIEF_KA.md` · ორი დამოუკიდებელი ოპონენტი: შიდა ადვერსარი (საპირისპირო prior) + Codex (owner-ის challenger არხი). ბოლოში: reconciliation.**

---

## ნაწილი 1: შიდა ადვერსარი (prior: „სწორი პასუხი = option 5 service ან STOP")

### თავდასხმა 1: თავად CONDITIONAL-GO-ზე (STOP-ის საქმე)
- **ყველაზე მწვავე:** რეპორტი თავადვე ადასტურებს, რომ დამფუძნებელი ვალიდაციებს არ ასრულებს (v1.5-ის 30-დღიანი სპრინტის შედეგი არსად ჩანს = შიდა base rate 0-დან-1-ზე), და ვერდიქტს მაინც ვალიდაციის დასრულებაზე დებს. „3 იაფი ექსპერიმენტი" იმავე დაპირების მეორე თაობაა.
- 1365 ვერსია / 0 გაზომვა = revealed preference: სისტემა აწარმოებს build-ებს და არა ვალიდაციებს; 13 docx სტრატეგია = displacement activity.
- **პირობას კბილები არ აქვს:** გლობალური kill-კრიტერიუმი არ არსებობს (რეპორტის §5-ის საკუთარი აღიარება); E1/E2-ის „kill"-ბარიერები რეალურად მენიუა („service-pivot ან stop", „გადაისინჯოს") და არა ტერმინაცია.
- **Commitment escalation:** CONFIRM-სია ითხოვს „შეუქცევადი" D1-ის დალოკვას ექსპერიმენტებამდე. ეს ზუსტად ის შეცდომაა, რასაც რეპორტი ებრძვის: sunk identity E1-ის შემდეგ STOP-ს ფსიქოლოგიურად მიუწვდომელს გახდის.
- White space-ის ცალმხრივი წაკითხვა: 3-7-ზე სიცარიელე შეიძლება ნიშნავდეს არა დაუკმაყოფილებელ მოთხოვნას, არამედ მოთხოვნის არარსებობას (რწმენა #1 თავად რეპორტშია LOW).
- **რა გადაწყვეტს:** 14-დღიანი pre-commitment gate: ≥10 ოჯახი (≥5 არა-warm) + 5 მშობლის ინტერვიუ ვადაში → ჩავარდნა = STOP ქცევით დადასტურებული, არა არგუმენტით. პლუს: 07-18-ის W1 read რეალურად შესრულდება თუ არა.

### თავდასხმა 2: Option 5-ის steelman (სტრუქტურული წინააღმდეგობა)
- **ცენტრალური დარტყმა: E1 თავად ARIS option 5** (რეპორტისვე სიტყვებით „option-5 მექანიზმი"). 10-20 ოჯახი × ყოველკვირეული check-in × 4 კვირა ≈ 3-8 სთ/კვირა = ≤1სთ/დღე ჭერთან ან ზემოთ. **ან ≤1სთ/დღე კლავს option 5-საც და E1-საც (მაშინ ვერდიქტი STOP-ში იშლება, რადგან ერთადერთი ვალიდაციის ინსტრუმენტი შეუსრულებელია), ან ვერცერთს კლავს (მაშინ option 5 მცდარი premise-ით იქნა უარყოფილი). ორივე ერთად ვერ დგას.**
- თუ E1 წარმატებულია coached კოჰორტაზე app-only მკლავის გარეშე, წარმატება ადასტურებს human+AI guidance-ს და არა pure-AI პროდუქტს; ხე მაინც „Stage 2: build"-ში მიდის = service-ის შედეგის მიწერა პროდუქტზე. NODI-ც (ერთადერთი WTP-მტკიცებულება) guided-tutoring ფორმასთან უფრო ახლოსაა, ვიდრე self-serve აპთან.
- **რა გადაწყვეტს:** ორმკლავიანი E1 (guided vs app-only) + E2-ში ცალ-ცალკე ფასი „guided პროგრამაზე" და „app subscription-ზე". თუ guided იგებს ორივეზე, service = ვერდიქტი.

### თავდასხმა 3: D2 hybrid = consent theater + liability engine
- Hybrid ხარჯავს moat #3-ს (privacy-ნდობა) moat #1-ის (outcome-data) საყიდლად და რეპორტი ამ ტრეიდს არ ამჩნევს. საჯარო „absolute" დაპირების შელახვა გულწრფელი copy-თაც შელახვაა.
- Sequencing შეცდომა: D2-ის default წყდება მანამ, სანამ მისივე სამართლებრივი წინაპირობა (§5: ვის აქვს ბავშვის მონაცემზე თანხმობის უფლება) ღიაა.
- Solo, bus-factor=1, 98% AI-კოდი მფლობელი longitudinal ბავშვთა ჩანაწერებისა პატარა ქვეყანაში = ტრივიალურად re-identifiable dataset; ერთი ინციდენტი = ის შეუქცევადი რეპუტაციული მოვლენა, რომელსაც რეპორტი თავად წინასწარმეტყველებს.
- **E1-ს data warehouse არც სჭირდება:** pre/post შესაძლებელია parent-held ან aggregate-only ჩანაწერით. **რა გადაწყვეტს:** წერილობითი მოსაზრება ქართულ PDPS + GDPR-K ექსპოზიციაზე; დემონსტრაცია, რომ E1 მუშაობს parent-held მონაცემით → D2 საერთოდ გადის critical path-იდან.

### თავდასხმა 4: D3 → „მაშინ რითია ეს AI კომპანია?"
- რეპორტი runtime-დიალოგს კომოდიტიზაციით კლავს, მაგრამ იმავე დანას authoring-time AI-ზე არ ატრიალებს: item-ების დაგენერირება Claude-ით ხვალვე შეუძლია ნებისმიერ კონკურენტს. თუ AI მხოლოდ build-time-შია, ეს გამომცემლობის ინსტრუმენტია და პატიოსანი ლეიბლი: **ქართული საბავშვო content-and-assessment კომპანია.** AI-ნარატივის შენარჩუნება იმეორებს იმავე branding-vs-reality ხვრელს, რომლის დახურვასაც Stage-1 ისახავდა, ერთი დონით ზემოთ.
- კლიპ-pipeline „ნახევრად აშენებული" ნულოვანი output-ით = to-do და არა აქტივი.
- **დათმობა თავდასხმის შიგნით:** როგორც ინჟინერული/safety კონფიგურაცია 3-7-ზე, D3 სწორია; დარტყმა იდენტობა/მარკეტინგზეა.
- **რა გადაწყვეტს:** E4 ორჯერ: outcome-რეპორტის პიჩი „AI" სიტყვით და მის გარეშე.

### თავდასხმა 5: Moat → n=20 პილოტის ანგარიშია და არა moat
- ადრეული წიგნიერების სანდო pre/post მტკიცება 3-5 წლისებზე ითხოვს ასეულობით ბავშვს, 6-12+ თვეს და საკონტროლო ჯგუფს (მხოლოდ maturation-იც ასწავლის ასოებს). n=10-20 warm ოჯახი 4 კვირაში = case study = მარკეტინგის მასალა (E4-სთვის ვარგისი), არა დაცვადი ბარიერი.
- კომპაუნდინგი მოითხოვს retention-ს, რომელიც თავად რეპორტში LOW-ა; მონაცემი ვერ კომპაუნდდება 1 მოწყობილობის ბაზაზე. NODI-ს ერთი სასკოლო პარტნიორობის კვარტალი მეტ longitudinal მონაცემს დააგროვებს, ვიდრე NikoLearn წლებში.
- **რა გადაწყვეტს:** პედაგოგთან ერთად დაფიქსირდეს მინიმალური დაცვადი n და ვადა; გაიყოს რეალურ acquisition-ტემპზე; თუ time-to-defensibility > 18-24 თვე solo, სიტყვა „moat" მოიხსნას (assessment-შრე რჩება როგორც კარგი პრაქტიკა).

### თავდასხმა 6: E1-E4 დიზაინის ხვრელები („წარმატება" = სავარაუდო false positive)
- E1: selection bias (warm წრე) · founder-as-coach confound (app-only მკლავი არ არსებობს) · unblinded assessment (ავარჯიშებს და ამოწმებს იგივე სისტემა, item overlap = practice effect) · 4 კვირა ცოტაა decoding-სთვის 3-5 წლისებში · ბარიერი დასახელებულია მაგრამ **არსად დანომრილი** (დაუნომრავი pre-registration არ არის pre-registration) · coached კოჰორტაში W4 დაბრუნება coach-ის მიმართ compliance-ს ზომავს და არა პროდუქტის მიზიდულობას.
- E2: 4 კვირა უფასო პირადი ყურადღების მერე გადახდა = relationship debt; 3/20 warm = მეგობრები ყავას უყიდიან; NODI-ს 69₾ საგამოცდო ბაზრის ფასია არა-საგამოცდო სეგმენტში შემოტანილი.
- E3: n=5, founder-ის სკრიპტი = demand characteristics; სიმეტრიული მკლავი არ არსებობს (საკუთარი q0 abandon 53%-ია უცნობი მიზეზით).
- E4: ერთადერთი გარე-სემპლიანი ტესტი (კარგია), მაგრამ „აშკარად მეტი ინტერესი" არაოპერაციონალიზებულია; ინტერესი ≠ გადახდა; fake-door ფასით უკეთესი იქნებოდა.
- Cross-cutting: mermaid-ხე E1-yes→E2-yes→BUILD; მოცემული ხვრელებით coached warm კოჰორტის მოდალური შედეგი confounded „yes"-ია = ბატარეა გასავლელად არის ფორმირებული. E3/E4-ის ჩავარდნებს CONFIRM-სიაში შედეგი არ აქვთ.
- **რა გადაწყვეტს:** რიცხვითი ბარიერები რეკრუტინგამდე · ≥50% არა-warm კვოტა · app-only მკლავი · სატესტო item-ები სასწავლოსგან განცალკევებული · დამოუკიდებელი შემფასებელი (ბაღის მასწავლებელი/ლოგოპედი) · E2-ის შეთავაზებას არა-დამფუძნებელი აწვდის.

### ადვერსარის ალტერნატიული ვერდიქტი
**PAID-SERVICE GATE, default STOP.** [ადვერსარის შეფასება: ~70% რომ Stage-1-ის sequencing მცდარია; ~35-40% სრული STOP — STOP-ს 50%-ს ზემოთ ვერ სწევს, რადგან ერთი სუფთა ექსპერიმენტის ფასი მართლაც დაბალია.]
1. ახლა არაფერი დაილოკოს (არც build-shape, არც D1, არც D2).
2. ერთი გადაწყვეტილება: E1 = ფასიანი guided კოჰორტა (option 5 პატიოსანი ფორმით) კვირა-1-დან სიმბოლური საფასურით (კლავს relationship debt-ს და ერთდროულად ზომავს WTP-ს და outcome-ს); ≥50% არა-warm; დამოუკიდებელი შემფასებელი; parent-held მონაცემი (D2 critical path-იდან გადის); რიცხვითი ბარიერები წინასწარ.
3. მკაცრი pre-commitment gate 14 დღეში; ჩავარდნა = **სრული STOP default-ად**.
4. წარმატების შემთხვევაში პირველი კითხვა: „guidance ხომ არ არის პროდუქტი?" — წყვეტს ორმკლავიანი მტკიცებულება და არა რეპორტის ფიატი.

### რა გადარჩა ადვერსარის თავდასხმას (მისივე აღიარებით)
1. „AI tutoring = differentiator"-ის დემონტაჟი — მთლიანად გადარჩა, ვერ გააუმჯობესა.
2. D3 როგორც ინჟინერული/safety კონფიგურაცია — გადარჩა (დარტყმა მხოლოდ იდენტობის შრეზეა).
3. სეგმენტის wedge-ლოგიკა (pre-reader-თან უფასო LLM ინტერფეისურად უვარგისია) — გადარჩა; ვერ გადარჩა მხოლოდ დასკვნა white space → demand.
4. Quarantine-ები (07-11 ტრიპლიკატი, Intel v2) + პლატფორმა/B2B/engine-ის უარყოფა — გადარჩა.
5. Layering-თავშეკავება + assessment-შრის საზღვარი — გადარჩა (moat-ისგან დამოუკიდებლადაც იაფი და ოფციონალობის შემნახველია).
6. საერთო შეფასება: „კარგი აუდიტი, რომელმაც ვერდიქტთან შეყოყმანა: სხეული STOP-ან-service-ს ამტკიცებს, სათაური GO-ს ამბობს."

**ადვერსარის ყველაზე მჭრელი წინადადება:** Stage-1-ის საკუთარი capacity-premise (≤1სთ/დღე კლავს option 5-ს) კლავს მისსავე არჩეულ ვალიდაციის ინსტრუმენტს E1-ს, რომელსაც რეპორტი თავად უწოდებს „option-5 მექანიზმს"; ამიტომ ვერდიქტი ან STOP-ში უნდა დაიშალოს, ან service-ში — CONDITIONAL-GO-როგორც-პროდუქტი ის ერთი ტოტია, რომელსაც რეპორტისვე მტკიცებულება არ უჭერს.

---

## ნაწილი 2: Codex challenger — ✅ ჩამოვიდა 2026-07-17

**პროვენანსი:** OpenAI Codex, დამოუკიდებელი read-only გაშვება codex-companion runtime-ით (thread `019f6ec7-9e97-7421-9528-a5c21d6213e2`), 2026-07-17. Codex-მა ორივე წყარო-დოკუმენტი (`STAGE1_REPORT_KA.md`, `STAGE1_DECISION_BRIEF_KA.md`) თავად წაიკითხა დისკიდან. ტექსტი ქვემოთ **სიტყვასიტყვითია, უცვლელი** (ინგლისური ორიგინალი). არცერთი პროექტის ფაილი არ შეცვლილა ამ გაშვებისას. 2026-07-16-ის პირველი გაშვება host-სესიასთან ერთად დაიღუპა; ეს ხელახლა გაშვებული, სრული შედეგია.

**ქართული TL;DR (5 შეტევა):** (1) build-shape: აუდიტმა ბაზარი კი არა, შიდა პრეფერენცია აქცია გადაწყვეტილებად; 0 ინტერვიუ, 0 გადახდა, 1 დაბრუნებული მოწყობილობა; „3-7" ერთი სეგმენტი არაა, რამდენიმე პროდუქტია; ყველაზე ძლიერი ალტერნატივა = educator-led human+AI სერვისი. (2) D2 = consent theater, თანხმობის არქიტექტურა გადაწყვეტილებამდეა დაუსრულებელი, opt-in კოჰორტა selection bias-ით აბინძურებს თვით outcome-აქტივს; D3-ის 8-წლის ზღვარი დოქტრინაა და არა მტკიცებულება, შუალედური (შეზღუდული runtime) არქიტექტურა ტესტირებადია. (3) outcome-data moat ამ მასშტაბზე კონსულტანტის ამბავია: efficacy-განაცხადს ~200-400 დამასრულებელი სჭირდება, გამოსადეგ dataset-ს ~1,000, დაცვადობას ~3,000-5,000 ლონგიტუდინალური მოსწავლე; დისტრიბუცია flywheel-ის წინაპირობაა და არა „არხი". (4) E1-E4/E5: შერეული ცვლადები, თბილი კოჰორტა, weekly check-in = უკვე სერვისი; E1-ის წარმატება coached-service-ს ადასტურებს და არა pure-AI პროდუქტს; E2-ის „≥3 გადამხდელი" არითმეტიკულად არასტაბილურია. (5) რეკომენდაცია: standalone პროდუქტზე CONDITIONAL-GO უარყავი, ჯერ ფასიანი educator-led სერვისი, აპი = შიდა ინსტრუმენტი; გადაწყვეტს წინასწარ დაფიქსირებული მტკიცებულება (100 ცივი ოჯახი / ≥20 წინასწარ გადამხდელი / კონტროლირებული კვლევა d≥0.4 / CAC-დაბრუნება).

### Codex-ის სრული კრიტიკა (verbatim)

1. Attack the build-shape choice

The audit has not identified a market. It has converted an internal product preference into a market decision.

The evidence is hostile to any 6–12-month domain commitment: 0 parent interviews, 0 payments, exactly 1 returning device, tester-heavy telemetry, and 53% of abandonments at question zero (STAGE1_REPORT_KA.md, lines 22 and 75). The report itself rates the belief that parents will pay for "development" as LOW and admits that NODI's 69₾/month evidence applies to school/exam outcomes, not ages 3–7 (lines 23 and 39). Yet D1 is declared effectively irreversible before a single buyer interview.

The reasons for selecting Georgian early reading are supply-side observations, not demand evidence:

- PI-39 calls it the founder's "#1 hole."
- Free text chat is unsuitable for prereaders.
- NODI currently targets older children.
- Georgian TTS is absent.
- NikoLearn has a "half-built" clip pipeline.

None proves that parents will pay. White space can mean absent demand. The TTS gap is presently NikoLearn's production burden, not a moat: the report says the pipeline exists but zero clips have been generated (line 21). A pipeline without finished audio, validated pedagogy, users, or distribution is unfinished work, not an asset.

"Ages 3–7" is also not one narrow segment. A three-year-old learning phonological awareness and a seven-year-old decoding school text require different interfaces, curricula, baselines, and outcome measures. "GE first, diaspora second" adds another segmentation split with different language exposure, buyer economics, and acquisition channels. Calling this single-domain focus conceals several products.

The claim that a single-domain product is "the only form" in which a solo founder can reach measurable outcomes is simply asserted (line 56). Narrowing content does not create the validated assessment/mastery model that the report says is absent (lines 21, 85 and 106). Keeping the other approximately 40 submodes across eight subjects as "content" also preserves maintenance load and product-positioning confusion while pretending strategy has narrowed.

The strongest alternative is the human+AI service. The report itself calls it the fastest generator of outcome data and revenue (line 60), then smuggles it into E1 through a managed cohort and weekly parent check-ins (line 111). That is already a service. The founder's ≤1 hour/day constraint only rules out founder-delivered tutoring; it does not rule out a qualified educator operating group cohorts on revenue share. Use the current app as a delivery instrument, charge upfront, observe what parents actually buy, and productize only the repeated workflow.

2. Attack D2 and D3 defaults

D2 is consent theater. "Default on-device + opt-in measurable profile + honest copy" is not a child-data operating model. The audit itself says it has not defined the minimum longitudinal record or even who has authority to consent (Report line 86), yet the Decision Brief approves hybrid collection anyway (Brief lines 15 and 30). The decision precedes the unanswered prerequisite.

The documents specify nothing about guardian verification, data minimization, purpose limits, identity linkage, retention, withdrawal, deletion, access, security, processor responsibility, breach handling, or whether consent permits later model training and marketing claims. The report explicitly recognizes GDPR-K/COPPA-class exposure, while diaspora is the secondary audience. "The copy says this honestly" does not resolve any of that.

Hybrid privacy also combines the disadvantages of both models. NikoLearn loses the clarity of its absolute on-device promise while collecting only a self-selected sample of unusually motivated, privacy-tolerant families. That selection bias contaminates the alleged outcome asset. The default population and the measured population become structurally different.

The brief's claim that absolute on-device storage "physically excludes" outcome evidence is false. A pilot can use parent-triggered pseudonymous exports, one-time encrypted summaries, or independently administered pre/post assessments without maintaining permanent child profiles. Central longitudinal identity should not be created before learning efficacy and willingness to pay justify its legal, security, and operational burden. Today the app is localStorage-only; adding durable profiles means creating a regulated backend while the project has a nontechnical solo founder, 98% AI-written code, and bus-factor=1 (Report lines 21, 90 and 131).

D3 turns today's implementation limitation into doctrine. The age-eight boundary has no cited pedagogical, safety, or technical basis (Report line 77; Brief line 16). The report says a free LLM can "never" serve a prereader because text chat is unsuitable (line 63), then proposes ChatGPT voice as E3's comparator (line 113). Its own experiment concedes that voice-first runtime models are relevant.

The audit also frames a false binary: deterministic delivery versus unrestricted child chatbot. A runtime model could sit behind a deterministic state machine and perform only bounded functions, such as classifying pronunciation, detecting a misconception, or selecting among approved hints. No free-form output, no persistent audio, and adult-enabled networking are testable constraints. E3 does not test that architecture; it tests whether five parents tolerate a raw ChatGPT voice script for one week.

Categorically excluding runtime inference may remove the only capability capable of making the "AI tutor" claim true. The report already admits that NODI has what NikoLearn's branding implies while NikoLearn only has deterministic hints (line 95). If runtime intelligence is permanently excluded, the AI-tutor positioning should be abandoned. If the positioning remains, a constrained runtime variant must be tested against the deterministic baseline. Safety, cost, latency, and measured lift should decide D3, not an arbitrary age cutoff.

3. Attack the moat hypothesis

At the current scale, "proprietary outcome-data" is a consultant's story. There is no outcome dataset: zero children have measured outcomes, progress is localStorage-only, no validated assessment exists, and the longitudinal architecture is absent (Report lines 5, 21 and 106). The brief nevertheless calls assessment data the "future moat" and lets that claim drive architecture (Brief lines 11 and 20–21). A proposed database is not a moat.

The claim that no global LLM "has or can have" comparable Georgian data is indefensible (Report line 101). Competitors do not need identical rows. NODI, a school, publisher, clinic, or better-distributed entrant could collect higher-quality observations faster than a founder with one returning device. Distribution is ranked as merely a "channel" in line 104, but distribution is the prerequisite for any data flywheel.

Data compounds only when it repeatedly improves diagnosis, item selection, or pedagogy and produces better out-of-sample results. The deterministic tutor has no demonstrated feedback loop. Accumulating scores produces telemetry, not network effects, switching costs, or defensibility. Self-collected, unblinded results create marketing evidence at best, not a credential.

The scale thresholds are nowhere near E1:

- 10–20 coached children over four weeks produce a formative case series.
- A credible efficacy signal for one narrow developmental stratum requires roughly 200–400 completers across controlled arms for a modest standardized effect of approximately 0.3–0.4, plus an attrition buffer. That supports an outcome claim, not a moat.
- A useful niche longitudinal dataset begins around 1,000 representative learners with at least three measurements over 6–12 months, validated labels, low missingness, and durable reuse rights.
- I would not call it defensible below roughly 3,000–5,000 longitudinal learners, multiple independent cohorts/sites, a continuous acquisition channel, and proof that the proprietary data materially improves unseen-child outcomes over a no-proprietary-data baseline.

Even 5,000 records are not a moat if a competitor can reproduce them, consent prevents broad reuse, or the data does not improve the product. Sensitive child records can become a compliance liability long before becoming a competitive asset. The stronger potential assets are the validated Georgian assessment method, educator relationships, curriculum and audio rights, and exclusive distribution—not the raw rows.

4. Attack the experiments

The experiment portfolio is not even consistently specified. The verdict and Decision Brief promise "3 cheap experiments"; the moat section invokes E1–E4; the report's table contains E1–E5 (Report lines 5 and 108–115; Brief lines 5 and 21). Only E1 and E2 receive nominal kill rules. There is no coherent decision protocol for E3, E4, E5, or mixed results.

E1 bundles too many variables to identify a cause. It uses 10–20 "GE-warm" families, four weeks, a five-minute in-app pre/post test, and weekly parent check-ins, with success at ≥50% W4 return (lines 75 and 111). There is no control group, randomization, independent assessor, validated literacy instrument, equivalent test forms, dosage tracking, age stratification, missing-data rule, or delayed test.

The warm cohort selects founder-friendly, unusually motivated parents. Weekly check-ins create a human accountability intervention. If E1 succeeds, it validates coached service plus software—not a pure-AI product. If it fails, the cause could be weak dosage, bad onboarding, an invalid assessment, age mismatch, or poor cohort execution. Declaring the "pure-AI thesis dead" from that failure is causally invalid.

Four weeks may detect memorized letters or practice effects, but it cannot establish durable early-reading transfer. A five-minute in-app assessment is especially vulnerable to teaching to the test. At the permitted 50% W4 retention, only 5–10 children may remain. "Gain above a preregistered threshold" is also not a threshold: no minimum meaningful difference, reliability requirement, effect size, or confidence rule is provided.

E2 sets success at ≥3 payers and failure at 0 (line 112). With 10 families, three payments mean 30%; with 20, they mean 15%. One or two payments lead nowhere under the stated rule. The price is unspecified, the offer comes after a free human-supported month, and the sample is warm. This tests neither cold acquisition nor renewal. Real willingness to pay requires a fixed offer and actual upfront payment from independently recruited families.

E3 has five parents use a supplied ChatGPT voice script for one week (line 113). It confounds model capability with parent prompting skill, setup burden, supervision, device quality, and novelty. "Parents abandon it" measures workflow tolerance, not child learning. It neither compares equal exposure nor tests a constrained runtime integration. Any D3 conclusion drawn from it is invalid.

E4 shows ten parents an X→Y outcome report versus a feature pitch and looks for "clearly more interest" (line 114). If the same parents see both, order and demand-characteristic bias dominate; if divided, there are five per cell. "Interest" is undefined. A concrete benefit statement will predictably beat a feature list, but that proves copywriting, not a data moat. The behavioral endpoint must be money—deposit, purchase, or renewal—not stated preference.

5. One strongest alternative overall recommendation

Reject CONDITIONAL-GO for a standalone software product. Make NikoLearn a paid, educator-led human+AI service first, with the existing app used only as internal delivery and measurement tooling. Do not build a child-data backend, expand the early-reading curriculum, or lock D3 while demand, pedagogy, and delivery remain unproven. Use a qualified Georgian literacy educator on revenue share; the founder handles product operations within the stated ≤1 hour/day. If an educator partner and prepaid families cannot be secured, stop.

I would change my mind and authorize a standalone Georgian early-reading product only if all of these conditions are met:

At least 100 independently sourced, non-friend target families receive the same fixed-price offer; at least 20 pay upfront at a price covering direct delivery cost; at least 50% renew. A preregistered 12-week controlled study enrolls approximately 250 children and retains at least 200, uses age-stratified validated Georgian literacy measures and blinded independent assessors, and produces an effect of d≥0.4 with the lower 95% confidence bound above 0.2 and attrition ≤20%. A reduced-support condition then achieves W8 retention ≥60% with human support below 15 minutes per family per month. Finally, one repeatable cold acquisition channel recovers CAC within the first paid term.

Until those facts exist, the audit's early-reading product, hybrid child-data architecture, and outcome-data moat are three layers of strategy built on the same missing evidence.

---

## ნაწილი 3: Reconciliation — ორი დამოუკიდებელი ოპონენტის შეჯერება (2026-07-17)

**მეთოდი:** შიდა ადვერსარი (ნაწილი 1) და Codex (ნაწილი 2) ერთმანეთის ტექსტს არ ხედავდნენ; ორივემ ერთი და იგივე ორი წყარო წაიკითხა. ქვემოთ ჩემი (CKO) ანალიზია, ტეგებით.

### სად თანხვდებიან (კონვერგენცია = ყველაზე მაღალი სიგნალი)
1. **ვერდიქტის ნაკერი.** შიდა: „სხეული STOP-ან-service-ს ამტკიცებს, სათაური GO-ს ამბობს". Codex: „Reject CONDITIONAL-GO for a standalone software product". ორივე დამოუკიდებლად იმავე წერტილს ურტყამს. [FACT — ორივე ტექსტი ამას წერს]
2. **ალტერნატივაც ერთი და იგივეა: educator-led human+AI სერვისი ჯერ, პროდუქტი მერე.** ორივე ამბობს, რომ E1 თავისი weekly check-in-ებით ისედაც შენიღბული სერვისია; Codex ამატებს გამოსავალს ≤1სთ/დღე შეზღუდვაზე: კვალიფიციური პედაგოგი revenue share-ზე და არა founder-delivered tutoring. ეს შიდა ადვერსარის capacity-შეტევის პირდაპირი პასუხია. [FACT — ტექსტები თანხვდება]
3. **White space ≠ მოთხოვნა; 0 ინტერვიუ / 0 გადახდა / 1 დაბრუნებული მოწყობილობა ნებისმიერ 6-12-თვიან commit-ს ეწინააღმდეგება.**
4. **E1 წარმატებაც კი pure-AI პროდუქტს ვერ დაადასტურებს** (coached-service confound). ორივესთან ცენტრალურია.
5. **Outcome-data დღეს moat არაა, მხოლოდ გეგმაა.** შიდამ „მომავლის ჰიპოთეზა" უწოდა, Codex-მა რიცხვები დაუწერა.

### სად შორდებიან
- **D3.** შიდა ადვერსართან D3 გადარჩა როგორც ინჟინერული/safety კონფიგურაცია. Codex უფრო შორს მიდის: 8 წლის ზღვარი დაუსაბუთებელი დოქტრინაა და არსებობს ტესტირებადი შუალედი (runtime მოდელი დეტერმინისტული state machine-ის უკან, შემოსაზღვრული ფუნქციებით). ეს არა კონფლიქტია, არამედ სიმკაცრის სხვაობა: Codex D3-ს ცვლილებას კი არ ითხოვს, მისი გადაწყვეტის მექანიზმს ითხოვს (safety/cost/lift ტესტი და არა ასაკის ფიატი). [ASSUMPTION — ჩემი წაკითხვა]
- **Moat-ის ჩანაცვლება.** Codex ასახელებს უფრო ძლიერ აქტივებს: ვალიდირებული ქართული შეფასების მეთოდი, პედაგოგებთან ურთიერთობები, კურიკულუმის/აუდიოს უფლებები, დისტრიბუცია. ეს Part B-ს დასკვნას ემთხვევა (რუკა/კოდი/TTS არავის moat-ია) და აძლიერებს synthesis-ის აქტივების იერარქიას, ოღონდ „raw rows"-ს აშკარად აქვეითებს.

### Codex-ის ახალი წვლილი (შიდას არ უთქვამს)
რიცხვითი ზღურბლები (200-400 / 1,000 / 3,000-5,000) · „3-7 = რამდენიმე პროდუქტი" სეგმენტაციის შეტევა · D2-ის selection-bias არგუმენტი (გაზომილი პოპულაცია ≠ default პოპულაცია, ანუ opt-in თვითონ აბინძურებს outcome-აქტივს) · „physically excludes"-ის უარყოფა (ფსევდონიმური ექსპორტი/დამოუკიდებელი შეფასება backend-ის გარეშე) · E2-ის არითმეტიკა · დისტრიბუცია როგორც flywheel-ის წინაპირობა.

### გადაფასებული confidence (ჩემი, CKO)
- CONDITIONAL-GO **როგორც standalone-პროდუქტის ვერდიქტი**: Stage-1-ის ~75% აღარ დგას; ორი დამოუკიდებელი ოპონენტის კონვერგენციის შემდეგ ჩემი შეფასება ≤40%-ია. [HYPOTHESIS]
- CONDITIONAL-GO **როგორც ვალიდაციის სისტემის გაშვება** (E1 სერვის-ფორმატში, წინასწარ დაფიქსირებული kill-რიცხვებით): რჩება მაღალი, ~80%. ანუ იცვლება არა „ვაკეთებთ თუ არა", არამედ „რას ვამოწმებთ ჯერ": პროდუქტს კი არა, გადახდას და სწავლის ეფექტს. [RECOMMENDATION]
- D2: hybrid-ის დამტკიცება წინაპირობების გარეშე ნაადრევი იყო; პილოტისთვის Codex-ის ალტერნატივა (ფსევდონიმური ექსპორტი, backend-ის გარეშე) იაფი და უსაფრთხოა. [RECOMMENDATION — D2-ის CONFIRM ისედაც owner-ის კარიბჭეა]
- D3: რჩება, მაგრამ „ასაკის ფიატიდან" გადადის „ტესტით გადაწყვეტაზე". [RECOMMENDATION]
- **არაფერი ამ ფაილში არ არის გადაწყვეტილება.** D1/D2/D3 CONFIRM და E1-ის გაშვება owner-ის კარიბჭეებია; ეს დოკუმენტი მხოლოდ მტკიცებულების მდგომარეობას აფიქსირებს.
