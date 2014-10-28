var GithubGraphSource = require('../graph/sources/api'),
    DatabaseGraphSource = require('../graph/sources/database'),
    Graph = require('../graph/models/Graph');

function createGraphFor(req, res) {
    var username = req.body.username,
        depth = req.body.depth;

    GithubGraphSource.loadGraph(username, parseInt(depth, 10), function(graph) {
        DatabaseGraphSource.saveGraph(graph, function(err, id) {
            if (err) {
                res.send('Could not save graph: ' + err);
            }
            else {
                res.send(id);
            }
        });
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

            var first = graph.pathBetween(graph.getStart(), username),
                second = graph.pathBetween(username, graph.getStart()),
                mutual = first() && second,
                response = null;

            if (mutual) {
                response = 'mutual';
            }
            else if (first) {
                response = 'first';
            }
            else if (second) {
                response = 'second';
            }
            else {
                response = 'none';
            }

            res.json({
                relation: response
            });
        }
    });
    
}

module.exports = {
    'createGraphFor': createGraphFor,
    'getGraph': getGraph,
    'getFollowingStatus': getFollowingStatus
};
