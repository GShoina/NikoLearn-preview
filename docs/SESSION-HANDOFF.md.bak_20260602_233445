# NikoLearn — Session Handoff
**Updated: 2026-06-01 19:02 | Resume pointer: owner's v4 landing is LIVE; waiting on owner's phone-test feedback.**

## ▶ How to resume (LAUNCH BY NAME — never bare `claude` from home)
Fresh PowerShell → type **`NikoLearn`** or **`NikoLand`** (alias) → cd `...\AI_Projects\NikoLand` +
`claude --dangerously-skip-permissions`, loads repo `CLAUDE.md` → which sends you to read THIS file first.
Standalone project — do NOT load any Bivision agent identity.

## ✅ Completed this session (2026-06-01) — all PUSHED + LIVE-verified
Live: **https://gshoina.github.io/NikoLearn/** · Repo: github.com/GShoina/NikoLearn · branch `main` @ `17f23a0`.

1. **Owner's 6-point prompt** (commit `11da09c`):
   - Default theme **calm → sunlit** (warmer, richer for a kids app) [#4]
   - Results screen now carries bottom-nav → **Home is one tap** [#5]
   - (login hero added here, later superseded by the v4 landing)
2. **🔴 Fixed broken live Georgian audio** (commit `d28fd70`): `audio.js` prepends `BASE='niko/audio/'`,
   but the committed manifest ALSO held the full path → doubled `niko/audio/niko/audio/clip_*.mp3` = 404
   (kids heard nothing). Manifest now holds bare `clip_*.mp3`. Verified clip 200 live.
3. **Real landing page** built (commit `4b30c04`) — THEN superseded by owner's v4 (below). Its `landing()`
   JS body + `.lp-*` CSS are now DEAD CODE (after an early `return` in `landing()`); harmless, optional cleanup.
4. **Integrated owner's v4 standalone landing** (commit `17f23a0`, deployed):
   - Source: `C:\Users\gela.shonia\Downloads\NikoLearn Landing v4 (standalone).html` → copied to repo
     **`landing.html`** (owner design UNTOUCHED; it is a React+in-browser-Babel single-file bundle, ~1.5MB).
   - 5 CTAs rewired `../NikoLearn Phase 1.html` → **`index.html?app=1`**.
   - Routing in `niko/screens.js`: `boot()` → if not authed and no enter-flag → **redirect to `landing.html`**;
     `?app=1` or `sessionStorage.niko_enter` → `showLogin()`; `landing()` now **redirects to landing.html**;
     back-to-landing = **←** on login + **NikoLearn logo** on home.
   - **Mobile fix:** v4 had ~110px horizontal overflow from the word-pill ticker (`.track`) escaping `<html>`;
     static `<style>` got wiped by the bundle's `document.write`, so a **trailing runtime enforcer script**
     forces `html,body{overflow-x:clip!important}` (inline, repeated ~3s). Verified **0 overflow at 390px**.
   - `sw.js` cache **v15 → v16**, caches `landing.html`.

**Verified LIVE (mobile 390 viewport):** index → landing.html ✅ · 5 CTA „დაიწყე უფასოდ" ✅ ·
`?app=1` → login (#lg-pass) ✅ · back-to-landing ✅ · horizontal overflow **0** ✅.

Backup tags: `pre-mobile-design-fix-2026-05-31`, `pre-realdesign-swap-2026-05-31`, `pre-audio-deploy-2026-05-31`.

## ⚠️ Open / in flight
- **Owner (action):** test full flow on phone. IMPORTANT: old service worker caches the prior version —
  open in **Incognito/private** tab, or reload twice, to see v16.
- **Known-benign:** console favicon 404 on landing.html (cosmetic; landing doesn't link the favicon).
  A `dadMessages` TypeError only fires from an artificial test path (`results()` with no profile), NOT real users.
- **Optional cleanup (low priority):** remove dead `landing()` HTML body + unused `.lp-*` / `.hero-*` CSS in
  `niko/styles.css` + unused `enterApp()`; all harmless now.
- **Still pending from earlier:** class pilot prep (20-25 classmates, shared device) — `docs/MVP.md`,
  `PARENT-GUIDE.md`, `PILOT-SURVEY.md` already in repo.
- **Housekeeping:** a local preview server (`python -m http.server 8765`) was started this session; it is only
  on this PC and can be ignored/closed. The live site is the source of truth.

## ▶ Next action on resume (single first move)
Ask the owner for the phone-test result on **https://gshoina.github.io/NikoLearn/** (landing → CTA → login `12345` → app).
If good → optionally do the dead-code cleanup; then move to pilot prep. If something looks off → fix from the live diagnosis.

## Operating agreement (authoritative: repo `CLAUDE.md`)
Standalone (no Bivision identity) · owner NON-technical → make the best-practice call, explain in business
language, execute, no "yes/yes" pauses, `--dangerously-skip-permissions` · CHALLENGE the owner · self-test
every change · only the FIRST live customer-facing deploy is gated (already passed) — subsequent reversible
deploys are agent-owned · em dash forbidden in human-facing text · Georgian by default.
