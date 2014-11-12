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

            var resultGroups = builder.addNewContact(contact);

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

            var resultGroups = builder.addNewContact(contact);

            expect(resultGroups.length, 'result groups array length').to.equal(2);
            expect(resultGroups[1].groupName, 'group 1 name').to.equal('Estefan');
            expect(resultGroups[1].contacts, 'group 1 contacts').to.deep.equal(['contactId']);

            expect(resultGroups[0].groupName, 'group 2 name').to.deep.equal(['Stefan', 'Estefan']);
            expect(resultGroups[0].contacts, 'group 2 contacts').to.deep.equal(['contactId', 'otherContact']);
            expect(resultGroups[0].type, 'group 2 type').to.equal('fuzzy');

            done();
        });
    });
});