var http = require('http'),
    http_post = require('http-post'),
    post = function(path, data, callback)
    {

    },

    actions = {
    "register": function(args, callback){
        console.log(args);
        var user = {
            'user': args.user,
        };

        var userString = JSON.stringify(user);

        var request = require('request'); 
        request(
        { uri:args.api_url + 'register',
          method:'POST',
          body:userString,
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) { callback(JSON.parse(body)) }
        });

        return;
    },
    "get_all_chrips": function(args, callback){
        console.log(args.api_url + "all_chirps");
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
        
        var userString = JSON.stringify(chirp);

        var request = require('request'); 
        request(
        { uri:args.api_url + 'chirp',
          method:'POST',
          body:userString,
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) { callback(JSON.parse(body)) }
        });
    },
    "delete_chirp": function(args, callback){
        var query = '?key=' + args.key + '&chirpId=' + args.chirpid;
        // http.delete(args.api_url + "chirp" + query, function(res) {
        //     res.on("data", function(data) {
        //         console.log(data.toString());
        //     });
        // });

        var request = require('request'); 
        request(
        { uri:args.api_url + 'chirp' + query,
          method:'DELETE',
        },
        function (error, response, body) {
          if (!error && response.statusCode == 200) { callback(JSON.parse(body)) }
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