// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.player.width;
        this.height = CONFIG.player.height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = CONFIG.player.speed;
        this.jumpPower = CONFIG.player.jumpPower;
        this.gravity = CONFIG.player.gravity;
        this.isJumping = false;
        this.color = CONFIG.player.color;
    }

    draw(ctx) {
        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Body gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#FF8E8E');
        gradient.addColorStop(0.5, '#FF6B6B');
        gradient.addColorStop(1, '#EE5A6F');

        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = '#C0392B';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Eyes with glow
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 14, this.y + 14, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 26, this.y + 14, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 14, this.y + 14, 2, 0, Math.PI * 2);
        ctx.arc(this.x + 26, this.y + 14, 2, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 22, 8, 0, Math.PI);
        ctx.stroke();
    }

    update(keys, platforms) {
        // Horizontal movement
        if (keys['ArrowLeft']) this.velocityX = -this.speed;
        else if (keys['ArrowRight']) this.velocityX = this.speed;
        else this.velocityX = 0;

        // Jump
        if (keys['ArrowUp'] && !this.isJumping) {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
        }

        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        this.x += this.velocityX;

        // Boundary check
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CONFIG.canvas.width) {
            this.x = CONFIG.canvas.width - this.width;
        }

        // Platform collision
        this.isJumping = true;
        platforms.forEach(platform => {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + platform.height &&
                this.velocityY > 0) {
                this.y = platform.y - this.height;
                this.velocityY = 0;
                this.isJumping = false;
            }
        });

        // Fall off screen
        if (this.y > CONFIG.canvas.height) {
            return true; // Player died
        }
        return false;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
    }
}
