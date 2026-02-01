// Coin Class
class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.coin.size;
        this.collected = false;
        this.value = CONFIG.coin.value;
    }

    draw(ctx) {
        if (this.collected) return;

        // Animated rotation
        const rotation = (Date.now() / 500) % (Math.PI * 2);

        // Use pixel art coin
        PixelArt.drawCoin(ctx, this.x, this.y, this.radius, rotation);
    }

    checkCollision(player) {
        if (this.collected) return 0;

        const dx = (player.x + player.width / 2) - this.x;
        const dy = (player.y + player.height / 2) - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + player.width / 2) {
            this.collected = true;
            return this.value;
        }
        return 0;
    }
}
