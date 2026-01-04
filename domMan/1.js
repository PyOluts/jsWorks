const calendar = document.body;  
const events = JSON.parse(localStorage.getItem('cal_events') || '{}');

function renderCalendar() {
    const container = document.createElement('div');
    container.innerHTML = '<h3>Календар (Січень 2026)</h3><div id="days" style="display:grid;grid-template-columns:repeat(7, 40px)"></div>';
    document.body.appendChild(container);

    for (let i = 1; i <= 31; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.onclick = () => showEvents(i);
        document.getElementById('days').appendChild(btn);
    }
}

function showEvents(day) {
    const task = prompt(`Подія на ${day}.01:`, events[day] || "");
    if (task !== null) {
        if (task === "") delete events[day];
        else events[day] = task;
        localStorage.setItem('cal_events', JSON.stringify(events));
        alert(`Збережено: ${task || 'Пусто'}`);
    }
}
renderCalendar();