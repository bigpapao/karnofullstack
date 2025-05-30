// Service Worker for Karno E-commerce Platform
const CACHE_NAME = 'karno-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/main.chunk.js',
  '/static/js/vendors.chunk.js',
  '/static/css/main.chunk.css',
  '/static/media/logo.png',
  '/static/media/favicon.ico',
  '/offline.html'
];

// Install service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  // Cache core assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching Assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch resources
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching');
  
  event.respondWith(
    // Try the cache
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then(response => {
            // Make a copy of the response
            const responseClone = response.clone();
            
            // Open the cache
            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache successful responses and API requests from our domain
                if (response.status === 200 && 
                    (event.request.url.indexOf('http') === 0) && 
                    !event.request.url.includes('/api/')) {
                  cache.put(event.request, responseClone);
                }
              });
            
            return response;
          })
          .catch(() => {
            // If request is for an HTML page, return the offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Handle background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

// Background sync function for cart
async function syncCart() {
  try {
    const data = await localforage.getItem('offline-cart-data');
    if (data) {
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      await localforage.removeItem('offline-cart-data');
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/static/media/logo.png',
    badge: '/static/media/badge.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
}); 