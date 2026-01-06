// Клієнтська частина
const socket = new WebSocket('wss://your-secure-chat.com');

socket.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    const chatBox = document.getElementById('chat');
    const messageEl = document.createElement('div');
    messageEl.textContent = `${msg.user}: ${msg.text}`; // Захист від XSS
    chatBox.appendChild(messageEl);
};