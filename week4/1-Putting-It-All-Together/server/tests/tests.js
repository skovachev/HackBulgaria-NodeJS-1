var chai = require('chai');
var expect = chai.expect;
var mongoose = require('mongoose');
var config = require('../config/database');
var Snippet = require('../models/Snippet');
var request = require('supertest');

var snippets = [];

function resetDatabase(done) {
    Snippet.remove({}, function(err) {
        expect(err).to.not.exist;
        snippets = [{
            _id: mongoose.Types.ObjectId() + '',
            filename: "testsnippet.js",
            creator: "skovachev",
            content: "alert('test')",
            language: "JavaScript"
        }, {
            _id: mongoose.Types.ObjectId() + '',
            filename: "testsnippet2.js",
            creator: "skovachev2",
            content: "alert('test 2 test')",
            language: "JavaScript"
        }];

        Snippet.create(snippets, function(err, snippet1, snippet2) {
            expect(err).to.not.exist;
            snippets[0]._id = snippet1._id + '';
            snippets[1]._id = snippet2._id + '';
            done();
        });
    });
}

var app = require('../app'),
    helpers = require('./helpers')(app);

describe('', function() {
    beforeEach(resetDatabase);

    describe('server', function() {

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

        it('reset database should be working', function(done) {
            resetDatabase(done);
        });
    });

    describe('routes', function() {
        // beforeEach(clearDatabase);

        describe('#create-snippet', function() {
            it('should return the created snippet', function(done) {
                var item = helpers.generateItem();
                helpers.createItem(item, done)
                    .expect(201)
                    .expect(function(res) {
                        var body = res.body;
                        var createdItem = body.snippet;
                        item._id = createdItem._id;
                        expect(body.error, 'error').to.not.exist;
                        expect(res.statusCode, 'Status code should be 201.').to.equal(201);
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(createdItem, 'Result should contain the _id of the created snippet').to.have.property('_id');
                        expect(createdItem, 'Result should be the created snippet with an added property "_id"').to.deep.equal(item);
                    });
            });

            it('should should detect language if not specified', function(done) {
                var item = helpers.generateItem();
                delete item['language'];

                helpers.createItem(item, done)
                    .expect(201)
                    .expect(function(res) {
                        var body = res.body;
                        var createdItem = body.snippet;
                        item._id = createdItem._id;
                        item['language'] = 'JavaScript';
                        expect(body.error, 'error').to.not.exist;
                        expect(res.statusCode, 'Status code should be 201.').to.equal(201);
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(createdItem, 'Result should contain the _id of the created snippet').to.have.property('_id');
                        expect(createdItem, 'Result should be the created snippet with an added property "_id"').to.deep.equal(item);
                    });
            });
        });

        describe('#get all', function() {
            it('should return an array .snippet property', function(done) {
                helpers.readAll(done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(body.snippet, 'snippet property should be an Array.').to.be.an('Array');
                    });
            });

            it('should return an array containing all created snippets', function(done) {
                helpers.readAll(done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        var result = body.snippet;
                        expect(result.length, 'snippet array length').to.equal(2);
                        expect(result[0]._id, 'First result snippet').to.equal(snippets[0]._id);
                        expect(result[1]._id, 'Second result snippet').to.equal(snippets[1]._id);
                    });
            });
        });

        describe('#get by id', function() {
            it('should return .snippet containing the snippet with the specified _id', function(done) {
                helpers.readById(snippets[0]._id, done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(body.snippet, 'snippet property should be an Object.').to.be.an('Object');
                        var returnedItem = body.snippet;
                        expect(returnedItem, 'Returned snippet').to.deep.equal(snippets[0]);
                    });
            });

            it('should return an error when getting non-existent snippet', function(done) {
                helpers.readById('4353sdgsdg')
                    .expect(404)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.equal('Could not find snippet');

                        helpers.readAll(done)
                            .expect(function(res) {
                                var result = res.body.snippet;
                                expect(result.length, 'database content should be intact').to.equal(2);
                            });
                    });
            });
        });

        describe('#get by creator', function() {
            it('should return .snippet containing snippets for the specified user', function(done) {
                helpers.readByCreator('skovachev', done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(body.snippet, 'snippet property should be an Array.').to.be.an('Array');
                        expect(body.snippet.length, 'only user\'s snippets').to.equal(1);
                        var returnedItems = body.snippet;
                        expect(returnedItems[0], 'Returned snippets').to.deep.equal(snippets[0]);
                    });
            });

            it('should return an empty array of not snippets exist for user', function(done) {
                helpers.readByCreator('non_existing_user', done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(body.snippet, 'snippet property should be an Array.').to.be.an('Array');
                        expect(body.snippet.length, 'only user\'s snippets').to.equal(0);
                    });
            });
        });

        describe('#update by id', function() {
            it('should return .snippet containing the updated snippet', function(done) {
                var updateItem = snippets[0];
                updateItem.filename = 'UpdatedFilename1.js';

                helpers.updateItem(updateItem._id, updateItem, done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(body.snippet, 'snippet property should be an Object.').to.be.an('Object');
                        var returnedItem = body.snippet;
                        expect(returnedItem, 'Returned snippet').to.deep.equal(updateItem);
                    });
            });

            it('should return an error when updating non-existant snippet', function(done) {
                var updateItem = snippets[0];
                updateItem.filename = 'UpdatedFilename1.js';

                helpers.updateItem('InvalidId', updateItem, done)
                    .expect(404)
                    .expect(function(res) {
                        expect(res.body.error, 'error').to.equal('Could not save snippet');
                    });
            });

            it('should should detect language if not specified', function(done) {
                var updateItem = snippets[0];
                updateItem.filename = 'UpdatedFilename1.php';
                delete updateItem.language;

                helpers.updateItem(updateItem._id, updateItem, done)
                    .expect(function(res) {
                        var body = res.body;
                        updateItem.language = 'PHP';
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(body.snippet, 'snippet property should be an Object.').to.be.an('Object');
                        var returnedItem = body.snippet;
                        expect(returnedItem, 'Returned snippet').to.deep.equal(updateItem);
                    })
            });;
        });

        describe('#delete by id', function() {
            it('should return the deleted snippet', function(done) {
                helpers.deleteItem(snippets[0]._id, done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "snippet"').to.have.property('snippet');
                        expect(body.snippet, 'snippet property should be an Object.').to.be.an('Object');
                        var returnedItem = body.snippet;
                        expect(returnedItem, 'Returned snippet').to.deep.equal(snippets[0]);
                    });
            });

            it('should return an error when deleting by an invalid id', function(done) {
                helpers.deleteItem('InvalidId')
                    .expect(404)
                    .expect(function(res) {
                        expect(res.body.error, 'error').to.equal('Could not find snippet');
                        helpers.readAll(done)
                            .expect(function(res) {
                                var result = res.body.snippet;
                                expect(result.length, 'Nothing was deleted').to.equal(2);
                            });
                    });
            });
        });
    });
});