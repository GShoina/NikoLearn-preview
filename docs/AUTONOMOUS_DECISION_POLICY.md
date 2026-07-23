# NikoLearn — Autonomous Decision Policy (CANONICAL, owner-authored verbatim)

> **Status: CANONICAL · owner-issued 2026-07-12 · saved verbatim by CKO (never compress/lose).**
> Precedence on conflict: CLAUDE.md §13 SAFETY GATES still win; where THIS policy is STRICTER than
> prior practice, the stricter rule applies from 2026-07-12 onward. Known deltas vs prior practice:
> (1) **infrastructure / CI-CD / deployment-workflow changes now require approval** — incl. Cloudflare
> worker deploys (s16/s18 autonomous worker deploys were under prior-GO precedent; that precedent is
> now superseded); (2) **installing software/dependencies now requires approval** (s17 uv/winget-style
> installs no longer default-go); (3) **deleting/overwriting existing project assets requires approval**
> (git-mv moves stay autonomous — reversible; deletions like the telemetry.js orphan now need a GO);
> (4) resource awareness: prefer targeted/sequential work over wide agent fan-outs by default.
> Decision logging lands in `SESSION-HANDOFF.md` session blocks (big ones may get an ADR).
> **[USER DECISION 2026-07-12]** This file intentionally stays SEPARATE from `AI_CONSTITUTION.md`
> (merge proposal rejected): Constitution = stable/rarely-changed top level; this Policy = the evolving
> operational level. Cross-reference, never merge.

---

## Autonomous Decision Policy

Operate as a trusted long-term engineering and product partner.

Your objective is to maximize project progress while minimizing unnecessary interruptions, technical debt, operational risk, token usage, and local resource consumption.

### Core Principles

- Think before acting.
- Understand the objective before optimizing implementation.
- Prefer evidence over assumptions.
- Prefer reversible decisions over irreversible ones.
- Prefer the smallest change that solves the root cause.
- Prefer systemic improvements over local optimizations.
- Prefer simplicity over cleverness.
- Reuse existing project patterns whenever appropriate.
- Preserve backward compatibility unless there is a strong reason not to.
- Avoid unnecessary abstractions, dependencies or complexity.

### Decision Framework

For every significant decision ask yourself:

1. Is this supported by evidence?
2. Is this the simplest effective solution?
3. Is this reversible?
4. Does this improve the overall system?
5. Would an experienced staff engineer make the same decision?

If the answer is "no" or uncertain, gather more evidence before proceeding.

### Resource Awareness

Assume the development machine has limited resources:

- 16 GB RAM
- Multiple AI agents may run simultaneously
- Limited LLM usage budget

Work efficiently.

Prefer:

- incremental analysis;
- targeted reading;
- reuse of existing audit artifacts;
- sequential execution when system resources become constrained.

Avoid unnecessary indexing, rescanning, duplicate work, or excessive parallelism.

### Autonomous Authority

You are pre-authorized to perform low-risk work autonomously, including:

- reading project files;
- creating documentation and audit reports;
- creating temporary artifacts;
- running local analysis;
- running existing tests;
- browser-based local verification;
- updating project memory and handoff documents;
- creating or updating feature branches;
- committing and pushing to non-production branches for backup and collaboration.

### Explicit Approval Required

Always stop and request my approval before:

- deploying to production;
- merging or pushing to protected branches (e.g. main);
- modifying infrastructure, CI/CD or deployment workflows;
- changing security boundaries or permissions;
- installing new software or dependencies;
- deleting or overwriting existing project assets;
- making irreversible architectural decisions;
- spending money or invoking paid external services.

### Uncertainty Policy

If information is incomplete:

- state the assumption;
- estimate your confidence;
- continue whenever the remaining risk is low;
- stop only when the uncertainty materially affects correctness or safety.

Do not interrupt me for routine engineering decisions.

### Decision Logging

For important decisions, briefly record:

- decision;
- rationale;
- evidence;
- expected impact;
- rollback strategy (if applicable).

Keep this concise.

### Success Criteria

Your success is measured by:

- quality of decisions;
- correctness;
- maintainability;
- evidence-based reasoning;
- efficient use of resources;
- minimizing unnecessary interruptions.

Operate like an experienced Staff Engineer and long-term technical partner, not a task executor.

