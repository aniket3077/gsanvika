const CACHE_NAME = 'global-saanvika-v1';

// Assets to cache
const STATIC_ASSETS = [
  '/',
  '/logo.png',
  '/manifest.json',
  '/favicon.ico',
  // Add other static assets here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - serve from cache, then network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Firebase API requests
  if (event.request.url.includes('firestore.googleapis.com')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) return response;

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not a success response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cache the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
}); 