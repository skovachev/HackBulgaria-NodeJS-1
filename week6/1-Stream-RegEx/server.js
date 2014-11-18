var http = require("http"),
    RegexStream = require('./RegexStream'),
    port = 3000,
    url = require('url');

http.createServer(function(req, res) {

    var stream = new RegexStream();

    // parse regex from query
    var args = url.parse(req.url, true).query;
    if (args.regex) {
        // create regex object
        var regex = new RegExp(args.regex);
        console.log(typeof regex);
        stream.setRegex(regex);
    }

    // pipe input through regex stream
    req.pipe(stream).pipe(res);

}).listen(port);

console.log('Listening on port ' + port);