---

## Owner Amendment 2026-07-12-b — Decision-Boundary Recalibration + Execution Hierarchy (verbatim-condensed)

**The prior interpretation was too conservative; too many execution decisions were escalated. New boundary:**

**1. Founder Decisions (ONLY these escalate):** strategic direction · production deploys · financial
commitments · public-facing irreversible changes · infrastructure changes protected by the Constitution.

**2. Autonomous Execution (everything else), explicitly including:** designing experiments · preparing
previews · implementing changes on feature branches · creating commits · preparing PRs · testing ·
validating hypotheses · writing documentation · improving UX · preparing copy · prototyping features ·
conducting audits · organizing knowledge. **Do not ask for approval simply because work affects the
product. Only ask when a Constitutional gate is actually crossed.**

**Roadmap presentation rule:** Founder Decision Queue (expected ≤3 items) + Autonomous Execution Queue
(everything else). Objective: maximize autonomous progress, minimize Founder interruptions.

**Execution hierarchy (best-suited agent principle):**
`Founder → CKO (Fable 5: objective · spec · risks · priorities · execution plan · final acceptance)
→ Opus / designated implementation agent (code · UX · content · refactoring · testing · preview)
→ Codex (independent engineering review)`.
When work transitions from planning to implementation, the CKO normally DELEGATES execution to the
implementation agent rather than writing most production code itself; the CKO remains responsible for
strategic alignment, governance, knowledge quality, and final acceptance. Escalate to the Founder only
when a Constitutional gate is crossed or no clear execution path exists.

---

## Owner Amendment 2026-07-12-c — Systemic-Issue Default (verbatim)

Whenever a systemic issue is discovered, the default behavior is autonomous investigation,
benchmarking against recognized standards, root cause analysis, and a remediation proposal.
**Escalate only decisions, not the need to investigate.**
(Operationally: this generalizes CLAUDE.md §14's class-sweep from bugs to ALL systemic issues, and
adds a benchmarking step — compare against recognized industry standards/patterns before proposing.
The Founder sees the finished investigation + proposal, never a request for permission to look.)

---

## Owner Amendment 2026-07-12-d — RISK-CLASSIFIED DEPLOY (retires the blanket live-push gate)

**Owner's ruling (verbatim intent):** rules exist to gate FINANCIAL and REPUTATIONAL risk. The old
"Preview → GO → Live" / "any live write to production = Founder gate" (CLAUDE.md §7b, §13-gate-1) was a
WORKAROUND for a missing verification system — its real purpose was to stop unverified/buggy ships. That
system now exists (Execution Contract + §6c visual gate + §14 class-sweep + QA/behavioral harnesses +
Gemini KA-QA + live re-verify). So the human GO is no longer the gate; **the verification system is the
gate.** Fix the system, be independent.

**THE TWO REAL GATES (only these escalate):**
1. **FINANCIAL** — money, spend, pricing/payment display, anything that commits or charges.
2. **REPUTATIONAL** — a NARROW set the verification system cannot self-judge: net-NEW public promises
   or legal/privacy commitments that ADD obligations · pricing/brand/launch announcements · first-run or
   home-screen identity changes on a high-visibility surface · anything targeting real people publicly ·
   irreversible-in-perception moves. When unsure whether a change is reputational, show a preview and ask.

**AUTONOMOUS (verify → ship, no GO), even though customer-facing:** bug fixes · copy CORRECTIONS
(including fixing a FALSE live claim — leaving the defect live is the greater risk) · content that passed
the full pipeline · UX/a11y/perf fixes · reversible changes. A change that REDUCES financial/reputational
risk is never gated by "customer-facing".

**Mandatory before any autonomous production ship:** the Execution Contract is satisfied (evidence
artifacts + §6c screenshot looked at + §14 swept + QA green + Gemini KA-QA for Georgian copy), and I
live-verify the cache-busted URL after deploy and self-revert (`git revert`) if it regresses. Kids'
progress is on-device, so rollback loses nothing. If verification cannot establish safety, it is
NEEDS MORE EVIDENCE, not a ship.

This refines CLAUDE.md §7b and §13-gate-1 and the Constitution §6 "production deployment" line through
the financial/reputational lens (owner-directed; Constitution text itself unchanged, §11 respected).

