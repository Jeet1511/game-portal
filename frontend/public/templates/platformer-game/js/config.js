// Game Configuration
const CONFIG = {
    canvas: {
        width: 800,
        height: 600
    },
    player: {
        width: 40,
        height: 40,
        speed: 5,
        jumpPower: 12,
        gravity: 0.5,
        color: '#FF6B6B'
    },
    platform: {
        color: '#4ECDC4',
        borderColor: '#2C3E50'
    },
    coin: {
        size: 15,
        color: '#FFD700',
        value: 10
    },
    enemy: {
        width: 35,
        height: 35,
        speed: 2,
        color: '#E74C3C'
    },
    levels: [
        // Level 1 - Tutorial
        {
            platforms: [
                { x: 0, y: 550, width: 800, height: 50 },
                { x: 200, y: 450, width: 150, height: 20 },
                { x: 450, y: 350, width: 150, height: 20 },
                { x: 100, y: 250, width: 150, height: 20 },
                { x: 550, y: 200, width: 150, height: 20 }
            ],
            coins: [
                { x: 250, y: 400 },
                { x: 500, y: 300 },
                { x: 150, y: 200 },
                { x: 600, y: 150 }
            ],
            enemies: [
                { x: 300, y: 410, direction: 1, minX: 200, maxX: 350 },
                { x: 500, y: 310, direction: 1, minX: 450, maxX: 600 }
            ]
        },
        // Level 2 - Stairway
        {
            platforms: [
                { x: 0, y: 550, width: 800, height: 50 },
                { x: 100, y: 480, width: 120, height: 20 },
                { x: 300, y: 400, width: 120, height: 20 },
                { x: 500, y: 320, width: 120, height: 20 },
                { x: 650, y: 240, width: 120, height: 20 },
                { x: 400, y: 160, width: 150, height: 20 }
            ],
            coins: [
                { x: 150, y: 430 },
                { x: 350, y: 350 },
                { x: 550, y: 270 },
                { x: 700, y: 190 },
                { x: 475, y: 110 }
            ],
            enemies: [
                { x: 150, y: 440, direction: 1, minX: 100, maxX: 220 },
                { x: 350, y: 360, direction: 1, minX: 300, maxX: 420 },
                { x: 550, y: 280, direction: 1, minX: 500, maxX: 620 }
            ]
        },
        // Level 3 - The Gap Challenge
        {
            platforms: [
                { x: 0, y: 550, width: 150, height: 50 },
                { x: 250, y: 480, width: 100, height: 20 },
                { x: 450, y: 420, width: 100, height: 20 },
                { x: 650, y: 360, width: 150, height: 20 },
                { x: 500, y: 280, width: 120, height: 20 },
                { x: 250, y: 200, width: 120, height: 20 },
                { x: 50, y: 120, width: 150, height: 20 }
            ],
            coins: [
                { x: 300, y: 430 },
                { x: 500, y: 370 },
                { x: 700, y: 310 },
                { x: 560, y: 230 },
                { x: 300, y: 150 },
                { x: 125, y: 70 }
            ],
            enemies: [
                { x: 300, y: 440, direction: 1, minX: 250, maxX: 350 },
                { x: 700, y: 320, direction: 1, minX: 650, maxX: 780 },
                { x: 300, y: 160, direction: 1, minX: 250, maxX: 370 }
            ]
        },
        // Level 4 - Tower Climb
        {
            platforms: [
                { x: 0, y: 550, width: 200, height: 50 },
                { x: 600, y: 550, width: 200, height: 50 },
                { x: 350, y: 480, width: 100, height: 20 },
                { x: 150, y: 400, width: 100, height: 20 },
                { x: 550, y: 400, width: 100, height: 20 },
                { x: 350, y: 320, width: 100, height: 20 },
                { x: 150, y: 240, width: 100, height: 20 },
                { x: 550, y: 240, width: 100, height: 20 },
                { x: 350, y: 160, width: 100, height: 20 },
                { x: 300, y: 80, width: 200, height: 20 }
            ],
            coins: [
                { x: 400, y: 430 },
                { x: 200, y: 350 },
                { x: 600, y: 350 },
                { x: 400, y: 270 },
                { x: 200, y: 190 },
                { x: 600, y: 190 },
                { x: 400, y: 110 },
                { x: 400, y: 30 }
            ],
            enemies: [
                { x: 400, y: 440, direction: 1, minX: 350, maxX: 450 },
                { x: 200, y: 360, direction: 1, minX: 150, maxX: 250 },
                { x: 600, y: 360, direction: 1, minX: 550, maxX: 650 },
                { x: 400, y: 280, direction: 1, minX: 350, maxX: 450 }
            ]
        },
        // Level 5 - Final Challenge
        {
            platforms: [
                { x: 0, y: 550, width: 100, height: 50 },
                { x: 150, y: 500, width: 80, height: 15 },
                { x: 280, y: 450, width: 80, height: 15 },
                { x: 410, y: 400, width: 80, height: 15 },
                { x: 540, y: 350, width: 80, height: 15 },
                { x: 670, y: 300, width: 130, height: 15 },
                { x: 540, y: 250, width: 80, height: 15 },
                { x: 410, y: 200, width: 80, height: 15 },
                { x: 280, y: 150, width: 80, height: 15 },
                { x: 150, y: 100, width: 80, height: 15 },
                { x: 350, y: 50, width: 100, height: 20 }
            ],
            coins: [
                { x: 190, y: 450 },
                { x: 320, y: 400 },
                { x: 450, y: 350 },
                { x: 580, y: 300 },
                { x: 735, y: 250 },
                { x: 580, y: 200 },
                { x: 450, y: 150 },
                { x: 320, y: 100 },
                { x: 190, y: 50 },
                { x: 400, y: 0 }
            ],
            enemies: [
                { x: 190, y: 460, direction: 1, minX: 150, maxX: 230 },
                { x: 320, y: 410, direction: 1, minX: 280, maxX: 360 },
                { x: 450, y: 360, direction: 1, minX: 410, maxX: 490 },
                { x: 735, y: 260, direction: 1, minX: 670, maxX: 780 },
                { x: 450, y: 160, direction: 1, minX: 410, maxX: 490 },
                { x: 190, y: 60, direction: 1, minX: 150, maxX: 230 }
            ]
        }
    ]
};
