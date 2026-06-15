# NikoLearn — Product Ideas Backlog (living)

**Owner:** Gela Shonia · **Maintained by:** weekly "Product Owner" routine + ad-hoc.

## 📥 INTEL DROP (Gurafa → NikoLearn, 2026-06-15)
- **Crawl4AI installed on the machine = $0 local scraper.** Use it to gather/refresh LEARNING CONTENT (e.g. word
  lists, phrases, reading material, competitor content). No API cost. Tool, not a feature.
- **Idea: curation-as-authority.** Curated, branded RESOURCE LISTS for parents (what to read / watch / do, vetted by
  NikoLearn) = trust + authority signal. Cheap to make, builds the parent-trust moat (ties to the "parent is the
  buyer" thesis + Amonashvili parent-ring gap). Score later; candidate for the free/trust layer.
- **Skills/plugins discipline (standing):** many installed, enable FEW on demand, only from the official marketplace.
  Already a standing rule (see SESSION-HANDOFF); restated here for the product lens.
**Last updated:** 2026-06-06 (strategic grilldown: mission/KVP exploration + GeoStat TAM facts added)

This is the single source of truth for product ideas. Every idea is logged, scored,
and given a roadmap decision. The weekly Product Owner routine appends competitor
findings + new ideas and re-scores open ones.

## 🧭 STRATEGIC EXPLORATION — mission / KVP / positioning (2026-06-06, IN PROGRESS, NOT LOCKED)

> **🔴 RE-OPENED 2026-06-09 (owner correction) — do NOT read the '✅ LOCKED' blocks below as closed.**
> Niko over-locked a diaspora-ONLY direction and compressed away the owner's full intent (BOTH audiences,
> skill-based progression, AI-native, "safe low-chaos" positioning, Version A/B not a PRD). Owner's canonical
> brief is now saved verbatim at `docs/OWNER_GRILLDOWN_BRIEF.md` (never compress it away again).
> **Corrected frame: spearhead (diaspora = easiest FIRST paid dollar) ≠ MISSION.** Mission now holds BOTH:
> Georgia kids (English/Math/development) + diaspora kids (Georgian/identity), on ONE skill-based engine.
> **"One engine, two lenses":** parent picks TARGET language — Georgia target = English (UI Georgian),
> diaspora target = Georgian (UI English); same KA/EN/emoji/audio content-pairs, directional logic swaps
> prompt/target. Content hierarchy = Skill → Module → Content-Pair → Directional logic.
> Re-opened grilldown (Niko + Gemini r3): `output/2026-06-09-NikoLearn Grilldown v2 — ხელახლა გახსნილი ...by Niko.html`
> (live at the owner share link). **Version A** = dual-mission bilingual platform (owner thinking refined);
> **Version B** = skill-engine-first (independent, content-light moat); **synthesis = A's labels + B's engine**,
> GTM diaspora-first-paid + Georgia free on the same engine. Other Gemini challenges: "safe" = baseline not USP
> (must show measurable progress); current tutor.js = rule-based, do NOT market as AI; real AI = offline
> content-pipeline + "Parent Translator" (scores → human guidance); 6-month Cambridge claims = liability →
> reframe to confidence/routine/school-readiness; grades 1-3 = auto-progression "Rail" not a menu.
> **Nothing locked pending owner reaction (mission / engine / A-vs-B-vs-synthesis / GTM / 6 open Qs in the doc).**
> LESSON (behavioral): in exploratory strategy, do NOT collapse to "locked" — preserve the owner's full brief
> and optionality; a monetization spearhead is not a mission.

