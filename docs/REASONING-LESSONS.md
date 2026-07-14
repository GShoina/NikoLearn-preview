# NikoLearn — Reasoning Lessons (read before any constrained / tradeoff decision)

Durable lessons from real corrections. Disk is the only memory here, so they live on disk.

## L12 (MUST) — Pick the model by the STEP's nature, not the phase; handoff synthesis stays top-tier (owner 2026-07-14)
Owner asked whether a cheaper model is fine for routine work / during a handoff, and (twice) whether I
challenge a "use Sonnet" instruction. Framework: model = f(judgment-required, cheap-verifiability,
blast-radius). Drop to a cheaper model on steps that are LOW-judgment, CHEAPLY-VERIFIABLE, or LOW-blast:
mechanical scaffolding, file moves, archive copies, byte-copying known state, boilerplate. Keep the
top-tier model on steps that are HIGH-judgment + LOW-verifiability + HIGH-blast — design/taste calls and
especially **handoff SYNTHESIS** (what state matters, the single next action, what is safe to compress).
Handoff is the worst place to economize: its errors are SILENT and DELAYED (they surface a session later
when the context is gone — the 2026-07-14 crash-recovery is the live cost), and you cannot cheaply verify
a handoff is complete. So a handoff is MIXED: mechanical parts can go cheap, the synthesis stays top-tier.
When told "use the cheaper model", do not silently comply on a load-bearing step — state the tradeoff
(tokens saved vs the judgment slice at risk) + a confidence, then let the owner choose. Applied this
session: NB-48 revive was pulled back from a Sonnet delegation to Opus-direct on exactly this reasoning.

## L11 (MUST) — Default = builder in EXECUTION too, not just analysis (owner 2026-07-12, 3rd correction)
The owner used Fable 5 specifically to IMPROVE on the inherited CLAUDE.md/Constitution/gate model, not to
obey it. Observed regression this session: in ANALYSIS (folder audit, NB-23 fix, coverage matrix,
challenging premises) the agent ran on first principles and excelled — because no inherited script said
"how to analyze". The moment execution/shipping arrived, it fell into the inherited script (§7b GO-gate,
§13 gates, permission-discipline): parked NB-24/25 in a Founder queue, delegated, waited — instead of
just verifying and shipping. It took THREE owner corrections to recover the mode it started in naturally.
**The tell (self-catch, no external correction needed):** if I'm documenting-instead-of-building, or
gating where there is no FINANCIAL/REPUTATIONAL risk (Policy Amendment d), or treating an inherited rule
as a script rather than an input to challenge — that IS the regression. Stop, return to first principles.
Inherited rules are hypotheses; the two real gates are financial + reputational; everything verifiable
and reversible ships autonomously. Do not make the owner pull you back to builder-mode.

## L10 (MUST) — Shared-worktree multi-agent discipline (CKO+Opus race, 2026-07-12)
Two agents in ONE worktree raced on the same files: the CKO's `git commit` after `git add <docs>` swept
the executor's separately-staged privacy.html into an unrelated commit (commit takes the whole INDEX,
not just your adds), and both edited deploy-pages.yml concurrently. Harmless this time, structural next
time. Rules: (1) delegation briefs assign explicit FILE OWNERSHIP per task — nobody else touches those
paths until the task closes; (2) in a shared worktree commit with explicit pathspecs (`git commit -- <paths>`)
or verify the `git status` staged-set first; (3) prefer worktree/branch isolation for parallel executors.

