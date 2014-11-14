var passport = require('passport');

module.exports = function(app) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    require('./auth/github')(passport);
    require('./auth/facebook')(passport);
    require('./auth/twitter')(passport);

    app.use(passport.initialize());
    app.use(passport.session());

};