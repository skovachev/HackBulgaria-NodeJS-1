var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GraphNodeSchema = new Schema({
    node: String,
    neighbours: [String]
}, {
    collection: 'graph_nodes'
});

var GraphNode = mongoose.model('GraphNode', GraphNodeSchema);

module.exports = GraphNode;