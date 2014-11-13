var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    collection: 'users'
});

var User = mongoose.model('User', UserSchema);

User.prototype.validPassword = function(password) {
    return this.password === password;
};

module.exports = User;