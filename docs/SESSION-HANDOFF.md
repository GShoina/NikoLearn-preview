# NikoLearn — Session Handoff (2026-05-31)

## ▶ How to resume (LAUNCH BY NAME — never bare `claude` from home)
In a fresh PowerShell type **`NikoLearn`** OR **`NikoLand`** (both work; alias). Each one:
cd → `...\AI_Projects\NikoLand`, runs `claude --dangerously-skip-permissions`, loads this repo's
`CLAUDE.md` → which tells you to read THIS file first. If launched bare from home, the global
Bivision router hijacks with a stale Apr-8 note — that already happened once. Always use the names.

## ✅ #1 ACTION — DONE (2026-05-31): owner's REAL design is now the base, LIVE
Commit `1res4t8` — repo's from-scratch rebuild REPLACED by the owner's hand-built design from
`NIKO LEARN.zip`. `niko/styles.css` 6.8KB → **42.8KB**, all `niko/*.js` swapped to his richer
modules, `niko/tweaks.js` added, `index.html` = his entry shell + PWA (manifest + SW registration)
layered on, `sw.js` cache v11→v12. Verified locally (renders, login→welcome, 0 console errors) and
LIVE (`https://gshoina.github.io/NikoLearn/` serving styles 42883b + tweaks.js 200).
Rollback if needed: `git checkout pre-realdesign-swap-2026-05-31` (tag) or
`C:\Users\gela.shonia\Downloads\_niko_repo_backup_2026-05-31\`.

## ✅ #2 ACTION — DONE (2026-05-31): Georgian audio LIVE
Commit `af30d70`. Feature-gap audit found his design already has reader-toggle, day-streak, phrases,
adaptive math, ka+en alphabet, owl hints, show-parent, break-reminder, parent dashboard, frictionless
entry, persistent storage. The one real gap was Georgian audio (AUDIO_MANIFEST was empty, 0 clips).
Fixed: 234 edge-tts clips (`ka-GE-EkaNeural`, free, no account) under `niko/audio/`, mapped in
`niko/audio-manifest.js` (loaded before `niko/audio.js`, which already prefers a clip over TTS).
gTTS does NOT support ka; edge-tts does. Numbers 1-20 aliased to number-word clips. sw.js v13:
clips cache-on-first-play (offline after first hear). Verified live: manifest 200, clips 200.
Regenerate clips anytime: `python C:\Users\gela.shonia\Downloads\_niko_gen.py`.
Rollback: `git checkout pre-audio-deploy-2026-05-31`.

### ▶ NEXT ACTION: owner to test on phone (hard-refresh gshoina.github.io/NikoLearn, open alphabet,
tap "მისმინე" — should hear a Georgian voice now). Remaining minor gap from clarified list:
"in-a-row combo" as a SEPARATE counter from day-streak (low priority, his design tracks streak/
maxStreak already). Optional polish: regenerate praise/number clips with GiorgiNeural (male) if a
warmer voice is wanted, or owner records his own ~55 clips later (drop into niko/audio/, update manifest).

---

### (history) original #1 action — owner's real project in Downloads:
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
