var mongoose = require('mongoose'),
    Location = require('../models/location');



function createLocation(location_info, done) {
    var location = new Location(location_info);
    location.save(done);
}

function findLocations(range, point, tags, done) {
    var where = {
        "position": {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: point
                },
                $maxDistance: range
            }
        }
    };

    if (tags.length > 0) {
        where["tags"] = {
            $in: tags
        };
    }

    Location.find(where, done);
}

module.exports = function(url) {

    mongoose.connect(url);

    return {
        'createLocation': createLocation,
        'findLocations': findLocations
    };

};