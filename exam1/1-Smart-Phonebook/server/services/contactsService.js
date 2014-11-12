var Contact = require('../models/Contact'),
    GroupsService = require('./groupsService');

// TODO
// attach async event emitter: https://www.npmjs.org/package/async-eventemitter ??
// instead of callbacks

module.exports = {
    createContact: function(contactData, done) {
        var contact = new Contact(contactData);
        contact.save(function(err, contact){
            if (!err) {
                GroupsService.handleContactCreated(contact, function(){
                    done(err, contact);
                });
            }
            else {
                done(err);
            }
        });
    },

    updateContact: function(id, contactData, done) {
        Contact.findOne({
            _id: id
        }, function(err, contact){
            if (!err) {
                var before = new Contact(contact);

                Object.keys(contactData).forEach(function(key){
                    contact[key] = contactData[key];
                });

                contact.save(function(err, after) {
                    if (!err) {
                        GroupsService.handleContactUpdated(before, after, function(){
                            done(err, after);
                        });
                    }
                    else {
                        done(err);
                    }
                });
            }
            else {
                done(err);
            }
        });
    },

    deleteContact: function(id, done) {
        Contact.findByIdAndRemove(id, function(err, contact){
            if (!err) {
                GroupsService.handleContactDeleted(contact, function(){
                    done(err, contact);
                });
            }
            else {
                done(err);
            }
        });
    },

    listAllContacts: function(done) {
        Contact.find({}, done);
    },

    findContact: function(id, done) {
        Contact.findOne({
            _id: id
        }, done);
    }
};