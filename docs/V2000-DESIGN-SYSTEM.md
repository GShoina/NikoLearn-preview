# v2.000 — app-wide design system (owner 2026-07-02, "super fine, catchy, high standard")

## Why the owner saw "no difference" (root cause, owned)
The only v2 change so far (first-run flow) is gated behind CREATING A NEW PROFILE. On a phone that already
has profiles, it never shows, so the app looked identical to live. That was too little + too hidden for what
"v2.000" should be. v2.000 must be a VISIBLE, app-wide design leap, not one hidden onboarding screen.

## Reframe (meta prompt architect) + honest correction
"v2.000 super fine/catchy" = the whole app re-skinned to the owner's prototype's standard. Split of labour:
- DESIGN SOURCE OF TRUTH = the owner's prototype `ნიკო - სწრაფი დაწყება (ერთიანი)` (design-01..08). Already high standard.
- IMPLEMENTATION (CSS/layout/components app-wide) = a CODING model + the prototype as the spec. NOT Fable5.
- COPY / microtext inside the design = Fable5 (its real edge is Georgian text, not UI/CSS).
Honest: "Fable5 does design 100x better" is true for TEXT, not for visual/UI. The prototype is the design; the
job is to implement it faithfully everywhere. (Said plainly, not to agree for agreement's sake.)

## v2.000 = a shared DESIGN SYSTEM applied to every screen
Tokens (from prototype MANIFEST): ink #2A1C12 · brand #FF8A00 (+#FFB04A/#F0A400) · green #00C48C · red #E2483D ·
cream #FAF5EC/#FFF3DF · category hues blue #2E86DE / pink #EC4899 · Poppins (self-host) + Noto Sans Georgian.
Shared components to standardise once, reuse everywhere: back button, subject/mode tiles (jelly), currency
(🪙 coins, never stars), progress cards, celebration, top bar, buttons, chips.

## Owner's concrete points → mapped
1. First-run hidden -> make v2 visible app-wide (this doc). [addressed]
   Copy call: "რა გინდა ვითამაშოთ?" keep "ვითამაშოთ" (play = warm/kid). Flippable to "გამოვცადოთ" on owner taste.
2. Currency = 🪙 COINS, not stars. App already uses 🪙 (home/chip); the first-run wrongly used a star -> FIXED
   (firstrun.js coin). Sweep the app for any remaining star-as-currency (LEVELS ⭐ is a LEVEL badge, not currency, keep).
3. Subject tiles [🔤/🧮 + name] wrap/collide -> responsive/adaptive tile layout. [agent installment-1]
4. (owner skipped)
5. Back "<" button: inconsistent (round .iconbtn vs .mv2 square vs chevron), disliked -> ONE creative consistent
   back button everywhere. [agent installment-1]
6. ka-alpha menu ([ისწავლე ასოები]/[შეადგინე სიტყვა]) shows Latin where Georgian belongs -> Georgian ა ბ გ.
   (en-alpha "A B C" is correct, leave it.) [agent installment-1]
7. Whole app to v2.000 standard -> phased design-system rollout below.

## Phased rollout (visible + verified each step, §6c, preview -> GO)
- Installment 1 (in progress, coding agent): coins fix + responsive tiles + unified back button + Georgian
  alphabet samples. These are on screens the owner already sees = immediately visible difference.
- Installment 2: shared v2 tokens + self-hosted Poppins; re-skin HOME to design-06 (jelly cards + coins/streak +
  continue-card + dock).
- Installment 3: re-skin SUBJECT + ROUND screens to design-07/08 (winding path + stage cards) + results.
- Installment 4: first-run made demoable for the owner (a preview trigger) + polish/celebration + Fable microcopy pass.
Guardrails: §7b preview->GO before any live; §6c render-verify each; no em dash; coins currency; no regressions.
