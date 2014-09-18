'use strict';

var request = require('request');
var chai = require('chai');
var uuid = require('node-uuid');
var expect = chai.expect;
chai.should();
var Db = require('../Db');
var db;

describe('', function(){
    before(function(done){
        db = new Db('database');
        db.initialize(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });

    describe('server', function() {
        it('/status should be working', function(done) {
            request.get({
                url: Url('/status')
            }, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body).to.equal('Working!');
                done();
            })
        });

        it('/clear database should be working', function(done) {
            clearDatabase(done);
        });
    });

    describe('routes', function() {
        beforeEach(clearDatabase);

        describe('#create', function() {
            it('should return the created item', function(done){
                var item = generateItem();
                create(item, function(err, res, body){
                    var createdItem = body.Result;
                    item.id = createdItem.id;
                    expect(body.Error, 'Error').to.not.exist;
                    expect(res.statusCode, 'Status code should be 201.').to.equal(201);
                    expect(body, 'body should contain a property "Result"').to.have.property('Result');
                    expect(createdItem, 'Result should contain the id of the created item').to.have.property('id');
                    expect(createdItem, 'Result should be the created item with an added property "id"').to.deep.equal(item);
                    done();
                });
            });

            it('should not create an item if existing id is given', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem){
                    var secondItem = generateItem();
                    secondItem.id = createdItem.id;
                    create(secondItem, function(err, res, body){
                        expect(res.statusCode, 'Create item with existing id.').to.equal(400);
                        expect(body.Error, 'Error').to.contain('Item with the same id already exists');
                        done();
                    });
                });
            });
        });

        describe('#get all', function() {
            it('should return an array .Result property', function(done){
                read(function(err, res, body){
                    expect(body.Error, 'Error').to.not.exist;
                    expect(body, 'body should contain a property "Result"').to.have.property('Result');
                    expect(body.Result, 'Result property should be an Array.').to.be.an('Array');

                    done();
                });
            });

            it('should return an array containing all created items', function(done){
                var item = generateItem();
                clearDatabase(function() {
                    db.addItem(item, function(err, createdItem1){
                        item = generateItem();
                        db.addItem(item, function(err, createdItem2){
                            read(function(err, res, body) {
                                expect(body.Error, 'Error').to.not.exist;
                                var result = body.Result;
                                expect(result.length, 'Result array length').to.equal(2);
                                expect(result[0], 'First result array item').to.deep.equal(createdItem1);
                                expect(result[1], 'Second result array item').to.deep.equal(createdItem2);
                                done();
                            });
                        });
                    });
                })
            });
        });

        describe('#get by id', function() {
            it('should return .Result containing the item with the specified id', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem){
                    read(createdItem.id, function(err, res, body) {
                        expect(body.Error, 'Error').to.not.exist;
                        expect(body, 'body should contain a property "Result"').to.have.property('Result');
                        expect(body.Result, 'Result property should be an Object.').to.be.an('Object');
                        var returnedItem = body.Result;
                        expect(returnedItem, 'Returned item').to.deep.equal(createdItem);
                        done();
                    })
                });
            });

            it('should return an error when getting non-existent item', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem){
                    read('InvalidId', function(err, res, body) {
                        expect(res.statusCode, 'Read item by invalid id status code').to.equal(404);
                        expect(body.Error, 'Error').to.equal('Item not found');
                        db.readItems(function(err, data){
                            expect(data.length, 'Data length should be intact').to.equal(1);
                            expect(data[0], 'Data item should be intact').to.deep.equal(createdItem);
                            done();
                        });
                    })
                });
            });
        });

        describe('#update by id', function() {
            it('should return .Result containing the updated item', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem){
                    var updateItem = {
                        name: 'UpdatedName' + item.name
                    };
                    update(createdItem.id, updateItem, function(err, res, body) {
                        expect(body.Error, 'Error').to.not.exist;
                        expect(body, 'body should contain a property "Result"').to.have.property('Result');
                        expect(body.Result, 'Result property should be an Object.').to.be.an('Object');
                        var returnedItem = body.Result;
                        updateItem.id = createdItem.id;
                        expect(returnedItem, 'Returned item').to.deep.equal(updateItem);
                        done();
                    })
                });
            });

            it('should return an error when updating non-existant item', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem){
                    var updateItem = {
                        name: 'UpdatedName' + item.name
                    };
                    update('InvalidId', updateItem, function(err, res, body) {
                        expect(res.statusCode, 'Update item by invalid id status code').to.equal(404);
                        expect(body.Error, 'Error').to.equal('Item not found');
                        db.readItems(function(err, data){
                            expect(data.length, 'Data length should be intact').to.equal(1);
                            expect(data[0], 'Data item should be intact').to.deep.equal(createdItem);
                            done();
                        });
                    })
                });
            });
        });

        describe('#delete by id', function() {
            it('should return the deleted item', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem){
                    del(createdItem.id, function(err, res, body) {
                        expect(body.Error, 'Error').to.not.exist;
                        expect(body, 'body should contain a property "Result"').to.have.property('Result');
                        expect(body.Result, 'Result property should be an Object.').to.be.an('Object');
                        var returnedItem = body.Result;
                        expect(returnedItem, 'Returned item').to.deep.equal(createdItem);
                        done();
                    })
                });
            });

            it('should delete the requested item', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem1){
                    item = generateItem();
                    db.addItem(item, function(err, createdItem2){
                        del(createdItem1.id, function() {
                            db.readItems(function(err, items) {
                                expect(items.length, 'Result array length').to.equal(1);
                                expect(items[0], 'First result array item').to.deep.equal(createdItem2);
                                done();
                            })
                        })
                    });
                });
            });

            it('should return an error when deleting by an invalid id', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem){
                    del('InvalidId', function(err, res, body) {
                        expect(res.statusCode, 'Delete item by invalid id status code').to.equal(404);
                        expect(body.Error, 'Error').to.equal('Item not found');
                        db.readItems(function(err, items) {
                            expect(items[0], 'Item should be still in db').to.deep.equal(createdItem);
                            done();
                        })
                    })
                });
            });
        });

        describe('#delete all', function() {
            it('should return the deleted items count and delete all items', function(done){
                var item = generateItem();
                db.addItem(item, function(err, createdItem){
                    item = generateItem();
                    db.addItem(item, function(err, createdItem2){
                        item = generateItem();
                        db.addItem(item, function(err, createdItem3){
                            del(function(err, res, body) {
                                expect(body.Error, 'Error').to.not.exist;
                                expect(body, 'body should contain a property "Result"').to.have.property('Result');
                                expect(body.Result, 'Result property should be an Number.').to.be.an('Number');
                                var count = body.Result;
                                expect(count, 'Returned count').to.equal(3);
                                db.readItems(function(err, items) {
                                    expect(items.length, 'Data array length after delete').to.equal(0);
                                    done();
                                });
                            });
                        });
                    });
                });
            });

            it('should return 0 when deleting all in an empty database.', function(done){
                del(function(err, res, body) {
                    expect(body.Error, 'Error').to.not.exist;
                    expect(body, 'body should contain a property "Result"').to.have.property('Result');
                    expect(body.Result, 'Result property should be an Number.').to.be.an('Number');
                    var count = body.Result;
                    expect(count, 'Returned count').to.deep.equal(0);
                    db.readItems(function(err, items) {
                        expect(items.length, 'Result array length').to.equal(0);
                        done();
                    })
                });
            });
        });
    });
});

function Url(path) {
    path = path || '';
    return 'http://localhost:3000' + path;
}

function create(item, done) {
    request.post({
        url: Url('/db'),
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    }, done)
}

function read(id, done) {
    if (!done) {
        done = id;
        id = null;
    }
    var path = '/db';
    path += id ? "/" + id : "";
    request.get({
        url: Url(path),
        json: true
    }, done);
}

function update(id, item, done) {
    var path = '/db/' + id;
    request.post({
        url: Url(path),
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    }, done);
}


function clearDatabase(done) {
    request.del({
        url: Url('/db/clear')
    }, function (err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.Error, 'Error').to.not.exist;
        expect(body).to.equal('Database cleared!');
        done();
    })
}

function del(id, done) {
    if (!done) {
        done = id;
        id = null;
    }
    var path = '/db';
    path += id ? "/" + id : "";
    request.del({
        url: Url(path),
        json: true
    }, done);
}

function generateItem() {
    return {
        name: 'Test' + uuid.v1()
    };
}
