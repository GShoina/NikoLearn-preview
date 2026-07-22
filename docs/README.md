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
| **Owner IDEA intake ledger (SSOT)** | `PRODUCT_IDEAS.md` §PI INTAKE LEDGER | NEW 2026-07-15, owner-triggered („only my bugs get tracked, not my ideas" — confirmed true). The idea twin of `BUGFIX_TRACKER.md`: `PI-<n>` row + owner's own words + status, logged BEFORE analysis, id echoed back. Rule = `CLAUDE.md` §16 |
| Product / strategy backlog (the idea MINE) | `PRODUCT_IDEAS.md` (prose below the ledger) | living; contains the strategy chronology 06-05→06-09 (re-opened forks). A mine, not a ledger — the index above is the ledger |
| Owner strategic intent (verbatim) | `OWNER_GRILLDOWN_BRIEF.md` | never compress; both audiences, skill-based, Version A/B demand |
| Mission slogan | `MISSION-SLOGAN.md` | locked triad: თავდაჯერებული/შემოქმედებითი/დამოუკიდებელი |
| Bugs / systemic fixes | `BUGFIX_TRACKER.md` | NB intake ledger on top; next id in Legend |
| **UX/UI audit 2026-07-15 verdicts (SSOT)** | **`AUDIT-2026-07-15-VERDICTS.md`** | NEW 2026-07-15. Per-finding verdict for all 29 Codex UX/UI adversarial findings + coverage ledger + runtime debt. The audit is static-source-only, so each finding is a HYPOTHESIS until a row here says otherwise with a named check method. **Disproved findings STAY with their disproof** (ჩანაცვლება ≠ წაშლა) — deleting one means the same suspicion is re-verified from zero next time. Survivors → NB rows in `BUGFIX_TRACKER.md`. |
| **Roadmap: what we do next + what fell out** | **`PRODUCT_ROADMAP.md`** | **PO SSOT (owner-set 2026-07-15).** NOW/NEXT/LATER + a permanent DROPPED ledger. Two rules it enforces: superseded = new+old together (never deletion) · nothing falls out silently. Maintained every session; supersedes nothing — it INDEXES the plan cluster below. |
| Active plan (business reasoning) | `V2-ACTION-PLAN.md` | per owner decision 2026-07-05; `ACTION-PLAN-2026-07-02.md` = FAZA-0 scope only. Sequencing now lives in `PRODUCT_ROADMAP.md` |

## Standards (one canonical per axis — scope fences)
| Axis | Canonical | Companions |
|---|---|---|
| Georgian copy (gates) | `GEORGIAN_COPY_STANDARD.md` | `.claude/skills/georgian-copy` points here; Gemini KA-QA = CLAUDE.md §6f |
| Research/audit/recommendation quality (gates) | `RESEARCH_QUALITY_STANDARD.md` | `.claude/skills/research-quality` points here; 8 gates Q1-Q8, Q2 blocking, loop წესი §12; Anthropic-aligned; v1 2026-07-17 |
| Kids' visual/image quality (gates) | `.claude/skills/kid-visual-standard` (self-contained SSOT) | NEW 2026-07-20 (GI-42/PI-98, GI-46/PI-99), **v1.2** (GI-50 upgrade). 12 criteria + 2 hard-fail rules: **Rule zero-A MASCOT LOCK** (never redraw ბუ; reuse canonical `assets/logo.svg` / `owl-amber-master.png` / `owl.js`) · **Rule zero-B RECOGNIZABILITY GATE** (blind-name test <2s) · generate-vs-draw method rule (hero imagery = generated/style-locked, not flat hand-SVG). Plus content fit · dev stage 4-5/6-8 · WCAG AA · never-colour-alone · motion restraint · anti-slop; loop-წესი ≥8 each; §6c + mascot-lock + blind-name + squint + contrast checks |
| Feature build DoD + provenance record + min content volume | `.claude/skills/build-provenance` (self-contained SSOT) | NEW 2026-07-20 (GI-42/46/47), **v1.1** (content-volume standard added per owner batch). Skill-first (declare skills+gates BEFORE building), **Step 0 minimum content volume** (per-type floors: quiz ≥8, reading ≥6, words ≥10, game ≥3, story ≥3 — a stub is not a feature), 8-gate minimum bar (gate 0 = volume), standard owner-facing footer, roadmap provenance row. Answers "which standard/skill/gates/red-team + does it ship enough to be real" |
| Video-tale production pipeline (W3) | `.claude/skills/video-tale-pipeline` (self-contained SSOT) | NEW 2026-07-20 (GI-44). 7-step gated pipeline; Gemini gate on ALL texts; owner previews FINAL video (§13 gate-4); no Georgian TTS; audio verified silently while owner works. **Pilot working doc: `W3_video-tale_pilot.md`** (template #2 „რატომ, ბუბუ?" script + storyboard, loop-წესი self-passed, PENDING Gemini gate). Free HTML-frames path validated vs paid (awesome-ai-pulse-georgia analysis) |
| Copy readability (ALL user-facing text) | `COPY_READABILITY_STANDARD.md` | newest (2026-07-03) |
| Child-facing typography/legibility | `READABILITY_STANDARD.md` | age-band rubric also in `DESIGN_TONE_READABILITY_STANDARDS.md` §C (merge candidate) |
| Design tone / art direction | `DESIGN_TONE_READABILITY_STANDARDS.md` | from 8-dim audit 2026-06-27 |
| Voice RECIPE (how to generate TTS) | `VOICE_STANDARD.md` | 2026-06-12 |
| Voice QUALITY (how to judge audio) | `VOICE_QUALITY_STANDARD.md` | + runnable `tools/voice-eval.mjs`; verdict 2026-07-11: EkaNeural passes |
| Voice IDENTITY (does a clip match our ONE voice) | `VOICE_CREATION_GATE.md` | NEW 2026-07-22 (PI-104, triggered by NB-89). Third leg of the voice trio: character→quality→identity. §1 canonical profile (EN = runtime Web Speech, rate 0.72/pitch 1.1; KA = clips), 5-step creation gate (A/B vs app + voice-eval), §4 owner fork = pin the EN identity (default: lock the §1 target) |
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
- `BTU-COLLAB-NOTE-DRAFT.md` — DRAFT outreach note to BTU (Georgian university publishing the ka-AI dataset). Assessed 2026-07-14: their CC BY-NC dataset is NOT a data-source for NikoLearn (wordform list ≠ copy-editor + adult register + license), but BTU = local collaboration/validation ally. **Send = owner-authority gate.** Full assessment: `output/2026-07-14-BTU ქართული AI-დატასეტის შეფასება by Niko.html`.
- `PLACEMENT_LAYER_B.staging.js` — staged content pools; REFERENCED from live `niko/placement.js:19` comment (pre-merge record) → keep.
- `CHANGELOG.md` — ⚠ DEPRECATED as a live log (stale since 2026-06-10, app ~30 versions ahead); per-session changes live in SESSION-HANDOFF + root `changes.html`; `tools/changelog-html.mjs` still reads it.

## ⚠ EXTERNAL AI-RESEARCH docs (NikoLearn_Strategy_drafts/, dropped 2026-07-12) — NOT owner decisions
9 new .docx (Strategic Intelligence Report v2 · AI-literacy „ნიკო ბუ" · Dev/Positioning/Monetization · Strategic Growth Roadmap · EdTech-ecosystem reverse-engineering · Georgia innovation-policy ×2 · Startup-ecosystem blueprint · Georgia ecosystem analysis). **Classification (strat-synth 2026-07-12, CKO-verified high-conf): EXTERNAL AI-GENERATED RESEARCH, single-source (ADB 2023), consulting scaffolds, NON-owner tag set, hallucinate product facts (hardware, Georgian LLM, teacher dashboards). NOT [USER DECISION]s.** They advocate a **domestic-B2B private-school / „AI-literacy" pivot** that CONTRADICTS the locked strategy on 7 axes: (1) customer diaspora-D2C→schools, (2) revenue D2C-sub→school-SaaS, (3) on-device-privacy→backend/cloud/LLM, (4) „don't-market-AI"→AI-central-identity, (5) parent-buyer→school-buyer, (6) re-opens GITA grant owner deprioritized, (7) different product (school AI-literacy tool vs kids' PWA). **Do NOT act on these as strategy or SSOT** — they are input to assess; the owner has NOT adopted them. If owner wants the B2B direction it is a NEW fork needing real validation (single-source). **3 nuggets worth keeping regardless of fork:** (a) GE tax levers = VEZ 0% VAT/profit · International Company Status 5% (needs 2yr op + 90% foreign rev); (b) local-competitor mechanics (Izrune 10-15 GEL/mo · kiosk/SMS payment for unbanked parents · „Care Day" retention loop · printable diplomas); (c) B2G-displacement case studies (SchoolBook killed by Ministry) hardening the locked commercial-independence instinct.

## Strategy identity layer (outside docs/ — now wired into this map)
`../NikoLearn_Strategy_drafts/`: `NikoLearn_Strategy_v1.5.docx` („FINAL" label is historical — superseded), `NikoLearn Strategy v1.6.docx`, `NikoLearn_Strategy_Constitution_v1.8.docx`, **`_v1.9.docx` (newest)**.
⚠ KNOWN CONTRADICTION (open owner fork): drafts' triad = *curious/confident/creative* + NSM "Curious Days per Month" vs locked `MISSION-SLOGAN.md` triad = *confident/creative/independent*. Also GE-vs-diaspora spearhead + ambition level = re-opened 2026-06-09 (see `OWNER_GRILLDOWN_BRIEF.md` header + `PRODUCT_IDEAS.md` strategic-exploration block). Do NOT treat any one draft as decided.

## In-repo strategy corpus (`../01_NikoLearn_Strategy_drafts/`) — registered 2026-07-17 (NB-71: was invisible to this map)
Dated strategy/assessment HTMLs authored in Niko sessions. Incl. the **Marble corpus (5 docs, 2026-07-13/14)**: Curriculum შეფასება (~88% — learn the structure, author ALL Georgian content ourselves) · დიზაინ-გააზრება (KEY: NikoLearn's engine is ALREADY adaptive — mastery ≥0.8 + streak + Leitner in `placement.js`; the missing piece is the fine-grained MAP) · v2 Executive (~80% value @ ~10% risk; product reorientation = owner GO) · deep adversarial audit (Marble's engine/child-models deliberately closed; $25M funding [TO VALIDATE]) · learnings გეგმა-შესრულება (`content/graph/` v0 BUILT 07-14; probabilistic mastery engine + live graph-routing DEFERRED = owner forks). **Rule (NB-71): any new analysis of a named subject sweeps this folder first — prior verdicts are built on or explicitly superseded, never silently re-derived.**

## Twin max-effort audits (`../100_Final_Docs/03_AUDIT_2026-07-17/`) — registered 2026-07-17
`A_UIUX_AUDIT_KA.md` (UI/UX + 2026-07-16 mobile/learning-app benchmark, FINAL, 30 screenshots in `shots/`) + `B_LEARNING_ENGINE_AUDIT_KA.md` (learning-engine + global-practice benchmark incl. Marble, FINAL, + team-lead reconciliation addendum vs the internal Marble corpus). **4 lead-verified DEFECTs → `BUGFIX_TRACKER.md` NB-72..75 (OPEN, fix wave after owner preview verdict); every PROPOSAL stays in the audit files pending the owner's NB-65 TYPE-gate answers — none acted on autonomously.** Owner brief: `output/2026-07-17-დიზაინის და ენჯინის აუდიტი by Niko.html`.

## External-audit intake (`../auditbyagents/`, git-UNTRACKED)
Adversarial audits by OTHER AI agents (Codex full set: scope/architecture/UX/risks/recommendations/next-steps + screenshots + probe scripts; Antigravity: setup status, audit pending). **Intake rule (lesson from s9 external-audit pass): fact-check every finding against LIVE code before acting — 3 of 4 top P1s in the last external batch were already fixed; verify-first prevented wrong re-fixes.** Findings that survive verification → `BUGFIX_TRACKER.md` NB rows.

## Archive (history — do not act on)
`archive/2026-06/`, `archive/2026-07/` (incl. `outdated-audit-reports/`). Moved there 2026-07-12 by CKO sweep:
`MVP.md` + `PILOT-SURVEY.md` (Class-Pilot era, 2026-05-31 — superseded framing), `QA_AND_FIXES_SPEC.md` (batch done 06-05), `SESSION-LOG-2026-07-02.md`, `TOPICS-2026-06-17.md`, `ANALYTICS-ABANDONMENT-2026-07-02.md` (data snapshot; superseded by `tools/weekly-report.mjs` output), `strategy-sessions/` (Lane-B 06-10 notes).

## Doc lifecycle convention (CKO rule, from 2026-07-12)
Every NEW doc starts with a one-line header: `**Status:** CANONICAL | ACTIVE | DRAFT (awaiting owner) | SUPERSEDED-by-X | ARCHIVE · **Updated:** YYYY-MM-DD`. Dated snapshots (SESSION-LOG-*, TOPICS-*, analytics reads) move to `archive/YYYY-MM/` once cold. When two docs claim the same axis, this index decides — update it in the same commit.
