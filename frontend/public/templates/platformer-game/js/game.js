// Main Game Logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = CONFIG.canvas.width;
canvas.height = CONFIG.canvas.height;

// Auto-focus canvas
canvas.focus();
canvas.addEventListener('click', () => canvas.focus());

// Game state
let score = 0;
let lives = 3;
let currentLevel = 0;
let gameRunning = true;

// Game objects
let player;
let platforms = [];
let coins = [];
let enemies = [];
let particleSystem;
let touchControls;
let parallaxBg;
let lastFrameTime = Date.now();

// Keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'r' || e.key === 'R') {
        restartGame();
    }
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Initialize level
function loadLevel(levelIndex) {
    const levelData = CONFIG.levels[levelIndex];

    // Create platforms
    platforms = levelData.platforms.map(p =>
        new Platform(p.x, p.y, p.width, p.height)
    );

    // Create coins
    coins = levelData.coins.map(c =>
        new Coin(c.x, c.y)
    );

    // Create enemies
    enemies = levelData.enemies.map(e =>
        new Enemy(e.x, e.y, e.direction, e.minX, e.maxX)
    );

    // Reset player
    player = new Player(50, 450, particleSystem);
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('level').textContent = currentLevel + 1;
}

// Draw background
function drawBackground() {
    // Use parallax background if available
    if (parallaxBg) {
        parallaxBg.update(player ? player.x : 0);
        parallaxBg.draw(ctx);
    } else {
        // Fallback: Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#B0E0E6');
        gradient.addColorStop(1, '#98D8C8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Mountains
        PixelArt.drawMountain(ctx, 50, 350, 200, 150, 'rgba(100, 120, 140, 0.5)');
        PixelArt.drawMountain(ctx, 300, 370, 250, 130, 'rgba(80, 100, 120, 0.4)');
        PixelArt.drawMountain(ctx, 550, 360, 220, 140, 'rgba(90, 110, 130, 0.45)');

        // Clouds
        PixelArt.drawCloud(ctx, 150, 80, 25);
        PixelArt.drawCloud(ctx, 550, 120, 30);
        PixelArt.drawCloud(ctx, 400, 100, 20);
    }
}

// Check level completion
function checkLevelComplete() {
    const allCoinsCollected = coins.every(coin => coin.collected);
    if (allCoinsCollected) {
        gameRunning = false;
        document.getElementById('levelScore').textContent = score;
        document.getElementById('levelComplete').classList.remove('hidden');
    }
}

// Next level
function nextLevel() {
    document.getElementById('levelComplete').classList.add('hidden');
    currentLevel++;

    if (currentLevel >= CONFIG.levels.length) {
        // Game won!
        alert(`Congratulations! You completed all levels!\nFinal Score: ${score}`);
        currentLevel = 0;
        score = 0;
        lives = 3;
    }

    loadLevel(currentLevel);
    updateUI();
    gameRunning = true;
    gameLoop();
}

// Player death
function playerDied() {
    lives--;
    updateUI();

    if (lives <= 0) {
        gameRunning = false;
        document.getElementById('finalScore').textContent = score;
        document.getElementById('gameOver').classList.remove('hidden');
    } else {
        player.reset(50, 450);
    }
}

// Restart game
function restartGame() {
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('levelComplete').classList.add('hidden');
    score = 0;
    lives = 3;
    currentLevel = 0;
    loadLevel(currentLevel);
    updateUI();
    gameRunning = true;
    gameLoop();
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    // Calculate delta time
    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    // Clear and draw background
    drawBackground();

    // Update and draw particles
    if (particleSystem) {
        particleSystem.update(deltaTime);
        particleSystem.draw(ctx);
    }

    // Draw platforms
    platforms.forEach(platform => platform.draw(ctx));

    // Draw and update coins
    coins.forEach(coin => {
        coin.draw(ctx);
        const points = coin.checkCollision(player);
        if (points > 0) {
            score += points;
            // Coin collection particle effect
            if (particleSystem) {
                particleSystem.sparkle(coin.x, coin.y);
            }
        }
    });

    // Draw and update enemies
    enemies.forEach(enemy => {
        enemy.draw(ctx);
        enemy.update();
        if (enemy.checkCollision(player)) {
            playerDied();
        }
    });

    // Get touch input if available
    const touchInput = touchControls ? touchControls.getInput() : null;

    // Update and draw player
    const playerDead = player.update(keys, platforms, deltaTime, touchInput);
    if (playerDead) {
        playerDied();
    }
    player.draw(ctx);

    // Draw touch controls on top
    if (touchControls) {
        touchControls.draw(ctx);
    }

    // Update UI
    updateUI();

    // Check level completion
    checkLevelComplete();

    requestAnimationFrame(gameLoop);
}

// Initialize systems
particleSystem = new ParticleSystem();
touchControls = new TouchControls(canvas);
parallaxBg = ParallaxBackground.createDefault(canvas);

// Start game
loadLevel(currentLevel);
updateUI();
gameLoop();
