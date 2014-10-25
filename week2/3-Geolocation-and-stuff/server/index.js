var mongoose = require('mongoose'),
    express = require('express'),
    bodyParser = require('body-parser'),
    url = require("url"),
    app = express(),
    Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name : String,
  position : [Number],
  tags: [String]
}, { collection: 'locations' });

var Location = mongoose.model('Location', LocationSchema);

mongoose.connect("mongodb://localhost:27017/geo");

app.use(bodyParser.json());

app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
    res.header("Access-Control-Allow-Methods", ["GET", "POST"]);
    next();
});

app.post('/locations', function(req, res) {
    var location_info = {
        name: req.body.name,
        tags: req.body.tags,
        position: [req.body.position.lng, req.body.position.lat]
    };
    var location = new Location(location_info);

    location.save(function(err, location, numberAffected){
        if (err) {
            res.status(500).send('Could not add location.');
        }
        else {
            res.json(location);
        }
    });
});

app.get('/locations', function(req, res) {
    var query = url.parse(req.url, true).query;

    console.log(query);
    var meters = parseInt(query.range, 10) * 1000;
    console.log(meters);
    var where = {
        "position": {
            $nearSphere: {
                 $geometry: {
                    type : "Point",
                    coordinates : [ parseFloat(query.lng), parseFloat(query.lat) ]
                 },
                 $maxDistance: meters
              }
        }
    };

    if (query.tags) {
        where["tags"] = { $in: query.tags.split(',')};
    }

    Location.find(where, function(err, locations){
        console.log(locations);
        if (err) {
            res.status(500).send(err.name);
        }
        else {
            var points = locations.map(function(location){
                console.log(location);
                return {
                    "name": location.name,
                    "coordinates": location.position
                };
            });
            res.json(points);
        }
    });

    // return name, coordiantes[0,1]
});

var server = app.listen(1337, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Geo server listening at http://%s:%s', host, port);

});