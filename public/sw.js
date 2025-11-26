// Service Worker for CME Platform
const CACHE_NAME = 'cme-platform-v1';
const urlsToCache = [
  '/',
  '/auth/login',
  '/dashboard/hcp',
  '/dashboard/organizer',
  '/dashboard/vendor',
  '/dashboard/regulator',
  '/dashboard/event-manager',
  '/manifest.json',
];

// Install event - cache resources
globalThis.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache install failed', error);
      })
  );
  globalThis.skipWaiting();
});

// Activate event - clean up old caches
globalThis.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
  return globalThis.clients.claim();
});

// Fetch event - serve from cache, fallback to network
globalThis.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fetch from network if not in cache
        return fetch(event.request)
          .then((networkResponse) => {
            // Don't cache non-GET requests or non-200 responses
            if (event.request.method !== 'GET' || !networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response for caching
            const responseToCache = networkResponse.clone();

            // Cache the response (don't wait for it)
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch(() => {
                // Ignore cache errors
              });

            return networkResponse;
          })
          .catch(() => {
            // If both cache and network fail, return offline page
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});


