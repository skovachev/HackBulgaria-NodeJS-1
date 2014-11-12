var request = require('supertest'),
    app = require('../../app');

describe('Server', function() {
    it('server should be online', function(done) {
        request(app)
            .get('/status')
            .expect(200)
            .expect('Working!')
            .end(function(err, res) {
                if (err) throw err;
                done();
            });
    });
});