var fs = require('fs');

function read(storage_file, key, def){
    var exists = fs.existsSync(storage_file);
    var data = exists ? fs.readFileSync(storage_file) : def;
    if (!data || !exists){
        return def;
    }
    var json = JSON.parse(data);
    var result = key ? json[key] : json;
    return result ? result : def;
}

function write(storage_file, key, data){
    var saved = read(storage_file);
    if (!saved) {
        saved = {};
    }
    saved[key] = data;
    fs.writeFileSync(storage_file, JSON.stringify(saved, 0, 4));
}

module.exports = function(file){
    return {
        write: function(key, data){
            return write(file, key, data);
        },
        read: function(key, def){
            return read(file, key, def);
        }
    };
};