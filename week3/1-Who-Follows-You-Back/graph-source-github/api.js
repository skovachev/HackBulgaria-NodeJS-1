var DirectedGraph = require('../graph'),
    credentials = require('./github'), // clientId, clientSecret,
    following_url = "https://api.github.com/users/%s/following?client_id=" + credentials.clientId + "&client_secret=" + credentials.clientSecret,
    maxDepth = 4,
    nodes = {},
    _ = require('underscore'),
    async = require('async'),
    request = require('request'),
    sprintf = require('sprintf').sprintf;

function parseUserFollowingResponse(response) {
    var json = JSON.parse(response);

    if (json.message) {
        return [];
    }

    return json.map(function(user) {
        return user.login;
    });
}

function getUserFollowing(username, done) {
    console.log('Get following for user: ' + username);

    var url = sprintf(following_url, username);
    request({
        uri: url,
        method: 'GET',
        headers: {
            'User-Agent': 'HackBulgariaNodeJS - GithubGrapher'
        }
    }, function(error, response, body) {
        var users = [];
        if (!error) {
            users = parseUserFollowingResponse(body);
        }
        console.log(nodes);
        nodes[username] = users;
        done(users);
    });
}

function getUsersFollowing(users, currentDepth, callback) {

    if (currentDepth <= maxDepth) {
        console.log('Running api calls for depth: ' + currentDepth);

        var callbacks = [],
            usersQueue = [];

        users.forEach(function(username) {
            callbacks.push(function(async_callback) {
                getUserFollowing(username, function(following) {
                    async_callback(null, following);
                });
            });
        });

        async.series(callbacks, function(err, results) {
            users = _.unique(_.flatten(results));
            console.log('Completed api calls for depth: ' + currentDepth);
            getUsersFollowing(users, currentDepth + 1, callback);
        });
    } else {
        // done
        callback();
    }
}

module.exports = {
    // load graph from api via username and depth
    loadGraph: function(username, depth, done) {
        maxDepth = depth;
        getUserFollowing(username, function(following) {
            getUsersFollowing(following, 1, function() {
                var graphStructure = {
                    edges: nodes,
                    startNode: username
                };
                done(new DirectedGraph(graphStructure));
            });
        });
    }
};