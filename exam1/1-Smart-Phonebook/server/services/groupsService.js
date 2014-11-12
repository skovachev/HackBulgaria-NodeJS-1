var ContactGroup = require('../models/ContactGroup'),
    GroupBuilder = require('./groupBuilder'),
    debug = require('debug')('GroupsService'),
    async = require('async');

function determineNewGroups(done, builderCallback) {
    ContactGroup.find({}, function(err, groups){
        if (err) done(err);

        var builder = new GroupBuilder(groups);
        var groupResponse = builderCallback(builder);

        debug('get groups response', groupResponse);

        var groupsToUpdate = groupResponse.update;
        var groupsToRemove = groupResponse.remove;

        debug('groups to update', groupsToUpdate.length);

        // update groups
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

        var removeGroupsWithIds = groupsToRemove.map(function(group){
            return group._id;
        });

        debug('groups to remove', removeGroupsWithIds.length);

        if (removeGroupsWithIds.length > 0) {
            callbacks.push(function(callback){
                ContactGroup.remove({'_id': {$in: removeGroupsWithIds}}, function(err, numberRemoved) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        debug('groups removed: %d', numberRemoved);
                        callback(null, numberRemoved);
                    }
                });
            });
        }

        async.parallel(callbacks, done);
    });
}

module.exports = {
    listAllGroups: function(done) {
        ContactGroup.find({}, done);
    },

    handleContactCreated: function(contact, done) {
        // add contact to groups and create new groups if necessary
        determineNewGroups(done, function(builder){
            return builder.addNewContact(contact);
        });
    },

    handleContactUpdated: function(before, after, done) {
        // update groups based on changes in contact name
        done();
    },

    handleContactDeleted: function(contact, done) {
        // update / delete groups based on deleted contact information
        determineNewGroups(done, function(builder){
            return builder.removeContact(contact);
        });
    }
};