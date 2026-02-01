// Game Configuration
const CONFIG = {
    player: {
        height: 1.8,
        speed: 0.1,
        jumpPower: 0.3,
        gravity: 0.01,
        health: 100,
        maxHealth: 100
    },
    weapon: {
        damage: 25,
        fireRate: 200, // ms
        magazineSize: 30,
        totalAmmo: 90,
        reloadTime: 2000, // ms
        range: 100
    },
    enemy: {
        health: 50,
        speed: 0.05,
        damage: 10,
        attackRange: 5,
        spawnInterval: 3000, // ms
        maxEnemies: 10
    },
    world: {
        size: 100,
        groundColor: 0x2d5016,
        skyColor: 0x87CEEB,
        fogDensity: 0.01
    }
};
