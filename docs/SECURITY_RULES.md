# NikoLearn — Security & IP Rules (governing)

Private (repo is private; also excluded from the public Pages site via `_config.yml`).
The weekly Security routine enforces these; new development must follow them.

## Rule 1 — No secrets in the live (client) JS
The published app is client-side; anything in it is readable. NEVER ship:
API keys, tokens, OAuth client secrets, admin/service config, Gmail/Google
credentials, AI prompt secrets, private endpoints.

**Status (2026-06-05, v3.4):** scanned — **no real secrets present** (no API keys/
tokens/credentials). Removed the owner Leads-sheet ID + button from the admin view.
Remaining (acceptable, non-exploitable): GA4 measurement ID `G-WMVHNYSZ3P` (public by
design); GA4 property deep-link in admin (data is Google-login-protected); soft
client gates (`12345` login, `niko-admin`) — not real secrets, unlock nothing
server-side (there is no backend). If a backend is added, all real secrets live
server-side only.

## Rule 2 — Paid content must not live entirely in the frontend
If lessons / audio / AI logic sit in client JS, a cloner gets them. Move **premium**
content behind a backend/API, gradually.

**Currently exposed in the client (free tier — OK to be public):**
- Lesson data: `niko/data.js` (WORDS, PHRASES, KINGS, alphabets).
- Recorded audio: `niko/audio/*.mp3` (served by Pages).
- Tutor logic: `niko/tutor.js`.

**Plan:** the existing FREE content stays public (already is). For the PAID version,
build **new premium lessons/audio/AI features backend-gated from day one** — do NOT
ship them in the public JS. The backend that enforces "paid" (auth + entitlement)
is the same mechanism that keeps premium content out of a cloner's reach. See
`PRODUCT_IDEAS.md` roadmap (backend = auth + payment + entitlement + content-behind-auth).

## Reporting
Security routine emails findings to gela.shonia@bivision.ge (no public log).
Never add destructive / anti-tamper / data-wiping code.
