# NikoLearn — Bug + Systemic Fix Tracker (live, owner-tracked)
**Updated 2026-07-05.** SSOT for every owner-reported bug + the systemic class behind it. New owner
reports get inserted here in priority order; nothing is asked until the list reaches the bottom.

## 🧾 NB INTAKE LEDGER (§14 owner-report intake — append here FIRST, echo "დაფიქსირდა NB-<n>")
One row per reported case, BEFORE analysis. Closes only with: class-vs-instance verdict + fix/DEFER reason + §6c live-verify.
| NB | Symptom (1 line) | Source | Status | Class sweep |
|---|---|---|---|---|
| NB-1 | footer talk consolidation — bespoke `.talk-nav` ≠ shared dock | session-6 queue | OPEN | shared-dock class, table pending |
| NB-2 | ka tutor wording B-1…B-8 (`tutor.js`/`owl.js`) | session-6 queue | OPEN | pending |
| NB-3 | s-badge contrast | 07-02 audit | OPEN | contrast class (VIS-2/3 fixed, badge left) |
| NB-4 | 44px tap targets | 07-02 audit | OPEN | pending |
| NB-5 | exam bonus cap→5 | 07-02 audit | OPEN | instance-level |
| NB-6 | skip-tier monotonic | 07-02 audit | OPEN | pending |
| NB-7 | telemetry allow-list | 07-02 audit | DEFER — CF Worker coupling | N/A (deferred) |
| NB-8 | "Screen-time" anglicism | 07-02 audit | OPEN — likely dead key (session-9) | verify key rendered at all |
| NB-9 | menu-i18n cluster: `screens-menu.js:100` სამკუთხედი, Premium `·`vs`—`, `screens.js` chrome, firstrun island | 07-02 audit | OPEN | untranslated-chrome class |
| NB-10 | Movement/მოძრაობა section weak — strengthen like ამოწერა; include Movement/Drawing/Talk in every sweep | owner | OPEN | full-menu surface rule (§14.2) |
| NB-11 | stale EN-translation regexes (`i18n-strings.js:765,771`) → EN-UI untranslated titles | session-9 | DEFER — low value (ka-first) | i18n-regex-drift class |
| NB-12 | 3 listening modes (`listen`,`k-listen`,`listen-yle`) have NO text fallback if audio fails | session-9 q0 audit | OPEN [TO VALIDATE — inherent to listening?] | audio-dependency class |
| NB-13 | `ვკრებავთ`→`ვკრებთ` morphology (`tutor.js:135`) | external audit | OPEN — owner native validation | ka-grammar class |
| NB-14 | ZERO behavioral/unit tests = structural cause of dropped-bug recurrences; scope+implement minimal logic harness (tutor/games), due ≤2026-07-12 | 2026-07-05 architecture session | OPEN | process class — root cause |
| NB-15 | pre-reader (≤5) shapes quiz showed shape-NAME word options → a non-reader cannot answer | session-10 pre-reader audit #1 | FIXED v1.350 (§6c verified young+reader) | **CLASS: "quiz option format assumes the child can READ the option text — pre-readers can't."** Shapes swept + fixed (audio-in/picture-out). Sibling instances OPEN below: NB-16 (ka-alpha reading suite ungated), NB-17 (math-add unvoiced) |
| NB-16 | ka-alpha reading suite (კითხვა/წინადადება/გაგება/ააწყვე/შეადგინე) + გაგება offered to young (≤5) pre-readers; word options, some unvoiced | session-10 pre-reader audit #2 | FIXED v1.353 (qa/_alpha-young.mjs 23/23 + §6c screenshots + live-verified on apex 2026-07-06) | **CLASS verdict:** gate = modes that ASSUME reading: წინადადება (sentLearn), გაგება (rtext — no-audio by design), შეადგინე სიტყვა (shead — silent ka letter-ordering) hidden for ≤5 in ka+en menus. KEEP for ≤5 = audio-scaffolded reading ACQUISITION: ისწავლე/ტესტები/კითხვა/ააწყვე/ამოწერა [ASSUMPTION — owner can tighten]. §14 sweep found 3 sibling instances, all fixed same pass: (1) fresh young profile's „გააგრძელე" card routed into the ENGLISH menu (PATH_SUBJS fallback in homeResume) → skip empty-path subjects; (2) english path = 5 unreachable milestones capping young ჯამური პროგრესი → pathFor young english=[]; (3) tiny (≤4) math path counted unreachable add/sub → shapes only |
| NB-17 | math-add problem for young not voiced (pre-reader can't read the sum prompt); verify options ≤10 | session-10 pre-reader audit #3 | FIXED v1.352 (25 asserts, live-verified; device ear-check TO VALIDATE) | read-the-prompt class → abstract add/sub voiced via playClipSeq (sub = dative clips), visual take-away sub added; reader ≥7 stays silent |
Legend: next id = NB-18. Session close: every OPEN NB → SESSION-HANDOFF carried-open block.
(Sections below = pre-07-05 history in the legacy `[x]/[ ]` format — kept as record; new intake goes ONLY in this ledger.)

## GOAL
Every reported bug fixed at the **choke-point** (shared layer, whole class dies), verified before it
reaches the owner. LOOP: weakest/highest-value open item → fix at choke-point → verify (logic+§6c render)
→ deploy (fix) → tick. DONE = root found · shared-layer fix · verified · live.

---

## ✅ LIVE (deployed + verified today)
- [x] pattern/reasoning owl speaks Georgian + right lesson/label — v1.298
- [x] iOS keyboard on every tap (registration) — v1.299
- [x] „Русский" dead option removed — v1.299
- [x] teaching beat on the FIRST wrong answer (grasp before retry, shared reQueueWrong) — v1.300
- [x] duplicate question in a round (deduped word/phrase pools) — v1.301
- [x] owl SPEAKS in math (fixed voiceable `say` phrases + clips) — v1.302
- [x] units/tens hint now DEFINES the terms inline (no assumed knowledge) — v1.302
- [x] READABILITY STANDARD (structured tutor text: lead+bullets+conclusion, adaptive font, measure) — v1.303
      + `docs/READABILITY_STANDARD.md`; units/tens hint restructured to match owner mockup.
- [x] adaptive fonts fanned out to ALL cards (question/sub/teach card/equation/count) — v1.304
- [x] owl speaks ka in ALL subjects (INV-3 fan-out complete: vocab/alpha/kings/count/compare/…) — v1.305
- [x] fast-reveal modes (spell/listen-yle/yesno/story) now teach-gate, no fast auto-advance — v1.306
- [x] privacy/consent copy OVER-STATED (owner 07-02): removed Clarity + inert Meta Pixel + cookie banner →
      site 100% cookieless (kept cookieless CF beacon + first-party aggregate Worker); privacy.html ka+en
      rewritten to no-ads reality; "სრული privacy"→"სრული კონფიდენციალურობა"; softened "GDPR & KIDS" — v1.307.
      Live-verified: banner gone, fbq/clarity never load, 0 errors, layout intact.
- [x] post-test recommendation was tiny (.88rem) + buried "which topic" (owner 07-02): placement results now a
      readable `.reco` card — prominent adaptive topic (clamp 1.28-1.7rem), readable lead/sub, + listen button
      (reco_start.mp3, edge-tts ka; playClip-gated) — v1.308. Live-verified: topic 27px, mp3 HTTP 200.
- [x] readability STRUCTURE fan-out beyond units/tens (owner 07-02): 4 inline-list hints → .r-lead + .r-item
      bullets (compare >/</=, shapes, clock hands, EN subject-verb) — v1.309. speakHint strips tags, csay clip
      covers voice (§6-safe). Live-verified: r-item=13, rendered as bullets, 0 errors.
- [x] INV-5 puzzle/riddle objects too small on phone (owner 07-02): pattern/math-pat numbers + rebus/model
      strand text + triangle (fluid box + %-positioned labels + clamp fonts) all clamp-fluid & BIGGER on phone
      — v1.310. Verified @390px: pattern 30→35px, rebus 24→26px, triangle val 15→18px, box 90→117px, aligned.
- [x] INV-3 owl-voice fan-out COMPLETE: listen-yle/yesno/speak/story returned from Tutor.build with no r.say
      (owl silent, TTS-fails on iOS) → added fixed ka say phrases + edge-tts clips (yle/yesno/speak/story_say.mp3)
      — v1.311. Live-verified: manifest ok, 4/4 mp3 HTTP 200, playClip true.
- [x] INV-6 talk grammar + audio drift (owner): built a diff-tool (talk.js q vs manifest key) → found 5 orphans
      (text fixed in talk.js, audio/key stale). Synced 4 prose cards to talk.js SSOT + regen clips: tlk_000
      (plural agreement ყოფილიყო→ყოფილიყვნენ), tlk_018 (უყენებდე→უწესებდე), tlk_025 (tense), tlk_026 (reworded)
      — v1.312. Verified: q→clip resolves, 4/4 mp3 200, old keys gone. tlk_045 poem left (edge). Gemini: NOT RUN (no key).
- [x] INV-1 teach-before-test (owner 07-02): multiplication primer before the first mul round (per profile,
      flag mulPrimerSeen) — teaches × = repeated addition with a visual (3 groups of 4 apples = 12) + owl clip.
      Tap „დავიწყოთ" → real round. — v1.313. Verified @390px: primer renders, listen, start-flow sets flag, 2nd skips.
- [x] INV-4 adaptive ladder for flat modes (owner 07-02): shared flatTier(mode) 1-3 climbs on a 4-correct
      mastery streak; bumpFlat in each handler. compare 10→20→100, skip ×5→×10→×2/3/4, clock +half hours at t2,
      money 2→4 items+more lari — v1.314. Verified: tier climbs+caps, wrong resets, generation scales, renders clean.
      (count/shapes left un-tiered: young foundational / small fixed pool = little headroom.)
- [x] #1 English one-tap „დაიწყე აქედან" (owner GO 07-02 after preview): results primary button launches the
      recommended session in ONE tap (startHereGo; English milestone → vocab quiz), tappable topic chip, secondary
      „ყველა თემა" for free-roam — v1.315. Preview-reviewed on desktop, GO'd, live-verified: one-tap=yes, v1.315.

## Findings (verified, no code change needed)
- INV-2 answerOutcome resolver — ASSESSED, refactor NOT done (deliberate). Fresh audit of all wrong-answer
  handlers: behaviour is ALREADY consistent via 3 appropriate primitives — reQueueWrong (9 handlers),
  teachAndConfirm (listen-yle/yesno/story/spell), rule-reveal on 2nd miss (pattern/reason). exam = no-teach
  BY DESIGN (assessment), count = retry-till-right BY DESIGN (youngest mode). The original "15 handlers, only
  9 share the contract" framing was overstated. Forcing all into ONE monolithic answerOutcome is the WRONG
  abstraction — it would break exam (must not teach) and count (must retry). User-facing value = zero; regression
  risk across 15 modes = high. Correct architecture (small shared primitives, each handler picks the right one)
  already exists. Not shipping a risky invisible refactor for elegance. [If owner still wants the consolidation
  purely for maintainability, it's optional tech-debt, do it in isolation with a full per-mode test pass.]
- "correct answer marks too fast": on the CURRENT live build a wrong math answer no longer flash-marks the
  correct one (verified via a timed DOM timeline) — it teaches (hint 1st miss, gated teach card 2nd miss).
  This was the OLD behaviour before v1.300/v1.302. Re-test on v1.303; if it persists, name the exact mode.

## 🔬 DEEP AUDIT 2026-07-02 (8-dimension Quality-Audit standard, 40-agent team, method-upgraded per-mode matrix + play-on-phone)
Ship gate FAILED — every dimension <8 (brutal bar). Scores weakest-first: **D8 improvement=3 · D7 owl=4 · D3 comprehension=5 · D4 pedagogy=5 · D6 voice=5 · D1 content=6 · D2 visual=6 · D5 human/trust=7.** 48 confirmed findings (1 CRIT, 1 HIGH, 28 MED, 18 LOW). Full result: tasks/w51l1kdx2.output.
Two buckets: (A) shippable BUGS → fixed below; (B) PROGRAM/INVESTMENT gaps (no A/B framework, no native-voice talent, no CEFR/Common-Core tagging, no WCAG style guide) = roadmap forks needing owner decision, NOT loop-fixable.

## ⏳ STAGED — v1.316 (preview, awaiting owner GO → live)
- [~] 🔴 CRITICAL owl leaks the answer (D7 AITUTOR-01): tutor.js math count-on hints printed the terminal number
      (5−2 → "…უკან: 4, 3…"). CHOKE-POINT fix in tutor.js countSeq()/mulSeq(): enumeration always stops ≥1 step
      short of the total → verified 0 answer-reveals across 674 result-revealing combos. Guardrail restored.
- [~] 🟠 HIGH 18 versions never reached returning users (D8-F1): sw.js CACHE frozen at nikolearn-1.297 while app=1.315
      (cache-first SW never re-installed). FIX: ran bump.mjs (single-writer) → APP_VERSION + sw CACHE + landing footer
      all synced to 1.316; this deploy delivers the whole v1.298→1.316 backlog to returning/PWA users. QA gate PASSED.
      HARDENING DONE: installed `.git/hooks/pre-push` — any push to `main` now runs `npm test` and is BLOCKED if the
      gate fails (the gate already flags APP_VERSION↔CACHE↔footer drift as release-blocking); verified it fires on a
      main-ref push. The drift class can no longer ship silently. (Hook is local to this clone, not git-tracked.)

## ✅ v1.317 — audit safe-batch (accessibility + accuracy), deployed
- [x] VIS-2 shield-chip contrast: --sun-d (2.48:1, fail) → oklch(0.52 0.14 72) = **5.55:1** on card (headless-measured).
- [x] VIS-3 movement-break .mv2 --faint 0.640→0.540 (proven main-theme value) = 3.04→**4.61:1**.
- [x] VIS-6 .m-sub + .section-label .71/.72rem → clamp(0.82rem,3.4vw,0.95rem) (readable on phone; rendered @360px OK).
- [x] VIS-1 .topbar flex-wrap:wrap (chips no longer overflow narrow screens; computed wrap confirmed).
- [x] H5-3 privacy.html „ბოლო განახლება"/„Last updated" → 2026-07-02 (matches the v1.307 no-ads rewrite).
Verified: QA gate 0 findings @1.317, 0 console errors, home render clean @360px.

## ⏳ OPEN — audit remainder (queued, honest categorization)
**Fable5 owns (parallel session):** tutor.js answer-leak AITUTOR-01/06 + tutor parts of D3-F6/AITUTOR-03/05.
**Bucket B — investment/asset, NOT code-loop-fixable (owner forks):** CEFR/Common-Core tagging (C2/C1), A/B
framework (D8-F2), per-item discrimination logging (PED-5), native-voice recording + loudnorm (VOICE-3/4/6, C4),
font self-hosting (H5-2), per-unit sign-off ledger (C5).
**Deferred — needs care/coupling:** telemetry events needing Cloudflare Worker redeploy (AITUTOR-02, D8-F4/F6/F7,
D8-F8 submode-in-abandon); wrong-answer-handler routing (D3-F1/PED-6/AITUTOR-04 — regression risk + overlaps
Fable5's tutor.js); PED-3 (count=retry-till-right is BY DESIGN, do NOT consolidate); exam gating PED-7; H5-4
i18n regex (verify vs live emit-strings first); shapes mastery tier D3-F5; readability rubric into gate D3-F7.

## ⏳ OPEN — priority order (owner firehose 2026-07-02; plans: docs/FABLE5-ACTION-PLAN.md · LEVELED-CONTENT-ROADMAP.md · ANALYTICS-ABANDONMENT-2026-07-02.md)
0. [x] 🔴 **Owl answer-leak choke-point + commit** — already done pre-session (v1.316 / commit 6b23c2c): countSeq/
       mulSeq stop >=1 short, 0 reveals over 674 math count-on combos. Staged, NOT live. (Residual all-modes audit -> #4.)
0b.[x] **v1.317 accessibility fixes committed** (were uncommitted, interrupted) -> commit a2361f2. Staged, NOT live.
1. [ ] **Talk cards -> OUR card design** (owner APPROVED the 20). theme/char/emoji/subs/min + grade by age +
       edge-tts clips tlk_051+ + dedup vs 50-deck -> preview -> GO -> live. **(NEXT ACTION.)**
2. [ ] **Leveled content integration** (Math 17 + English 17 self-verified; Kings next). Owner+Gemini QA ->
       wire behind band gates (isYoung/isBig/kingsLevel) -> clips -> preview -> GO. Review HTMLs sent.
3. [ ] **q0-abandonment fix (DATA-DRIVEN)**: 53% of abandons are on the FIRST question; math 65% / kings 59% worst.
       Warm-up/primer + gentle first item + inviting first-screen visual, math & kings first.
4. [ ] **Tutoring = explain the PRINCIPLE** (owner #3): Fable band-aware explanations (x-table, 1-2 unknown
       equations, place value, fractions) + teach/primer flow. Tier-2 moat. Includes all-modes answer-leak audit.
5. [ ] **Owl (bu) upgrade** (owner #4): richer/varied/band-aware persona + warm round-entry intro (ties #3/#4).
6. [ ] **Georgian voice eval** (owner #5, NOT Fable): edge-tts voice/SSML/rate; child intelligibility; options+cost.
7. [ ] **Letter-tracing (centerline) polish** — parked, verified-good; finish later (owner: needs polish).
8. [ ] **Design polish + "wow"** (v2) — last, rides on 1-6.
- ANALYTICS finding: retention ("do they return") NOT measurable by design (no persistent ID = child PII);
  q0 abandonment is the lever. Full read: docs/ANALYTICS-ABANDONMENT-2026-07-02.md.

Legend: `[ ]` open · `[~]` partial · `[x]` DONE + live.
Architecture SSOT: `docs/INTERACTION_CONTRACT.md`. Branch note: hotfixes linear on main; F2 feature branch
(jelly cards, vivid counting, landing telemetry) to be rebased onto main before its own ship.
