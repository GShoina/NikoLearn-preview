# NikoLearn — Session Handoff (2026-05-31)

## ⛔ READ FIRST — the #1 next action
The owner has a **real, hand-designed** version of the app (`NikoLearn Phase 1.html`) in a
**claude.ai/design** artifact. It was **never on disk or in any repo** — so this session built the
app **from scratch off `docs/HANDOFF.md` (a text spec)**. The owner found that rebuild visually
**worse** than his design. **DO NOT rebuild from scratch again.**

**Next action:** the owner will drop his real `NikoLearn Phase 1.html` into
`C:\Users\gela.shonia\Downloads\` (the claude.ai link is auth-gated → 403, cannot fetch it).
When it arrives:
1. Use **his design as the visual/structural BASE — do not degrade his visuals.**
2. Layer on ONLY the functional improvements clarified this session (list below).
3. Re-deploy. Keep the visuals his; add our function.

If the file isn't there yet, ask for it (or paste / Google Drive). Do not proceed without it.

## Operating agreement (authoritative: `CLAUDE.md` in repo root)
- Standalone NikoLearn session — do NOT load Bivision agent identities.
- Owner is **non-technical**: don't hand back technical decisions — make the best-practice call,
  explain in **business language**, execute. No "yes/yes" pauses. Run `--dangerously-skip-permissions`.
- **Challenge** the owner on design/function. Reserve questions for genuine business/money/privacy forks
  (with a recommendation + default).
- Self-test every change (Playwright on the live/local URL). Backup/commit before risky changes.
- Match the owner's language (Georgian).

## Launch
- Short command **`NikoLearn`** (PowerShell profile function) → cd to NikoLand → `claude --dangerously-skip-permissions`.

## What exists right now
- **Repo:** github.com/GShoina/NikoLearn (public, for Pages). **Live:** https://gshoina.github.io/NikoLearn/
- **Local root:** `C:\Users\gela.shonia\Documents\NGT 2020-07\AI_Projects\NikoLand` (13 commits, 2026-05-31).
- **Architecture (this session's build):** `index.html` + `niko/`: data, core, tutor, audio, screens,
  games, alpha, owl, parent (BOOT last). Vanilla JS, no build. localStorage key `nikolearn_p2`.
  PWA: `manifest.json` + `sw.js` (cache **v11** — bump on every asset change or returning users get stale code).
- **Test loop:** `python -m http.server 8765` in NikoLand → Playwright. SW caches aggressively →
  in tests, unregister SW + clear caches + reload to see fresh code.

## Functional improvements implemented this session (to carry onto his design)
reader/non-reader toggle (not age-only) · day-streak vs in-a-row combo (separate) · English words (6
cats/30) · everyday **phrases** (6 groups/24) · graded **math** (±20/±100/×÷ adaptive) · **alphabet**
ka33/en26 (learn+quiz) · **owl "ბუ"** hint on wrong answers · **"📣 მაჩვენე მშობელს"** celebration ·
**break reminder** (~15min) · **parent dashboard** (math gate + plain-language insight + export +
trust line) · **landing/hero + simple account** (user+pass, no verification) · PWA offline/install +
persistent storage. Docs: `MVP.md`, `PARENT-GUIDE.md`, `PILOT-SURVEY.md`, `HANDOFF.md`.

## Open decisions (owner)
1. **Design base** — provide his `NikoLearn Phase 1.html` (BLOCKER above).
2. **Georgian audio** — code ready (`AUDIO_MANIFEST` + speak() guard). Pick: (a) Google ka-GE TTS
   (free, fast) or (b) record ~55 clips himself (warmer). ~half day, $0, offline-bundled.
   Impact: huge for pre-readers (Georgian is silent now). Don't read Georgian with the English voice.
3. **Consented anonymous quant pipe** for pilot insight — deferred unless he wants hard numbers.
4. **Pilot** — 20-25 classmates; shared device (parent phone / class tablets), qual-first (survey + interviews).

## Background processes (this session) — stop on cleanup
- `python -m http.server 8765` (local test server), and a keep-awake PowerShell loop. Safe to kill.
