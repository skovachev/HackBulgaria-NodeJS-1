var request = require('supertest'),
    app = null;

function create(item, done) {
    return request(app)
        .post('/create-snippet')
        .send(item)
        .set('Accept', 'application/json')
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
}

function errorHandler(err, res, done) {
    if (err) throw err;
    if (done) {
        done();
    }
}

function readAll(done) {
    return request(app)
        .get('/list')
        .set('Accept', 'application/json')
        .end(function(err, res) {
            errorHandler(err, res, done);
        });
}

function readByCreator(username, done) {
    return request(app)
        .get('/list-by-creator/' + username)
        .set('Accept', 'application/json')
        .end(function(err, res) {
            errorHandler(err, res, done);
        });
}

function readById(id, done) {
    return request(app)
        .get('/list/' + id)
        .set('Accept', 'application/json')
        .end(function(err, res) {
            errorHandler(err, res, done);
        });
}

function update(id, item, done) {
    return request(app)
        .put('/update-snippet/' + id)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(item)
        .end(function(err, res) {
            errorHandler(err, res, done);
        });
}

function del(id, done) {
    return request(app)
        .delete('/delete-snippet/' + id)
        .set('Accept', 'application/json')
        .end(function(err, res) {
            errorHandler(err, res, done);
        });
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

module.exports = function(expressApp) {
    app = expressApp;

    return {
        generateItem: generateItem,
        deleteItem: del,
        createItem: create,
        updateItem: update,
        readAll: readAll,
        readById: readById,
        readByCreator: readByCreator,
    };
};