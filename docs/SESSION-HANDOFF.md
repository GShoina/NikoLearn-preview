# NikoLearn — Session Handoff (lean)

> 📐 Before any constrained / tradeoff / privacy decision, read `docs/REASONING-LESSONS.md`.
> Rules SSOT: `CLAUDE.md` (Go vs Plan lanes, §7b Preview→GO→Live, §11 original-content, „loop წესი").
> **Full history (all prior RESUME blocks, 307KB) archived → `docs/archive/2026-06/SESSION-HANDOFF_20260628_full.md`.**
> Architecture SSOT: `docs/HANDOFF.md`. This file = current state + open items ONLY (keep it < 30KB).

## ▶ CURRENT STATE — 2026-06-28
**LIVE on nikolearn.com: v1.289** (GShoina/NikoLearn main). Use **bare https://nikolearn.com** (www HTTPS cert pending, see open items).

### Shipped this session (live-verified)
- **v1.284** parent bugs: Georgian dative grammar „დათვს/ბავშვს სძინავს" (data.js + regenerated edge-tts clips krd_040/sent_11 + audio-manifest keys); cross-screen audio bleed fixed (render() → `window.stopAudio()`); U3 🔊 voice-toggle label follows interface language.
- **v1.285** voice-toggle hidden in alphabet sections; colourful counting (count-card + pastel option tiles).
- **v1.286** telemetry **batching** (analytics.js) → fixes Cloudflare KV 429 daily-write loss on busy days.
- **v1.287** privacy.html microphone section (ka+en) + landing „GDPR & KIDS"→„GDPR-ის პრინციპებზე აგებული".
- **v1.288** count-along (lights 1..N + speaks each number).
- **v1.289** trace animation contour-by-contour; Kings landing un-hidden on mobile + „ეფუძნება კინგსის მეთოდიკას"→„კინგსისთვის მზადება".
- **Worker** (nikolearn-t.bivision.workers.dev) redeployed: CORS now allows nikolearn.com + www → **parent feedback delivers** (was 0). Deploy via wrangler + CF_NIKO_API_TOKEN.
- **www DNS**: CNAME www→gshoina.github.io added at domenebi.ge.

### Parked (owner paused)
- **Centre-line one-stroke handwriting** (parent #9): branch **`feat/centerline-writing`** (commit 8e75aec). Algorithmic (font ka.ttf → rasterize → Zhang-Suen thin → trace → smooth → `niko/stroke-data.js`, 33 letters; generator `scratchpad/skel.cjs`, grid `scratchpad/grid.html`). Integrated in alpha.js/index.html/sw.js ON THE BRANCH (not main). AVG recall 0.99, upright, smooth. **Before ship:** stroke order/direction per standard; fix ი, ო. Lesson: numeric self-test missed an upside-down bug → always visually compare to an upright reference.

## ▶ OPEN ITEMS
- **www HTTPS** (task #15): cert covers only apex (no www SAN) → `ERR_TLS_CERT_ALTNAME_INVALID`. If not auto-fixed by 12:00pm 2026-06-28, fix = remove+re-add the GitHub Pages custom domain (small brief live risk). Meanwhile use bare; bare in all FB ads.
- **Auditor pre-FB-launch plan (2026-06-28):** A1 CORS ✅DONE · A2 Meta Pixel = OWNER FORK (needs Pixel ID + privacy-stance decision; landing-only + EU consent gate) · A3 Kings = OWNER DECISION (I kept „კინგსი" as prep-target per owner; auditor wants brand fully removed for legal safety) · B1 screens.js refactor (god-file, 272 touches; real debt but high regression risk → post-launch, module-by-module) · B2 paywall behind flag (freemium already opens all; v1.227 stranding fixed — mostly satisfied, verify) · B3 handoff archive+lean ✅DONE (this file).
- **Engagement levers [HYPOTHESIS]:** parent „what your child learned" + shareable card (drives decider+word-of-mouth); adaptive difficulty using metrics.js bands (flow); Kings-progress; novelty. Validate with telemetry.
- **Signal (owner #1):** distribute to known families + ~5 parent interviews; in-app fake-door „Premium" intent + feedback nudge (build, present before live).
- Owner forks: Meta Pixel · „Kings" legal-affiliation · owl-logo origin.

## ▶ DEV NOTES
- Live verify: `python -m http.server 8137`, app at `index.html?app=1`. GitHub Pages caches sub-scripts; cache-busted curl on raw files to verify deploys; SW cache name = version.
- Deploy = push GShoina/NikoLearn main; §7b: customer-facing changes preview→owner GO→live; bug fixes not gated.
- Stats: `GET /v1/stats?k=$NIKO_STATS_KEY` (creds in ~/.claude/.bivision-creds.env). Real usage exists (13 days data); exclude owner devices via `?notrack=1`.
