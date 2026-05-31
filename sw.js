// NikoLearn service worker — offline-first app shell (HANDOFF §6 priority 5).
const CACHE = 'nikolearn-v11';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './niko/styles.css',
  './niko/data.js',
  './niko/core.js',
  './niko/tutor.js',
  './niko/audio.js',
  './niko/screens.js',
  './niko/games.js',
  './niko/alpha.js',
  './niko/owl.js',
  './niko/parent.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html'))));
});
