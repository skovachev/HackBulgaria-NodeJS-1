var backend = require('./storage'),
    is_string = function(obj){
        return typeof obj === 'string';
    },
    error_handler = function(text){
        return {
            'error': text
        };
    },
    handlers = {
        'GET_all_chirps': function(args){
            var chirps = backend.get_all_chirps();
            return {
                'chirps': chirps
            };
        },
        'POST_chirp': function(args){
            var storage = backend.login_user(args.key);
            if (is_string(storage))
            {
                return error_handler(storage);
            }
            return {
                'chirp': storage.create_chirp(args.text)
            };
        },
        'POST_register': function(args){
            var user = backend.create_user(args.user);
            if (is_string(user))
            {
                return error_handler(user);
            }
            return {
                'user': user
            };
        },
        'GET_my_chirps': function(args){
            var storage = backend.login_user(args.key);
            if (is_string(storage))
            {
                return error_handler(storage);
            }
            return {
                'chirps': storage.get_user_chirps()
            };
        },
        'DELETE_chirp': function(args){
            var storage = backend.login_user(args.key);
            console.log(storage);
            if (is_string(storage))
            {
                return error_handler(storage);
            }
            var chirp = storage.delete_chirp(parseInt(args.chirpId, 10));
            if (is_string(chirp))
            {
                return error_handler(chirp);
            }
            return {
                'chirp': chirp
            };
        },

    };

module.exports = {
    route_request: function(method, url, args){
        var request_key = method + '_' + url.substring(1),
            request_handler = handlers[request_key];

        console.log('Request key:', request_key, 'params:', args);

        if (typeof request_handler === 'undefined'){
            return error_handler('Invalid request');
        }

        return request_handler(args);
    }
};