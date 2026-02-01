// Mobile Touch Controls
class TouchControls {
    constructor(canvas) {
        this.canvas = canvas;
        this.enabled = this.isMobile();
        this.touches = {};

        // Virtual joystick
        this.joystick = {
            active: false,
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            radius: 50,
            deadzone: 10
        };

        // Buttons
        this.buttons = {
            jump: {
                x: 0,
                y: 0,
                radius: 40,
                pressed: false,
                label: '↑'
            }
        };

        if (this.enabled) {
            this.setupTouchHandlers();
            this.positionControls();
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            ('ontouchstart' in window);
    }

    positionControls() {
        const rect = this.canvas.getBoundingClientRect();

        // Joystick on left side
        this.joystick.startX = 80;
        this.joystick.startY = rect.height - 80;

        // Jump button on right side
        this.buttons.jump.x = rect.width - 80;
        this.buttons.jump.y = rect.height - 80;
    }

    setupTouchHandlers() {
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

        // Prevent default touch behaviors
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
    }

    handleTouchStart(e) {
        const rect = this.canvas.getBoundingClientRect();

        for (let touch of e.changedTouches) {
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // Check joystick area (left half)
            if (x < rect.width / 2) {
                this.joystick.active = true;
                this.joystick.startX = x;
                this.joystick.startY = y;
                this.joystick.currentX = x;
                this.joystick.currentY = y;
            }

            // Check jump button
            const dx = x - this.buttons.jump.x;
            const dy = y - this.buttons.jump.y;
            if (Math.sqrt(dx * dx + dy * dy) < this.buttons.jump.radius) {
                this.buttons.jump.pressed = true;
            }
        }
    }

    handleTouchMove(e) {
        const rect = this.canvas.getBoundingClientRect();

        for (let touch of e.changedTouches) {
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            if (this.joystick.active && x < rect.width / 2) {
                this.joystick.currentX = x;
                this.joystick.currentY = y;
            }
        }
    }

    handleTouchEnd(e) {
        this.joystick.active = false;
        this.buttons.jump.pressed = false;
    }

    getInput() {
        const input = {
            left: false,
            right: false,
            jump: false
        };

        if (this.joystick.active) {
            const dx = this.joystick.currentX - this.joystick.startX;
            const dy = this.joystick.currentY - this.joystick.startY;

            if (Math.abs(dx) > this.joystick.deadzone) {
                input.left = dx < 0;
                input.right = dx > 0;
            }
        }

        input.jump = this.buttons.jump.pressed;

        return input;
    }

    draw(ctx) {
        if (!this.enabled) return;

        ctx.save();
        ctx.globalAlpha = 0.5;

        // Draw joystick
        if (this.joystick.active) {
            // Base
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.joystick.startX, this.joystick.startY, this.joystick.radius, 0, Math.PI * 2);
            ctx.fill();

            // Stick
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(this.joystick.currentX, this.joystick.currentY, this.joystick.radius / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Show hint
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(this.joystick.startX, this.joystick.startY, this.joystick.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw jump button
        ctx.fillStyle = this.buttons.jump.pressed ? 'rgba(102, 126, 234, 0.7)' : 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.buttons.jump.x, this.buttons.jump.y, this.buttons.jump.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.buttons.jump.label, this.buttons.jump.x, this.buttons.jump.y);

        ctx.restore();
    }
}
