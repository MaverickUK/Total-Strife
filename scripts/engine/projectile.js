/*******************************************************
Projectile (Weapon fire)
*******************************************************/

function newProjectile(x, y, settings) {

    // Create projectile
    var projectile = {
        // Position
        x: 0,
        y: 0,

        // Previous position
        x_prev: 0,
        y_prev: 0,

        // Velocity
        x_speed: 0,
        y_speed: 0,

        // Animation
        currentFrame: 0, //current animation frame for this sprite
        currentStep: 0, //number of frames since this sprite's animation was updated

        // Canvas
        width: 0,
        height: 0,
        canvas: document.createElement('canvas'), // Allows individual animations
        image: null, // Source of projectile images
        ctx: null,

        // Misc
        ttl: 0,
        effectedByGravity: false,
        weapon_name: null,
        mode: 'InFlight', // state

        gameTick: function () {
            this.movement(); // Update position
            this.collision(); // Collision detection
            this.animate(); // Animation frame work
            this.draw(); // Draw image to canvas
        },

        collision: function () {

            var collision = false;

            // TODO Consoldate code!!!

            // Level collisions
            if (DataMap.checkCollison(projectile.x, projectile.y)) {
                if (projectile.can_bounce) {
                    // X or Y collision
                    if (DataMap.checkCollison(projectile.x_prev, projectile.y)) { // Y
                        projectile.y_speed = (projectile.y_speed * -1); // Bounce!
                    } else { // X
                        projectile.x_speed = (projectile.x_speed * -1); // Bounce!
                    }
                } else {
                    collision = true;
                }
            }

            if (!collision) {
                // Sprite collisions
                for (var s = 0; s < Engine.sprites.length; s++) {
                    var sprite = Engine.sprites[s];

                    if (sprite.alive) {
                        if (projectile.x >= sprite.x && projectile.x <= (sprite.x + sprite.width)) {
                            if (projectile.y >= sprite.y && projectile.y <= (sprite.y + sprite.height)) { // BLAM!!!
                                collision = true;

                                // Effect sprite
                                sprite.y_speed -= 10; // TODO Rig up to weapon blast effect
                                sprite.x_speed += (projectile.x_speed * 2);
                                sprite.health -= projectile.damage; // TODO Rig up to weapon damage
                            }
                        }
                    } // END sprite.alive
                }
            }

            if (collision) {
                // Projectile dead
                projectile.ttl = 0;

                // Arena blast damage
                DataMap.blastCollison(projectile.x, projectile.y, 50);

                // Particle blast
                var particleSettings = { x_speed_max: projectile.x_speed, y_speed_max: 3, x_speed_min: 0, y_speed_min: -5, ttl: 10, colours: ['rgb(84,252,84)', 'white', 'green'] };
                Engine.addParticles(projectile.x, projectile.y, 20, particleSettings);

                // Sound
                Engine.sfx["hit"].play();
            }

        },

        movement: function () {

            // Remember previous position
            projectile.x_prev = projectile.x;
            projectile.y_prev = projectile.y;

            // Move to method
            var weaponSettings = weapons[this.weapon_name].Settings;

            // Reduce time to live
            projectile.ttl--;

            if (weaponSettings.effected_by_gravity) {
                projectile.y_speed += 0.3; // TODO Rig into central gravity reference
            }

            projectile.x += projectile.x_speed;
            projectile.y += projectile.y_speed;

            // Auto loop
            if (projectile.x < 0) projectile.x = Engine.width;
            if (projectile.x > Engine.width) projectile.x = 0;
        },

        animate: function () {

            // Advance animation based on animation speed (step value)
            var weaponMode = weapons[this.weapon_name][this.mode];

            if (this.currentStep >= weaponMode.step) {
                this.currentStep = 0;
                this.currentFrame++;
                if (this.currentFrame >= weaponMode.totalFrames) {
                    if (weaponMode.loop) {
                        this.currentFrame = 0; //loop animation back to start
                    }
                    else {
                        this.currentFrame = weaponMode.totalFrames - 1; //if loop not set, hold on final frame
                    }
                }
            }
            else {
                this.currentStep++; //advance step counter if step limit not reached	
            }

        },

        draw: function () { //draw image into canvas
            this.ctx.clearRect(0, 0, this.width, this.height); //clear previous frame

            // if (this.image_loaded) { //do not draw if sprite is not ready
            if (true) {
                // Calculate values for sprite based on animation
                var weaponMode = weapons[this.weapon_name][this.mode];

                var srcX = weaponMode.sX + (this.currentFrame * this.width);
                var srcY = weaponMode.sY;

                // Sprite.ctx.rotate(0.17);
                // Sprite.stepSprite(); //advance animation
                // Sprite.moveSprite(); //move sprite

                this.ctx.drawImage(this.image, srcX, srcY, this.width, this.height, 0, 0, this.width, this.height); //draw image
            }
        }
    };

    // Init
    projectile.x = x;
    projectile.y = y;

    // Override default projectile with provided settings
    jQuery.extend(projectile, settings);

    // Weapon settings
    projectile.ttl = weapons[projectile.weapon_name].Settings.ttl;
    projectile.damage = weapons[projectile.weapon_name].Settings.damage;
    projectile.can_bounce = weapons[projectile.weapon_name].Settings.can_bounce;

    // Canvas setup
    projectile.canvas.setAttribute('width', projectile.width);
    projectile.canvas.setAttribute('height', projectile.height);

    // Setup canvas context
    projectile.ctx = projectile.canvas.getContext('2d');
    projectile.ctx.drawImage(projectile.image, 0, 0, projectile.width, projectile.height, 0, 0, projectile.width, projectile.height);

    /*
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
    */

    return projectile;
}

