document.addEventListener("DOMContentLoaded", function(event) {
    var saveButton = document.querySelector('#save');
    saveButton.addEventListener('click', function () {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) { // Success callback if the location is found.
                display('Latitude: ' + position.coords.latitude + '<br/> Longitude: ' + position.coords.longitude);
            }, function (err) { // Error callback if the location cannot be found
                console.error('Failed to get user location', err);
                display('Failed to get user location: <i>' + err.message + '</i>');
            }, {"timeout":5000});
        } else { // If the browser does not support Geolocation.
            display('You don\'t have GPS'); 
        }
    });
});

function display(str) { // Display a string in #coordinates.
    var coordinates = document.querySelector('#coordinates');
    coordinates.innerHTML = str;
    coordinates.classList.remove('no-items');
}