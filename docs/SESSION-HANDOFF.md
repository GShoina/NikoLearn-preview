# NikoLearn — Session Handoff (lean)

> 📐 Before any constrained / tradeoff / privacy decision, read `docs/REASONING-LESSONS.md`.
> Rules SSOT: `CLAUDE.md` (Go vs Plan lanes, §7b Preview→GO→Live, §11 original-content, „loop წესი").
> Architecture SSOT: `docs/HANDOFF.md`. Full pre-2026-06-28 history (307KB) → `docs/archive/2026-06/SESSION-HANDOFF_20260628_full.md`.
> This file = current state + open items ONLY (keep < 30KB).

## ▶ RESUME HERE (2026-07-01) — v2.00 = "Thinking First" pedagogy, PLAN LOCKED, BUILD next

**GSH v3 adopted** (owner's Universal Operating System) → `docs/GSH-OS.md`. Active every session.

**v2.00 REFRAMED by owner (2026-07-01):** it is NOT a first-run mockup — it is the "Thinking First"
PEDAGOGY grafted onto the REAL game engine (games.js/owl.js/styles.css), which auto-satisfies the
"must be in the real app frame, not half-work" requirement. Owner gave 3 in-game observations; PLAN
LOCKED (tap-to-continue default, owner did not object). BUILD after the weekly token reset.

**RELEASE STRATEGY DECIDED (owner 2026-07-01): DECOUPLE value-delivery from the v2.00 label.** Ship the
3 verified improvements incrementally to LIVE as v1.x (each isolated onto a branch off main → merge →
Pages → live-verify), MEASURE activation on the funnel, and reserve the „v2.00" label for the Sunlit
DESIGN overhaul launched WITH proof the pedagogy lifts the 9% baseline. v2.00 = A+B+C (function, already
live+measured) + Sunlit design (visual) = function+design improved, on evidence not hope. Owner: „labels
don't bother me." NEXT LIVE SHIPS: **A** (pacing) then **B** (Socratic), same C-style isolated deploy.

**PROGRESS 2026-07-01 — A+B ready on `feat/v2-thinking-first`; C already LIVE:**
✅ **A DONE + verified** — `winStep` (games.js): correct-answer celebration no longer auto-advances
in 1.4-2.5s; child taps a big „შემდეგი →" pill (new `addNextCue()` + `.fb-next` CSS), 5.2/6.5s safety
fallback. Headless-render verified at 320px (owl + praise + button render correctly).
✅ **C SHIPPED LIVE — v1.296** (main `5d3ecaf`, Pages built, live-verified on nikolearn.com @320px:
4 tiles fit, 0 console errors, APP_VERSION=1.296, `.opt.emoji` clamp rule confirmed live). `.opt/
.opt.emoji/.options/.yn-opts` clamp()-fluid; desktop unchanged. Shipped C-ONLY (isolated onto a fresh
branch off main, since A+C were bundled in commit 34a3462) per owner „go c". Rollback anchor: v1.295=a7b329c.
✅ **DECODE DONE** — 8 designs + 73 SVGs + MANIFEST in `v2-prototype/extracted/`. Tokens: orange
#FF8A00, ink #2A1C12, success #00C48C, cream #FAF5EC. Fonts Inter+Poppins+Noto Sans Georgian.
✅ **B DONE + verified** (commit 084ce21) — 2nd-miss flow in `reQueueWrong`/`teachAndConfirm`
(games.js) reordered: was reveal-then-move-on. Now owl ENCOURAGES („არა უშავს, მოდი ერთად ვნახოთ 💛")
→ TEACHES the concept (`Tutor.build().explain`, now surfaced for LANGUAGE modes too — math keeps its
step-by-step dots) → reveals answer + grid + voice → „გაიგე?" gate. Removed premature `revealCorrect`.
New `.teach-say`/`.teach-lesson` CSS. Headless-verified at 320px (say+lesson+answer+gate all render).

**✅ QA GATE PASSED** (`node qa/qa-check.mjs --gate` = 0 findings, v1.295). **✅ REGRESSION CLEAN** —
correct→„შემდეგი"→advances; 1st miss = dim+retry (no reveal, no teach); 2nd miss = teach flow. All via
muted headless Playwright.

▶ **AFTER A+B SHIP LIVE — design integration (Part 2) = earns the „v2.00" label** — graft the v7-Sunlit 8-screen first-run
(`v2-prototype/extracted/`, tokens orange #FF8A00 etc.) into the REAL app shell, then stage the
COMPLETE v2 (A+B+C+design) to PREVIEW as ONE link. NOTE: preview repo GShoina/NikoLearn-preview is a
project-Pages SUBPATH (`/NikoLearn-preview/`) → root-relative asset paths (`/niko/...`, owl-logo.png)
will break there; needs a base-path fix + load verification before presenting. Do NOT stage a partial
(A/B/C-only) preview — owner wants ONE complete testable link, not half-work. Then owner go → live.
**TEST DISCIPLINE (owner 2026-07-01): MUTE audio in every Playwright test** (stub speak/speechSynthesis/
Audio.play) — owner is in meetings; TTS must never sound during automated tests. Local server: `python
-m http.server 8137`; SW/HTTP caches sub-scripts → reload with a cache-buster query after each edit.
- **A. Pacing (games.js `winStep`, ~L153-160).** Today advances at 1400ms(8+)/2500ms(young) after a
  correct answer = too fast to comprehend. FIX: celebration stays, answer voiced, a big single voiced
  „შემდეგი →" button lets the CHILD set tempo; auto-advance only on a ~5s fallback; tap-to-skip kept.
- **B. Socratic wrong-answer tutor (games.js wrong-branch L167-240 + owl.js).** Today 2nd miss =
  `teachAndConfirm()` reveals the correct answer + „გაიგე?" but does NOT explain/teach/encourage; owl
  tutor is wired only in spelling mode. FIX (owner's exact order): encourage → TEACH the mistake
  (per-mode: math=step, listen=replay, vocab=meaning) → THEN reveal correct → „გაიგე?". Owl in ALL modes.
- **C. Mobile-first (styles.css `.options` L440-446).** Today `.options` = hard 2-col grid, NO media
  query → listening emoji tiles (2.7rem, min-h 92px) break ≤360px. FIX: adaptive grid (auto-fit /
  media query) + full mobile-first sweep of every game screen at 320/360/390px (owner: "არსად არ ირღვევა").
- **Build path:** branch → self-test + §6c visual render 320/360/390px screenshots → PREVIEW repo (real
  app shell, one link) → owner phone-tests → owner "go" → live. Georgian copy via Gemini + owner (§6f).

**v2.00 DESIGN SOURCE — owner-confirmed self-sufficient (2026-07-01):** file
`~/Downloads/ნიკო - სწრაფი დაწყება (ერთიანი).html`. Contains 74 inline SVG icons (vectors, exactly
extractable), ALL CSS/colors/animations inline, NO external images/binaries (nothing missing), only
1 Google font (embed/self-host). Only quirk: the 8 first-run designs are embedded as escaped JS
strings — decoding is trivial, not a blocker. Use this file as the v2.00 visual base (v7 Sunlit theme).
Still confirm by visual comparison which of the 8 designs go in/out during build (owner named 4:
ჟელე ბარათები+წყლის დოკი / პირველი მოგება·1წუთში / რიცხვების გზა·დაკლაკნილი ბილიკი / საფეხურის ბარათები).

**DECODE REALITY (verified 2026-07-01 via ctx, DID NOT read raw bytes):** the file is a
**bundler artifact**, ~1.05MB / 176 lines, top-level JS = `chunks=[...]`, `blobUrls={}`,
`resourceMap={}`, markers `__bundler_thumbnail/__bundler_loading/__bundler_err`. The 74 inline
`<svg>` icons + the 8 designs live ESCAPED inside `chunks` (3266 `\"`, 1410 `\n`) and are
reassembled at runtime into blob URLs via resourceMap. No `--css-vars` are visible at top level
(they're inside the escaped chunks). DECODE APPROACH for build: in the sandbox, walk `chunks`
→ join → unescape → map via `resourceMap`, emit each design's HTML/CSS/SVG to disk, THEN integrate.
Confirmed self-contained (1 Google font, no external binaries). **Extracted real first-run flow copy**
(matches v7 + our plan): privacy line → „ხმა და სურათები" → „გახსნა · ნიკო გხვდება ხმით" →
„გამარჯობა! მე ნიკო ვარ" → „რა გინდა ვითამაშოთ?" (რიცხვები/ასოები/ინგლისური) → „დავიწყოთ!" →
task „სად არის სამი" → „დააჭირე და მოუსმინე ხელახლა" (=B listen-teach step, already in design) →
„ყოჩაღ!" → „შენ შეძელი!" → „პირველი ვარსკვლავი" → „დღევანდელი გმირი" → „კიდევ ერთი!"/„დღეს კმარა".
Modes seen: „მოისმინე და დათვალე · ხმა → რაოდენობა", „შეხება · ბავშვი ირჩევს", „რჩევა" (built-in hint/tutor).

---

## ▶ RESUME HERE (2026-06-30) — top open items

**🟠 NEXT SESSION (owner: tomorrow after 12:00, token-conserving today) — BUILD a COMPLETE,
TESTABLE v2.00.** Owner tried to test v2.00 on preview and correctly objected: (a) the preview frame
size does NOT match the real live app's frame; (b) `gallery.html` + `/v2/` are isolated mockup
screens = "half work", not a full testable product. **There is currently NO complete, testable v2.00
anywhere — only the partial prototype.** Owner re-locked the workflow (matches §7b): TWO phases —
(1) COMMIT/PREVIEW where he sees the FULL product with its changes and can fully test it, then
(2) his approval → LIVE. He will NOT review half-built screens again.
- TASK for tomorrow: build v2.00 to completion AND integrate it into the REAL app shell/frame (correct
  app viewport/size, not a standalone mockup), deploy to PREVIEW as ONE complete working version on a
  single link, present for his go/no-go. Only on "go" → live to nikolearn.com.
- OPEN Q to resolve at build time: owner asked which of the **8 first-run designs** in
  `~/Downloads/ნიკო - სწრაფი დაწყება (ერთიანი).html` (a gallery of 8 numbered variants 1-8) v2.00
  actually uses. NOT recorded — handoff only pins v2.00 to the v7 "Sunlit" theme. He named 4 he
  expects: „ჟელე ბარათები + წყლის დოკი" (home) / „პირველი მოგება · 1 წუთში" / „რიცხვების გზა ·
  დაკლაკნილი ბილიკი" / „საფეხურის ბარათები · მათემატიკის შიგნით". → confirm by visual comparison
  during the build and tell him exactly which designs are in / out.


**🟡 www.nikolearn.com — DNS FIXED + self-healing watcher installed (2026-06-30).** Owner added the
3 missing apex A records at domenebi.ge; verified via Google DNS 2026-06-30: apex resolves to ALL 4
GitHub IPs (`185.199.108/109/110/111.153`) and `www` CNAMEs to gshoina.github.io. DNS is no longer the
blocker. Cert state is still `new` with the correct SAN `[nikolearn.com, www.nikolearn.com]` — only
Let's Encrypt issuance remains (automatic now that DNS is complete). apex serves HTTPS 200/secure
throughout; www still `SEC_E_WRONG_PRINCIPAL` until the cert lands.
- The in-session poller from last session died with that session. REPLACED with a robust Windows
  scheduled task **`NikoLearn-www-cert-watch`** (every 30 min) running
  `C:\Users\gela.shonia\niko-ops\www-cert-watch.sh` (log: `niko-ops/www-cert-watch.log`). It is
  NON-DESTRUCTIVE: never touches the CNAME; when www serves valid HTTPS it enables Enforce-HTTPS once,
  confirms it took, then self-disables. Until then it gently nudges a Pages rebuild each run.
- The old **destructive** `NikoLearn-www-cert-fix` task (CNAME remove/re-add) was DELETED — it
  conflicted with the "never flip CNAME again" rule (LE rate-limit risk). Do NOT recreate it.
- Nothing more needed from owner or agent; just let the watcher finish. To check by hand:
  `gh api repos/GShoina/NikoLearn/pages` → cert.state should go `new`→`approved`; then www loads.
(Original problem detail, for reference:)

**🔴 OPEN OWNER ACTION — www.nikolearn.com still broken (apex fine + secure; www has no cert).**
The www TLS cert has been stuck `new` for 24h+; Let's Encrypt is issuing NOTHING (confirmed via
crt.sh). Remove/re-add — incl. the 00:05 scheduled task `NikoLearn-www-cert-fix` (it RAN, restored
apex to 200, but did NOT fix www) — did not unstick it. **Leading suspected cause: apex has only 1
of 4 GitHub A records** (`185.199.108.153`; missing `.109/.110/.111`). **FIX = add the 3 missing A
records** (Type A, Name @: `185.199.109.153` / `185.199.110.153` / `185.199.111.153`; keep the
existing `.108` A and `CNAME www→gshoina.github.io`). DNS is at domenebi.ge — I HAVE access (creds
`NIKO_DOMENEBI_*`, see [[reference_nikolearn_dns_access]]) BUT **domenebi.ge's SPA login is broken in
the automated playwright browser** (16+ JS errors, login icon/menu/API all unresponsive), so I could
not reach the DNS panel from my tools. → Owner adds the 3 records in his own browser, OR retry the
login from a fresh session / non-automated browser. After records added: cert should provision within
hours → re-check www + enable Enforce-HTTPS. **Use bare `nikolearn.com` everywhere meanwhile.** Do
NOT flip the CNAME again (worsens the stuck state).

**✅ Funnel v0 — BUILT, real baseline captured.** New `🪜 ფანელი` tab in
`output/NikoLearn-stats-viewer.html` (owner double-clicks the file → tab; surfaces page_view +
first_win, which were collected-but-never-shown). **BASELINE: 362 app opens → 32 first wins = ~9%
activation** (91% leave before their first win = the #1 problem; this VALIDATES the v2.00 first-run
priority with real data). English activates most (56% of first wins). Traffic: direct 44% / internal
41% / Facebook 15%. **Gap:** landing.html emits NO telemetry (only the Meta pixel) → landing→app step
is unmeasurable; one small `page_view{page=landing}` event would add it (and reveal FB-ad→app
conversion = ad ROI). The pattern-105% / exam-0% bug (round_complete uses a coarse-only mode key) is
diagnosed; fix pending.

**Product-owner priority (decided this session):** (1) measure first = funnel ✅ done; (2) ship the
v2.00 first-run to live and measure whether 9% rises; (3) deep pedagogy (thinking-pause / Socratic
hints) + full redesign LATER, only after the first-run proves an activation lift.

**v2.00 gallery now has 6 screens** (`/v2/gallery.html`): enter → "წავედით" → task → win → **themes
page** + **subject page** (faithful v7-Sunlit redesign of the owner's two real screenshots; coins/🔥
reframed as ⭐ thinking-stars). All on PREVIEW only, not live.

**Memory:** owner flagged my memory as overloaded/confused — I wrongly punted the www fix as a
"Route 53 access" problem when I actually have domenebi.ge access. Saved
[[reference_nikolearn_dns_access]] to prevent a repeat. **TODO: run the memory-optimization practice.**

---

## ▶ 2026-06-29 SESSION (latest)

**v2.00 redesign — IN PROGRESS (owner-driven).** Owner provided v7 design (`~/Downloads/საბავშო აპლიკაციის დიზაინი.zip` → 8 screens "Thinking First": never-rush pedagogy, no timer/hearts, thinking-pause, 3-level Socratic hints, safe mistakes, "you grew" + thinking-star reward, Sunlit/Playground/Calm themes + OKLCH tokens) + `~/Downloads/ნიკო - სწრაფი დაწყება (ერთიანი).html` (6-frame fast first-run). Framing agreed: **v7 = lesson stage, quickstart = entry stage; v0/v2.00 = GRAFT onto live, NOT rebuild.** Owner pushed back on "mockup/validate-first" caution → wants deliberate building, fewer caveats.
- **Built: v2.00 first interactive flow** at `NikoLand/v2-prototype/` (index.html = tap-through enter→"წავედით"→task "სად არის 3 ვაშლი"→win+star; gallery.html = all screens scroll view). Sunlit visual, polished. **Deployed to PREVIEW** (repo GShoina/NikoLearn-preview, folder /v2): tap = `https://gshoina.github.io/NikoLearn-preview/v2/`, scroll = `/v2/gallery.html`. NOT live.
- **Logo decision (owner-approved):** use `~/Downloads/Nikolearn Logo orange.png` (polished orange owl) EVERYWHERE, framed as a rounded white app-icon badge (PNG has white bg) + "NikoLearn" wordmark. Copied to v2-prototype/assets/niko-logo.png. **TODO: propagate same logo to LIVE app** (owl-logo.png, favicons, apple-touch, og-image, manifest icons) — needs sized/transparent versions, customer-facing → deploy on owner go.
- Owner #1 visual gripe: the generic figure icons (cat/dog/fish/apple emoji) → replace with custom Niko-language illustrations (next visual upgrade).
- **Deploy plan for v2.00:** stays on preview, grows as built; goes live to nikolearn.com only when (1) complete + real content + integrated, (2) owner approves on preview, (3) after 23:59. Rollback = git revert.
- Owner-facing reports in `output/`: `2026-06-29-v2.00 გადასვლის გეგმა by Niko.html` (red-team + phased plan), `2026-06-29-MVP სამოქმედო გეგმა by Niko.html`.
- **NEXT build:** thinking-pause screen, Socratic hint, "ჯერ არა", ასოები/ენა subjects, then add to gallery.

**QA gate — DONE (committed local, not pushed; internal tooling).** `qa/qa-check.mjs` now a real release gate: `npm test` = `node qa/qa-check.mjs --gate` (exits non-zero on any P1 / version drift / encoding). Added charset+mojibake + og:title/og:image checks. `npm run qa:fix` (`--fix`) auto-syncs version drift (landing/sw → APP_VERSION) then gates = find→fix→pass (owner wanted this). `npm run qa` = report-only. Synced landing footer 1.262→1.295 (committed local, customer-facing → deploy after 23:59).

**Funnel v0 + telemetry bugs — DIAGNOSED, not yet built.** Root cause of BOTH owner-seen bugs = `round_complete` is emitted with COARSE subject only (`coarseMode()`, games.js:63/1414; worker enum has no submodes): (a) **pattern 105%** = all-kings completions ÷ small pattern starts; (b) **exam 0%** = mock-exam completion relabeled `kings` (examFinish games.js:1336) + Kings-English exam events (`kings_exam_start/done`) deliberately dropped on-device (analytics.js CLIENT_ALLOW, COPPA). Fix (later, small + privacy-safe): record completion by submode anonymously. Funnel v0 to be built as a TAB in `output/NikoLearn-stats-viewer.html` (existing tabs: dash/trend/traffic — do NOT duplicate); `first_win` + `page_view` already collected but never surfaced (half the funnel is free). D1/D7 return + owner-device-filter on app = impossible under current no-cross-session-id privacy model. Steps age-selected/2nd-round/time-to-win need 2-3 new anon events.

**Security/truthfulness (owner: minimal, don't over-index).** Drop the "needs internet first time" line (owner: obvious). Add ONE privacy sentence (KA: „ვაგროვებთ ანონიმურ, შეჯამებულ სტატისტიკას… პიროვნებას არ ვადგენთ. სარეკლამო გვერდი იყენებს Meta-ს პიქსელს…" + EN equiv). landing FB pixel + workers.dev telemetry contradict "nothing sent" → disclose. APK hardening (allowBackup=true, FileProvider ".", RECORD_AUDIO undeclared) = deferred until APK launch. Not yet applied (customer-facing).

---

## ▶ CURRENT STATE — end of 2026-06-28 session
**LIVE on nikolearn.com: v1.295** (GShoina/NikoLearn main). **Use bare https://nikolearn.com** (www HTTPS cert still pending — see open items). Goal this session: make the app **FB-paid-traffic ready**. Done.

### Shipped (12 deploys, all live-verified)
- **v1.284** parent bugs: dative grammar „დათვს/ბავშვს სძინავს" (+ regenerated edge-tts clips); cross-screen audio bleed fix (render→stopAudio); U3 voice-toggle label follows interface lang.
- **v1.285** voice-toggle hidden in alphabet; colourful counting.
- **v1.286** telemetry batching → fixes Cloudflare KV 429 daily-write data loss.
- **v1.287** privacy.html mic section + „GDPR & KIDS"→„GDPR-ის პრინციპებზე აგებული".
- **v1.288** count-along (lights 1..N + speaks number).
- **v1.289** trace contour animation; Kings landing un-hidden on mobile + „ეფუძნება კინგსის მეთოდიკას"→„კინგსისთვის მზადება" (Kings kept per owner).
- **v1.290** PAYWALL_ENABLED kill-switch (paywall can't strand a user; behaviour-identical off).
- **v1.291** Meta Pixel scaffold on landing (LANDING ONLY) + EU consent gate + privacy disclosure. **INERT — needs the real Pixel ID** (`PIXEL_ID_PLACEHOLDER` in landing.html); owner gets it from Meta Events Manager → one swap.
- **v1.292** screens.js god-file split → `niko/screens-menu.js` (menu/subject nav), behaviour-identical, verified 0 errors.
- **v1.293** DEEP-AUDIT fixes: 🔴HIGH privacy — analytics.js fail-closed CLIENT allow-list (was leaking child exam-grade/age-band off-device); profile_created no longer sends age; SW precache add kings-content/kings-exam/draw; Clarity now consent-gated (was ungated session recorder); solvability "cat in/on box" → "Fish live in water".
- **v1.294** Georgian copy fixes (owner-marked, native-validated): პატერნები→კანონზომიერება, calque fix, Dato tense, 3 talk cards (owner wording), ტომატი→პომიდორი, ფიალა→ჯამ, ჟ/უ emoji mismatch removed, exam a/an by answer.
- **v1.295** UX polish: exam locked-tile alert()→in-app screen; tap targets ≥44px; mic released on any screen change; voice toggle shows on subject grid.
- **Worker** (nikolearn-t.bivision.workers.dev) redeployed: CORS allows nikolearn.com+www → parent feedback delivers. **www DNS** CNAME www→gshoina.github.io added at domenebi.ge.

### Deep audit (2026-06-28, 36 agents, AGENT_TEAM_STANDARD)
5 dimensions (Georgian grammar, content solvability, code, privacy, UX) + adversarial verify. 28 confirmed (0 CRITICAL, 1 HIGH, 11 MED, 16 LOW). **The two owner-priority classes — dative grammar + solvability — verified CLEAN** (no wrong answers, no unsolvable items, no em-dash). HIGH + 10/11 MED + most LOW fixed (v1.293-1.295). Result JSON: `~/AppData/.../tasks/wlo069ath.output`; copy-markup HTML: `output/2026-06-28-ქართული copy markup (აუდიტი) by Niko.html`.

### Parked (owner paused)
- **Centre-line one-stroke handwriting** (parent #9): branch **`feat/centerline-writing`** (commit 8e75aec). Algorithmic skeleton from ka.ttf (scratchpad/skel.cjs → niko/stroke-data.js, 33 letters). AVG recall 0.99. Before ship: stroke order/direction per standard; fix ი, ო. Not on main.

## ▶ OPEN ITEMS
- **OWNER:** (1) Meta **Pixel ID** — Events Manager → Data sources → copy ~16-digit ID → I swap into landing.html (1 line) → ads become measurable. (2) **„Kings" legal** — confirm OK to invoke the name (kept as „კინგსისთვის მზადება"). (3) **owl-logo** origin (owned/licensed?).
- **www HTTPS** (task #15) — IN PROGRESS 2026-06-29: root cause = the Pages cert had apex-only SAN (www DNS was added after the cert issued), so www failed `SEC_E_WRONG_PRINCIPAL`. Fix applied: flipped CNAME apex→www to force re-provisioning, then REVERTED to apex (commit c1a570d) because the www cert was still not issued ~20min in and apex was 301-ing to an unsecured www (live regression on strict browsers). Now: apex serves direct 200 (canonical, secure); cert.state advanced `dns_changed`→`new` with domains `[nikolearn.com, www.nikolearn.com]` → the new SAN cert WILL cover www. Background poller `b0yu15jjt` watches for www TLS to go valid (GitHub LE issuance, minutes→up to 24h). Decision: **apex stays canonical** (everything is built on bare nikolearn.com — ads/pixel/worker/docs); www will load + redirect to apex once the cert lands. Do NOT flip CNAME again (LE rate-limit risk); just wait for `new`→`approved`.
- **Root routing — VERIFIED, NO FIX NEEDED (2026-06-29):** owner saw nikolearn.com open the app (not landing.html) and asked if the link was broken. It is NOT. `boot()` in niko/screens.js already redirects a first-time visitor (`!state.authed && !niko_enter && !?app=1`) to `landing.html`; returning/authed visitors go straight to the app. Confirmed live in a clean browser (cleared storage): `localhost/` → `/landing.html` (marketing + Pixel consent), 0 errors. Owner only saw the app because his browser had prior state. A "make root=landing" restructure was planned, then KILLED at the challenge step (would be wasted work + break the returning-user/PWA fast path).
- **Audit remainder (non-blocker, optional):** accessibility (subject/mode tiles div→role/tabindex/aria — touch-first so low impact); dead-code removal (renderInitiator/renderConsent, landing() dead block, orphan telemetry.js); debatable LOWs (2 lang controls, logo→landing, tiny-age math menu).
- **Engagement levers [HYPOTHESIS]:** parent „what your child learned" + shareable card (decider + word-of-mouth); adaptive difficulty via metrics.js bands; Kings-progress. Validate with telemetry.
- **Signal (owner #1 priority):** distribute to known families + ~5 parent interviews; in-app fake-door „Premium" intent + feedback nudge (build, present before live).
- **S2 fonts self-host** (Google-Fonts IP-leak, privacy/FB — heavy, minor benefit, deferred).

## ▶ DEV NOTES
- Live verify: `python -m http.server 8137`, app at `index.html?app=1`. Browser caches sub-scripts → kill MCP chrome or cache-busted curl to verify deploys; SW cache name = version.
- Deploy = push GShoina/NikoLearn main. §7b: customer-facing → preview→owner GO→live; clear bug fixes not gated; owner: stop asking on reversible work.
- Worker deploy: `cd cloudflare && CLOUDFLARE_API_TOKEN=$CF_NIKO_API_TOKEN CLOUDFLARE_ACCOUNT_ID=62f02b2a518a8e63eba0537f9162c0ec npx wrangler@4 deploy`.
- Stats: `GET /v1/stats?k=$NIKO_STATS_KEY` (creds in ~/.claude/.bivision-creds.env, incl. NIKO_DOMENEBI_* for DNS). Exclude owner devices via `?notrack=1`.
- Telemetry privacy: analytics.js now has a CLIENT_ALLOW that MUST mirror cloudflare/telemetry-worker.js EVENTS — add new events to BOTH or they're dropped on-device (by design).
