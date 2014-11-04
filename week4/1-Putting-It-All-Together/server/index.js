var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());

require('./config/routes')(app);

var server = app.listen(1337, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Snippet server listening at http://%s:%s', host, port);

});