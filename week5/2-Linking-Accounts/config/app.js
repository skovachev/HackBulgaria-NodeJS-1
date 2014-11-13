var bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
    express = require("express"),
    partials = require('express-partials'),
    ejs = require('ejs');

module.exports = function(app) {

    app.use(partials());

    app.set('views', __dirname + './../views');

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.set('view engine', 'html');
    app.engine('html', ejs.renderFile);

};