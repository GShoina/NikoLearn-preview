# NikoLearn — Data-Flow Inventory (what leaves the child's device)

**Status: CANONICAL (data-flow SSOT) · created 2026-07-12 by CKO · every row code-verified that day.**
Purpose: THE authoritative answer to "what actually leaves the device?" — the basis for privacy copy
(privacy.html KA+EN, landing badges, README/HANDOFF claims) and for NB-25's fix. **Change rule:** any new
telemetry event → BOTH `niko/analytics.js CLIENT_ALLOW` and `cloudflare/telemetry-worker.js EVENTS` (else
dropped on-device by design); any NEW external host or flow → update THIS file + the privacy copy in the
SAME release. Copy that contradicts this file = a defect (NB-25 class).

## Outbound flows (shipped app + landing, v1.359)

| # | Flow | Surface | Destination | Payload / PII | Evidence |
|---|---|---|---|---|---|
| 1 | First-party telemetry `POST /v1/t` | app | `nikolearn-t.bivision.workers.dev` (CF Worker) | Batched events; **allow-listed enums/ints ONLY, free text rejected server-side AND dropped on-device first** (fail-closed client mirror). No id, no cookie; worker never reads IP; stored as date+event+coarse-dims aggregate counters. OFF for DNT / localhost / `niko_owner` devices. | analytics.js `CLIENT_ALLOW`; telemetry-worker.js `EVENTS`+`clean()`; wrangler.toml observability OFF |
| 2 | Cloudflare Web Analytics beacon | **app AND landing** | `static.cloudflareinsights.com` | Cookieless page analytics (CF product: no cookie, no IP stored). ⚠ EN privacy copy currently claims landing-ONLY = FALSE → NB-25. | index.html:5-6, landing.html |
| 3 | Google Fonts fetch | app + landing | `fonts.googleapis.com` / `fonts.gstatic.com` | Browser font request = visitor IP visible to Google at network level; zero app data. Deferred fix: S2 self-host (open item). | index.html, landing.html; sw.js caches after first fetch |
| 4 | Parent feedback `POST /v1/feedback` | parent space (voluntary form) | same CF Worker | **CONSENTED PII**: parent's own name/phone/email/message (length-capped, strings-only) + coarse OS bucket. Stored as discrete `fb\|` KV rows, EXCLUDED from stats aggregate. ⚠ No TTL/deletion route yet vs "≤12 months" promise → NB-27. | parent.js:322 form; worker:188-198 |
| 5 | WhatsApp / contact links | parent space only | `wa.me` | User-initiated external link (feedback channel). Kid-facing surfaces have NO external links; promise wording should say "in the children's app" (it does). | parent.js, privacy.html |
| 6 | Static hosting | all | GitHub Pages / CDN | Standard web-serving (server-side logs live with GitHub/CF, outside our code). | CNAME, deploy-pages.yml |

Non-flows worth stating: `www.w3.org` strings in code = SVG XML namespaces, NOT network calls.
`niko/telemetry.js` = orphan with placeholder URL, NOT loaded by index.html (deletion pending owner GO).

## What NEVER leaves the device (verified)
- Learning progress, streaks, coins, per-word mastery — `localStorage nikolearn_p2` only (core.js).
- Child name, exact age, avatar, languages — profile lives on-device; telemetry sends `age_band` enum at
  most (`profile_created`), never name/age/grade (grade dropped on-device since 2026-06-28 fix).
- Free text of any kind via telemetry (double fail-closed: client drop + server reject).
- Cookies / persistent identifiers / cross-session IDs — none exist; retention is measured only as
  id-free daily BANDS computed on-device (`retention_ping`, v1.356 design).
- IP addresses — worker never reads CF-Connecting-IP/X-Forwarded-For/request.cf (header contract,
  telemetry-worker.js:11-17); observability/Logpush hard-disabled (wrangler.toml).

## Promise-vs-reality deltas (open copy defects this file must drive to zero)
1. **NB-25 [HIGH]:** privacy.html EN §"Web analytics" claims analytics is "marketing landing page only" +
   "No analytics of any kind runs inside the children's learning environment" — contradicts rows 1-2.
   KA §3 („საიტისა და აპის") is accurate. Fix EN to match KA + this inventory; §6f Gemini KA-QA; owner GO.
2. **NB-27 [MED]:** row 4 retention promise (≤12mo + deletion on request) not enforced in code.
3. CLOSED 2026-07-12: HANDOFF.md "zero network calls" claim fixed by CKO refresh.
