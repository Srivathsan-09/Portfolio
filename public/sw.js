const CACHE_NAME = 'portfolio-images-v7';
const IMAGE_REGEX = /\.(webp|jpg|jpeg|png|gif|svg)$/i;

// Activate service worker immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Stale-While-Revalidate strategy for image assets so updates reflect immediately
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Intercept image assets (local /images/ or image files)
  if (IMAGE_REGEX.test(url.pathname) || url.pathname.includes('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
