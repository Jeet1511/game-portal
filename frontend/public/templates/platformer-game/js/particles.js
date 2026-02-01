// Particle System
class Particle {
    constructor(x, y, config = {}) {
        this.x = x;
        this.y = y;
        this.vx = config.vx || (Math.random() - 0.5) * 4;
        this.vy = config.vy || (Math.random() - 0.5) * 4;
        this.life = config.life || 1.0;
        this.maxLife = this.life;
        this.size = config.size || 5;
        this.color = config.color || '#FFD700';
        this.gravity = config.gravity || 0.1;
        this.friction = config.friction || 0.98;
        this.shrink = config.shrink !== undefined ? config.shrink : true;
        this.fade = config.fade !== undefined ? config.fade : true;
    }

    update(deltaTime) {
        const dt = deltaTime / 16.67; // Normalize to 60fps

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity * dt;

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        this.life -= 0.02 * dt;
        return this.life > 0;
    }

    draw(ctx) {
        const alpha = this.fade ? this.life / this.maxLife : 1;
        const size = this.shrink ? this.size * (this.life / this.maxLife) : this.size;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count, config = {}) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, config));
        }
    }

    // Preset effects
    explosion(x, y, color = '#FF6B6B') {
        this.emit(x, y, 20, {
            vx: () => (Math.random() - 0.5) * 8,
            vy: () => (Math.random() - 0.5) * 8,
            color: color,
            size: 4,
            life: 1.5,
            gravity: 0.2
        });
    }

    sparkle(x, y) {
        this.emit(x, y, 10, {
            vx: () => (Math.random() - 0.5) * 3,
            vy: () => (Math.random() - 0.5) * 3,
            color: '#FFD700',
            size: 3,
            life: 1.0,
            gravity: -0.1
        });
    }

    trail(x, y, color = '#FFFFFF') {
        this.emit(x, y, 3, {
            vx: () => (Math.random() - 0.5) * 0.5,
            vy: () => (Math.random() - 0.5) * 0.5,
            color: color,
            size: 2,
            life: 0.5,
            gravity: 0
        });
    }

    dust(x, y) {
        this.emit(x, y, 5, {
            vx: () => (Math.random() - 0.5) * 2,
            vy: () => -Math.random() * 2,
            color: '#D3D3D3',
            size: 3,
            life: 0.8,
            gravity: 0.05
        });
    }

    update(deltaTime) {
        this.particles = this.particles.filter(particle => particle.update(deltaTime));
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}
