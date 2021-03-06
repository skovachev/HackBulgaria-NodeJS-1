var http = require('http'),
    controller = require('./controller'),
    url = require('url');

module.exports = function() {
    http.createServer(function(req, res) {
        console.log(req.url);
        console.log(req.method);

        var data = '';

        req.on('data', function(chunk) {
            data += chunk.toString();
        });

        req.on('end', function() {
            var url_parts = url.parse(req.url, true);

            var args = {};
            if (req.method === 'GET' || req.method === 'DELETE') {
                args = url_parts.query;
            } else if (req.method === 'POST') {
                args = data ? JSON.parse(data) : {};
            }

            var response = controller.route_request(req.method, url_parts.pathname, args);
            // empty 200 OK response for now
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(response, 0, 4));
        });

    }).listen(9615);

    console.log('Listening on port 9615');
};