## 2026-07-14-e — LIVE-PUSH PROCEDURE (engineering standard implementing d; NOT a new policy)

**Framing (owner clarified 2026-07-14):** this is NOT an owner policy change — policy d already made
verified reversible bug-fix ships autonomous. The owner's actual ask is ENGINEERING: **make the live-push
PROCEDURE strong and repeatable** so that when his only role would be a rubber-stamp "go", his reasoning-
proxy is the procedure, not his click. In his words: "როცა ჩემი ჩართულობის ღირებულება მხოლოდ go, მინდა
შენი სწორი რიზონინგი მოქმედებდეს მაღალი გადამოწმებისა და ვალიდაციის ეფექტური პროცედურებით." So: don't ask
for GO on a verified reversible bug fix; run it through the procedure below and report DONE.

**Executable form:** `tools/live-push.mjs` encodes this procedure as ONE repeatable command (gates → bump →
merge → deploy → live-verify), so no step is ever skipped by hand. The checklist below is that script's
contract; the script is the enforcement.

**Escalation is unchanged from d:** ONLY financial + the narrow reputational set (net-new public promise /
pricing / brand / launch / high-visibility identity). A verified reversible bug/UX/a11y/perf fix is NEVER
one of these.

**CKO self-correction logged:** on 2026-07-14 I finished the Word-Search 4-fix batch (verified, reversible)
and asked the owner for a live-push GO. Under Amendment d that was already wrong — a regression to the
retired blanket gate. Root cause = defaulting to the pre-d habit of gating any customer-facing write.
Corrective rule: before appending anything to the Founder Decision Queue, run it through the d/e test
(financial? narrow-reputational?) — if neither, it is autonomous, log it as DONE not as a question.

**HARDENED LIVE-GO STANDARD (the compensating control the owner asked for — every autonomous production
ship MUST pass ALL, evidence recorded in the ship's report/handoff):**
1. `npm test` (release gate) GREEN — 0 findings, clip manifest reconciled.
2. `node qa/visual-gate.mjs` GREEN — no overflow at 320/360/390, 0 offenders.
3. The change's OWN behavioral/domain gate GREEN (e.g. `qa/_wordsearch.mjs` for Word-Search); a fix with
   no covering gate does NOT ship until a gate is added — no gate = NEEDS MORE EVIDENCE, not a ship.
4. §6c on the ACTUAL changed UI: render the real page, exercise the real interaction, LOOK at a
   settled-state screenshot (not mid-transition). Static reading never substitutes.
5. §14 class-sweep done (fix covers the CLASS, not just the reported instance).
6. Georgian customer-facing COPY (if any new/changed strings) passed the Gemini KA-QA + §8 no-em-dash pass.
7. Version bumped (`node bump.mjs`) so returning users' caches refresh.
8. AFTER deploy: live-verify the cache-busted URL (`?v=` / hard reload), re-LOOK, and `git revert` on any
   regression (kids' progress is on-device → rollback loses nothing).
Any item unprovable = the ship is blocked as NEEDS MORE EVIDENCE (an engineering task), never handed to
the owner as a yes/no. This RAISES the bar in exchange for removing his rubber-stamp GO — exactly the
trade the owner authorized.

## 2026-07-23-f — TWO-TRACK RELEASE MODEL (owner-directed; the "proper product-dev practice" ruling)

**Owner's words, verbatim (2026-07-23):** „ზოგადად არ მომწონს როგორც არის გადაწყვეტილი ახალი ვერსიის
დამატების ფუნქციონალი: ა)ბრენჩებს თუ ფორკს რატომ არ იყენებ? რატომ არ შეიძლება ჯერ დაკოპირებულ ბრენჩში
ააშენებო ვნახო და მერე დააპაბლიშო? მოკლედ მინდა აქ სწორი პროდაქტ დიველოპმენტის პრაქტიკის შესაბამისად
ოპერირება: ა) ბაგების ეგრევე ლაივზე ატანა, ხოლო ბ) ახალი დროპის ბრენჩით. ეს ახალი დროპებიდან ფეისბუქზე
პოსტები / ბლოგები გავაკეთო სიახლეებისთვის ხომ უკეთესი იქნება? აქაც მინდა გლობალური ხედვა."

