var http = require('http'),
    request = require('request'),

    actions = {
    "register": function(args, callback){
        var user = {
            'user': args.user,
        };

        request({ uri:args.api_url + 'register',
                method:'POST',
                body: JSON.stringify(user),
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(JSON.parse(body));
                } else {
                    callback({'error': 'Request error'});
                }
            });
    },
    "get_all_chrips": function(args, callback){
        http.get(args.api_url + "all_chirps", function(res) {
            res.on("data", function(data) {
                console.log(data.toString());
            });
        });

    },
    "my_chirps": function(args, callback){
        var query = '?user=' + args.user + '&key=' + args.key;
        http.get(args.api_url + "my_chirps" + query, function(res) {
            res.on("data", function(data) {
                console.log(data.toString());
            });
        });
    },
    "create_chirp": function(args, callback){
        var chirp = {
            'text': args.message,
            'user': args.user,
            'key': args.key
        };

        request({ uri:args.api_url + 'chirp',
                method:'POST',
                body: JSON.stringify(chirp),
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(JSON.parse(body));
                } else {
                    callback({'error': 'Request error'});
                }
            });
    },
    "delete_chirp": function(args, callback){
        var query = '?key=' + args.key + '&chirpId=' + args.chirpid;

        request({ uri:args.api_url + 'chirp' + query,
                method:'DELETE',
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(JSON.parse(body));
                } else {
                    callback({'error': 'Request error'});
                }
            });
    }
};

module.exports = {
    request: function(action, args, callback){
        var handler = actions[action];
        if (!handler)
        {
            console.log('Invalid action');
        }
        return handler(args, callback);
    }
};