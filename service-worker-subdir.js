// GitHub Pages alt dizin için (örn: username.github.io/repo-name)
// Eğer doğrudan username.github.io kullanıyorsanız, diğer service-worker.js'i kullanın

const CACHE_NAME = 'mugol-portal-v2';

// Service Worker yüklendiğinde
self.addEventListener('install', (event) => {
  console.log('Service Worker: Yükleniyor...');
  // Basit kurulum, cache'i sonra dolduracağız
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

// Fetch istekleri - sadece aynı origin
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Sadece kendi domain'imizdeki istekleri işle
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            // Geçerli response değilse veya sayfa değilse, direkt döndür
            if (!response || response.status !== 200) {
              return response;
            }

            // HTML, CSS, JS ve image dosyalarını cache'le
            const contentType = response.headers.get('content-type');
            if (contentType && (
              contentType.includes('text/html') ||
              contentType.includes('text/css') ||
              contentType.includes('javascript') ||
              contentType.includes('image')
            )) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Offline durumunda mevcut cache'i kullan
            console.log('Network hatası, cache kullanılıyor');
            return caches.match('./index.html');
          });
      })
  );
});

// Push notification
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Yeni bildirim',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification('MuGöl Portal', options)
  );
});

// Notification tıklama
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('./')
  );
});