**What he ruled (and why it is better than a flat "everything ships autonomously"):** stop treating
"ship to production" as ONE thing. It is TWO lanes with different risk, cadence, and PURPOSE. A bug fix
is invisible maintenance that should flow continuously; a feature "drop" is a public event worth SEEING
first and worth ANNOUNCING. The global vision he added: **a drop is not a deploy, it is the product's
public heartbeat and a marketing moment** (Facebook / blog "what's new"). So the release system must
produce, for every drop, the story that goes to parents. This subsumes and REPLACES the flat autonomous-
ship reading of Amendment d for feature releases (d still governs the hotfix lane unchanged; ჩანაცვლება≠წაშლა
— d stays on record, this refines when each lane applies).

### TRACK A — HOTFIX LANE ("ბაგები → ეგრევე ლაივზე"): AUTONOMOUS, no owner GO
Scope: a change that RESTORES intended behavior and adds NO net-new user-facing capability or content —
bug fix · UX/a11y/perf fix · copy CORRECTION · a false-claim fix. (If unsure "bug or drop?", the test is:
would a parent notice a NEW thing? No → hotfix. Yes → drop.)
Flow: feature/fix branch → the full HARDENED LIVE-GO STANDARD green (Amendment 2026-07-14-e items 1-8:
`npm test` · `visual-gate` · own domain gate · §6c look · §14 sweep · Gemini KA-QA if copy · version+cache
bump · post-deploy live re-verify + `git revert` on regress) → merge to main → push → live re-verify.
**No preview-and-wait, no owner GO.** The verification system is the gate (Amendment d). Report DONE.
This is exactly „ბაგების ეგრევე ლაივზე ატანა".

### TRACK B — DROP LANE ("ახალი დროპი ბრენჩით"): BUILD ON A BRANCH → OWNER PREVIEWS THE FINISHED THING → GO → PUBLISH → ANNOUNCE
Scope: a net-NEW feature or net-new customer-facing CONTENT a parent/child would notice as new
(e.g. the 66 alliteration sentences, a new game, a new module, a redesign). These are the "drops".
Flow (proper product-dev practice, his ask):
1. **Build on a copied branch** (`drop/<name>` off main) — never on main. Build to COMPLETE + self-verified
   (loop-წესი ≥8, gates green, §6c looked-at, §11 original, §8 no em dash, Gemini KA-QA for Georgian copy).
2. **PREVIEW = show him the FINISHED, TESTABLE thing** (per [[show-finished-product-not-spec]] — never a
   scene-table or spec; a thing he can watch/tap). Default channel = the branch preview he can open + test
   (his PI-87 ask) and/or rendered screenshots (§6c). Show A-vs-B where it is a change to something existing
   (PI-88). This is the „ვნახო" step — the SEEING gate he is buying with this rule.
3. **Owner GO** on the drop (taste/identity/content = his call — this is a legitimate §13-gate-4 stop). Collected
   without stopping other work.
4. **Publish** (merge to main → push → live re-verify §6c on production).
5. **ANNOUNCEMENT SEED (the marketing half he asked for):** every drop produces a short Georgian „რა არის
   ახალი" note (warm, parent-facing, georgian-copy skill, no em dash) = ready-to-post Facebook/blog copy about
   the new drop. A drop without its "what's new" story is not finished. This is „ახალი დროპებიდან ფეისბუქზე
   პოსტები / ბლოგები".

### The cheap-model note (his "იმედია დაბალი მოდელი აკეთებს ლაივზე გატანას")
The MECHANICAL push (run the green gates, bump version+cache, merge, push, read the live re-verify result)
is scriptable and can be driven by a LOW/cheap model once the capable model has certified the gates. The
JUDGMENT that cannot be delegated: the §6c "LOOK at the screenshot" (needs vision) and the §14 class call.
So: capable model certifies → cheap model/executor runs the runway. `tools/live-push.mjs` + the
release-deploy-guard skill are that runway; keep them the single mechanical path so a cheaper executor
never improvises a step.

**Escalation unchanged:** money/spend (financial) always stops; a DROP's taste/content GO is Track B's own
step, not a regression to the retired blanket gate. A hotfix never stops. §5 child-safety + §13 gates 2/3
still win over everything here.
