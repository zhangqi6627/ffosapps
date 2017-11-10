/* App Start */
$(document).ready(function() {
    __appConfig();

    var button = document.querySelector('.sound');
    button.addEventListener('touchstart', intoSearch, false);

    var submitForm = document.querySelector('.search-submit');
    submitForm.addEventListener('touchend', startSearch, false);

    $("#results").on('click', 'p', function(e) {
        e.preventDefault();

        var link = $(this).attr('url');

        var activity = new MozActivity({
            name: "view",
            data: {
                type: "url",
                url: link
            }
        });
    });

    $("#results").on('click', '#reSearch', function() {
         $('.search-input').val('');

         $('#results').fadeOut(300, function(){
             $('.search-form').fadeIn(300);
         });
    });

});

function __appConfig() {
    orientation(); //forces portrait orientation
    view();
}

var orientation = function() {
    if (window.screen.mozLockOrientation('portrait')) {
         // orientation was locked
    } else {
        screen.lockOrientation('portrait');
    }
}

var view = function() {
    document.querySelector('.search-form').style.display = 'none';
}

var intoSearch = function() {
    $('.sound').fadeOut(300, function(){
        $('.search-form').fadeIn(400);
    });
}

var startSearch = function() {
    var query = $('.search-input').val();

    if (query.length <= 0) {
        alert('The field is empty, please fill to continue');
        return;
    }

    if (verifyConnection() === "online")
        getResults(query);
    else
        alert( 'You must be connected to the internet' );
}

var getResults = function(query) {
    var url = 'http://gdata.youtube.com/feeds/api/videos?q=' + query + '&alt=json&max-results=25';

    $.getJSON(url, function (data) {

        var feed = data.feed;
        var entries = feed.entry || [];
        var results = [];

        console.log(query);

        results = '<a id="reSearch">Try another music</a><br><br><br>';

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var title = entry.title.$t;
            var link = entry.link[0].href;
            var thumb = entry.media$group.media$thumbnail[0].url;
            var file = entry.media$group.media$content[0].url;

            if (entry.category[1].term === "Music")
                results += '<p url="' + link + '" ><img src="' + thumb + '"/>' +
                    '<br>' + title.substring(0,60); + '</p>';

        }

        $('.search-form').fadeOut(300, function(){
            $('#results').fadeIn(2000).html(results);
        });
    });
}

function verifyConnection(event) {
    var condition = navigator.onLine ? "online" : "offline";

    return condition;
}