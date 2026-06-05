# NikoLearn — privacy-first telemetry: status + deploy (2026-06-06)

Built the **reversible, non-destructive** parts now (Niko, autonomous). The 2 things that need
YOU (account access / a strategic decision) are flagged at the bottom — I did NOT do them while you
slept, because one reverses work we shipped hours ago.

## ✅ DONE (staged in the repo, nothing live yet, GA4 untouched)
1. `cloudflare/telemetry-worker.js` — the `/v1/t` Cloudflare Worker. Drops IP entirely, coarsens
   UA to {deviceType, os}, validates every event against an allow-list (rejects free text → no
   accidental PII), writes AGGREGATE KV counters only. No cookies, no per-child rows, no cross-day id.
2. `niko/telemetry.js` — the first-party client helper. **INERT** until BOTH: endpoint set +
   parental gate accepted. 24h session salt in sessionStorage only (same-day dedup, no cross-day).
   No 3rd-party script. Not yet wired into index.html (so it does nothing until you say go).

## ⛔ NEEDS YOU — 2 items (I stopped here on purpose)
**A) Deploy the Worker (needs YOUR Cloudflare account — I can't without it).**
   1. Cloudflare dashboard → Workers & Pages → Create → Worker → name `nikolearn-t`.
   2. Paste `cloudflare/telemetry-worker.js`. Settings → Variables → **KV namespace**: create
      `NIKO_T`, bind as `NIKO_T`. Deploy.
   3. Copy the URL (e.g. `https://nikolearn-t.<account>.workers.dev`). Tell me → I set
      `NIKO_T_ENDPOINT='…/v1/t'` in `niko/telemetry.js`, add the `<script>` to index.html, wire the
      events + parental gate, and verify (acceptance: only first-party `/v1/t`, IP-drop path, no
      cookie/persistent id, telemetry fires only after the gate).
   - ⚠️ NikoLearn lives at `gshoina.github.io/NikoLearn` (GitHub Pages, no custom Cloudflare domain),
     so the endpoint is a `workers.dev` subdomain unless you add a domain to Cloudflare. That's fine
     and first-party-enough; a custom domain is optional polish.
   - Do NOT enable Logpush / IP-retaining analytics on this Worker (the manifest promises IP is dropped).
   - Sign Cloudflare's GDPR DPA (Cloudflare acts as a transient edge processor that does not persist PII).

**B) Remove GA4 — a STRATEGIC reversal, your call.**
   The task says remove GA4 from index.html + landing.html. **I did NOT do it**, because:
   - A few hours ago we SET UP GA4 + Clarity and you connected them and were using them.
   - Removing GA4 before the replacement is live = zero analytics in between.
   - It's a real privacy/COPPA improvement (GA4 on a kids app sends the child's IP to Google), so the
     direction is sound — but the *timing* + the reversal deserve your explicit OK.
   - **Recommended sequence:** deploy the Worker (A) → wire + verify the first-party telemetry is live →
     THEN remove GA4 (and decide on Clarity: it's landing-only, parents-only, so it can stay, but for a
     fully privacy-pure stance you may drop it too).

## Drafted, not applied (customer-facing — needs your OK)
**Reworded brand promise (truthful):**
> „პერსონალური მონაცემები რჩება შენს მოწყობილობაზე. ვაგროვებთ მხოლოდ ანონიმურ, აგრეგირებულ
> სტატისტიკას (სახელის, იდენტობის და დღეთაშორის თვალთვალის გარეშე), რომ გაკვეთილები გავაუმჯობესოთ."

**Data-scrubbing manifest** (to publish as a page once telemetry is live): what's collected (the
allow-list above), IP is dropped at the edge, no PII, no cookies, no cross-day tracking, Cloudflare =
transient processor under DPA, legal basis = COPPA "support for internal operations" (anonymous,
aggregate, functional) — the parental gate is a courtesy, not the consent mechanism.

## Explicit tradeoff (as the spec requires)
True per-user D7/D30 retention needs a persistent identifier = PII under COPPA → we do NOT do it.
Engagement is approximated with DAILY AGGREGATE counts (sessions/day, lessons/day, same-day return).