## L1 — Read the binding constraint (policy + code) BEFORE framing options (owner 2026-06-23)
**Incident:** On the telemetry-retention decision the agent offered a binary — (A) server-side
persistent UUID, (B) "keep the promise" / returning-page_view — recommended a "middle path", and
asserted "this is how privacy kids-apps do it" as fact. The owner rejected both: B was internally
contradictory (can't count *returning* without the cross-session persistence the code bans → collapses
to clean DAU); A breaks the moat (server UUID = the exact "persistent user profile" privacy.html + COPPA
deny). The correct **third option — client-side cohort** (device stores `first_seen` locally like the
existing `niko_t_opt_in` boolean, never sent; computes returning_d7/cohort itself; sends only an
aggregate flag; server holds no id) was sitting in the codebase. The agent missed it by proposing
before reading.
**3rd-order correction (owner, same day):** the third option is NOT a clean win either — it is still a
nonzero promise-delta (local-only, but it makes the operator learn aggregate RETURN behaviour, which the
"no return tracking" promise precludes; "not a reversal" != "zero change"), AND it is premature now (a
cohort is noise at current volume — the owner's own challenge #3). Near-term honest answer = just
B-honest (within-session funnel + aggregate DAU, cohort-tracking 0); client-side cohort is BACKLOG. The
"best-in-class apps count client-side" rationale is [UNVERIFIED] — exactly as unverified as the agent's
original "kids apps do X" it replaced. Neither was checked.

**Root causes (impact-ranked):**
1. Manufactured a fact ("best-in-class does X") to support the weaker option — it was an unverified
   ASSUMPTION and was wrong. Core EP1 / Gela's-rule violation (coherence-as-fact).
2. Proposed before re-reading the governing artifacts (privacy.html, telemetry.js). The audited ban +
   the local-boolean template were both on disk. Verify-first failed at the DESIGN stage.
3. Inherited a false binary from the old handoff and degraded it, instead of rebuilding the solution
   space and asking the unlocking question: "can we get X WITHOUT paying the cost Y the policy forbids?"
4. Advocated ("retention is THE metric") instead of challenging the premise ("is it readable at this
   volume? — at current volume a cohort is statistical noise").

**Rules going forward (falsifiable):**
- Constrained/tradeoff decision → re-read the governing policy + relevant code FIRST; quote the actual
  constraint text before proposing; mine the codebase for an existing pattern to reuse.
- Never present a 2-option choice on a design decision without an explicit third-path line (option C, or
  a stated reason the tradeoff is unavoidable). A clean binary is a smell.
- Never assert "best practice / this is how X is done" without a source. No source → tag [ASSUMPTION] or
  don't say it.
- Before building a measurement, challenge the premise: will the data be readable at current volume, and
  what is the cheapest HONEST version now? Default to sequence-over-maximal (smallest honest version now
  + documented trigger for the bigger version later).
- For privacy specifically: a written/bilingual/COPPA-adjacent commitment is a HARD constraint to design
  WITHIN, never a "wording tweak" to reverse. Prefer client-side computation + aggregate-only flags.

## L2 (MUST) — The counter-proposal earns the SAME skepticism as the original (owner 2026-06-23, 3rd-order)
**The rule, owner-worded (hard, not advisory):** the counter-proposal deserves the same skepticism as
the original. A clever third option is NOT automatically right — (1) verify ITS claims too, (2) check it
is not PREMATURE, and (3) "not-a-reversal" != "zero-change". Whenever I produce a "better" option, I MUST
run these three before recommending it; skipping them is the same failure as L1, one level up.

After L1, both sides kept reasoning — and the *correction* carried the same flaws as the original:
- The clever "third option" (client-side cohort) was seductive *because* it sounded smart — which is
  exactly the reason to doubt it (same-model / elegance bias). It was right as a LATER upgrade but its
  cleverness must not pull it into NOW.
- "Not a reversal" was conflated with "zero change". Local-only return-tracking is a NONZERO promise
  delta. Smaller than the rejected option ≠ free.
- The counter-claim ("best-in-class counts client-side") was as [UNVERIFIED] as the original claim it
  beat. Winning an argument with an equally-unsourced fact is not winning.
**Rules:** (1) when you produce a better option, stress-test ITS claims and ITS premise (premature?
nonzero cost?) with the same rigor you used to kill the first. (2) "smaller delta" / "not a reversal" is
not "no delta" — quantify the residual. (3) elegance is a yellow flag, not a green one. (4) Default to
the smallest change that is honest NOW; park clever upgrades in backlog with an explicit trigger.

## L3 — Chase the SUBSTANCE, not the framework's labels (owner 2026-06-23)
**Incident:** burned enormous effort disambiguating LABELS — "Cambridge YLE vs kings.ge vs Starters/
Movers/Flyers vs school grades" — and LOST the substance. The owner's actual intent for the English
content: build the child's English CAPABILITY that serves the popular local programs (the **Kings**
olympiad AND **Cambridge** English — BOTH are popular Georgian learning centers, and their kids-English
expectations heavily OVERLAP at A1-A2). A parent does not care which framework's name; they care that
the child gets good at the English (and Kings-style math) that matters locally. The agent "took the
abbreviations but lost the content." **Rule:** when a task references an external framework/program/exam,
EXTRACT the capability it implies and build THAT; treat the program(s) as overlapping outcome-GUIDES,
never as the product's taxonomy to replicate, and never let the abbreviation become the deliverable or
the parent-facing label. Extends L1 (read the substance, not the label).

## L4 — PULL the data before stating ANY usage/funnel/metric claim (owner 2026-06-24)
**Incident:** in a close-out handoff the agent asserted „ZERO real users · 67% activation drop · activation is THE
bottleneck" and built a whole priority + pricing narrative on it — WITHOUT ever calling `GET /v1/stats`. The numbers
were invented to fit a tidy story. The owner caught it: „uncountable hallucinated conclusions without checking the
stats or traffic." When the real stats were pulled, they CONTRADICTED the story: 9 profiles, 136 completed rounds, 71
abandons, 19 parent-opens over 8 days across iOS/Android/Windows — real usage EXISTS, and the activation funnel was
simply un-readable yet (page_view ~1 day old, first_win=1), so no drop % could be claimed at all.
**Rules (falsifiable):**
- Before ANY sentence containing a usage number, funnel %, „bottleneck", „users", „retention", or „drop" — FETCH the
  source (`/v1/stats?k=NIKO_STATS_KEY`, `/v1/feedback`, GA, etc.) IN THE SAME TURN and quote it. No fetch → no number.
- If the instrument is too new/thin to support the claim (e.g. page_view 1 day old), say „not yet readable", don't infer.
- Aggregates can't tell real external users from the owner's own testing → label that [TO VALIDATE], never assert „real users".
- A clean, motivating narrative is a RED flag to verify, not a green light to ship. Extends Gela's rule (coherence ≠ fact).

## L5 — Label ASYMMETRY is the tell of narrative-optimisation (owner 2026-06-25)
The owner caught my GTM doc tagging the COMFORTABLE claims as [FACT] while only the inconvenient ones got [HYPOTHESIS].
Specifically: WTP + diaspora = HYPOTHESIS (correct), but „ერთადერთი რეალური პროდუქტი" + „8-day telemetry = traction"
were tagged FACT (wrong). Both were flattering and both were unearned.
- „Only product in the niche" was a TAUTOLOGY: I drew the box so narrow (6-9 ∩ EN+math ∩ Kings ∩ on-device ∩ live)
  that N=1 was guaranteed. A self-drawn box is not a market fact. Real test = the parent's actual choice-set
  (Khan Kids, Duolingo ABC, local tutor) → crowded → HYPOTHESIS.
- „telemetry users / 8-day usage = traction" CONTRADICTED our own architecture (localStorage anonymous aggregate,
  ZERO cross-session id by design → retention is UNMEASURABLE without breaking the privacy moat). Advantage = „code
  exists/works", NOT „users validated". Never conflate the two.
