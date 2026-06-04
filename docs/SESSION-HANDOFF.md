# NikoLearn — Session Handoff
**Updated: 2026-06-04 ~18:10 | Resume pointer: live at v2.7. QA: math content A batch 1 (comparison/skip/shapes) fully play-tested, no bugs (8-question playthroughs, wrong-answer recovery, replay, parent dashboard, age-gating young=shapes-only all pass). AUDIO NOTE: 234 recorded ka clips (niko/audio/, edge-tts) + manifest ARE deployed and DO play for praise ("ყოჩაღ"→clip_188.mp3, verified no-TTS); owner's "kochas" was a STALE pre-clip cache → fixed by revisiting (v42 cache bump). Added defensive praise() fallback: English praise if a word has no clip AND device lacks a ka voice (never mispronounce). NEXT (A batch 2): money (₾/თეთრი) + clock/time. Prior pointer: v2.6. Math content track "A" IN PROGRESS — batch 1 DONE & live (comparison >/<, skip-counting 5s/10s, shapes; new game modes in games.js: cmpRound/skipRound/shapeRound, SHAPES data in data.js, math-menu tiles in screens.js, owl hints in tutor.js, i18n labels, parent-dashboard labels). Shape option text renders per-UI-language (never collides with vocab content). NEXT (A batch 2): money (₾/თეთრი) + clock/time. Also done earlier today: v2.5 math gentle progression (1-20→1-40→1-70→1-100, 2-strong-rounds to advance) fixing Niko's "tests go above 20". Earlier: v2.4

