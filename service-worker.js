const CACHE_NAME = 'mugol-portal-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Service Worker yüklendiğinde
self.addEventListener('install', (event) => {
  console.log('Service Worker: Yükleniyor...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache açıldı');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache hatası:', error);
      })
  );
  self.skipWaiting();
});

// Service Worker aktif olduğunda
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Aktif');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch istekleri
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache'de varsa döndür
        if (response) {
          return response;
        }

        // Yoksa network'ten al
        return fetch(event.request)
          .then((response) => {
            // Geçerli bir response değilse döndür
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Response'u klonla ve cache'e ekle
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network hatası - offline sayfası göster (opsiyonel)
            console.log('Network hatası');
          });
      })
  );
});

// Push notification desteği (opsiyonel)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Yeni bildirim',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('MuGöl Portal', options)
  );
});

// Notification tıklama
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
