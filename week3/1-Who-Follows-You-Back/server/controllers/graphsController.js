var GithubGraphSource = require('../../graph-source-github'),
    DatabaseGraphSource = require('../../graph-source-mongodb');

function createGraphFor(req, res) {
    var username = req.body.username,
        depth = parseInt(req.body.depth, 10);

    GithubGraphSource.loadGraph(username, depth, function(graph) {
        DatabaseGraphSource.saveGraph(graph, depth, function(err, id) {
            if (err) {
                res.send('Could not save graph: ' + err);
            } else {
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
        } else {
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
        } else {

            var first = graph.pathBetween(graph.getStart(), username),
                second = graph.pathBetween(username, graph.getStart()),
                mutual = first && second,
                response = null;

            if (mutual) {
                response = 'mutual';
            } else if (first) {
                response = 'first';
            } else if (second) {
                response = 'second';
            } else {
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