var bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
    express = require("express"),
    partials = require('express-partials'),
    ejs = require('ejs');

module.exports = function(app) {

    app.use(partials());

    app.set('views', __dirname + './../views');

    app.use(express.static(__dirname + "/../public"));

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieSession({
        secret: 'secret'
    }));

    // pass user object to view
    app.use(function(req, res, next) {
        res.locals.user = req.user;
        res.locals.isAuthenticated = function() {
            return req.user;
        };

        next();
    });

    app.set('view engine', 'html');
    app.engine('html', ejs.renderFile);

};