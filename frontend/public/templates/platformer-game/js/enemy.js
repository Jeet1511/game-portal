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
        this.color = CONFIG.enemy.color;
    }

    draw(ctx) {
        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Eyes (angry)
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 8, this.y + 10, 8, 8);
        ctx.fillRect(this.x + 19, this.y + 10, 8, 8);

        // Pupils
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x + 11, this.y + 13, 3, 3);
        ctx.fillRect(this.x + 22, this.y + 13, 3, 3);

        // Angry mouth
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 28, 8, Math.PI, 0);
        ctx.stroke();
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
