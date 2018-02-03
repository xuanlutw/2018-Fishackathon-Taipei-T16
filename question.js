var init_latlng = [25.020418, 121.537630];
var map = L.map('mapid').setView(init_latlng, 16);
var mymarker = L.marker(init_latlng).addTo(map);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery c <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);
document.getElementById("lat").value = init_latlng[0];
document.getElementById("lng").value = init_latlng[1];

function onMapClick(e) {
    map.setView(e.latlng, map.getZoom());
    mymarker.setLatLng(e.latlng);
    document.getElementById("lat").value = e.latlng.lat;
    document.getElementById("lng").value = e.latlng.lng;
    //alert(e.latlng.lat + " " + e.latlng.lng);
}
map.on('click', onMapClick);

function gglocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
                map.setView(position.coords, map.getZoom());
                mymarker.setLatLng(position.coords);
                document.getElementById("lat").value = position.coords.latitude;
                document.getElementById("lng").value = position.coords.longitude;
                });
    } 
    else {
        alert("Geolocation is not supported by this browser.");
    }
}

gglocation();
