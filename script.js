const slider = document.getElementById('mainSlider');
const display = document.getElementById('percent-display');
const setupView = document.getElementById('setup-view');
const resultView = document.getElementById('result-view');

const yourPhoneNumber = "919407384878"; 
const yourName = "Yojashv";

// 1. Dynamic Greeting
function setDynamicGreeting() {
    const hour = new Date().getHours();
    const greet = document.getElementById('greeting');
    if (hour < 12) greet.innerHTML = "Good Morning ☀️, Shikha! ❤️";
    else if (hour < 17) greet.innerHTML = "Good Afternoon 🌤️, Shikha! ❤️";
    else greet.innerHTML = "Good Evening 🌙, Shikha! ❤️";
}

// 2. Typewriter Effect
function typeWriter(text, elementId, speed = 50) {
    let i = 0;
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Show reset/admin panel after typing finishes
            document.getElementById('post-result').style.display = 'block';
        }
    }
    type();
}

// 3. Automatic Gate (0.5s delay)
function autoOpenGate() {
    const gateContainer = document.getElementById('gate-container');
    setTimeout(() => {
        gateContainer.classList.add('gate-open');
        setTimeout(() => { gateContainer.style.display = 'none'; }, 2000);
    }, 500); 
}

// 4. Starfield Animation
function initStars() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*1.5, speed: Math.random()*0.3 });
    }
    function animate() {
        ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle = "white";
        stars.forEach(s => {
            ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill();
            s.y += s.speed; if(s.y > canvas.height) s.y = 0;
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// 5. On Page Load
window.onload = function() {
    initStars();
    setDynamicGreeting();
    const savedVal = localStorage.getItem('shikhaFinalVal');
    if (savedVal) {
        document.getElementById('gate-container').style.display = 'none';
        showFinalUI(savedVal);
    } else {
        autoOpenGate();
    }
}

// Slider Live Color Change
if(slider) {
    slider.oninput = function() {
        display.innerHTML = this.value + "%";
        const hue = 200 + (this.value * 1.6); 
        display.style.color = `hsl(${hue}, 100%, 60%)`;
    }
}

// 6. Submit Choice
function submitChoice() {
    const val = slider.value;
    localStorage.setItem('shikhaFinalVal', val);

    fetch("https://formspree.io/f/mbdaozwq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: "Shikha", Percentage: val + "%" })
    });
    showFinalUI(val);
}

// 7. Show Result with Typewriter Message
function showFinalUI(val) {
    setupView.style.display = "none";
    resultView.style.display = "block";
    document.getElementById('final-percent').innerHTML = val + "%";

    let message = "";
    if (val == 100) message = "Shikha, some things are written in the stars... you make the world feel like home. ❤️";
    else if (val >= 80) message = "You mean the world to me, Shikha. You're a beautiful creature! ✨";
    else if (val >= 50) message = "You're a huge part of my world, Shikha! 🌸";
    else message = "You're a great friend, Shikha! 😊";

    typeWriter(message, 'typewriter-msg', 60);
}

// 8. Admin & Reset Logic
function openWhatsApp() {
    document.getElementById('admin-panel').style.display = 'block';
    window.open(`https://wa.me/${yourPhoneNumber}?text=Hey%20${yourName}!%20I%20need%20a%20new%20reset%20code!%20🥺`, '_blank');
}

function checkKey() {
    const input = document.getElementById('adminKey').value;
    const usedFirst = localStorage.getItem('usedKey1');

    if (input === "SHIKHA2026") {
        if (usedFirst) { alert("This key has EXPIRED!"); }
        else {
            localStorage.setItem('usedKey1', 'true');
            localStorage.removeItem('shikhaFinalVal');
            location.reload();
        }
    } else if (input === "yojashv2020") {
        localStorage.removeItem('shikhaFinalVal');
        localStorage.removeItem('usedKey1'); 
        location.reload();
    } else { alert("Unauthorized Code."); }
}
