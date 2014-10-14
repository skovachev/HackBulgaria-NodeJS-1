var backend = require('./storage'),

    /**
     * Check if a variable contains a string
     * @param  {mixed}  obj variable
     * @return {Boolean}     true if it's a string
     */
    is_string = function(obj) {
        return typeof obj === 'string';
    },

    /**
     * Format and return error object
     * @param  {string} text error text
     * @return {object}      error object
     */
    error_handler = function(text) {
        return {
            'error': text
        };
    },
    handlers = {};

/**
 * Add a route handler
 * @param {string}   verb     http verb
 * @param {string}   path     path of request
 * @param {Function} callback request handler
 */
function addRoute(verb, path, callback) {
    handlers[verb][path] = callback;
}

/**
 * Handle a http request
 * @param  {string} verb http verb
 * @param  {string} path request path
 * @param  {array} args request parameters
 * @return {mixed}      request response
 */
function callRoute(verb, path, args) {
    var request_handler = handlers[verb][path];

    if (typeof request_handler === 'undefined') {
        return error_handler('Invalid request');
    }

    return request_handler(args);
}

/**
 * Add routes
 */

['GET', 'POST', 'DELETE', 'PUT'].forEach(function(verb) {
    handlers[verb] = {};
});

addRoute('GET', '/all_chirps', function(args) {
    var chirps = backend.get_all_chirps();
    return {
        'chirps': chirps
    };
});

addRoute('POST', '/chirp', function(args) {
    var storage = backend.login_user(args.key);
    if (is_string(storage)) {
        return error_handler(storage);
    }
    return {
        'chirp': storage.create_chirp(args.text)
    };
});

addRoute('POST', '/register', function(args) {
    var user = backend.create_user(args.user);
    if (is_string(user)) {
        return error_handler(user);
    }
    return {
        'user': user
    };
});

addRoute('GET', '/my_chirps', function(args) {
    var storage = backend.login_user(args.key);
    if (is_string(storage)) {
        return error_handler(storage);
    }
    return {
        'chirps': storage.get_user_chirps()
    };
});

addRoute('DELETE', '/chirp', function(args) {
    var storage = backend.login_user(args.key);
    if (is_string(storage)) {
        return error_handler(storage);
    }
    var chirp = storage.delete_chirp(parseInt(args.chirpId, 10));
    if (is_string(chirp)) {
        return error_handler(chirp);
    }
    return {
        'chirp': chirp
    };
});

module.exports = {
    route_request: function(method, url, args) {
        return callRoute(method, url, args);
    }
};