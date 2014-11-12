var expect = require('chai').expect,
    GroupBuilder = require('../../services/groupBuilder');


describe('GroupBuilder', function() {

    describe('compareGroupName', function() {
        it('should compare group names correctly', function(done) {
            var builder = new GroupBuilder();

            expect(builder.compareGroupName('Stefan', 'Kovachev')).to.equal(-1);
            expect(builder.compareGroupName('Kovachev', 'Kovachev')).to.equal(0);
            expect(builder.compareGroupName('Kovachev', 'Stefan')).to.equal(1);

            done();
        });
    });

    describe('addNewContact', function() {

        it('should create new groups from contact name', function(done) {
            var groups = [{
                'groupName': 'Stefan',
                'contacts': [
                    'otherContact'
                ]
            }];
            var builder = new GroupBuilder(groups);
            var contact = {
                'personIdentifier': 'Stefan Kovachev mladost',
                'phoneNumber': '1341251253',
                '_id': 'contactId'
            };

            var resultGroups = builder.addNewContact(contact).update;

            expect(resultGroups.length, 'result groups array length').to.equal(3);
            expect(resultGroups[0].groupName, 'group 3 name').to.equal('Stefan');
            expect(resultGroups[0].contacts, 'group 3 contacts').to.deep.equal(['contactId', 'otherContact']);
            expect(resultGroups[2].groupName, 'group 1 name').to.equal('Kovachev');
            expect(resultGroups[2].contacts, 'group 1 contacts').to.deep.equal(['contactId']);
            expect(resultGroups[1].groupName, 'group 2 name').to.equal('Mladost');
            expect(resultGroups[1].contacts, 'group 2 contacts').to.deep.equal(['contactId']);

            done();
        });

        it('should create fuzzy group from contact name', function(done) {
            var groups = [{
                'groupName': 'Stefan',
                'contacts': [
                    'otherContact'
                ]
            }];
            var builder = new GroupBuilder(groups);
            var contact = {
                'personIdentifier': 'Estefan',
                'phoneNumber': '1341251253',
                '_id': 'contactId'
            };

            var resultGroups = builder.addNewContact(contact).update;

            expect(resultGroups.length, 'result groups array length').to.equal(2);
            expect(resultGroups[1].groupName, 'group 1 name').to.equal('Estefan');
            expect(resultGroups[1].contacts, 'group 1 contacts').to.deep.equal(['contactId']);

            expect(resultGroups[0].groupName, 'group 2 name').to.deep.equal(['Stefan', 'Estefan']);
            expect(resultGroups[0].contacts, 'group 2 contacts').to.deep.equal(['contactId', 'otherContact']);
            expect(resultGroups[0].type, 'group 2 type').to.equal('fuzzy');

            done();
        });

    });

    describe('removeContact', function() {

        it('should remove contact from groups', function(done) {
            var groups = [{
                'groupName': 'Stefan',
                'contacts': [
                    'contactId', 'testContact'
                ]
            }];
            var builder = new GroupBuilder(groups);
            var contact = {
                'personIdentifier': 'Stefan Kovachev mladost',
                'phoneNumber': '1341251253',
                '_id': 'contactId'
            };

            var resultGroups = builder.removeContact(contact).update;

            expect(resultGroups.length, 'result groups array length').to.equal(1);
            expect(resultGroups[0].contacts, 'group 1 contacts').to.deep.equal(['testContact']);

            done();
        });

        it('should remove group if empty', function(done) {
            var groups = [{
                'groupName': 'Stefan',
                'contacts': [
                    'contactId'
                ]
            }];
            var builder = new GroupBuilder(groups);
            var contact = {
                'personIdentifier': 'Stefan Kovachev mladost',
                'phoneNumber': '1341251253',
                '_id': 'contactId'
            };

            var resultGroups = builder.removeContact(contact);

            expect(resultGroups.update.length, 'result updated groups array length').to.equal(0);
            expect(resultGroups.remove.length, 'result removed groups array length').to.equal(1);
            expect(resultGroups.remove[0].groupName, 'group name').to.equal('Stefan');

            done();
        });

        it('should remove contact from fuzzy group', function(done) {
            var groups = [{
                'groupName': ['Stefan', 'Peter'],
                'type': 'fuzzy',
                'contacts': [
                    'contactId', 'testContact'
                ]
            }];
            var builder = new GroupBuilder(groups);
            var contact = {
                'personIdentifier': 'Stefan Kovachev mladost',
                'phoneNumber': '1341251253',
                '_id': 'contactId'
            };

            var resultGroups = builder.removeContact(contact).update;

            expect(resultGroups.length, 'result groups array length').to.equal(1);
            expect(resultGroups[0].contacts, 'group 1 contacts').to.deep.equal(['testContact']);

            done();
        });

    });

    describe('updateContact', function() {

        it('should create new groups when contact updated', function(done) {
            var groups = [{
                'groupName': 'Stefan',
                'contacts': [
                    'contactId', 'testContact'
                ]
            }, {
                'groupName': 'Mldost',
                'contacts': [
                    'contactId'
                ]
            }, {
                'groupName': 'Kovachev',
                'contacts': [
                    'contactId', 'testContact'
                ]
            }];
            var builder = new GroupBuilder(groups);
            var before = {
                'personIdentifier': 'Stefan Kovachev mldost',
                'phoneNumber': '1341251253',
                '_id': 'contactId'
            };

            var after = {
                'personIdentifier': 'Stefan Mladost',
                'phoneNumber': '1341251253',
                '_id': 'contactId'
            };

            // should remove group mldost
            // should create group mladost
            // should remove id from Kovachev group

            var resultGroups = builder.updateContact(before, after);

            console.log(resultGroups.update);

            expect(resultGroups.update.length, 'result update groups array length').to.equal(2);
            expect(resultGroups.update[0].groupName, 'updated group 1 name').to.equal('Kovachev');
            expect(resultGroups.update[0].contacts, 'updated group 1 contacts').to.deep.equal(['testContact']);
            expect(resultGroups.update[1].groupName, 'added group 1 name').to.equal('Mladost');
            expect(resultGroups.update[1].contacts, 'added group 1 contacts').to.deep.equal(['contactId']);

            expect(resultGroups.remove.length, 'result update groups array length').to.equal(1);
            expect(resultGroups.remove[0].groupName, 'removed group 1 name').to.equal('Mldost');

            done();
        });

    });
});