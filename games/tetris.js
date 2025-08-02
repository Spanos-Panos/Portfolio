// Tetris Game with Phaser 3 - Mobile Responsive
console.log('[Tetris] Starting game initialization...');

function initGame() {
  console.log('[Tetris] initGame called');
  
  if (typeof Phaser === 'undefined') {
    console.error('[Tetris] Phaser not loaded!');
    return;
  }
  
  console.log('[Tetris] Phaser loaded successfully');
  
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
  
  // Tetris game settings
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const BLOCK_SIZE = Math.min(GAME_WIDTH / (BOARD_WIDTH + 8), GAME_HEIGHT / (BOARD_HEIGHT + 2));
  
  // Tetromino shapes
  const TETROMINOES = {
    I: { color: 0x00ffff, shape: [[1,1,1,1]] },
    O: { color: 0xffff00, shape: [[1,1],[1,1]] },
    T: { color: 0x800080, shape: [[0,1,0],[1,1,1]] },
    S: { color: 0x00ff00, shape: [[0,1,1],[1,1,0]] },
    Z: { color: 0xff0000, shape: [[1,1,0],[0,1,1]] },
    J: { color: 0x0000ff, shape: [[1,0,0],[1,1,1]] },
    L: { color: 0xff8000, shape: [[0,0,1],[1,1,1]] }
  };

  class TetrisScene extends Phaser.Scene {
    constructor() {
      super({ key: 'TetrisScene' });
    }

    create() {
      this.showMainMenu();
    }
    
    showMainMenu() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000033);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/3, '🎮 TETRIS 🎮', {
        fontSize: '32px',
        fill: '#00ffff',
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
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 80, 'Controls: WASD to move/rotate • Space to drop', {
        fontSize: '12px',
        fill: '#888888',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      playButton.on('pointerdown', () => this.startGame());
      settingsButton.on('pointerdown', () => this.showSettings());
      
      // Touch controls for menu
      this.input.on('pointerdown', (pointer) => {
        if (pointer.y > GAME_HEIGHT/2 - 20 && pointer.y < GAME_HEIGHT/2 + 20) {
          this.startGame();
        }
      });
    }
    
    showSettings() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000033);
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/4, 'SETTINGS', {
        fontSize: '28px',
        fill: '#00ffff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 80, 'Controls:', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 'W/↑ - Rotate', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 30, 'A/← - Move Left', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 10, 'S/↓ - Soft Drop', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 10, 'D/→ - Move Right', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 30, 'Space - Hard Drop', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'ESC - Pause/Menu', {
        fontSize: '14px',
        fill: '#ffff00',
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
      
      // Initialize game board
      this.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
      this.boardGraphics = this.add.graphics();
      
      // Game state
      this.currentPiece = null;
      this.currentX = 0;
      this.currentY = 0;
      this.currentRotation = 0;
      this.dropTime = 0;
      this.dropInterval = 1000; // 1 second
      this.gameRunning = true;
      this.score = 0;
      this.lines = 0;
      this.level = 1;
      
      // Create background
      this.createBackground();
      
      // Create UI
      this.createUI();
      
      // Set up controls
      this.setupControls();
      
      // Spawn first piece
      this.spawnPiece();
      
      // Start game loop
      this.gameTimer = this.time.addEvent({
        delay: this.dropInterval,
        callback: this.dropPiece,
        callbackScope: this,
        loop: true
      });
    }
    
    createBackground() {
      // Dark background
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000033);
      
      // Board border
      const boardX = GAME_WIDTH/2 - (BOARD_WIDTH * BLOCK_SIZE)/2;
      const boardY = GAME_HEIGHT/2 - (BOARD_HEIGHT * BLOCK_SIZE)/2;
      
      this.add.rectangle(
        boardX + (BOARD_WIDTH * BLOCK_SIZE)/2, 
        boardY + (BOARD_HEIGHT * BLOCK_SIZE)/2,
        BOARD_WIDTH * BLOCK_SIZE + 4,
        BOARD_HEIGHT * BLOCK_SIZE + 4,
        0x666666
      );
      
      this.add.rectangle(
        boardX + (BOARD_WIDTH * BLOCK_SIZE)/2, 
        boardY + (BOARD_HEIGHT * BLOCK_SIZE)/2,
        BOARD_WIDTH * BLOCK_SIZE,
        BOARD_HEIGHT * BLOCK_SIZE,
        0x000000
      );
    }
    
    createUI() {
      // Title
      this.add.text(GAME_WIDTH/2, 30, '🧩 TETRIS CLASSIC 🧩', {
        fontSize: '24px',
        fill: '#00ffff',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // Score display
      this.scoreText = this.add.text(50, 100, 'SCORE: 0', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      this.linesText = this.add.text(50, 130, 'LINES: 0', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      this.levelText = this.add.text(50, 160, 'LEVEL: 1', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      // Controls info
      this.add.text(GAME_WIDTH - 50, 100, 'CONTROLS:', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(1, 0);
      
      this.add.text(GAME_WIDTH - 50, 120, '← → Move', {
        fontSize: '12px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(1, 0);
      
      this.add.text(GAME_WIDTH - 50, 140, '↑ Rotate', {
        fontSize: '12px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(1, 0);
      
      this.add.text(GAME_WIDTH - 50, 160, '↓ Drop', {
        fontSize: '12px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(1, 0);
    }
    
    setupControls() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      
      // Mobile touch support
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
          if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
              this.movePiece(1, 0);
            } else {
              this.movePiece(-1, 0);
            }
          }
        } else {
          if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
              this.dropPiece();
            } else {
              this.rotatePiece();
            }
          } else {
            // Small tap = rotate
            this.rotatePiece();
          }
        }
        
        this.startX = null;
        this.startY = null;
      });
      
      // Parent frame keyboard events
      window.addEventListener('keydown', (event) => {
        if (!this.gameRunning) return;
        
        switch(event.key.toLowerCase()) {
          case 'arrowleft':
          case 'a':
            this.movePiece(-1, 0);
            break;
          case 'arrowright':
          case 'd':
            this.movePiece(1, 0);
            break;
          case 'arrowup':
          case 'w':
            this.rotatePiece();
            break;
          case 'arrowdown':
          case 's':
            this.dropPiece();
            break;
          case ' ':
            this.hardDrop();
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
    }
    
    update(time, delta) {
      if (!this.gameRunning) return;
      
      // Handle continuous input
      if (this.cursors.left.isDown) {
        this.movePiece(-1, 0);
      } else if (this.cursors.right.isDown) {
        this.movePiece(1, 0);
      }
      
      if (this.cursors.down.isDown) {
        this.dropPiece();
      }
      
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        this.rotatePiece();
      }
      
      // Auto drop
      this.dropTime += delta;
      if (this.dropTime >= this.dropInterval) {
        this.dropPiece();
        this.dropTime = 0;
      }
    }
    
    spawnPiece() {
      const pieces = Object.keys(TETROMINOES);
      const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
      this.currentPiece = TETROMINOES[randomPiece];
      this.currentX = Math.floor(BOARD_WIDTH / 2) - 1;
      this.currentY = 0;
      this.currentRotation = 0;
      
      // Check for game over
      if (this.isCollision(this.currentX, this.currentY, this.currentPiece.shape)) {
        this.gameOver();
        return;
      }
      
      // Draw the new piece
      this.drawBoard();
    }
    
    movePiece(dx, dy) {
      if (!this.currentPiece) return;
      
      const newX = this.currentX + dx;
      const newY = this.currentY + dy;
      
      if (!this.isCollision(newX, newY, this.currentPiece.shape)) {
        this.currentX = newX;
        this.currentY = newY;
        this.drawBoard();
      }
    }
    
    rotatePiece() {
      if (!this.currentPiece) return;
      
      const rotated = this.rotateMatrix(this.currentPiece.shape);
      
      if (!this.isCollision(this.currentX, this.currentY, rotated)) {
        this.currentPiece.shape = rotated;
        this.drawBoard();
      }
    }
    
    dropPiece() {
      if (!this.currentPiece) return;
      
      if (!this.isCollision(this.currentX, this.currentY + 1, this.currentPiece.shape)) {
        this.currentY++;
      } else {
        this.placePiece();
        this.clearLines();
        this.spawnPiece();
      }
      
      this.drawBoard();
    }
    
    isCollision(x, y, shape) {
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const boardX = x + col;
            const boardY = y + row;
            
            if (boardX < 0 || boardX >= BOARD_WIDTH || 
                boardY >= BOARD_HEIGHT ||
                (boardY >= 0 && this.board[boardY][boardX])) {
              return true;
            }
          }
        }
      }
      return false;
    }
    
    placePiece() {
      for (let row = 0; row < this.currentPiece.shape.length; row++) {
        for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
          if (this.currentPiece.shape[row][col]) {
            const boardX = this.currentX + col;
            const boardY = this.currentY + row;
            
            if (boardY >= 0) {
              this.board[boardY][boardX] = this.currentPiece.color;
            }
          }
        }
      }
    }
    
    clearLines() {
      let linesCleared = 0;
      
      for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
        if (this.board[row].every(cell => cell !== 0)) {
          this.board.splice(row, 1);
          this.board.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          row++; // Check the same row again
        }
      }
      
      if (linesCleared > 0) {
        this.lines += linesCleared;
        this.score += linesCleared * 100 * this.level;
        this.level = Math.floor(this.lines / 10) + 1;
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        
        this.scoreText.setText('SCORE: ' + this.score);
        this.linesText.setText('LINES: ' + this.lines);
        this.levelText.setText('LEVEL: ' + this.level);
      }
    }
    
    rotateMatrix(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          rotated[col][rows - 1 - row] = matrix[row][col];
        }
      }
      
      return rotated;
    }
    
    drawBoard() {
      this.boardGraphics.clear();
      
      const boardX = GAME_WIDTH/2 - (BOARD_WIDTH * BLOCK_SIZE)/2;
      const boardY = GAME_HEIGHT/2 - (BOARD_HEIGHT * BLOCK_SIZE)/2;
      
      // Draw placed pieces
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          if (this.board[row][col]) {
            this.boardGraphics.fillStyle(this.board[row][col]);
            this.boardGraphics.fillRect(
              boardX + col * BLOCK_SIZE,
              boardY + row * BLOCK_SIZE,
              BLOCK_SIZE - 1,
              BLOCK_SIZE - 1
            );
          }
        }
      }
      
      // Draw current piece
      if (this.currentPiece) {
        this.boardGraphics.fillStyle(this.currentPiece.color);
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
          for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
            if (this.currentPiece.shape[row][col]) {
              this.boardGraphics.fillRect(
                boardX + (this.currentX + col) * BLOCK_SIZE,
                boardY + (this.currentY + row) * BLOCK_SIZE,
                BLOCK_SIZE - 1,
                BLOCK_SIZE - 1
              );
            }
          }
        }
      }
    }
    
    hardDrop() {
      if (!this.currentPiece) return;
      
      // Drop the piece as far as it can go
      while (!this.isCollision(this.currentX, this.currentY + 1, this.currentPiece.shape)) {
        this.currentY++;
        this.score += 2; // Bonus points for hard drop
      }
      
      this.placePiece();
      this.clearLines();
      this.spawnPiece();
      this.scoreText.setText('SCORE: ' + this.score);
      this.drawBoard();
    }
    
    pauseGame() {
      this.gameRunning = !this.gameRunning;
      
      if (!this.gameRunning) {
        if (this.gameTimer) {
          this.gameTimer.paused = true;
        }
        
        this.pauseOverlay = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
        this.pauseText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'PAUSED\n\nPress ESC to resume\nPress R to restart\nPress M for menu', {
          fontSize: '20px',
          fill: '#ffff00',
          fontFamily: 'Courier New, monospace',
          fontStyle: 'bold',
          align: 'center'
        }).setOrigin(0.5);
      } else {
        if (this.gameTimer) {
          this.gameTimer.paused = false;
        }
        
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
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'Press R to restart', {
        fontSize: '16px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
    }
  }

  // Game configuration
  const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000033',
    scene: [TetrisScene],
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
    console.log('[Tetris] Game initialized successfully');
  } catch (error) {
    console.error('[Tetris] Error initializing game:', error);
    
    const container = document.getElementById('game-container');
    if (container) {
      container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff0000; font-family: monospace;">
          <div style="text-align: center;">
            <h3>Game Loading Error</h3>
            <p>Failed to initialize Tetris game</p>
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
