var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());

app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
    res.header("Access-Control-Allow-Methods", ["GET", "POST"]);
    next();
});

require('./routes')(app);

var server = app.listen(1337, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Geo server listening at http://%s:%s', host, port);

});