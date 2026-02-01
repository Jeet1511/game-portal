// 3D Space Shooter - Ultra Realistic
// Using Three.js for 3D graphics

let scene, camera, renderer;
let player, playerMesh;
let enemies = [];
let bullets = [];
let particles = [];
let stars = [];
let score = 0;
let health = 100;
let wave = 1;
let gameOver = false;
let keys = {};
let mouse = { x: 0, y: 0 };

// Game settings
const GAME_WIDTH = window.innerWidth;
const GAME_HEIGHT = window.innerHeight;
const PLAYER_SPEED = 0.5;
const BULLET_SPEED = 1.5;
const ENEMY_SPEED = 0.3;

// Initialize Three.js
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // Camera
    camera = new THREE.PerspectiveCamera(75, GAME_WIDTH / GAME_HEIGHT, 0.1, 1000);
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(GAME_WIDTH, GAME_HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('gameContainer').appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Point light for dramatic effect
    const pointLight = new THREE.PointLight(0x00ff00, 1, 100);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // Create starfield
    createStarfield();

    // Create player spaceship
    createPlayer();

    // Input handlers
    setupInputHandlers();

    // Start game loop
    animate();

    // Spawn enemies
    setInterval(spawnEnemy, 2000);
}

// Create animated starfield
function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true
    });

    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    stars.push(starField);
}

// Create player spaceship (futuristic design)
function createPlayer() {
    const group = new THREE.Group();

    // Main body (sleek fuselage)
    const bodyGeometry = new THREE.ConeGeometry(0.5, 2, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.3,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI;
    body.castShadow = true;
    group.add(body);

    // Cockpit (glowing)
    const cockpitGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ccff,
        emissive: 0x00ccff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.y = 0.5;
    group.add(cockpit);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(3, 0.1, 1);
    const wingMaterial = new THREE.MeshPhongMaterial({
        color: 0x00aa00,
        emissive: 0x00aa00,
        emissiveIntensity: 0.2
    });
    const wings = new THREE.Mesh(wingGeometry, wingMaterial);
    wings.castShadow = true;
    group.add(wings);

    // Engine glow (particles)
    const engineGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const engineMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.8
    });
    const engineLeft = new THREE.Mesh(engineGeometry, engineMaterial);
    engineLeft.position.set(-1, -0.8, 0);
    group.add(engineLeft);

    const engineRight = new THREE.Mesh(engineGeometry, engineMaterial);
    engineRight.position.set(1, -0.8, 0);
    group.add(engineRight);

    group.position.set(0, 0, 0);
    scene.add(group);
    playerMesh = group;

    player = {
        mesh: group,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0 }
    };
}

// Create enemy ship
function createEnemy() {
    const group = new THREE.Group();

    // Enemy body (menacing red)
    const bodyGeometry = new THREE.OctahedronGeometry(0.6);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.4,
        shininess: 50
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);

    // Spikes
    const spikeGeometry = new THREE.ConeGeometry(0.2, 0.8, 4);
    const spikeMaterial = new THREE.MeshPhongMaterial({
        color: 0xaa0000,
        emissive: 0xaa0000,
        emissiveIntensity: 0.3
    });

    for (let i = 0; i < 4; i++) {
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
        spike.position.x = Math.cos(i * Math.PI / 2) * 0.6;
        spike.position.z = Math.sin(i * Math.PI / 2) * 0.6;
        spike.rotation.z = i * Math.PI / 2;
        group.add(spike);
    }

    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 10;
    group.position.set(x, y, -30);

    scene.add(group);

    return {
        mesh: group,
        position: { x, y, z: -30 },
        health: 100,
        speed: ENEMY_SPEED + Math.random() * 0.2
    };
}

// Spawn enemy
function spawnEnemy() {
    if (!gameOver) {
        const enemy = createEnemy();
        enemies.push(enemy);
        updateEnemyCount();
    }
}

// Create bullet
function fireBullet() {
    const bulletGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1
    });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

    bullet.position.copy(playerMesh.position);
    bullet.position.z -= 1;
    bullet.rotation.x = Math.PI / 2;

    scene.add(bullet);

    bullets.push({
        mesh: bullet,
        velocity: { x: 0, y: 0, z: -BULLET_SPEED }
    });

    // Bullet trail effect
    createBulletTrail(bullet.position);
}

