const CACHE_NAME = 'api-proxy-cache-v1';

// 1. Встановлення: просто активуємося відразу
self.addEventListener('install', (e) => self.skipWaiting());

// 2. Активація: чистимо старий кеш
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME && caches.delete(k))
    ))
  );
});

// 3. ПЕРЕХОПЛЕННЯ ЗАПИТІВ (Логіка проксі)
self.addEventListener('fetch', (event) => {
  // Кешуємо тільки GET запити до API (наприклад)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    // Спроба отримати дані з мережі
    fetch(event.request)
      .then((response) => {
        // Якщо відповідь успішна, копіюємо її в кеш
        if (response.ok) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return response;
      })
      .catch(() => {
        // ФОЛБЕК: Якщо мережа недоступна, шукаємо в кеші
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          
          // Якщо немає і в кеші — повертаємо кастомну помилку
          return new Response(JSON.stringify({ error: "Offline & No Cache" }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
  );
});