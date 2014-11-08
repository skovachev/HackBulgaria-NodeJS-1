var app = require('./app');

var server = app.listen(1337, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);

});