// Create bullet trail particles
function createBulletTrail(position) {
    for (let i = 0; i < 5; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.05, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.8
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);

        scene.add(particle);

        particles.push({
            mesh: particle,
            life: 20,
            velocity: {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1
            }
        });
    }
}

// Create explosion
function createExplosion(position) {
    for (let i = 0; i < 30; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.1, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xff6600 : 0xffaa00,
            transparent: true,
            opacity: 1
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);

        scene.add(particle);

        particles.push({
            mesh: particle,
            life: 30,
            velocity: {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5,
                z: (Math.random() - 0.5) * 0.5
            }
        });
    }
}

// Input handlers
function setupInputHandlers() {
    // Keyboard - use window instead of canvas
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === ' ' && !gameOver) {
            e.preventDefault();
            fireBullet();
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Mouse movement for aiming - use window
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Click to fire
    window.addEventListener('click', (e) => {
        if (!gameOver && e.target.tagName !== 'BUTTON') {
            fireBullet();
        }
    });

    // Window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Update player
function updatePlayer() {
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.position.x -= PLAYER_SPEED;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.position.x += PLAYER_SPEED;
    }
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        player.position.y += PLAYER_SPEED;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        player.position.y -= PLAYER_SPEED;
    }

    // Clamp position
    player.position.x = Math.max(-15, Math.min(15, player.position.x));
    player.position.y = Math.max(-8, Math.min(8, player.position.y));

    // Update mesh position
    playerMesh.position.x = player.position.x;
    playerMesh.position.y = player.position.y;

    // Tilt based on movement
    playerMesh.rotation.z = -player.position.x * 0.05;
    playerMesh.rotation.x = player.position.y * 0.05;
}

// Update bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.mesh.position.z += bullet.velocity.z;

        // Remove if off screen
        if (bullet.mesh.position.z < -50) {
            scene.remove(bullet.mesh);
            bullets.splice(index, 1);
        }
    });
}

// Update enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.mesh.position.z += enemy.speed;
        enemy.mesh.rotation.y += 0.02;

        // Remove if off screen
        if (enemy.mesh.position.z > 15) {
            scene.remove(enemy.mesh);
            enemies.splice(index, 1);
            health -= 10;
            updateHealth();
            updateEnemyCount();
        }

        // Check collision with bullets
        bullets.forEach((bullet, bIndex) => {
            const distance = enemy.mesh.position.distanceTo(bullet.mesh.position);
            if (distance < 1) {
                createExplosion(enemy.mesh.position);
                scene.remove(enemy.mesh);
                scene.remove(bullet.mesh);
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
                score += 100;
                updateScore();
                updateEnemyCount();
            }
        });

        // Check collision with player
        const distanceToPlayer = enemy.mesh.position.distanceTo(playerMesh.position);
        if (distanceToPlayer < 2) {
            createExplosion(enemy.mesh.position);
            scene.remove(enemy.mesh);
            enemies.splice(index, 1);
            health -= 20;
            updateHealth();
            updateEnemyCount();
        }
    });
}

// Update particles
function updateParticles() {
    particles.forEach((particle, index) => {
        particle.mesh.position.x += particle.velocity.x;
        particle.mesh.position.y += particle.velocity.y;
        particle.mesh.position.z += particle.velocity.z;
        particle.life--;

        particle.mesh.material.opacity = particle.life / 30;

        if (particle.life <= 0) {
            scene.remove(particle.mesh);
            particles.splice(index, 1);
        }
    });
}

// Update UI
function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateHealth() {
    document.getElementById('healthFill').style.width = health + '%';
    if (health <= 0) {
        gameOver = true;
        showGameOver();
    }
}

function updateEnemyCount() {
    document.getElementById('enemies').textContent = enemies.length;
}

function showGameOver() {
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

function restartGame() {
    location.reload();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (!gameOver) {
        updatePlayer();
        updateBullets();
        updateEnemies();
        updateParticles();

        // Animate starfield
        stars.forEach(star => {
            star.rotation.y += 0.0002;
        });
    }

    renderer.render(scene, camera);
}

// Start game
init();
