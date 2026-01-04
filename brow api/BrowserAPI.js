const statusDiv = document.getElementById('status');
const saveBtn = document.getElementById('saveBtn');
const log = document.getElementById('log');

// 1. Реєстрація Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('SW зареєстровано'))
        .catch(err => console.log('Помилка SW:', err));
}

// 2. Функція оновлення статусу
function updateStatus() {
    if (navigator.onLine) {
        statusDiv.textContent = "Ви в мережі (Online)";
        statusDiv.className = "status online";
        syncData(); // Запуск синхронізації при появі інету
    } else {
        statusDiv.textContent = "Немає мережі (Offline)";
        statusDiv.className = "status offline";
    }
}

// Слухаємо події мережі
window.addEventListener('online', updateStatus);
window.addEventListener('offline', updateStatus);
updateStatus(); // Запуск при завантаженні

// 3. Логіка кнопки (Імітація відправки даних)
saveBtn.addEventListener('click', () => {
    const data = { id: Date.now(), msg: 'Test Data' };

    if (navigator.onLine) {
        sendData(data);
    } else {
        saveLocally(data);
    }
});

// Відправка на сервер (Fetch API)
function sendData(data) {
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        log.textContent = `Дані відправлено на сервер (ID: ${json.id})`;
        console.log('Server response:', json);
    })
    .catch(err => console.error('Error:', err));
}

// Збереження локально (Offline)
function saveLocally(data) {
    let pending = JSON.parse(localStorage.getItem('offlineData') || '[]');
    pending.push(data);
    localStorage.setItem('offlineData', JSON.stringify(pending));
    log.textContent = 'Немає мережі. Дані збережено в кеш.';
}

// 4. Синхронізація (коли з'явився інтернет)
function syncData() {
    let pending = JSON.parse(localStorage.getItem('offlineData') || '[]');
    if (pending.length > 0) {
        log.textContent = `Синхронізація ${pending.length} записів...`;
        
        pending.forEach(item => sendData(item));
        
        localStorage.removeItem('offlineData');
    }
}