# Research & Recommendation Quality Standard (NikoLearn)
**v1 · 2026-07-17 · SSOT for the `research-quality` skill.** Short on purpose: hard outcome gates, not rigid rules.

## Purpose
Every research piece, audit, analysis, or recommendation handed to the owner must PASS a measurable quality
bar before it ships, and must carry proof that it passed. This is the outcome-gate twin of `georgian-copy`,
for thinking instead of copy. It operationalizes NikoLearn's existing rules (evidence tags §GSH-OS / §4, loop
წესი §12, red-team + confidence gate, CKO §16) and aligns them to Anthropic's published guidance.

## The 8 quality gates (Q1-Q8) — score each 1-10, ship only when ALL ≥8, fix the weakest first (loop წესი §12)

| # | Gate | The concrete check (how it is MEASURED, not asserted) | Anthropic principle it maps to |
|---|------|--------------------------------------------------------|-------------------------------|
| Q1 | **Evidence integrity** | Every load-bearing claim carries a tag (FACT / HYPOTHESIS / ASSUMPTION / USER DECISION / TO VALIDATE). A `FACT` from a file reads "the file asserts X", never "X is true in reality". Count untagged load-bearing claims: must be 0. | Honesty + calibrated uncertainty (HHH); no fabrication. |
| Q2 | **Verified against source** | Every claim about the code / data / live app was checked against the actual artifact THIS pass, with a file:line or a screenshot. No product-assumption ("E1 is measurable") ships unverified. Count claims-about-artifacts with no verification citation: must be 0. | Grounding / no hallucination; evals culture (test against ground truth). |
| Q3 | **Falsifiable & testable** | Each recommendation names how it would be validated and, where it is a bet, the number that would prove it wrong (kill criterion). A recommendation with no test attached is not done. | Anthropic evals guidance (measurable, ground-truth, kill criteria). |
| Q4 | **Adversarial pass** | The single strongest counter-argument is written down and answered, and MY OWN reasoning is challenged, not only the owner's. If a red-team would collapse the conclusion, it does not ship. | Red-teaming; Constitutional-AI self-critique/revision loop. |
| Q5 | **Calibrated confidence** | A stated confidence % on the main conclusion, against the ≥90% bar for "recommend". The four buckets are separated explicitly: KNOW / ASSUME / AGREED / NEED-TO-VALIDATE. | Calibration; do not present a consistent story as a validated one. |
| Q6 | **Decision-useful** | Ends on ONE recommendation + a default (not an option dump), tied to the owner's actual goal, in plain business language (what it does for a child / trust / cost / time-to-launch), no raw jargon. | Helpfulness: usable output, not a survey. |
| Q7 | **Completeness, no silent gaps** | Coverage is stated AND what was NOT checked is named. Any cap (top-N, sampled, skipped module) is declared, never silently truncated. Absence is proven by a named check, not by omission (§14). | Transparency (Building effective agents); honest scoping. |
| Q8 | **Source transparency** | Every external source is cited; "someone published X" is separated from "X is verified". Single-source claims are labelled single-source. | Honesty about provenance; do not launder assertion into fact. |

## The hard rule at the center (the 2026-07-17 E1 lesson)
**A strategic conclusion may not rest on an unverified product-assumption.** Before any research says "we can do
X" or "X is measurable / ready / working", Q2 forces a read of the real code or data that proves it. The E1
audit exposed exactly this: a whole strategic layer assumed Georgian-reading pre/post was measurable; it was
not, and only a code read caught it. Q2 is therefore a BLOCKING gate: if it scores < 8, the piece is held
regardless of the other seven.

## Anthropic alignment
Grounded in Anthropic's published principles: Helpful/Honest/Harmless with calibrated uncertainty; the
Constitutional-AI critique-then-revise loop (Q4 is that loop applied to research); "Building effective agents"
(transparency, evaluation, simplicity over cleverness); and Anthropic's evals guidance (Q2/Q3 = measurable
claims tested against ground truth). [ASSUMPTION] where a gate adapts a general Anthropic principle rather than
quoting one specific doc — the mapping is directional, not a citation. Revisit when a newer Anthropic doc lands.

