# NikoLearn — Product Roadmap (PO SSOT)
**Status:** CANONICAL · **Updated:** 2026-07-15 (s21) · **Owner of this file:** the PO/CKO agent, every session

> This is the ONE place that answers „რას ვაკეთებთ და რა ამოვარდა". It exists because the answer used to
> live in 8 places at once (V2-ACTION-PLAN · ACTION-PLAN-2026-07-02 · ROADMAP · LEVELED-CONTENT-ROADMAP ·
> roadmap-study-program · FABLE-CONTENT-PLAN · bycodex_Next_Steps · SESSION-HANDOFF), and dropped items
> lived only as prose inside a handoff that gets auto-compressed at ~28KB. Prose is not a ledger.

## The two rules (owner-set 2026-07-15)

**1. ჩანაცვლება ≠ წაშლა. Superseded means new + old TOGETHER.**
Nothing is ever deleted. A superseded plan keeps its text and gains a header saying which facts died and
why (see `V2-ACTION-PLAN.md`). Cold docs move to `docs/archive/YYYY-MM/` git-tracked; they never disappear.
An audit folded into the NB ledger is MIRRORED, not replaced: `05_auditbyagents/bycodex_Next_Steps.md`
still holds the full v2.00 audit, the ledger just makes its findings trackable.

**2. Nothing falls out silently.** Any task dropped, deferred, parked, or judged not-worth-logging gets a
row in §DROPPED with a reason, a date, and a revive trigger. „We decided not to" is a decision worth
keeping; „it quietly vanished" is a defect. This section is never pruned — only appended and re-dated.

---

## ▶ NOW (feature wave, s25 — owner order 2026-07-18 = GI-34)

