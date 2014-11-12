var ContactGroup = require('../models/ContactGroup'),
    GroupBuilder = require('./groupBuilder'),
    async = require('async');

module.exports = {
    listAllGroups: function(done) {
        ContactGroup.find({}, done);
    },

    handleContactCreated: function(contact, done) {
        // add contact to groups and create new groups if necessary
        ContactGroup.find({}, function(err, groups){
            if (err) done(err);

            var builder = new GroupBuilder(groups);
            var groupsToUpdate = builder.addNewContact(contact);
            var callbacks = groupsToUpdate.map(function(group){
                return function(callback){
                    var where = {groupName: group.groupName};
                    ContactGroup.findOne(where, function(err, g) {
                        if(!err) {
                            if(!g) {
                                g = new ContactGroup();
                            }
                            Object.keys(group).forEach(function(key){
                                g[key] = group[key];
                            });
                            g.save(function(err) {
                                if(!err) {
                                    callback(null, g);
                                }
                                else {
                                    callback(err, null);
                                }
                            });
                        }
                    });
                };
            });

            async.parallel(callbacks, done);
        });
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