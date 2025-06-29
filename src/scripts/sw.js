// src/scripts/sw.js
const CACHE_NAME = 'story-app-v1'; // Nama cache untuk versi aplikasi Anda. Ubah jika ada pembaruan shell.
const urlsToCache = [ // Daftar URL aset Application Shell yang akan di-cache
  '/', // URL root aplikasi (seringkali mengarah ke index.html)
  '/index.html',
  '/styles.css', // Sesuaikan dengan nama file CSS Anda
  '/app.bundle.js', // Sesuaikan dengan nama file JavaScript bundle Webpack Anda
  '/public/images/logo.png', // Sesuaikan path aset Anda
  '/public/favicon.png', // Sesuaikan path aset Anda
  '/public/manifest.json', // Sesuaikan path aset Anda

  // --- Opsi: Aset eksternal yang ingin di-cache untuk offline ---
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  // Penting: Google Maps API Script dari CDN sangat besar dan sering update.
  // Meng-cache-nya bisa rumit karena URL-nya mungkin berisi API Key dan parameter callback.
  // Jika Anda meng-cache-nya, pastikan URL-nya persis sama dengan yang ada di index.html.
  // Contoh: 'https://maps.googleapis.com/maps/api/js?key=YOUR_Maps_API_KEY&callback=initMap',
  // Umumnya, untuk Maps API, lebih baik biarkan ia diunduh dari jaringan.
];

// 1. Event 'install': Meng-cache aset Application Shell
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing and Caching App Shell');
  event.waitUntil(
    caches.open(CACHE_NAME) // Buka cache dengan nama yang ditentukan
      .then((cache) => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(urlsToCache); // Tambahkan semua URL ke cache
      })
      .then(() => self.skipWaiting()) // Mengaktifkan Service Worker baru segera setelah diinstal
      .catch((error) => {
        console.error('Service Worker: Failed to cache assets', error);
      })
  );
});

// 2. Event 'activate': Membersihkan cache lama
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating and Cleaning Old Caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME; // Filter cache yang tidak cocok dengan nama cache saat ini
        }).map((cacheName) => {
          return caches.delete(cacheName); // Hapus cache lama
        })
      );
    })
    .then(() => self.clients.claim()) // Mengambil kontrol halaman segera setelah aktivasi
  );
});

// 3. Event 'fetch': Menyajikan aset dari cache atau jaringan
self.addEventListener('fetch', (event) => {
  // Strategi Cache First untuk Application Shell
  // Ini berarti Service Worker akan mencoba mengambil respons dari cache terlebih dahulu.
  // Jika tidak ada di cache, baru pergi ke jaringan.
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Jika ditemukan di cache, sajikan dari cache
      }
      // Jika tidak ada di cache, lakukan permintaan jaringan
      return fetch(event.request).then((networkResponse) => {
        // Opsi: Cache respons jaringan baru untuk aset yang sering diminta atau API
        // Misalnya, cache respons dari API stories jika itu adalah GET request dan berhasil
        if (event.request.url.startsWith('https://story-api.dicoding.dev/v1/stories') && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback offline: Jika gagal dari jaringan (karena offline), sajikan halaman offline
        // atau fallback ke index.html (Application Shell)
        // Ini memastikan UI dasar selalu ada bahkan saat offline
        return caches.match('/index.html');
      });
    })
  );
});

// --- Push Notification Logic (dari panduan sebelumnya) ---
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received!');
  const data = event.data.json();

  const title = data.title || 'Pesan Baru';
  const options = {
    body: data.options.body || 'Anda memiliki pesan baru.',
    icon: '/public/images/logo.png', // Ganti dengan path ikon aplikasi Anda
    badge: '/public/images/favicon.png', // Ganti dengan path badge ikon Anda
    vibrate: [200, 100, 200],
    data: {
      url: 'https://story-api.dicoding.dev/v1' // URL yang akan dibuka saat notifikasi diklik
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked!', event.notification.data);
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});