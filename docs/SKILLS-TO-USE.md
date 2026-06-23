# NikoLearn — Skills to use (marked, trigger-mapped)

Owner asked (2026-06-23) to mark the Claude Code skills we'll actually use soon + apply each at the
right moment. This is the PRIORITIZED, trigger-mapped shortlist — tied to NikoLearn's real bottlenecks
(activation #1, validate demand, the Kings build, Georgian QA), NOT a generic copy of the full inventory.
When a trigger below fires, invoke that skill.

## 🟢 NOW / every-build (use immediately + ongoing)
- **gemini** — cross-model QA. **Trigger: EVERY authored Georgian item** (new Kings strand content, copy)
  → §6f KA-QA. (Fixed 2026-06-23, see [[gemini-cli-fix]]; free tier = 5 req/min, space the calls.)
- **context-mode** (ctx-*) — token-saving sandbox. Already active this session; keep using for fetch/parse/heavy output.
- **agent-teams** (team-spawn / team-review / deep-research) + **gemini** — the refute-panel + cross-model
  adversary. **Trigger: any substantive owner challenge / design decision** (the owner-locked standing rule).
- **code-review** + **security-review** — **Trigger: before calling a build "done", and NOW for the Kings
  session's volume of new code.** security-review matters here = kids app + COPPA/privacy. (NEXT action.)
- **verify** / **run** — manual confirm a change works in the real app (already doing via Playwright).

## 🟡 NEXT (activation is the #1 problem — 67% drop)
- **cro** — diagnose/improve the activation funnel + key screens. Trigger: when reading the new funnel data.
- **onboarding** — the first-run / cold-start experience (already shipped a demo; this skill deepens it).
- **ab-testing** — when proposing an activation change, design it as a falsifiable test (first_win funnel is live).
- **customer-research** — **validate demand with ~5 real families** (the pre-mortem's strongest counsel:
  don't build more before validating). Trigger: before the next big content push.
- **analytics** — only if we add a 2nd analytics surface; our telemetry is custom (page_view/first_win). Low.

## 🟠 SOON (growth + polish, after activation works)
- **content-writer / copywriting / copy-editing** — landing + app copy. **Trigger now-ish: the landing.html
  "Kings" card still wrongly says "Cambridge YLE" → should be kings.ge olympiad (owner-gate, customer-facing).**
- **emil-design-eng** — UI polish pass on the new Kings screens.
- **marketing-psychology** — informs CRO/pricing framing.
- **image / video** — marketing assets, app graphics, founder-story PR (NODI playbook).
- **social / launch / referrals / community-marketing / co-marketing / directory-submissions** — distribution,
  once activation + a validated promise exist. **aso** only if/when App Store/Play (Phase 2; PWA now).

## 🔴 LATER / gated (do NOT pull forward)
- **pricing** — parked until real free→paid conversion data (red-team revised: free-first now).
- **paywalls / churn-prevention / emails / sms** — need real (paying) users first; none yet.
- **sales suite (16) / revops / sales-*** — B2B sales motion; NOT NikoLearn's model (B2C kids app). Skip.
- **ai-seo / seo-* / programmatic-seo / schema** — PWA isn't SEO-driven; the landing could use light SEO
  later, but product + activation come first. Low near-term.

**Immediate next-action skill:** run **security-review** + **code-review** on this session's Kings build
(privacy/COPPA + correctness) before declaring the strand work done.
