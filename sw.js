const CACHE_NAME = "electwise-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css?v=1.1",
  "./css/style-part2.css?v=1.1",
  "./js/app.js?v=1.1",
  "./js/checklist.js",
  "./js/exports.js",
  "./js/i18n.js",
  "./js/quiz.js",
  "./js/scenarios.js",
  "./js/timeline.js",
  "./data/jurisdictions.js",
  "./manifest.json"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
