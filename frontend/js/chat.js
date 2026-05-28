const API_URL = 'https://vmart-t5mp.onrender.com/api';
const params = new URLSearchParams(window.location.search);
const productId = params.get('productId');
const receiverId = params.get('receiverId');
const currentUser = getUser();

async function loadMessages() {
    const res = await fetch(`${API_URL}/messages/${productId}/${receiverId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const messages = await res.json();
    const container = document.getElementById('chat-box');
    container.innerHTML = '';
    messages.forEach(m => {
        const isMe = m.senderId._id === currentUser._id;
        const div = document.createElement('div');
        div.className = `bubble ${isMe ? 'me' : 'them'}`;
        div.innerHTML = `<p>${m.message}</p><span class="time">${new Date(m.createdAt).toLocaleTimeString()}</span>`;
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}

document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgInput = document.getElementById('msg-input');
    if(!msgInput.value.trim()) return;
    
    await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ receiverId, productId, message: msgInput.value })
    });
    msgInput.value = '';
    loadMessages();
});

loadMessages();
setInterval(loadMessages, 3000); // Polling for real-time effect
