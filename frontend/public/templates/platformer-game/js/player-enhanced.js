// Enhanced Player Class with Animations
class Player {
    constructor(x, y, particleSystem) {
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
        this.particleSystem = particleSystem;

        // Animation state
        this.state = 'idle'; // idle, walk, jump, fall
        this.facingRight = true;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 100; // ms per frame

        // Physics enhancements
        this.acceleration = 0.5;
        this.friction = 0.85;
        this.maxSpeed = CONFIG.player.speed;
        this.coyoteTime = 0;
        this.coyoteTimeMax = 150; // ms
        this.jumpBufferTime = 0;
        this.jumpBufferMax = 100; // ms

        // Visual effects
        this.squashStretch = { x: 1, y: 1 };
        this.rotation = 0;
        this.landingSquash = 0;

        // Trail effect
        this.trailTimer = 0;
    }

    draw(ctx) {
        ctx.save();

        // Apply squash and stretch
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(this.facingRight ? 1 : -1, 1);
        ctx.scale(this.squashStretch.x, this.squashStretch.y);
        ctx.rotate(this.rotation);

        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Body gradient with animation
        const gradient = ctx.createLinearGradient(0, -this.height / 2, 0, this.height / 2);
        const brightness = Math.sin(Date.now() / 500) * 0.1 + 0.9;
        gradient.addColorStop(0, `rgba(255, 142, 142, ${brightness})`);
        gradient.addColorStop(0.5, '#FF6B6B');
        gradient.addColorStop(1, '#EE5A6F');

        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = '#C0392B';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Animated eyes based on state
        const eyeY = this.state === 'jump' ? -6 : -4;
        const eyeSize = this.state === 'fall' ? 6 : 5;

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-6, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.arc(6, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = 'black';
        const pupilOffset = this.velocityX > 0 ? 1 : this.velocityX < 0 ? -1 : 0;
        ctx.beginPath();
        ctx.arc(-6 + pupilOffset, eyeY, 2, 0, Math.PI * 2);
        ctx.arc(6 + pupilOffset, eyeY, 2, 0, Math.PI * 2);
        ctx.fill();

        // Smile - changes with state
        ctx.strokeStyle = '#2C3E50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const smileY = this.state === 'jump' ? 0 : 2;
        const smileSize = this.state === 'jump' ? 10 : 8;
        ctx.arc(0, smileY, smileSize, 0, Math.PI);
        ctx.stroke();

        // Draw legs when walking
        if (this.state === 'walk') {
            const legOffset = Math.sin(Date.now() / 100) * 3;
            ctx.fillStyle = '#C0392B';
            ctx.fillRect(-8, this.height / 2 - 5, 4, 8 + legOffset);
            ctx.fillRect(4, this.height / 2 - 5, 4, 8 - legOffset);
        }

        ctx.restore();
    }

    update(keys, platforms, deltaTime = 16, touchInput = null) {
        // Combine keyboard and touch input
        const input = {
            left: keys['ArrowLeft'] || (touchInput && touchInput.left),
            right: keys['ArrowRight'] || (touchInput && touchInput.right),
            jump: keys['ArrowUp'] || keys[' '] || (touchInput && touchInput.jump)
        };

        // Smooth horizontal movement with acceleration
        if (input.left) {
            this.velocityX -= this.acceleration;
            this.facingRight = false;
        } else if (input.right) {
            this.velocityX += this.acceleration;
            this.facingRight = true;
        } else {
            this.velocityX *= this.friction;
        }

        // Clamp velocity
        this.velocityX = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocityX));

        // Coyote time (grace period for jumping after leaving platform)
        if (!this.isJumping) {
            this.coyoteTime = this.coyoteTimeMax;
        } else if (this.coyoteTime > 0) {
            this.coyoteTime -= deltaTime;
        }

        // Jump buffer (remember jump input briefly)
        if (input.jump) {
            this.jumpBufferTime = this.jumpBufferMax;
        } else if (this.jumpBufferTime > 0) {
            this.jumpBufferTime -= deltaTime;
        }

        // Variable jump height - hold jump for higher jump
        if (this.jumpBufferTime > 0 && this.coyoteTime > 0) {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
            this.jumpBufferTime = 0;
            this.coyoteTime = 0;

            // Jump particles
            if (this.particleSystem) {
                this.particleSystem.dust(this.x + this.width / 2, this.y + this.height);
            }

            // Squash before jump
            this.squashStretch = { x: 1.2, y: 0.8 };
        }

        // Release jump early for variable height
        if (!input.jump && this.velocityY < 0) {
            this.velocityY *= 0.5;
        }

        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        this.x += this.velocityX;

        // Trail effect when moving fast
        if (Math.abs(this.velocityX) > 3) {
            this.trailTimer += deltaTime;
            if (this.trailTimer > 50 && this.particleSystem) {
                this.particleSystem.trail(this.x + this.width / 2, this.y + this.height / 2, 'rgba(255, 107, 107, 0.5)');
                this.trailTimer = 0;
            }
        }

        // Boundary check
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > CONFIG.canvas.width) {
            this.x = CONFIG.canvas.width - this.width;
        }

        // Platform collision
        let wasJumping = this.isJumping;
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

                // Landing effect
                if (wasJumping && this.particleSystem) {
                    this.particleSystem.dust(this.x + this.width / 2, this.y + this.height);
                    this.landingSquash = 0.3;
                }
            }
        });

        // Update animation state
        this.updateAnimationState();

        // Smooth squash/stretch recovery
        this.squashStretch.x += (1 - this.squashStretch.x) * 0.2;
        this.squashStretch.y += (1 - this.squashStretch.y) * 0.2;

        // Landing squash effect
        if (this.landingSquash > 0) {
            this.squashStretch.x = 1 + this.landingSquash;
            this.squashStretch.y = 1 - this.landingSquash;
            this.landingSquash *= 0.8;
        }

        // Fall off screen
        if (this.y > CONFIG.canvas.height) {
            return true; // Player died
        }
        return false;
    }

    updateAnimationState() {
        if (this.isJumping) {
            this.state = this.velocityY < 0 ? 'jump' : 'fall';
        } else if (Math.abs(this.velocityX) > 0.5) {
            this.state = 'walk';
        } else {
            this.state = 'idle';
        }
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isJumping = false;
        this.state = 'idle';
        this.squashStretch = { x: 1, y: 1 };
    }
}
