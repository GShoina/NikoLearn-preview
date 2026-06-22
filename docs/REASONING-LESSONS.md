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
aggregate flag; server holds no id) — was sitting in the codebase. The agent missed it by proposing
before reading.

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
