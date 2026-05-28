const API_URL = 'https://vmart-t5mp.onrender.com/api';

async function handleLogin() {
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        if (!user.email.endsWith('@vitstudent.ac.in')) {
            await auth.signOut();
            showErrorPopup("Only VIT Students Allowed");
            return;
        }
        const res = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: user.displayName, email: user.email, profileImage: user.photoURL })
        });
        const data = await res.json();
        if(data.message) { showErrorPopup(data.message); return; }
        localStorage.setItem('vmart_token', data.token);
        localStorage.setItem('vmart_user', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
    } catch (err) {
        console.error(err);
    }
}

function showErrorPopup(msg) {
    const popup = document.getElementById('error-popup');
    document.getElementById('error-msg').innerText = msg;
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show'), 3000);
}

function logout() {
    auth.signOut();
    localStorage.clear();
    window.location.href = 'index.html';
}

function getToken() { return localStorage.getItem('vmart_token'); }
function getUser() { return JSON.parse(localStorage.getItem('vmart_user')); }
