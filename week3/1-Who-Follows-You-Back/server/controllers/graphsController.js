var GithubGraphSource = require('../graph/sources/api'),
    DatabaseGraphSource = require('../graph/sources/database'),
    Graph = require('../graph/models/Graph');

function createGraphFor(req, res) {
    var username = req.body.username,
        depth = req.body.depth;

    GithubGraphSource.loadGraph(username, parseInt(depth, 10), function(graph) {
        // TODO save graph to db
        console.log(graph.toString());
        res.json(id);
    });
}

function getGraph(req, res) {
    var graphId = req.param("graphId");
    DatabaseGraphSource.loadGraph(graphId, function(err, graph) {
        if (err) {
            res.send('Graph does not exist');
        }
        else {
            res.send(graph.toString());
        }
    });
}

function getFollowingStatus(req, res) {
    var graphId = req.param("graphId"),
        username = req.param("username");

    DatabaseGraphSource.loadGraph(graphId, function(err, graph) {
        if (err) {
            res.send('Graph does not exist');
        }
        else {
            // graph.pathBetween(username)
        }
    });
    
}

module.exports = {
    'createGraphFor': createGraphFor,
    'getGraph': getGraph,
    'getFollowingStatus': getFollowingStatus
};
