var expect = require('chai').expect;
var mongoose = require('mongoose');
var ContactGroup = require('../../models/ContactGroup');
var request = require('supertest'),
    app = require('../../app'),
    apiCalls = require('../helpers/apiCalls')(app, 'groups'),
    generator = require('../helpers/itemGenerator');

var groups = [];

function resetDatabase(done) {
    ContactGroup.remove({}, function(err) {
        expect(err).to.not.exist;
        groups = [0, 1].map(function(){
            var group = generator.generateContactGroup();
            group['_id'] = mongoose.Types.ObjectId() + '';
            return group;
        });

        ContactGroup.create(groups, function(err, group1, group2) {
            expect(err).to.not.exist;
            groups[0]._id = group1._id + '';
            groups[1]._id = group2._id + '';
            done();
        });
    });
}

describe('Groups suite', function() {

    describe('routes', function() {
        beforeEach(resetDatabase);

        describe('#get all', function() {
            it('should return an array .group property', function(done) {
                apiCalls.readAll(done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        expect(body, 'body should contain a property "group"').to.have.property('group');
                        expect(body.group, 'group property should be an Array.').to.be.an('Array');
                    });
            });

            it('should return an array containing all created groups', function(done) {
                apiCalls.readAll(done)
                    .expect(function(res) {
                        var body = res.body;
                        expect(body.error, 'error').to.not.exist;
                        var result = body.group;
                        expect(result.length, 'group array length').to.equal(2);
                        expect(result[0]._id, 'First result group').to.equal(groups[0]._id);
                        expect(result[1]._id, 'Second result group').to.equal(groups[1]._id);
                    });
            });
        });

    });
});