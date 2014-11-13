var chai = require('chai');
var expect = chai.expect;
var domain = require('../../../domain');
var Sitemap = domain.Sitemap;
var mongoose = domain.mongoose;
var request = require('supertest'),
    app = require('../../app'),
    apiCalls = require('../helpers/apiCalls')(app),
    generator = require('../helpers/itemGenerator');

var sitemaps = [];

function resetDatabase(done) {
    Sitemap.remove({}, function(err) {
        expect(err).to.not.exist;
        sitemaps = [0, 1].map(function() {
            var sitemap = generator.generateCreatedSitemap();
            sitemap['_id'] = mongoose.Types.ObjectId() + '';
            return sitemap;
        });

        Sitemap.create(sitemaps, function(err, sitemap1, sitemap2) {
            expect(err).to.not.exist;
            sitemaps[0]._id = sitemap1._id + '';
            sitemaps[1]._id = sitemap2._id + '';
            done();
        });
    });
}

describe('Sitemaps suite', function() {

    describe('server', function() {
        it('reset database should be working', function(done) {
            resetDatabase(done);
        });
    });


    describe('routes', function() {
        beforeEach(resetDatabase);

        describe('#create-sitemap', function() {
            it('should return the created sitemap', function(done) {
                var item = generator.generateSitemap();
                apiCalls.createItem(item, done)
                    .expect(201)
                    .expect(function(res) {
                        var body = res.body;
                        var createdItem = body.sitemap;
                        item._id = createdItem._id;
                        expect(body.error, 'error').to.not.exist;
                        expect(res.statusCode, 'Status code should be 201.').to.equal(201);
                        expect(body, 'body should contain a property "sitemap"').to.have.property('sitemap');
                        expect(createdItem, 'Result should contain the _id of the created sitemap').to.have.property('_id');
                        expect(createdItem, 'result should have a sitemap field').to.have.property('sitemap');
                        expect(createdItem, 'result should have a status field').to.have.property('status');
                        expect(createdItem.status, 'result status should be set').to.equal('currently crawling');
                        expect(createdItem.sitemap, 'result sitemap property should exist').to.deep.equal([]);
                    });
            });

            it('should not create an existing sitemap', function(done) {
                var item = generator.generateSitemap();
                apiCalls.createItem(item)
                    .expect(201)
                    .expect(function(res) {
                        var body = res.body;
                        var createdItem = body.sitemap;
                        
                        apiCalls.createItem(item, done)
                            .expect(201)
                            .expect(function(res) {
                                var body = res.body;

                                expect(body.sitemap._id, 'should just return other sitemap').to.equal(createdItem._id);
                                
                                Sitemap.find({}, function(err, maps){
                                    expect(maps.length, 'number of sitemaps in db').to.equal(3);
                                });
                            });
                    });
            });
        });

        describe('#get by id', function() {
            it('should return .sitemap containing the sitemap with the specified _id', function(done) {
                apiCalls.readById(sitemaps[0]._id, done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "sitemap"').to.have.property('sitemap');
                        expect(body.sitemap, 'sitemap property should be an Object.').to.be.an('Object');
                        var returnedItem = body.sitemap;
                        expect(returnedItem, 'Returned sitemap').to.deep.equal({
                            _id: returnedItem._id,
                            status: 'currently crawling',
                            sitemap: []
                        });
                    });
            });

            it('should return an error when getting non-existent sitemap', function(done) {
                apiCalls.readById('invalidId')
                    .expect(404)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.equal('Could not find sitemap');
                        done();
                    });
            });
        });

    });

});