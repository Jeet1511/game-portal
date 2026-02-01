// Platform Class
class Platform {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        // Use pixel art grass platform
        PixelArt.drawGrassPlatform(ctx, this.x, this.y, this.width, this.height);
    }
}
