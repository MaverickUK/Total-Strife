var Engine = { //main canvas and demo container
    canvas: null, //main canvas object
    ctx: null, //main canvas drawing context
    width: 1232, // 1085, // 900,
    height: 784, // 544, // 450,
    timer: null,  //hold reference to game loop timer
    background: null, //background image - for now is drawn right onto main canvas which is not ideal
    foreground: null, //foreground object

    // Peter's extras
    floor:750, // 480, // 410,
    data_map: null,
    projectiles: new Array(), // Weapon fire, etc...
    sprites: new Array(),
    weapons: new Array(), // Available weapons
    particles: new Array(),
    sfx: new Array(),
    enabled: true,
    lighting_map: null, // Real-time lighting overlay
    gravity: 1, // Effect of gravity on bodys

    // Chase cam
    chasecam_ctx: null,

    // Settings
    particles_enabled: true,
    lighting_enabled: false,

    init: function () { //initialize Engine
        Engine.canvas = document.createElement('canvas'); // document.getElementById('main');  //get canvas element from html
        Engine.ctx = Engine.canvas.getContext('2d'); //create main drawing canvas
        Engine.canvas.setAttribute('width', Engine.width); //set attributes of canvas
        Engine.canvas.setAttribute('height', Engine.height);

        // Chase cam
        if (!true) {
            $('#chase_cam').hide();
        } else {
            Engine.chasecam_ctx = document.getElementById('chase_cam').getContext('2d');
            // $('#main').hide();
        }

        // Sound effects
        Engine.sfx["hit"] = new buzz.sound("sfx/shothit.wav");
        Engine.sfx["land"] = new buzz.sound("sfx/keenlandsnd.wav");
        Engine.sfx["jump"] = new buzz.sound("sfx/keenjumpsnd.wav");


        Engine.background = new Image(); //load background
        Engine.background.ready = false;
        Engine.background.onload = function () {
            Engine.background.ready = true;
            Engine.timer = setInterval(Engine.gameLoop, 40); //set up improvised game loop at 25 FPS (1000/40 = 25)
        }

        Engine.background.src = ('images/Level_KeenLarge.png');
        // Engine.background.src = ('images/Keen1_Background.png');
        // Engine.background.src = ('images/back.gif');
        // Engine.background.src = ('images/data_map.png');

        //create foreground and init
        // Engine.foreground = Foreground;
        // Engine.foreground.init(0, 0, 997, 450, 'images/fore.png');
        // Engine.foreground.init(0, 0, 997, 450, 'images/data_map.png');



        // Collision and damage mapping
        Engine.data_map = DataMap;
        // Engine.data_map.init('images/data_map.png');
        Engine.data_map.init('images/Level_KeenLarge_Data.png');

        // Real-time lighting
        if (Engine.lighting_enabled) {
            Engine.lighting_map = Lighting;
            Engine.lighting_map.init();
        }

        // Load weapons assets into memory
        $.each(weapons, function (key, value) {
            value.Data.image = new Image();
            value.Data.image.onload = function () {
                value.Data.image_loaded = true;
            }
            value.Data.image.src = value.Settings.spritesheet;
        });

    },

    // Main game loop
    gameLoop: function () {

        if (Engine.enabled) {

            if (Engine.particles_enabled) {

                // Animate particles
                for (var i = 0; i < Engine.particles.length; i++) {
                    Engine.particles[i].gameTick();
                }

                // Remove off screen/dead particles
                var removeAt = 0;
                while (removeAt != null) {
                    removeAt = null;

                    for (var i = 0; i < Engine.particles.length; i++) {
                        var particle = Engine.particles[i];

                        if ((particle.x < 0 || particle.x > Engine.width) && particle.y > Engine.height) { // Off-screen
                            removeAt = i;
                            break;
                        }
                        else if (particle.ttl != null && particle.current_ttl <= 0) { // Time to live
                            removeAt = i;
                            break;
                        }
                        else if (particle.size <= 0) { // Disapeared
                            removeAt = i;
                            break;
                        }
                    }

                    if (removeAt != null) {
                        Engine.particles.splice(i, 1); // Remove off screen particle
                    }
                }
            }

            // Animate projectiles
            for (var i = 0; i < Engine.projectiles.length; i++) {
                Engine.projectiles[i].gameTick();
            } // END projectile loop

            if (true) {
                // Remove dead projectiles
                var removeAt = 0;
                while (removeAt != null) {
                    removeAt = null;

                    for (var i = 0; i < Engine.projectiles.length; i++) {
                        if (Engine.projectiles[i].ttl <= 0) {
                            removeAt = i;
                            break;
                        }
                    }

                    if (removeAt != null) {
                        Engine.projectiles.splice(i, 1); // Remove dead projectile
                    }
                }
            } // END !true

            // Display statistics
            $('#lblParticles').html(Engine.particles.length);
            $('#lblProjectiles').html(Engine.projectiles.length);

            Engine.drawFrame();
        }
    },

    drawProjectiles: function () {
        for (var i = 0; i < Engine.projectiles.length; i++) {
            var ps = Engine.projectiles[i];
            Engine.ctx.drawImage(ps.canvas, Engine.projectiles[i].x, Engine.projectiles[i].y); //draw image
        }
    },

    drawParticles: function () {
        for (var i = 0; i < Engine.particles.length; i++) {
            var particle = Engine.particles[i];
            Engine.ctx.fillStyle = particle.colour;
            Engine.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        }
    },

    drawSpriteHealthBar: function (sprite) {
        // Health bar settings
        var bar_width = 50;
        var bar_height = 10;
        var healthPer = Math.round((100 / sprite.health_max) * sprite.health);
        var healthBarPer = bar_width / 100 * healthPer;
        if (healthBarPer < 0) { healthBarPer = 0; } // Limiter

        var bar_x = (sprite.x + (sprite.width / 2)) - (bar_width / 2);
        var bar_y = sprite.y - 20;

        // Background
        Engine.ctx.globalAlpha = 0.8;
        Engine.ctx.fillStyle = 'rgba(255,255,255,0.4)';
        Engine.ctx.fillRect(bar_x, bar_y, bar_width, bar_height);

        // Fill
        var healthColour = 'green'
        if (healthPer < 75 && healthPer >= 30) {
            healthColour = 'orange';
        } else if (healthPer < 30) {
            healthColour = 'red';
        }

        Engine.ctx.fillStyle = healthColour;
        Engine.ctx.fillRect(bar_x, bar_y, healthBarPer, bar_height);

        // Border
        Engine.ctx.lineWidth = 1;
        Engine.ctx.strokeStyle = 'black';
        Engine.ctx.strokeRect(bar_x, bar_y, bar_width, bar_height);

        Engine.ctx.globalAlpha = 1.0; // Reset
    },

    drawCollisonMap: function () {

        Engine.ctx.clearRect(0, 0, Engine.width, Engine.height);  //clear main canvas

        Engine.ctx.fillStyle = "red";
        for (x = 1; x <= Engine.width; x++) {
            for (y = 1; y <= Engine.height; y++) {
                if (DataMap.checkCollison(x, y)) {
                    Engine.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    },

    drawFrame: function () { //main drawing function
        Engine.ctx.clearRect(0, 0, Engine.width, Engine.height);  //clear main canvas
        Engine.ctx.drawImage(Engine.background, 0, 0); // draw canvas background

        // Draw sprites
        for (var i = 0; i < Engine.sprites.length; i++) {
            var sprite = Engine.sprites[i];
            sprite.drawImage();
            Engine.ctx.drawImage(sprite.canvas, sprite.x, sprite.y);
        }

        // Draw projectiles
        Engine.drawProjectiles();

        // Draw particles
        Engine.drawParticles();

        // Engine.foreground.drawImage(); //draw foreground image onto foreground internal canvas
        // Engine.ctx.drawImage(Engine.foreground.canvas, 0, 0); //draw foreground on main canvas - is drawn last so will be drawn on top of other 

        // Draw sprite health bars
        for (var i = 0; i < Engine.sprites.length; i++) {
            if (Engine.sprites[i].alive) {
                Engine.drawSpriteHealthBar(Engine.sprites[i]);
            }
        }

        // Collison map
        DataMap.drawImage();

        // Real-time lighting map
        if (Engine.lighting_enabled) {
            Lighting.drawImage();
        }

        // Draw to chase cam
        if (Engine.chasecam_ctx != null) {
            // Engine.chasecam_ctx.drawImage(Engine.ctx, 50, 50, 50, 50, 0, 0, 300, 200);
            // Engine.chasecam_ctx.fillRect(25, 25, 50, 50);

            var width = 640;
            var height = 480;
            var spriteToFollow = this.sprites[0];

            var followX = spriteToFollow.x - (width / 2);
            var followY = spriteToFollow.y - (height / 2);

            // Edge cases
            if (followX < 0) { followX = 0; }
            if (followX + width > Engine.width) { followX = Engine.width - width; };
            if (followY < 0) { followY = 0; }
            if (followY + height > Engine.height) { followY = Engine.height - height; };

            Engine.chasecam_ctx.drawImage(Engine.canvas,
            followX, // Source X
            followY, // Source Y,
            width, // Source width
            height, // Source height
            0, // Dest X
            0, // Dest Y
            width, // Dest width
            height); // Dest height
        }
    },
    // Add projectile to arena
    addProjectile: function (x, y, sprite) {
        var weaponFire = { x: x, y: y, x_speed: 0, y_speed: 0, canvas: document.createElement('canvas'), ctx: null, ttl: 100, effectedByGravity: false };
        weaponFire.ctx = weaponFire.canvas.getContext('2d'); //create main drawing canvas
        weaponFire.ctx.drawImage(sprite.image, 0, 128, 32, 32, 0, 0, 32, 32);

        weaponFire.x_speed = sprite.x_speed; // Fire at speed of sprite

        switch (sprite.direction) {
            case 90: // Right
                weaponFire.x += sprite.width;
                weaponFire.x_speed += 10; // TODO Rig up to weapon speed
                break;
            case 270: // Left
                weaponFire.x -= sprite.width;
                weaponFire.x_speed -= 10; // TODO Rig up to weapon speed
                break;
        }

        this.projectiles[this.projectiles.length] = weaponFire;
    },

    addProjectile2: function (sprite, name) {
        var x = sprite.x;
        var y = sprite.y;
        var settings = { x_speed: 0, image: weapons[name].Data.image, width: weapons[name].Settings.width, height: weapons[name].Settings.height, weapon_name: name };

        settings.x_speed = sprite.x_speed; // Fire at speed of sprite

        switch (sprite.direction) {
            case 90: // Right
                x += sprite.width;
                settings.x_speed += weapons[name].Settings.speed;
                break;
            case 270: // Left
                x -= sprite.width;
                settings.x_speed -= weapons[name].Settings.speed;
                break;
        }

        this.projectiles[this.projectiles.length] = newProjectile(x, y, settings);
    },

    // Add sprite to arena
    addSprite: function (x, y, spriteName) {
        var id = this.sprites.length;

        this.sprites[id] = newSprite(); //create new Sprite object
        this.sprites[id].init(x, y, spriteName);
        return id;
    },
    // Add one or more paricles
    addParticles: function (x, y, amount, settings) {
        if (this.particles_enabled) {

            // Create base particle
            var base = newParticle(x, y, settings);

            for (var i = 1; i <= amount; i++) {
                // Copy default particle
                var particle = jQuery.extend({}, base);

                // Individual particle settings
                particle.x_speed = randomBetween(particle.x_speed_min, particle.x_speed_max, false);
                particle.y_speed = randomBetween(particle.y_speed_min, particle.y_speed_max, false);
                particle.size = randomBetween(particle.min_size, particle.max_size);

                // Pick random colour
                if (particle.colours != null) {
                    particle.colour = particle.colours[randomBetween(0, particle.colours.length - 1)];
                }

                this.particles[this.particles.length] = particle;
            }
        }
    }
};

// Engine.init();  //initialize main Expermient object