
/*** function to create and then return a new Sprite object */
function newSprite() {
    var Sprite = {
        canvas: 0, //canvas to hold this sprite - will be drawn to main canvas
        ctx: 0, //context for sprite canvas
        x: 0, // X position of this sprite
        y: 0, //Y position of this sprite
        animation: 0, //current animation for this sprite
        currentFrame: 0, //current animation frame for this sprite
        width: 0,
        height: 0,
        image: 0, //image that is being drawn to the canvas
        currentStep: 0, //number of frames since this sprite's animation was updated
        is_ready: 0, //sprite has finished loading and can be used

        // New - Basic physics simulation
        x_speed: 0,
        y_speed: 0,

        gas_left: false,
        gas_right: false,

        name: null,
        mode: '',
        sfx: {}, // Sound effects
        health: 0, // Current hit points
        health_max: 0, // Max hit points
        alive: false,
        direction: 270, // degree - 360 top, 90 right, 180 bottom, 270 left

        init: function (x, y, sprite) { //initialize sprite
            Sprite.is_ready = false; //sprite not ready
            Sprite.x = x;
            Sprite.y = 0;
            Sprite.width = sprites[sprite]["Settings"].width;
            Sprite.height = sprites[sprite]["Settings"].height;
            Sprite.canvas = document.createElement('canvas');
            Sprite.canvas.setAttribute('width', sprites[sprite]["Settings"].width);
            Sprite.canvas.setAttribute('height', sprites[sprite]["Settings"].height);
            Sprite.ctx = Sprite.canvas.getContext('2d'); //get canvas drawing context
            Sprite.loadImage(sprites[sprite]["Settings"].spritesheet); // load image for sprite
            Sprite.name = sprite; // Name of sprite
            Sprite.mode = 'Idle'; // Animation mode
            Sprite.health_max = sprites[sprite]["Settings"].health_max; // Default - get from sprite data
            Sprite.health = Sprite.health_max;
            Sprite.alive = true;

            // Sound effects
            this.sfx["Fire"] = new buzz.sound("sfx/keenfiresnd.wav");

            // Spawn
            // Sprite.respawn();
        },
        loadImage: function (img_file) {  //loads image to draw for sprite
            Sprite.image = new Image();  //create new image object
            Sprite.image.onload = function () {  //event handler for image load 
                Sprite.is_ready = true; // sprite is ready when image is loaded
                // Sprite.ctx.scale(0.5, 0.5);
            }
            Sprite.image.src = img_file; //load file into image object
        },
        drawImage: function () { //draw image into sprite canvas
            Sprite.ctx.clearRect(0, 0, Sprite.width, Sprite.height); //clear previous frame

            if (Sprite.is_ready && Sprite.alive) { //do not draw if sprite is not ready
                //calculate values for sprite based on animation

                var srcWidth = sprites[Sprite.name]["Settings"].width;
                var srcHeight = sprites[Sprite.name]["Settings"].height;
                var srcX = sprites[Sprite.name][Sprite.mode].sX + (Sprite.currentFrame * srcWidth);
                var srcY = sprites[Sprite.name][Sprite.mode].sY;


                // Sprite.ctx.rotate(0.17);
                Sprite.stepSprite(); //advance animation
                Sprite.moveSprite(); //move sprite

                Sprite.ctx.drawImage(Sprite.image, srcX, srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight); //draw image
            }
        },
        stepSprite: function () { //advance animation based on animation speed (step value)
            if (Sprite.currentStep >= sprites[Sprite.name][Sprite.mode].step) {
                Sprite.currentStep = 0;
                Sprite.currentFrame++;
                if (Sprite.currentFrame >= sprites[Sprite.name][Sprite.mode].totalFrames) {
                    if (sprites[Sprite.name][Sprite.mode].loop) {
                        Sprite.currentFrame = 0; //loop animation back to start
                    }
                    else {
                        Sprite.currentFrame = sprites[Sprite.name][Sprite.mode].totalFrames - 1; //if loop not set, hold on final frame
                    }
                }
            }
            else {
                Sprite.currentStep++; //advance step counter if step limit not reached	
            }

            // Is the sprite alive?
            if (this.health <= 0 && this.alive) {
                this.kill();
            }
        },
        /*Temporary move functions to move demo sprites.  Ideally this code will be handled outside the Sprite object, so Sprite can focus soley on drawing and animation*/
        moveSprite: function () {

            var previousMode = Sprite.mode;

            // Where sprite wants to go - to be checked by collision detection
            var move_to_x = Sprite.x;
            var move_to_y = Sprite.y;

            if (Sprite.gas_left) {
                Sprite.x_speed -= sprites[Sprite.name]["Settings"].x_acceleration;
            }

            if (Sprite.gas_right) {
                Sprite.x_speed += sprites[Sprite.name]["Settings"].x_acceleration;
            }

            // Horizontal
            if (Sprite.x_speed != 0) {

                move_to_x += Sprite.x_speed;

                // Drag TODO - improve code
                if (Sprite.x_speed > 0) {
                    Sprite.x_speed -= sprites[Sprite.name]["Settings"].x_drag;
                    if (Sprite.x_speed > sprites[Sprite.name]["Settings"].x_max_speed) {
                        Sprite.x_speed = sprites[Sprite.name]["Settings"].x_max_speed; // Max
                    }
                } else {
                    Sprite.x_speed += sprites[Sprite.name]["Settings"].x_drag;
                    if (Sprite.x_speed < -sprites[Sprite.name]["Settings"].x_max_speed) {
                        Sprite.x_speed = -sprites[Sprite.name]["Settings"].x_max_speed; // Max
                    }
                }
            }

            // Loop round
            if (Sprite.x > Engine.width) {
                move_to_x = 0 - Sprite.width;
            }
            else if ((Sprite.x + Sprite.width) < 0) {
                move_to_x = Engine.width;
            }

            // Work out animation mode
            if (Sprite.x_speed != 0) {
                if (Sprite.x_speed > 0) {
                    Sprite.mode = 'WalkRight';
                } else {
                    Sprite.mode = 'WalkLeft';
                }
            } else if (Sprite.x_speed == 0 && (previousMode == 'WalkLeft' || previousMode == 'WalkRight')) {
                if (previousMode == 'WalkLeft') {
                    Sprite.mode = 'StandLeft';
                } else {
                    Sprite.mode = 'StandRight';
                }
                Sprite.currentFrame = 0;
                Sprite.currentStep = 0;
            }

            // Veritical
            // if (Sprite.y != 265) { // If not landed
            if (Sprite.y_speed != 0 || Sprite.feet() != Engine.floor) {

                if (Sprite.feet() > Engine.floor) { // Stop!
                    move_to_y = Engine.floor - Sprite.height;
                    Sprite.y_speed = 0;
                } else {
                    // Apply momentum
                    move_to_y += Sprite.y_speed;

                    // Apply gravity
                    Sprite.y_speed += 2;
                }
            }

            // Don't allow fractional positions
            move_to_x = Math.round(move_to_x);
            move_to_y = Math.round(move_to_y);

            if (true) {
                if (Sprite.name == 'Keen') {
                    // Collision detection

                    // Requested movement - collision detect
                    if (DataMap.checkCollison(move_to_x, move_to_y + Sprite.height)) { // 

                        // console.log('Collision detected at ' + move_to_x + ',' + move_to_y);

                        // Now work out if any axis still allows movement

                        // X axis
                        if (DataMap.checkCollison(move_to_x, Sprite.y + Sprite.height)) { // CRASH
                            Sprite.x_speed = 0;
                            // Sprite.gas_left = false;
                            // Sprite.gas_right = false;
                            move_to_x = Sprite.x; // Cancel movement
                        }

                        // Y axis 
                        if (DataMap.checkCollison(Sprite.x, move_to_y + Sprite.height)) { // CRASH

                            if (Sprite.y_speed > 10) {
                                Engine.sfx["land"].play();
                            }

                            Sprite.y_speed = 0;

                            // move_to_y = Sprite.y; // Cancel movement


                            // Calculate collison free y coordinate
                            var y_thingy = (move_to_y > Sprite.y ? 2 : -2);
                            move_to_y -= y_thingy;
                            // console.log('Crunch');

                            while (DataMap.checkCollison(Sprite.x, move_to_y + Sprite.height)) {
                                // console.log(move_to_y);
                                move_to_y -= y_thingy;
                            }

                        }

                        // console.log('Resolved to ' + move_to_x + ',' + move_to_y);
                    }

                    $('#txtOutput').val(Sprite.y);
                }
            }

            // Change position of sprite
            Sprite.x = move_to_x;
            Sprite.y = move_to_y;

            // Update direction
            if (Sprite.x_speed != 0) {
                if (Sprite.x_speed > 0) {
                    Sprite.direction = 90; // Right
                } else {
                    Sprite.direction = 270; // Left
                }
            }

        },
        goJump: function () {
            Sprite.y_speed -= 10;
            Engine.sfx["jump"].play();
        },
        goLeft: function (flag) {
            Sprite.gas_left = flag;
        },
        goRight: function (flag) {
            Sprite.gas_right = flag;
        },
        goFire: function () {
            this.sfx["Fire"].play();
            // Engine.addProjectile(this.x, this.y, this);

            Engine.addProjectile2(this, "KeenBlaster");
            // Engine.addProjectile2(this, "KeenBomb");
        },
        feet: function () {
            return Sprite.y + Sprite.height;
        },
        speed: function (axis) {
            switch (axis) {
                case 'x':
                    if (this.x_speed < 0) {
                        return this.x_speed * -1;
                    } else {
                        return this.x_speed;
                    }
                    break;
                case 'y':
                    if (this.y_speed < 0) {
                        return this.y_speed * -1;
                    } else {
                        return this.y_speed;
                    }
                    break;
            }

            return null;
        },
        kill: function () {
            this.alive = false; // Dead!
            this.x_speed = 0;
            this.y_speed = 0;

            // Explode
            Engine.addParticles(this.x, this.y, 100, { colour: 'red', min_size: 1, max_size: 6, y_speed_min: -8, y_speed_max: 0, x_speed_min: -3, x_speed_max: 3, ttl: 5 });

            // Respawn
            setTimeout(function () {
                Sprite.respawn();
            }, 2000);
        },
        respawn: function () {
            // Randonally place in non-collidable position
            this.x = randomBetween(0, Engine.width);
            this.y = randomBetween(0, Engine.height);

            while (DataMap.checkCollison(this.x, this.y + this.height)) { // BLAM - Re-calculate
                this.x = randomBetween(0, Engine.width);
                this.y = randomBetween(0, Engine.height);
            }

            // Reappear particles
            Engine.addParticles(this.x, this.y, 100, { colours: [ 'yellow', 'white', 'orange' ] , x_speed_max: 5, x_speed_min: -5, y_speed_min: -5, y_speed_max: 5, ttl: 15, max_size: 3 });

            // and back in the game
            this.health = this.health_max;
            this.alive = true;
        }
    };
    return Sprite;  //returns newly created sprite object
};

