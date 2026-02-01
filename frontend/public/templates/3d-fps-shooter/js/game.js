// Main Game Logic
let scene, camera, renderer;
let player, weapon;
let enemies = [];
let score = 0;
let isPaused = false;
let gameOver = false;

// Initialize Three.js
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.world.skyColor);
    scene.fog = new THREE.Fog(CONFIG.world.skyColor, 1, 100);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Renderer
    const canvas = document.getElementById('gameCanvas');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(CONFIG.world.size, CONFIG.world.size);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: CONFIG.world.groundColor });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add some obstacles
    createObstacles();

    // Player
    player = new Player(scene, camera);

    // Weapon
    weapon = new Weapon();

    // Controls
    setupGameControls();

    // Start enemy spawning
    setInterval(spawnEnemy, CONFIG.enemy.spawnInterval);

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Start game loop
    animate();
}

function createObstacles() {
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });

    for (let i = 0; i < 20; i++) {
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(
            Math.random() * 80 - 40,
            1,
            Math.random() * 80 - 40
        );
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
    }
}

let waveNumber = 1;
let enemiesKilled = 0;
let spawnRate = CONFIG.enemy.spawnInterval;

function spawnEnemy() {
    if (gameOver || isPaused) return;

    // Limit enemies based on wave
    const maxEnemiesForWave = Math.min(CONFIG.enemy.maxEnemies + Math.floor(waveNumber / 2), 20);
    if (enemies.length >= maxEnemiesForWave) return;

    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    const position = new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
    );

    const enemy = new Enemy(scene, position);

    // Increase enemy health based on wave
    enemy.health += (waveNumber - 1) * 10;

    enemies.push(enemy);
    updateEnemyCount();
}

function checkWaveProgression() {
    // Every 5 kills, increase wave and difficulty
    if (enemiesKilled > 0 && enemiesKilled % 5 === 0) {
        waveNumber++;
        spawnRate = Math.max(1000, CONFIG.enemy.spawnInterval - (waveNumber * 200));

        // Show wave notification
        showWaveNotification();
    }
}

function showWaveNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 255, 0, 0.2);
        border: 3px solid #0f0;
        padding: 20px 40px;
        font-size: 32px;
        color: #0f0;
        font-family: 'Courier New', monospace;
        z-index: 200;
        text-shadow: 0 0 10px #0f0;
    `;
    notification.textContent = `WAVE ${waveNumber}`;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
}


function setupGameControls() {
    // Pointer lock for mouse control
    const canvas = document.getElementById('gameCanvas');
    let pointerLocked = false;

    // Request pointer lock on canvas click
    canvas.addEventListener('click', () => {
        if (!isPaused && !gameOver) {
            canvas.requestPointerLock();
        }
    });

    // Track pointer lock state
    document.addEventListener('pointerlockchange', () => {
        pointerLocked = document.pointerLockElement === canvas;

        // Update mouse status indicator
        const mouseStatusText = document.getElementById('mouseStatusText');
        const mouseStatus = document.getElementById('mouseStatus');

        if (pointerLocked) {
            mouseStatusText.textContent = 'Locked ✓';
            mouseStatus.style.color = '#0f0';
        } else {
            mouseStatusText.textContent = 'Unlocked (ESC)';
            mouseStatus.style.color = '#ff0';
        }

        if (!pointerLocked && !isPaused && !gameOver) {
            // Pointer lock lost, pause game
            togglePause();
        }
    });

    // ESC key handling - Always unlock mouse and pause
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            e.preventDefault();

            // Always exit pointer lock first (frees the mouse)
            if (document.pointerLockElement) {
                document.exitPointerLock();
            }

            // Pause the game if not already paused
            if (!isPaused && !gameOver) {
                togglePause();
            }
        }
    });

    // Shooting - only when pointer is locked
    document.addEventListener('click', () => {
        if (gameOver || isPaused || !pointerLocked) return;

        const shot = weapon.fire();
        if (shot) {
            checkHit();
        }
    });

    // Show instructions on start
    showInstructions();
}

function showInstructions() {
    const instructionsDiv = document.createElement('div');
    instructionsDiv.id = 'startInstructions';
    instructionsDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        border: 3px solid #0f0;
        border-radius: 10px;
        padding: 30px;
        text-align: center;
        z-index: 300;
        color: #0f0;
        font-family: 'Courier New', monospace;
    `;
    instructionsDiv.innerHTML = `
        <h2 style="font-size: 32px; margin-bottom: 20px;">3D FPS SHOOTER</h2>
        <p style="font-size: 18px; margin-bottom: 15px;">Click anywhere to start!</p>
        <div style="text-align: left; margin: 20px auto; max-width: 300px;">
            <p><strong>Controls:</strong></p>
            <p>🎮 WASD - Move</p>
            <p>🖱️ Mouse - Look around</p>
            <p>🔫 Click - Shoot</p>
            <p>🔄 R - Reload</p>
            <p>⏸️ ESC - Pause/Resume</p>
        </div>
        <p style="font-size: 14px; color: #0a0;">Click to lock mouse and start playing!</p>
    `;
    document.body.appendChild(instructionsDiv);

    // Remove instructions on first click
    const removeInstructions = () => {
        instructionsDiv.remove();
        document.removeEventListener('click', removeInstructions);
    };
    document.addEventListener('click', removeInstructions, { once: true });
}


function checkHit() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    enemies.forEach((enemy, index) => {
        if (enemy.isDead) return;

        const intersects = raycaster.intersectObject(enemy.mesh);
        if (intersects.length > 0 && intersects[0].distance < CONFIG.weapon.range) {
            const killed = enemy.takeDamage(CONFIG.weapon.damage);
            if (killed) {
                enemiesKilled++;
                score += 100 * waveNumber; // More points for higher waves
                document.getElementById('score').textContent = score;
                enemies.splice(index, 1);
                updateEnemyCount();
                checkWaveProgression();
            }
        }
    });
}

function updateEnemyCount() {
    document.getElementById('enemies').textContent = enemies.length;
}

function togglePause() {
    isPaused = !isPaused;
    const pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.classList.toggle('hidden', !isPaused);

    if (isPaused) {
        // Exit pointer lock when pausing
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }
}

function resumeGame() {
    isPaused = false;
    document.getElementById('pauseMenu').classList.add('hidden');
    // Pointer lock will be requested on next canvas click
}


function restartGame() {
    location.reload();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (gameOver || isPaused) return;

    // Update player
    player.update();

    // Update enemies
    enemies.forEach(enemy => {
        enemy.update(camera.position);

        if (enemy.canAttack(camera.position)) {
            const damage = enemy.attack();
            const dead = player.takeDamage(damage);
            if (dead) {
                endGame();
            }
        }
    });

    // Render
    renderer.render(scene, camera);
}

function endGame() {
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverMenu').classList.remove('hidden');
}

// Start game
init();
