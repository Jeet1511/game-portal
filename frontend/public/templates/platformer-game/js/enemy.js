// Enemy Class
class Enemy {
    constructor(x, y, direction, minX, maxX) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.enemy.width;
        this.height = CONFIG.enemy.height;
        this.speed = CONFIG.enemy.speed;
        this.direction = direction;
        this.minX = minX;
        this.maxX = maxX;
    }

    draw(ctx) {
        // Use pixel art enemy (scale 3 for larger size)
        PixelArt.drawPixelEnemy(ctx, this.x, this.y, 3);
    }

    update() {
        this.x += this.speed * this.direction;

        // Bounce at boundaries
        if (this.x <= this.minX || this.x + this.width >= this.maxX) {
            this.direction *= -1;
        }
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}
