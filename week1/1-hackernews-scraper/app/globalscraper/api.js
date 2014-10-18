var express = require('express'),
    config = require('./config'),
    globalscraper = require('./globalscraper')(config),
    app = express();

app.get('/keywords', function(req, res) {
    var results = globalscraper.showResults();
    res.json(results);
});

var server = app.listen(config.apiPort, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Global scraper API listening at http://%s:%s', host, port);

});