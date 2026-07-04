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
- **WELL-POSEDNESS / SOLVABILITY gate (MANDATORY for ANY quiz / test / puzzle / question content).** Verify each
  item is answerable from ONLY what the child sees on screen, with a SINGLE defensible answer and NO unstated /
  hidden rule and no required outside fact beyond the skill being taught. ANSWER-CORRECT ≠ WELL-POSED — check BOTH.
  (Trigger: 2026-06-27 — a Triangle puzzle passed "answer matches formula 300/300" yet was UNSOLVABLE because the
  rule `(top+bL)×bR` was never shown; a g6 "READING" section said "read the text" with no text; 2 finance items
  silently needed a month-length. "Is the answer right?" is the wrong-only question; also ask "can the child GET there?")
  **SOLVABLE IS NECESSARY BUT NOT SUFFICIENT (owner 2026-06-27):** the QUESTION must also be LOGICAL — a natural,
  sensible question a thoughtful teacher would really ask, NOT a contrived trick that merely happens to have a
  unique answer (e.g. "find the missing number in two sequences mashed together" is technically solvable once the
  threads are separable, but it's a gimmick, not a logical question — drop it). And the PATH to the answer must be
  logical reasoning, not rule-guessing. Three bars, all required: answer-correct + solvable-from-what's-shown + the
  question and its solution are genuinely LOGICAL.
- **The main agent re-verifies each finding against the real code before trusting or fixing it**
  (today this caught a genuine genMath `−` bug a fix would have shipped).

## 5. Fixing + shipping
- **BUG-CLASS SWEEP FIRST (MUST — CLAUDE.md §14):** every verified CRITICAL/HIGH/MEDIUM is a CLASS, not
  an instance. Before any fix closes, the team-lead names the class in pattern language, defines the
  full-repo search surface (all 4 modules + shared files, incl. zones outside the originating
  workstream), sweeps (RUN THE APP for UI/behaviour classes), and delivers the CLASS TABLE. Fix ALL
  instances this session; 2+ modules ⇒ consolidate to one shared source, don't patch copies. The class
  table goes in the report right after the findings table.
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

## 8. RUN-THE-APP VISUAL QA (MANDATORY dimension — owner-locked 2026-07-04)
**Why this exists:** the 2026-07-04 audit proved that a read-only fleet is BLIND to a whole class of bugs.
Every bug the owner found by hand that week (footer design mismatch, AI-fab covering tiles, over-stretched
font, incomplete KA↔EN switch, wrong "აბგ"/"English teacher" labels, a quiz that prints its own answer)
was a RENDERED / INTERACTION defect invisible to static code reading. Static review finds code + content +
CSS-number defects; it CANNOT find rendered-composition / interaction / live-i18n defects. Both classes are
required. A "static audit was clean" claim is INVALID until the visual QA below has also run.

**The pass (an agent that actually RUNS the app, not a reviewer that reads it):**
1. Launch the app HEADLESS (harness = §6 recipe: chromium-headless-shell, `speechSynthesis.speak` neutered,
   local static server on the repo, `?app=1&notrack=1`).
2. Drive EVERY subject and EVERY mode: math, counting, ka-alpha (letters + reading/build/spell), english
   (vocab + listen/speak/yesno/story), kings-eng, kings-math, talk, placement/diagnostic. Reach a real
   round in each (globals: `openMenu(subj)`, `talkDeck`, `alphaQuiz(subj)`, `startShead`, `goHome`, etc.).
3. Do it at **320 / 360 / 390** px AND in **both KA and EN** (toggle the language, don't just read one).
4. **Open the tutor in each subject** and read its label + first message (catch wrong-subject label /
   "English teacher" on a KA task / un-voiced kings-math).
5. Screenshot every state to `output/visual-qa/<YYYY-MM-DD>/` and **LOOK at the images** (§6c — a visual
   check is not done until the render is seen). Assert programmatically + visually:
   - horizontal overflow / clipped tiles / content off-screen
   - tap targets < 44px; the AI-fab (`#garea`/`.ai-fab`) overlapping any control
   - text contrast < 4.5:1 on real rendered pixels
   - **well-posedness:** a quiz whose stem prints its own answer (answer glyph/word visible in the question)
   - **i18n leak:** any Georgian string still showing while UILANG=en (and vice-versa)
   - **label/icon correctness:** the tutor label matches the subject; a tile's icon matches its topic
     (e.g. the "აბგ" alphabet glyph must appear ONLY on the letters subject).
6. Report regressions vs the previous week's screenshots + a findings table (§3 format). Fixes still go
   Preview → owner GO → Live (§5, §7b).

**Cadence: run WEEKLY** (owner-locked) via the scheduled job, and additionally as the final gate of any
customer-facing UI change. Never ship a "clean" verdict on visual/interaction/i18n without this pass.

---
*Today's run that set this bar: 5 parallel reviewers (2× code, security, UI, UX) → adversarial verify
→ main re-verified each finding → fixes on a branch → preview → owner GO → live. Keep at least this depth.
The 2026-07-04 run added §8 after the owner's manual testing exposed the read-only blind spot.*
