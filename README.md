# Total Strife
This a JavaScript/canvas based 2D game engine I wrote over during the Christmas 2011 holiday, but then ran out of time to keep developing. I rediscovered the sourcecode for this on Dropbox in early 2023 and thought I'd upload it here.

![YouTube video](https://img.youtube.com/vi/qZ6bKNAqpzU/0.jpg)

[Watch overview of game engine and code on YouTube](https://youtu.be/qZ6bKNAqpzU)

## Running the game
Due to the way the game engine loads local files, you'll need to ensure it's running through a web server to prevent getting security errors in the browser. I'd recommend using [http-server](https://www.npmjs.com/package/http-server) and you'll be up and running in a few minutes.

Just fire up the web server then open the `TotalStrife.html` in the browser and everything should work

## Controls
- **Movement**: Cursor keys
- **Jump**: Space
- **Fire**: Control

---
The following was written back in 2011

# Codename: “Total Strife”
Here’s a sneak peek of my Christmas 2011 project, it’s a 2D sprite engine built in JavaScript using all the HTML5 goodness I can pack in.

It all started when I saw [NetKeen](https://keenwiki.shikadi.net/wiki/NetKeen) in action and first thought the developer had created it from scratch. Looking deeper I found that it was actually a reverse enginnering job - which explained why the gameplay seemed so faithful to the original.

I also found out that setting up NetKeen sounded like a bit of a pain, involving DosBox and hoop jumping needed to get the network support to play ball. Also it’s hampered by memory restrictions, resulting in small levels.

So I figured, why don’t I create a NetKeen style engine using JavaScript. With the canvas tag to output video, sound support and even networking socket support it should be possible!?

After an evenings work this video shows my I’ve managed to put together so far, not bad! Although I must heavily credit John Graham who created the basic canvas drawing and sprite animation code.

# Features (current)
- jQuery keyboard bindings to move your sprite
- Custom spritesheets for characters
- Music and sound effects
- Basic physics (Gravity, friction)
- Particle effects

# Features (planned)
- Network play
- Destructable terrian

# Videos
## Scrolling viewport
[![Scrolling viewport](https://img.youtube.com/vi/cyYu9w35vvw/0.jpg)](https://www.youtube.com/watch?v=cyYu9w35vvw)

## Particle effects
[![Scrolling viewport](https://img.youtube.com/vi/P51rFMUP3aM/0.jpg)](https://www.youtube.com/watch?v=P51rFMUP3aM)
