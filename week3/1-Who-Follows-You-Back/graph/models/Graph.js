var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GraphSchema = new Schema({
    start: String,
    depth: [Number]
}, {
    collection: 'graphs'
});

var Graph = mongoose.model('Graph', GraphSchema);

module.exports = Graph;