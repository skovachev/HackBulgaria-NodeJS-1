var http = require('http'),
    controller = require('./controller'),
    url = require('url');

module.exports = function(){
    http.createServer(function (req, res) {
        console.log(req.url);
        console.log(req.method);

        var data = '';

        req.on('data', function(chunk) {
            // console.log("Received body data:");
            // console.log(chunk.toString());
            data += chunk.toString();
        });

        req.on('end', function() {
            console.log('data: ', data);

            var url_parts = url.parse(req.url, true);
            console.log('URL parts:', url_parts);

            var args = {};
            if (req.method === 'GET' || req.method === 'DELETE')
            {
                args = url_parts.query;
            }
            else if (req.method === 'POST')
            {
                args = data ? JSON.parse(data) : {};
            }

            var response = controller.route_request(req.method, url_parts.pathname, args);
            // empty 200 OK response for now
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response, 0, 4));
        });

    }).listen(9615);

    console.log('Listening on port 9615');
};
