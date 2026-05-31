# NikoLearn

Offline, privacy-first learning PWA for young Georgian children (ages ~5–8).
Subjects: Georgian alphabet, English (themed vocabulary, ~100 everyday phrases, Cambridge YLE
"Kings" prep), counting, and math.

- **Stack:** vanilla JS + HTML + CSS — no build step, no framework, no runtime backend.
- **Data:** all progress in `localStorage` on the device. Zero ads, zero external links, zero
  network calls.
- **Entry point (target):** `NikoLearn Phase 1.html` at the repo root; modules live in `niko/`.

## Status
Repository established by Claude Code. Target architecture, feature inventory, and the
operating/coding rules are in **`docs/HANDOFF.md`** (the project SSOT). The agent role &
operating agreement is in **`CLAUDE.md`**.

## How to run
Open `NikoLearn Phase 1.html` in a browser. Login password: `12345`. The parent space sits
behind a math gate. To reset: parent space → "პროგრესის გასუფთავება", or clear the
`localStorage` key `nikolearn_p2`.
