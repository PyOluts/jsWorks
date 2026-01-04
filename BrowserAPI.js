<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Network Tracker PWA</title>
    <style>
        body { font-family: sans-serif; text-align: center; padding: 50px; }
        #status { padding: 20px; font-weight: bold; border-radius: 8px; }
        .online { background: #d4edda; color: #155724; }
        .offline { background: #f8d7da; color: #721c24; }
        button { padding: 10px 20px; margin-top: 20px; cursor: pointer; }
    </style>
</head>
<body>

    <h1>Моніторинг мережі</h1>
    <div id="status">Перевірка статусу...</div>
    
    <button id="actionBtn">Зробити запис (офлайн/онлайн)</button>
    <p id="info">Дані будуть синхронізовані, коли з'явиться інтернет.</p>

    <script>
        const statusDiv = document.getElementById('status');
        const actionBtn = document.getElementById('actionBtn');

        // --- 1. Оновлення статусу мережі ---
        function updateStatus() {
            if (navigator.onLine) {
                statusDiv.textContent = "Ви в мережі (Online)";
                statusDiv.className = "online";
                syncData(); // Спробувати синхронізацію при поверненні в онлайн
            } else {
                statusDiv.textContent = "Мережа відсутня (Offline)";
                statusDiv.className = "offline";
            }
        }

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();

        // --- 2. Збереження даних (Синхронізація) ---
        actionBtn.addEventListener('click', () => {
            const entry = { id: Date.now(), text: "Тестовий запис" };
            
            if (navigator.onLine) {
                sendToServer(entry);
            } else {
                // Якщо офлайн — зберігаємо в localStorage (десеріалізація/серіалізація)
                let pending = JSON.parse(localStorage.getItem('pendingData') || '[]');
                pending.push(entry);
                localStorage.setItem('pendingData', JSON.stringify(pending));
                alert('Збережено локально. Чекаємо на інтернет...');
            }
        });

        function sendToServer(data) {
            console.log('Відправка через Fetch API:', data);
            // Використовуємо реальний або фейковий API
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-type': 'application/json' }
            })
            .then(res => res.json())
            .then(json => console.log('Успішно відправлено:', json))
            .catch(err => console.error('Помилка Fetch:', err));
        }

        function syncData() {
            const pending = JSON.parse(localStorage.getItem('pendingData') || '[]');
            if (pending.length > 0) {
                console.log('Починаємо синхронізацію...');
                pending.forEach(item => sendToServer(item));
                localStorage.removeItem('pendingData');
                alert('Всі офлайн дані синхронізовано!');
            }
        }

        // --- 3. Створення Service Worker в одному файлі ---
        const swCode = `
            const CACHE_NAME = 'v1';
            const assets = [window.location.href];

            self.addEventListener('install', e => {
                e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(assets)));
            });

            self.addEventListener('fetch', e => {
                e.respondWith(
                    caches.match(e.request).then(res => res || fetch(e.request))
                );
            });
        `;

        // Магія: перетворюємо рядок коду на файл sw.js
        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(swUrl).then(() => {
                console.log('Service Worker працює!');
            });
        }
    </script>
</body>
</html>