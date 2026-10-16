const CACHE_NAME = 'survive-v5';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './favicon.svg',
  './icon.svg'
];
// 未經建置直接部署時使用的原始檔；建置版不存在這些路徑，個別失敗不影響安裝
const OPTIONAL_ASSETS = [
  './src/style.css',
  './src/js/app.js',
  './src/js/backup.js',
  './src/js/calculator.js',
  './src/js/checklist.js',
  './src/js/data.js',
  './src/js/light.js',
  './src/js/memo.js',
  './src/js/search.js',
  './src/js/settings.js',
  './src/js/sos.js',
  './src/js/storage.js',
  './src/js/torch.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).then(() =>
        Promise.all(OPTIONAL_ASSETS.map((url) => cache.add(url).catch(() => {})))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
