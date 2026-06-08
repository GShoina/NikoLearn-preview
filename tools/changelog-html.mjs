#!/usr/bin/env node
/* changelog-html.mjs — build a compact, collapsible HTML version-history from docs/CHANGELOG.md.
   Run from the repo root:  node tools/changelog-html.mjs
   Output: output/NikoLearn-changelog.html  (living owner reference; output/ is gitignored).
   The markdown CHANGELOG.md stays the single source of truth; re-run this after each release. */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const md = readFileSync('docs/CHANGELOG.md', 'utf8');
const lines = md.split(/\r?\n/);

// ── parse ──────────────────────────────────────────────────────────────────
const intro = [];
const versions = [];
let cur = null, seenH2 = false;
for (const line of lines) {
  const h2 = line.match(/^##\s+(.+)$/);
  if (h2) { cur = { head: h2[1].trim(), bullets: [] }; versions.push(cur); seenH2 = true; continue; }
  if (!seenH2) { if (line.trim() && !/^#\s/.test(line)) intro.push(line.trim()); continue; }
  const b = line.match(/^-\s+(.+)$/);
  if (b) cur.bullets.push(b[1].trim());
  else if (/^\s+\S/.test(line) && cur && cur.bullets.length) cur.bullets[cur.bullets.length - 1] += ' ' + line.trim();
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>');

function splitHead(head) {
  const parts = head.split('—');                       // em dash separates version — date
  const ver = (parts[0] || '').trim();
  const rest = parts.slice(1).join('—').trim();
  const date = (rest.match(/\d{4}-\d{2}-\d{2}/) || [''])[0];
  const title = (rest.match(/\(([^)]+)\)/) || ['', ''])[1];
  return { ver, date, title };
}

const current = versions.length ? splitHead(versions[0].head).ver : '';

const cards = versions.map((v, i) => {
  const { ver, date, title } = splitHead(v.head);
  const open = i < 3 ? ' open' : '';
  const items = v.bullets.map(b => `<li>${inline(b)}</li>`).join('\n        ');
  return `    <details${open}>
      <summary>
        <span class="ver">${esc(ver)}</span>
        ${date ? `<span class="date">${esc(date)}</span>` : ''}
        ${title ? `<span class="title">${esc(title)}</span>` : ''}
      </summary>
      <ul>
        ${items}
      </ul>
    </details>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="ka">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NikoLearn — ვერსიების ისტორია</title>
<style>
  :root{ --bg:#f6f7fb; --card:#fff; --ink:#1f2433; --muted:#6b7385; --line:#e6e8f0;
         --accent:#6B63B5; --accent-soft:#eef0fb; --code:#eef1f6; }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
       font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans Georgian",Roboto,sans-serif;
       padding:28px 16px 60px}
  .wrap{max-width:760px;margin:0 auto}
  header.top{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:6px}
  h1{font-size:22px;margin:0;font-weight:700}
  .now{background:var(--accent);color:#fff;border-radius:999px;padding:3px 11px;font-size:13px;font-weight:600}
  .sub{color:var(--muted);font-size:13.5px;margin:0 0 18px}
  .tools{display:flex;gap:8px;margin:0 0 18px}
  .tools button{border:1px solid var(--line);background:var(--card);color:var(--muted);
       border-radius:8px;padding:6px 12px;font-size:13px;cursor:pointer}
  .tools button:hover{border-color:var(--accent);color:var(--accent)}
  details{background:var(--card);border:1px solid var(--line);border-radius:12px;
       margin:0 0 10px;overflow:hidden}
  details[open]{box-shadow:0 1px 4px rgba(31,36,51,.05)}
  summary{list-style:none;cursor:pointer;padding:13px 16px;display:flex;align-items:center;
       gap:10px;flex-wrap:wrap;user-select:none}
  summary::-webkit-details-marker{display:none}
  summary::before{content:"▸";color:var(--accent);font-size:13px;transition:transform .15s;flex:none}
  details[open] summary::before{transform:rotate(90deg)}
  .ver{font-weight:700;color:var(--accent);font-size:15px}
  .date{color:var(--muted);font-size:12.5px;font-variant-numeric:tabular-nums}
  .title{color:var(--ink);font-size:13.5px;opacity:.85}
  ul{margin:0;padding:2px 18px 16px 40px}
  li{margin:6px 0;color:#333a4d}
  li strong{color:var(--ink)}
  code{background:var(--code);border-radius:5px;padding:1px 5px;font-size:12.5px;
       font-family:"SF Mono",Consolas,monospace}
  footer{color:var(--muted);font-size:12px;text-align:center;margin-top:26px}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>NikoLearn — ვერსიების ისტორია</h1>
    ${current ? `<span class="now">ახლა ${esc(current)}</span>` : ''}
  </header>
  <p class="sub">${intro.map(esc).join(' ')}</p>
  <div class="tools">
    <button onclick="document.querySelectorAll('details').forEach(d=>d.open=true)">ყველას გახსნა</button>
    <button onclick="document.querySelectorAll('details').forEach(d=>d.open=false)">ყველას ჩაკეცვა</button>
  </div>
${cards}
  <footer>გენერირებულია docs/CHANGELOG.md-დან · tools/changelog-html.mjs</footer>
</div>
</body>
</html>
`;

mkdirSync('output', { recursive: true });
const out = 'output/NikoLearn-changelog.html';
writeFileSync(out, html);
console.log(`changelog → ${out}  (${versions.length} versions, current ${current})`);
