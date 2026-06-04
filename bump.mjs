#!/usr/bin/env node
// NikoLearn single-source version bump.
// APP_VERSION in niko/screens.js is the ONE source of truth.
// Running `node bump.mjs` from the repo root: minor +1, then syncs the
// landing.html footer and the sw.js cache name to the same number.
// Format: major.minor  (e.g. 1.49 -> 1.50 -> 1.51 ...). Always moves forward.
import { readFileSync, writeFileSync } from 'fs';

const SCREENS = 'niko/screens.js', LANDING = 'landing.html', SW = 'sw.js';

const s = readFileSync(SCREENS, 'utf8');
const m = s.match(/APP_VERSION='(\d+)\.(\d+)'/);
if (!m) { console.error('ERROR: APP_VERSION not found in ' + SCREENS); process.exit(1); }
const v = `${m[1]}.${parseInt(m[2], 10) + 1}`;

writeFileSync(SCREENS, s.replace(/APP_VERSION='[\d.]+'/, `APP_VERSION='${v}'`));
writeFileSync(LANDING, readFileSync(LANDING, 'utf8').replace(/title="owner">v[\d.]+/, `title="owner">v${v}`));
writeFileSync(SW, readFileSync(SW, 'utf8').replace(/nikolearn-[\w.]+/, `nikolearn-${v}`));

console.log(`bumped to ${v}  (screens APP_VERSION + landing footer v${v} + sw cache nikolearn-${v})`);
