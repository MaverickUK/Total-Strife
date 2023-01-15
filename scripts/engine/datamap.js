

var DataMap = { // Collision and damage map
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    image: 0,
    is_ready: 0,

    // Peter's new stuff
    data: null,
    canvas: null,
    ctx: null,
    imageData: null,

    init: function (img_file) {
        this.is_ready = false;
        this.loadImage(img_file);
    },
    loadImage: function (img_file) {

        this.image = new Image();
        this.image.crossOrigin = "Anonymous";
        this.image.onload = function () {
            if ( typeof netscape != "undefined")
                netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");

            DataMap.canvas = document.createElement('canvas');
            DataMap.ctx = DataMap.canvas.getContext('2d');

            DataMap.imageToArray();
        }
        this.image.src = img_file;
    },
    imageToArray: function () {
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);

        // Convert to array
        this.imageData = this.ctx.getImageData(0, 0, this.image.width, this.image.height);
    },
    checkCollison: function (x, y) {
        var index = (x + y * this.image.width) * 4; // bits per pixel (rgba)
        return this.imageData.data[index + 1] == 255;
    },
    blastCollison: function (x, y, radius) {
        console.log('Blast collision disabled');
        /*
        var index = 0;
        console.log('Blast at ' + x + ',' + y + ' with radius of ' + radius);

        for (var blast_x = x - (radius / 2); blast_x <= x + (radius / 2); blast_x++) {
        for (var blast_y = y - (radius / 2); blast_y <= y + (radius / 2); blast_y++) {
        index = (blast_x + blast_y * this.image.width) * 4;

        for (var p = 0; p <= 3; p++) {
        this.imageData.data[index + p] = 0; // BOOM!!!
        }
        }
        }

        // copy the image data back onto the canvas
        this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
        */
    },
    drawImage: function () {
        // Engine.ctx.drawImage(this.image, 0, 0);
        // Engine.ctx.drawImage(this.imageData, 0, 0);
    }
}

