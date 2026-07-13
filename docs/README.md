# NikoLearn docs/ — Knowledge Index (CKO SSOT map)

**Status: CANONICAL · created 2026-07-12 by CKO (owner-directed role) · update on every doc add/move/status change.**
This is the single map of what is authoritative, what is working material, and what is history.
Rule of thumb: **if a doc is not listed here, treat it as unclassified and ask the CKO pass to classify it.**

## The SSOT chain (read in this order at session start — per Constitution/CLAUDE.md)
| Axis | SSOT file | Notes |
|---|---|---|
| **HIGHEST operating policy** | `AI_CONSTITUTION.md` | owner-issued verbatim 2026-07-12; wins on any conflict; amendments = owner-only (its §11) |
| Rules / operating agreement | `../CLAUDE.md` (repo root) | §8 no-em-dash, §11 originality, §12 loop, §13 anti-stop, §14 class-sweep, §15a/§15b policy ptrs, §16 CKO |
| **Execution standard (all impl. agents)** | `EXECUTION_CONTRACT.md` | owner-commissioned 2026-07-12; Evidence-Bound Completion; cited in every delegation brief, enforced at CKO acceptance |
| Autonomy / decision policy (detail) | `AUTONOMOUS_DECISION_POLICY.md` | owner-authored verbatim 2026-07-12; operational detail under the Constitution (§6 gate lists match); stricter-than-prior-practice gates noted in its header. **Two-level split is a locked owner decision (merge rejected 2026-07-12) — cross-reference, never merge** |
| Reasoning standard | `GSH-OS.md` + `REASONING-LESSONS.md` | load with handoff; lessons L1-L9 before tradeoff decisions |
| Live state / resume pointer | `SESSION-HANDOFF.md` | keep < 30KB (currently over — trim candidate); archives in `archive/` |
| Architecture | `HANDOFF.md` | factual layer refreshed 2026-07-12; §8 coding rules owner-locked |
| Product / strategy backlog | `PRODUCT_IDEAS.md` | living; contains the strategy chronology 06-05→06-09 (re-opened forks) |
| Owner strategic intent (verbatim) | `OWNER_GRILLDOWN_BRIEF.md` | never compress; both audiences, skill-based, Version A/B demand |
| Mission slogan | `MISSION-SLOGAN.md` | locked triad: თავდაჯერებული/შემოქმედებითი/დამოუკიდებელი |
| Bugs / systemic fixes | `BUGFIX_TRACKER.md` | NB intake ledger on top; next id in Legend |
| Active plan | `V2-ACTION-PLAN.md` | per owner decision 2026-07-05; `ACTION-PLAN-2026-07-02.md` = FAZA-0 scope only |

## Standards (one canonical per axis — scope fences)
| Axis | Canonical | Companions |
|---|---|---|
| Georgian copy (gates) | `GEORGIAN_COPY_STANDARD.md` | `.claude/skills/georgian-copy` points here; Gemini KA-QA = CLAUDE.md §6f |
| Copy readability (ALL user-facing text) | `COPY_READABILITY_STANDARD.md` | newest (2026-07-03) |
| Child-facing typography/legibility | `READABILITY_STANDARD.md` | age-band rubric also in `DESIGN_TONE_READABILITY_STANDARDS.md` §C (merge candidate) |
| Design tone / art direction | `DESIGN_TONE_READABILITY_STANDARDS.md` | from 8-dim audit 2026-06-27 |
| Voice RECIPE (how to generate TTS) | `VOICE_STANDARD.md` | 2026-06-12 |
| Voice QUALITY (how to judge audio) | `VOICE_QUALITY_STANDARD.md` | + runnable `tools/voice-eval.mjs`; verdict 2026-07-11: EkaNeural passes |
| Quality bar / audits | `QUALITY_AUDIT_STANDARD.md` + `AGENT_TEAM_STANDARD.md` | team minimum owner-locked 2026-06-26 |
| Owner-report STRUCTURE (exec) | `REPORT_STANDARD.md` | NEW 2026-07-13, owner-issued; decision-first, importance-ordered; sits on §6e/§6f/§8; ref impl = Marble integration v2 |
| Georgian-copy checklist (INTERNAL) | `GEMINI_KA_LESSONS.md` | NEW 2026-07-14, owner decision; internalized recurring Gemini KA corrections → self-apply on INTERNAL reports (no live Gemini call). Customer-facing copy still uses full §6f (Gemini THEN owner). |
| Data / stats hygiene | `DATA_HYGIENE.md` | probe-subtraction notes also in SESSION-HANDOFF data notes |
| **Data flows (what leaves the device)** | `DATA_FLOW_INVENTORY.md` | NEW 2026-07-12, code-verified; drives privacy copy (NB-25); update in SAME release as any new flow |
| Security / IP rules | `SECURITY_RULES.md` | + CLAUDE.md §11 originality |
| i18n architecture | `I18N_ARCHITECTURE.md` | EN = overlay over rendered ka (NB-19 class context) |
| Design system v2 | `V2000-DESIGN-SYSTEM.md` | + `DESIGN_BRIEF_PROMPT_v2.md` (AI-designer master prompt, tool) |

