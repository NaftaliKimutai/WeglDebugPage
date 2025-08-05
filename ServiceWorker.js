const cacheName = "SmallCrewGames-Mines-2.2";
const contentToCache = [
    "Build/JdbMines1WebBuild.loader.js",
    "Build/JdbMines1WebBuild.framework.js",
    "Build/JdbMines1WebBuild.data",
    "Build/JdbMines1WebBuild.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => {
                        return name !== cacheName;
                    })
                    .map((name) => {
                        console.log("[Service Worker] Deleting old cache:", name);
                        return caches.delete(name);
                    })
            );
        })
    );

    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