> ARCHIVE of older pointer below.
**Older: 2026-06-04 ~17:00 | live at v2.4 — English UI (ka/EN toggle) + web fonts + 4-palette color-theme switcher (sunlit/ocean/forest/berry). Mobile: bar = wordmark + CTA + hamburger; language + theme controls live INSIDE the hamburger menu as one compact centered row under a divider (EN | 🎨 swatches; palette = decorative label, swatches 22px < palette 38px, colours inline-tap, no popover). Desktop keeps controls in the nav bar with the popover. All mobile menu styling lives in landing.html's `<style id="theme-switcher">` + the relocate script at end of body — landing.css/landing.js/i18n.js untouched. Source for fonts+theme: designer's `Downloads/NikoLearn Landing PRODUCTION.html`; pre-theme backup `backups/landing_pre-theme_2026-06-04.html`. GA4 live-metrics proxy is still CODED but NOT deployed — blocked by Google (clasp's OAuth app is hard-blocked for sensitive scopes; would need a self-owned GCP OAuth client). Owner decided GA4 live tiles not worth it for now (admin already deep-links to GA4 + Leads). On resume: take a new request, or finish GA4 only if owner wants the GCP OAuth-client route.**

## ✅ Completed 2026-06-04 — English UI language (v2.1), pushed + live-verified
- **Additive i18n layer** (`niko/i18n.js`, new): render-time text-node translation (ka source/default, EN layered on). Floating ka/EN toggle (top-right in app, in nav on landing). Choice persisted in `localStorage.niko_uilang`. **Missing strings fall back to Georgian — cannot break the app.** Default stays Georgian, so existing users see zero change.
- Wired: `core.render()` applies translation per screen; overlays (feedback, owl bubble, break, parent gate, delete modal, toast) call `applyLang` too. `landing.html`/`landing.js` load i18n; hero headline + page `<title>` swap via `applyHeroLang()`; age-picker copy translated.
- Dictionary covers: full landing, app home/login/onboarding/menus/games UI/results/parent dashboard chrome/owl chips/voice mode/break. **Teaching content (taught ka↔en words/phrases) intentionally untouched.**
- `sw.js` cache v35→**v36** (+ i18n.js cached); `APP_VERSION` 2.0→**2.1**; landing footer v2.1.
- Backup before work: `AI_Projects/backups/NikoLand_pre-i18n_2026-06-04.zip`. Commit `24172f7` on `main`.
- **KNOWN GAPS (safe Georgian fallback, not bugs):** (1) owl/tutor HINT BODIES still render in Georgian in EN mode (pedagogy strings in `tutor.js`, not yet translated). (2) Some dynamic parent-dashboard insight SENTENCES (interpolated) stay Georgian. Both degrade gracefully. Finish later if an English-only audience needs them.

## ▶ How to resume (LAUNCH BY NAME)
Fresh PowerShell → type **`NikoLearn`** or **`NikoLand`** → loads repo `CLAUDE.md` → read THIS file first.
Standalone project. Do NOT load any Bivision identity.

## Live / repo facts
- **Live:** https://gshoina.github.io/NikoLearn/  (⚠️ CASE-SENSITIVE: capital N and L. lowercase = 404.)
  - Landing (marketing): `/landing.html`. App: `/index.html` (root redirects fresh visitors to landing).
- **Repo:** github.com/GShoina/NikoLearn · branch `main` · last commit `a6a1182`.
- **App version:** `APP_VERSION` in `niko/screens.js` + landing footer (`· vX.Y`). Currently **v2.0**. Bump +0.1 every deploy (owner's deploy-landed signal — he checks the footer).
- **Service worker:** `sw.js` — bump `CACHE` const every deploy (currently **nikolearn-v35**).
- **Admin view:** `index.html?admin=1` → code **`niko-admin`** (remembered per device in `localStorage.niko_admin`).
  - **NEW re-entry:** tap the **version number `v2.0` in the landing footer** → opens `?admin=1` (no more hand-typing the URL).

## Integrations (owner-provided, wired + verified)
- **GA4:** Measurement ID **G-WMVHNYSZ3P** · account **396601949** · property **539978869**. Events: `page_view` + `sign_up`.
- **Lead capture → Google Sheet:** Apps Script web app (`APPS_SCRIPT_EXEC`) appends to Sheet `1PYAVFlLBVhj9rKORKw0ZC3j0yjpYZ1mlwr1pgeMroFA` tab "Leads". VERIFIED end-to-end.
- **Secrets:** `NikoLand/.env` (gitignored via `.env*` — confirmed never committed). Holds `GOOGLE_EMAIL` (owner's personal Google account that owns the GA4 property) + password, GA4 IDs, sheet/script URLs. `GA4_METRICS_EXEC=__PENDING_DEPLOY__` (fill after deploy). Do NOT echo the personal email into this public-repo file.
- **Feedback:** footer WhatsApp `wa.me/995593255385` + email `gela.shonia@bivision.ge`.

## ✅ Completed this session (2026-06-03) — all pushed + live-verified
1. **Admin re-entry fixed** (v1.7): tap footer `vX.Y` → `?admin=1`. Root cause was discoverability, not a code bug (unlock persists in localStorage).
2. **Admin GA4 link fixed** (v1.7): was generic `analytics.google.com` (opened the default/bivision account) → now deep-links to **NikoLearn property** `#/p539978869/realtime/overview`.
3. **Admin redesigned to an owner console** (v1.7): device stats + 📊 GA4 button + 📇 Leads-Sheet button + privacy note. **Child-safety decision: phone numbers (PII) are NEVER pulled into the public app** — they live only behind the owner's Google login. Hold this line.
4. **Mobile trims via `.hide-mobile` utility** (`@media max-width:620px{display:none}`): hidden on mobile = marquee, rewards section, "ეროვნული სასწავლო პროგრამა" curriculum badge, hero trust-band. (v1.7 / v1.8 / v1.9)
5. **Landing copy** (v1.8, both viewports): hero = "ბავშვი **სწავლობს** და **ვითარდება**, თამაშით" (both words in `.hl` span); "ყველაფერი რაც **გჭირდება**"; "გაიცანი **ნიკო ბუ**, რომელიც **გელაპარაკება**".
6. **Mobile hero order fix** (v2.0): `assets/landing.css` `@media max-width:900px` `.hero-visual{order:-1→order:1}` so the title/CTA come first and the phone mockup second. (The phone's subject cards were what looked like a "სასწავლო პროგრამა" section appearing first.)
7. **GA4 live-metrics proxy — CODED, not deployed.** `apps-script/ga4-metrics/Code.gs` + `appsscript.json` (reads aggregate GA4 counts only, NO PII, via the deploying user's own OAuth — no service account, no billing). Admin tiles scaffold `loadGA4Metrics()` + `const GA4_METRICS_URL=''` in `niko/screens.js` (shows "მალე ჩაირთვება" until URL set). `clasp` 3.3.0 installed globally.

## ⚠️ Open / in flight
- **OWNER — the one gate to finish GA4 tiles:** run in terminal →
  `! clasp login --extra-scopes https://www.googleapis.com/auth/analytics.readonly`
  and **log in as the personal Google account in `.env` (`GOOGLE_EMAIL`)** — the GA4 property owner; NOT gela.shonia@bivision.ge, which is what gcloud is authed as and which can't read this property.
- **AGENT — after that login:** `cd apps-script/ga4-metrics` → `clasp create-script --type webapp --title "NikoLearn GA4 Metrics"` → `clasp push -f` → `clasp create-deployment` → take the `/exec` URL → if it returns an auth error, owner does one "authorize" click → set `GA4_METRICS_URL` in `niko/screens.js` + `GA4_METRICS_EXEC` in `.env` → bump version + sw cache → commit + push + live-verify the 4 tiles (users/signups today + 7d).
- **DROPPED (owner said not worth it):** the prior handoff's 3 post-clear chores (delete test rows / rename Apps Script / change Google password — owner: password use is fine, will not change).
- **Pilot prep still pending:** class pilot (20-25 kids, shared device); `docs/MVP.md`, `PARENT-GUIDE.md`, `PILOT-SURVEY.md` in repo.

## ▶ Next action on resume (single first move)
Ask the owner: did you run `clasp login` as the personal Google account (`.env` `GOOGLE_EMAIL`)? **If yes** → deploy the GA4 proxy and finish the live admin tiles (steps above). **If no / new request** → handle from live diagnosis.

## Operating agreement (authoritative: repo `CLAUDE.md`)
Standalone (no Bivision identity) · owner NON-technical → make the best-practice call, explain in business language, execute, no yes/yes pauses, `--dangerously-skip-permissions` · CHALLENGE the owner · self-test + live-verify every deploy · bump version +0.1 + sw cache each deploy · em dash forbidden in human-facing text · Georgian by default · child-safety/PII line absolute (no PII in the public app).
