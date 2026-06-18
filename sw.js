// Bazaar — Service Worker v6f6f7556
const CACHE_NAME = 'bazaar-6f6f7556';
const FILES = ['/ir-atras/', '/ir-atras/index.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request).then(res => { const clone = res.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, clone)); return res; }).catch(() => caches.match(e.request))); });
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
