const CACHE_NAME = 'network-tracker-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/script.js'
];

// 1. Install: Кешуємо файли при першому запуску
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// 2. Fetch: Перехоплюємо запити. Якщо немає інету — беремо з кешу
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});