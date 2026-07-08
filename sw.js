// Service worker minimal : rend l'app installable, réseau d'abord
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {
  // réseau d'abord ; en cas d'échec (hors-ligne), on tente le cache
  e.respondWith(
    fetch(e.request).then(res => {
      if (e.request.method === 'GET' && res.ok && new URL(e.request.url).origin === location.origin) {
        const clone = res.clone();
        caches.open('territoire-v1').then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