### 🎨 BRAND CANDIDATES (2026-06-10, proposal — awaiting owner LOCK, nothing live)
Owner picked "მისიის გამოკლება + slogan დაკეტვა + ლოგო". Produced + visually verified. Report:
`output/2026-06-10-NikoLearn ბრენდი — მისია, slogan, ლოგო by Niko.html`.
- **Mission (short, both audiences, no em-dash) — rec A:** „ყველა ქართველი ბავშვი ისწავლოს ის, რაც სჭირდება, სად უნდა ცხოვრობდეს."
- **Slogan = 2 layers** (resolves both-audiences vs diaspora-only): MASTER positioning „უსაფრთხო ადგილი, სადაც ბავშვი მართლა სწავლობს." + MASTER KVP „შენი შვილი ისწავლის იმას, რაც მართლა სჭირდება. შენ კი მშვიდად იქნები." (= Q5 dual-promise). GTM/diaspora „ილაპარაკე ქართულად. დარჩი ქართველად." + GE-lens „ინგლისური და მათემატიკა, უსაფრთხოდ."
- **Logo:** owl ნიკო ბუ, brand palette (coral #F2894C/cream/Fredoka). Files `assets/logo.svg`·`logo-mark.svg`·`logo-icon.svg`. Old favicon was off-brand Bivision purple; `og-image.svg` is bihub's by mistake — replace on lock.
- **LOCK 4 + "დადე live" → deploy** (favicon/og/wordmark + outline letters to paths + Gemini ka-QA). The ONE §7 customer-facing gate.

Owner ran a deliberate strategic grilldown (vCEO/visionary partner mode). This is a brainstorm,
NOT a finalized PRD. Full owner-facing report: `output/2026-06-06-NikoLearn სტრატეგიული Grilldown by Niko.html`.
Backup: `~/.claude/plans/toasty-marinating-bird.md`.

### Owner intent (LOCKED 2026-06-06)
- **NikoLearn = active venture, NOT a hobby.** Owner wants to pursue seriously and, if needed, find
  the right **partner**. The "strategy-session-without-execution" middle path is explicitly rejected.

### TAM facts (LOCKED — GeoStat / Min. of Education 2025/26)
- Total pupils **644,243**; primary grades 1-6 = **333,224**; ages 6-12 ≈ **369,900**.
- **Private school total 71,979** (share 11.2%, GROWING: 2022/23 was 10.1%).
- **Private primary (grades 1-6) = 40,672** = the proven-payer beachhead (Tbilisi holds ~35% of pupils).
- Price anchor: Buckswood ~8,000-11,900 ₾/yr; owner pays 14,000 ₾. A 20 ₾/mo app = ~2-3% of one year's tuition.
- TAM model (beachhead 40,672; ARPU/yr 150-240 ₾): 5% pen = 305K-488K ₾/yr · 10% = 610K-976K · 25% = 1.5M-2.4M.
- → **Paying market exists and is growing. This is NOT a hobby TAM.** (Niko's earlier "no payers" claim was WRONG.)

### Key strategic challenges raised (owner liked, will revisit one by one)
1. **Parent = buyer, child = user — product is upside-down** (~90% effort on child, ~10% on parent).
   Parent's real JTBD = "I'm a good parent" + proof + relief, NOT "my kid learns English". Dashboard =
   the product for the buyer; the game = delivery mechanism.
2. Georgian-first: ka pronunciation/ASR for kids = real moat (nobody has it); English = commodity.
3. Two audiences: GE English/Math = red ocean (free giants) vs diaspora-Georgian = blue ocean
   (subscription-comfortable, emotional urgency, zero competition). "Two products" fear: embrace, don't avoid.
4. Age vs skill: skill-adaptive now = premature; age-band UX now, BUT model content as skill/difficulty
   atoms (DAG + prerequisites + modality tags) — the one architecture worth getting right today.
5. AI content: moat ≠ "we generate fast" (commodity + trust-killer); moat = curation + safety + Niko Bu
   brand. AI = backend factory, not a marketed feature (AI theater).
6. 6-month outcomes = measurement trap. Sell PROCESS proof (practiced, learned N words), not OUTCOME
   proof (test scores) — outcomes you can't measure/attribute = liability.
7. Menu vs adventure = UX question disguised as strategy. Real question = RETENTION. Parent-facing
   streak/progress + child-facing light narrative.
8. Business model: one-time unlock is wrong for a content-treadmill (paid once, pay forever to make
   content). Subscription fits diaspora (EU/US comfortable); one-time fits GE price-sensitive.
9. Content hierarchy (owner's "biggest unknown") = Skill atom + difficulty + prerequisites = DAG; UX
   renders it as menu (now) or path (later) on the same data.

### Two directions (draft, not chosen)
- **Version A (from owner):** "Safe, low-chaos learning environment for Georgian children." One product,
  two audiences, freemium (GE one-time / diaspora subscription). Risk: focus splits, mediocre at both,
  collides with free giants on English/Math. NOTE: TAM research now gives A a real GE base IF narrowed
  to the private-primary ICP (40,672), NOT "all Georgian kids".
- **Version B (Niko's independent):** "Keep your child Georgian, wherever you live." Diaspora-Georgian =
  subscription spearhead; English/Math = free funnel for GE. Positioning = identity + language
  preservation + parental relief (not "education"). Out-of-box scale: abstract to a heritage-language
  platform for diaspora kids (Georgian = first language). Risk: narrow market (lifestyle unless
  abstracted); distribution depends on community; Georgian content depth is real work.

### OPEN DECISIONS (owner returns to these)
- **Spearhead fork:** GE private-primary ICP (Version A, narrowed) vs diaspora (Version B). Owner first
  said "both equally" → Niko challenged: "equally" = deferring priority; strategy = priority. Now both
  have a factual base. UNRESOLVED.
- **Ambition level:** lifestyle/mission business vs venture-scale heritage-language platform vs free gift. UNRESOLVED.
- **Partner question:** what role / what's missing on the team. UNDEFINED.
- Revisit the 9 key challenges one by one.
- FINAL OUTPUT pending: locked mission + KVP + positioning statement.

### 📡 Distribution evidence — diaspora reachability (2026-06-08, desk research by Niko)
The fork hinged on ONE unknown: can the diaspora be reached cheaply? Owner said "I don't know, must find
out." Desk research answers it: YES — a concentrated, organized, state-backed channel already exists.
- **Diaspora size:** MFA estimate 1.5M+ (Russia 700K, Greece 200K, US 120K, Italy 50K, Germany 50K);
  conservative floors ~0.5-0.9M (UN 2024 ~496K; 2020 ~861K). Kids 6-14 subset = the addressable base.
- **Sunday-school network (the B2B distribution layer):** ~78 (Diaspora Ministry count) to 180+
  (diaspora-tv, ~50 countries) ქართული საკვირაო სკოლა. One source: 92 schools + 12 courses with
  **3,000+ kids aged 6-14 already formally enrolled in Georgian-language learning abroad** = proven
  demand, exact age band, exact JTBD (keep child Georgian). Each school = many families → one adoption
  reaches dozens of kids.
- **State infrastructure + funding + partner:** MFA Diaspora dept + diaspora.ge portal (runs distance
  Georgian schooling). MFA grant **„ჩემი ქართული სკოლა"** to improve Georgian-language teaching abroad,
  apply to diaspora@mfa.gov.ge — **deadline 2026-06-28** = non-dilutive funding + official channel +
  credibility. TIME-SENSITIVE.
- **Per-country FB pages** (GeoinGreece, GeorgiainCanada, …) = ready, free marketing channels.
- **Model = B2B2C:** school / parent-org adopts → many families. NikoLearn = the daily home-practice
  layer between weekly Sunday classes (complement, NOT a competitor to live schools).
- **Adjacent to verify:** diaspora.ge "distance schooling" format (likely live Zoom classes, so
  differentiated from a gamified self-serve app — confirm before claiming).
- **Remaining validation (owner-only, the human step):** talk to 2-3 Sunday-school coordinators /
  diaspora parents to confirm willingness to pay.
- **Updated Niko recommendation:** lock spearhead = **Version B (diaspora heritage-language,
  subscription)**, GE private-primary = free funnel. Evidence now supports B on BOTH product-market fit
  (the ka-audio moat is a must-have here) AND distribution (the channel exists and is reachable).

### 🧮 Decision model + Gemini second opinion (2026-06-08)
Owner asked for a challenged decision model (Niko + Gemini, reduced to yes/no/pick) so he can answer fast, then execute.
Deliverable: `output/2026-06-08-NikoLearn სტრატეგიული გადაწყვეტილების მოდელი by Niko.html` (11 decisions D1-D11 + 9 challenges locked + mission/KVP/positioning picks).
- **Gemini (cross-model) AGREES:** D1 spearhead=B, D2 subscription, D3 freeze-features→productionize, D4 pursue grant via partner.
- **Gemini CHALLENGES (new inputs, persisted):** (a) **moat decay** — Georgian AI-TTS is improving, so "real recorded audio" alone won't stay a moat; shift moat to curation + safety + Niko Bu brand + pedagogical authority. (b) **retention = #1 risk** — "heritage guilt" drives the first purchase but if the app isn't sticky the kid quits and the parent cancels the sub; make a daily-ritual/streak retention mechanic a production-MUST, not a later feature. (c) push ambition to **venture-scale heritage-language platform** (templatable to other small-language diasporas later).
- **Grant eligibility (FACT, mfa.gov.ge/news/077749):** „ჩემი ქართული სკოლა" applicants = diaspora orgs / Sunday schools / non-commercial entities ABROAD. A Georgian for-profit (NikoLearn) is NOT directly eligible → access only via a partner school/org (B2B2C). Sibling grant „ჩემი ენა ქართული" (news/058334) = recurring annual funding stream. Treat as a CHANNEL, not a 28-Jun-2026 sprint.
- **PENDING owner answers** to D1-D11 + the 3 picks (mission/KVP/positioning). On "go" for D1-D4, Niko executes: production-readiness sweep + diaspora-positioning landing + subscription-arch plan + grant/partner outreach pack + verify diaspora.ge format. Money/live customer-facing = separate owner "go".

### ✅ LOCKED 2026-06-08 (owner answered) + strategy v2 deep-dive
Deliverable: `output/2026-06-08-NikoLearn სტრატეგია v2 — independence, KVP, moat, ხარჯები by Niko.html`. Gemini round-2 (full brief) inside.
**Owner LOCKED:** D1 spearhead = DIASPORA · D2 = subscription · D3 = freeze features, production-first · D5 = venture-scale heritage-language platform, templatable to ES/FR/RU later · D6 mission = M1 (polished) · D11 = retention mechanic is a must.
**Owner DROPPED the government grant** (sees „ჩემი ქართული სკოლა" as a political-influence tool, not a clean grant). Do NOT re-surface the grant.
**Mission (LOCKED):** „რომ ვერც ერთი ქართველი ბავშვი არ გაიზარდოს მშობლიური ენისთვის უცხოდ — სადაც უნდა ცხოვრობდეს."
**KVP (recommended, awaiting N1 nod):** „შენი შვილი ბებიას ქართულად დაელაპარაკება — და ქართველად დარჩება, სადაც უნდა ცხოვრობდეთ." (connection + identity).
**Positioning / brand line (awaiting N1):** „ილაპარაკე ქართულად. დარჩი ქართველად." (Gemini: Speak Georgian. Stay Georgian.)
**Commercial independence (owner's core worry) — resolved:** spine = direct-to-parent (D2C) subscription; schools = optional accelerant via Gemini's "trojan-horse" free teacher-dashboard (parent subscribes to unlock home mode), NEVER a dependency. Near-zero fixed burn (GitHub Pages $0 + Supabase free→$25/mo + Paddle/LemonSqueezy MoR ~5%/txn + edge-tts $0 + Claude Max already paid) → ~5-6 paying families cover cost = no outside money, no gatekeeper. Real cost = build TIME, not money.
**Durable moat (audio is NOT it — AI-replicable):** rank = (1) pedagogical authority/lineage (certified by a known GE educator/institution), (2) Heritage Language Map = accumulated progress data = switching cost, (3) Grandparent-voice UGC = family heirloom, (4) first-mover brand in a small diaspora.
**Moat product features by cheap+defensible:** Heritage Report Card (parent email, cheap) → Grandparent Portal (medium, backend) → Heritage Language Map (medium) → cultural/dialect modules (content-ongoing). + "Summer in Georgia" offline mode (cheap).
**ARCHITECTURE LOCK (do in production-sweep):** content-agnostic engine / "Heritage OS" — PWA = player consuming a JSON manifest; language assets fully decoupled from UI/logic; pedagogy logic language-agnostic. Makes ES/FR/RU cheap later (matches challenge #4 DAG). Hard-coding Georgian grammar in JS = fail.
**OPEN (2 small nods):** N1 = confirm/tweak KVP + positioning wording. N2 = Grandparent Portal as phase-2 (after subscription backend) vs flagship-now. On N1/N2, Niko executes the §G build list (engine lock → diaspora landing → subscription backend plan → retention + Report Card → portal). Money/live = separate owner "go".

### 📖 Strategy guidebook + OPEN-QUESTIONS REGISTER (2026-06-08)
Owner asked for a consultant-grade single living strategy doc (point-by-point canvas: objective/vision/mission/audience/geography/positioning/slogan/KVP/model/price/moat/GTM/product/ambition + status tags) AND a consolidated open-questions register (he'd only answered part of day-1 questions and lost track of what's still open). Built as a tabbed HTML: `output/2026-06-08-NikoLearn სტრატეგიული სახელმძღვანელო by Niko.html`, published (noindex) at the owner's private mobile link `gshoina.github.io/NikoLearn/share/7731b5f78d82/` (repo folder `share/7731b5f78d82/`, NOT gitignored — this is the ONE owner doc intentionally on the public Pages site, by obscurity; delete on owner request).
**Surfaced NEW open questions (were not tracked before):** Q3 geography (which ONE diaspora country first — Niko rec EU/US: Greece/Italy/Germany/US for subscription willingness, Russia later for payment friction); Q4 price (~$5-7/mo rec, undecided); Q5 north-star metric (rec: retained paying families); Q6 partner role (channel-only vs co-founder/capital — 🤔); Q7 diaspora age focus (4-10 vs 3-12 — 🤔); Q8 owner-only validation (talk to 2-3 Sunday-school coordinators/parents re willingness-to-pay). N1 (KVP/slogan wording) + N2 (Grandparent Portal phase) still pending. Niko task: verify diaspora.ge format.
**Canvas tally:** 9 locked · 6 open · 2 rethink.

---

## 🗺️ Curriculum coverage map (PO's living artifact)
`docs/CURRICULUM_MAP.html` — age × subject (Georgian / English / Math / Movement) coverage:
have / partial / gap, with ranked dev priorities. Built from the real app content
(data.js: ka-alpha 33, en-alpha 26, 116 EN words/13 topics, Kings-eng 33, Kings-math 14,
counting 1-10, digits 1-9). **Biggest gap = Georgian reading (syllable→word→sentence)** —
absent today, and the core of Georgian-first differentiation. This map is the Product
Owner's scope: keep it current as content ships; the weekly PO pass re-checks the gaps.

## How ideas are scored
- **Impact 1-5** — value to the child's learning / parent trust / growth.
- **Effort 1-5** — build cost (1 = hours, 5 = weeks).
- **Priority = round(Impact / Effort × 2)** — higher = do sooner (quick wins float up).
- **Roadmap?** — Yes / Maybe / No (fits NikoLearn positioning: Georgian-first,
  bilingual ka/en, privacy/on-device, ages 3-12, offline, no ads).
- **Status** — Proposed → Accepted → In progress → Done / Rejected.

## Positioning guardrails (an idea must respect these)
Georgian-first (real recorded ka audio, no robot voice) · bilingual ka/en · all data
on-device, no ads, no external links in the kids' app · age-appropriate tiers
(3-4 / 5 / 6-12) · works offline (PWA) · warm, pre-reader-friendly (voiced).

---

## ⭐ Monetization roadmap — owner-confirmed 2026-06-05 (SSOT)

Owner, acting as Product Owner, filtered the backlog into three buckets (a/b/c) and a
recommended sequence. This is the authoritative go-forward plan. The backlog tables below
feed these buckets; this section decides ORDER and what gates behind payment.

### a) Premium / paid-version features ("N1" — the value people pay for)
This group = the heart of the paid version. **Enforced ONLY by a backend** (client can't unlock).

| Feature | Why premium | Needs backend? |
|---|---|---|
| Parent-voice stories (O3) | flagship, emotional, unique | Partial (local works; cloud-sync better) |
| English deep (sentences, phonics, stories) | serious learning value | No (content) but needs premium-gate |
| Georgian reading (syllable→word→sentence) | core local value | No |
| Parent dashboard + cross-device progress | parents love it | Yes (sync) |
| Full Kings + levels path (ABCmouse-style) | structured program | No (content) |
| Drawing — themed + print (O4 full) | creativity | No |

### b) Build NOW (free, no backend, grows the audience)
Ship these into the free app immediately — keeps testers engaged, audience grows.

| Feature | Effect | Work |
|---|---|---|
| 🤸 Movement breaks (O2) | high delight | ~1 session |
| 🦉 Choose tutor animal avatar (O1) | personalization + Duolingo-differentiation | ~1 session |
| Drag letter into word (Endless-style, existing voice) | signature mechanic | ~1-2 sessions |
| Drawing — free canvas (O4a) | motor skills | ~1-2 sessions |
| More questions per category | less repetition | small |
| PWA "install" prompt | retention | small |

### c) Backend MVP — the gate for paid + copy-protection
backend = the door to paid AND content copy-protection. Minimal MVP:
1. **Auth** — PARENT account (not child); email/simple login. (Kid-privacy: account lives on the parent.)
2. **Payment** — **Paddle, ONE-TIME unlock** (owner-confirmed 2026-06-05; subscription = future Niko Plus). Verify Paddle GE-seller support; fallback Lemon Squeezy / direct BOG/TBC.
3. **Entitlement check** — server confirms premium (client can't self-unlock).
4. **Content behind auth** — premium voice/stories served only to payers = the anti-copy moat.
5. **Hosting** — solo-fast: Supabase (auth+DB+storage+edge funcs in one) or Firebase.
6. **(later) cross-device sync** — progress in the cloud.

Priority: **#1 Auth + #2 Payment + #3 Entitlement = MVP. #4 = moat. #6 sync = last.**

### 🧭 Recommended sequence
1. **NOW:** 2-3 quick wins from (b) → O2 (movement) then O1 (animal). Audience + feedback.
2. **THEN:** watch for a willingness-to-pay signal (did anyone want to pay?).
3. **THEN:** (c) minimal backend — Supabase + Paddle/Stripe + entitlement.
4. **LAST:** (a) premium features behind the paywall.

### ✅ CONFIRMED PRODUCT DIRECTION — owner-locked 2026-06-05 (SSOT, supersedes any earlier note)

**Current stage = MVP. Main goal: ship fast, validate real parent payments, evolve gradually.**
- **Platform:** Web / PWA first. NO native iOS/Android yet.
- **Monetization v1:** ONE-TIME premium unlock (NOT subscription yet). Free tier stays strong; unlock tests willingness to pay.
- **Payment:** Paddle (Merchant of Record, handles VAT). ⚠️ verify Paddle supports a Georgia-based seller/payout before committing; fallback = Lemon Squeezy or direct BOG/TBC.
- **Auth + DB:** Supabase.
- **Repo:** stays PRIVATE. Frontend stays static/PWA-deployable. No secrets/API keys in the frontend bundle. Premium content eventually moves behind backend/API.
- **Future (Niko Plus, later stages only):** hybrid = free tier + one-time unlock + OPTIONAL monthly subscription. The owner's earlier "monthly subscription via Bank of Georgia / TBC" idea lands HERE, not now.

**Implementation priority (build order):**
1. Parent account / login (Supabase)
2. Payment flow (Paddle)
3. Premium-unlock flag in DB
4. Gate premium lessons/features behind it
5. Later: progress sync across devices
6. Later: AI / personalization / backend-heavy features

**DO NOT (owner-stated):** build native mobile yet · build unnecessary infra · add subscription billing now · over-engineer scaling/security before monetization is validated.

Sequence still holds: free features (b) first → willingness-to-pay signal → this backend.

---

## Backlog

| # | Idea | Source | Impact | Effort | Prio | Roadmap? | Status | Notes |
|---|------|--------|:-----:|:-----:|:----:|:--------:|--------|-------|
| 1 | English "deep": sentence building, phonics, short readable stories | session | 5 | 4 | 3 | Yes | Proposed | natural next content track (B) |
| 2 | Georgian reading ladder: syllable → word → sentence | session | 5 | 4 | 3 | Yes | Proposed | core local value, pairs with ka audio |
| 3 | More questions per existing category (less repetition) | QA | 3 | 2 | 3 | Yes | Proposed | data-only, low risk |
| 4 | Logic / memory mini-games (match pairs, odd-one-out) | session | 4 | 3 | 3 | Maybe | Proposed | breadth + variety |
| 5 | Voiced result/break sentences for pre-readers | tester (3yo) | 4 | 2 | 4 | Yes | **Done v3.2** | clips generated |
| 6 | Age-appropriate tiers (hide arithmetic for ages 3-4) | tester (3yo) | 5 | 1 | 5 | Yes | **Done v3.3** | isTiny |
| 7 | Parent weekly progress email/summary (opt-in, off-device) | session | 4 | 3 | 3 | Maybe | Proposed | privacy: explicit opt-in only |
| 8 | GA4 live metric tiles inside admin console | start of session | 2 | 3 | 1 | Maybe | **PARKED** | Architect decision 2026-06-05: redundant now (GA4 dashboard + Clarity both show users/signups), same GCP/OAuth blocker, zero new info. Code stays ready (`GA4_METRICS_URL=''` + loadGA4Metrics scaffold). REVISIT when the backend exists — server-side GA4 read becomes trivial then, add tiles for free. |
| 9 | Owl/tutor hint bodies translated in EN mode | QA | 2 | 3 | 1 | Maybe | Proposed | only matters for EN-mode users |
| 10 | Distinct mascot identity (avoid Duolingo-owl association) | owner | 2 | 3 | 1 | Maybe | Proposed | low legal risk today; brand polish |
| 11 | PWA "install to home screen" prompt + onboarding | session | 3 | 2 | 3 | Yes | Proposed | better retention for testers |
| 12 | Rewards depth: badges, daily streak goal, weekly recap | session | 3 | 3 | 2 | Maybe | Proposed | motivation, watch for over-gamification |

*(Competitor-derived ideas are appended below by the weekly Product Owner.)*

---

## Competitor analysis log
*(Each weekly run appends a dated section: competitor → notable feature → idea.)*

<!-- WEEKLY-PO-APPEND-BELOW -->

### 2026-06-04 — Scan #1 (Duolingo ABC, Khan Kids, Lingokids, Endless, ABCmouse, Gus on the Go, Busuu, Montessori, ქართული ანბანი)

**Biggest opportunity:** every major competitor is English-first; none teach the Georgian alphabet + native ka voice as a first-class subject, and in-market Georgian apps are thin alphabet-only tools (no math, no English, no tiers, no polish). NikoLearn's wedge: the one warm, privacy-safe, offline app doing Georgian **and** English **and** math with recorded native ka voice. Borrow proven mechanics, apply to Georgian-first content.

| App | Does well | Notable feature | Monetization | Borrow |
|---|---|---|---|---|
| Duolingo ABC | structured English literacy, ad-free+offline | word-highlight read-aloud; speech recognition | 100% free | word-highlight synced to our ka voice |
| Khan Academy Kids | broad free curriculum 2-8, COPPA | Kodi Bear narrator guide | 100% free | owl as persistent narrator; breadth-in-one-app |
| Lingokids | polished playlearning + life skills | parent progress dashboard; offline | $90/yr | on-device parent dashboard (privacy = feature) |
| Endless Alphabet/Numbers | beloved no-fail letter/number sound mechanic | drag-letter-into-word, each letter speaks | free + one-time IAP | **drag ka letter into word, each voices its sound** |
| ABCmouse | massive structured path 2-8 | 10 levels / 850+ lessons | $45-60/yr | step-by-step path mapped to age tiers |
| Gus on the Go | low-pressure vocab, 28 langs | native pronunciation; culture maps | one-time $3.99 | hear→see→tap vocab loop; one-time pricing |
| Busuu | speaking practice + structure | AI personalization, community | freemium + ads | speaking practice (but their ads/cloud = our anti-pattern) |
| Montessori Preschool | self-correcting Montessori, 5M families | no-fail autonomy design | $65/yr | self-correcting no-score mode for 3-5 |
| ქართული ანბანი (GE) | in-market Georgian alphabet | recognition + quizzes | free, low production | direct rival but alphabet-only — our breadth+warmth wins (quality unverified) |

**New ideas (competitor-derived):**

| Idea | Source | Impact | Effort | Prio | Roadmap? | Status |
|---|---|:--:|:--:|:--:|:--:|---|
| C1 · "Privacy & no-ads" trust badge + 1-screen parent explainer at install | Khan/Duolingo ABC | 3 | 1 | 6 | Yes | Proposed |
| C2 · Owl tutor as named, ka-voiced narrator across all subjects | Khan (Kodi Bear) | 4 | 2 | 4 | Yes | Proposed |
| C3 · Hear-word → see-picture → tap/match vocab loop (ka+en) | Gus on the Go | 4 | 2 | 4 | Yes | Proposed |
| C4 · Self-correcting, no-score/no-timer mode for ages 3-5 | Endless/Montessori | 4 | 2 | 4 | Yes | Proposed |
| C5 · Drag Georgian letter into word; each letter voices its ka sound (no fail) | Endless Alphabet | 5 | 3 | 3 | Yes | Proposed |
| C6 · Word-highlight synced to recorded ka voice in read-aloud stories | Duolingo ABC | 5 | 3 | 3 | Yes | Proposed |
| C7 · On-device parent dashboard, no cloud (privacy as the feature) | Lingokids | 4 | 3 | 3 | Yes | Proposed |
| C8 · Tiered step-by-step path mapped to 3-5 / 6-8 / 9-12 | ABCmouse | 4 | 3 | 3 | Yes | Proposed |
| C9 · GEL money + clock marketed as unique localized math module | Georgian gap | 4 | 3 | 3 | Yes | partly Done (v2.8) |
| C10 · One-time-unlock pricing option (vs subscription fatigue) for GE | Gus/Endless | 3 | 2 | 3 | Maybe | Proposed |
| C11 · Gentle daily-goal/streak (stars, not leagues), ages 6-12 only | Duolingo | 3 | 3 | 2 | Maybe | Proposed |
| C12 · Cultural micro-cards (Georgian objects/places) on vocab | Gus (maps) | 3 | 3 | 2 | Maybe | Proposed |

### 2026-06-05 — Owner architecture insight: developmental-fit + age-appropriate motivation

**O5 · Drive tiers/levels by DEVELOPMENT, not grade.** The real axis is **cognitive capacity ·
reading ability · abstraction level · motivation type** — school grade + the national curriculum are
a **GUIDE** (relevance for Georgian kids), NOT the rigid spine. Don't over-fit to the curriculum.

**O6 · Age-appropriate motivation & tracking (design principle + feature).** Motivation flips with age:
- **Under ~8:** intrinsic, no-fail, play-first. **Minimal/soft tracking** — counting/metrics/leaderboards
  add performance pressure that DE-motivates little kids. Progress = warmth (stars, character cheers).
- **9-12:** the opposite — **visible progress motivates.** Owner's example: a kid resists "mandatory
  exercises," but in sports clothes + engaged + *seeing* "how many done / how many left" he does them.
  So for older kids: real progress, goals, streaks, mastery %, "X done · Y left".
- **Concrete tie-in (movement):** older kids → count reps honestly (anti-cheat: tap-per-rep / visible
  counter) + done-vs-remaining + gamify; younger → fun + cheer only, no counting pressure.
- This is cross-cutting (applies to every subject + the movement break), gated by tier.

### 2026-06-04 — Owner ideas (Gela)

| Idea | Source | Impact | Effort | Prio | Roadmap? | Status |
|---|---|:--:|:--:|:--:|:--:|---|
| O1 · Child picks the tutor ANIMAL avatar (not only the owl) | owner | 4 | 3 | 3 | Yes | Proposed |
| O2 · Movement / exercise breaks (squats, plank, jumps…) — not step-tracking | owner | 4 | 2 | 4 | Yes | **Done v1.52** |
| O3 · Bedtime stories & poems read in the PARENT'S recorded voice | owner | 5 | 5 | 2 | Yes | Proposed (flagship) |
| O4 · Drawing / coloring (finger paint + themed coloring pages + print) | owner | 4 | 4 | 2 | Yes | Proposed |

**O1 — choose-your-tutor-animal.** Let the child pick which animal teaches them (🦉 owl, 🐱 cat, 🦁 lion, 🐶 dog, 🐰 rabbit, 🐼 panda…), stored per profile. Visual only — the recorded ka voice stays the same. Bonus: also resolves backlog #10 (Duolingo-owl differentiation) — our mascot becomes "the child's chosen friend", which Duolingo can't claim. *Touches: owl fab, hint bubble avatar, voice screen, a small picker on profile create/edit.*

**O2 — movement breaks (brainstorm).** Extend the existing 15-min break screen into a real "მოძრაობა / Move" moment, illustrated + voiced in ka. Exercise pool ideas: ბუქნი (squats), პლანკა (plank, hold + count), ახტომა მაღლა (jumps), ცალ ფეხზე დგომა (stand on one leg), ხელების ტრიალი (arm circles), წვერებზე აწევა (tip-toes), დათვივით სიარული (bear walk), კენგურუსავით ხტომა (kangaroo hops), ცხოველის მიბაძვა (mimic an animal). Add a simple count/seconds timer + "ყოჩაღ!" reward. Optional: a dedicated "🤸 მოძრაობა" tile, not only the auto-break. *Needs new ka clips for exercise names (edge-tts, same pipeline).*

**O3 — parent-voice stories (flagship, phase it).** A bedtime "ზღაპრები და ლექსები" section. Parent records their voice per story line (MediaRecorder), audio stored ON-DEVICE (IndexedDB — keeps the privacy promise), then the story plays page-by-page in mom's/dad's voice with the text/picture. Doesn't replace the parent — lets the app read in *their* voice when they can't. Phase 1: 3-4 short ka stories/poems + record/playback. Big build; highest emotional payoff & retention. *Privacy: audio never leaves device.*

**O4 — drawing / coloring.** Motor-skill + creative, screen-positive. Sub-options: (a) free finger-paint canvas (touch, color palette, brush sizes, undo/clear); (b) themed coloring pages — pick a character from a theme (animals, space, Niko & friends) and fill it in; (c) save/print the result (export PNG / window.print). Phase 1: (a) free-paint + (b) a few coloring templates; (c) print later. *Works offline; no PII.*

**PO recommendation (build order):** quick wins first → **O2 (movement)** then **O1 (animal avatar)** [each ~1 session, high delight]; then **O4 (drawing)** [medium]; then **O3 (parent-voice stories)** [flagship, multi-session — worth a dedicated push].
