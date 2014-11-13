var express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config/database'),
    mongoose = require('mongoose'),
    app = express();

mongoose.connect(config.url);

app.use(bodyParser.json());

require('./config/routes')(app);

module.exports = app;