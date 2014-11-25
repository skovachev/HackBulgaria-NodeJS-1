var server = require('http').createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write('Chat server at your disposal!');
    response.end();
});

var io = require('socket.io').listen(server);

server.listen(8000);

io.on('connection', function(socket) {

    socket.on('client.connect', function(data) {
        console.log('New connection from: ' + data.username);
        io.emit('client.connected', {username: data.username});
    });

    socket.on('client.disconnect', function(data) {
        console.log('Connection closed from: ' + data.username);
        io.emit('client.disconnected', {username: data.username});
    });

    socket.on('message', function(data) {
        console.log('New message from: ' + data.username + " - " + data.content);
        io.emit('message.new', data);
    });

    console.log('New connection opened...');
});