// Pixel Art Drawing Utilities
class PixelArt {
    static drawPixelCharacter(ctx, x, y, scale = 2, facingRight = true, state = 'idle') {
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        // Flip if facing left
        if (!facingRight) {
            ctx.translate(x + 10 * scale, y);
            ctx.scale(-1, 1);
            ctx.translate(-x, -y);
        }

        // Character pixel map (Mario-style)
        // 0=transparent, 1=red(hat), 2=skin, 3=blue(overalls), 4=brown(shoes), 5=white, 6=black
        const idlePixels = [
            [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 2, 2, 2, 2, 2, 0, 0, 0],
            [0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
            [0, 2, 6, 2, 2, 2, 6, 2, 2, 0],
            [0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
            [0, 0, 2, 2, 6, 6, 2, 2, 0, 0],
            [0, 0, 3, 3, 3, 3, 3, 3, 0, 0],
            [0, 3, 3, 3, 3, 3, 3, 3, 3, 0],
            [2, 2, 3, 3, 3, 3, 3, 3, 2, 2],
            [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
            [2, 2, 3, 3, 3, 3, 3, 3, 2, 2],
            [0, 0, 3, 3, 0, 0, 3, 3, 0, 0],
            [0, 4, 4, 4, 0, 0, 4, 4, 4, 0],
            [4, 4, 4, 4, 0, 0, 4, 4, 4, 4]
        ];

        const colors = {
            0: 'transparent',
            1: '#C84C0C', // Red hat
            2: '#FFD7A5', // Skin
            3: '#0066CC', // Blue overalls
            4: '#8B4513', // Brown shoes
            5: '#FFFFFF', // White
            6: '#000000'  // Black
        };

        idlePixels.forEach((row, py) => {
            row.forEach((colorKey, px) => {
                if (colorKey > 0) {
                    ctx.fillStyle = colors[colorKey];
                    ctx.fillRect(x + px * scale, y + py * scale, scale, scale);
                }
            });
        });

        ctx.restore();
    }

    static drawGrassPlatform(ctx, x, y, width, height) {
        // Brown base with texture
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, '#8B6F47');
        gradient.addColorStop(0.5, '#6B4423');
        gradient.addColorStop(1, '#4A2511');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);

        // Add dirt texture (small dots)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let i = 0; i < width / 8; i++) {
            for (let j = 0; j < height / 8; j++) {
                if (Math.random() > 0.7) {
                    ctx.fillRect(
                        x + i * 8 + Math.random() * 4,
                        y + j * 8 + Math.random() * 4,
                        2, 2
                    );
                }
            }
        }

        // Green grass top (wavy pattern)
        ctx.fillStyle = '#2ECC40';
        const grassHeight = 6;

        // Draw grass blades
        for (let gx = 0; gx < width; gx += 4) {
            const waveHeight = Math.sin(gx / 10) * 2;
            ctx.fillRect(x + gx, y - grassHeight + waveHeight, 4, grassHeight + 2);
        }

        // Darker grass outline
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let gx = 0; gx <= width; gx += 4) {
            const waveHeight = Math.sin(gx / 10) * 2;
            if (gx === 0) {
                ctx.moveTo(x + gx, y - grassHeight + waveHeight);
            } else {
                ctx.lineTo(x + gx, y - grassHeight + waveHeight);
            }
        }
        ctx.stroke();
    }

    static drawCoin(ctx, x, y, size, rotation = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        // Outer glow
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;

        // Gold gradient
        const gradient = ctx.createRadialGradient(-size / 4, -size / 4, 0, 0, 0, size);
        gradient.addColorStop(0, '#FFF4A3');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(0.7, '#FFA500');
        gradient.addColorStop(1, '#CC8400');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Inner circle
        ctx.strokeStyle = '#CC8400';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-size / 3, -size / 3, size / 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    static drawPixelEnemy(ctx, x, y, scale = 2) {
        // Red enemy (Goomba-style)
        const enemyPixels = [
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 2, 1, 1, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 3, 3, 3, 3, 1, 1],
            [1, 1, 3, 3, 3, 3, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 4, 0, 0, 4, 0, 0]
        ];

        const colors = {
            0: 'transparent',
            1: '#E74C3C', // Red body
            2: '#FFFFFF', // White eyes
            3: '#000000', // Black mouth
            4: '#8B4513'  // Brown feet
        };

        ctx.imageSmoothingEnabled = false;
        enemyPixels.forEach((row, py) => {
            row.forEach((colorKey, px) => {
                if (colorKey > 0) {
                    ctx.fillStyle = colors[colorKey];
                    ctx.fillRect(x + px * scale, y + py * scale, scale, scale);
                }
            });
        });
    }

    static drawMountain(ctx, x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.fill();

        // Snow cap
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width / 2 - width / 6, y + height / 4);
        ctx.lineTo(x + width / 2 + width / 6, y + height / 4);
        ctx.closePath();
        ctx.fill();
    }

    static drawCloud(ctx, x, y, size) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y - size * 0.3, size * 0.9, 0, Math.PI * 2);
        ctx.arc(x + size * 1.6, y, size, 0, Math.PI * 2);
        ctx.arc(x + size * 0.8, y + size * 0.3, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
    }

    static drawHeart(ctx, x, y, size, filled = true) {
        ctx.save();
        ctx.translate(x, y);

        ctx.fillStyle = filled ? '#E74C3C' : '#555';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, size / 4);
        ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
        ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, size / 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
