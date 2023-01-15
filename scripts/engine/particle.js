/*******************************************************
Particle effect system

These are drawn as individual pixels and don't use
images, for maximum speed and minimum memory/CPU usage.
*******************************************************/

var Particle = {
    x: null,
    y: null,

    // Velocity
    x_speed_min: null,
    x_speed_max: 20,
    y_speed_min: null,
    y_speed_max: 20,
    x_speed: 0,
    y_speed: 0,

    // Colour
    colour: 'white',
    colours: null, // Optional random colour array

    // Size
    min_size: null,
    max_size: 3,

    // Time to live
    ttl: null,
    current_ttl: null,
    auto_shrink: true, // If time to life enabled - shrink size instead of instantly dissapearing

    gameTick: function () {

        // Apply gravity
        this.y_speed += Engine.gravity;

        // Update position
        this.x += this.x_speed;
        this.y += this.y_speed;

        // TTL
        if (this.ttl != null) {
            this.current_ttl--;

            if (this.current_ttl <= 0) {
                if (this.auto_shrink && this.size > 0) { // Shrink
                    this.size--;
                    this.current_ttl = this.ttl; // Reset
                } else { // Instant remove
                }
            }
        }
    }
};

function newParticle(x, y, settings) {

    // Create copy of particle
    var particle = jQuery.extend({}, Particle);

    // Init
    particle.x = x;
    particle.y = y;

    // Override default particle with provided settings
    jQuery.extend(particle, settings);

    // Single particle speed by default
    if (particle.x_speed_min == null) { particle.x_speed_min = particle.x_speed_max; }
    if (particle.y_speed_min == null) { particle.y_speed_min = particle.y_speed_max; }

    // Single size particle by default
    if (particle.min_size == null) { particle.min_size = particle.max_size; }

    // Time to live
    if (particle.ttl != null) { particle.current_ttl = particle.ttl; }

    return particle;
}

