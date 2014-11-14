var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    github: Schema.Types.Mixed,
    facebook: Schema.Types.Mixed,
    twitter: Schema.Types.Mixed
}, {
    collection: 'users'
});

var User = mongoose.model('User', UserSchema);

function createOrUpdateUser(err, user, key, data, done) {
    if (!err) {
        if (!user) {
            user = new User();
        }
        user[key] = data;
        return user.save(done);
    }
    return done(err, user);
}

User.createOrUpdateUser = function(key, social_id, social_data, currentUser, done) {
    if (currentUser) {
        User.findOne({
            '_id': currentUser._id
        }, function(err, user) {
            createOrUpdateUser(err, user, key, social_data, done);
        });
    } else {
        var where = {};
        where[key + '.id'] = social_id;
        User.findOne(where, function(err, user) {
            createOrUpdateUser(err, user, key, social_data, done);
        });
    }
};

module.exports = User;