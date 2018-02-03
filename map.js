var hxt = [25.020418, 121.537630]
var map = L.map('mapid').setView([25.020418, 121.537630], 16);
var url_q = "question.html"

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery c <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);


// create a red polyline from an array of LatLng points


//var polyline = L.polyline([[25.017308, 121.539417], [25.017308, 121.539417]], {color: 'red'}).addTo(map);

//var popup = L.popup().setLatLng(hxt).setContent("AAAAAAAA").openOn(map)

function onMapClick(e)
{
    pos = e.latlng
    var marker = L.marker(pos).addTo(map);
    // marker.bindPopup(`<center>position: ${pos} <br> Report: <br> <a href = ${url_q}> Report </a></center>`)
    // .openPopup()
    var pop = L.popup()
    .setLatLng(pos)
    .setContent(`<center>position: ${pos} <br> Report: <br> <a href = ${url_q}> Report </a></center>`)
    .openOn(map)
    marker.remove()
}
map.on('click', onMapClick);



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
		marker.setLatLng([route[0].lat, route[1].lng]);
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