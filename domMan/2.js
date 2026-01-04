let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function renderTodos(filter = 'all') {
    let list = document.getElementById('todo-list');
    if (!list) {
        list = document.createElement('ul');
        list.id = 'todo-list';
        document.body.appendChild(list);
    }
    list.innerHTML = '';

    // Малюємо ЗАВЖДИ всі елементи
    todos.forEach((t, i) => {
        // Логіка фільтра: вирішуємо, чи ховати елемент
        const isDone = t.done;
        if (filter === 'done' && !isDone) return; // Пропускаємо
        if (filter === 'active' && isDone) return; // Пропускаємо

        const li = document.createElement('li');
        li.innerHTML = `
            <span style="${t.done ? 'text-decoration:line-through' : ''}">${t.txt}</span>
            <button onclick="toggleTodo(${i})">✓</button>
            <button onclick="delTodo(${i})">x</button>
        `;
        list.appendChild(li);
    });
}

// Решта функцій залишається як у тебе — максимально просто
window.addTodo = () => {
    const txt = document.getElementById('todo-input').value;
    if (!txt) return;
    todos.push({txt: txt, done: false});
    save();
    document.getElementById('todo-input').value = ''; 
};

window.toggleTodo = (i) => { todos[i].done = !todos[i].done; save(); };
window.delTodo = (i) => { todos.splice(i, 1); save(); };

function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

renderTodos();