/**
 * EMERGENCY FIX - WORKING SKY DROP SYSTEM
 */

console.log('🚨 EMERGENCY FIX LOADING...');

let droppedKey = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// AGGRESSIVE IMMEDIATE INITIALIZATION
function emergencyInit() {
    console.log('🚨 EMERGENCY INIT START');
    
    // Find elements immediately
    const triggerKey = document.getElementById('secret-trigger');
    const pupils = document.querySelectorAll('.pupil');
    
    console.log('🔍 Searching for elements...');
    console.log('Trigger:', triggerKey ? '✅ FOUND' : '❌ NOT FOUND');
    console.log('Pupils:', pupils.length + ' found');
    
    if (triggerKey) {
        console.log('🔑 SETTING UP KEY SYSTEM NOW');
        
        // Remove any existing listeners
        triggerKey.removeEventListener('click', handleKeyClick);
        
        // Style the trigger
        triggerKey.style.cursor = 'pointer';
        triggerKey.style.fontSize = '24px';
        triggerKey.style.opacity = '1';
        triggerKey.style.transition = 'all 0.2s ease';
        triggerKey.style.filter = 'drop-shadow(0 0 5px gold)';
        
        // Add hover effects
        triggerKey.addEventListener('mouseenter', function() {
            triggerKey.style.transform = 'scale(1.3)';
            triggerKey.style.filter = 'drop-shadow(0 0 10px gold)';
        });
        
        triggerKey.addEventListener('mouseleave', function() {
            triggerKey.style.transform = 'scale(1)';
            triggerKey.style.filter = 'drop-shadow(0 0 5px gold)';
        });
        
        // Add click listener
        triggerKey.addEventListener('click', handleKeyClick);
        
        console.log('✅ KEY SYSTEM READY');
    }
    
    if (pupils.length > 0) {
        console.log('👀 SETTING UP EYE TRACKING NOW');
        
        // Remove existing listener
        document.removeEventListener('mousemove', handleMouseMove);
        
        // Add mouse tracking
        document.addEventListener('mousemove', handleMouseMove);
        
        console.log('✅ EYE TRACKING READY');
    }
    
    return triggerKey && pupils.length > 0;
}

function handleKeyClick(e) {
    console.log('🎯 KEY CLICKED! Creating dropped key...');
    e.preventDefault();
    
    // Remove old key
    if (droppedKey) {
        droppedKey.remove();
    }
    
    // Create new key
    droppedKey = document.createElement('div');
    droppedKey.className = 'dropped-key';
    droppedKey.innerHTML = '🔑<div class="gloss"></div>';
    droppedKey.style.cssText = `
        position: fixed;
        top: -100px;
        right: 200px;
        font-size: 40px;
        cursor: grab;
        z-index: 10000;
        user-select: none;
        transition: all 0.5s ease, box-shadow 0.2s, filter 0.2s;
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
        background: none;
    `;
    
    document.body.appendChild(droppedKey);
    
    // Animate drop
    setTimeout(() => {
        droppedKey.style.top = '300px';
        droppedKey.style.transform = 'rotate(360deg)';
    }, 100);
    
    // Setup dragging after drop
    setTimeout(() => {
        setupDragging();
    }, 600);
    
    console.log('✅ KEY CREATED AND DROPPED');
}

function setupDragging() {
    if (!droppedKey) return;
    
    console.log('🖱️ SETTING UP DRAGGING');
    
    droppedKey.addEventListener('mousedown', function(e) {
        console.log('🖱️ DRAG START');
        isDragging = true;
        droppedKey.style.cursor = 'grabbing';
        
        const rect = droppedKey.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !droppedKey) return;
        
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        
        droppedKey.style.left = x + 'px';
        droppedKey.style.top = y + 'px';
        droppedKey.style.right = 'auto';
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        console.log('🖱️ DRAG END');
        isDragging = false;
        
        if (droppedKey) {
            droppedKey.style.cursor = 'grab';
            // Check if overlapping the locker
            const locker = document.getElementById('secret-target');
            if (locker) {
                const keyRect = droppedKey.getBoundingClientRect();
                const lockerRect = locker.getBoundingClientRect();
                if (
                    keyRect.right > lockerRect.left &&
                    keyRect.left < lockerRect.right &&
                    keyRect.bottom > lockerRect.top &&
                    keyRect.top < lockerRect.bottom
                ) {
                    // --- UNLOCK: Fade out key, trigger Blazor event ---
                    console.log('🔓 KEY OVERLAPS LOCKER!');
                    droppedKey.style.transition = 'opacity 0.5s';
                    droppedKey.style.opacity = '0';
                    setTimeout(() => { if (droppedKey) droppedKey.remove(); }, 500);
                    // Dispatch custom event for Blazor interop
                    window.dispatchEvent(new CustomEvent('show-secret-window'));
                    return;
                }
            }
            // No unlock occurred - key does nothing unless on locker
        }
    });
}

