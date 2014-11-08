var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ContactSchema = new Schema({
    phoneNumber: {type: String, required: true},
    personIdentifier: {type: String, required: true},
}, {
    collection: 'contacts'
});

var Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;