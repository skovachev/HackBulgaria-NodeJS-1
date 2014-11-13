var passport = require('passport');

module.exports = function(app) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    app.use(passport.initialize());
    app.use(passport.session());

};