# NikoLearn — privacy-minimized telemetry: status + deploy (rev. 2026-06-06)

Privacy-minimized telemetry, **aggregated before storage**. Built the reversible, non-destructive
parts now (staged in the repo, nothing live). The 2 things that need YOU — a Cloudflare account and
a strategic GA4 decision — are flagged at the bottom. GPT architecture review (2026-06-06) applied.

> Terminology note (GPT review pt.4): in technical docs this is "privacy-minimized telemetry,
> aggregated before storage" — NOT "anonymous telemetry". The public promise can stay simple, but we
> never claim that no infrastructure processor transiently handles network metadata (Cloudflare does,
> as our edge processor; our code never reads/stores/forwards the IP).

## ✅ STAGED (in the repo, nothing live, GA4 untouched)
1. `cloudflare/telemetry-worker.js` — the `/v1/t` Worker. Never reads CF-Connecting-IP /
   X-Forwarded-For / True-Client-IP / cf.geo/asn/city/country. Coarsens UA to {deviceType, os}.
   Validates every event against an allow-list (free text / extra keys → rejected). Writes AGGREGATE
   KV counters only. No cookies, no per-child row, no cross-session id, no client salt.
2. `cloudflare/wrangler.toml` — observability/logs/traces/Tail/Logpush/Analytics Engine all OFF
   (explicit deny-list in the file).
3. `niko/telemetry.js` — first-party client helper. **INERT** until BOTH: endpoint set + parental
   gate accepted. The only persistent local state is a boolean `niko_t_opt_in` (remembers the gate
   choice; never an identifier; never transmitted). Not yet wired into index.html.

## Corrections applied from the GPT review
- **pt.1 — removed `same_day_return`** from both allow-lists + reporting. No cookie/localStorage
  token/fingerprint replaces it. `sessionStorage` can't see a return after the tab closes, so we
  don't claim it. Engagement = daily aggregates only: sessions/day, lessons/day, completion rate,
  lessons/session.
- **pt.2 — IP wording + code** corrected (see manifest wording below + wrangler deny-list).
- **pt.3 — COPPA ≠ GDPR** (documented separately below).
- **pt.4 — terminology** updated across worker / client / this doc.
- **pt.5 — persistent boolean** `niko_t_opt_in` permitted only to remember the gate; never sent.

## ⛔ NEEDS YOU — 2 items
**A) Deploy the Worker (needs YOUR Cloudflare account — confirmed there is none yet for NikoLearn).**
   1. Create a FREE Cloudflare account (no card; Workers free tier = 100k req/day).
   2. `wrangler kv:namespace create NIKO_T` → paste the id into `cloudflare/wrangler.toml`.
   3. `wrangler deploy`. Copy the `https://nikolearn-t.<account>.workers.dev` URL → tell me. I set
      `NIKO_T_ENDPOINT='…/v1/t'` in `niko/telemetry.js`, add the `<script>` to index.html, wire the
      events + the parental gate, and verify.
   - NikoLearn lives at `gshoina.github.io/NikoLearn` (GitHub Pages, no custom Cloudflare domain),
     so the endpoint is a `workers.dev` subdomain. First-party-enough; a custom domain is optional.
   - Sign Cloudflare's GDPR DPA (Cloudflare = transient edge processor that does not persist our PII).

**B) Remove GA4 — a STRATEGIC reversal, your call (held on purpose).**
   GA4 sends a child's IP to Google. Removing it is the right privacy direction, but the *timing*
   is yours: removing GA4 before the Worker is live = zero analytics in the gap. **Recommended
   sequence:** deploy Worker (A) → wire + verify first-party telemetry live → THEN remove GA4 from
   `index.html` AND `landing.html`. Clarity (landing-only, parents-only) can stay, or drop it too
   for a fully privacy-pure stance.

## Legal basis — documented SEPARATELY (GPT review pt.3, NOT equated)
- **COPPA:** analytics are limited to "support for internal operations" only (anonymous, aggregate,
  functional — improving lessons). No behavioural advertising, no profiles.
- **GDPR / GDPR-K:** legal basis requires a SEPARATE documented review (not yet done). Do not treat
  the COPPA basis as the GDPR basis.
- **Parental gate:** a courtesy opt-in UX control. It is NOT the legal basis and not a substitute for
  the GDPR review above.

## Manifest wording (truthful — publish as a page once telemetry is live)
> „Cloudflare ხანმოკლედ ამუშავებს ქსელურ მეტამონაცემებს, როგორც ჩვენი ინფრასტრუქტურის პროცესორი.
> NikoLearn-ის კოდი არასდროს კითხულობს, ინახავს, აღრიცხავს, ჰეშავს ან გადასცემს ვიზიტორის IP
> მისამართს. ვაგროვებთ მხოლოდ აგრეგირებულ, ანონიმურ სტატისტიკას (სახელის, იდენტობისა და
> სესიათაშორის თვალთვალის გარეშე), გაკვეთილების გასაუმჯობესებლად."

English (technical): "Cloudflare transiently processes network metadata as our infrastructure
processor. NikoLearn application code never reads, stores, logs, hashes, or forwards visitor IP
addresses."

## ACCEPTANCE — PASS only when ALL shown (live items wait for deploy)
| # | Item | Status |
|---|---|---|
| a | Final event allow-list, client == Worker | ✅ STAGED (10 events, identical) |
| b | Worker validation code (rejects free text / extra keys) | ✅ STAGED (`clean()`) |
| c | Observability/logging disabled (wrangler + dashboard) | ✅ wrangler.toml · ⛔ dashboard = after account |
| d | KV schema = aggregate counters only (no per-user rows) | ✅ STAGED (`c\|date\|event\|dims` + sum/count) |
| e | Network-tab evidence (only first-party /v1/t, no IP/cookie) | ⛔ live-only → after deploy |
| f | GA4 removed from index.html AND landing.html | ⛔ HELD (item B — strategic sequence) |

## Explicit tradeoff (as the spec requires)
True per-user D7/D30 retention needs a persistent identifier = PII under COPPA → we do NOT do it.
Engagement is approximated with DAILY AGGREGATE counts (sessions/day, lessons/day, completion rate,
lessons/session). `same_day_return` was removed because `sessionStorage` cannot honestly measure it.
