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

## Kings free/paid split — [HYPOTHESIS], demo-only (2026-06-23)
- Current split (when premium is OFF, demo only): FREE = the Kings test + 1-2 simple modes
  (eng: ლექსიკა, მოსმენა · math: კანონზომიერება + basic add/sub/mul); PREMIUM 🔒 = the deeper modes +
  Test Room. Premium defaults ON, so today everything is open (free launch + owner test access).
- **VALIDATE BEFORE charging:** the split is a guess. Confirm with real conversion/willingness-to-pay data
  before wiring payment. Adjust which modes are free based on what drives the upgrade.
