var bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
    express = require("express");

module.exports = function(app) {

    app.use(express.static(__dirname + "/../public"));

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieSession({
        secret: 'secret'
    }));

};