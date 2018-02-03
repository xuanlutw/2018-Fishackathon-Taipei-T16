var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var db_url = "mongodb://linux2.csie.ntu.edu.tw:3334/fishackathon";
var port = 3333;
var dbo;

function write_log(mes){
    mes = "[" + new Date() + "] " + mes; 
    console.log(mes);
    fs.appendFile(__dirname + '/log', mes + '\n', function(err){});
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
    console.log('wave_phase' + req.body.wave_phase);
    console.log('CSRF token (from hidden form field): ' + req.body._csrf);
    console.log('Name (from visible form field): ' + req.body.name);
    console.log('Email (from visible form field): ' + req.body.email);
    res.redirect(303, '/thanks.html');
    /*
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("test").insertOne(myobj, function(err, res) {
    if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });
    */
    /*
    dbo.collection("customers").find({}, { _id: 0, name: 1, address: 1 }).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
    */
    var query = { address:""  };
    //db.collection.find( { field: { $gt: value1, $lt: value2 } } );
    /*
    dbo.collection("customers").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
            db.close();
    });
    */
})

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

/*
app.get("/get_story2", function(req, res) {
    //var no = req.query["no"];
    res.status(200).json(story_list);
    var to_write = "[" + new Date() + "] " + req.ip + " GET " +req.url + " " + req.protocol + " 200";
    console.log(to_write);
    fs.appendFile(__dirname + '/log', to_write + '\n', function(err){});
});

app.get("/get_story", function(req, res) {
    var index = Math.floor(Math.random() * no_child_list.length);
    res.status(200).json(story_list[no_child_list[index]])
    var to_write = "[" + new Date() + "] " + req.ip + " GET " +req.url + " " + req.protocol + " 200";
    console.log(to_write);
    fs.appendFile(__dirname + '/log', to_write + '\n', function(err){});
});

app.get('/put_story', function(req, res) {
    res.send("");
    var to_write = "[" + new Date() + "] " + req.ip + " GET " +req.path + " " + req.protocol + " 200";
    console.log(to_write);
    fs.appendFile(__dirname + '/log', to_write + '\n', function(err){});
    var no = req.query["no"];
    if (story_list[no]["child"] == -1) story_list[no]["child"] = story_list.length;
    else{
        no = story_list[no]["child"];
        while (story_list[no]["sibling"] != -1) no = story_list[no]["sibling"];
        story_list[no]["sibling"] = story_list.length;
    }
    story_list.push({"no": story_list.length, "context": req.query["context"], "child": -1, "sibling": -1});
    for (var i = 0;i < no_child_list.length;++i)
        if (no_child_list[i] == no)
            no_child_list.splice(i,1);
    no_child_list.push(story_list.length - 1);
    fs.writeFile("./story_list.json", JSON.stringify(story_list), function(err){});
    });
*/
MongoClient.connect(db_url, function(err, db) {
    if (err) throw err;
    dbo = db.db("fishackathon");
    write_log("Connect database scuuess!");
});

// Intialization
app.listen(port, function() {
    write_log("Listening on " + port); 
});
