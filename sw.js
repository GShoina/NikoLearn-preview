// NikoLearn service worker — offline-first app shell (HANDOFF §6 priority 5).
const CACHE = 'nikolearn-v21';
const ASSETS = [
  './',
  './index.html',
  './landing.html',
  './manifest.json',
  './niko/styles.css',
  './niko/data.js',
  './niko/core.js',
  './niko/tutor.js',
  './niko/audio-manifest.js',
  './niko/audio.js',
  './niko/screens.js',
  './niko/games.js',
  './niko/alpha.js',
  './niko/owl.js',
  './niko/parent.js',
  './niko/tweaks.js',
  './favicon.svg'
];
self.addEventListener('install', e => {
  // Force-fetch each asset fresh from network (bypass HTTP cache) so a cache-version
  // bump always lands the latest files, even for returning visitors. Resilient: one
  // failed asset does not abort the whole install.
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(
    ASSETS.map(u => fetch(u, { cache: 'reload' }).then(resp => { if (resp && resp.ok) return c.put(u, resp); }).catch(() => {}))
  )).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Audio clips: cache on first play so they work offline afterwards (not precached: keeps install light + robust).
  if (e.request.url.includes('/niko/audio/')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      if (resp && resp.ok) { const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return resp;
    }).catch(() => r)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html'))));
});