## Coverage & tiers (universal coverage, tiered depth) + token budget
Coverage is universal: Q1-Q8 apply to ANY substantive analytical output Fable 5 or Opus 4.8 produces — an
audit (design, engine, code, security), an assessment (a folder / structure, an orchestration or
agent-workflow, a plan, a strategy), research, a feasibility call, a recommendation. Depth is tiered, so the
gate never costs more than the output it checks (the owner's hard token rule):
- **T0 trivial** (lookup, status line, mechanical edit): no gate.
- **T1 substantive** (a finding, an assessment, a plan, a piece of research): the 8-gate checklist + a
  lightweight self red-team. Fully in-session, no agent, no fan-out.
- **T2 high-stakes** (money, customer-facing, a strategy fork, irreversible): the checklist + a SEPARATE
  red-team pass; a second independent grader (a second agent = token cost) is owner opt-in, never automatic.
Red-team is MANDATORY at T1 and above, scaled to stakes (Anthropic "Building effective agents": skip the
evaluator loop when the first attempt suffices or the budget is tight — running the full machine on trivial
output is waste and turns the red-team into theatre).
**Token discipline (reading AND process).** Reading is tiered too: the skill's `SKILL.md` carries the 8 gates
inline and is self-sufficient for T1, so THIS file is opened only at T2, on first use, or under genuine
doubt — never by reflex. Load exactly what a gate needs (targeted read / file:line), never a full repo or a
whole folder "for context". No re-reading files already read; artifacts to disk, not inline. The self
red-team is reasoning, not extra tool calls. The cheapest token is the one never loaded.

## Output — the Quality Scorecard (mandatory footer on every major deliverable)
Append a compact table: the 8 gates, each score /10, one line of evidence per gate, and the blocking-gate
(Q2) verdict. Loop წესი: any gate < 8 → iterate on the weakest, do not ship. This scorecard IS the proof the
bar was met; a deliverable without it has not passed.

## Scope & portability (how global this is)
The substance is ~90% universal; only the wiring is local.
- **Portable core (domain-, project-, language-agnostic):** the 8 gates Q1-Q8, the blocking-Q2 rule, and the
  score-then-fix-weakest loop. They rest on universal Anthropic principles, so they hold for ANY research /
  audit / recommendation, in any project, in any language.
- **NikoLearn-local bindings (the only project-specific parts):** (1) file paths + the §12/§6e/§14 cross-refs;
  (2) what "source" means here for Q2 (code file:line, the live app); (3) output = HTML in `output/`, Georgian;
  (4) the E1 worked example.
- **Globalized (DONE 2026-07-17 by owner GO):** a project-neutral twin now lives at
  `~/.claude/skills/research-quality/` (`SKILL.md` + `STANDARD.md`), binding EVERY Claude session in EVERY
  project. THIS NikoLearn skill is the local adapter that overrides the global one inside NikoLearn, adding the
  three local bindings below. Q1-Q8 are identical in both. (Team-level = a Bivision standard for GelLa / Viktor
  / Gurafa / Geo remains a separate future option, not done here.) Each project keeps a THIN adapter defining
  only: what counts as "source" for Q2, the output format, and the language. The gates never change; only what
  satisfies them does.
- **Per-domain tuning:** Q2 is blocking wherever a claim references a checkable artifact (code, data, a cited
  doc). For pure creative/taste work "source" becomes the brief or the data and the bar shifts from file:line to
  citation, but the gate stays. Q4 (anti-sycophancy) and Q5 (calibration) get MORE valuable at team scale.
- **Cross-silo note:** placing this at `~/.claude` or inside Bivision is OUTSIDE the NikoLearn silo (§0) and a
  Bivision-side decision, so it is an explicit owner-authority gate, not an autonomous move from a Niko session.

## Separate from Codex's standard (owner-set 2026-07-17) — do NOT merge them
This is the **Claude-side** quality standard (Fable 5 / Opus 4.8). Codex writes and maintains its OWN skill to
its OWN standard, and the two stay independent by design — never merged, never cross-edited. That independence
is the whole point: Codex is the owner's cross-model CHALLENGER, so a Codex output gets graded against ITS
standard and a Claude output against THIS one, and the two bars checking each other is the value. Merging them
into one blended rulebook would destroy exactly the independent second opinion the owner is paying for. This
skill therefore never writes into, imports, or overwrites Codex's skill files, and Codex's standard is not a
source for this document.

## Boundaries
- NikoLearn-scoped by default. Does not replace the owner's judgment on direction, money, or taste (owner gates).
- The skill measures and enforces QUALITY of the thinking; the owner still decides the DECISION.
- Cheap by design: it is a checklist the agent runs on its own output, not an agent fan-out. No extra token cost.
- Claude-side only: independent of Codex's separate skill (see the section above); the two are never merged.
