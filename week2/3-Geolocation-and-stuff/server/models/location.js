var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LocationSchema = new Schema({
    name: String,
    position: [Number],
    tags: [String]
}, {
    collection: 'locations'
});

var Location = mongoose.model('Location', LocationSchema);
Location.prototype.toPoint = function() {
    return {
        "name": this.name,
        "coordinates": this.position
    };
};

module.exports = Location;