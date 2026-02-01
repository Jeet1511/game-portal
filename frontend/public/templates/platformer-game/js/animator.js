// Sprite Animation System
class SpriteAnimator {
    constructor(config = {}) {
        this.animations = {};
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.isPlaying = false;
        this.loop = true;
        this.onComplete = null;
    }

    addAnimation(name, frames, frameRate = 10, loop = true) {
        this.animations[name] = {
            frames: frames, // Array of frame indices
            frameRate: frameRate,
            frameDuration: 1000 / frameRate,
            loop: loop
        };
    }

    play(name, restart = false) {
        if (!this.animations[name]) {
            console.warn(`Animation "${name}" not found`);
            return;
        }

        if (this.currentAnimation !== name || restart) {
            this.currentAnimation = name;
            this.currentFrame = 0;
            this.frameTimer = 0;
            this.isPlaying = true;
            this.loop = this.animations[name].loop;
        }
    }

    stop() {
        this.isPlaying = false;
    }

    update(deltaTime) {
        if (!this.isPlaying || !this.currentAnimation) return;

        const anim = this.animations[this.currentAnimation];
        this.frameTimer += deltaTime;

        if (this.frameTimer >= anim.frameDuration) {
            this.frameTimer = 0;
            this.currentFrame++;

            if (this.currentFrame >= anim.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = anim.frames.length - 1;
                    this.isPlaying = false;
                    if (this.onComplete) this.onComplete();
                }
            }
        }
    }

    getCurrentFrame() {
        if (!this.currentAnimation) return 0;
        const anim = this.animations[this.currentAnimation];
        return anim.frames[this.currentFrame];
    }

    draw(ctx, spriteSheet, x, y, frameWidth, frameHeight, scale = 1) {
        if (!this.currentAnimation) return;

        const frameIndex = this.getCurrentFrame();
        const framesPerRow = Math.floor(spriteSheet.width / frameWidth);
        const sx = (frameIndex % framesPerRow) * frameWidth;
        const sy = Math.floor(frameIndex / framesPerRow) * frameHeight;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.drawImage(
            spriteSheet,
            sx, sy, frameWidth, frameHeight,
            -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight
        );
        ctx.restore();
    }
}
