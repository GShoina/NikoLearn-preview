// NikoLearn service worker — offline-first app shell (HANDOFF §6 priority 5).
const CACHE = 'nikolearn-1.179';
const ASSETS = [
  './',
  './index.html',
  './landing.html',
  './privacy.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-180.png',
  './owl-logo.png',
  './niko/styles.css',
  './niko/i18n-strings.js',
  './niko/i18n-landing.js',
  './niko/i18n.js',
  './niko/data.js',
  './niko/core.js',
  './niko/analytics.js',
  './niko/tutor.js',
  './niko/audio-manifest.js',
  './niko/audio.js',
  './niko/screens.js',
  './niko/games.js',
  './niko/placement.js',
  './niko/talk.js',
  './niko/alpha.js',
  './niko/opentype.min.js',
  './niko/fonts/ka.ttf',
  './niko/owl.js',
  './niko/parent.js',
  './niko/tweaks.js',
  './assets/landing.css',
  './assets/landing.js',
  './assets/fonts/033e5f3c-a927-4a51-9e1b-bf6b87de3929.woff2',
  './assets/fonts/17b193c6-cd88-47a4-bc66-33a0806b785d.woff2',
  './assets/fonts/211f369b-9a76-4ebc-87b1-e174a7ca02fd.woff2',
  './assets/fonts/317e503d-a1e4-4f1c-96ce-14f1c398bc60.woff2',
  './assets/fonts/334fceb3-95bb-430c-8b06-db2b48eec454.woff2',
  './assets/fonts/9b6b9596-def4-4c32-8ceb-20da2421acab.woff2',
  './assets/fonts/9f988a93-aa93-49cc-a4e7-d7c6fa98fe30.woff2',
  './assets/fonts/a8bc2600-f500-49e0-8abf-9e3f491b22bd.woff2',
  './assets/fonts/c5d2ff7d-e9b0-4b91-8da7-e4647b8f9d94.woff2',
  './assets/fonts/e9bc4bb7-f0a0-4142-b87f-655cf70ad1f0.woff2',
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
  // Offline fallback to the app shell ONLY for page navigations. For a failed asset (JS/CSS/font),
  // returning index.html's HTML would corrupt it — let those fail cleanly instead.
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => {
    if (e.request.mode === 'navigate') return caches.match('./index.html');
    return Response.error();
  })));
});
