var fs = require('fs'),
    _ = require('underscore');

function read(storage_file, key, def) {
    var exists = fs.existsSync(storage_file);
    var data = exists ? fs.readFileSync(storage_file) : def;
    if (!data || !exists) {
        return def;
    }
    var json = JSON.parse(data);
    var result = key ? json[key] : json;
    return result ? result : def;
}

function write(storage_file, key, data) {
    var saved = read(storage_file);
    if (!saved) {
        saved = {};
    }
    saved[key] = data;
    fs.writeFileSync(storage_file, JSON.stringify(saved, 0, 4));
}

function findIn(file, keys, callback, def) {
    var totalKeys = keys.length,
        found = null;

    for (var i = 0; i < totalKeys; i++) {
        var key = keys[i];
        var items = read(file, key, []);

        found = _.find(items, callback);

        if (found) {
            break;
        }
    }

    return found ? found : def;
}

module.exports = function(file) {
    return {
        write: function(key, data) {
            return write(file, key, data);
        },
        read: function(key, def) {
            return read(file, key, def);
        },

        findIn: function(keys, callback, def) {
            return findIn(file, keys, callback, def);
        }
    };
};