var passport = require('passport'),
    flash = require('connect-flash');

module.exports = function(app) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    require('./auth/github')(passport);

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

};