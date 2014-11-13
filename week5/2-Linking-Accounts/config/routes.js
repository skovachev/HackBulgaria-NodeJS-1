var passport = require('passport');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = function(app) {

    app.get('/', ensureAuthenticated, function(req, res) {
        res.render('home', {
            user: req.user,
            layout: 'layouts/index'
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            user: req.user,
            layout: 'layouts/index'
        });
    });

    // github routes
    app.get('/auth/github', passport.authenticate('github'));

    app.get('/auth/github/callback',
        passport.authenticate('github', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    // facebook routes
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    // twitter routes
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};