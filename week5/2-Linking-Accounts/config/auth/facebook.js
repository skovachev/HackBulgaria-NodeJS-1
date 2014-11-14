var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    credentials = require('./credentials').facebook,
    User = require('../../models/User');

module.exports = function(passport) {
    passport.use(new FacebookStrategy({
            clientID: credentials['appId'],
            clientSecret: credentials['appSecret'],
            callbackURL: "http://linkedacc.dev:3000/auth/facebook/callback",
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            var facebookInfo = {
                'id': profile.id,
                'name': profile.name.givenName + ' ' + profile.name.familyName
            };
            User.createOrUpdateUser('facebook', profile.id, facebookInfo, req.user, done);
        }
    ));
};