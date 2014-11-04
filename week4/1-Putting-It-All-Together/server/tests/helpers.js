var request = require('request');

function create(item, done) {
    request.post({
        url: requestUrl('/create-snippet'),
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    }, done);
}

function readAll(done) {
    var path = '/list';
    request.get({
        url: requestUrl(path),
        json: true
    }, done);
}

function readByCreator(username, done) {
    var path = '/list-by-creator';
    path += "/" + username;
    request.get({
        url: requestUrl(path),
        json: true
    }, done);
}

function readById(id, done) {
    var path = '/list';
    path += "/" + id;
    request.get({
        url: requestUrl(path),
        json: true
    }, done);
}

function update(id, item, done) {
    var path = '/update-snippet/' + id;
    request.put({
        url: requestUrl(path),
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    }, done);
}

function del(id, done) {
    var path = '/delete-snippet';
    path += "/" + id;
    request.del({
        url: requestUrl(path),
        json: true
    }, done);
}

function requestUrl(path) {
    return 'http://localhost:1337' + path;
}

var generateItemCounter = 0;

function generateItem() {
    generateItemCounter++;
    return {
        filename: 'Test' + generateItemCounter + '.js',
        content: 'alert("Alert test ' + generateItemCounter + '")',
        creator: "skovachev",
        language: "JavaScript"
    };
}

module.exports = {
    generateItem: generateItem,
    deleteItem: del,
    createItem: create,
    updateItem: update,
    readAll: readAll,
    readById: readById,
    readByCreator: readByCreator,
    requestUrl: requestUrl
};