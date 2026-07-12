# NikoLearn — Security & IP Rules (governing)

> **Status refreshed 2026-07-12 (CKO).** Repo is PRIVATE (verified). Public site = explicit ALLOWLIST
> publish (NB-24; the old `_config.yml`/denylist note is obsolete — internal files can no longer auto-ship).
> Standard = OWASP-aligned secret hygiene; enforced by a pre-commit secret-scan guard (Rule 3).

The weekly Security routine enforces these; new development must follow them.

## Rule 1 — No secrets in the live (client) JS
The published app is client-side; anything in it is readable. NEVER ship:
API keys, tokens, OAuth client secrets, admin/service config, Gmail/Google
credentials, AI prompt secrets, private endpoints.

**Status (2026-06-05, v3.4):** scanned — **no real secrets present** (no API keys/
tokens/credentials). Removed the owner Leads-sheet ID + button from the admin view.
Remaining (acceptable, non-exploitable): GA4 measurement ID `G-WMVHNYSZ3P` (public by
design); GA4 property deep-link in admin (data is Google-login-protected); soft
client gates (`niko-admin` admin code, parent-space PIN; the `12345` login was removed
v1.129) — not real secrets, unlock nothing
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

## Rule 3 — No secrets in ANY tracked file (code, docs, handoffs) — NB-33 class
Credentials live ONLY in `~/.claude/.bivision-creds.env` (gitignored). NEVER paste a live key/token into a
handoff, tracker, doc, or code comment (a private repo is not a safe place for a live secret — history +
clones + any future exposure). **This is a distinct class from Rule 1** (Rule 1 = client JS; Rule 3 = ALL
tracked text). Incident 2026-07-12: the live STATS_KEY sat in two tracked archive handoffs + git history →
ROTATED (only true remediation for an exposed secret; redaction alone leaves it in history) + redacted.
- **On any exposed secret: ROTATE first** (wrangler secret put / provider console), update the creds env +
  any gitignored viewer, verify old→403/new→200. History-purge is unnecessary once the key is dead.
- **GUARD (enforced):** `tools/hooks/pre-commit-secretscan.sh` installed as `.git/hooks/pre-commit` blocks
  committing a credential-shaped literal (nk_/AIza/sk-/PRIVATE KEY/token=). Local per clone → each clone
  runs `cp tools/hooks/pre-commit-secretscan.sh .git/hooks/pre-commit`. Bypass only via `--no-verify` (redact instead).

## Reporting
Security routine emails findings to NikoLearn@outlook.com (no public log).
Never add destructive / anti-tamper / data-wiping code.
