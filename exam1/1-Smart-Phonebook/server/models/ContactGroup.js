var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('underscore');

function formatGroupWord(word) {
    word = word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function capitalizeAndGet(val) {
    if (!val) return val;
    if (_.isArray(val)) {
        return _.map(val, formatGroupWord);
    }
    else {
        return formatGroupWord(val);
    }
}

var ContactGroupSchema = new Schema({
    groupName: { type: Schema.Types.Mixed, required: true, get: capitalizeAndGet },
    contacts: {type: [String], required: true},
    type: String,
}, {
    collection: 'groups'
});

var ContactGroup = mongoose.model('ContactGroup', ContactGroupSchema);

module.exports = ContactGroup;