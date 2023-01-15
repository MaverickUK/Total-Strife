
function randomBetween(from, to, intOnly) {
    if (intOnly == undefined) { intOnly = true; }

    var rnd = Math.random() * (to - from + 1) + from;

    if (intOnly) {
        return Math.floor(rnd);
    } else {
        return rnd;
    }
}

String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};