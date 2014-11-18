var express = require("express"),
    app = express(),
    request = require('request'),
    url = require('url'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    debug = require('debug')('Proxy'),
    LinkTransformerStream = require('./LinkTransformerStream'),
    tough = require('tough-cookie'),
    Cookie = tough.Cookie;

app.use(cookieParser());
app.use(session({
    secret: '1234567890QWERTY'
}));

var cookiejar = new request.jar();

app.get('/proxy', function(req, res) {
    var query = url.parse(req.url, true).query;

    if (!query.url) {
        res.status(500).send('Url parameter is missing');
    }
    else {

        // make sure request uses express's cookies
        var requestStream = request({
            url: query.url,
            jar: cookiejar
        });

        var linkTransformerStream = new LinkTransformerStream('http://0.0.0.0:3000/proxy?url=');

        debug('CookieJar content: ', cookiejar);

        requestStream.on('response', function(response) {

            // save cookies sent from url
            if (response.headers &&
                response.headers.hasOwnProperty('set-cookie')) {

                var cookies = [];
                if (response.headers['set-cookie'] instanceof Array) {
                    cookies = response.headers['set-cookie'].map(function(c) {
                        return (Cookie.parse(c));
                    });
                } else {
                    cookies = [Cookie.parse(response.headers['set-cookie'])];
                }

                cookies.forEach(function(cookie) {
                    request.cookie(cookie.toString());
                });
            }

        });

        // pipe request through proxy
        requestStream
            .pipe(linkTransformerStream)
            .pipe(res);
    }
});

var server = app.listen(3000);

var host = server.address().address;
var port = server.address().port;
console.log('Server listening at http://%s:%s', host, port);