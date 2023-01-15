var Foreground = { //stripped down Sprite object to represent the foreground
    canvas: 0,
    ctx: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    image: 0,
    is_ready: 0,
    init: function (x, y, width, height, img_file) {
        Foreground.is_ready = false;
        Foreground.x = x;
        Foreground.y = y;
        Foreground.width = width;
        Foreground.height = height;
        Foreground.canvas = document.createElement('canvas');
        Foreground.canvas.setAttribute('width', width);
        Foreground.canvas.setAttribute('height', height);
        Foreground.canvas.className = 'Foreground';
        Foreground.ctx = Foreground.canvas.getContext('2d');
        Foreground.loadImage(img_file);
    },
    loadImage: function (img_file) {
        Foreground.image = new Image();
        Foreground.loading = true;
        Foreground.image.onload = function () {
            Foreground.is_ready = true;
        }
        Foreground.image.src = img_file;
    },
    drawImage: function () {
        Foreground.ctx.clearRect(0, 0, Foreground.width, Foreground.height);
        if (Foreground.is_ready) {
            Foreground.ctx.drawImage(Foreground.image, 0, 0);
        }
    }
}

var Lighting = { // Real-time lighting overlay
    canvas: 0,
    ctx: 0,
    width: 0,
    height: 0,
    global_alpha: 0.7,

    // Settings
    projectiles_enabled: true,
    particles_enabled: true,

    init: function () {
        this.width = Engine.width;
        this.height = Engine.height;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
        this.canvas.className = 'Foreground';
        this.ctx = this.canvas.getContext('2d');
    },
    drawImage: function () {

        // Only clear if lighting has changed
        this.ctx.clearRect(0, 0, this.width, this.height);

        // By default, make whole arena dark
        this.ctx.fillStyle = 'rgba(0,0,0,' + this.global_alpha + ')';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Projectile lighting
        if (this.projectiles_enabled) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.1)';

            for (var i = 0; i < Engine.projectiles.length; i++) {
                var projectile = Engine.projectiles[i];
                var radius = 50;

                // Clear area
                // this.ctx.clearRect(projectile.x - 50, projectile.y - 50, 100, 100);

                // Draw container
                // Circle
                this.ctx.moveTo(projectile.x + (radius / 2), projectile.y + (radius / 2));
                this.ctx.beginPath();
                this.ctx.arc(projectile.x, projectile.y, radius, 0, Math.PI * 2, false);

                // Square
                /*
                this.ctx.moveTo(projectile.x - 50, projectile.y - 50); // TL
                this.ctx.lineTo(projectile.x - 50, projectile.y + radius); // BL
                this.ctx.lineTo(projectile.x + radius, projectile.y + radius); // BR
                this.ctx.lineTo(projectile.x + radius, projectile.y - 50); // TR
                */
                this.ctx.closePath();
                // this.ctx.fillStyle = 'rgba(0,0,0,' + this.global_alpha + ')';
                this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
                this.ctx.fill();

                // Circle filling
                /*
                this.ctx.moveTo(projectile.x + (radius / 2), projectile.y + (radius / 2));
                this.ctx.beginPath();
                this.ctx.arc(projectile.x, projectile.y, radius, 0, Math.PI * 2, false);
                this.ctx.closePath();
                // var rad = this.ctx.createRadialGradient(25, 25, 5, 50, 50, 50);
                this.ctx.fillStyle = 'red';
                this.ctx.fill();
                */
            }
        }

        // Particle lighting
        if (this.particles_enabled) {
            for (var i = 0; i < Engine.particles.length; i++) {
                var particle = Engine.particles[i];

                // Clear area
                this.ctx.clearRect(particle.x - 6, particle.y - 6, 12, 12);
            }
        }

        // Merge
        Engine.ctx.drawImage(this.canvas, 0, 0);
    }
}

