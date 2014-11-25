var ChatServer = require('./ChatServer'),
    server = require('http').createServer(function(request, response) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write('Chat server at your disposal!');
        response.end();
    });

var io = require('socket.io').listen(server);

server.listen(8000);

io.on('connection', function(socket) {

    (new ChatServer(io)).startConnection(socket);

    console.log('New connection opened...');
});