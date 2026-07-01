# NikoLearn — First-Run Flow · Extracted Source (v2 prototype)

**Source:** `Downloads/ნიკო - სწრაფი დაწყება (ერთიანი).html` (1.05 MB bundler artifact)

## Bundler format (decoded)
- `<script type="__bundler/manifest">` = JSON dict `uuid -> {mime, compressed, data(base64)}`.
  Holds ONLY binary assets: 26 × `font/woff2`, 1 × `image/png` (thumbnail), 1 × `text/javascript`
  (gzip, the runtime loader — NOT the designs).
- `<script type="__bundler/template">` = a JSON-encoded HTML string (122 KB decoded). **This is the real app document.** All 8 designs + 73 inline SVG icons live here as normal DOM, escaped only by JSON (`\"`, `\n`, `/`).
- `<script type="__bundler/ext_resources">` = empty `[]`.
- Runtime rebuilds `blobUrls`/`resourceMap` from the manifest, swaps woff2 UUIDs into the template. No custom encoding beyond base64 (fonts) + gzip (loader) + JSON-string (template).

## Canvas layout
The template is a `design_doc_mode=canvas` board: HEADER + 8 numbered screens (`<!-- N · ... -->`) + a 9th "LOGIC FOR THE AGENT" notes block, all absolute-positioned. Each extracted file neutralises the absolute offset so it renders standalone.

## Google font
`Inter` + `Poppins` + `Noto Sans Georgian` (Google Fonts). Classes: `.geo` = Noto Sans Georgian/Inter, `.pop` = Poppins/Noto Sans Georgian. Original woff2 were inlined as blob URLs; standalone files re-link the Google Fonts CDN.

## Shared design tokens (recurring)
Ink `#2A1C12` / `#2A1810` · orange brand `#FF8A00` (accents `#FFB04A`/`#F0A400`/`#E59800`) · success green `#00C48C`/`#0E9E78` · alert red `#E2483D`/`#B8522A` · cream backgrounds `#FAF5EC`/`#FFF3DF`/`#F1E4D0` · muted `#9C8064`/`#B8A88E`. Home screen adds category hues: blue `#2E86DE`, pink `#EC4899`.

## Designs
| File | # | Screen (KA) | Purpose (EN) | SVG icons |
|---|---|---|---|---|
| design-00-header.html | 0 | HEADER | board title/legend | 0 |
| design-01.html | 1 | გახსნა · ნიკო გხვდება ხმით | OPEN — voice greet + 3 big buttons, one screen | 5 |
| design-02.html | 2 | შეხება · ბავშვი ირჩევს | TAP — child picks one of the pictures | 4 |
| design-03.html | 3 | „ყოჩაღ, წავედით!" | "GREAT, LET'S GO" ~1s transition to task | 3 |
| design-04.html | 4 | პირველი დავალება · ხმა + სურათი | FIRST TASK — voice + pictures, no writing | 14 |
| design-05.html | 5 | პირველი მოგება · 1 წუთში | FIRST WIN under a minute (green celebrate) | 7 |
| design-06.html | 6 | მთავარი · ჟელე ბარათები + წყლის დოკი | HOME — jelly cards + water-dock nav | 11 |
| design-07.html | 7 | რიცხვების გზა · დაკლაკნილი ბილიკი | SUBJECT winding path (numbers journey) | 10 |
| design-08.html | 8 | საფეხურის ბარათები · მათემატიკის შიგნით | STAGE activities inside a math subject | 16 |
| design-09-agent-notes.html | 9 | ლოგიკა აგენტისთვის | designer's build notes (not a UI screen) | 3 |

## Icons
`icons/icon-NN_d<block>.svg` — 73 files (block tag = which screen it came from) + `icons/index.html` gallery.
Source SVGs carry **no** `id`/`class`/`aria-label`/`<title>`, so they cannot be named by purpose — named by index + originating design. `xmlns` injected where missing so each renders standalone.

## Decode failures / notes
- None fatal. All 73 SVGs and all 9 blocks decoded cleanly from the template.
- The `text/javascript` manifest blob (gzip, 58 KB) is the runtime asset-loader only; it contains **no** design markup — safely ignored for rebuild.
- 26 woff2 font blobs were NOT extracted to disk (large binaries, reproducible from Google Fonts); standalone files link the CDN instead.
- Absolute canvas offsets were stripped per file so each screen renders top-aligned; original board coordinates remain in the source file if exact layout is needed.
