var DirectedGraph = require('../graph'),
    GraphModel = require('../models/Graph'),
    GraphNodeModel = require('../models/Node'),

module.exports = {
    
    loadGraph: function(graphId, done) {
        // load graph from database via id
        GraphModel.findOne({_id: graphId}, function(err, graph) {
            if (err) {
                done(err, null);
            } else {
                GraphNodeModel.find({node: graph.start}, function(err, nodes) {
                    if (err) {
                        done(err, null);
                    } else {
                        var structure = {};
                        nodes.forEach(function(node){
                            structure[node.node] = node.neighbours;
                        });
                        done(null, new DirectedGraph(structure));
                    }
                });
            }
        });
    },

    saveGraph: function(graph, done) {

    }
};