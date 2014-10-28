var DirectedGraph = require('../graph'),
    GraphModel = require('../models/Graph'),
    GraphNodeModel = require('../models/Node');

module.exports = {
    
    loadGraph: function(graphId, done) {
        // load graph from database via id
        GraphModel.findOne({_id: graphId}, function(err, graph) {
            if (err) {
                done(err, null);
            } else {
                // TODO: load graph nodes recursive based on depth
                // graph.depth
                GraphNodeModel.find({node: graph.start}, function(err, nodes) {
                    if (err) {
                        done(err, null);
                    } else {
                        var structure = {
                            edges: {},
                            startNode: graph.start
                        };
                        nodes.forEach(function(node){
                            structure.edges[node.node] = node.neighbours;
                        });
                        done(null, new DirectedGraph(structure));
                    }
                });
            }
        });
    },

    saveGraph: function(graph, depth, done) {
        var graph_data = {
            start: graph.getStart(),
            depth: depth
        };
        GraphModel.save(graph_data, function(err, g) {
            if (err) {
                done(err, null);
            }
            else {
                // save nodes
                var edges = graph.getEdges(),
                    insertable_nodes = [];

                Object.keys(edges).forEach(function(key){
                    insertable_nodes.push({
                        node: key,
                        neighbours: edges[key]
                    });
                });

                GraphNodeModel.collection.insert(insertable_nodes, {}, function(err, nodes) {
                    done(err, g._id);
                });
            }
        });
    }
};