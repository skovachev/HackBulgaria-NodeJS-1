var express = require("express"),
    app = express(),
    request = require('request'),
    url = require('url'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

app.use(cookieParser());
app.use(session({
    secret: '1234567890QWERTY'
}));

app.get('/proxy', function(req, res) {
    var query = url.parse(req.url, true).query;
    if (!query.url) {
        res.status(500).send('Url parameter is missing');
    } else {
        // make sure request uses express's cookies
        var j = request.jar();
        var requestStream = request({
            url: query.url,
            jar: j
        });

        requestStream.on('response', function(response) {

            // save cookies sent from url
            if (response.headers &&
                response.headers.hasOwnProperty('set-cookie') &&
                Object.prototype.toString.apply(response.headers['set-cookie']) === '[object Array]') {
                // copy cookies to local request session
                response.headers['set-cookie'][0].split('; ').forEach(function(cookiePair) {
                    var separatorIndex = cookiePair.indexOf('=');
                    var key = cookiePair.substring(0, separatorIndex);
                    var value = cookiePair.substring(separatorIndex + 1);
                    res.cookie(key, value);
                });
            }

        });

        requestStream.pipe(res);
    }
});

var server = app.listen(3000);

var host = server.address().address;
var port = server.address().port;
console.log('Server listening at http://%s:%s', host, port);