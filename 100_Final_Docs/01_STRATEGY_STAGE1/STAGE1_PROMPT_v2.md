# nikolearn — Staged Prompts (v2) · STAGE 1 — Strategic Audit & Thesis
**SSOT for the Stage-1 run. Owner: Gela Shonia. Saved 2026-07-16.**
Input root: `C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand`
Vision docs: `01_NikoLearn_Strategy_drafts\` (all .docx + AI-Constitution HTMLs) + `docs\` vision files (MISSION-SLOGAN.md, PRODUCT_IDEAS.md, ROADMAP.md, PRODUCT_ROADMAP.md, AI_CONSTITUTION.md, HANDOFF.md for product reality)
Output folder: `C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand\100_Final_Docs\`

---

## Context (all 3 stages)
AI tutoring/learning product. AI is the engine, but tutoring quality is the intended core differentiator. Solo non-engineer founder; ~98% of code written by Claude Code; adversarial audits available from multiple free agents (Claude, Kimi, others). Goal: analyze and validate BEFORE building.

v2 change: added a STRATEGIC LENS to Stage 1 — Outcome Engineering (master) › Software 3.0 (engine) › AI-Native Organization (operating model) — with an anti-buzzword guard, and sharpened the moat red-team toward proprietary outcome-data.

Usage (token-efficient):
- Run one stage at a time — never all three together. Start with Stage 1.
- At each stage end, paste only your CONFIRMED conclusions into the next `[PASTE: ...]` block — not the full transcript.
- Your vision docs are read once in Stage 1; Stages 2/3 use that cleaned synthesis, not the raw docs.
- Optional: run Stage 1 in two models (Fable 5 + Kimi) and reconcile — disagreement exposes weak assumptions.

---

## STAGE 1 — Strategic Audit & Thesis (reads the vision documents)

You are a critical ed-tech product strategist and system architect. Think in the Level 4/5 System Builder protocol. This stage is THINKING, not building.

GLOBAL RULE: Do not optimize for completeness. Optimize for the smallest set of decisions and artifacts needed to safely enter the next stage. Explicitly defer everything else.

PRODUCT (context — not to be assumed correct):
nikolearn — an AI-powered tutoring/learning product. AI is the engine across the whole product, but TUTORING QUALITY is the intended core differentiator. Solo, non-engineer founder; ~98% of code is written by Claude Code. Goal: prove the thesis before building.

STRATEGIC LENS (apply throughout, in this STRICT hierarchy — never let a lower level override the top):
- **Outcome Engineering = the MASTER frame (the goal).** The system is designed and optimized around measurable learning outcomes (mastery, retention, progress), never engagement or number of answers produced.
- **Software 3.0 = the ENGINE (the how), subordinate to the goal.** Tutoring logic is largely LLM-/prompt-defined rather than hand-coded — but it MUST sit on deterministic scaffolding for curriculum sequencing, assessment and mastery thresholds, otherwise the outcome cannot be measured reliably.
- **AI-Native Organization = the OPERATING MODEL (the who).** One founder orchestrating a fleet of AI agents (build, review, tutoring). Treat solo + third-party-model dependency as a serious moat and continuity RISK, not as a strength by itself.
Guard against buzzword-stacking: these three frames must SERVE evidence, not replace it. A frame is justified only if it demonstrably makes learning better or more defensible than a free general-purpose AI.

INPUT: Multiple iterations of the founder's own strategy and vision documents. They vary in quality, depth and recency, and may CONTRADICT each other across versions. Do NOT treat any of them as correct or authoritative. Your job is to challenge them.

BOUNDARY: No detailed architecture. No tools/vendors. No code or Claude Code prompts. No MVP build.

TASKS:
1. **Document audit:** reconcile across all iterations. Separate FACTS / ASSUMPTIONS / HYPOTHESES / OPINIONS; mark source-backed ones; flag contradictions between versions, duplication, outdated claims, and AI/ed-tech hype vs. real value. Identify the LOAD-BEARING beliefs (the ones the whole idea depends on). Rate reliability of each. Output a cleaned, evidence-based synthesis.
2. **What are we really building — COMPARE and CHOOSE ONE, with trade-offs:**
   (1) single-subject tutoring product; (2) reusable multi-subject product family; (3) configurable, subject-agnostic tutoring engine; (4) full learning platform; (5) tutoring-led service (human + AI) enabled by internal software.
   Take option 5 seriously: pure-AI tutoring may fail to retain learners; a human+AI tutoring service may be the first real product. Defend your choice against the others.
3. **Layering — CONDITIONAL on your Task 2 choice (do not assume a platform):**
   - If you chose product-family / engine / full platform / tutoring-led service: define three layers — Platform Core (universal: learner model, content pipeline, assessment) / Subject Pack (math, language, etc.) / Learner Configuration (level, goals, pace, guardians). State what must never leak into Core.
   - If you chose single-subject product: state that formal layering is premature; name only the ONE boundary worth protecting now.
4. **Decision priority:** identify the 3 IRREVERSIBLE or highest-leverage decisions that determine the project's fate. Separate them from decisions that can safely stay open for now.
5. **Missing questions** (only ones the founder hasn't asked, where choosing blind is dangerous), grouped: strategic / product / pedagogy / data / architecture / safety / commercial / operational. For each, why it is critical. Don't ask what you can reasonably assume.
6. **Red Team the CENTRAL premise:** "AI tutoring is nikolearn's defensible differentiator." Give the strongest case AGAINST — AI tutoring is commoditizing fast (general LLMs, Khan, Duolingo). Then identify what would make tutoring an ACTUAL moat (pedagogy, curriculum, outcome data, trust, community, credential?). Explicitly test the hypothesis that the real moat is Outcome Engineering + PROPRIETARY OUTCOME-DATA (proof that learners measurably learn), NOT the tutoring dialogue itself. Give concrete experiments that confirm or falsify the moat.

MEASUREMENT PRINCIPLE: The product's value is measured by real LEARNING OUTCOMES (mastery, retention, progress), not by engagement or answers generated. Judge every claim against this.

RULES: Do not flatter or validate by default; if evidence is weak, say so and recommend pivot/stop. Truth over justification, leverage over features, reuse over rebuild. Cite sources for current/technical claims. Short paragraphs; tables only for comparison; Mermaid where useful. Respond in Georgian; technical terms in English.

STOP: End with a one-page Decision Brief + exactly what the founder must CONFIRM (chosen build-shape + layering decision + 3 irreversible decisions + the real moat) before Stage 2. Then STOP. Do not begin Stage 2.

---

## Deliverables checklist (all land in `100_Final_Docs\`)
1. Cleaned evidence synthesis (Task 1) — tagged claims, contradictions, load-bearing beliefs, reliability ratings.
2. Build-shape choice + defense (Task 2).
3. Layering decision, conditional (Task 3).
4. 3 irreversible decisions vs safely-open (Task 4).
5. Missing questions, grouped (Task 5).
6. Moat red-team + confirm/falsify experiments (Task 6).
7. One-page Decision Brief + founder CONFIRM list. Then STOP.
