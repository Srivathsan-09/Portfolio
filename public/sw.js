const CACHE_NAME = 'portfolio-cache-v10';

// Critical core assets to pre-cache immediately on service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/dslr_camera.glb',
  '/favicon.svg',
  '/icons.svg',
  '/images/about.jpg',
  '/images/about-mobile.jpg',
  '/images/hero.webp',
  '/images/hero.png',
  '/images/hero-mobile.jpg',
];

// Regex filters for resource categories
const GLB_REGEX = /\.(glb|gltf)$/i;
const IMAGE_REGEX = /\.(webp|jpg|jpeg|png|gif|svg|ico)$/i;
const FONT_REGEX = /\.(woff2|woff|ttf|otf)$/i;
const ASSETS_REGEX = /\/assets\//i;

// 1. Install Event: Pre-cache core shell, 3D camera model, and critical photography
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[SW] Pre-caching skipped for ${url}:`, err);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Purge older cache versions and take immediate control of clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Multi-tiered caching strategy tailored for ultra-fast repeat visits
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') return;

  // STRATEGY A: 3D Camera Models (.glb / .gltf) — Cache-First for instant 0ms load
  if (GLB_REGEX.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // STRATEGY B: Content-Hashed Vite JS/CSS Bundles & Web Fonts — Cache-First
  if (
    ASSETS_REGEX.test(url.pathname) ||
    FONT_REGEX.test(url.pathname) ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // STRATEGY C: Photographs & Image Assets — Stale-While-Revalidate (Instant display + silent refresh)
  if (IMAGE_REGEX.test(url.pathname) || url.pathname.includes('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // STRATEGY D: HTML Navigation / Root Document — Network-First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }
});
