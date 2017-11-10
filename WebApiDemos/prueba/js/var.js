var timeout = 5000;
var points;
var viewport = {
    width  : $(window).width()-110,
    height : $(window).height()-110
};
var max_time;
var min_time;
var object;
var temp;
var vida;
var corazon_time;
 // User proximity

	/*$(document).ready(function(){
        userProximityDisplay = document.querySelector("#user-proximity-display");
            userProximityDisplay.style.display = "block";
            window.onuserproximity = function (event) {
                // Check user proximity
                var userProx = "<strong>User proximity - near: </strong>" + event.near + "<br>";
                userProximityDisplay.innerHTML = userProx;
            };
        }

$(document).ready(function(){
	geolocationDisplay = document.querySelector("#geolocation-display");
	navigator.geolocation.getCurrentPosition(function (position) {
                geolocationDisplay.innerHTML = "<strong>Latitude:</strong> " + position.coords.latitude + ", <strong>Longitude:</strong> " + position.coords.longitude;
                geolocationDisplay.style.display = "block";
            },
            function (position) {
                geolocationDisplay.innerHTML = "Failed to get your current location";
                geolocationDisplay.style.display = "block";
            });
});
*/