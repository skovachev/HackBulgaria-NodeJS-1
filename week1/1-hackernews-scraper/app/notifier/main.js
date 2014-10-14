var express = require('express'),
    config = require('../config').notifier,
    notifier = require('./notifier')(config),
    app = express();


app.post('/newArticles', function (req, res) {
    notifier.notifySubscribers(function(){
        res.send('Notifications sent!');
    });
});

var server = app.listen(config.port, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Notifier listening at http://%s:%s', host, port);

});