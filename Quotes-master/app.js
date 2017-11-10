var quotes = [];
var authors = [];

function mBaasInit() {
    var promise;
    promise = Kinvey.init({
        appKey: 'kid_TVIdIGLX_5',
        appSecret: 'c451f2ac2f7742ddb488f757db2f15d2'
    });
    promise.then(function (activeUser) {
        console.log("All is well in Kinveyland");
        populateAuthors();
    }, function (error) {
        alert("Could not initialize Kinvey");
    });
}

function populateAuthors() {
    var promise = Kinvey.DataStore.find('Authors', null, {
        success: function (response) {
            var result = "";
            authors = [];
            for (var i = 0; i < response.length; i++) {
                var author = response[i];
                authors.push(author);
                $("#authorList").append('<li>' + author.name + '</li>').listview('refresh');
            }
        }
    });
}

function populateQuotes(author) {
    var query = new Kinvey.Query();
    query.equalTo('who', author);
    var p = Kinvey.DataStore.find('Quotes', query, {
        success: function (response) {
            var result = "";
            quotes = [];
            for (var i = 0; i < response.length; i++) {
                var quote = response[i];
                quotes.push(quote);
            }
            //Change the page now
            $.mobile.changePage($("#quotespage"));
        }
    });
}

$(document).bind('pageinit', function () {
    $('#authorList').empty();
    $("#authorList").listview('refresh');

    //Initialize Kinvey
    mBaasInit();

    //When an Author List Element is clicked, fetch their quotes
    $(document).on('click', '#authorList li', function () {
        populateQuotes($(this).text());
    });

    //When quotespage is live, clear the current quotes and populate the new ones
    $('#quotespage').on('pageshow', function () {
        $('#quotesList').empty();
        $('#quotesTitle').text(quotes[0].who);
        for (var i = 0; i < quotes.length; i++) {
            $('#quotesList').append('<li><div style="white-space:normal;">' + quotes[i].what + '</div></li>');
            $('#quotesList').listview('refresh');
        }
    });
});
