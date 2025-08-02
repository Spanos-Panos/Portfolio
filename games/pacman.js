// Pac-Man Game with Phaser 3 - Mobile Responsive
console.log('[Pac-Man] Starting game initialization...');

function initGame() {
  if (typeof Phaser === 'undefined') {
    console.error('[Pac-Man] Phaser not loaded!');
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
  
  const TILE_SIZE = 20;
  const MAZE_WIDTH = Math.floor(GAME_WIDTH / TILE_SIZE);
  const MAZE_HEIGHT = Math.floor(GAME_HEIGHT / TILE_SIZE);
  
  // Better Pac-Man maze layout (1 = wall, 0 = empty, 2 = dot, 3 = power pellet)
  const generateMaze = () => {
    const maze = Array(MAZE_HEIGHT).fill().map(() => Array(MAZE_WIDTH).fill(0));
    
    // Create border walls
    for (let x = 0; x < MAZE_WIDTH; x++) {
      maze[0][x] = 1;
      maze[MAZE_HEIGHT-1][x] = 1;
    }
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      maze[y][0] = 1;
      maze[y][MAZE_WIDTH-1] = 1;
    }
    
    // Create a more classic Pac-Man style maze
    const midX = Math.floor(MAZE_WIDTH / 2);
    const midY = Math.floor(MAZE_HEIGHT / 2);
    
    // Add internal wall blocks
    for (let x = 3; x < MAZE_WIDTH - 3; x += 6) {
      for (let y = 3; y < MAZE_HEIGHT - 3; y += 4) {
        // Create small wall blocks
        if (x !== midX && y !== midY) {
          maze[y][x] = 1;
          maze[y][x+1] = 1;
          maze[y+1][x] = 1;
          maze[y+1][x+1] = 1;
        }
      }
    }
    
    // Add some horizontal corridors
    for (let x = 1; x < MAZE_WIDTH - 1; x++) {
      if (x % 6 === 0) {
        for (let y = 2; y < MAZE_HEIGHT - 2; y += 8) {
          maze[y][x] = 1;
          maze[y+1][x] = 1;
        }
      }
    }
    
    // Fill empty spaces with dots
    for (let y = 1; y < MAZE_HEIGHT-1; y++) {
      for (let x = 1; x < MAZE_WIDTH-1; x++) {
        if (maze[y][x] === 0) {
          maze[y][x] = 2; // dot
        }
      }
    }
    
    // Add power pellets in strategic locations
    if (MAZE_WIDTH > 6 && MAZE_HEIGHT > 6) {
      maze[2][2] = 3;
      maze[2][MAZE_WIDTH-3] = 3;
      maze[MAZE_HEIGHT-3][2] = 3;
      maze[MAZE_HEIGHT-3][MAZE_WIDTH-3] = 3;
    }
    
    // Clear starting area for Pac-Man
    const startX = Math.floor(MAZE_WIDTH/2);
    const startY = Math.floor(MAZE_HEIGHT/2);
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        if (startX + dx >= 0 && startX + dx < MAZE_WIDTH && 
            startY + dy >= 0 && startY + dy < MAZE_HEIGHT) {
          maze[startY + dy][startX + dx] = 0;
        }
      }
    }
    
    return maze;
  };

  class PacManScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PacManScene' });
    }

    create() {
      this.showMainMenu();
    }
    
    showMainMenu() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/3, '👻 PAC-MAN 👻', {
        fontSize: '32px',
        fill: '#ffff00',
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
        fill: '#ff6600',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5).setInteractive();
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 80, 'Controls: WASD to move • Collect all dots!', {
        fontSize: '12px',
        fill: '#888888',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      playButton.on('pointerdown', () => this.startGame());
      settingsButton.on('pointerdown', () => this.showSettings());
    }
    
    showSettings() {
      this.children.removeAll();
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000);
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/4, 'SETTINGS', {
        fontSize: '28px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 80, 'Controls:', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 'W/↑ - Move Up', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 30, 'A/← - Move Left', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 10, 'S/↓ - Move Down', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 10, 'D/→ - Move Right', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 30, 'ESC - Pause/Menu', {
        fontSize: '14px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 60, 'Goal: Eat all dots while avoiding ghosts!', {
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
      
      this.maze = generateMaze();
      this.score = 0;
      this.lives = 3;
      this.gameRunning = true;
      this.dotsRemaining = 0;
      
      this.createBackground();
      this.createMaze();
      this.createPacMan();
      this.createGhosts();
      this.createUI();
      this.setupControls();
      
      this.countDots();
    }
    
    createBackground() {
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000033);
    }
    
    createMaze() {
      this.mazeGraphics = this.add.graphics();
      this.drawMaze();
    }
    
    drawMaze() {
      this.mazeGraphics.clear();
      
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
          const tile = this.maze[y][x];
          const pixelX = x * TILE_SIZE;
          const pixelY = y * TILE_SIZE;
          
          if (tile === 1) { // Wall
            this.mazeGraphics.fillStyle(0x0000ff);
            this.mazeGraphics.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
          } else if (tile === 2) { // Dot
            this.mazeGraphics.fillStyle(0xffff00);
            this.mazeGraphics.fillCircle(pixelX + TILE_SIZE/2, pixelY + TILE_SIZE/2, 2);
          } else if (tile === 3) { // Power pellet
            this.mazeGraphics.fillStyle(0xffff00);
            this.mazeGraphics.fillCircle(pixelX + TILE_SIZE/2, pixelY + TILE_SIZE/2, 6);
          }
        }
      }
    }
    
    createPacMan() {
      this.pacman = {
        x: Math.floor(MAZE_WIDTH/2),
        y: Math.floor(MAZE_HEIGHT/2),
        direction: 0, // 0=right, 1=down, 2=left, 3=up
        nextDirection: 0,
        moveTimer: 0,
        moveInterval: 200
      };
      
      this.pacmanGraphics = this.add.graphics();
      this.drawPacMan();
    }
    
    drawPacMan() {
      this.pacmanGraphics.clear();
      this.pacmanGraphics.fillStyle(0xffff00);
      
      const pixelX = this.pacman.x * TILE_SIZE + TILE_SIZE/2;
      const pixelY = this.pacman.y * TILE_SIZE + TILE_SIZE/2;
      
      // Simple circle for Pac-Man
      this.pacmanGraphics.fillCircle(pixelX, pixelY, TILE_SIZE/2 - 2);
      
      // Mouth (simple line)
      this.pacmanGraphics.lineStyle(3, 0x000033);
      const mouthAngle = this.pacman.direction * Math.PI/2;
      const mouthX = pixelX + Math.cos(mouthAngle) * 6;
      const mouthY = pixelY + Math.sin(mouthAngle) * 6;
      this.pacmanGraphics.lineBetween(pixelX, pixelY, mouthX, mouthY);
    }
    
    createGhosts() {
      this.ghosts = [];
      const colors = [0xff0000, 0xff69b4, 0x00ffff, 0xffa500];
      
      for (let i = 0; i < 4; i++) {
        const ghost = {
          x: Math.floor(MAZE_WIDTH/2) + (i - 2),
          y: Math.floor(MAZE_HEIGHT/2) - 1,
          direction: Math.floor(Math.random() * 4),
          color: colors[i],
          moveTimer: 0,
          moveInterval: 300 + i * 50
        };
        this.ghosts.push(ghost);
      }
      
      this.ghostGraphics = this.add.graphics();
      this.drawGhosts();
    }
    
    drawGhosts() {
      this.ghostGraphics.clear();
      
      this.ghosts.forEach(ghost => {
        this.ghostGraphics.fillStyle(ghost.color);
        const pixelX = ghost.x * TILE_SIZE + TILE_SIZE/2;
        const pixelY = ghost.y * TILE_SIZE + TILE_SIZE/2;
        
        // Simple circle for ghost
        this.ghostGraphics.fillCircle(pixelX, pixelY, TILE_SIZE/2 - 2);
        
        // Eyes
        this.ghostGraphics.fillStyle(0xffffff);
        this.ghostGraphics.fillCircle(pixelX - 3, pixelY - 2, 2);
        this.ghostGraphics.fillCircle(pixelX + 3, pixelY - 2, 2);
      });
    }
    
    createUI() {
      this.add.text(GAME_WIDTH/2, 20, '👻 PAC-MAN CLASSIC 👻', {
        fontSize: '20px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.scoreText = this.add.text(20, GAME_HEIGHT - 60, 'SCORE: 0', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      this.livesText = this.add.text(20, GAME_HEIGHT - 40, 'LIVES: 3', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      });
      
      this.add.text(GAME_WIDTH - 20, GAME_HEIGHT - 60, 'Arrow keys to move', {
        fontSize: '12px',
        fill: '#888888',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(1, 0);
    }
    
    setupControls() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = this.input.keyboard.addKeys('W,S,A,D');
      this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      
      // Mobile swipe controls
      this.input.on('pointerdown', (pointer) => {
        this.startX = pointer.x;
        this.startY = pointer.y;
      });
      
      this.input.on('pointerup', (pointer) => {
        if (!this.startX || !this.startY) return;
        
        const deltaX = pointer.x - this.startX;
        const deltaY = pointer.y - this.startY;
        const minSwipeDistance = 30;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (Math.abs(deltaX) > minSwipeDistance) {
            this.pacman.nextDirection = deltaX > 0 ? 0 : 2; // right : left
          }
        } else {
          if (Math.abs(deltaY) > minSwipeDistance) {
            this.pacman.nextDirection = deltaY > 0 ? 1 : 3; // down : up
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
            this.pacman.nextDirection = 2;
            break;
          case 'arrowright':
          case 'd':
            this.pacman.nextDirection = 0;
            break;
          case 'arrowup':
          case 'w':
            this.pacman.nextDirection = 3;
            break;
          case 'arrowdown':
          case 's':
            this.pacman.nextDirection = 1;
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
      
      // Handle input
      if (this.cursors.left.isDown) this.pacman.nextDirection = 2;
      if (this.cursors.right.isDown) this.pacman.nextDirection = 0;
      if (this.cursors.up.isDown) this.pacman.nextDirection = 3;
      if (this.cursors.down.isDown) this.pacman.nextDirection = 1;
      
      // Update Pac-Man
      this.pacman.moveTimer += delta;
      if (this.pacman.moveTimer >= this.pacman.moveInterval) {
        this.movePacMan();
        this.pacman.moveTimer = 0;
      }
      
      // Update ghosts
      this.ghosts.forEach(ghost => {
        ghost.moveTimer += delta;
        if (ghost.moveTimer >= ghost.moveInterval) {
          this.moveGhost(ghost);
          ghost.moveTimer = 0;
        }
      });
      
      this.checkCollisions();
      
      // Check win condition
      if (this.dotsRemaining <= 0) {
        this.levelComplete();
      }
    }
    
    movePacMan() {
      const directions = [{x:1,y:0}, {x:0,y:1}, {x:-1,y:0}, {x:0,y:-1}];
      
      // Try to change direction
      const nextDir = directions[this.pacman.nextDirection];
      const nextX = this.pacman.x + nextDir.x;
      const nextY = this.pacman.y + nextDir.y;
      
      if (this.isValidMove(nextX, nextY)) {
        this.pacman.direction = this.pacman.nextDirection;
      }
      
      // Move in current direction
      const currentDir = directions[this.pacman.direction];
      const newX = this.pacman.x + currentDir.x;
      const newY = this.pacman.y + currentDir.y;
      
      if (this.isValidMove(newX, newY)) {
        this.pacman.x = newX;
        this.pacman.y = newY;
        
        // Eat dots
        if (this.maze[newY][newX] === 2) {
          this.maze[newY][newX] = 0;
          this.score += 10;
          this.dotsRemaining--;
          this.scoreText.setText('SCORE: ' + this.score);
          this.drawMaze();
        } else if (this.maze[newY][newX] === 3) {
          this.maze[newY][newX] = 0;
          this.score += 50;
          this.dotsRemaining--;
          this.scoreText.setText('SCORE: ' + this.score);
          this.drawMaze();
        }
      }
      
      this.drawPacMan();
    }
    
    moveGhost(ghost) {
      const directions = [{x:1,y:0}, {x:0,y:1}, {x:-1,y:0}, {x:0,y:-1}];
      const validDirections = [];
      
      // Find valid directions
      for (let i = 0; i < 4; i++) {
        const dir = directions[i];
        const newX = ghost.x + dir.x;
        const newY = ghost.y + dir.y;
        
        if (this.isValidMove(newX, newY)) {
          validDirections.push(i);
        }
      }
      
      if (validDirections.length > 0) {
        // Simple AI: move towards Pac-Man occasionally
        if (Math.random() < 0.3) {
          const dx = this.pacman.x - ghost.x;
          const dy = this.pacman.y - ghost.y;
          
          if (Math.abs(dx) > Math.abs(dy)) {
            ghost.direction = dx > 0 ? 0 : 2;
          } else {
            ghost.direction = dy > 0 ? 1 : 3;
          }
        } else {
          ghost.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
        }
        
        const dir = directions[ghost.direction];
        const newX = ghost.x + dir.x;
        const newY = ghost.y + dir.y;
        
        if (this.isValidMove(newX, newY)) {
          ghost.x = newX;
          ghost.y = newY;
        }
      }
      
      this.drawGhosts();
    }
    
    isValidMove(x, y) {
      if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) return false;
      return this.maze[y][x] !== 1;
    }
    
    checkCollisions() {
      this.ghosts.forEach(ghost => {
        if (ghost.x === this.pacman.x && ghost.y === this.pacman.y) {
          this.lives--;
          this.livesText.setText('LIVES: ' + this.lives);
          
          if (this.lives <= 0) {
            this.gameOver();
          } else {
            this.respawnPacMan();
          }
        }
      });
    }
    
    countDots() {
      this.dotsRemaining = 0;
      for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
          if (this.maze[y][x] === 2 || this.maze[y][x] === 3) {
            this.dotsRemaining++;
          }
        }
      }
    }
    
    respawnPacMan() {
      this.pacman.x = Math.floor(MAZE_WIDTH/2);
      this.pacman.y = Math.floor(MAZE_HEIGHT/2);
      this.pacman.direction = 0;
      this.drawPacMan();
    }
    
    levelComplete() {
      this.gameRunning = false;
      
      this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8);
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, 'LEVEL COMPLETE!', {
        fontSize: '32px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, `Score: ${this.score}`, {
        fontSize: '20px',
        fill: '#ffffff',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'Press R for next level', {
        fontSize: '16px',
        fill: '#ffff00',
        fontFamily: 'Courier New, monospace'
      }).setOrigin(0.5);
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
      
      this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, 'Press R to restart', {
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
    backgroundColor: '#000033',
    scene: [PacManScene],
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
    console.log('[Pac-Man] Game initialized successfully');
  } catch (error) {
    console.error('[Pac-Man] Error initializing game:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
