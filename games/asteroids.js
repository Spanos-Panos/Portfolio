// Asteroids Game with Phaser 3 - Mobile Responsive with WASD Controls
console.log('[Asteroids] Starting game initialization...');

function initGame() {
  if (typeof Phaser === 'undefined') {
    console.error('[Asteroids] Phaser not loaded!');
    return;
  }
  
  setTimeout(() => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.transition = 'opacity 0.3s ease-out';
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.remove(), 300);
    }
  }, 2500);

  const container = document.getElementById('game-container');
  const GAME_WIDTH = container ? container.offsetWidth || 720 : 720;
  const GAME_HEIGHT = container ? container.offsetHeight || 540 : 540;
  
  class AsteroidsScene extends Phaser.Scene {
    constructor() {
      super({ key: 'AsteroidsScene' });
    }

    create() {
      this.showMainMenu();
    }
    
    showMainMenu() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000011);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/3, '🚀 ASTEROIDS 🚀', {
        fontSize: '32px',
        fill: '#8800ff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      const playButton = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'PLAY', {
        fontSize: '24px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      const settingsButton = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'SETTINGS', {
        fontSize: '20px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 80, 'Controls: WASD to move/rotate • Space to shoot', {
        fontSize: '12px',
        fill: '#888888',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      playButton.on('pointerdown', () => {
        console.log('[Asteroids] Play button clicked');
        this.startGame();
      });
      settingsButton.on('pointerdown', () => this.showSettings());
    }
    
    showSettings() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000011);
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/4, 'SETTINGS', {
        fontSize: '28px',
        fill: '#8800ff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 80, 'Controls:', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 'W/↑ - Thrust Forward', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 30, 'A/← - Rotate Left', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 10, 'D/→ - Rotate Right', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 10, 'S/↓ - Reverse Thrust', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 30, 'Space - Shoot', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      const backButton = this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 60, 'BACK', {
        fontSize: '18px',
        fill: '#ff6600',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      backButton.on('pointerdown', () => this.showMainMenu());
    }
    
    startGame() {
      console.log('[Asteroids] Starting game...');
      this.children.removeAll();
      
      this.score = 0;
      this.lives = 3;
      this.gameRunning = true;
      this.asteroids = [];
      this.bullets = [];
      
      this.createBackground();
      this.createShip();
      this.createUI();
      this.setupControls();
      this.spawnAsteroids();
    }
    
    createBackground() {
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000011);
      
      // Stars
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * GAME_WIDTH;
        const y = Math.random() * GAME_HEIGHT;
        const brightness = Math.random();
        const star = this.add.circle(x, y, 1, 0xffffff, brightness);
        
        this.tweens.add({
          targets: star,
          alpha: brightness * 0.3,
          duration: 2000 + Math.random() * 3000,
          yoyo: true,
          repeat: -1
        });
      }
    }
    
    createShip() {
      this.ship = this.add.graphics();
      this.ship.x = GAME_WIDTH / 2;
      this.ship.y = GAME_HEIGHT / 2;
      this.ship.rotation = 0;
      this.ship.velocityX = 0;
      this.ship.velocityY = 0;
      this.ship.thrusting = false;
      this.ship.reversing = false;
      this.ship.turningLeft = false;
      this.ship.turningRight = false;
      this.ship.invulnerable = false;
      
      this.drawShip();
    }
    
    drawShip() {
      this.ship.clear();
      this.ship.lineStyle(2, this.ship.invulnerable ? 0xff6666 : 0x00ffff);
      this.ship.beginPath();
      this.ship.moveTo(12, 0);
      this.ship.lineTo(-8, -8);
      this.ship.lineTo(-4, 0);
      this.ship.lineTo(-8, 8);
      this.ship.closePath();
      this.ship.strokePath();
      
      // Thrust effect
      if (this.ship.thrusting) {
        this.ship.lineStyle(2, 0xff6600);
        this.ship.beginPath();
        this.ship.moveTo(-8, -3);
        this.ship.lineTo(-15, 0);
        this.ship.lineTo(-8, 3);
        this.ship.strokePath();
      }
    }
    
    createUI() {
      this.add.text(GAME_WIDTH/2, 30, '🚀 ASTEROIDS 🚀', {
        fontSize: '24px',
        fill: '#8800ff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.scoreText = this.add.text(20, 70, 'SCORE: 0', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      this.livesText = this.add.text(20, 95, 'LIVES: 3', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 20, 'WASD to move • Space to shoot • ESC to pause', {
        fontSize: '12px',
        fill: '#666666',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
    }
    
    setupControls() {
      // Mobile touch controls
      this.input.on('pointerdown', (pointer) => {
        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;
        
        if (pointer.x < centerX - 50) {
          this.ship.turningLeft = true;
        } else if (pointer.x > centerX + 50) {
          this.ship.turningRight = true;
        } else if (pointer.y < centerY) {
          this.ship.thrusting = true;
        } else {
          this.shootBullet();
        }
      });
      
      this.input.on('pointerup', () => {
        this.ship.thrusting = false;
        this.ship.reversing = false;
        this.ship.turningLeft = false;
        this.ship.turningRight = false;
      });
      
      // Parent frame keyboard events
      window.addEventListener('keydown', (event) => {
        if (!this.gameRunning) return;
        
        switch(event.key.toLowerCase()) {
          case 'arrowup':
          case 'w':
            this.ship.thrusting = true;
            break;
          case 'arrowdown':
          case 's':
            this.ship.reversing = true;
            break;
          case 'arrowleft':
          case 'a':
            this.ship.turningLeft = true;
            break;
          case 'arrowright':
          case 'd':
            this.ship.turningRight = true;
            break;
          case ' ':
            this.shootBullet();
            break;
          case 'escape':
            this.pauseGame();
            break;
          case 'r':
            if (!this.gameRunning) {
              this.restartGame();
            }
            break;
        }
        event.preventDefault();
      });
      
      window.addEventListener('keyup', (event) => {
        switch(event.key.toLowerCase()) {
          case 'arrowup':
          case 'w':
            this.ship.thrusting = false;
            break;
          case 'arrowdown':
          case 's':
            this.ship.reversing = false;
            break;
          case 'arrowleft':
          case 'a':
            this.ship.turningLeft = false;
            break;
          case 'arrowright':
          case 'd':
            this.ship.turningRight = false;
            break;
        }
      });
    }
    
    spawnAsteroids() {
      for (let i = 0; i < 5; i++) {
        this.createAsteroid('large');
      }
    }
    
    createAsteroid(size) {
      const asteroid = this.add.graphics();
      
      // Position away from ship
      do {
        asteroid.x = Math.random() * GAME_WIDTH;
        asteroid.y = Math.random() * GAME_HEIGHT;
      } while (Phaser.Math.Distance.Between(asteroid.x, asteroid.y, this.ship.x, this.ship.y) < 100);
      
      asteroid.size = size;
      asteroid.velocityX = (Math.random() - 0.5) * 100;
      asteroid.velocityY = (Math.random() - 0.5) * 100;
      asteroid.rotationSpeed = (Math.random() - 0.5) * 0.1;
      
      this.drawAsteroid(asteroid);
      this.asteroids.push(asteroid);
    }
    
    drawAsteroid(asteroid) {
      asteroid.clear();
      asteroid.lineStyle(2, 0x888888);
      
      const radius = asteroid.size === 'large' ? 30 : asteroid.size === 'medium' ? 20 : 10;
      const points = 8;
      
      asteroid.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const r = radius + Math.sin(i * 2.3) * 5;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        
        if (i === 0) {
          asteroid.moveTo(x, y);
        } else {
          asteroid.lineTo(x, y);
        }
      }
      asteroid.strokePath();
    }
    
    shootBullet() {
      if (this.bullets.length >= 4) return;
      
      const bullet = this.add.circle(this.ship.x, this.ship.y, 2, 0xffff00);
      bullet.velocityX = Math.cos(this.ship.rotation - Math.PI/2) * 300;
      bullet.velocityY = Math.sin(this.ship.rotation - Math.PI/2) * 300;
      bullet.life = 120;
      
      this.bullets.push(bullet);
    }
    
    update(time, delta) {
      if (!this.gameRunning) return;
      
      // Ship rotation
      if (this.ship.turningLeft) {
        this.ship.rotation -= 0.08;
      }
      if (this.ship.turningRight) {
        this.ship.rotation += 0.08;
      }
      
      // Ship thrust
      if (this.ship.thrusting) {
        const thrustPower = 0.4;
        this.ship.velocityX += Math.cos(this.ship.rotation - Math.PI/2) * thrustPower;
        this.ship.velocityY += Math.sin(this.ship.rotation - Math.PI/2) * thrustPower;
      }
      
      if (this.ship.reversing) {
        const thrustPower = 0.2;
        this.ship.velocityX -= Math.cos(this.ship.rotation - Math.PI/2) * thrustPower;
        this.ship.velocityY -= Math.sin(this.ship.rotation - Math.PI/2) * thrustPower;
      }
      
      // Apply friction and max speed
      this.ship.velocityX *= 0.98;
      this.ship.velocityY *= 0.98;
      
      const maxSpeed = 8;
      const speed = Math.sqrt(this.ship.velocityX * this.ship.velocityX + this.ship.velocityY * this.ship.velocityY);
      if (speed > maxSpeed) {
        this.ship.velocityX = (this.ship.velocityX / speed) * maxSpeed;
        this.ship.velocityY = (this.ship.velocityY / speed) * maxSpeed;
      }
      
      // Move ship
      this.ship.x += this.ship.velocityX;
      this.ship.y += this.ship.velocityY;
      
      // Redraw ship (for thrust effect)
      this.drawShip();
      
      // Screen wrapping
      this.wrapObject(this.ship);
      
      // Update asteroids
      this.asteroids.forEach(asteroid => {
        asteroid.x += asteroid.velocityX * delta / 1000;
        asteroid.y += asteroid.velocityY * delta / 1000;
        asteroid.rotation += asteroid.rotationSpeed;
        this.wrapObject(asteroid);
      });
      
      // Update bullets
      this.bullets.forEach((bullet, index) => {
        bullet.x += bullet.velocityX * delta / 1000;
        bullet.y += bullet.velocityY * delta / 1000;
        bullet.life--;
        
        if (bullet.life <= 0 || 
            bullet.x < 0 || bullet.x > GAME_WIDTH || 
            bullet.y < 0 || bullet.y > GAME_HEIGHT) {
          bullet.destroy();
          this.bullets.splice(index, 1);
        }
      });
      
      // Check collisions
      this.checkCollisions();
      
      // Check win condition
      if (this.asteroids.length === 0) {
        this.spawnAsteroids();
        this.score += 100;
        this.scoreText.setText('SCORE: ' + this.score);
      }
    }
    
    wrapObject(obj) {
      if (obj.x < 0) obj.x = GAME_WIDTH;
      if (obj.x > GAME_WIDTH) obj.x = 0;
      if (obj.y < 0) obj.y = GAME_HEIGHT;
      if (obj.y > GAME_HEIGHT) obj.y = 0;
    }
    
    checkCollisions() {
      // Bullets vs asteroids
      this.bullets.forEach((bullet, bulletIndex) => {
        this.asteroids.forEach((asteroid, asteroidIndex) => {
          const radius = asteroid.size === 'large' ? 30 : asteroid.size === 'medium' ? 20 : 10;
          if (Phaser.Math.Distance.Between(bullet.x, bullet.y, asteroid.x, asteroid.y) < radius) {
            this.destroyAsteroid(asteroid, asteroidIndex);
            bullet.destroy();
            this.bullets.splice(bulletIndex, 1);
          }
        });
      });
      
      // Ship vs asteroids
      if (!this.ship.invulnerable) {
        this.asteroids.forEach((asteroid, index) => {
          const radius = asteroid.size === 'large' ? 30 : asteroid.size === 'medium' ? 20 : 10;
          if (Phaser.Math.Distance.Between(this.ship.x, this.ship.y, asteroid.x, asteroid.y) < radius) {
            this.lives--;
            this.livesText.setText('LIVES: ' + this.lives);
            
            if (this.lives <= 0) {
              this.gameOver();
            } else {
              this.respawnShip();
            }
          }
        });
      }
    }
    
    destroyAsteroid(asteroid, index) {
      const points = asteroid.size === 'large' ? 20 : asteroid.size === 'medium' ? 50 : 100;
      this.score += points;
      this.scoreText.setText('SCORE: ' + this.score);
      
      // Create explosion effect
      for (let i = 0; i < 6; i++) {
        const particle = this.add.circle(asteroid.x, asteroid.y, 2, 0xffaa00);
        const angle = (i / 6) * Math.PI * 2;
        const speed = 50 + Math.random() * 50;
        
        this.tweens.add({
          targets: particle,
          x: asteroid.x + Math.cos(angle) * speed,
          y: asteroid.y + Math.sin(angle) * speed,
          alpha: 0,
          duration: 500,
          onComplete: () => particle.destroy()
        });
      }
      
      // Split asteroid
      if (asteroid.size === 'large') {
        for (let i = 0; i < 2; i++) {
          const newAsteroid = this.add.graphics();
          newAsteroid.x = asteroid.x;
          newAsteroid.y = asteroid.y;
          newAsteroid.size = 'medium';
          newAsteroid.velocityX = (Math.random() - 0.5) * 150;
          newAsteroid.velocityY = (Math.random() - 0.5) * 150;
          newAsteroid.rotationSpeed = (Math.random() - 0.5) * 0.15;
          this.drawAsteroid(newAsteroid);
          this.asteroids.push(newAsteroid);
        }
      } else if (asteroid.size === 'medium') {
        for (let i = 0; i < 2; i++) {
          const newAsteroid = this.add.graphics();
          newAsteroid.x = asteroid.x;
          newAsteroid.y = asteroid.y;
          newAsteroid.size = 'small';
          newAsteroid.velocityX = (Math.random() - 0.5) * 200;
          newAsteroid.velocityY = (Math.random() - 0.5) * 200;
          newAsteroid.rotationSpeed = (Math.random() - 0.5) * 0.2;
          this.drawAsteroid(newAsteroid);
          this.asteroids.push(newAsteroid);
        }
      }
      
      asteroid.destroy();
      this.asteroids.splice(index, 1);
    }
    
    respawnShip() {
      this.ship.x = GAME_WIDTH / 2;
      this.ship.y = GAME_HEIGHT / 2;
      this.ship.velocityX = 0;
      this.ship.velocityY = 0;
      this.ship.rotation = 0;
      this.ship.invulnerable = true;
      
      // Blink effect
      this.tweens.add({
        targets: this.ship,
        alpha: 0.3,
        duration: 200,
        yoyo: true,
        repeat: 10,
        onComplete: () => {
          this.ship.alpha = 1;
          this.ship.invulnerable = false;
        }
      });
    }
    
    pauseGame() {
      this.gameRunning = !this.gameRunning;
      
      if (!this.gameRunning) {
        this.pauseOverlay = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
        this.pauseText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'PAUSED\n\nPress ESC to resume\nPress R to restart', {
          fontSize: '20px',
          fill: '#ffff00',
          fontFamily: 'Courier New, monospace',
          fontStyle: 'bold',
          align: 'center'
        }).setOrigin(0.5);
      } else {
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
      this.scene.restart();
    }
    
    gameOver() {
      this.gameRunning = false;
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8);
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 'GAME OVER', {
        fontSize: '32px',
        fill: '#ff0000',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, `Final Score: ${this.score}`, {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 40, 'Press R to restart', {
        fontSize: '16px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000011',
    scene: [AsteroidsScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT
    },
    render: { antialias: true, pixelArt: false }
  };

  try {
    const game = new Phaser.Game(config);
    console.log('[Asteroids] Game initialized successfully');
  } catch (error) {
    console.error('[Asteroids] Error initializing game:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
