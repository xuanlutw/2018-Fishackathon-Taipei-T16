var hxt = [25.020418, 121.537630]
var lat = 25.020418;
var lng = 121.537630;
var map = L.map('mapid').setView([25.020418, 121.537630], 16);
var url_q = "question.html"
var url0 = "http://linux2.csie.ntu.edu.tw:3333/getdata?"
var time_interval = 24 // hrs

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery c <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);
//map.setMinZoom()
// Ask current location and put current position sign

function gglocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
                map.setView(position.coords, map.getZoom());
                mymarker.setLatLng(position.coords);
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                });
        current = [lat, lng]
    } 
    else {
        alert("Geolocation is not supported by this browser.");
        current = [25.020418, 121.537630]
    }
    map.setView(current,16)
}

var current_location_icon = L.icon({
    iconUrl: './png/current_place.png',
    iconSize:     [30, 35], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});
var marker = L.marker([lat, lng], {icon : current_location_icon}).addTo(map);

// Click on map to report (Deleted)
/*
function onMapClick(e)
{
    pos = e.latlng
    // var marker = L.marker(pos).addTo(map);
    // marker.bindPopup(`<center>position: ${pos} <br> Report: <br> <a href = ${url_q}> Report </a></center>`)
    // .openPopup()
    var pop = L.popup()
    .setLatLng(pos)
    .setContent(`<center>position: ${pos} <br> Report: <br> <a href = ${url_q}> Report </a></center>`)
    .openOn(map)
}
map.on('click', onMapClick); */

// checked layers
Type_list = ["algae_bloom", 
    "surface_scum", 
    "trash", 
    "oil", 
    "water_temperature", 
    "wind_direction", 
    "ice_thickness", 
    "boat_ramp", 
    "dock", 
    "bathroom", 
    "fish_kill", 
    "fish_deformities", 
    "fish_marks", 
    "fish_invasive", 
    "angler_number", 
    "location_crowd", 
    "boat_number", 
    "illegal"]
image_list = [5,7,6,7,3,2,8,17,20,22,10,12,9,15,18,16,19,21]

var LeafIcon = L.Icon.extend({
    options: {
        iconSize:     [28, 28],
        iconAnchor:   [0, 0],
        popupAnchor:  [0, 35]
    }
});
var icon_list = [];
for (var i = 0; i < Type_list.length; i++) {
    icon_list.push(new LeafIcon({iconUrl: './png/image'+image_list[i]+'.png'}))
}

checked_list = new Array(Type_list.length);
for(var i = 0 ; i < checked_list.length ; i++) checked_list[i] = false;
var lngW = map.getBounds().getWest();
var lngE = map.getBounds().getEast();
var latN = map.getBounds().getNorth();
var latS = map.getBounds().getSouth();

function WTF(){
    console.log(lngE)
    console.log(lngW)
    console.log(latN)
    console.log(latS)
    console.log(checked_list)
}

function set_type(){
    for(var i = 0 ; i < Type_list.length ; i++){
        var x = document.getElementsByName(Type_list[i])
        if(x[0].checked == true){
            checked_list[i] = true
        }
        else{
            checked_list[i] = false
        }
    }
    show_icon()
}

function set_time(){
    new_time = document.getElementsByName("time_selector")[0].value
    show_icon()
}


// boundary of the visible map
function pkrefresh(){
    lngE = map.getBounds().getEast();
    lngW = map.getBounds().getWest();
    latN = map.getBounds().getNorth();
    latS = map.getBounds().getSouth();
    show_icon();
}
map.on('moveend', pkrefresh);

//layer
var layer_list = []
var marker_list = []
for(var i = 0 ; i < Type_list.length ; i ++){
    layer_list.push([])
    marker_list.push([])
}


function show_icon(){
    var requestURL = url0;
    for(var i = 0; i < Type_list.length; i++) {
       if(checked_list[i] == true){
            requestURL = url0
            + "type=" + Type_list[i] 
            + "&time_start=" + pkdate()
            + "&latN=" + latN 
            + "&latS=" + latS 
            + "&lngW=" + lngW 
            + "&lngE=" + lngE;
            tmp(i, requestURL)
        }
    }
}

// avoid asynchronize events WTF
function tmp(i, requestURL){
    var request = new XMLHttpRequest();
    request.open('GET', requestURL)
    request.responseType = 'json'
    request.send()
    request.onload = function(){
        var data_list = request.response
        for (var j = 0; j < data_list.length; j++) {
            tmp_mark = L.marker([data_list[j]["lat"],data_list[j]["lng"]], {icon : icon_list[i]})
            tmp_mark.addTo(map)
            tmp_mark.bindPopup(Type_list[i]+"<br>"+data_list[j][Type_list[i]])
            tmp_mark.on('mouseover', 
                function onClick_marker(){
                tmp_mark.openPopup(tmp_mark.getLatLng())
            })
        }
    }
}


function pkdate(){
    var now = new Date()
    var s = now.getTime()
    var t = document.getElementsByName("time_selector")[0].value
    switch(t){
        case '1 hr':
            time_interval = 1;
            break;
        case '3 hrs':
            time_interval = 3;
            break;
        case '6 hrs':
            time_interval = 6;
            break;
        case '12 hrs':
            time_interval = 12;
            break;
        case '1 day':
            time_interval = 24;
            break;
        case '2 days':
            time_interval = 48;
            break;
        case '3 days':
            time_interval = 72;
            break;
        case '7 days':
            time_interval = 168;
            break;
    }
    s -= time_interval*3600000
    now = new Date(s)
    return now
}
