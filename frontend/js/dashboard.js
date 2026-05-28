const API_URL = 'https://vmart-t5mp.onrender.com/api';

document.addEventListener('DOMContentLoaded', () => {
    // If no token, kick them back to login
    if(!getToken()) window.location.href = 'index.html';
    
    const user = getUser();
    document.getElementById('user-name').innerText = user.name;
    
    // Typing effect for the subtitle
    const text = "Buy & Sell Safely Inside Campus";
    let i = 0;
    const typeInterval = setInterval(() => {
        document.getElementById('typing-text').innerText += text.charAt(i);
        i++;
        if (i > text.length) clearInterval(typeInterval);
    }, 50);
});

// --- Particle Background Animation ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX; 
        this.y += this.speedY;
        if(this.x > canvas.width) this.x = 0;
        if(this.x < 0) this.x = canvas.width;
        if(this.y > canvas.height) this.y = 0;
        if(this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

function initParticles() {
    for(let i=0; i<100; i++) particlesArray.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Handle window resizing for particles
window.addEventListener('resize', () => { 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
});