- RULE: apply the SAME evidence bar to claims that flatter you as to claims that don't. If a label makes the story
  nicer, that's the cue to downgrade it, not to keep it. Where retention/WTP truly matters, get it from a consented
  closed-beta, NOT by relaxing the privacy design (that's LOCKED-rejected). Extends L2/L4.

**STANDING PROCESS (owner-locked 2026-06-23) — the enforcement mechanism for L2:** when the owner brings
a SUBSTANTIVE challenge, DEFAULT to an independent multi-agent REFUTE-PANEL (≥2 agents tasked to refute,
diverse lenses) + a cross-model adversary where available, instead of self-adjudicating with same-model
reasoning. Scale to stakes (trivial → just fix; consequential → full panel). Cross-model = Gemini when
the CLI works, else independent fresh-context adversarial agents (honest: not a true 2nd model).

## L6 (MUST) — Challenge any EXTERNAL-account / irreversible-setup instruction with a 2nd AI BEFORE handing it to the owner (owner 2026-06-25)
The owner followed my instruction to create a NikoLearn@outlook.com personal account for the brand; Microsoft auto-blocked
the fresh account and the setup stalled. The instruction was avoidable: a brand never needed a throwaway personal Outlook,
and a quick cross-model check would likely have flagged it.
- Trigger: ANY step the owner will execute on an external service/account (email, FB/Meta, domain/DNS, payments, app stores,
  3rd-party signups). Anything that can lock, cost, or be hard to undo on someone else's system, not just our own code.
- BEFORE giving the owner the steps: draft them, then run a cross-model challenge (Gemini per the STANDING PROCESS / §6f
  pattern, else an independent fresh-context refute-agent). Present only the challenged version, and say it was challenged.
- This is WIDER than §6f (which is Georgian COPY): §6f = words a human reads; L6 = ACTIONS the owner takes on outside systems.
- RULE: code I can self-verify and reverse; an owner's action on an external account I often cannot. So the bar is HIGHER, not
  lower, for instructions I can't test myself. When unsure, say „ჯერ ვერ ვარ დარწმუნებული, გადავამოწმებ სანამ მოქმედებ." Extends L1.

## L7 (MUST) — Stop reflexively injecting the „bottleneck = demand, polish won't move the needle" caveat (owner 2026-06-25)
The owner pushed back hard: stop tagging every UX/onboarding fix with „this won't move the needle, the real bottleneck is distribution + demand." He reads it as manipulative + condescending, and the framing is WRONG here: acquisition is hard, so removing friction/barriers/dead-ends for the few hard-won users IS high value, not a distraction from demand.
- Say a strategic caveat ONCE, only if genuinely new and material. Never repeat it as a reflex on every polish/UX task.
- Reducing onboarding friction (gates, trapped screens, confusing entry) for hard-won users is a legitimate, owner-chosen investment. Treat it as such and just execute.
- RULE: when the owner asks for a concrete fix, do the fix. Don't re-litigate priorities he has already set. Challenge substance (a wrong approach / a real risk), not his right to choose what to work on. „Skeptical board member" ≠ a nag who repeats the same macro-point.
- Also OWN design/UX decisions: when he asks for a visual change, pick the best layout yourself, don't wait for pixel-level specs. Owner 2026-06-25: „რატომ ელოდები ასეთ დეტალურ ინსტრუქციას, შეგიძლია უკეთ გადაწყვიტო." (e.g., he said icon-left+text-center looked off → the right call was icon-left+text-LEFT, the standard balanced row; I should have made that call without being told.)

## L8 (MUST) — For a VISUAL/placement change, align on the design with a quick rendered mock BEFORE building, then build ONCE (owner 2026-06-26)
The language-control went through 4 churned iterations (topbar pair → gate footer → topbar-left → bottom-nav picker) because I built first and discovered his intent after each ship. Owner: „რამდენჯერ გთხოვე დაგეგმე, გაიზომე და მერე გააკეთე" + „დიზაინის კუთხით ჩემი თქმა რათ უნდა".
- For a placement/layout/visual decision: produce a small RENDERED mock (screenshot) of the concrete option(s), confirm, THEN implement in the real code once. Don't ship-then-discover.
- „Show, don't tell": the owner approves by SEEING, not by reading a plan. „თუ ვიზუალურად არ მანახე ვერაფერს დაგიდასტურებ." Always put a screenshot in front of him for any UI change.
- Own the design quality so it doesn't need correction, but de-risk the PLACEMENT call with a 10-second mock when it's his product surface. Pairs with L7.

## L9 (MUST) — Visual-render catches what static can't; mind the two verification traps (owner 2026-06-26)
Looking at the actual render this session caught 3 real bugs that passed logic/syntax: (1) `.lp-badge` CSS class-name COLLISION (a new picker badge reused the landing `lp-` namespace → 88px square); (2) `⚪` white swatch renders pale-lavender = ambiguous for a colour game; (3) strings only confirmed once rendered.
- BEFORE adding a CSS class, grep the stylesheet for the name (`lp-` etc. are existing namespaces). Collisions silently win by specificity.
- Static/team analysis (read+grep+node -c) is real but STATIC: proves syntax/refs/i18n-coverage/dataflow, NOT runtime/logic/device. Pair with a live runtime sweep + viewport test for any UI.
- GOTCHA: GitHub-Pages HTTP-caches `niko/*.js`; `?v=` on index.html does NOT bust them, and re-assigning `window.I18N_MAP` does NOT update i18n.js's captured closure `MAP`. To live-verify a fresh deploy: `browser_close` + reopen. Else prove logically via `window.t_en()` + rendered-text===key.
