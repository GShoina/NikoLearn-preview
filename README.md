# NikoLearn

Offline, privacy-first learning PWA for young Georgian children (ages ~5–8).
Subjects: Georgian alphabet, English (themed vocabulary, ~100 everyday phrases, Cambridge YLE
"Kings" prep), counting, and math.

- **Stack:** vanilla JS + HTML + CSS — no build step, no framework, no runtime backend.
- **Data:** all progress in `localStorage` on the device. Zero ads, zero external links, zero
  network calls.
- **Entry point:** `index.html` at the repo root; modules live in `niko/`.
- **Live:** https://gshoina.github.io/NikoLearn/

## Status
Repository established by Claude Code. Target architecture, feature inventory, and the
operating/coding rules are in **`docs/HANDOFF.md`** (the project SSOT). The agent role &
operating agreement is in **`CLAUDE.md`**.

## How to run
Open `index.html` in a browser (or visit the live link). Login password: `12345`. The parent
space sits behind a math gate. To reset: clear the `localStorage` key `nikolearn_p2`.