## Working / reference material (ACTIVE)
- **`../content/graph/`** — NEW 2026-07-14: content-as-DATA layer (v0 proof). Versioned, schema-validated skill graphs replacing hardcoded `PATHS`/`SUBJ_DIAG` in code. Files: `skill-graph.schema.json` (contract) · `math-fractions.v0.json` (first real content, 11-node ka Fractions ladder) · `validate.mjs` (0-dep validator: schema + acyclicity + reason/strength + skill_type→item_format; `--selftest` proves it discriminates) · `README.md`. Embodies Marble learnings #1/#2/#4/#5/#6/#7. Runtime-routing + probabilistic mastery (#3) deliberately DEFERRED. Owner report: `output/2026-07-14-Marble learnings გეგმა-შესრულება by Niko.html`.
- `ROADMAP.md` — **KEEP-as-is decision (CKO 2026-07-12):** despite the name it is the parked-ideas register; its own H1 says so, and 4 stable references (incl. code comments kings-exam.js/parent.js) outweigh a rename.
- `LEVELED-CONTENT-ROADMAP.md` (priority ORDER) + `roadmap-study-program.md` (curriculum idea-mine) — scope-fenced 2026-07-12, intentionally separate axes.
- `FABLE-CONTENT-PLAN.md` — ACTIVE Fable-usage policy (its dated sibling `FABLE5-ACTION-PLAN.md` archived 2026-07-12).
- `MATH_IDEAS_LIBRARY.md`, `CURRICULUM_MAP.html` (coverage map; biggest gap = Georgian reading ladder), `PARENT-GUIDE.md`, `SKILLS-TO-USE.md`, `COMPETITOR_garnamatac.md` (+ root `competitor-profiles/nodi.md`).
- Drafts awaiting owner §6f validation: `fable-leveled-banks-2026-07-02.md`, `fable-talk-cards-2026-07-02.md`, `fable-owl-activation-copy-2026-07-02.md`, `fantasy-batch1-draft.md`.
- `PLACEMENT_LAYER_B.staging.js` — staged content pools; REFERENCED from live `niko/placement.js:19` comment (pre-merge record) → keep.
- `CHANGELOG.md` — ⚠ DEPRECATED as a live log (stale since 2026-06-10, app ~30 versions ahead); per-session changes live in SESSION-HANDOFF + root `changes.html`; `tools/changelog-html.mjs` still reads it.

