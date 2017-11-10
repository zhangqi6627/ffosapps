/* Create Stream animation */
var dots = $('.dot'),
    TIMEFRAME = 1,
    MAX_HEIGHT = 11,
    MIN_HEIGHT = 1,
    MAX_COLOR = 8,
    MIN_COLOR = 1,
    COLOR = '189,195,199'; // RGB

dots.each(function (i) {
    $(this).css({ 'margin-left': (i * 1) + 'em'});
});

setInterval(function () {
    dots.each(function () {
        var height = Math.floor((Math.random() * MAX_HEIGHT) + MIN_HEIGHT);
        $(this).css({
            height: height + 'em',
            top: '-' + height/2 + 'em',
            background: 'rgba('+ COLOR +',.' + Math.floor((Math.random() * MAX_COLOR) + MIN_COLOR) + ')'
        });
    });
}, 1000 * TIMEFRAME);