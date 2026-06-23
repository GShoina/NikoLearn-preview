# NikoLearn — Reasoning Lessons (read before any constrained / tradeoff decision)

Durable lessons from real corrections. Disk is the only memory here, so they live on disk.

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

**STANDING PROCESS (owner-locked 2026-06-23) — the enforcement mechanism for L2:** when the owner brings
a SUBSTANTIVE challenge, DEFAULT to an independent multi-agent REFUTE-PANEL (≥2 agents tasked to refute,
diverse lenses) + a cross-model adversary where available, instead of self-adjudicating with same-model
reasoning. Scale to stakes (trivial → just fix; consequential → full panel). Cross-model = Gemini when
the CLI works, else independent fresh-context adversarial agents (honest: not a true 2nd model).
