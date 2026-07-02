# NikoLearn — abandonment read from REAL telemetry (2026-07-02)

Source: live aggregate Worker `GET /v1/stats` (17 days, 2026-06-16 → 07-02). Pulled with the owner stats
key. Privacy-safe aggregate only (no PII, no per-user data).

## HONESTY CAVEATS (read first)
- **Small, early, tester-heavy sample.** 49 profiles, 369 sessions, mode counts in the tens. Everything
  below is DIRECTIONAL, not statistically robust. [TO VALIDATE] as traffic grows.
- **Retention / "why they don't return" is NOT measurable by design.** No persistent identifier (that
  would be child PII we never set), so unique-user return/cohort retention CANNOT be computed. We can see
  within-session engagement + abandonment + session COUNT, not who came back. The owner's "რატომ არ
  ბრუნდებიან" is structurally unanswerable with current telemetry. [FACT]
- **drop_off event is empty** (no rows) — the dedicated funnel isn't populated; `round_abandon` is the
  working abandonment signal. session_length is a session COUNT (durations not bucketed into the key).

## What the data DOES show
- **Most opened modes:** kings 230, alphabet 145, math 127, english 116, counting 20, movement 17.
- **Round abandon rate (abandon / (complete+abandon)):** math 65% (worst), kings 59%, counting 56%
  (tiny n), english 50%, alphabet 38%, reading 38%.
- **THE dominant pattern — abandon happens at the FIRST question.** round_abandon by q-index:
  q0 = 93, q1 = 20, q2 = 7, tail small. **53% of ALL abandons are on question 0.** Kids open a round and
  leave before investing.
- **first_win by mode:** english 19 (best hook), kings 6, math 5, alphabet 4. English delivers the most
  early success moments.
- **Core cohort:** age 6-8 = 24 of 49 profiles (half); 9-12 = 9; 3-5 = 6.
- **Acquisition:** page_view ref = direct 185, internal 164, facebook 59 (facebook = main external).

## Reading (labelled)
- [HYPOTHESIS, strong] The #1 abandonment lever is the FIRST question: too hard / no warm-up / unclear →
  quit at q0. Medicine = teach/warm-up BEFORE q0 (the mulPrimer pattern generalized), a gentler first
  item, and a warmer owl intro. This is CONTENT + VISUAL at the round-entry moment.
- [HYPOTHESIS] Math + Kings are the hardest to complete (65% / 59% abandon) despite Kings being the most
  opened (high interest, high frustration). Leveled math/kings banks + principle-explanations target this.
- [HYPOTHESIS] English is the success hook (most first-wins) — lead new/young kids there to build momentum.
- [FACT] 6-8 is the core age band → prioritize Band B content + first-question tuning for 6-8.

## So-what for the plan (this SHARPENS existing priorities, does not add a new axis)
1. Highest ROI = kill q0 abandonment: warm-up/primer + gentle first item + warm owl intro on EVERY mode,
   math & kings first. (Feeds Tier-2 tutoring/owl + the leveled content.)
2. Content by level (already in flight) should make the FIRST item of each band easy-win, then ramp.
3. Visual: the round-entry / first-question screen needs an inviting, low-intimidation design ("wow" but
   calm) so a child does not bounce at q0.
4. If the owner wants real return/retention, that is a separate privacy decision: add a privacy-safe
   returning-visitor counter (aggregate, non-PII local flag) — RECOMMEND, needs owner OK (privacy).