function handleMouseMove(e) {
    const pupils = document.querySelectorAll('.pupil');
    
    pupils.forEach(pupil => {
        const eye = pupil.parentElement;
        if (!eye) return;
        
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const distance = Math.min(3, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 30);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
}

// MULTIPLE INITIALIZATION ATTEMPTS
console.log('🚨 STARTING EMERGENCY INITIALIZATION SEQUENCE');

// Try immediately
emergencyInit();

// Try after DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', emergencyInit);
} else {
    emergencyInit();
}

// Try after window loads
window.addEventListener('load', emergencyInit);

// Keep trying every second for 30 seconds
let attempts = 0;
const maxAttempts = 30;
const emergencyInterval = setInterval(() => {
    attempts++;
    console.log(`🚨 Emergency attempt ${attempts}/${maxAttempts}`);
    
    if (emergencyInit() || attempts >= maxAttempts) {
        clearInterval(emergencyInterval);
        if (attempts < maxAttempts) {
            console.log('✅ EMERGENCY INIT SUCCESSFUL!');
        } else {
            console.log('❌ EMERGENCY INIT FAILED AFTER ALL ATTEMPTS');
        }
    }
}, 1000);

// --- GLOSS EFFECT CSS ---
function injectGlossCSS() {
    if (document.getElementById('key-gloss-style')) return;
    const style = document.createElement('style');
    style.id = 'key-gloss-style';
    style.textContent = `
    .dropped-key {
        position: fixed;
        top: -100px;
        right: 200px;
        font-size: 40px;
        cursor: grab;
        z-index: 10000;
        user-select: none;
        transition: all 0.5s ease, box-shadow 0.2s, filter 0.2s;
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
        background: none;
    }
    .dropped-key .gloss {
        pointer-events: none;
        position: absolute;
        left: 0; top: 0; width: 100%; height: 100%;
        border-radius: 50%;
        background: linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 60%, transparent 100%);
        opacity: 0.7;
        transform: translateY(-30%) scaleY(0.5);
        transition: opacity 0.2s;
    }
    .dropped-key:hover {
        /* Remove boxy effect: no extra shadow, no background */
        filter: drop-shadow(0 0 10px gold);
        background: none;
        box-shadow: none;
    }
    .dropped-key:hover .gloss {
        opacity: 1;
    }
    @media (max-width: 600px) {
        .dropped-key { font-size: 28px; right: 20vw; }
    }
    `;
    document.head.appendChild(style);
}

// --- MODAL CSS ---
function injectModalCSS() {
    if (document.getElementById('secret-modal-style')) return;
    const style = document.createElement('style');
    style.id = 'secret-modal-style';
    style.textContent = `
    .secret-modal-bg {
        position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
        z-index: 20000; display: flex; align-items: center; justify-content: center;
        animation: fadeInBg 0.3s;
        background: linear-gradient(120deg, #181c24 0%, #6cf 100%) fixed;
        overflow: hidden;
    }
    .secret-modal-bg::before {
        content: '';
        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
        background: url('https://www.transparenttextures.com/patterns/hexellence.png'), linear-gradient(120deg, #23272e 0%, #6cf 100%);
        opacity: 0.22;
        z-index: 0;
        animation: bgMove 18s linear infinite alternate;
        filter: blur(2.5px) brightness(1.1) saturate(1.2);
    }
    .secret-modal {
        background: rgba(36, 44, 60, 0.88);
        color: #fff; border-radius: 38px; box-shadow: 0 16px 64px 0 #000b, 0 0 0 8px #6cf6;
        max-width: 99vw; width: 900px; max-height: 98vh; padding: 2.8rem 1.5rem 1.5rem 1.5rem;
        position: relative; display: flex; flex-direction: column; align-items: center; gap: 1.2rem;
        animation: popIn 0.4s cubic-bezier(.22,1.12,.62,1.01);
        border: 4px solid #6cf;
        border-top-width: 12px;
        overflow: hidden;
        backdrop-filter: blur(22px) saturate(1.3);
        transition: box-shadow 0.3s, background 0.3s;
    }
    @keyframes bgMove {
        0% { background-position: 0 0, 0 0; }
        100% { background-position: 120px 80px, 100vw 100vh; }
    }
    .emulator-label {
        position: absolute; top: -38px; left: 50%; transform: translateX(-50%);
        background: rgba(36,44,60,0.98); color: #6cf; font-weight: bold; font-size: 1.25em;
        padding: 0.3em 2.2em; border-radius: 0 0 22px 22px; box-shadow: 0 4px 16px #0008;
        letter-spacing: 2.5px; border: 2.5px solid #6cf; border-top: none;
        z-index: 2;
        text-shadow: 0 2px 8px #000a;
    }
    .emulator-screen {
        width: 700px; min-height: 420px; max-width: 95vw; background: linear-gradient(120deg,#23272e 80%,#23272e 100%);
        border-radius: 22px; box-shadow: 0 4px 32px #000a, 0 0 0 3px #6cfcc;
        margin-bottom: 0; display: flex; align-items: center; justify-content: center;
        position: relative; border: 3px solid #6cf;
        overflow: hidden;
        padding: 1.5rem 0.7rem;
        flex-shrink: 0;
        margin-left: auto; margin-right: auto;
        transition: box-shadow 0.3s, background 0.3s;
    }
    .game-library {
        display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
        width: 100%; max-height: 340px; overflow-y: auto; gap: 0.7em;
        background: rgba(36,44,60,0.72); border-radius: 18px; box-shadow: 0 2px 16px #0004;
        padding: 1.2em 0.5em 0.7em 0.5em;
        border: 2px solid #6cf3;
        margin-bottom: 0.7em;
    }
    .library-label {
        width: 100%; text-align: center; font-size: 1.3em; color: #6cf; font-weight: bold; letter-spacing: 2px; margin-bottom: 1.1em; text-shadow: 0 2px 12px #000a; flex-basis: 100%;
        font-family: 'Arial Black', Arial, sans-serif;
    }
    .game-btn {
        width: 100%; max-width: 420px; min-width: 180px; padding: 1.1em 0; border-radius: 16px; background: linear-gradient(120deg,#23272e 80%,#23272e 100%); color: #fff; font-size: 1.18em; border: 2.5px solid #6cf; margin-bottom: 0.3em; font-weight: 700; letter-spacing: 0.7px; box-shadow: 0 2px 12px #0004; transition: background 0.18s, color 0.18s, border 0.18s, box-shadow 0.18s, transform 0.12s; display: flex; align-items: center; gap: 0.9em; justify-content: center; outline: none; font-family: 'Arial Black', Arial, sans-serif;}
    .game-btn:hover, .game-btn:focus-visible {
        background: #6cf; color: #23272e; border: 2.5px solid #fff; box-shadow: 0 6px 24px #6cf8, 0 2px 8px #0002; transform: scale(1.06);
    }
    .game-btn:active {
        background: #4ad; color: #fff; border: 2.5px solid #fff; box-shadow: 0 2px 8px #0002; transform: scale(0.98);
    }
    .game-btn span { font-size: 1.5em; }
    .modal-nav {
        display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 1.6em; margin: 1.6em 0 0.3em 0;
    }
    .modal-nav-btn {
        background: linear-gradient(120deg,#23272e 80%,#23272e 100%); color: #6cf; border: 2.5px solid #6cf; border-radius: 12px; padding: 0.7em 2.2em; font-size: 1.18em; font-weight: bold; box-shadow: 0 2px 12px #0004; transition: background 0.18s, color 0.18s, border 0.18s, transform 0.12s;
        outline: none; margin: 0 0.3em; font-family: 'Arial Black', Arial, sans-serif;
    }
    .modal-nav-btn:hover, .modal-nav-btn:focus-visible { background: #6cf; color: #23272e; border: 2.5px solid #fff; transform: scale(1.06); }
    .modal-nav-btn:active { background: #4ad; color: #fff; border: 2.5px solid #fff; transform: scale(0.98); }
    .back-to-hub-btn {
        display: block; margin: 1.2em auto 0 auto; background: #23272e; color: #6cf; border: 2px solid #6cf; border-radius: 8px; padding: 0.5em 1.2em; font-size: 1em; font-weight: bold; box-shadow: 0 2px 8px #0002; transition: background 0.2s, color 0.2s, border 0.2s;}
    .back-to-hub-btn:hover, .back-to-hub-btn:focus-visible { background: #6cf; color: #23272e; border: 2px solid #fff; }
    @media (max-width: 900px) {
        .secret-modal { flex-direction: column; width: 99vw; gap: 1.2rem; align-items: center; padding: 1.2rem 0.3rem; }
        .emulator-screen { width: 98vw; min-width: 0; max-width: 99vw; min-height: 220px; padding: 0.5rem 0.1rem; }
        .game-library { width: 98vw; min-width: 0; }
    }
    @media (max-width: 600px) {
        .secret-modal { width: 99vw; padding: 0.7rem 0.1rem; border-radius: 18px; }
        .emulator-screen { min-height: 160px; padding: 0.2rem 0.05rem; border-radius: 10px; }
        .game-library { border-radius: 10px; padding: 0.5em 0.1em 0.3em 0.1em; }
        .modal-nav-btn { font-size: 1em; padding: 0.5em 1.1em; border-radius: 8px; }
        .game-btn { font-size: 1em; min-width: 120px; max-width: 180px; border-radius: 8px; padding: 0.7em 0; }
    }
    @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(style);
}

// --- MODAL HTML ---
// showSecretModal removed: now handled by Blazor

// --- GAME LAUNCHERS (load real games) ---
window.launchSnakeGame = function() {
    loadGameScript('/games/snake-phaser.js');
};
window.launchPuzzleGame = function() {
    loadGameScript('/games/slide-puzzle-phaser.js');
};
window.launchTowerGame = function() {
    loadGameScript('/games/tower-builder-phaser.js');
};
window.launchTetrisGame = function() {
    loadGameScript('/games/tetris-phaser.js');
};
window.launchMinesweeperGame = function() {
    loadGameScript('/games/minesweeper-phaser.js');
};
window.launchAboutMeQuiz = function() {
    loadGameScript('/games/aboutme-quiz-phaser.js');
};
function loadGameScript(src) {
    const container = document.getElementById('game-container');
    if (container) container.innerHTML = '';
    // Remove any previous game script
    const old = document.getElementById('game-script');
    if (old) old.remove();
    if (!src.startsWith('/games/')) src = '/games/' + src.replace(/^\/+/, '');
    window.__lastGameScript = src;
    const script = document.createElement('script');
    script.id = 'game-script';
    script.src = src;
    script.onload = () => { if (container) container.scrollIntoView({behavior:'smooth'}); };
    document.body.appendChild(script);
}

// Global test functions
window.testKey = () => {
    console.log('🧪 Testing key trigger...');
    const trigger = document.getElementById('secret-trigger');
    if (trigger) {
        trigger.click();
    } else {
        console.log('❌ No trigger found');
    }
};

window.testEyes = () => {
    console.log('🧪 Testing eyes...');
    const pupils = document.querySelectorAll('.pupil');
    console.log('Found', pupils.length, 'pupils');
    handleMouseMove({ clientX: 100, clientY: 100 });
};

window.emergencyInit = emergencyInit;

console.log('🚨 EMERGENCY SYSTEM LOADED!');
