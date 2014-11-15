var DirectedGraph = require('../graph'),
    GraphModel = require('./models/Graph'),
    GraphNodeModel = require('./models/Node'),
    mongoose = require('mongoose'),
    async = require('async'),
    q = require('q');

mongoose.connect('mongodb://localhost:27017/njsw3_github_grapher');


// find nodes, each one == edge, add alledges to array for first invocation
// create graph from that
function findNodesForNode(node, depth) {
    var deferred = q.defer();
    GraphNodeModel.find({
        node: node
    }, function(err, nodes) {
        if (err) {
            deferred.reject(err);
        } else {
            var structure = {
                edges: {},
                startNode: node
            };
            var nextDepth = depth - 1;
            var callbacks = [];

            nodes.forEach(function(node) {
                structure.edges[node.node] = node.neighbours;
                if (depth >= 0) {
                    node.neighbours.forEach(function(subNode){
                        callbacks.push(function(callback){
                            findNodesForNode(subNode, nextDepth).done(function(subGraph){
                                callback(null, subGraph);
                            });
                        });
                    });
                }
            });

            if (callbacks.length > 0) {
                async.series(callbacks, function(err, graphs){
                    graphs.forEach(function(g){
                        if (g instanceof DirectedGraph){
                            Object.keys(g.getEdges()).forEach(function(edgeKey){
                                if (typeof structure.edges[edgeKey] === 'undefined' || structure.edges[edgeKey].length === 0) {
                                    structure.edges[edgeKey] = g.getEdges()[edgeKey];
                                }
                            });
                        }
                        else {
                            structure.edges[g] = [];
                        }
                    });
                    deferred.resolve(new DirectedGraph(structure));
                });
            }
            else {
                if (depth < 0) {
                    deferred.resolve(node);
                }
                else {
                    deferred.resolve(new DirectedGraph(structure));
                }
                
            }
        }
    });
    return deferred.promise;
}

module.exports = {

    loadGraph: function(graphId, done) {
        // load graph from database via id
        GraphModel.findOne({
            _id: graphId
        }, function(err, graph) {
            if (err) {
                done(err, null);
            } else {
                // TODO: load graph nodes recursive based on depth
                // graph.depth
                findNodesForNode(graph.start, graph.depth).done(function(structure){
                    // console.log(structure);
                    done(null, structure);
                });
            }
        });
    },

    saveGraph: function(graph, depth, done) {
        var graph_data = {
            start: graph.getStart(),
            depth: depth
        };
        var graphModel = new GraphModel(graph_data);
        graphModel.save(function(err, g) {
            if (err) {
                done(err, null);
            } else {
                // save nodes
                var edges = graph.getEdges(),
                    insertable_nodes = [];

                Object.keys(edges).forEach(function(key) {
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