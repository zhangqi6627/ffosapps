var MAPPME = {}; // create app object to prevent namespace conflicts

$(document).ready(function () {
    var map = setupLeafletMap();
    
    $("#locateMe").click(function () {
        $('#map').show();
        leafletFindLocation(map);
    });
});

function setupLeafletMap () {
    var map = L.map('map');
     
    // setup the tile data, loading from toolserver.org
    L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
      maxZoom: 18 // try experimenting with different zoom values!
    }).addTo(map);
    
    // setup events for when we find user location
    map.on('locationfound', function (event) {
        var radius = event.accuracy / 2;

        var posMarker = L.marker(event.latlng);
        posMarker
            .addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
        MAPPME.markers.push(posMarker);

        var accuracyMarker = L.circle(event.latlng, radius);
        accuracyMarker.addTo(map);
        MAPPME.markers.push(accuracyMarker);
    });
    map.on('locationerror', function () {
        alert(e.message);
    });
    
    return map;
}

function leafletFindLocation (map) {
    if (!MAPPME.markers) {
        MAPPME.markers = [];
    }
    
    MAPPME.markers.forEach(function (marker) { // remove location markers from previous calls of the 'locationfound' method)
        map.removeLayer(marker);
    });
    MAPPME.markers = [];
    
    map.locate({setView: true}); // Leaflet finds location and set 
}