# NikoLearn — Session Handoff (2026-05-31)

## ▶ How to resume (LAUNCH BY NAME — never bare `claude` from home)
In a fresh PowerShell type **`NikoLearn`** OR **`NikoLand`** (both work; alias). Each one:
cd → `...\AI_Projects\NikoLand`, runs `claude --dangerously-skip-permissions`, loads this repo's
`CLAUDE.md` → which tells you to read THIS file first. If launched bare from home, the global
Bivision router hijacks with a stale Apr-8 note — that already happened once. Always use the names.

## ⛔ #1 ACTION — use the OWNER'S REAL DESIGN as the base (RESOLVED: files are here now)
The owner's real, polished project is in Downloads:
- `C:\Users\gela.shonia\Downloads\NIKO LEARN.zip`  ← full project (unzip this)
- `C:\Users\gela.shonia\Downloads\NikoLearn Phase 1.html` ← loose entry shell (same as in the zip)

**The zip is the source of truth.** It contains the owner's hand-built app, far richer than the
from-scratch rebuild now in this repo:
- entry `NikoLearn Phase 1.html` (~2.4KB shell) + `niko/`: `styles.css` **~42KB**, `data.js` ~20KB,
  `games.js` ~21KB, `screens.js` ~18KB, `parent.js` ~14KB, `tutor.js` ~12KB, `owl.js` ~10KB,
  `core.js` ~10KB, `tweaks.js` (in-design theme/AI panel), `alpha.js`, `audio.js`.
- also: `app.js` (original monolith), root `data.js`, `PHASE2_PROMPT.md` (intended kickoff),
  `PATCHES.md`, `MASTER_ACTION_PLAN.md`, `CLAUDE.md`, `STAGING_GIT_SETUP.md`, og/favicon assets.
  (The `Bivision *` / `BiHub*` / `bivision_real_*` files in the zip are unrelated — ignore.)

### Do this (do NOT rebuild from scratch — that was the mistake)
1. Unzip `NIKO LEARN.zip` to a temp folder; read `PHASE2_PROMPT.md` + `PATCHES.md` first.
2. Put the owner's REAL `NikoLearn Phase 1.html` + `niko/` (+ assets) into this repo as the app,
   **replacing the inferior from-scratch versions** here. His `styles.css`/modules are the design he
   spent real effort on — preserve them; do not overwrite with the 8KB rebuild.
3. Compare his app against the functional improvements we clarified (below) and layer in ONLY what's
   genuinely missing — without degrading his visuals.
4. Re-test (Playwright on local/live), commit, redeploy. Bump `sw.js` cache version.

## Operating agreement (authoritative: `CLAUDE.md` in repo root)
Standalone (no Bivision identity) · owner NON-technical → make the best-practice call, explain in
business language, execute, no "yes/yes" pauses, `--dangerously-skip-permissions` · CHALLENGE the
owner · self-test every change · reserve questions for genuine business/money/privacy forks (with a
recommendation) · Georgian language.

## What exists
- **Repo:** github.com/GShoina/NikoLearn (public). **Live:** https://gshoina.github.io/NikoLearn/
  — currently serving the FROM-SCRATCH rebuild (owner found it visually worse; replace with his design).
- **Local root:** `...\AI_Projects\NikoLand` (~14 commits, 2026-05-31). Vanilla JS, no build,
  localStorage `nikolearn_p2`, PWA `manifest.json`+`sw.js` (cache v11). SW caches hard → in tests
  unregister SW + clear caches + reload to see fresh code.

## Functional improvements clarified this session (layer onto his design if not already present)
reader/non-reader toggle (not age-only) · day-streak vs in-a-row combo (separate) · everyday English
**phrases** · graded **math** adaptive · **alphabet** ka/en learn+quiz · **owl "ბუ"** hint on wrong
answers · **"📣 მაჩვენე მშობელს"** celebration · **break reminder** (~15min) · **parent dashboard**
(math gate + plain-language insight + export + trust line) · frictionless entry (landing/hero +
simple username+password, NO verification) · PWA offline/install + persistent storage.
Pilot docs already in repo: `MVP.md`, `PARENT-GUIDE.md`, `PILOT-SURVEY.md`.
NOTE: his version likely already has most of these (tutor/owl/parent/tweaks/alpha present) — verify,
don't duplicate.

## Open decisions (owner)
1. **Georgian audio** — code path ready (`AUDIO_MANIFEST` + speak() guard, don't read Georgian with
   the English voice). Pick: Google ka-GE TTS (free/fast) OR record ~55 clips himself (warmer).
   Huge impact for pre-readers (Georgian is silent now). ~half day, $0, offline-bundled.
2. **Deploy** — gate already passed once; pushes auto-deploy to Pages. Verify on phone after changes.
3. **Pilot** — 20-25 classmates, shared device (parent phone / class tablets), qualitative-first
   (survey + interviews). Optional consented anonymous quant pipe later.

## Launchers (PowerShell profile, Windows PowerShell 5.1)
`NikoLearn` and `NikoLand` both → cd NikoLand + claude (skip-permissions). `claude` itself is
profile-wrapped to always pass `--dangerously-skip-permissions`. Background test processes from the
prior session were stopped.