| # | Item | Why it is first | State |
|---|---|---|---|
| 0 | ~~Merge branch → live push~~ | ~~Value the kid cannot feel until it ships.~~ | ✅ **DONE 2026-07-20: v1.366 live** (owner GO = GI-33; NB-53/32/30/57 shipped + live-verified) |
| W1 | PI-95 visible level ladder — PROTOTYPE + show | Owner's own idea; the wave's anchor. | **SHOWN 2026-07-20** — interactive mock in `output/2026-07-20-ფიჩერ პროტოტიპები W1 W2 W4 by Niko.html` (§6c verified: render + tap-interaction + screenshots) |
| W2 | PI-96 pride-share card — PROTOTYPE + show | Owner's own idea. | **SHOWN 2026-07-20** — same file as W1; initial-only default, parent-space share, no direct posting |
| W3 | PI-97 owl video-tales — 3 TEMPLATES + show | Owner's own idea (FB market signal 471K views). | **SHOWN 2026-07-20** — `output/2026-07-20-ვიდეოზღაპრის 3 შაბლონი by Niko.html` (bedtime-letter / why-Bubu / alphabet-journey; all scripts original §11; recommendation = pilot template 2; awaits owner pick) |
| W4 | Weekly parent card — PROTOTYPE + show | Feature 4 of the accepted list. | **SHOWN 2026-07-20** — same file as W1; all-local stats, feeds W2 card; W5 strengthens its letter data |
| W5 | Per-letter progress — BUILD | Feature 5; also unlocks audit-B E1 measurability. | **BUILT 2026-07-20** `a2807d3` on `feat/wave-w5-w6-letters-adaptive` — weak-first rounds + parent mastery grid + weakest-3 tip; 17/17 logic checks, §6c screenshots, npm test green. NOT live (needs new GO) |
| W6 | Adaptive difficulty — BUILD | Feature 6. | **BUILT 2026-07-20** same commit — rolling-window step-DOWN for math dead-zone + flat tiers (first ever), climb rules untouched, silent for the child. NOT live (needs new GO) |
| W7 | Daily curious question — ≥5 versions + show | Feature 7 (owner: „5 ვერსია მინიმუმ"). | **SHOWN 2026-07-20** — `output/2026-07-20-დღის კითხვა 6 ვერსია by Niko.html` (6 original Q&A versions + interactive mock; assumption labeled: versions = content items) |
| W8 | Voice Talks deepening — PLAN/spec to show | Feature 8 (owner: „ძალიან მინდა"). | **SHOWN 2026-07-20** — `output/2026-07-20-ხმოვანი საუბრები გეგმა by Niko.html` (3-path privacy comparison; REC = on-device whisper path B, default = measurement prototype first; path A/C would break on-device promise — owner fork flagged) |
| — | Features 9-10 (progress export, diaspora mode) | — | NOT NOW (owner: „დროებით არა" — DROPPED row below) |

Wave rules: "ai pulsar georgia" GitHub resources checked first (owner instruction); prototypes are SHOWN, not shipped — any live push needs a new GO; NB-65/PI-89 stop-order still freezes colour/text rewrites.
**Scout result (2026-07-20):** owner's reference = **AI Pulse Georgia** → `github.com/tornikebolokadze1-cyber/awesome-ai-pulse-georgia` (300 AI dev tools, Georgian descriptions, CC0, 125★) [FACT]. No kids-content / Georgian-TTS / adaptive-learning assets in it. Two usable leads: (1) media-generation category = candidate build-time pipeline for W3 video-tales + story illustrations (ComfyUI, Diffusers, HunyuanVideo; licenses per-tool, check before use); (2) `whisper.cpp` explicitly supports Georgian ASR on-device [FACT] — future "child answers by voice" option for W8, zero-backend compatible. Georgian quality of open TTS models (Coqui/Bark/VoxCPM) = [TO VALIDATE]. Ruled out: Pulsar AI/Supernova (acquired startup), `aipulsar` (crypto) — wrong entities.

## ▶ NOW-previous (s21 classes — still committed, next dev slot after the wave)

| # | Item | Why it is first | State |
|---|---|---|---|
| 1 | **Promise-integrity class** (NB-27 feedback-row TTL vs the ≤12mo privacy promise) | The app makes a promise the system does not keep. Same class as NB-25 (false privacy claim, shipped 07-12) and the privacy card fixed today. This class, not the individual bugs, is what a parent and Google Play both judge. | NEXT UP |
| 2 | **Georgian-quality class** (NB-13 `ვკრებავთ`→`ვკრებთ`, NB-9 untranslated chrome, NB-2 tutor wording) | Being genuinely Georgian IS the differentiation. A grammar error in the tutor is not a "MED bug", it is the product failing its core claim in front of the parent whose trust decides retention. | NB-13 awaits owner native validation; NB-9/NB-2 ready |
| 2b | **NB-72..75 audit fix wave** (4 DEFECTs from the 07-17 audit) | Verified defects sitting open. | Ready — next dev slot |

## ▶ NEXT (committed, ordered)

| # | Item | Why | Trigger/blocker |
|---|---|---|---|
| 4 | NB-26 owner secret in `?k=` → auth header | A real secret leaking into logs/history. Cheap fix, no child impact today, but it is the line between a hobby app and one a school can adopt. | Worker deploy = owner gate (§15b) |
| 5 | NB-30 boot half: `index.html:70` preventDefaults ALL unhandledrejection | Storage half closed today; boot/runtime errors still swallowed app-wide. | Classify benign-vs-bug rejections first |
| 6 | NB-1 footer/dock consolidation · NB-5 exam bonus cap→5 · NB-6 skip-tier monotonic | Mechanics/consistency. Real but nobody's trust turns on them. | Ready |
| 7 | Reading-ladder v0 (Georgian) | Biggest CONTENT gap + core differentiation (30-day plan item ⑦). **The owner named this the #1 strategic gap on 06-17 (PI-39)** — that framing was lost until the 07-15 sweep. | Owner segment call helps but does not block authoring |
| 8 | **PI-64 — the tutor must TEACH on a wrong answer** (explain the mistake → teach → encourage → only then reveal). Fold in PI-68 (reveal is too fast to perceive). | The owl's whole reason to exist, and the cheapest big win on the board: **the expensive half is already built and paid for.** `edges[].reason_ka` (the Georgian explanations) are authored in the data; `tutor.js` never reads them. The owner named this 07-01; the Marble audit found the identical hole independently (learning #5). Two paths, same gap, neither reached a plan until today. | Ready — no owner input needed |
| 9 | **PI-73 — analytics must separate WHO abandoned: parent (at signup) or child (in play)** | The 67% abandonment number is **unreadable without it**. FB traffic may never reach a child at all, in which case we are optimizing the wrong funnel. Blocks any honest read of activation. | Ready; touches the telemetry lane (PI-47) |
| 10 | **PI-84 — „დასვი კითხვა და ამოხსენი": the child poses the question, then solves it** (math). Situation given, no question attached; the child formulates it. | From Niko's real worksheet (07-15) — the owner liked it and named the gate himself: „სწორი ტუტორინგი უნდა". He is right, and it is the whole item. Every math mode we ship hands the child the question and grades a CHOICE; this one grades a FORMULATION, which our engine cannot do. That makes it the first item that genuinely needs the tutor to think, not to check. **Strategically it is also the one format a quiz app cannot copy** — it is the difference between practising arithmetic and practising mathematical thinking. | **Bound to #8** (PI-64 tutor-teaches). Do NOT start before it: shipping this on today's right/wrong engine gives the child a blank box and a red X, which is worse than not shipping. |

## ▶ RECOVERED INTAKE (2026-07-15) — placed, not lost

The full-corpus sweep recovered **49 ideas that existed nowhere on disk** (ledger was 32 → true total **81**,
i.e. it was 40% complete while calling itself the list). Root cause + the completeness rule: `REASONING-LESSONS.md` **L14**.
All 49 now carry a `PI-<n>` row in `PRODUCT_IDEAS.md`. The load-bearing ones are placed here so rule 2 holds:

| PI | Item | Placement |
|---|---|---|
| PI-64 · PI-68 | Tutor explains before revealing | **NEXT #8** (above) |
| PI-73 | Parent-vs-child abandonment split | **NEXT #9** (above) |
| PI-39 | Georgian reading-bridge = the #1 strategic gap (his words, 06-17) | folded into **NEXT #7** |
| **PI-77** | **FORK: during the MVP window, insight extraction outranks strict privacy** | **OWNER GATE — surfaced, never silently reconciled.** Direct tension with the standing §5 promise („all data on-device, privacy absolute"). An agent cannot settle this; it trades a stated parent promise against learning speed. Until he rules, §5 stands. |
| **PI-69** | 8-10yo have no value strong enough to return for — „დამაჩელენჯე" | **LATER, unanswered.** He asked to be challenged on a content-depth gap on 07-05 and got no answer. Needs a real analysis, not a row. Bound to the same segment call as Phase-1 activation. |
| PI-46 | His own red-team: „templatable platform" = venture narrative, „**აქ კვდება focus**" | LATER — a strategy fork (Lane B), alive alongside PI-11 (audience) |
| PI-45 | GTM target: 500 paying kids / $5,000+/mo / owner ≤1hr/day | LATER — the only quantified goal he ever set; nothing is currently measured against it |
| PI-48 | Red-Team + Pre-Mortem as a **standing periodic ritual** (he said „დაიმახსოვრე") | LATER — a process item; he asked for it to be remembered and it was not |
| PI-59 | Khan Academy partnership → Georgianize their free English content | LATER — biggest unexplored partnership; needs the deep analysis he asked for on 06-27 |
| PI-60 | Georgian voice-actor demo material + infrastructure | LATER — **he flagged this as lost himself on 06-27** („დაიკარგა თემა") and it stayed lost 18 days |
| PI-61 | Georgian letters in one real continuous stroke (full spec given 07-03) | LATER — **he had to re-tell it once already** (given 06-28, re-given 07-03) |
| PI-78 | Kill the theme picker, lock brand orange | LATER — pairs with PI-12 (brand lock, owner-gated) |
| PI-54 | FB/Instagram in-app browser = install trap → „open in Safari/Chrome" overlay | LATER — sharper than PI-30; PI-55 is the real-parent signal under it |
| PI-34 · PI-35 · PI-33 · PI-36 | BoG payments · GITA grant · launch promo · seasonal pricing | LATER — all money/strategy = owner lane |
| the remaining 33 | mechanics, content, process, research | tracked in the PI ledger; none is silently dropped |

## ▶ LATER

- Phase-1 activation (guided-guest first-win) — needs the owner's primary-segment call = Lane-B.
- Phase-4 architecture · Phase-5 analytics integrity (`bycodex_Next_Steps.md`).

### Marble arc — the 32-idea opportunity backlog (re-homed 2026-07-15 after the owner asked where it went)

**Why this block exists:** the Marble assessment (s19) produced a ranked 32-idea backlog
(`output/Marble_Audit_2026-07-13/06_NikoLearn_Opportunity_Backlog.md`) whose own verdict is that its top 4
are „worth more than any new game". This roadmap carried **two** Marble lines. The other 30 ideas had no row
anywhere — not NOW, not NEXT, not LATER, not DROPPED. They fell out silently, which rule 2 forbids. Root
cause: this ledger was built from the handoff + the NB tracker, and **both are bug-shaped**, so an
idea-shaped input had no intake path (see the PI ledger in `PRODUCT_IDEAS.md`, created the same day).

The full ranked list stays in the audit file (rule 1: mirrored, never replaced). Status of the TOP TIER:

| # | Idea | P | Honest status |
|---|---|--:|---|
| 1 | Content-validation gate (script fails CI on a broken item) | 12 | **PARTIAL** — `content/graph/validate.mjs` validates the graph JSON only; quiz items are still unvalidated |
| 2 | Observable-evidence authoring standard (2-3 mastery criteria per skill) | 12 | **NOT STARTED.** Effort=1. The cheapest high-value row on this page |
| 3 | AI tutor scope-grounding (owl bounded by a fixed skill list) | 10 | **NOT STARTED** — the graph exists, the tutor does not read it |
| 4 | Math prerequisite DAG as design-time backbone | 10 | In flight as `content/graph/math-fractions.v0.json` (11-node ka ladder, validator green) |
| 5 | „Why this matters" tutor lines from prerequisite reasons | 10 | **HALF** — `edges[].reason_ka` is authored in the data; `tutor.js` never reads it, so the child never hears it |
| 6 | Parent dashboard „რას სწავლობს შენი შვილი ახლა" | 10 | **NOT STARTED** |
| 7 | Unlock-because-you-mastered-X moment | 10 | **NOT STARTED.** Effort=1 |

**PO read (not yet owner-decided):** #2 and #7 are Effort-1 / P≥10 and are the two strongest jump candidates
once the NOW block clears. #5 is the sharpest waste on the page: the expensive half (authoring the Georgian
reasons) is DONE and the child gets zero benefit because nothing reads it. Ideas #8-#32 stay ranked in the
audit file and are re-scored when this block is picked up, not before.

---

## ▶ DROPPED / ამოვარდნილი (permanent ledger — appended, never pruned)

Every row here was a real candidate that is NOT being done. Kept so that „why isn't this in the plan"
always has an answer, and so a revive trigger can fire later.

| Item | Dropped | Why | Revive trigger | Source |
|---|---|---|---|---|
| **CX-01 guest→guided-first-win A/B** | 2026-07-12 | Judged an owner product hypothesis, not a defect → deliberately not logged as an NB. Lived only in a handoff sentence until today. | Owner picks the primary segment → becomes Phase-1 activation | Codex audit |
| **Landing tap targets <44px** | 2026-07-12 | Below the MEDIUM logging bar at triage. Not re-verified since. | Any owner/phone report of mis-taps on landing | Codex audit |
| **Perf / type / nav findings** | 2026-07-12 | Codex-plausible, judged below the bar. Never enumerated individually — if we want them we must re-read the audit. | A perf complaint, or Play-Store review prep | Codex audit |
| **Grant funding** | 2026-07-12 | Owner decision: dropped, **never re-surface**. | None. Do not raise. | Owner |
| **NB-31 CSP + innerHTML hardening** | 2026-07-15 | Real, but heavy: needs an innerHTML/inline-handler refactor across the app. Current risk genuinely low (repo private, names sanitized, no external links). Cost >> today's risk. | Any user-generated content beyond names, OR a backend, OR Play submission hardening | Codex CP-01 |
| **NB-7 telemetry allow-list · NB-11 stale EN regexes · NB-12 listening-mode text fallback** | earlier | DEFER: CF-Worker coupling (NB-7); low value, ka-first (NB-11); NB-12 real but no report yet. | NB-12 revives on any audio-fails report | 07-02 audit / s9 |
| **Features 9-10 of the 2026-07-18 10-feature list** (9 = progress export/print, 10 = diaspora mode) | 2026-07-18 | Owner verdict on the list: „9-10 დროებით არა" — temporary no, not a rejection. | Owner revisits after the W1-W8 wave ships | Owner (GI-34) |
| **NB-37(B) ~120 kings-math EN translation** | 2026-07-14 | A multi-session authoring project of questionable value, in tension with „the app teaches English through content, chrome stays Georgian". Default = keep ka. | Owner picks Option B explicitly | s19 fork |
| **Theme picker option B (bold full re-skin)** | 2026-07-14 | Chrome-only shipped instead; subject/world hues kept as fixed identity the owner likes. | Owner asks for a bolder re-skin | NB-48 |
| **LLM-in-CI genuine auto-fix tier** | 2026-07-14 | Needs `ANTHROPIC_API_KEY` + spend approval = owner money gate. Deterministic version-sync tier shipped instead. | Owner approves spend | NB-46 |
| **UAOP external-agent onboarding protocol** | 2026-07-12 | Owner pivot: „no more governance/doc expansion — maximize PRODUCT progress". Premise verified true (no AGENTS.md; Codex/Antigravity don't load the Constitution). | Owner ask only | s18 |
| **30-day NOT-list:** games.js refactor · CSP/a11y · i18n backfill · C&A · fractions · v2 polish · governance docs · MagicSchool | 2026-07-12 | Explicitly excluded to protect the 30-day critical path (distribution → child observation → Play → retention read). | 08-08 retention readout re-opens the list | 30-day plan |
| **Marble runtime graph-routing** | 2026-07-13 | Deferred BY DESIGN (learning #3): design-time backbone first; the adaptive engine (`placement.js`) already exists, so the graph is a data upgrade not a new system. | Backbone lands + Math content fills | Marble arc |
| **NB-34 profile-null-crash-guard branch** (`da77e6f`) | carried | Built, never pushed. Not dropped on merit — it simply lost its turn. | Next live push train | s16 |
| **NB-35 PWA-telemetry client build** | carried | Root-caused, fix planned; the worker part rides the NB-26/27 deploy gate. | NB-26/27 worker deploy | s18 |

---

## ▶ Superseded plans (kept, not deleted — rule 1)

| Doc | What it still is | Read it for |
|---|---|---|
| `V2-ACTION-PLAN.md` | ACTIVE business plan SSOT, with 2 superseded facts annotated in its header | The activation reasoning; ignore the "retention not measurable" + "53% q0" numbers |
| `ACTION-PLAN-2026-07-02.md` | FAZA-0 scope only (owner 07-05) | Historical scope |
| `ROADMAP.md` | Despite the name = the parked-IDEAS register (its own H1 says so; 4 stable refs incl. code comments) | Idea mine, not a plan |
| `LEVELED-CONTENT-ROADMAP.md` | Content priority ORDER | Content sequencing |
| `roadmap-study-program.md` | Curriculum idea-mine | Curriculum |
| `05_auditbyagents/bycodex_Next_Steps.md` | The full v2.00 Codex audit + Phases 0-5 — **complete, never replaced** | The audit itself; the NB ledger only mirrors its findings |
| `output/Marble_Audit_2026-07-13/` | The full 8-part Marble assessment — **complete, never replaced** | `06_…Opportunity_Backlog.md` = the ranked 32 ideas · `08_…Final_Strategic_Assessment.md` = the verdict |
| `content/graph/` | The built v0 answer to Marble learnings #1/#2/#4/#5/#6/#7 (schema + ka Fractions ladder + validator) | What was actually built vs merely written down |
| `BUGFIX_TRACKER.md` | The NB INTAKE LEDGER = live SSOT for open **bugs** | Per-bug mechanism + evidence |
| `PRODUCT_IDEAS.md` | The PI INTAKE LEDGER = live SSOT for owner **ideas** (table at the top; the prose below it is the idea mine) | What idea the owner gave, when, in his words, and its status |
