var chai = require('chai');
var expect = chai.expect;
var mongoose = require('mongoose');
var config = require('../../config/database');
var Contact = require('../../models/Contact');
var request = require('supertest'),
    app = require('../../app'),
    apiCalls = require('../helpers/apiCalls')(app, 'contacts'),
    generator = require('../helpers/itemGenerator');

var contacts = [];

function resetDatabase(done) {
    Contact.remove({}, function(err) {
        expect(err).to.not.exist;
        contacts = [0, 1].map(function(){
            var contact = generator.generateContact();
            contact['_id'] = mongoose.Types.ObjectId() + '';
            return contact;
        });

        Contact.create(contacts, function(err, contact1, contact2) {
            expect(err).to.not.exist;
            contacts[0]._id = contact1._id + '';
            contacts[1]._id = contact2._id + '';
            done();
        });
    });
}

describe('Contacts suite', function() {

    describe('server', function() {
        it('reset database should be working', function(done) {
            resetDatabase(done);
        });
    });


    describe('routes', function() {
        beforeEach(resetDatabase);

        describe('#create-contact', function() {
            it('should return the created contact', function(done) {
                var item = generator.generateContact();
                apiCalls.createItem(item, done)
                    .expect(201)
                    .expect(function(res) {
                        var body = res.body;
                        var createdItem = body.contact;
                        item._id = createdItem._id;
                        expect(body.error, 'error').to.not.exist;
                        expect(res.statusCode, 'Status code should be 201.').to.equal(201);
                        expect(body, 'body should contain a property "contact"').to.have.property('contact');
                        expect(createdItem, 'Result should contain the _id of the created contact').to.have.property('_id');
                        expect(createdItem, 'Result should be the created contact with an added property "_id"').to.deep.equal(item);
                    });
            });
        });

        describe('#get all', function() {
            it('should return an array .contact property', function(done) {
                apiCalls.readAll(done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "contact"').to.have.property('contact');
                        expect(body.contact, 'contact property should be an Array.').to.be.an('Array');
                    });
            });

            it('should return an array containing all created contacts', function(done) {
                apiCalls.readAll(done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        var result = body.contact;
                        expect(result.length, 'contact array length').to.equal(2);
                        expect(result[0]._id, 'First result contact').to.equal(contacts[0]._id);
                        expect(result[1]._id, 'Second result contact').to.equal(contacts[1]._id);
                    });
            });
        });

        describe('#get by id', function() {
            it('should return .contact containing the contact with the specified _id', function(done) {
                apiCalls.readById(contacts[0]._id, done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "contact"').to.have.property('contact');
                        expect(body.contact, 'contact property should be an Object.').to.be.an('Object');
                        var returnedItem = body.contact;
                        expect(returnedItem, 'Returned contact').to.deep.equal(contacts[0]);
                    });
            });

            it('should return an error when getting non-existent contact', function(done) {
                apiCalls.readById('4353sdgsdg')
                    .expect(404)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.equal('Could not find contact');

                        apiCalls.readAll(done)
                            .expect(function(res) {
                                var result = res.body.contact;
                                expect(result.length, 'database content should be intact').to.equal(2);
                            });
                    });
            });
        });

        describe('#update by id', function() {
            it('should return .contact containing the updated contact', function(done) {
                var updateItem = contacts[0];
                updateItem.personIdentifier = 'John Doe';

                apiCalls.updateItem(updateItem._id, updateItem, done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "contact"').to.have.property('contact');
                        expect(body.contact, 'contact property should be an Object.').to.be.an('Object');
                        var returnedItem = body.contact;
                        expect(returnedItem, 'Returned contact').to.deep.equal(updateItem);
                    });
            });

            it('should return an error when updating non-existant contact', function(done) {
                var updateItem = contacts[0];
                updateItem.personIdentifier = 'John Doe';

                apiCalls.updateItem('InvalidId', updateItem, done)
                    .expect(404)
                    .expect(function(res) {
                        expect(res.body.error, 'error').to.equal('Could not save contact');
                    });
            });
        });

        describe('#delete by id', function() {
            it('should return the deleted contact', function(done) {
                apiCalls.deleteItem(contacts[0]._id, done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "contact"').to.have.property('contact');
                        expect(body.contact, 'contact property should be an Object.').to.be.an('Object');
                        var returnedItem = body.contact;
                        expect(returnedItem, 'Returned contact').to.deep.equal(contacts[0]);
                    });
            });

            it('should return an error when deleting by an invalid id', function(done) {
                apiCalls.deleteItem('InvalidId')
                    .expect(404)
                    .expect(function(res) {
                        expect(res.body.error, 'error').to.equal('Could not find contact');
                        apiCalls.readAll(done)
                            .expect(function(res) {
                                var result = res.body.contact;
                                expect(result.length, 'Nothing was deleted').to.equal(2);
                            });
                    });
            });
        });
    });
});