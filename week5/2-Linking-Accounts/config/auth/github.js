var GitHubStrategy = require('passport-github').Strategy,
    credentials = require('./credentials').github,
    User = require('../../models/User');

module.exports = function(passport) {
    passport.use(new GitHubStrategy({
            clientID: credentials['clientId'],
            clientSecret: credentials['clientSecret'],
            callbackURL: "http://linkedacc.dev:3000/auth/github/callback",
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                var githubInfo = {
                    'id': profile.id,
                    'name': profile.displayName,
                    'username': profile.username
                };
                User.createOrUpdateUser('github', profile.id, githubInfo, req.user, done);
            });
        }
    ));
};