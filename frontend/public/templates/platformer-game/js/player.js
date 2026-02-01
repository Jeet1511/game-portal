// Enhanced Player Class with Pixel Art
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
        this.particleSystem = particleSystem;

        // Animation state
        this.facingRight = true;
        this.state = 'idle';
    }

    draw(ctx) {
        // Use pixel art character
        PixelArt.drawPixelCharacter(ctx, this.x, this.y, 2, this.facingRight, this.state);
    }

    update(keys, platforms, deltaTime = 16, touchInput = null) {
        // Combine keyboard and touch input
        const input = {
            left: keys['ArrowLeft'] || (touchInput && touchInput.left),
            right: keys['ArrowRight'] || (touchInput && touchInput.right),
            jump: keys['ArrowUp'] || keys[' '] || (touchInput && touchInput.jump)
        };

        // Horizontal movement
        if (input.left) {
            this.velocityX = -this.speed;
            this.facingRight = false;
            this.state = 'walk';
        } else if (input.right) {
            this.velocityX = this.speed;
            this.facingRight = true;
            this.state = 'walk';
        } else {
            this.velocityX = 0;
            if (!this.isJumping) this.state = 'idle';
        }

        // Jump
        if (input.jump && !this.isJumping) {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
            this.state = 'jump';

            // Jump particles
            if (this.particleSystem) {
                this.particleSystem.dust(this.x + this.width / 2, this.y + this.height);
            }
        }

        // Apply gravity
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        this.x += this.velocityX;

        // Update state based on velocity
        if (this.isJumping) {
            this.state = this.velocityY < 0 ? 'jump' : 'fall';
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

                // Landing particles
                if (wasJumping && this.particleSystem) {
                    this.particleSystem.dust(this.x + this.width / 2, this.y + this.height);
                }
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
        this.state = 'idle';
    }
}