## ⚠ EXTERNAL AI-RESEARCH docs (NikoLearn_Strategy_drafts/, dropped 2026-07-12) — NOT owner decisions
9 new .docx (Strategic Intelligence Report v2 · AI-literacy „ნიკო ბუ" · Dev/Positioning/Monetization · Strategic Growth Roadmap · EdTech-ecosystem reverse-engineering · Georgia innovation-policy ×2 · Startup-ecosystem blueprint · Georgia ecosystem analysis). **Classification (strat-synth 2026-07-12, CKO-verified high-conf): EXTERNAL AI-GENERATED RESEARCH, single-source (ADB 2023), consulting scaffolds, NON-owner tag set, hallucinate product facts (hardware, Georgian LLM, teacher dashboards). NOT [USER DECISION]s.** They advocate a **domestic-B2B private-school / „AI-literacy" pivot** that CONTRADICTS the locked strategy on 7 axes: (1) customer diaspora-D2C→schools, (2) revenue D2C-sub→school-SaaS, (3) on-device-privacy→backend/cloud/LLM, (4) „don't-market-AI"→AI-central-identity, (5) parent-buyer→school-buyer, (6) re-opens GITA grant owner deprioritized, (7) different product (school AI-literacy tool vs kids' PWA). **Do NOT act on these as strategy or SSOT** — they are input to assess; the owner has NOT adopted them. If owner wants the B2B direction it is a NEW fork needing real validation (single-source). **3 nuggets worth keeping regardless of fork:** (a) GE tax levers = VEZ 0% VAT/profit · International Company Status 5% (needs 2yr op + 90% foreign rev); (b) local-competitor mechanics (Izrune 10-15 GEL/mo · kiosk/SMS payment for unbanked parents · „Care Day" retention loop · printable diplomas); (c) B2G-displacement case studies (SchoolBook killed by Ministry) hardening the locked commercial-independence instinct.

## Strategy identity layer (outside docs/ — now wired into this map)
`../NikoLearn_Strategy_drafts/`: `NikoLearn_Strategy_v1.5.docx` („FINAL" label is historical — superseded), `NikoLearn Strategy v1.6.docx`, `NikoLearn_Strategy_Constitution_v1.8.docx`, **`_v1.9.docx` (newest)**.
⚠ KNOWN CONTRADICTION (open owner fork): drafts' triad = *curious/confident/creative* + NSM "Curious Days per Month" vs locked `MISSION-SLOGAN.md` triad = *confident/creative/independent*. Also GE-vs-diaspora spearhead + ambition level = re-opened 2026-06-09 (see `OWNER_GRILLDOWN_BRIEF.md` header + `PRODUCT_IDEAS.md` strategic-exploration block). Do NOT treat any one draft as decided.

## External-audit intake (`../auditbyagents/`, git-UNTRACKED)
Adversarial audits by OTHER AI agents (Codex full set: scope/architecture/UX/risks/recommendations/next-steps + screenshots + probe scripts; Antigravity: setup status, audit pending). **Intake rule (lesson from s9 external-audit pass): fact-check every finding against LIVE code before acting — 3 of 4 top P1s in the last external batch were already fixed; verify-first prevented wrong re-fixes.** Findings that survive verification → `BUGFIX_TRACKER.md` NB rows.

## Archive (history — do not act on)
`archive/2026-06/`, `archive/2026-07/` (incl. `outdated-audit-reports/`). Moved there 2026-07-12 by CKO sweep:
`MVP.md` + `PILOT-SURVEY.md` (Class-Pilot era, 2026-05-31 — superseded framing), `QA_AND_FIXES_SPEC.md` (batch done 06-05), `SESSION-LOG-2026-07-02.md`, `TOPICS-2026-06-17.md`, `ANALYTICS-ABANDONMENT-2026-07-02.md` (data snapshot; superseded by `tools/weekly-report.mjs` output), `strategy-sessions/` (Lane-B 06-10 notes).

## Doc lifecycle convention (CKO rule, from 2026-07-12)
Every NEW doc starts with a one-line header: `**Status:** CANONICAL | ACTIVE | DRAFT (awaiting owner) | SUPERSEDED-by-X | ARCHIVE · **Updated:** YYYY-MM-DD`. Dated snapshots (SESSION-LOG-*, TOPICS-*, analytics reads) move to `archive/YYYY-MM/` once cold. When two docs claim the same axis, this index decides — update it in the same commit.
