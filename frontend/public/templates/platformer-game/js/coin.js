// Coin Class
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.coin.size;
        this.color = CONFIG.coin.color;
        this.collected = false;
        this.value = CONFIG.coin.value;
        this.rotation = 0;
    }

    draw(ctx) {
        if (!this.collected) {
            this.rotation += 0.1;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            // Glow effect
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;

            // Outer glow
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size + 5);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.7, '#FFA500');
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, this.size + 5, 0, Math.PI * 2);
            ctx.fill();

            // Reset shadow
            ctx.shadowBlur = 0;

            // Coin body
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Border
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Dollar sign
            ctx.fillStyle = '#FFA500';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);

            ctx.restore();
        }
    }

    checkCollision(player) {
        if (!this.collected) {
            const dx = (player.x + player.width / 2) - this.x;
            const dy = (player.y + player.height / 2) - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < player.width / 2 + this.size) {
                this.collected = true;
                return this.value;
            }
        }
        return 0;
    }
}
