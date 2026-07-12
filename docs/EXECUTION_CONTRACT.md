# NikoLearn — Execution Contract (SSOT for every implementation agent)

**Status: CANONICAL · owner-commissioned 2026-07-12 · applies to Opus, Codex, Claude Code, and any
future implementation agent on every delegated task.** Kept intentionally minimal: it COMPOSES the
project's existing gates instead of duplicating them; every rule here earns its complexity. The CKO
cites this contract in every delegation brief and enforces it at acceptance review — a completion
report that violates it is auto-returned as NEEDS MORE EVIDENCE.

## Why this is not a Definition of Done
A DoD certifies ACTIVITY ("tests ran, docs written"). This contract certifies OUTCOME under three
binding rules — **Evidence-Bound Completion (EBC)**:
1. **No claim without an evidence artifact.** "It works" is not a state; a screenshot/log/diff/probe is.
2. **No completion without a typed decision** from the closed set (§8). Prose success = not done.
3. **The agent attacks its own work before declaring it done** (§9). The first reviewer is the implementer.
EBC beats a checklist DoD because it scales with task risk (evidence proportional to blast radius),
survives agent turnover (artifacts outlive context windows), and converts "done" from an opinion
into a verifiable state.

## The Contract (all 10 sections, in the Completion Report)

**1. Objective** — one line: the problem solved and whether the ORIGINAL business objective was
achieved (not just the ticket text). If the objective drifted mid-task, say so.

**2. Scope** — what changed (files/behavior) and what INTENTIONALLY did not change. Unstated scope
creep = contract violation.

**3. Acceptance criteria** — observable success criteria stated BEFORE implementation (in the brief),
checked one-by-one at completion: user-visible outcome · technical criterion · the §12 loop-წესი bar
(every criterion scored, all ≥8).

**4. Evidence** — per claim, the artifact: rendered-screen screenshot LOOKED at (§6c is mandatory for
ANY UI/visual change), test/harness output, live probe (cache-busted URL check), diff, metric read.
Evidence lives in the report or `output/`; paths given.

**5. Quality gates** — run what applies, name what was skipped and why (one line each):
functional (`npm test` + relevant `qa/` harnesses) · regression (behavioral gate; for bug fixes the
§14 CLASS-SWEEP is part of THIS contract — an instance fix without the class table is incomplete) ·
performance (only if the change plausibly affects load/latency) · security (no new secrets/origins;
allowlists respected) · privacy (`DATA_FLOW_INVENTORY.md` unchanged, or updated in the SAME commit +
copy implications flagged; never add identifiers/free-text to telemetry) · accessibility (when the
change touches interactive controls).

**6. Risk assessment** — remaining known risks · assumptions (tagged) · unknowns · rollback strategy
(usually `git revert <sha>`; state anything NOT rolled back by revert, e.g. KV data, caches).

**7. Knowledge update** — which SSOTs changed (update them in the SAME commit); does
`docs/README.md` index or `SESSION-HANDOFF.md` need a line; tracker row updated (NB-x status).
No orphan docs: new file ⇒ registered in the index in the same commit.

**8. Completion decision (exactly one, mandatory):**
`READY FOR REVIEW` · `READY FOR FOUNDER APPROVAL` (a Constitutional gate is next) ·
`READY FOR DEPLOYMENT` (gate already granted) · `BLOCKED (by what, one line)` ·
`NEEDS MORE EVIDENCE (what evidence, one line)`.
An agent must never declare success without selecting one.

**9. Autonomy rules** — before declaring done, the agent independently: red-teams its own
implementation (what would a hostile reviewer find?) · re-asks "is the requested solution still the
BEST solution now that I've built it?" (if a higher-leverage alternative emerged, say so — evidence
over obedience, Constitution §2) · applies low-risk in-scope improvements WITHOUT waiting for
feedback · sweeps the bug class (§14) rather than the instance.

**10. Deliverable = Completion Report, ≤20 lines:** Summary · Evidence (artifact list) · Risks ·
Decision (§8) · Next recommended action. Goal is confidence density, not documentation volume.

## Composition map (what this contract binds together)
§12 loop-წესი (criteria ≥8) · §6c visual gate · §14 class-sweep · `AGENT_TEAM_STANDARD.md` (multi-agent
minimum) · `AUTONOMOUS_DECISION_POLICY.md` (what may ship autonomously vs Founder gates) ·
`AI_CONSTITUTION.md` §7 evidence standard + §8 self-review. On conflict, the Constitution wins.

## Anti-inflation rule (permanent)
Any proposed addition to this contract must name its measurable long-term benefit AND the failure it
would have prevented. No benefit named = rejected. Review this file only when a real completion
failure escapes it — never speculatively.
