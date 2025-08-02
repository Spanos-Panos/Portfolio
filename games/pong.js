// Pong Game with Phaser 3 - Mobile Responsive
console.log('[Pong] Starting game initialization...');

function initGame() {
  console.log('[Pong] initGame called');
  
  if (typeof Phaser === 'undefined') {
    console.error('[Pong] Phaser not loaded!');
    return;
  }
  
  console.log('[Pong] Phaser loaded successfully');
  
  // Remove loading overlay
  setTimeout(() => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.transition = 'opacity 0.3s ease-out';
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.remove();
      }, 300);
    }
  }, 2500);

  const container = document.getElementById('game-container');
  const GAME_WIDTH = container ? container.offsetWidth || 720 : 720;
  const GAME_HEIGHT = container ? container.offsetHeight || 540 : 540;
  
  class PongScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PongScene' });
    }

    create() {
      this.showMainMenu();
    }
    
    showMainMenu() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x001100);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/3, '🏓 PONG CLASSIC 🏓', {
        fontSize: '32px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      const playButton = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'PLAY', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      const settingsButton = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'SETTINGS', {
        fontSize: '20px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 80, 'First to 11 points wins!', {
        fontSize: '16px',
        fill: '#888888',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      // Button interactions
      playButton.on('pointerdown', () => {
        console.log('[Pong] Play button clicked');
        this.startGame();
      });
      
      playButton.on('pointerover', () => {
        playButton.setTint(0x00ff00);
      });
      
      playButton.on('pointerout', () => {
        playButton.clearTint();
      });
      
      settingsButton.on('pointerdown', () => {
        console.log('[Pong] Settings button clicked');
        this.showSettings();
      });
      
      settingsButton.on('pointerover', () => {
        settingsButton.setTint(0xff6600);
      });
      
      settingsButton.on('pointerout', () => {
        settingsButton.clearTint();
      });
    }
    
    showSettings() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x001100);
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/4, 'SETTINGS', {
        fontSize: '28px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 80, 'Controls:', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 'W/↑ - Move Paddle Up', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 30, 'S/↓ - Move Paddle Down', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 10, 'Touch & Drag - Mobile Control', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 10, 'ESC - Pause/Menu', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 40, 'AI Difficulty: Smart', {
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
      
      // Game settings
      this.paddleSpeed = 300;
      this.ballSpeed = 250;
      this.playerScore = 0;
      this.aiScore = 0;
      this.gameRunning = true;
      this.winningScore = 11;
      
      // Create background
      this.createBackground();
      
      // Create paddles
      this.playerPaddle = this.add.rectangle(50, GAME_HEIGHT/2, 15, 80, 0x00ff00);
      this.aiPaddle = this.add.rectangle(GAME_WIDTH - 50, GAME_HEIGHT/2, 15, 80, 0x00ff00);
      
      // Create ball
      this.ball = this.add.circle(GAME_WIDTH/2, GAME_HEIGHT/2, 8, 0xffffff);
      this.resetBall();
      
      // Create UI
      this.createUI();
      
      // Set up controls
      this.setupControls();
    }
    
    createBackground() {
      // Black background
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000);
      
      // Center line
      const graphics = this.add.graphics();
      graphics.lineStyle(2, 0x666666);
      
      for (let y = 0; y < GAME_HEIGHT; y += 20) {
        graphics.moveTo(GAME_WIDTH/2, y);
        graphics.lineTo(GAME_WIDTH/2, y + 10);
      }
      graphics.strokePath();
      
      // Border
      graphics.lineStyle(3, 0x00ff00);
      graphics.strokeRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    
    createUI() {
      // Title
      this.add.text(GAME_WIDTH/2, 30, '🏓 PONG CLASSIC 🏓', {
        fontSize: '24px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // Score display
      this.playerScoreText = this.add.text(GAME_WIDTH/4, 70, '0', {
        fontSize: '48px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.aiScoreText = this.add.text(3*GAME_WIDTH/4, 70, '0', {
        fontSize: '48px',
        fill: '#00ff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // Player labels
      this.add.text(GAME_WIDTH/4, 100, 'PLAYER', {
        fontSize: '14px',
        fill: '#88ff88',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(3*GAME_WIDTH/4, 100, 'COMPUTER', {
        fontSize: '14px',
        fill: '#88ff88',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      // Controls info
      this.controlsText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 40, 'Touch/Swipe to move paddle • First to 11 wins!', {
        fontSize: '12px',
        fill: '#666666',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
    }
    
    setupControls() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys('W,S');
      
      // Mobile touch support
      this.input.on('pointermove', (pointer) => {
        if (this.gameRunning && pointer.isDown) {
          const paddleY = Phaser.Math.Clamp(pointer.y, 40, GAME_HEIGHT - 40);
          this.playerPaddle.y = paddleY;
        }
      });
      
      this.input.on('pointerdown', (pointer) => {
        if (this.gameRunning) {
          const paddleY = Phaser.Math.Clamp(pointer.y, 40, GAME_HEIGHT - 40);
          this.playerPaddle.y = paddleY;
        }
      });
      
      // Parent frame keyboard events
      window.addEventListener('keydown', (event) => {
        if (!this.gameRunning) return;
        
        switch(event.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            this.playerPaddle.y = Math.max(40, this.playerPaddle.y - 20);
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            this.playerPaddle.y = Math.min(GAME_HEIGHT - 40, this.playerPaddle.y + 20);
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
    
    update(time, delta) {
      if (!this.gameRunning) return;
      
      // Handle keyboard input
      if (this.cursors.up.isDown || this.wasd.W.isDown) {
        this.playerPaddle.y = Math.max(40, this.playerPaddle.y - this.paddleSpeed * delta / 1000);
      } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
        this.playerPaddle.y = Math.min(GAME_HEIGHT - 40, this.playerPaddle.y + this.paddleSpeed * delta / 1000);
      }
      
      // Update ball position
      this.ball.x += this.ballVelocity.x * delta / 1000;
      this.ball.y += this.ballVelocity.y * delta / 1000;
      
      // Ball collision with top/bottom walls
      if (this.ball.y <= 8 || this.ball.y >= GAME_HEIGHT - 8) {
        this.ballVelocity.y = -this.ballVelocity.y;
        this.createBounceEffect(this.ball.x, this.ball.y);
      }
      
      // Ball collision with paddles
      if (this.ball.x <= 65 && 
          this.ball.y >= this.playerPaddle.y - 40 && 
          this.ball.y <= this.playerPaddle.y + 40 &&
          this.ballVelocity.x < 0) {
        this.ballVelocity.x = -this.ballVelocity.x;
        this.ballVelocity.y = (this.ball.y - this.playerPaddle.y) * 5;
        this.ballSpeed = Math.min(this.ballSpeed + 10, 400);
        this.createBounceEffect(this.ball.x, this.ball.y);
      }
      
      if (this.ball.x >= GAME_WIDTH - 65 && 
          this.ball.y >= this.aiPaddle.y - 40 && 
          this.ball.y <= this.aiPaddle.y + 40 &&
          this.ballVelocity.x > 0) {
        this.ballVelocity.x = -this.ballVelocity.x;
        this.ballVelocity.y = (this.ball.y - this.aiPaddle.y) * 5;
        this.ballSpeed = Math.min(this.ballSpeed + 10, 400);
        this.createBounceEffect(this.ball.x, this.ball.y);
      }
      
      // Score points
      if (this.ball.x < 0) {
        this.aiScore++;
        this.aiScoreText.setText(this.aiScore.toString());
        this.checkWin();
        this.resetBall();
      } else if (this.ball.x > GAME_WIDTH) {
        this.playerScore++;
        this.playerScoreText.setText(this.playerScore.toString());
        this.checkWin();
        this.resetBall();
      }
      
      // AI paddle movement
      const aiSpeed = 200;
      const aiTarget = this.ball.y;
      const aiDiff = aiTarget - this.aiPaddle.y;
      
      if (Math.abs(aiDiff) > 5) {
        if (aiDiff > 0) {
          this.aiPaddle.y = Math.min(GAME_HEIGHT - 40, this.aiPaddle.y + aiSpeed * delta / 1000);
        } else {
          this.aiPaddle.y = Math.max(40, this.aiPaddle.y - aiSpeed * delta / 1000);
        }
      }
    }
    
    resetBall() {
      this.ball.x = GAME_WIDTH / 2;
      this.ball.y = GAME_HEIGHT / 2;
      
      // Random direction
      const angle = (Math.random() - 0.5) * Math.PI / 3; // ±30 degrees
      const direction = Math.random() < 0.5 ? 1 : -1;
      
      this.ballVelocity.x = Math.cos(angle) * this.ballSpeed * direction;
      this.ballVelocity.y = Math.sin(angle) * this.ballSpeed;
      
      this.ballSpeed = 250; // Reset speed
    }
    
    createBounceEffect(x, y) {
      // Particle effect
      for (let i = 0; i < 8; i++) {
        const particle = this.add.circle(x, y, 2, 0x00ff00);
        const angle = (i / 8) * Math.PI * 2;
        const distance = 30;
        
        this.tweens.add({
          targets: particle,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          alpha: 0,
          duration: 300,
          onComplete: () => particle.destroy()
        });
      }
      
      // Screen shake
      this.cameras.main.shake(100, 0.01);
    }
    
    checkWin() {
      if (this.playerScore >= this.winningScore) {
        this.gameWin(true);
      } else if (this.aiScore >= this.winningScore) {
        this.gameWin(false);
      }
    }
    
    gameWin(playerWon) {
      this.gameRunning = false;
      
      const overlay = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8);
      
      const winText = playerWon ? 'YOU WIN!' : 'COMPUTER WINS!';
      const winColor = playerWon ? '#00ff00' : '#ff6600';
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, winText, {
        fontSize: '32px',
        fill: winColor,
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, `Final Score: ${this.playerScore} - ${this.aiScore}`, {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'Press R to play again', {
        fontSize: '16px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      // Celebration effect
      if (playerWon) {
        this.createCelebration();
      }
    }
    
    createCelebration() {
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * GAME_WIDTH;
        const y = Math.random() * GAME_HEIGHT;
        const color = Phaser.Utils.Array.GetRandom([0x00ff00, 0xffff00, 0x00ffff]);
        const particle = this.add.circle(x, y, 4, color);
        
        this.tweens.add({
          targets: particle,
          scaleX: 2,
          scaleY: 2,
          alpha: 0,
          duration: 1000 + Math.random() * 1000,
          onComplete: () => particle.destroy()
        });
      }
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
  }

  // Game configuration
  const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [PongScene],
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
    const game = new Phaser.Game(config);
    console.log('[Pong] Game initialized successfully');
  } catch (error) {
    console.error('[Pong] Error initializing game:', error);
    
    const container = document.getElementById('game-container');
    if (container) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff0000; font-family: monospace;">
          <div style="text-align: center;">
            <h3>Game Loading Error</h3>
            <p>Failed to initialize Pong game</p>
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
