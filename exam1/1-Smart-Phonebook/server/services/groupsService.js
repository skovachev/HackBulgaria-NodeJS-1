var ContactGroup = require('../models/ContactGroup');

module.exports = {
    listAllGroups: function(done) {
        ContactGroup.find({}, done);
    },

    handleContactCreated: function(contact, done) {
        // add contact to groups and create new groups if necessary
        done();
    },

    handleContactUpdated: function(before, after, done) {
        // update groups based on changes in contact name
        done();
    },

    handleContactDeleted: function(contact, done) {
        // update / delete groups based on deleted contact information
        done();
    }
};