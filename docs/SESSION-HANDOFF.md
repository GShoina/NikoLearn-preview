# NikoLearn — Session Handoff (lean)

> 📐 Before any constrained / tradeoff / privacy decision, read `docs/REASONING-LESSONS.md`.
> Rules SSOT: `CLAUDE.md` (Go vs Plan lanes, §7b Preview→GO→Live, §11 original-content, „loop წესი").
> Architecture SSOT: `docs/HANDOFF.md`. Full pre-2026-06-28 history (307KB) → `docs/archive/2026-06/SESSION-HANDOFF_20260628_full.md`.
> This file = current state + open items ONLY (keep < 30KB).

## ▶ RESUME HERE (2026-06-30) — top open items

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
