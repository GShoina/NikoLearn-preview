# NikoLearn — Stats / Reports Data Hygiene (owner + tester exclusion)

**Owner-set 2026-06-28.** Single place that documents how owner/tester activity is kept OUT of the
real-user stats and reports, so launch numbers (usage, abandon, retention) are trustworthy.

## The rule: exclude by DEVICE, never by IP
We **never capture or store IP** (privacy promise + COPPA for a kids' app — see analytics.js header).
So exclusion is per-device, not per-network. This is intentionally **better than IP filtering**:
- a phone on cellular / other Wi-Fi has a different IP (IP filter would miss it; device flag catches it),
- home/office IPs change over time (DHCP/ISP),
- it adds zero PII.

A flagged device sets sticky `localStorage['niko_owner'] = '1'`. While set, `analytics.js` short-circuits
ALL telemetry (`OFF = LOCAL || DNT || OWNER || NOTRACK`, plus a live re-check in `fanout()`), so nothing
from that device ever reaches the worker.

## How to flag a device (do this once per device)
Open **`https://nikolearn.com/?notrack=1`** once on each device you test from. `?notrack=1` is sticky:
it writes `niko_owner=1` immediately and stays excluded forever on that device, on any network.
(The PIN-gated **parent space** also sets `niko_owner=1` on that device.)

## Owner / tester device registry
Flag every device below with `?notrack=1` (or open the parent space) once:
- [x] owner phone (primary tester) — flagged 2026-07-01
- [x] owner laptop — flagged 2026-07-01
- [ ] owner tablet / any other test device
- [ ] any team tester's device

## Reference only — NOT used for filtering
- **Home IP:** `178.134.159.212` (recorded at owner's request, 2026-06-28). We do **not** filter on it
  (no IP is stored). Listed only so a human reading a future raw log understands which visits were the
  owner's home. The device-flag above is what actually excludes that traffic.

## Reading past (pre-flag) data
Contaminated historical data can't be un-mixed by IP (none stored). Known pollution events are tracked
roughly by date instead — e.g. the 2026-06-25 `windows-188` spike = live-verify automation, not real users.
Going forward, with devices flagged, owner/tester traffic is excluded at the source.

## Where the logic lives (grouped)
- `niko/analytics.js` — `OFF` gate + `fanout()` live re-check (the actual exclusion).
- `niko/parent.js` / `niko/screens.js` — set `niko_owner=1` in the parent space.
- This doc — the policy + device registry SSOT.
