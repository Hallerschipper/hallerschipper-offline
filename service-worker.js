const CACHE_NAME = 'hallerschipper-offline-v2';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './songs.js',
  './logo.png',
  './manifest.webmanifest'
];

// Installation
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Alte Cache-Versionen löschen
self.addEventListener('activate', event => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );

});

// Dateien laden
self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;

  // songs.js immer zuerst vom Internet holen
  if (event.request.url.includes('songs.js')) {

    event.respondWith(

      fetch(event.request)
        .then(response => {

          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });

          return response;

        })
        .catch(() => caches.match(event.request))

    );

    return;

  }

  // Alle anderen Dateien zuerst aus dem Cache
  event.respondWith(

    caches.match(event.request).then(response => {

      return response || fetch(event.request).then(networkResponse => {

        const copy = networkResponse.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, copy);
        });

        return networkResponse;

      });

    })

  );

});
