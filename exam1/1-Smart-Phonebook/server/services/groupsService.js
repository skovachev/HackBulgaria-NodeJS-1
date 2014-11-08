var ContactGroup = require('../models/ContactGroup');

module.exports = {
    listAllGroups: function(done) {
        ContactGroup.find({}, done);
    }
};