var GitHubStrategy = require('passport-github').Strategy,
    credentials = require('./credentials').github,
    User = require('../../models/User');

module.exports = function(passport) {
    passport.use(new GitHubStrategy({
            clientID: credentials['clientId'],
            clientSecret: credentials['clientSecret'],
            callbackURL: "http://127.0.0.1:3000/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function(){
                User.findOrCreate({
                    githubId: profile.id
                }, function(err, user) {
                    return done(err, user);
                });
            });
        }
    ));
};