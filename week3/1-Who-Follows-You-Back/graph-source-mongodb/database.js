var DirectedGraph = require('../graph'),
    GraphModel = require('./models/Graph'),
    GraphNodeModel = require('./models/Node'),
    debug = require('debug')('MongoDB-GraphSource'),
    mongoose = require('mongoose'),
    async = require('async'),
    q = require('q');

mongoose.connect('mongodb://localhost:27017/njsw3_github_grapher');

function findEdgesForNode(nodeName, depth) {
    var deferred = q.defer();

    debug('findEdgesForNode', nodeName, depth);

    GraphNodeModel.findOne({
        node: nodeName
    }, function(err, node) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!node) {
                return deferred.reject('Could not find start node: ' + nodeName);
            }

            var totalEdges = {};
            totalEdges[nodeName] = node.neighbours;

            if (depth >= 0) {

                var nextDepth = depth - 1;

                var callbacks = node.neighbours.map(function(neighbour) {
                    return function(callback) {
                        findEdgesForNode(neighbour, nextDepth)
                            .fail(function(err) {
                                callback();
                            })
                            .done(function(edges) {
                                if (edges) {
                                    Object.keys(edges).forEach(function(edgeKey) {
                                        totalEdges[edgeKey] = edges[edgeKey];
                                    });
                                }
                                callback();
                            });
                    };
                });

                async.series(callbacks, function(err) {
                    deferred.resolve(totalEdges);
                });

            } else {
                deferred.resolve(totalEdges);
            }
        }
    });

    return deferred.promise;
}

function loadGraphFromNode(nodeStart, depth) {
    var deferred = q.defer();

    debug('loadGraphFromNode', depth);

    GraphNodeModel.findOne({
        node: nodeStart
    }, function(err, node) {
        if (err) {
            deferred.reject(err);
        } else {
            if (!node) {
                return deferred.reject('Could not find start node: ' + nodeStart);
            }
            var structure = {
                edges: {},
                startNode: node
            };

            if (depth >= 0) {
                findEdgesForNode(nodeStart, depth)
                    .fail(function(err) {
                        deferred.reject(err);
                    })
                    .done(function(edges) {
                        structure.edges = edges;
                        structure.edges[node.node] = node.neighbours;
                        deferred.resolve(new DirectedGraph(structure));
                    });
            } else {
                structure.edges[node.node] = node.neighbours;
                deferred.resolve(new DirectedGraph(structure));
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
                loadGraphFromNode(graph.start, graph.depth)
                    .fail(function(err) {
                        done(err);
                    })
                    .done(function(structure) {
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