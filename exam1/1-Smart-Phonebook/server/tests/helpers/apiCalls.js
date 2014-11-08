var request = require('supertest');

module.exports = function(app, base_url) {

    function create(item, done) {
        return request(app)
            .post('/' + base_url + '/create')
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
            .get('/' + base_url + '/list')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                errorHandler(err, res, done);
            });
    }

    function readById(id, done) {
        return request(app)
            .get('/' + base_url + '/' + id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                errorHandler(err, res, done);
            });
    }

    function update(id, item, done) {
        return request(app)
            .put('/' + base_url + '/update/' + id)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(item)
            .end(function(err, res) {
                errorHandler(err, res, done);
            });
    }

    function del(id, done) {
        return request(app)
            .delete('/' + base_url + '/delete/' + id)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                errorHandler(err, res, done);
            });
    }

    return {
        deleteItem: del,
        createItem: create,
        updateItem: update,
        readAll: readAll,
        readById: readById,
    };
};