var Contact = require('../models/Contact');

module.exports = {
    createContact: function(contactData, done) {
        var contact = new Contact(contactData);
        contact.save(done);
    },

    updateContact: function(id, contactData, done) {
        Contact.findOneAndUpdate({
            _id: id
        }, contactData, done);
    },

    deleteContact: function(id, done) {
        Contact.findByIdAndRemove(id, done);
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