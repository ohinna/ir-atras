// Bazaar — Service Worker vd38ced32
const CACHE_NAME = 'bazaar-d38ced32';
const FILES = ['/ir-atras/', '/ir-atras/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first: sempre tenta buscar da rede, só usa cache se offline
self.addEventListener('fetch', e => {
  // Só interceptar requests do próprio site
  if (!e.request.url.includes('ohinna.github.io') && !e.request.url.includes('localhost')) return;
  
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Atualiza cache com versão mais nova
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request)) // offline: usa cache
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
