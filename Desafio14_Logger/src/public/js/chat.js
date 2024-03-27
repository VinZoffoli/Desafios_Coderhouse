const socket = io();
let user = localStorage.getItem('username');
socket.on('previousMessages', (previousMessages) => {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    previousMessages.forEach((message) => {
        const messageItem = document.createElement('div');
        messageItem.textContent = `${message.user}: ${message.message}`;
        messageList.appendChild(messageItem);
    });
});
document.getElementById('messageForm').addEventListener('submit', sendMessage);

socket.on('newChatMessage', (message) => {
    const messageList = document.getElementById('messageList');
    const messageItem = document.createElement('div');
    messageItem.textContent = `${message.user}: ${message.message}`;
    messageList.appendChild(messageItem);
});

socket.on('setUsername', (username) => {
    user = username;
    localStorage.setItem('username', user);
});

function sendMessage(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;

    socket.emit('chatMessage', { user, message });
    document.getElementById('messageForm').reset();
}