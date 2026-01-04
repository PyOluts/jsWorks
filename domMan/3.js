let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');

function renderContacts(query = "") {
    // 1. Знаходимо або створюємо контейнер
    let container = document.getElementById('contacts');
    if (!container) {
        container = document.createElement('div');
        container.id = 'contacts';
        document.body.appendChild(container);
    }
    container.innerHTML = ''; // Очищаємо

    // 2. Простий цикл, як у Python
    for (let i = 0; i < contacts.length; i++) {
        const c = contacts[i];

        // Якщо є пошуковий запит і він НЕ збігається — пропускаємо (як continue)
        if (query && !c.name.toLowerCase().includes(query.toLowerCase())) {
            continue;
        }

        const el = document.createElement('div');
        // Оскільки ми в циклі по оригінальному масиву, індекс 'i' завжди правильний!
        el.innerHTML = `
            ${c.name}: ${c.phone} 
            <button onclick="editContact(${i})">✎</button>
            <button onclick="deleteContact(${i})">🗑</button>
        `;
        container.appendChild(el);
    }
}

// Додавання контакту (через prompt, щоб не городити форми)
window.addContact = () => {
    const name = prompt("Ім'я:");
    const phone = prompt("Телефон:");
    if (name && phone) {
        contacts.push({ name, phone });
        saveContacts();
    }
};

window.editContact = (i) => {
    const newName = prompt("Нове ім'я:", contacts[i].name);
    if (newName) {
        contacts[i].name = newName;
        saveContacts();
    }
};

window.deleteContact = (i) => {
    if (confirm("Видалити цей контакт?")) {
        contacts.splice(i, 1);
        saveContacts();
    }
};

function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts();
}

// Початковий запуск
renderContacts();