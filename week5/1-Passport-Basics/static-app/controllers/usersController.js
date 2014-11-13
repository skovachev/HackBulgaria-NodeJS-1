var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User'),
    debug = require('debug')('UsersController');

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                debug('Could not login user: %s', err);
                return done(err);
            }
            if (!user) {
                debug('Incorrect username: %s', username);
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (!user.validPassword(password)) {
                debug('Incorrect password: %s', password);
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            debug('Logged in: ', user);
            return done(null, user);
        });
    }
));

function registerUser(req, res) {
    var username = req.body.username,
        password = req.body.password;

    var user = new User({
        username: username,
        password: password
    });

    user.save(function(err, user){
        if (err) {
            debug('Could not save user: %s', err);
            res.status(500).redirect('/error.html');
        }
        else {
            debug('User registered: ', user);
            res.redirect('/register_success.html');
        }
    });
}

module.exports = {
    loginUser: passport.authenticate('local', {
        successRedirect: '/success.html',
        failureRedirect: '/failure.html',
        failureFlash: false
    }),

    registerUser: registerUser
};