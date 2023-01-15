
/*******************************************************************************
Player sprites
*******************************************************************************/
var sprites = new Array();

// Commander Keen
sprites["Keen"] = new Array();
sprites["Keen"]["Settings"] = { spritesheet: 'images/keen_spritesheet.png', width: 32, height: 32, x_acceleration: 4, x_max_speed: 14, x_drag: 0.5, health_max: 100 };
sprites["Keen"]["StandRight"] = { name: "standLeft", totalFrames: 1, loop: false, sY: 64, sX: 32 };
sprites["Keen"]["StandLeft"] = { name: "standRight", totalFrames: 1, loop: false, sY: 64, sX: 0 };
sprites["Keen"]["WalkLeft"] = { name: "walkLeft", totalFrames: 4, loop: true, step: 2, sY: 32, sX: 0 };
sprites["Keen"]["WalkRight"] = { name: "walkRight", totalFrames: 4, loop: true, step: 2, sY: 0, sX: 0 };
sprites["Keen"]["Idle"] = { name: "idle", totalFrames: 2, loop: true, step: 20, sY: 64, sX: 64 };
// Flight
// sprites["Keen"]["FlightLeftUp"] { name: 'flightLeftUp', totalFrames: 1, loop, false, sY: 160, sX: 0 }; 
sprites["Keen"]["Projectile"] = { name: "projectile", totalFrames: 4, loop: true, step: 2, sY: 128, sX: 0 };

// Biomenace
sprites["Biomenace"] = new Array();
sprites["Biomenace"]["Settings"] = { spritesheet: 'images/biomenace_spritesheet.png', width: 50, height: 50, x_acceleration: 4, x_max_speed: 14, x_drag: 0.5, health_max: 10 };
sprites["Biomenace"]["StandRight"] = { name: "standLeft", totalFrames: 1, loop: false, sY: 100, sX: 50 };
sprites["Biomenace"]["StandLeft"] = { name: "standRight", totalFrames: 1, loop: false, sY: 100, sX: 0 };
sprites["Biomenace"]["WalkLeft"] = { name: "walkLeft", totalFrames: 4, loop: true, step: 2, sY: 50, sX: 0 };
sprites["Biomenace"]["WalkRight"] = { name: "walkRight", totalFrames: 4, loop: true, step: 2, sY: 0, sX: 0 };
sprites["Biomenace"]["Idle"] = { name: "standLeft", totalFrames: 1, loop: false, sY: 100, sX: 50 };

// Guybrush of Monkey Island fame
sprites["Guybrush"] = new Array();
sprites["Guybrush"]["Settings"] = { spritesheet: 'images/gb_walk.png', width: 104, height: 150, x_acceleration: 2, x_max_speed: 2, x_drag: 0.5, health_max: 100 };
sprites["Guybrush"]["StandRight"] = { name: "standLeft", totalFrames: 1, loop: false, sY: 300, sX: 0 };
sprites["Guybrush"]["StandLeft"] = { name: "standRight", totalFrames: 1, loop: false, sY: 300, sX: 105 };
sprites["Guybrush"]["WalkLeft"] = { name: "walkLeft", totalFrames: 6, loop: true, step: 2, sY: 150, sX: 0 };
sprites["Guybrush"]["WalkRight"] = { name: "walkRight", totalFrames: 6, loop: true, step: 2, sY: 0, sX: 0 };
sprites["Guybrush"]["Idle"] = { name: "idle", totalFrames: 1, loop: false, sY: 300, sX: 0 };

// Duke 3D
sprites["Duke3D"] = new Array();
sprites["Duke3D"]["Settings"] = { spritesheet: 'images/duke3d_spritesheet.png', width: 100, height: 100, x_acceleration: 1, x_max_speed: 6, x_drag: 0.5, health_max: 100 };
sprites["Duke3D"]["StandRight"] = { name: "standLeft", totalFrames: 1, loop: false, sY: 100, sX: 0 };
sprites["Duke3D"]["StandLeft"] = { name: "standRight", totalFrames: 1, loop: false, sY: 0, sX: 0 };
sprites["Duke3D"]["WalkLeft"] = { name: "walkLeft", totalFrames: 4, loop: true, step: 2, sY: 0, sX: 0 };
sprites["Duke3D"]["WalkRight"] = { name: "walkRight", totalFrames: 4, loop: true, step: 2, sY: 100, sX: 0 };
sprites["Duke3D"]["Idle"] = { name: "idle", totalFrames: 1, loop: true, sY: 200, sX: 0 };

// Doom Marine
sprites["DoomMarine"] = new Array();
sprites["DoomMarine"]["Settings"] = { spritesheet: 'images/DoomMarine_spritesheet.png', width: 55, height: 55, x_acceleration: 1, x_max_speed: 6, x_drag: 0.5, health_max: 150 };
sprites["DoomMarine"]["StandRight"] = { name: "standLeft", totalFrames: 1, loop: false, sY: 110, sX: 55 };
sprites["DoomMarine"]["StandLeft"] = { name: "standRight", totalFrames: 1, loop: false, sY: 110, sX: 0 };
sprites["DoomMarine"]["WalkLeft"] = { name: "walkLeft", totalFrames: 4, loop: true, step: 2, sY: 0, sX: 0 };
sprites["DoomMarine"]["WalkRight"] = { name: "walkRight", totalFrames: 4, loop: true, step: 2, sY: 55, sX: 0 };
sprites["DoomMarine"]["Idle"] = { name: "idle", totalFrames: 1, loop: true, sY: 110, sX: 55 }; // Get rid of idle state

/*******************************************************************************
Weapons
*******************************************************************************/
var weapons = {};

weapons["KeenBomb"] = new Array();
weapons["KeenBomb"]["Data"] = { image: null, image_loaded: false };
weapons["KeenBomb"]["Settings"] = { spritesheet: 'images/weapon_keen_bomb.png', width: 25, height: 25, can_bounce: true, effected_by_gravity: true, ttl: 1000, explode_on_die: false, speed: 5, damage: 100 };
weapons["KeenBomb"]["InFlight"] = { totalFrames: 2, loop: true, step: 10, sY: 0, sX: 0 };
weapons["KeenBomb"]["Explode"] = { totalFrames: 2, loop: true, step: 1, sY: 25, sX: 0 };

weapons["KeenBlaster"] = new Array();
weapons["KeenBlaster"]["Data"] = { image: null, image_loaded: false };
weapons["KeenBlaster"]["Settings"] = { spritesheet: 'images/weapon_keen_blaster.png', width: 32, height: 32, can_bounce: false, effected_by_gravity: false, ttl: 1000, explode_on_die: true, speed: 5, damage: 10 };
weapons["KeenBlaster"]["InFlight"] = { totalFrames: 4, loop: true, step: 2, sY: 0, sX: 0 };
weapons["KeenBlaster"]["Explode"] = { totalFrames: 2, loop: true, step: 1, sY: 32, sX: 0 };

