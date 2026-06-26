# NikoLearn — Agent-Team Standard (owner-locked 2026-06-26)

**This is the MINIMUM bar for every multi-agent (agent-team) run on NikoLearn.** The owner saw the
2026-06-26 deep audit and said: "run it exactly like this, always." Never run a shallower team than this.

---

## 0. When to use a team
Any audit / review / migration / broad investigation that a single pass would skim. Decompose into
parallel workstreams with FILE-OWNERSHIP boundaries, then run a verification pass, then act.

## 1. Decomposition (team lead)
- Split the work into independent workstreams (e.g. Code&Bug, Security, UI, UX) with explicit
  FILE OWNERSHIP so reviewers don't collide and coverage has no gaps.
- Spawn reviewers in parallel (one message, multiple agents). Read-only: reviewers never edit/deploy.

## 2. Anti-shallow rules (NON-NEGOTIABLE — a reviewer that skips these is rejected)
- **Read every owned file IN FULL.** Record `read in full: YES/NO` per file. No concluding from
  filenames, grep snippets, or excerpts.
- **COVERAGE LEDGER (required deliverable):** every file / route / screen examined + exactly what was
  checked in each. "looks fine" with no evidence of looking = rejected.
- **ABSENCE ≠ CLEAN:** zero findings in an area must still show the specific checks performed there.
- **RUN THE APP** for UI/UX/bugs: load each screen in a browser (local + live), interact, and base
  findings on real behaviour + screenshots, not static reading.
- **DISCRIMINATOR TEST:** pick 2 owned files; for each, describe a bug that WOULD exist if a line were
  wrong, then state whether it is actually present (file:line). Proves real reading, not skimming.
- A workstream that finishes suspiciously fast must re-examine before reporting.

## 3. Evidence format (every finding)
`ID | workstream | severity CRITICAL/HIGH/MEDIUM/LOW | file:line (or screen+element) | what's wrong
(1-2 lines, factual) | reproduction (exact steps) | proposed fix (concrete)`

## 4. Verification pass (BEFORE the final report — non-negotiable)
- A DIFFERENT agent adversarially verifies each CRITICAL/HIGH finding (tries to REFUTE it). Drop or
  downgrade anything that can't survive a refute. Mark each verified / refuted.
- Spot-check 3 "clean" areas independently.
- **The main agent re-verifies each finding against the real code before trusting or fixing it**
  (today this caught a genuine genMath `−` bug a fix would have shipped).

## 5. Fixing + shipping
- Fix CRITICAL/HIGH (and confirmed, low-risk MEDIUM) on a BRANCH; re-run the app after each fix and
  show before/after. List the rest as recommendations.
- **Preview → owner GO → Live** (CLAUDE.md §7b): nothing customer-facing reaches nikolearn.com until
  the owner has seen it (screenshots and/or the preview site) and said "go".
- For customer-facing COPY/content: run it through **Gemini** (cross-model challenge, §6f) AND owner
  validation before shipping.
- Version bump in BOTH `APP_VERSION` (screens.js) and `CACHE` (sw.js) or returning PWA users miss it.
- After deploy: live-verify (fresh context / cache-bypass).

## 6. Headless verify recipe (proven, owner-at-work safe — silent, no window, no audio)
Node CJS via Bash:
- playwright: `C:\Users\gela.shonia\AppData\Local\npm-cache\_npx\9833c18b2d85bc59\node_modules\playwright`
- chromium shell: `…\ms-playwright\chromium_headless_shell-1223\chrome-headless-shell-win64\chrome-headless-shell.exe`
- `chromium.launch({headless:true, executablePath:SHELL})`; `newContext({userAgent, viewport, deviceScaleFactor:2})`;
  `addInitScript` neutering `speechSynthesis.speak`.
- Spoof UA for FB/IG in-app (`[FBAN/FB4A…]` / `[FBAN/FBIOS…]`), iOS Safari, Android, desktop as needed.
- Screenshot to an allowed root and **Read (look at) the image** — a visual change is not "done" until
  the rendered result is seen (§6c). Drive REAL interactions (create profile, complete a round, etc.).
- Local current-code server for verifying a branch: a tiny static node server on a fixed port serving
  the repo root (GitHub Pages serves stale sub-scripts, so verify the branch locally or via the
  preview site, not the cached live SW).

## 7. Reporting
Single structured report: coverage ledger · findings table (grouped, sorted by severity, with evidence)
· verification results (which survived refute) · fixes applied (branch + before/after) · top prioritized
actions · honest limitations (what could NOT be verified and why). Label claims FACT / HYPOTHESIS /
ASSUMPTION / TO-VALIDATE; never present coherence as verified fact.

---
*Today's run that set this bar: 5 parallel reviewers (2× code, security, UI, UX) → adversarial verify
→ main re-verified each finding → fixes on a branch → preview → owner GO → live. Keep at least this depth.*
