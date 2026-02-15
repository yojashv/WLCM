const slider = document.getElementById('mainSlider');
const display = document.getElementById('percent-display');
const setupView = document.getElementById('setup-view');
const resultView = document.getElementById('result-view');

// INFO SETUP
const yourPhoneNumber = "916232092526"; 
const yourName = "Yojashv";

// 1. Automatic Gate Logic (0.5 second delay)
function autoOpenGate() {
    const gateContainer = document.getElementById('gate-container');
    setTimeout(() => {
        gateContainer.classList.add('gate-open');
        setTimeout(() => { gateContainer.style.display = 'none'; }, 2000);
    }, 500); 
}

// 2. Starfield Animation
function initStars() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*1.5, speed: Math.random()*0.4 });
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

// 3. Slider Live Update
if(slider) {
    slider.oninput = function() {
        display.innerHTML = this.value + "%";
        const hue = 200 + (this.value * 1.6); 
        display.style.color = `hsl(${hue}, 100%, 60%)`;
    }
}

// 4. On Page Load
window.onload = function() {
    initStars();
    const savedVal = localStorage.getItem('shikhaFinalVal');
    if (savedVal) {
        document.getElementById('gate-container').style.display = 'none';
        showFinalUI(savedVal);
    } else {
        autoOpenGate();
    }
}

// 5. Submit Choice (Sends to Formspree as Shikha)
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

// 6. UI Update (Shikha's name restored)
function showFinalUI(val) {
    setupView.style.display = "none";
    resultView.style.display = "block";

    let msg = "";
    if (val == 100) msg = "<b>Shikha, some things are written in the stars... you make the world feel like home. ❤️</b>";
    else if (val >= 80) msg = "You mean the world to me, Shikha. You're a beautiful creature! ✨";
    else if (val >= 50) msg = "You're a huge part of my world, Shikha! 🌸";
    else msg = "You're a great friend, Shikha! 😊";

    resultView.innerHTML = `
        <h1 style="font-size: 2.5rem;">Access Locked</h1>
        <div id="percent-display">${val}%</div>
        <div id="final-msg">${msg}</div>
        <div class="reset-link" onclick="openWhatsApp()">Request a Reset Code</div>
        <div id="admin-panel">
            <input type="text" id="adminKey" class="admin-input" placeholder="Enter Secret Code">
            <br>
            <button class="btn" style="padding: 10px 25px; font-size: 0.8rem;" onclick="checkKey()">Unlock</button>
        </div>
    `;
}

// 7. Security & Reset Logic
function openWhatsApp() {
    document.getElementById('admin-panel').style.display = 'block';
    window.open(`https://wa.me/${yourPhoneNumber}?text=Hey%20${yourName}!%20I%20need%20a%20new%20reset%20code!%20🥺`, '_blank');
}

function checkKey() {
    const input = document.getElementById('adminKey').value;
    const usedFirst = localStorage.getItem('usedKey1');

    if (input === "SHIKHA2026") {
        if (usedFirst) { alert("This key has EXPIRED! Ask Yojashv for the second key."); }
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