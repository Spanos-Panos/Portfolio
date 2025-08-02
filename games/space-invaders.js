// Space Invaders Game with Phaser 3 - Mobile Responsive
console.log('[Space Invaders] Starting game initialization...');

function initGame() {
  if (typeof Phaser === 'undefined') {
    console.error('[Space Invaders] Phaser not loaded!');
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

  class SpaceInvadersScene extends Phaser.Scene {
    constructor() {
      super({ key: 'SpaceInvadersScene' });
    }

    create() {
      this.showMainMenu();
    }
    
    showMainMenu() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000011);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/3, '👾 SPACE INVADERS 👾', {
        fontSize: '28px',
        fill: '#ff0066',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      const playButton = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'PLAY', {
        fontSize: '24px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5).setInteractive();
      
      const settingsButton = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'SETTINGS', {
        fontSize: '20px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5).setInteractive();
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 80, 'Controls: A/D to move • Space to shoot', {
        fontSize: '12px',
        fill: '#888888',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      playButton.on('pointerdown', () => this.startGame());
      settingsButton.on('pointerdown', () => this.showSettings());
    }
    
    showSettings() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000011);
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/4, 'SETTINGS', {
        fontSize: '28px',
        fill: '#ff0066',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 80, 'Controls:', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 'A/← - Move Left', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 30, 'D/→ - Move Right', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 10, 'Space - Shoot', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 10, 'ESC - Pause/Menu', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 40, 'Goal: Destroy all invaders!', {
        fontSize: '12px',
        fill: '#888888',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      const backButton = this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 60, 'BACK', {
        fontSize: '18px',
        fill: '#ff6600',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5).setInteractive();
      
      backButton.on('pointerdown', () => this.showMainMenu());
    }
    
    startGame() {
      this.children.removeAll();
      
      this.score = 0;
      this.lives = 3;
      this.wave = 1;
      this.gameRunning = true;
      this.invaders = [];
      this.playerBullets = [];
      this.invaderBullets = [];
      
      this.createBackground();
      this.createPlayer();
      this.createInvaders();
      this.createBarriers();
      this.createUI();
      this.setupControls();
      
      // Game timers - Faster movement and more aggressive
      this.invaderMoveTimer = 0;
      this.invaderMoveInterval = 800; // Faster movement (was 1000)
      this.invaderShootTimer = 0;
      this.invaderShootInterval = 1500; // More frequent shooting (was 2000)
    }
    
    createBackground() {
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000011);
      
      // Stars
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * GAME_WIDTH;
        const y = Math.random() * GAME_HEIGHT;
        const star = this.add.circle(x, y, 1, 0xffffff, Math.random());
        
        this.tweens.add({
          targets: star,
          alpha: 0.3,
          duration: 2000 + Math.random() * 2000,
          yoyo: true,
          repeat: -1
        });
      }
    }
    
    createPlayer() {
      this.player = this.add.graphics();
      this.player.x = GAME_WIDTH / 2;
      this.player.y = GAME_HEIGHT - 50;
      this.player.speed = 200;
      this.player.canShoot = true;
      this.player.shootCooldown = 0;
      
      this.drawPlayer();
    }
    
    drawPlayer() {
      this.player.clear();
      this.player.lineStyle(2, 0x00ff00);
      this.player.fillStyle(0x00ff00);
      
      // Simple tank-like shape
      this.player.fillTriangle(-15, 10, 15, 10, 0, -10);
      this.player.fillRect(-12, 8, 24, 6);
    }
    
    createInvaders() {
      this.invaders = [];
      const rows = 5;
      const cols = 10;
      const spacing = 40;
      const startX = (GAME_WIDTH - (cols - 1) * spacing) / 2;
      const startY = 120; // Moved closer to player (was 80)
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const invader = this.add.graphics();
          invader.x = startX + col * spacing;
          invader.y = startY + row * spacing;
          invader.row = row;
          invader.col = col;
          invader.points = (4 - row) * 10 + 10; // Higher rows worth more points
          
          this.drawInvader(invader);
          this.invaders.push(invader);
        }
      }
      
      this.invaderDirection = 1; // 1 = right, -1 = left
      this.invaderDropDistance = 30; // Bigger drops for faster approach (was 20)
    }
    
    drawInvader(invader) {
      invader.clear();
      invader.lineStyle(2, 0xff0066);
      invader.fillStyle(0xff0066);
      
      // Simple alien shape
      invader.fillRect(-8, -6, 16, 12);
      invader.fillTriangle(-10, -6, -6, -10, -2, -6);
      invader.fillTriangle(2, -6, 6, -10, 10, -6);
      invader.fillRect(-3, 6, 2, 4);
      invader.fillRect(1, 6, 2, 4);
    }
    
    createBarriers() {
      this.barriers = [];
      const barrierCount = 4;
      const barrierWidth = 60;
      const barrierSpacing = (GAME_WIDTH - barrierCount * barrierWidth) / (barrierCount + 1);
      
      for (let i = 0; i < barrierCount; i++) {
        const barrier = this.add.graphics();
        barrier.x = barrierSpacing + i * (barrierWidth + barrierSpacing) + barrierWidth/2;
        barrier.y = GAME_HEIGHT - 150;
        barrier.health = 3;
        
        this.drawBarrier(barrier);
        this.barriers.push(barrier);
      }
    }
    
    drawBarrier(barrier) {
      barrier.clear();
      const alpha = barrier.health / 3;
      barrier.fillStyle(0x00ffff, alpha);
      
      // Simple barrier shape
      barrier.fillRect(-25, -15, 50, 30);
      barrier.fillRect(-15, 15, 30, 10);
    }
    
    createUI() {
      this.add.text(GAME_WIDTH/2, 20, '👾 SPACE INVADERS 👾', {
        fontSize: '24px',
        fill: '#ff0066',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.scoreText = this.add.text(20, 50, 'SCORE: 0', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      this.livesText = this.add.text(GAME_WIDTH - 120, 50, 'LIVES: 3', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      this.waveText = this.add.text(GAME_WIDTH/2, 50, 'WAVE: 1', {
        fontSize: '16px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      // Mobile controls hint
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 20, 'Touch left/right to move • Tap to shoot', {
        fontSize: '12px',
        fill: '#666666',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
    }
    
    setupControls() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      
      // Mobile touch controls
      this.input.on('pointerdown', (pointer) => {
        // Move player towards touch
        if (pointer.x < GAME_WIDTH/3) {
          this.player.moving = -1; // left
        } else if (pointer.x > 2*GAME_WIDTH/3) {
          this.player.moving = 1; // right
        } else {
          this.shootPlayerBullet();
        }
      });
      
      this.input.on('pointerup', () => {
        this.player.moving = 0;
      });
      
      // Parent frame keyboard events
      window.addEventListener('keydown', (event) => {
        if (!this.gameRunning) return;
        
        switch(event.key.toLowerCase()) {
          case 'arrowleft':
          case 'a':
            this.player.moving = -1;
            break;
          case 'arrowright':
          case 'd':
            this.player.moving = 1;
            break;
          case ' ':
            this.shootPlayerBullet();
            break;
          case 'escape':
            this.pauseGame();
            break;
          case 'r':
            this.restartGame();
            break;
        }
        event.preventDefault();
      });
      
      window.addEventListener('keyup', (event) => {
        switch(event.key.toLowerCase()) {
          case 'arrowleft':
          case 'arrowright':
          case 'a':
          case 'd':
            this.player.moving = 0;
            break;
        }
      });
    }
    
    update(time, delta) {
      if (!this.gameRunning) return;
      
      // Handle player movement with improved responsiveness
      const moveSpeed = this.player.speed * delta / 1000;
      let isMoving = false;
      
      // Check WASD and arrow keys
      if (this.cursors.left.isDown || this.wasdKeys.A.isDown || this.player.moving === -1) {
        this.player.x = Math.max(20, this.player.x - moveSpeed);
        isMoving = true;
      }
      if (this.cursors.right.isDown || this.wasdKeys.D.isDown || this.player.moving === 1) {
        this.player.x = Math.min(GAME_WIDTH - 20, this.player.x + moveSpeed);
        isMoving = true;
      }
      
      // Auto-stop movement when no input detected
      if (!isMoving && this.player.moving !== 0) {
        this.player.moving = 0;
      }
      
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.shootPlayerBullet();
      }
      
      // Update player shoot cooldown
      if (this.player.shootCooldown > 0) {
        this.player.shootCooldown -= delta;
        if (this.player.shootCooldown <= 0) {
          this.player.canShoot = true;
        }
      }
      
      // Update bullets
      this.updateBullets(delta);
      
      // Update invaders
      this.updateInvaders(delta);
      
      // Update invader shooting
      this.invaderShootTimer += delta;
      if (this.invaderShootTimer >= this.invaderShootInterval) {
        this.shootInvaderBullet();
        this.invaderShootTimer = 0;
      }
      
      this.checkCollisions();
      
      // Check win condition
      if (this.invaders.length === 0) {
        this.nextWave();
      }
      
      // Check lose condition
      const lowestInvader = Math.max(...this.invaders.map(inv => inv.y));
      if (lowestInvader > GAME_HEIGHT - 100) {
        this.gameOver();
      }
    }
    
    shootPlayerBullet() {
      if (!this.player.canShoot) return;
      
      const bullet = this.add.rectangle(this.player.x, this.player.y - 15, 3, 10, 0x00ff00);
      bullet.speed = 300;
      bullet.isPlayerBullet = true;
      
      this.playerBullets.push(bullet);
      this.player.canShoot = false;
      this.player.shootCooldown = 250; // 250ms cooldown
    }
    
    shootInvaderBullet() {
      if (this.invaders.length === 0) return;
      
      const shooter = this.invaders[Math.floor(Math.random() * this.invaders.length)];
      const bullet = this.add.rectangle(shooter.x, shooter.y + 15, 3, 8, 0xff0066);
      bullet.speed = 150;
      bullet.isPlayerBullet = false;
      
      this.invaderBullets.push(bullet);
    }
    
    updateBullets(delta) {
      // Update player bullets
      this.playerBullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed * delta / 1000;
        
        if (bullet.y < 0) {
          bullet.destroy();
          this.playerBullets.splice(index, 1);
        }
      });
      
      // Update invader bullets
      this.invaderBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed * delta / 1000;
        
        if (bullet.y > GAME_HEIGHT) {
          bullet.destroy();
          this.invaderBullets.splice(index, 1);
        }
      });
    }
    
    updateInvaders(delta) {
      this.invaderMoveTimer += delta;
      
      if (this.invaderMoveTimer >= this.invaderMoveInterval) {
        let shouldDrop = false;
        
        // Check if any invader hits the edge
        this.invaders.forEach(invader => {
          const nextX = invader.x + this.invaderDirection * 20;
          if (nextX <= 20 || nextX >= GAME_WIDTH - 20) {
            shouldDrop = true;
          }
        });
        
        if (shouldDrop) {
          this.invaderDirection *= -1;
          this.invaders.forEach(invader => {
            invader.y += this.invaderDropDistance;
          });
        } else {
          this.invaders.forEach(invader => {
            invader.x += this.invaderDirection * 20;
          });
        }
        
        this.invaderMoveTimer = 0;
        
        // Speed up as fewer invaders remain
        this.invaderMoveInterval = Math.max(200, 1000 - (50 - this.invaders.length) * 15);
      }
    }
    
    checkCollisions() {
      // Player bullets vs invaders
      this.playerBullets.forEach((bullet, bulletIndex) => {
        this.invaders.forEach((invader, invaderIndex) => {
          if (Phaser.Math.Distance.Between(bullet.x, bullet.y, invader.x, invader.y) < 20) {
            this.score += invader.points;
            this.scoreText.setText('SCORE: ' + this.score);
            
            this.createExplosion(invader.x, invader.y);
            
            invader.destroy();
            this.invaders.splice(invaderIndex, 1);
            
            bullet.destroy();
            this.playerBullets.splice(bulletIndex, 1);
          }
        });
        
        // Player bullets vs barriers
        this.barriers.forEach(barrier => {
          if (Phaser.Math.Distance.Between(bullet.x, bullet.y, barrier.x, barrier.y) < 30) {
            barrier.health--;
            this.drawBarrier(barrier);
            
            bullet.destroy();
            this.playerBullets.splice(bulletIndex, 1);
            
            if (barrier.health <= 0) {
              barrier.destroy();
              const barrierIndex = this.barriers.indexOf(barrier);
              this.barriers.splice(barrierIndex, 1);
            }
          }
        });
      });
      
      // Invader bullets vs player
      this.invaderBullets.forEach((bullet, index) => {
        if (Phaser.Math.Distance.Between(bullet.x, bullet.y, this.player.x, this.player.y) < 20) {
          this.lives--;
          this.livesText.setText('LIVES: ' + this.lives);
          
          this.createExplosion(this.player.x, this.player.y);
          
          bullet.destroy();
          this.invaderBullets.splice(index, 1);
          
          if (this.lives <= 0) {
            this.gameOver();
          }
        }
        
        // Invader bullets vs barriers
        this.barriers.forEach(barrier => {
          if (Phaser.Math.Distance.Between(bullet.x, bullet.y, barrier.x, barrier.y) < 30) {
            barrier.health--;
            this.drawBarrier(barrier);
            
            bullet.destroy();
            this.invaderBullets.splice(index, 1);
            
            if (barrier.health <= 0) {
              barrier.destroy();
              const barrierIndex = this.barriers.indexOf(barrier);
              this.barriers.splice(barrierIndex, 1);
            }
          }
        });
      });
    }
    
    createExplosion(x, y) {
      for (let i = 0; i < 8; i++) {
        const particle = this.add.circle(x, y, 3, 0xffff00);
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30 + Math.random() * 30;
        
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          scaleX: 0,
          scaleY: 0,
          duration: 500,
          onComplete: () => particle.destroy()
        });
      }
    }
    
    nextWave() {
      this.wave++;
      this.waveText.setText('WAVE: ' + this.wave);
      
      // Clear bullets
      this.playerBullets.forEach(bullet => bullet.destroy());
      this.invaderBullets.forEach(bullet => bullet.destroy());
      this.playerBullets = [];
      this.invaderBullets = [];
      
      // Create new invaders
      this.createInvaders();
      
      // Increase difficulty
      this.invaderShootInterval = Math.max(500, this.invaderShootInterval - 200);
      
      // Show wave text
      const waveAnnouncement = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, `WAVE ${this.wave}`, {
        fontSize: '48px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.tweens.add({
        targets: waveAnnouncement,
        alpha: 0,
        duration: 2000,
        onComplete: () => waveAnnouncement.destroy()
      });
    }
    
    pauseGame() {
      this.gameRunning = !this.gameRunning;
      
      if (!this.gameRunning) {
        this.pauseOverlay = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
        this.pauseText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'PAUSED\n\nPress ESC to resume', {
          fontSize: '24px',
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
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 25, `Waves Completed: ${this.wave - 1}`, {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 60, 'Press R to restart', {
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
    scene: [SpaceInvadersScene],
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
    console.log('[Space Invaders] Game initialized successfully');
  } catch (error) {
    console.error('[Space Invaders] Error initializing game:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
