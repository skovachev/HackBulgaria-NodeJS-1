var passport = require('passport');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = function(app) {

    app.get('/', ensureAuthenticated, function(req, res) {
        res.render('home', {
            user: req.user,
            layout: 'layouts/index',
            title: 'Home'
        });
    });

    app.get('/login', ensureNotAuthenticated, function(req, res) {
        res.render('login', {
            user: req.user,
            layout: 'layouts/index',
            title: 'Sign in'
        });
    });

    // github routes
    app.get('/auth/github', passport.authenticate('github'));

    app.get('/auth/github/callback',
        passport.authenticate('github', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.locals.user = req.user;
            res.redirect('/');
        });

    // facebook routes
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.locals.user = req.user;
            res.redirect('/');
        });


    // twitter routes
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.locals.user = req.user;
            res.redirect('/');
        });


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};