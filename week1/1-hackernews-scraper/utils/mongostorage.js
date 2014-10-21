var _ = require('underscore'),
    pmongo = require('promised-mongo'),
    db = null;

function read(collection, key) {
    return db[collection].findOne({key: key});
}

function write(collection, key, data) {
    return db[collection].findAndModify({
        query: { key: key },
        update: { $set: { value: data } },
        new: true
    });
}

function findInKeys(collection, keys, index, done) {
    var found = false,
        readPromise = read(collection, keys[index]).then(function(result){
            if (result && !found) {
                found = true;
                done(result);
            }
            else {
                if (index < keys.length) {
                    findInKey(collection, keys, index + 1, done);
                }
            }
        });
}

function findIn(collection, keys, callback, done, def) {
    findInKeys(collection, keys, 0, function(result){
        done(result ? result : def);
    });
}

function writeMany(collection, keys, items, done) {
    return db[collection].remove({key: {$in: keys}}).then(function(){
        db[collection].insert(items).then(done);
    });
}

module.exports = function(collection) {
    var mongoConnectionUrl = "mongodb://localhost:27017/nodejs-week2";

    db = pmongo(mongoConnectionUrl, [collection]);

    return {
        write: function(key, data, done) {
            console.log('write');
            return write(collection, key, data, done).then(function(result){
                done(result);
            });
        },
        read: function(key, done, def) {
            return read(collection, key, done, def).then(function(result){
                done(result ? result : def);
            });
        },

        findIn: function(keys, callback, def) {
            return findIn(collection, keys, callback, def);
        },

        readAll: function(done, from, direction) {
            return db[collection].find().toArray().then(function(results){
                done(results);
            });
        },

        writeMany: function(keys, items, done) {
            return writeMany(collection, keys, items, done);
        },

        readMany: function(keys, done) {
            return db[collection].find({key: {$in: keys}}).toArray().then(function(result){
                done(result);
            });
        },

        readRankedByCount: function(done, from, direction) {
            db[collection].find().sort({value: -1}).skip(from).limit(10).toArray().then(function(result){
                done(result);
            });
        }
    };
};