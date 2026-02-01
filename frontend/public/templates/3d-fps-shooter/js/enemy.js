// Enemy AI
class Enemy {
    constructor(scene, position) {
        this.scene = scene;
        this.health = CONFIG.enemy.health;
        this.isDead = false;

        // Create enemy mesh
        const geometry = new THREE.BoxGeometry(0.8, 1.8, 0.8);
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(position);
        this.mesh.position.y = 0.9;
        this.scene.add(this.mesh);

        // Add eyes
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });

        this.leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.leftEye.position.set(-0.2, 0.5, 0.4);
        this.mesh.add(this.leftEye);

        this.rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        this.rightEye.position.set(0.2, 0.5, 0.4);
        this.mesh.add(this.rightEye);

        this.attackCooldown = 0;
    }

    update(playerPosition) {
        if (this.isDead) return;

        // Move towards player
        const direction = new THREE.Vector3()
            .subVectors(playerPosition, this.mesh.position)
            .normalize();
        direction.y = 0;

        this.mesh.position.add(direction.multiplyScalar(CONFIG.enemy.speed));

        // Look at player
        this.mesh.lookAt(playerPosition);

        // Attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }

    canAttack(playerPosition) {
        const distance = this.mesh.position.distanceTo(playerPosition);
        return distance < CONFIG.enemy.attackRange && this.attackCooldown === 0;
    }

    attack() {
        this.attackCooldown = 60; // 1 second at 60fps
        return CONFIG.enemy.damage;
    }

    takeDamage(amount) {
        this.health -= amount;

        // Flash red when hit
        this.mesh.material.color.setHex(0xff6666);
        setTimeout(() => {
            if (!this.isDead) {
                this.mesh.material.color.setHex(0xff0000);
            }
        }, 100);

        if (this.health <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    die() {
        this.isDead = true;
        this.scene.remove(this.mesh);
    }
}
