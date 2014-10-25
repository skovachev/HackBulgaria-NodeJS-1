var express = require('express'),
    bodyParser = require('body-parser'),
    url = require("url"),
    app = express(),
    db_url = "mongodb://localhost:27017/geo",
    LocationsService = require('./services/locations')(db_url);

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

    LocationsService.createLocation(location_info, function(err, location, numberAffected) {
        if (err) {
            res.status(500).send('Could not add location.');
        } else {
            res.json(location);
        }
    });
});

app.get('/locations', function(req, res) {
    var query = url.parse(req.url, true).query,
        range = parseInt(query.range, 10) * 1000,
        point = [parseFloat(query.lng), parseFloat(query.lat)],
        tags = query.tags ? query.tags.split(',') : [];

    LocationsService.findLocations(range, point, tags, function(err, locations) {
        if (err) {
            res.status(500).send('Could not load locations');
        } else {
            var points = locations.map(function(location) {
                return location.toPoint();
            });
            res.json(points);
        }
    });
});

var server = app.listen(1337, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Geo server listening at http://%s:%s', host, port);

});