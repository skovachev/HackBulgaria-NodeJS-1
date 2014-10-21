var express = require('express'),
    config = require('./config'),
    globalscraper = require('./globalscraper')(config),
    app = express(),
    url = require('url');

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", ["X-Requested-With", "Content-Type", "Access-Control-Allow-Methods"]);
  res.header("Access-Control-Allow-Methods", ["GET"]);
  next();
});

app.get('/keywords', function(req, res) {
    var queryData = url.parse(req.url, true).query;
    globalscraper.showRankedResults(function(results){
        // rank, keyword, count
        res.json(results);
    }, queryData.fromPosition || 0, queryData.direction || 'next');
});

var server = app.listen(config.apiPort, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Global scraper API listening at http://%s:%s', host, port);

});