var db_url = "mongodb://localhost:27017/geo",
    LocationsService = require('../services/locations')(db_url),
    url = require("url");

function createLocation(req, res) {
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
}

function findLocations(req, res) {
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
}

module.exports = {
    'createLocation': createLocation,
    'findLocations': findLocations
};