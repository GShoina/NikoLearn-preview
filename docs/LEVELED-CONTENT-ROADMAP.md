# NikoLearn — leveled content + tutor roadmap (owner-prioritized 2026-07-02)

> **Status: ACTIVE (owner-set content priority ORDER).** Scope fence: THIS file = priority order;
> curriculum idea-mine = `roadmap-study-program.md`; plan SSOT = `V2-ACTION-PLAN.md`; map = `docs/README.md`.

Owner set the priority order this session (supersedes the letter-shapes item, which is parked):
1. **Content creation BY LEVEL** (English, Math, Kings) — using Fable5.
2. **Strengthen the tutor's role** — using Fable5.
3. **Design polish + „wow" effect** — after 1 and 2.

Letter-tracing (ასოების მოხაზულობა): 1-attempt done. Verdict = the centerline/skeleton approach
(parked `feat/centerline-writing`, `stroke-data.js`, 33 ka letters) renders CLEAN pen-like letters,
clearly better than the current font-outline (which traces the perimeter and barely shows). Owner:
„clearly better but needs polish" → PARKED as a verified-good direction to finish later, not now.

## Level framework (anchored to the REAL app model, not invented)
App age model (niko/core.js): isTiny ≤4, isYoung ≤5, isBig ≥7; kingsLevel = age≥9→3, ≥8→2, else 1;
math splits young=add/sub/shapes vs big=+division/missing-number/2-digit; flatTier 1-3 adaptive ladder.
Age chips offered: 3-12. Progress LEVELS (🐣🌱🚀⭐🏆) are gamification, separate from content difficulty.

Content bands (map onto the above):
- **Band A — პატარები (3-5):** visual + audio, minimal/no text. Counting 1-10, number recognition,
  add/sub within 10, shapes, alphabet sounds. (English: listen/point only.)
- **Band B — დაწყებითი (6-8):** add/sub within 100, intro ×, two-step word problems, reading
  comprehension (short), English vocab-in-context + simple sentences. Kings level 1.
- **Band C — გაძლიერებული (9-12):** ×/÷, number patterns/sequences, multi-step logic, fractions intro,
  English grammar + inference reading. Kings level 2-3.

## Guardrails (unchanged, non-negotiable)
§11 ORIGINAL only (Kings never copied). §8 no em dash. Math: every answer self-verified, solvable from
shown info, real distractors. §6f Gemini KA-QA + owner native before ship (Gemini NOT RUN w/o key).
§7b customer-facing → preview → owner GO → live. §12 loop: each criterion ≥8 before shipping.

## Execution plan
### Priority 1 — leveled content banks (Fable5 → verify → review HTML → owner → integrate)
- [in progress] MATH bank — Band A/B/C, archetype-based, self-verified.
- [in progress] ENGLISH bank — Band A/B/C, vocab/reading/grammar by band.
- [queued] KINGS bank — levels 1-3 (already has kingsLevel model + validated samples).
Integration targets: math generators/pools (games.js, placement.js diag sets), READING_TEXT_KA / vocab
pools (alpha.js / games.js), kings pools. Wire each item to the right band gate (isYoung/isBig/kingsLevel).

### Priority 2 — tutor role strengthening (Fable5)
tutor.js = the hint/teach engine (Tutor.build → owl hints, teach cards, rule reveals). Goal: warmer,
clearer, LEVEL-aware explanations (a 4-yo and a 10-yo should not get the same hint wording). Use Fable5
to author band-appropriate hint/teach copy per mode; keep §6-safe (AUDIO_MANIFEST clips, owl speakHint
strips tags). Plan: audit current hints → Fable rewrite per band → Gemini/native QA → clips → ship.

### Priority 3 — design polish + wow (later)
v2.00 „Sunlit" design integration + micro-interactions/celebration polish. Scope after 1 and 2 land.
