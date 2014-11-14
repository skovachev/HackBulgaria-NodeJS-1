var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    credentials = require('./credentials').twitter,
    User = require('../../models/User');

module.exports = function(passport) {
    passport.use(new TwitterStrategy({
            consumerKey: credentials['consumerKey'],
            consumerSecret: credentials['consumerSecret'],
            callbackURL: "http://linkedacc.dev:3000/auth/twitter/callback",
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            var twitterInfo = {
                'id': profile.id,
                'name': profile.displayName,
                'username': profile.username
            };
            User.createOrUpdateUser('twitter', profile.id, twitterInfo, req.user, done);
        }
    ));
};