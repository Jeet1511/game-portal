// Weapon System
class Weapon {
    constructor() {
        this.magazineAmmo = CONFIG.weapon.magazineSize;
        this.totalAmmo = CONFIG.weapon.totalAmmo;
        this.isReloading = false;
        this.canFire = true;
        this.lastFireTime = 0;

        this.updateAmmoDisplay();

        // Setup controls
        document.addEventListener('click', () => this.fire());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR') this.reload();
        });
    }

    fire() {
        if (!this.canFire || this.isReloading || this.magazineAmmo <= 0) {
            return null;
        }

        const now = Date.now();
        if (now - this.lastFireTime < CONFIG.weapon.fireRate) {
            return null;
        }

        this.magazineAmmo--;
        this.lastFireTime = now;
        this.updateAmmoDisplay();

        // Muzzle flash effect
        this.muzzleFlash();

        return {
            damage: CONFIG.weapon.damage,
            range: CONFIG.weapon.range
        };
    }

    reload() {
        if (this.isReloading || this.magazineAmmo === CONFIG.weapon.magazineSize || this.totalAmmo === 0) {
            return;
        }

        this.isReloading = true;

        setTimeout(() => {
            const ammoNeeded = CONFIG.weapon.magazineSize - this.magazineAmmo;
            const ammoToReload = Math.min(ammoNeeded, this.totalAmmo);

            this.magazineAmmo += ammoToReload;
            this.totalAmmo -= ammoToReload;
            this.isReloading = false;

            this.updateAmmoDisplay();
        }, CONFIG.weapon.reloadTime);
    }

    updateAmmoDisplay() {
        document.getElementById('ammo').textContent =
            `${this.magazineAmmo}/${this.totalAmmo}`;
    }

    muzzleFlash() {
        // Visual feedback for shooting
        const crosshair = document.getElementById('crosshair');
        crosshair.style.transform = 'translate(-50%, -50%) scale(1.5)';
        setTimeout(() => {
            crosshair.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 50);
    }
}
