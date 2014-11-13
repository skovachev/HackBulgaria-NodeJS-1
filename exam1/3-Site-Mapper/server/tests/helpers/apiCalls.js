var request = require('supertest');

module.exports = function(app) {

    function create(item, done) {
        return request(app)
            .post('/map')
            .send(item)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
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

    function readById(id, done) {
        return request(app)
            .get('/sitemap')
            .send({
                id: id
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                errorHandler(err, res, done);
            });
    }

    return {
        createItem: create,
        readById: readById,
    };
};