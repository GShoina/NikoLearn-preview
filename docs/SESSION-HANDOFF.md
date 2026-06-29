# NikoLearn — Session Handoff (lean)

> 📐 Before any constrained / tradeoff / privacy decision, read `docs/REASONING-LESSONS.md`.
> Rules SSOT: `CLAUDE.md` (Go vs Plan lanes, §7b Preview→GO→Live, §11 original-content, „loop წესი").
> Architecture SSOT: `docs/HANDOFF.md`. Full pre-2026-06-28 history (307KB) → `docs/archive/2026-06/SESSION-HANDOFF_20260628_full.md`.
> This file = current state + open items ONLY (keep < 30KB).

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
