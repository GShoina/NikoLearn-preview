#!/usr/bin/env node
// NikoLearn — repeatable Lighthouse UX/a11y/perf check (owner-approved 2026-06-19, #7 UX tooling).
// Runs Google Lighthouse against a URL and prints the category scores as a one-line summary so the
// nightly QA routine can flag regressions. Defaults to the LIVE app; pass a URL to target a local server.
//
//   node qa/lighthouse.mjs                         # live app
//   node qa/lighthouse.mjs http://localhost:8731   # local
//
// Uses Playwright's bundled Chromium (no separate Chrome install). A full HTML report is written to
// output/ (gitignored owner folder) for eyeballing; the console line is what the nightly job reports.
import { mkdirSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';

const URL = process.argv[2] || 'https://gshoina.github.io/NikoLearn/';
const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];

// find Playwright's Chromium
const PW = join(process.env.USERPROFILE || process.env.HOME, 'AppData/Local/ms-playwright');
let chrome = '';
try {
  for (const d of readdirSync(PW)) {
    if (d.startsWith('chromium-') && !d.includes('headless_shell')) {
      chrome = join(PW, d, 'chrome-win64', 'chrome.exe'); break;
    }
  }
} catch {}

mkdirSync('output', { recursive: true });
const jsonOut = join('output', '_lh.json');
const htmlOut = join('output', `lighthouse-${new Date().toISOString().slice(0,10)}.html`);

const args = [
  'lighthouse', URL,
  '--only-categories=' + CATS.join(','),
  '--output=json', '--output=html',
  '--output-path=' + join('output', '_lh'),     // lighthouse appends .report.json/.html
  '--chrome-flags=--headless=new --no-sandbox',
  '--quiet', '--max-wait-for-load=45000',
];
const env = { ...process.env };
if (chrome) env.CHROME_PATH = chrome;

console.log(`Lighthouse → ${URL}\n(chrome: ${chrome || 'system'})`);
execFileSync('npx', ['-y', ...args], { stdio: 'inherit', env, shell: true });

const rep = JSON.parse(readFileSync(join('output', '_lh.report.json'), 'utf8'));
const line = CATS.map(c => {
  const cat = rep.categories[c] || rep.categories[c.replace('best-practices','best-practices')];
  const s = cat ? Math.round(cat.score * 100) : '?';
  return `${c}:${s}`;
}).join('  ');
console.log('\nLH SCORES  ' + line);
