// Parallax Background System
class ParallaxBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.layers = [];
        this.cameraX = 0;
    }

    addLayer(config) {
        this.layers.push({
            speed: config.speed || 0.5,
            y: config.y || 0,
            height: config.height || this.canvas.height,
            color: config.color || '#87CEEB',
            elements: config.elements || []
        });
    }

    update(cameraX) {
        this.cameraX = cameraX;
    }

    draw(ctx) {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#B0E0E6');
        gradient.addColorStop(1, '#98D8C8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw layers from back to front
        this.layers.forEach(layer => {
            const offset = this.cameraX * layer.speed;

            // Draw layer background if specified
            if (layer.color) {
                ctx.fillStyle = layer.color;
                ctx.fillRect(0, layer.y, this.canvas.width, layer.height);
            }

            // Draw layer elements (clouds, mountains, etc.)
            layer.elements.forEach(element => {
                const x = element.x - offset;

                // Wrap around for infinite scrolling
                const wrappedX = ((x % (this.canvas.width + 200)) + this.canvas.width + 200) % (this.canvas.width + 200) - 100;

                if (element.type === 'cloud') {
                    this.drawCloud(ctx, wrappedX, element.y, element.size);
                } else if (element.type === 'mountain') {
                    this.drawMountain(ctx, wrappedX, element.y, element.width, element.height);
                }
            });
        });
    }

    drawCloud(ctx, x, y, size) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.7, y - size * 0.3, size * 0.8, 0, Math.PI * 2);
        ctx.arc(x + size * 1.4, y, size * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawMountain(ctx, x, y, width, height) {
        ctx.save();
        ctx.fillStyle = 'rgba(100, 150, 100, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    static createDefault(canvas) {
        const bg = new ParallaxBackground(canvas);

        // Far layer - slow moving clouds
        bg.addLayer({
            speed: 0.1,
            elements: [
                { type: 'cloud', x: 100, y: 80, size: 30 },
                { type: 'cloud', x: 400, y: 60, size: 25 },
                { type: 'cloud', x: 700, y: 90, size: 35 }
            ]
        });

        // Middle layer - mountains
        bg.addLayer({
            speed: 0.3,
            elements: [
                { type: 'mountain', x: 0, y: 300, width: 200, height: 150 },
                { type: 'mountain', x: 300, y: 320, width: 250, height: 130 },
                { type: 'mountain', x: 600, y: 310, width: 220, height: 140 }
            ]
        });

        // Near layer - fast clouds
        bg.addLayer({
            speed: 0.5,
            elements: [
                { type: 'cloud', x: 200, y: 400, size: 20 },
                { type: 'cloud', x: 500, y: 420, size: 22 },
                { type: 'cloud', x: 800, y: 410, size: 18 }
            ]
        });

        return bg;
    }
}
