var map = L.map('mapid').setView([25.017308, 121.539417], 16);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery c <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

// create a red polyline from an array of LatLng points


var polyline = L.polyline([[25.017308, 121.539417], [25.017308, 121.539417]], {color: 'red'}).addTo(map);
var marker = L.marker([25.017308, 121.539417]).addTo(map);
var time_interval = 2000;
var load = 10;
var set_zone = 1;
/*
function update_time_change(){
    time_interval = document.control_form.update_time.value;
	flush();
    console.log(time_interval);
}

function load_change(){
    load = document.control_form.load.value;
	flush();
    console.log(load);
}

function set_zone_change(){
    set_zone = document.control_form.set_zone.value;
	flush();
    console.log(set_zone);
}

function flush(){
    var requestURL = './route.json';
    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        var route = request.response;
        var latlngs = new Array(load);
	    for (let i = 0;i < load;++i){
    		latlngs[i] = new Array(2);
		    latlngs[i][0] = route[i].lat;
	    	latlngs[i][1] = route[i].lng;
	    }
    	polyline.setLatLngs(latlngs);
		marker.setLatLng([route[0].lat, route[0].lng]);
		marker.bindPopup(route[0].time).openPopup();
	    if (set_zone == 1) map.fitBounds(polyline.getBounds());
    }
	console.log('flush!');
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	document.getElementById('updated').innerHTML = 'Last updated on:'+hour+':'+minute+':'+second;
}

function clock(){
	flush();
	setTimeout("clock();", time_interval);
}
clock();
*/
function gglocation(){
    var position;
    var lat = document.getElementById("lat");
    var lon = document.getElementById("lon");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
                lat_now = position.coords.latitude;
                lon_now = position.coords.longitude;
                lat.value = lat_now;
                lon.value = lon_now;
                set_map();
                });
    } 
    else {
        lat.value = lat_now;
        lon.value = lon_now;
        alert("Geolocation is not supported by this browser.");
    }
}
