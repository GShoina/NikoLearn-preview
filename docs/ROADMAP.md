# NikoLearn — Roadmap (parked ideas with a re-surface trigger)

Ideas intentionally NOT shipped now, each with the condition that should bring it back. Disk is the only
memory, so parked ideas live here instead of dying in chat.

## Parent: „რეპორტი მასწავლებელს" (Report to teacher) — PARKED 2026-06-23
- **What:** a copyable plain-text progress report a parent could hand to a child's teacher/tutor.
- **Why parked (red-team + first-principles):** at this pre-traction stage its preconditions don't exist:
  no teacher is using the app, parents aren't asking to share, and a thin auto-report shared externally
  could read as amateur and *hurt* the fragile brand. It also diluted the single parent action that
  actually matters now: leave feedback / contact (the activation + demand signal the project needs).
- **Code status:** `buildReport()` / `exportReport()` kept dormant + callable in `niko/parent.js`; only the
  UI button was removed. Re-adding = one button in the parent „გამოხმაურება" group.
- **RE-SURFACE TRIGGER:** when there's institutional credibility or pull — e.g. a tutoring center / school
  partnership, OR parents explicitly ask to share progress with a teacher. Then re-add the button and
  consider a cleaner PDF/format.

## Speaking: parent-as-judge „მოუსმინე → 👍/თავიდან" — PARKED 2026-06-23
- **What:** an optional explicit parent check on the child's spoken answer (the only privacy-safe way to get
  real „verification" without cloud STT). Currently shipped: model-reveal self-check + optional record→playback.
- **RE-SURFACE TRIGGER:** if usage shows parents sit with the child during Speaking and want a way to mark it.

## Kings free/paid split — PAYWALL OFF in MVP (owner red-team 2026-06-23)
- **DECISION (penetration > restriction for MVP):** the kids app ships with NO user-facing lock — every
  topic is free + open. Reasons: (1) there is no payment path, so a 🔒 the parent can't unlock is a pure
  dead-end; (2) the landing promises „free", so an in-app paywall breaks that promise + looks broken;
  (3) a fake lock measures nothing (a tap ≠ willingness-to-pay) and (4) gating creates tension in kids +
  parents (owner's own prior insight). The bottleneck now is activation + demand, not monetization.
- **Scaffolding kept + parked:** `kmode` / `isFreeMode` / `FREE_PREVIEW_MODES` (core.js) + `upsellPremium`
  stay in the code. The premium-OFF "preview the paywall" toggle was moved OUT of the parent UI INTO
  adminView (owner-only) — so the owner can still preview the future paid layout, but no real user hits a lock.
- **Current preview split (owner-only, when toggled in adminView):** FREE = Kings test + eng:ლექსიკა,მოსმენა /
  math:კანონზომიერება; the deeper modes + Test Room show 🔒. This split is a [HYPOTHESIS].
- **RE-SURFACE TRIGGER:** production launch WITH a real payment path + a retention/demand signal. THEN decide
  the real free/paid boundary from conversion data, and expose it to users. Until then: everything free.
