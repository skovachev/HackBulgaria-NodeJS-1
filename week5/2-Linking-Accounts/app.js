var express = require("express"),
    app = express(),
    config = require('./config/database'),
    mongoose = require('mongoose');

mongoose.connect(config.url);

require('./config/app')(app);
require('./config/passport')(app);
require('./config/routes')(app);

var server = app.listen(3000);

var host = server.address().address;
var port = server.address().port;
console.log('Server listening at http://%s:%s', host, port);

