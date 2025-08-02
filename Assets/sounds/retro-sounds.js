// Retro Sound Effects System
class RetroSounds {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.volume = 0.3;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.generateAllSounds();
            this.initialized = true;
            console.log('[RetroSounds] Audio system initialized successfully');
        } catch (error) {
            console.warn('[RetroSounds] Failed to initialize audio:', error);
        }
    }

    generateAllSounds() {
        // Boot sound - classic startup beep
        this.sounds.boot = this.createBootSound();
        
        // Button hover - subtle beep
        this.sounds.hover = this.createHoverSound();
            
        // Button click - satisfying click
        this.sounds.click = this.createClickSound();
        
        // Cartridge insert - mechanical sound
        this.sounds.insert = this.createInsertSound();
        
        // Power on - startup sequence
        this.sounds.powerOn = this.createPowerOnSound();
        
        // Game sounds
        this.sounds.eat = this.createEatSound();
        this.sounds.gameOver = this.createGameOverSound();
        this.sounds.menu = this.createMenuSound();
    }

    createBootSound() {
        const duration = 0.8;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 220 + (660 * Math.sin(t * 8));
            const envelope = Math.exp(-t * 3);
            data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
        }
        
        return buffer;
    }

    createHoverSound() {
        const duration = 0.1;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 20);
            data[i] = Math.sin(2 * Math.PI * 800 * t) * envelope * 0.1;
        }
        
        return buffer;
    }

    createClickSound() {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 1200 - (800 * t);
            const envelope = Math.exp(-t * 15);
            data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.2;
        }
        
        return buffer;
    }

    createInsertSound() {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const noise = (Math.random() - 0.5) * 0.1;
            const tone = Math.sin(2 * Math.PI * 150 * t) * 0.1;
            const envelope = Math.max(0, 1 - t * 3);
            data[i] = (noise + tone) * envelope;
        }
        
        return buffer;
    }

    createPowerOnSound() {
        const duration = 1.2;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq1 = 110 + (440 * Math.sin(t * 2));
            const freq2 = 220 + (220 * Math.sin(t * 3));
            const envelope = Math.min(1, t * 2) * Math.exp(-t * 0.8);
            data[i] = (Math.sin(2 * Math.PI * freq1 * t) + Math.sin(2 * Math.PI * freq2 * t)) * envelope * 0.15;
        }
        
        return buffer;
    }

    createEatSound() {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 400 + (300 * Math.sin(t * 30));
            const envelope = Math.exp(-t * 8);
            data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.2;
        }
        
        return buffer;
    }

    createGameOverSound() {
        const duration = 1.5;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 440 - (300 * t);
            const envelope = Math.exp(-t * 1.5);
            data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
        }
        
        return buffer;
    }

    createMenuSound() {
        const duration = 0.4;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 660 + (220 * Math.sin(t * 12));
            const envelope = Math.exp(-t * 4);
            data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.15;
        }
        
        return buffer;
    }

    playSound(soundName) {
        if (!this.initialized || !this.sounds[soundName]) {
            console.warn(`[RetroSounds] Sound not found or not initialized: ${soundName}`);
            return;
        }

        try {
            // Ensure audio context is not suspended
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    this.playAudioBuffer(soundName);
                });
            } else {
                this.playAudioBuffer(soundName);
            }
        } catch (error) {
            console.warn('[RetroSounds] Failed to play sound:', error);
        }
    }
    
    playAudioBuffer(soundName) {
        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.sounds[soundName];
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.value = this.volume;
            
            source.start();
        } catch (error) {
            console.warn('[RetroSounds] Failed to play audio buffer:', error);
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

// Global instance
window.retroSounds = new RetroSounds();

// Auto-initialize on first user interaction
document.addEventListener('click', async function initSounds() {
    await window.retroSounds.init();
    document.removeEventListener('click', initSounds);
}, { once: true });

// Alternative initialization
document.addEventListener('keydown', async function initSounds() {
    await window.retroSounds.init();
    document.removeEventListener('keydown', initSounds);
}, { once: true });
