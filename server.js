var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var db_url = "mongodb://linux2.csie.ntu.edu.tw:3334/fishackathon";
var db_name = "fishackathon"
var db_collection = "test3";
var dbo;
var port = 3333;

var type_num = ["water_temperature", "ice_thickness", "ice_distance_from_shore",  "angler_number", "boat_number", "location_crowd", "boat_ramp_crowd"]; 
var type_str = ["algae_bloom", "surface_scum", "trash", "oil", "wind_direction", "wave_action", "ice_quality", "boat_ramp", "dock", "bathroom", "bathroom_or_not", "illegal", "fish_kill", "fish_deformities", "fish_marks", "fish_invasive"];

function write_log(mes){
    mes = "[" + new Date() + "] " + mes; 
    console.log(mes);
    fs.appendFile(__dirname + '/log', mes + '\n', function(err){});
}

function normalize_lng(lng){
    var tmp = parseFloat(lng)
    if (!tmp) return -200;
    while(1){
        if (tmp > -180 && tmp <= 180) break;
        else if (tmp <= -180) tmp += 180;
        else tmp -= 180;
        console.log(tmp);
    }
    
    return tmp;
}

// Index.html
app.get("/", function(req, res) {
    res.sendFile(__dirname + '/map.html', function(err) {
    if (err){
        res.send(404);
        write_log(req.ip + " GET " +req.url + " " + req.protocol + " 404");
    }
    else write_log(req.ip + " GET " +req.url + " " + req.protocol + " 200");
    });
});

// Other html
app.get("/*.html", function(req, res) {
    res.sendFile(__dirname + req.url, function(err) {
        if (err){
            res.send(404);
            write_log(req.ip + " GET " +req.url + " " + req.protocol + " 404");
        }
        else write_log(req.ip + " GET " +req.url + " " + req.protocol + " 200");
    });
});

// Post data
app.post('/datapost', function(req, res){
    write_log(req.ip + " POST /datapost " + req.protocol + " 303");
    res.redirect(303, '/thanks.html');
    for (var i = 0;i < type_num.length;++i){
        if (!req.body[type_num[i]]) continue;
        var obj = {};
        obj["type"] = type_num[i];
        obj[type_num[i]] = parseFloat(req.body[type_num[i]]);
        obj["lat"] = parseFloat(req.body["lat"]);
        obj["lng"] = normalize_lng(req.body["lng"]);
        obj["time"] = new Date();
        //console.log(obj);
        dbo.collection(db_collection).insertOne(obj, function(err, res) {
            if (err) write_log("Insert database err!");
        });
    }
    for (var i = 0;i < type_str.length;++i){
        if (!req.body[type_str[i]]) continue;
        var obj = {};
        obj["type"] = type_str[i];
        obj[type_str[i]] = req.body[type_str[i]];
        obj["lat"] = parseFloat(req.body["lat"]);
        obj["lng"] = normalize_lng(req.body["lng"]);
        obj["time"] = new Date();
        //console.log(obj);
        dbo.collection(db_collection).insertOne(obj, function(err, res) {
            if (err) write_log("Insert database err!");
        });
    }
    console.log(req.body);
    /*
    dbo.collection("customers").find({}, { _id: 0, name: 1, address: 1 }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
    var query = { address:""  };
    //db.collection.find( { field: { $gt: value1, $lt: value2 } } );
    dbo.collection("customers").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
            db.close();
    });
    */
})

// Get data
app.get("/getdata", function(req, res) { 
    var q = req.query;
    console.log(q);
    q["lngW"] = normalize_lng(q["lngW"]);
    q["lngE"] = normalize_lng(q["lngE"]);
    q["latN"] = parseFloat(q["latN"]);
    q["latS"] = parseFloat(q["latS"]);
    var flag = 0;
    for (var i = 0;i < type_num.length;++i){
        if (type_num[i] == req.query["type"]) flag = 1;
    }
    for (var i = 0;i < type_str.length;++i){
        if (type_str[i] == req.query["type"]) flag = 1;
    }
    if (!flag){
        res.send(404);
        write_log(req.ip + " GET " +req.url + " " + req.protocol + " 404");
    }
    else{
        dbo.collection(db_collection).find({$and: [ //{"time_stamp": {$gt: q["time_star"]}},
                                                                    {"lat": {$gt: q["latS"], $lt: q["latN"]}}, 
                                                                    {"lng": {$gt: q["lngW"], $lt: q["lngE"]}},
                                                                    {"type": q["type"]}]
                                                                    }).toArray(function(err, result){
        //dbo.collection(db_collection).find({"type":"wave_action"}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            //write_log(result[0]);
            res.contentType('application/json');
            res.send(result);
            write_log(req.ip + " GET " +req.url + " " + req.protocol + " 200"); 
        });
    }
});

// Other file
app.get(/(.*)\.(jpg|gif|png|ico|css|js|txt)/i, function(req, res) {
    res.sendfile(__dirname + "/" + req.params[0] + "." + req.params[1], function(err) {
        if (err){
            res.send(404);
            var to_write = "[" + new Date() + "] " + req.ip + " GET " +req.url + " " + req.protocol + " 404";
            console.log(to_write);
            fs.appendFile(__dirname + '/log', to_write + '\n', function(err){});
        }
        else{
            var to_write = "[" + new Date() + "] " + req.ip + " GET " +req.url + " " + req.protocol + " 200";
            console.log(to_write);
            fs.appendFile(__dirname + '/log', to_write + '\n', function(err){});
        }
    });
});

MongoClient.connect(db_url, function(err, db) {
    if (err) throw err;
    dbo = db.db(db_name);
    write_log("Connect database scuuess!");
    /*
    dbo.collection(db_collection).find().forEach(function(res){
        var res2 = res
        res2["lat"] = parseFloat(res["lat"]);
        res2["lng"] = parseFloat(res["lng"]);
        dbo.collection("test3").insertOne(res2, function(err, ress){});
        console.log(res["_id"]);
    });
    */
});

// Intialization
app.listen(port, function() {
    write_log("Listening on " + port); 
});
