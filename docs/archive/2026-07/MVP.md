# NikoLearn — Class Pilot MVP (North Star: your child's class, 20–25 kids)

## The one thing to clear up first (business context)
NikoLearn is a **static app** — each child runs their own copy on their own device, data stays
local. So **"supporting 20–25 kids" is NOT a server/load problem.** Static hosting (GitHub Pages /
any CDN) serves unlimited kids for free. 20 kids = 20 independent local copies. It already scales.

A **backend** would add only ONE thing: a **central place for the teacher to see every child's
progress** (plus a shared link and copy-protection). For a *first pilot*, you don't need that —
each device shows its own progress + a "report export" the parent/teacher can share.

**Recommendation (my call):** run the pilot **without a backend**. Deploy the PWA to a live link,
each kid uses their own device/profile, collect feedback. Add the teacher dashboard later **only
if** the pilot shows the teacher wants central visibility. Fastest to real feedback, 0₾, no
over-engineering.

## MVP = "Class Pilot v1" — ready when ALL true
1. **Live link works on a phone** — mobile-first, installable, works offline after first open.
2. **A child can play with NO adult reading for them** — visual-first, in BOTH paths:
   non-reader (Masho, 5) and reader (Niko, 7).
3. **Zero dead-ends in the young path** — every screen has a clear way forward + a close (✕); no
   freezes, no silent/blank screens. (This is what kills a pilot on a 5-yo.)
4. **Enough content for ~15–20 min of varied play**: counting, English words, **everyday phrases**,
   alphabet (ka + en), math (graded).
5. **Voice is honest** — English audio works; Georgian is NEVER read with the English voice
   (silence or a recorded clip, never gibberish).
6. **Progress persists per child on the device**; parent/teacher can see a simple summary + export.
7. **Trust**: no ads, no external links, data stays on device; show the parent trust line.
8. **Tested on 1–2 real phones** the class actually uses (not just desktop).

## What to do to run the 20–25 pilot
| # | Item | Status |
|---|------|--------|
| 1 | Content depth: phrases + more words/math (so it's not exhausted in one sitting) | in progress |
| 2 | Harden the non-reader path (no freezes/dead-ends) | in progress |
| 3 | Deploy to a live link (needs owner "go" once — first-deploy gate) + public hosting | pending owner go |
| 4 | One-page "how to use" for parents/teacher (link, profile, that data is on-device) | pending |
| 5 | Teacher dashboard (central progress) | **deferred** — only if pilot wants it (backend) |

## After the pilot decides it
If the teacher wants central progress for the whole class → that's when the backend earns its
keep (dashboard + shared accounts + copy-protection). Not before.

---

## Feedback & data durability — the pilot's real job is INSIGHTS

**Device reality (correction):** a 5–7-yo rarely has their own phone. Real access = a **parent's
phone at home** or a **few shared tablets in class**. So the pilot runs on SHARED devices → the
multi-profile home ("who's playing?") is the primary model, NOT one-device-per-kid. The home grid
already holds many kids on one device.

**How we actually collect insight (20–25 kids → qualitative-first):**
1. **On-device, already recorded:** each profile tracks accuracy / streak / time per subject; the
   parent screen turns it into plain language ("Niko: strong on counting, struggles with animals").
2. **Parent survey = the primary signal.** A 5-question form after week 1: did the child come back?
   what did they love / avoid? did it hold attention? would you keep using it? 25 families = rich data.
3. **2–3 short parent interviews** for depth. At this scale, qualitative beats any dashboard.
4. **Optional consented quant pipe (needs owner go):** a one-tap "share with teacher" that sends an
   **anonymous** summary (random id + age band + per-exercise stats — NEVER the child's name) to a
   free Google Sheet. Parent taps it each time → preserves "data stays on device *by default*".

**How long does local data survive? (honest)** localStorage persists indefinitely UNLESS: the user
clears browser data / switches browser, OR **iOS evicts storage for web apps not added to the Home
Screen after ~7 days of inactivity** (a real iOS rule). Mitigations now in code:
- the app requests **persistent storage** (`navigator.storage.persist()`) so the browser won't evict it;
- an **"Add to Home Screen / Install"** prompt — an installed PWA keeps its data and launches like a real app.
For a multi-week pilot, **"install it to the home screen"** is the single most important instruction to parents.

**Bottom line:** without at least the parent survey + "install it", the pilot ships a nice app but
produces no insight — defeating its purpose. The consented quant pipe is the cheapest way to add
real numbers if you want them.
