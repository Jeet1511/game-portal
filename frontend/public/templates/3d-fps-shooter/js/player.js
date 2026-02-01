// Player Controller
class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.health = CONFIG.player.maxHealth;
        this.velocity = new THREE.Vector3();
        this.canJump = true;

        // Position camera
        this.camera.position.set(0, CONFIG.player.height, 0);

        // Movement
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.jump = false;

        // Mouse look
        this.pitch = 0;
        this.yaw = 0;

        this.setupControls();
    }

    setupControls() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': this.moveForward = true; break;
                case 'KeyS': this.moveBackward = true; break;
                case 'KeyA': this.moveLeft = true; break;
                case 'KeyD': this.moveRight = true; break;
                case 'Space': if (this.canJump) this.jump = true; break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.moveForward = false; break;
                case 'KeyS': this.moveBackward = false; break;
                case 'KeyA': this.moveLeft = false; break;
                case 'KeyD': this.moveRight = false; break;
            }
        });

        // Mouse look - only works when pointer is locked
        document.addEventListener('mousemove', (e) => {
            const canvas = document.getElementById('gameCanvas');
            if (document.pointerLockElement === canvas) {
                this.yaw -= e.movementX * 0.002;
                this.pitch -= e.movementY * 0.002;
                this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
            }
        });
    }

    update() {
        // Apply gravity
        this.velocity.y -= CONFIG.player.gravity;

        // Jump
        if (this.jump && this.canJump) {
            this.velocity.y = CONFIG.player.jumpPower;
            this.canJump = false;
            this.jump = false;
        }

        // Movement direction
        const direction = new THREE.Vector3();
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);

        forward.y = 0;
        right.y = 0;
        forward.normalize();
        right.normalize();

        if (this.moveForward) direction.add(forward);
        if (this.moveBackward) direction.sub(forward);
        if (this.moveLeft) direction.sub(right);
        if (this.moveRight) direction.add(right);

        direction.normalize().multiplyScalar(CONFIG.player.speed);

        // Apply movement
        this.camera.position.add(direction);
        this.camera.position.y += this.velocity.y;

        // Ground collision
        if (this.camera.position.y <= CONFIG.player.height) {
            this.camera.position.y = CONFIG.player.height;
            this.velocity.y = 0;
            this.canJump = true;
        }

        // Camera rotation
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;

        // Update HUD
        document.getElementById('healthText').textContent = this.health;
        document.getElementById('healthFill').style.width = (this.health / CONFIG.player.maxHealth * 100) + '%';

        return this.health <= 0;
    }
}
