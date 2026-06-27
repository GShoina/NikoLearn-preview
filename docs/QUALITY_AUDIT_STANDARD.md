# NikoLearn — Quality Audit Standard (owner 2026-06-27)

**Purpose:** one objective bar to audit NikoLearn against, every release. Combines (a) the benchmark from the top
US/EU programs (`output/2026-06-27-Quality Benchmark...html`), (b) the owner's 8 quality dimensions, (c) the loop
rule's 1-10 brutal VERIFY (CLAUDE.md §12), and (d) the agent-team procedure (AGENT_TEAM_STANDARD.md).

## How it works
Audit each of the 8 dimensions, score 1-10 (brutal, honest, evidence-shown). **A dimension <8 = NOT shippable on
that axis → iterate, fixing the weakest first** (loop rule). Run as a parallel agent team per AGENT_TEAM_STANDARD
(read-in-full, RUN THE APP, coverage ledger, adversarial verify, main re-verifies). Persist findings to `output/`.

## The 8 dimensions + the objective bar (≥8 means you meet these)
1. **Content / standards** — 100% items tagged to a real external standard (English→CEFR, Math→Common Core / GE
   curriculum); expert sign-off per unit; accuracy error rate <0.5%.
2. **Illustration / visual** — written art-direction style guide, 100% assets conform; WCAG 2.1 AA contrast on
   100% UI/text; visual-consistency checklist per release. *(industry gap — NikoLearn can lead here.)*
3. **Comprehensibility / age-fit** — readability rubric per age band; ≤1 new concept/screen (3-6y); first-attempt
   success in the 70-85% band (too-easy/too-hard items flagged).
4. **Logicality / pedagogy** — ≥80% mastery before a skill unlocks; prerequisite map enforced; item-discrimination
   check. PLUS the loop-rule 3-bar content gate: answer-correct + solvable-from-shown + the question & its path are
   genuinely LOGICAL (not a contrived trick). *(This is the bar the 2026-06-27 absurdity audit added.)*
5. **Human / natural (anti-robotic)** — tutor voice-&-tone guide; 0 machine-translated strings to children (100%
   human Georgian, no em dash); parent/child "felt natural" ≥4/5.
6. **Voice / audio** — 100% child-facing English audio = native recording (no TTS in shipped lessons); Georgian =
   native talent; loudness/clarity spec per asset. **CURRENT GAP: `AUDIO_MANIFEST` is empty → TTS-only. Score now ~3.**
7. **AI-tutor (owl)** — hints/scaffold, never the final answer (hard guardrail, audited); primary metric =
   next-item correctness; latency <3s; "didn't give the answer" guardrail ≥99%.
8. **Continuous improvement** — every learning change behind an A/B test with a learning-guardrail; ≥1 pre/post
   learning-gain study per track per year; standing KPIs (mastery, retention/return, next-item correctness,
   completion). **CURRENT: telemetry exists; no A/B framework yet; 53% round-abandon unexplained. Score now ~4.**

## Honest current self-score (2026-06-27, post-session)
1 Content ≈8 (verified correct/solvable/logical; not yet CEFR-tagged) · 2 Visual ≈5 (no style guide / WCAG audit) ·
3 Comprehension ≈6 (no readability rubric; 53% abandon unexplained) · 4 Logicality ≈8 (3-bar gate live) ·
5 Human ≈7 (Georgian markup pending owner) · 6 Voice ≈3 (TTS-only, empty manifest) · 7 AI-tutor ≈6 (owl hints exist,
no next-item metric) · 8 Improvement ≈4 (no A/B, abandon unexplained). **Weakest = 6 (voice), 2 (visual), 8 (improvement).**

## TONIGHT — first deep diff-exploration + fix (planned, loop rule)
Pick the highest-leverage weak axis with a fast, data-grounded fix. **Chosen: Dimension 3+8 — the 53% round-abandon.**
Why: it's the strongest negative signal in the live stats (round_abandon 145 > round_complete 129), it caps learning
AND retention, and it's diagnosable from telemetry (which mode/screen/question index do kids quit at?). Plan:
1. Pull abandon-by-mode + abandon-by-question-index from /v1/stats.
2. Agent-team RUN-THE-APP those drop-off points; find the friction (length, difficulty spike, confusing screen).
3. Fix the worst (e.g. shorten the 36-Q Kings exam per finding U4; smooth a difficulty cliff), A/B if possible.
4. VERIFY abandon ↓ over the following days. (Secondary candidates: Dim 6 voice = plan native-audio pipeline; Dim 2
   = write the art-direction style guide + WCAG pass.)
