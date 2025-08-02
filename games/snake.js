// Snake Game with Phaser 3 - Perfect fit for SecretWindow modal
console.log('[Snake] Starting game initialization...');

// Wait for DOM and Phaser to be ready
function initGame() {
  console.log('[Snake] initGame called');
  
  // Check if Phaser is loaded
  if (typeof Phaser === 'undefined') {
    console.error('[Snake] Phaser not loaded!');
    return;
  }
  
  console.log('[Snake] Phaser loaded successfully');
  
  // Remove loading overlay quickly
  setTimeout(() => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      console.log('[Snake] Removing loading overlay');
      loadingOverlay.style.transition = 'opacity 0.3s ease-out';
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.remove();
        console.log('[Snake] Loading overlay removed');
      }, 300);
    }
  }, 800);

  // Game configuration
  const container = document.getElementById('game-container');
  // Use container dimensions or fallback to optimal fixed size
  const GAME_WIDTH = container ? container.offsetWidth || 720 : 720;
  const GAME_HEIGHT = container ? container.offsetHeight || 540 : 540;
  
  console.log('[Snake] Game dimensions:', GAME_WIDTH, 'x', GAME_HEIGHT);
  // Game settings (can be modified via settings menu)
  let gameSettings = {
    mapSize: 'Medium', // Small, Medium, Large
    snakeSpeed: 'Medium', // Slow, Medium, Fast
    appleCount: 1, // 1, 2, 3
    wallCollision: true,
    gridSize: 20
  };

  // Map size configurations - adjusted for better screen fit
  const mapConfigs = {
    Small: { width: 25, height: 18 },
    Medium: { width: 35, height: 22 },
    Large: { width: 45, height: 28 }
  };

  // Speed configurations (time between moves in ms)
  const speedConfigs = {
    Slow: 200,
    Medium: 150,
    Fast: 100
  };

  class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }

    create() {
      console.log('[Snake] MenuScene created');
      
      // Enhanced animated background
      this.createDynamicBackground();
      
      // Floating particles background
      this.createBackgroundParticles();
      
      // Game title with enhanced 3D effect
      const titleBg = this.add.text(GAME_WIDTH/2 + 3, GAME_HEIGHT * 0.18 + 3, '⚡ SNAKE NEXUS ⚡', {
        fontSize: Math.min(56, GAME_WIDTH * 0.09) + 'px',
        fill: '#000040',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5).setAlpha(0.8);
      
      const title = this.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.18, '⚡ SNAKE NEXUS ⚡', {
        fontSize: Math.min(56, GAME_WIDTH * 0.09) + 'px',
        fill: '#00e6ff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // Multi-layer glow effect
      title.setStroke('#ffffff', 2);
      title.setShadow(0, 0, '#00e6ff', 30);
      
      // Enhanced title animations
      this.tweens.add({
        targets: title,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 3000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
      
      // Rainbow color cycling
      this.tweens.add({
        targets: title,
        tint: [0x00e6ff, 0x00ff80, 0x80ff00, 0xffff00, 0xff8000, 0xff0080, 0x8000ff, 0x00e6ff],
        duration: 6000,
        ease: 'Linear',
        repeat: -1
      });
      
      // Floating title effect
      this.tweens.add({
        targets: [title, titleBg],
        y: GAME_HEIGHT * 0.18 - 10,
        duration: 4000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });

      // Enhanced menu buttons with glass morphism
      this.createEnhancedButton(GAME_WIDTH/2, GAME_HEIGHT * 0.4, 'START GAME', 0x00ff80, () => {
        this.createScreenTransition(() => this.scene.start('GameScene'));
      });
      
      this.createEnhancedButton(GAME_WIDTH/2, GAME_HEIGHT * 0.55, 'SETTINGS', 0xff6600, () => {
        this.createScreenTransition(() => this.scene.start('SettingsScene'));
      });

      // Current settings display with glow
      const settingsDisplay = this.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.75, 
        `◆ Map: ${gameSettings.mapSize} ◆ Speed: ${gameSettings.snakeSpeed} ◆ Apples: ${gameSettings.appleCount} ◆`, {
        fontSize: Math.min(16, GAME_WIDTH * 0.025) + 'px',
        fill: '#ffff80',
        fontFamily: 'Courier New, monospace',
        alpha: 0.9
      }).setOrigin(0.5);
      
      settingsDisplay.setShadow(0, 0, '#ffff80', 10);
      
      // Pulse animation for settings
      this.tweens.add({
        targets: settingsDisplay,
        alpha: 0.6,
        duration: 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
      
      // Version info with retro feel
      const versionText = this.add.text(GAME_WIDTH * 0.02, GAME_HEIGHT * 0.95, 'SNAKE NEXUS v2.5 - RETRO EDITION', {
        fontSize: '12px',
        fill: '#666',
        fontFamily: 'Courier New, monospace'
      });
      
      // Create menu ambient effects
      this.createMenuAmbientEffects();
    }
    
    createDynamicBackground() {
      // Base background
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1a);
      
      // Animated grid background
      const gridGraphics = this.add.graphics();
      gridGraphics.lineStyle(1, 0x003366, 0.3);
      
      // Create dynamic grid
      for (let x = 0; x <= GAME_WIDTH; x += 40) {
        gridGraphics.moveTo(x, 0);
        gridGraphics.lineTo(x, GAME_HEIGHT);
      }
      for (let y = 0; y <= GAME_HEIGHT; y += 40) {
        gridGraphics.moveTo(0, y);
        gridGraphics.lineTo(GAME_WIDTH, y);
      }
      gridGraphics.strokePath();
      
      // Animate grid
      this.tweens.add({
        targets: gridGraphics,
        alpha: 0.1,
        duration: 3000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
      
      // Moving background gradient
      const bgGradient = this.add.graphics();
      bgGradient.fillGradientStyle(0x0f1419, 0x16213e, 0x0f3460, 0x1a1a2e, 0.6);
      bgGradient.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      
      this.tweens.add({
        targets: bgGradient,
        rotation: Math.PI * 2,
        duration: 30000,
        ease: 'Linear',
        repeat: -1
      });
    }
    
    createBackgroundParticles() {
      // Create floating particles
      for (let i = 0; i < 15; i++) {
        const particle = this.add.circle(
          Math.random() * GAME_WIDTH,
          Math.random() * GAME_HEIGHT,
          Math.random() * 3 + 1,
          [0x00e6ff, 0x00ff80, 0xff6600, 0xff0080][Math.floor(Math.random() * 4)]
        );
        
        particle.setAlpha(0.4);
        
        // Float animation
        this.tweens.add({
          targets: particle,
          y: particle.y - GAME_HEIGHT - 100,
          duration: (Math.random() * 10000) + 5000,
          ease: 'Linear',
          repeat: -1,
          delay: Math.random() * 5000
        });
        
        // Fade animation
        this.tweens.add({
          targets: particle,
          alpha: 0.1,
          duration: 2000,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1
        });
      }
    }
    
    createEnhancedButton(x, y, text, color, callback) {
      // Button background with glass effect
      const buttonBg = this.add.graphics();
      buttonBg.fillStyle(color, 0.1);
      buttonBg.fillRoundedRect(x - 120, y - 30, 240, 60, 15);
      buttonBg.lineStyle(2, color, 0.8);
      buttonBg.strokeRoundedRect(x - 120, y - 30, 240, 60, 15);
      
      // Inner glow
      const innerGlow = this.add.graphics();
      innerGlow.fillStyle(color, 0.2);
      innerGlow.fillRoundedRect(x - 115, y - 25, 230, 50, 12);
      
      // Button text with effects
      const buttonText = this.add.text(x, y, text, {
        fontSize: '22px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      buttonText.setStroke(color, 2);
      buttonText.setShadow(0, 0, color, 15);
      
      // Make interactive
      const hitArea = this.add.rectangle(x, y, 240, 60, 0x000000, 0)
        .setInteractive({ useHandCursor: true });
      
      // Hover effects
      hitArea.on('pointerover', () => {
        // Play hover sound
        if (window.retroSounds) {
          window.retroSounds.playSound('hover');
        }
        
        // Subtle hover animation
        this.tweens.add({
          targets: [buttonBg, innerGlow],
          scaleX: 1.03,
          scaleY: 1.03,
          duration: 150,
          ease: 'Power2'
        });
        
        this.tweens.add({
          targets: buttonText,
          scaleX: 1.05,
          scaleY: 1.05,
          tint: color,
          duration: 150,
          ease: 'Power2'
        });
        
        // Create subtle hover effect
        this.createButtonHoverEffect(x, y, color);
      });
      
      hitArea.on('pointerout', () => {
        this.tweens.add({
          targets: [buttonBg, innerGlow, buttonText],
          scaleX: 1,
          scaleY: 1,
          duration: 150,
          ease: 'Power2'
        });
        
        this.tweens.add({
          targets: buttonText,
          tint: 0xffffff,
          duration: 150
        });
      });
      
      hitArea.on('pointerdown', () => {
        // Play click sound
        if (window.retroSounds) {
          window.retroSounds.playSound('menu');
        }
        
        // Click animation
        this.tweens.add({
          targets: [buttonBg, innerGlow, buttonText],
          scaleX: 0.95,
          scaleY: 0.95,
          duration: 100,
          ease: 'Power2',
          yoyo: true,
          onComplete: callback
        });
        
        // Create click particles
        this.createButtonClickEffect(x, y, color);
      });
      
      return { bg: buttonBg, glow: innerGlow, text: buttonText, hitArea };
    }
    
    createButtonHoverEffect(x, y, color) {
      // Subtle retro glow effect
      const glow = this.add.circle(x, y, 80, color, 0.1);
      
      this.tweens.add({
        targets: glow,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => glow.destroy()
      });
      
      // Small corner accents
      for (let i = 0; i < 4; i++) {
        const accent = this.add.rectangle(
          x + (i % 2 === 0 ? -100 : 100),
          y + (i < 2 ? -25 : 25),
          8, 2, color
        );
        
        this.tweens.add({
          targets: accent,
          alpha: 0,
          scaleX: 0,
          duration: 200,
          ease: 'Power2',
          delay: i * 50,
          onComplete: () => accent.destroy()
        });
      }
    }
    
    createButtonClickEffect(x, y, color) {
      // Shockwave effect
      const shockwave = this.add.circle(x, y, 5, color, 0.6);
      this.tweens.add({
        targets: shockwave,
        scaleX: 15,
        scaleY: 15,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => shockwave.destroy()
      });
      
      // Burst particles
      for (let i = 0; i < 12; i++) {
        const particle = this.add.circle(x, y, 3, color);
        const angle = (i / 12) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          duration: 600,
          ease: 'Power3',
          onComplete: () => particle.destroy()
        });
      }
    }
    
    createScreenTransition(callback) {
      // Create transition overlay
      const overlay = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0);
      
      this.tweens.add({
        targets: overlay,
        alpha: 1,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          callback();
          overlay.destroy();
        }
      });
    }
    
    createMenuAmbientEffects() {
      // Create scanning lines effect
      for (let i = 0; i < 3; i++) {
        const scanLine = this.add.rectangle(0, Math.random() * GAME_HEIGHT, GAME_WIDTH, 2, 0x00e6ff, 0.3);
        scanLine.setOrigin(0, 0.5);
        
        this.tweens.add({
          targets: scanLine,
          y: GAME_HEIGHT + 50,
          duration: 3000 + (i * 1000),
          ease: 'Linear',
          repeat: -1,
          delay: i * 1000
        });
      }
      
      // Ambient glow pulses
      const ambientGlow = this.add.circle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_HEIGHT, 0x00e6ff, 0.02);
      this.tweens.add({
        targets: ambientGlow,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0.05,
        duration: 4000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
    }
  }

  class SettingsScene extends Phaser.Scene {
    constructor() {
      super({ key: 'SettingsScene' });
    }

    create() {
      console.log('[Snake] SettingsScene created');
      
      // Background
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);
      
      // Title
      const title = this.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.1, 'SETTINGS', {
        fontSize: Math.min(36, GAME_WIDTH * 0.08) + 'px',
        fill: '#00e6ff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      let yPos = GAME_HEIGHT * 0.25;
      const spacing = GAME_HEIGHT * 0.12;

      // Map Size setting
      this.add.text(GAME_WIDTH * 0.2, yPos, 'Map Size:', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });

      const mapSizeButton = this.add.rectangle(GAME_WIDTH * 0.75, yPos, 120, 35, 0x3498db)
        .setInteractive({ useHandCursor: true });
      
      // Add border
      this.add.rectangle(GAME_WIDTH * 0.75, yPos, 120, 35)
        .setStrokeStyle(1, 0x00e6ff);
      
      const mapSizeText = this.add.text(GAME_WIDTH * 0.75, yPos, gameSettings.mapSize, {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);

      mapSizeButton.on('pointerdown', () => {
        const sizes = ['Small', 'Medium', 'Large'];
        const currentIndex = sizes.indexOf(gameSettings.mapSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        gameSettings.mapSize = sizes[nextIndex];
        mapSizeText.setText(gameSettings.mapSize);
      });

      yPos += spacing;

      // Snake Speed setting
      this.add.text(GAME_WIDTH * 0.2, yPos, 'Snake Speed:', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });

      const speedButton = this.add.rectangle(GAME_WIDTH * 0.75, yPos, 120, 35, 0x3498db)
        .setInteractive({ useHandCursor: true });
      
      // Add border
      this.add.rectangle(GAME_WIDTH * 0.75, yPos, 120, 35)
        .setStrokeStyle(1, 0x00e6ff);
      
      const speedText = this.add.text(GAME_WIDTH * 0.75, yPos, gameSettings.snakeSpeed, {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);

      speedButton.on('pointerdown', () => {
        const speeds = ['Slow', 'Medium', 'Fast'];
        const currentIndex = speeds.indexOf(gameSettings.snakeSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        gameSettings.snakeSpeed = speeds[nextIndex];
        speedText.setText(gameSettings.snakeSpeed);
      });

      yPos += spacing;

      // Apple Count setting
      this.add.text(GAME_WIDTH * 0.2, yPos, 'Apple Count:', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });

      const appleButton = this.add.rectangle(GAME_WIDTH * 0.75, yPos, 120, 35, 0x3498db)
        .setInteractive({ useHandCursor: true });
      
      // Add border
      this.add.rectangle(GAME_WIDTH * 0.75, yPos, 120, 35)
        .setStrokeStyle(1, 0x00e6ff);
      
      const appleText = this.add.text(GAME_WIDTH * 0.75, yPos, gameSettings.appleCount.toString(), {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);

      appleButton.on('pointerdown', () => {
        gameSettings.appleCount = gameSettings.appleCount >= 3 ? 1 : gameSettings.appleCount + 1;
        appleText.setText(gameSettings.appleCount.toString());
      });

      // Back button
      const backButton = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT * 0.8, 150, 40, 0x95a5a6)
        .setInteractive({ useHandCursor: true });
      
      // Add border for back button
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT * 0.8, 150, 40)
        .setStrokeStyle(2, 0x00e6ff);
      
      const backText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT * 0.8, 'BACK', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      backButton.on('pointerdown', () => {
        console.log('[Snake] Returning to menu...');
        this.scene.start('MenuScene');
      });

      // Add hover effects to all buttons
      [mapSizeButton, speedButton, appleButton, backButton].forEach(button => {
        button.on('pointerover', () => {
          this.tweens.add({ targets: button, scaleX: 1.05, scaleY: 1.05, duration: 100 });
        });
        button.on('pointerout', () => {
          this.tweens.add({ targets: button, scaleX: 1, scaleY: 1, duration: 100 });
        });
      });
    }
  }

  class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
    }

    init() {
      // Game variables
      this.snake = [];
      this.food = [];
      this.direction = 'RIGHT';
      this.newDirection = 'RIGHT';
      this.score = 0;
      this.gameOver = false;
      
      // Enhanced addiction features
      this.combo = 0;
      this.maxCombo = 0;
      this.powerUps = [];
      this.effects = [];
      this.level = 1;
      this.applesEaten = 0;
      this.speedBoost = false;
      this.scoreMultiplier = 1;
      this.streakCount = 0;
      this.achievements = [];
      this.particles = [];
      
      // Get current map configuration
      this.mapConfig = mapConfigs[gameSettings.mapSize];
      this.gridSize = gameSettings.gridSize;
      this.moveTime = speedConfigs[gameSettings.snakeSpeed];
      this.lastMoveTime = 0;

      // Calculate grid positioning to center the game and ensure it fits
      this.gridWidth = this.mapConfig.width * this.gridSize;
      this.gridHeight = this.mapConfig.height * this.gridSize;
      
      // Ensure the grid fits within the available space
      const maxWidth = GAME_WIDTH - 100;
      const maxHeight = GAME_HEIGHT - 150;
      
      if (this.gridWidth > maxWidth) {
        this.gridSize = Math.floor(maxWidth / this.mapConfig.width);
        this.gridWidth = this.mapConfig.width * this.gridSize;
      }
      
      if (this.gridHeight > maxHeight) {
        const newGridSize = Math.floor(maxHeight / this.mapConfig.height);
        if (newGridSize < this.gridSize) {
          this.gridSize = newGridSize;
          this.gridWidth = this.mapConfig.width * this.gridSize;
          this.gridHeight = this.mapConfig.height * this.gridSize;
        }
      }
      
      this.gridOffsetX = (GAME_WIDTH - this.gridWidth) / 2;
      this.gridOffsetY = (GAME_HEIGHT - this.gridHeight) / 2 + 30;
    }
    
    initGameAudio() {
      // Initialize audio context for game sounds
      if (window.retroSounds && !window.retroSounds.initialized) {
        window.retroSounds.init().then(() => {
          console.log('[Snake] Game audio initialized');
        }).catch(e => {
          console.warn('[Snake] Audio initialization failed:', e);
        });
      }
    }
    
    playGameSound(soundName) {
      try {
        if (window.retroSounds && window.retroSounds.initialized) {
          window.retroSounds.playSound(soundName);
        }
      } catch (e) {
        console.warn('[Snake] Game sound error:', e);
      }
    }

    create() {
      console.log('[Snake] GameScene created');
      
      // Initialize audio system for game sounds
      this.initGameAudio();
      
      // Consistent background matching menu style - dark retro theme
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x0a0a1a);
      
      // Animated background grid matching menu style
      const gridGraphics = this.add.graphics();
      gridGraphics.lineStyle(1, 0x002244, 0.4);
      
      // Draw grid lines
      for (let x = 0; x <= GAME_WIDTH; x += 20) {
        gridGraphics.moveTo(x, 0);
        gridGraphics.lineTo(x, GAME_HEIGHT);
      }
      for (let y = 0; y <= GAME_HEIGHT; y += 20) {
        gridGraphics.moveTo(0, y);
        gridGraphics.lineTo(GAME_WIDTH, y);
      }
      gridGraphics.strokePath();
      
      // Animate grid opacity
      this.tweens.add({
        targets: gridGraphics,
        alpha: 0.2,
        duration: 3000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
      
      // Game area border with consistent cyan glow
      const border = this.add.rectangle(
        this.gridOffsetX + this.gridWidth/2, 
        this.gridOffsetY + this.gridHeight/2, 
        this.gridWidth + 4, 
        this.gridHeight + 4, 
        0x001122
      );
      border.setStrokeStyle(2, 0x00e6ff);
      
      // Border glow animation
      this.tweens.add({
        targets: border,
        alpha: 0.7,
        duration: 1500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });

      // Enhanced score display
      this.scoreText = this.add.text(GAME_WIDTH * 0.05, GAME_HEIGHT * 0.05, 'SCORE: 0', {
        fontSize: Math.min(20, GAME_WIDTH * 0.04) + 'px',
        fill: '#00e6ff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      });
      
      // Combo display
      this.comboText = this.add.text(GAME_WIDTH * 0.05, GAME_HEIGHT * 0.1, 'COMBO: 0', {
        fontSize: Math.min(16, GAME_WIDTH * 0.03) + 'px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      });
      
      // Level display
      this.levelText = this.add.text(GAME_WIDTH * 0.05, GAME_HEIGHT * 0.15, 'LEVEL: 1', {
        fontSize: Math.min(16, GAME_WIDTH * 0.03) + 'px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      });
      
      // Speed multiplier display
      this.multiplierText = this.add.text(GAME_WIDTH * 0.05, GAME_HEIGHT * 0.2, 'x1', {
        fontSize: Math.min(14, GAME_WIDTH * 0.025) + 'px',
        fill: '#ff00ff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      });

      // Game over text (hidden initially)
      this.gameOverText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'GAME OVER!\nPress SPACE to return to menu', {
        fontSize: Math.min(24, GAME_WIDTH * 0.05) + 'px',
        fill: '#ff0000',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold',
        align: 'center'
      }).setOrigin(0.5).setVisible(false);

      // Initialize snake
      this.initSnake();
      
      // Initialize food
      this.initFood();
      
      // Set up controls
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys('W,S,A,D');
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      
      // Mobile touch support - also handle keyboard events from iframe
      this.setupMobileControls();
    }
    
    setupMobileControls() {
      // Add touch/swipe support for mobile
      this.input.on('pointerdown', (pointer) => {
        this.startX = pointer.x;
        this.startY = pointer.y;
      });
      
      this.input.on('pointerup', (pointer) => {
        if (!this.startX || !this.startY) return;
        
        const deltaX = pointer.x - this.startX;
        const deltaY = pointer.y - this.startY;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0 && this.direction !== 'LEFT') {
              this.newDirection = 'RIGHT';
            } else if (deltaX < 0 && this.direction !== 'RIGHT') {
              this.newDirection = 'LEFT';
            }
          }
        } else {
          // Vertical swipe
          if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0 && this.direction !== 'UP') {
              this.newDirection = 'DOWN';
            } else if (deltaY < 0 && this.direction !== 'DOWN') {
              this.newDirection = 'UP';
            }
          }
        }
        
        this.startX = null;
        this.startY = null;
      });
      
      // Listen for keyboard events from parent frame (mobile controls)
      window.addEventListener('keydown', (event) => {
        switch(event.key) {
          case 'ArrowLeft':
            if (this.direction !== 'RIGHT') this.newDirection = 'LEFT';
            break;
          case 'ArrowRight':
            if (this.direction !== 'LEFT') this.newDirection = 'RIGHT';
            break;
          case 'ArrowUp':
            if (this.direction !== 'DOWN') this.newDirection = 'UP';
            break;
          case 'ArrowDown':
            if (this.direction !== 'UP') this.newDirection = 'DOWN';
            break;
          case 'Escape':
            this.pauseGame();
            break;
          case 'r':
          case 'R':
            this.restartGame();
            break;
        }
        event.preventDefault();
      });
    }

    initSnake() {
      this.snake = [];
      const startX = Math.floor(this.mapConfig.width / 2);
      const startY = Math.floor(this.mapConfig.height / 2);
      
      // Create initial snake (3 segments)
      for (let i = 0; i < 3; i++) {
        this.snake.push({
          x: startX - i,
          y: startY
        });
      }
      
      this.drawSnake();
    }

    initFood() {
      this.food = [];
      
      for (let i = 0; i < gameSettings.appleCount; i++) {
        this.spawnFood();
      }
    }

    spawnFood() {
      let foodPos;
      let attempts = 0;
      
      do {
        foodPos = {
          x: Phaser.Math.Between(0, this.mapConfig.width - 1),
          y: Phaser.Math.Between(0, this.mapConfig.height - 1)
        };
        attempts++;
      } while (this.isPositionOccupied(foodPos.x, foodPos.y) && attempts < 100);
      
      if (attempts < 100) {
        this.food.push(foodPos);
        this.drawFood();
      }
    }

    isPositionOccupied(x, y) {
      // Check if position is occupied by snake
      for (let segment of this.snake) {
        if (segment.x === x && segment.y === y) {
          return true;
        }
      }
      
      // Check if position is occupied by other food
      for (let foodItem of this.food) {
        if (foodItem.x === x && foodItem.y === y) {
          return true;
        }
      }
      
      return false;
    }

    drawSnake() {
      // Clear previous snake graphics
      if (this.snakeGraphics) {
        this.snakeGraphics.destroy();
      }
      
      this.snakeGraphics = this.add.graphics();
      
      this.snake.forEach((segment, index) => {
        const x = this.gridOffsetX + segment.x * this.gridSize;
        const y = this.gridOffsetY + segment.y * this.gridSize;
        
        if (index === 0) {
          // Head - bright green with glow effect
          this.snakeGraphics.fillStyle(0x2ecc40);
          this.snakeGraphics.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
          
          // Add glow effect for head
          this.snakeGraphics.lineStyle(2, 0x00ff00, 0.8);
          this.snakeGraphics.strokeRect(x, y, this.gridSize, this.gridSize);
          
          // Add eyes
          this.snakeGraphics.fillStyle(0xffffff);
          const eyeSize = 2;
          const eyeOffset = 4;
          this.snakeGraphics.fillCircle(x + eyeOffset, y + eyeOffset, eyeSize);
          this.snakeGraphics.fillCircle(x + this.gridSize - eyeOffset, y + eyeOffset, eyeSize);
          
          // Add pupils
          this.snakeGraphics.fillStyle(0x000000);
          this.snakeGraphics.fillCircle(x + eyeOffset, y + eyeOffset, 1);
          this.snakeGraphics.fillCircle(x + this.gridSize - eyeOffset, y + eyeOffset, 1);
        } else {
          // Body - gradient effect
          const intensity = Math.max(0.4, 1 - (index / this.snake.length));
          const bodyColor = Phaser.Display.Color.Interpolate.ColorWithColor({r: 46, g: 204, b: 64}, {r: 39, g: 174, b: 96}, this.snake.length, index);
          
          this.snakeGraphics.fillStyle(Phaser.Display.Color.GetColor(bodyColor.r, bodyColor.g, bodyColor.b));
          this.snakeGraphics.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
          
          // Add subtle outline
          this.snakeGraphics.lineStyle(1, 0x27ae60, 0.6);
          this.snakeGraphics.strokeRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
        }
      });
    }

    drawFood() {
      // Clear previous food graphics
      if (this.foodGraphics) {
        this.foodGraphics.destroy();
      }
      
      this.foodGraphics = this.add.graphics();
      
      this.food.forEach((foodItem, index) => {
        const x = this.gridOffsetX + foodItem.x * this.gridSize;
        const y = this.gridOffsetY + foodItem.y * this.gridSize;
        const centerX = x + this.gridSize/2;
        const centerY = y + this.gridSize/2;
        const radius = this.gridSize/2 - 2;
        
        // Animated apple with glow
        const time = this.time.now * 0.005;
        const pulseScale = 1 + Math.sin(time + index) * 0.1;
        const currentRadius = radius * pulseScale;
        
        // Outer glow
        this.foodGraphics.fillStyle(0xff6666);
        this.foodGraphics.fillCircle(centerX, centerY, currentRadius + 2);
        
        // Main apple body
        this.foodGraphics.fillStyle(0xff0000);
        this.foodGraphics.fillCircle(centerX, centerY, currentRadius);
        
        // Apple highlight
        this.foodGraphics.fillStyle(0xff9999);
        this.foodGraphics.fillCircle(centerX - 2, centerY - 2, currentRadius * 0.3);
        
        // Apple stem
        this.foodGraphics.fillStyle(0x654321);
        this.foodGraphics.fillRect(centerX - 1, centerY - currentRadius - 2, 2, 3);
        
        // Apple leaf
        this.foodGraphics.fillStyle(0x00ff00);
        this.foodGraphics.fillEllipse(centerX + 2, centerY - currentRadius, 3, 2);
      });
    }

    update(time) {
      if (this.gameOver) {
        if (this.spaceKey.isDown) {
          this.scene.start('MenuScene');
        }
        return;
      }

      // Handle input
      this.handleInput();
      
      // Move snake
      if (time > this.lastMoveTime + this.moveTime) {
        this.moveSnake();
        this.lastMoveTime = time;
      }
    }

    handleInput() {
      if (this.cursors.left.isDown || this.wasd.A.isDown) {
        if (this.direction !== 'RIGHT') this.newDirection = 'LEFT';
      } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
        if (this.direction !== 'LEFT') this.newDirection = 'RIGHT';
      } else if (this.cursors.up.isDown || this.wasd.W.isDown) {
        if (this.direction !== 'DOWN') this.newDirection = 'UP';
      } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
        if (this.direction !== 'UP') this.newDirection = 'DOWN';
      }
    }

    moveSnake() {
      this.direction = this.newDirection;
      
      const head = { ...this.snake[0] };
      
      switch (this.direction) {
        case 'LEFT':
          head.x--;
          break;
        case 'RIGHT':
          head.x++;
          break;
        case 'UP':
          head.y--;
          break;
        case 'DOWN':
          head.y++;
          break;
      }
      
      // Check wall collision
      if (head.x < 0 || head.x >= this.mapConfig.width || 
          head.y < 0 || head.y >= this.mapConfig.height) {
        this.endGame();
        return;
      }
      
      // Check self collision
      for (let segment of this.snake) {
        if (head.x === segment.x && head.y === segment.y) {
          this.endGame();
          return;
        }
      }
      
      this.snake.unshift(head);
      
      // Check food collision with enhanced effects
      let foodEaten = false;
      for (let i = this.food.length - 1; i >= 0; i--) {
        const foodItem = this.food[i];
        if (head.x === foodItem.x && head.y === foodItem.y) {
          this.food.splice(i, 1);
          this.applesEaten++;
          this.combo++;
          this.streakCount++;
          
          // Play eat sound effect
          this.playGameSound('eat');
          
          // Enhanced scoring with combo multiplier
          let baseScore = 10;
          let comboBonus = Math.floor(this.combo / 5) * 5; // Bonus every 5 combo
          let scoreGain = (baseScore + comboBonus) * this.scoreMultiplier;
          
          this.score += scoreGain;
          this.scoreText.setText('SCORE: ' + this.score);
          this.comboText.setText('COMBO: ' + this.combo);
          
          // Update max combo
          if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
          }
          
          // Level progression
          if (this.applesEaten % 10 === 0) {
            this.level++;
            this.levelText.setText('LEVEL: ' + this.level);
            this.createLevelUpEffect();
            
            // Increase speed slightly
            this.moveTime = Math.max(80, this.moveTime - 5);
          }
          
          // Score multiplier progression
          if (this.combo >= 10) {
            this.scoreMultiplier = 2;
          } else if (this.combo >= 20) {
            this.scoreMultiplier = 3;
          }
          this.multiplierText.setText('x' + this.scoreMultiplier);
          
          // Speed boost for combo
          if (this.combo >= 5 && !this.speedBoost) {
            this.speedBoost = true;
            this.moveTime = Math.max(50, this.moveTime * 0.8);
            this.createSpeedBoostEffect();
          }
          
          foodEaten = true;
          
          // Create enhanced eating particle effect
          this.createEatingEffect(
            this.gridOffsetX + foodItem.x * this.gridSize + this.gridSize/2,
            this.gridOffsetY + foodItem.y * this.gridSize + this.gridSize/2
          );
          
          // Screen flash for eating (color based on combo)
          let flashColor = 0x00ff00;
          if (this.combo >= 20) flashColor = 0xff00ff;
          else if (this.combo >= 10) flashColor = 0xffff00;
          else if (this.combo >= 5) flashColor = 0x00ffff;
          
          const flash = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, flashColor, 0.1);
          this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 100,
            onComplete: () => flash.destroy()
          });
          
          // Enhanced score popup with combo info
          let popupText = '+' + scoreGain;
          if (this.combo >= 5) {
            popupText += ' COMBO!';
          }
          
          this.createScorePopup(
            this.gridOffsetX + foodItem.x * this.gridSize + this.gridSize/2,
            this.gridOffsetY + foodItem.y * this.gridSize + this.gridSize/2,
            popupText
          );
          
          // Play eating sound
          if (window.retroSounds) {
            window.retroSounds.playSound('eat');
          }
          
          // Spawn new food to maintain count
          this.spawnFood();
          break;
        }
      }
      
      if (!foodEaten) {
        this.snake.pop();
        // Reset combo if no food eaten
        if (this.combo > 0) {
          this.combo = Math.max(0, this.combo - 1);
          this.comboText.setText('COMBO: ' + this.combo);
          
          // Reset speed boost if combo drops below 5
          if (this.combo < 5 && this.speedBoost) {
            this.speedBoost = false;
            this.moveTime = speedConfigs[gameSettings.snakeSpeed];
          }
          
          // Reset score multiplier
          if (this.combo < 10) {
            this.scoreMultiplier = 1;
          } else if (this.combo < 20) {
            this.scoreMultiplier = 2;
          }
          this.multiplierText.setText('x' + this.scoreMultiplier);
        }
      }
      
      this.drawSnake();
      this.drawFood();
    }

    endGame() {
      this.gameOver = true;
      this.gameOverText.setVisible(false);
      
      // Play game over sound
      this.playGameSound('gameOver');
      
      // Reset combo and bonuses
      this.combo = 0;
      this.scoreMultiplier = 1;
      this.speedBoost = false;
      
      // Update displays
      this.comboText.setText('COMBO: 0');
      this.multiplierText.setText('x1');
      
      // Create final score summary
      const finalScoreText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 80, 
        `FINAL SCORE: ${this.score}\nLEVEL REACHED: ${this.level}\nMAX COMBO: ${this.maxCombo}\nAPPLES EATEN: ${this.applesEaten}`, {
        fontSize: Math.min(18, GAME_WIDTH * 0.035) + 'px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold',
        align: 'center'
      }).setOrigin(0.5);
      
      // Game over text
      this.gameOverText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'GAME OVER!\nPress SPACE to return to menu', {
        fontSize: Math.min(24, GAME_WIDTH * 0.05) + 'px',
        fill: '#ff0000',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold',
        align: 'center'
      }).setOrigin(0.5).setVisible(true);
      
      // Play game over sound
      if (window.retroSounds) {
        window.retroSounds.playSound('gameOver');
      }
      
      // Enhanced game over effects
      // Screen shake
      this.cameras.main.shake(500, 0.02);
      
      // Red flash
      const flash = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0xff0000, 0.3);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 1000,
        onComplete: () => flash.destroy()
      });
      
      // Explosion effect at snake head
      if (this.snake.length > 0) {
        const headX = this.gridOffsetX + this.snake[0].x * this.gridSize + this.gridSize/2;
        const headY = this.gridOffsetY + this.snake[0].y * this.gridSize + this.gridSize/2;
        this.createExplosionEffect(headX, headY);
      }
      
      // Add flashing effect to game over text
      this.tweens.add({
        targets: this.gameOverText,
        alpha: 0.3,
        duration: 500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
      
      // Zoom effect on game over text
      this.tweens.add({
        targets: this.gameOverText,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 300,
        ease: 'Back.easeOut'
      });
    }
    
    createEatingEffect(x, y) {
      for (let i = 0; i < 12; i++) {
        const particle = this.add.circle(x, y, 3, 0xff0000);
        const angle = (i / 12) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          duration: 400,
          ease: 'Power2',
          onComplete: () => particle.destroy()
        });
      }
    }
    
    createScorePopup(x, y, text) {
      const popup = this.add.text(x, y, text, {
        fontSize: '16px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: popup,
        y: y - 30,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 800,
        ease: 'Power2',
        onComplete: () => popup.destroy()
      });
    }
    
    createExplosionEffect(x, y) {
      for (let i = 0; i < 20; i++) {
        const colors = [0xff0000, 0xff6600, 0xffff00, 0xffffff];
        const particle = this.add.circle(x, y, 2 + Math.random() * 4, colors[Math.floor(Math.random() * colors.length)]);
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 60;
        const duration = 300 + Math.random() * 400;
        
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          duration: duration,
          ease: 'Power3',
          onComplete: () => particle.destroy()
        });
      }
    }
    
    createLevelUpEffect() {
      // Level up text
      const levelUpText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 'LEVEL UP!', {
        fontSize: '32px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // Animate level up text
      this.tweens.add({
        targets: levelUpText,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0,
        duration: 1500,
        ease: 'Power2',
        onComplete: () => levelUpText.destroy()
      });
      
      // Screen flash
      const flash = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x00ff00, 0.2);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 500,
        onComplete: () => flash.destroy()
      });
      
      // Border pulse
      this.tweens.add({
        targets: this.levelText,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 300,
        ease: 'Back.easeOut',
        yoyo: true
      });
    }
    
    createSpeedBoostEffect() {
      // Speed boost text
      const speedText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'SPEED BOOST!', {
        fontSize: '24px',
        fill: '#00ffff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // Animate speed boost text
      this.tweens.add({
        targets: speedText,
        scaleX: 1.2,
        scaleY: 1.2,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => speedText.destroy()
      });
      
      // Combo text pulse
      this.tweens.add({
        targets: this.comboText,
        tint: [0xffff00, 0x00ffff, 0xff00ff, 0xffff00],
        duration: 1000,
        ease: 'Linear'
      });
    }
    
    pauseGame() {
      if (this.gameRunning) {
        this.gameRunning = false;
        
        // Create pause overlay
        this.pauseOverlay = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
        this.pauseText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'PAUSED\n\nPress ESC to resume', {
          fontSize: '24px',
          fill: '#ffff00',
          fontFamily: 'Courier New, monospace',
          fontStyle: 'bold',
          align: 'center'
        }).setOrigin(0.5);
        
        this.pauseText.setStroke('#000000', 4);
        this.pauseText.setShadow(2, 2, '#000000', 2);
        
        // Pulse animation
        this.tweens.add({
          targets: this.pauseText,
          alpha: 0.7,
          duration: 800,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1
        });
        
      } else {
        // Resume game
        this.gameRunning = true;
        
        if (this.pauseOverlay) {
          this.pauseOverlay.destroy();
          this.pauseOverlay = null;
        }
        if (this.pauseText) {
          this.pauseText.destroy();
          this.pauseText = null;
        }
      }
    }
    
    restartGame() {
      // Flash effect
      const flash = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0xffffff, 0.8);
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          flash.destroy();
          this.scene.restart();
        }
      });
    }
  }

  // Game configuration
  const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    scene: [MenuScene, SettingsScene, GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT
    },
    render: {
      antialias: true,
      pixelArt: false
    }
  };

  try {
    // Initialize the game
    const game = new Phaser.Game(config);
    console.log('[Snake] Game initialized successfully');
    
    // Add error handling
    game.events.on('ready', () => {
      console.log('[Snake] Game ready event fired');
    });
    
  } catch (error) {
    console.error('[Snake] Error initializing game:', error);
    
    // Show fallback message
    const container = document.getElementById('game-container');
    if (container) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff0000; font-family: monospace;">
          <div style="text-align: center;">
            <h3>Game Loading Error</h3>
            <p>Failed to initialize Snake game</p>
            <p style="font-size: 12px;">${error.message}</p>
          </div>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
