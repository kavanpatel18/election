const CACHE_NAME = "electwise-v4";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./css/style-part2.css",
  "./js/app.js",
  "./js/checklist.js",
  "./js/exports.js",
  "./js/i18n.js",
  "./js/quiz.js",
  "./js/scenarios.js",
  "./js/timeline.js",
  "./data/jurisdictions.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Only cache GET requests for same-origin assets
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        // Cache valid same-origin responses
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(e.request, cloned)
          );
        }
        return response;
      });
    })
  );
});
