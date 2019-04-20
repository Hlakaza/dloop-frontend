var staticCacheName = 'dloop-v0';
// sw.js
self.addEventListener('install', e => {
  e.waitUntil(
    // after the service worker is installed,
    // open a new cache
    caches.open(staticCacheName).then(cache => {
        // add all URLs of resources we want to cache
        return cache.addAll([
          // './',
          // '/index.html',
          './manifest.json',
          './assets/'
        ]);
    })
  );
});
// When the webpage goes to fetch files, we intercept that request and serve up the matching files
// if we have them
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});