var debug = require('debug')('ChatServer');

function ChatServer(io) {
    this.io = io;
    this.rooms = {};
}

ChatServer.prototype.addUserToRoom = function(room, username) {
    if (typeof this.rooms[room] === 'undefined') {
        this.rooms[room] = [];
    }
    this.rooms[room].push(username);
    this.io.emit(username + '.' + room + '.information', {
        users: this.rooms[room]
    });
};

ChatServer.prototype.removeUserToRoom = function(room, username) {
    if (typeof this.rooms[room] === 'undefined') {
        return;
    }

    var index = this.rooms[room].indexOf(username);

    if (index > -1) {
        this.rooms[room].splice(index, 1);
    }
};

ChatServer.prototype.emitNewMessage = function(message) {
    var emittedInRoom = false;
    var that = this;

    debug('Rooms:', this.rooms);

    this.io.emit(message.room + '.message.new', message);
};

ChatServer.prototype.startConnection = function(socket) {
    var that = this;

    socket.on('client.connect', function(data) {
        console.log('New connection: ', data);
        that.addUserToRoom(data.room, data.username);
        that.io.emit(data.room + '.client.connected', data);
    });

    socket.on('client.disconnect', function(data) {
        console.log('Connection closed: ', data);
        that.removeUserToRoom(data.room, data.username);
        that.io.emit(data.room + '.client.disconnected', {username: data.username});
    });

    socket.on('message', function(data) {
        console.log('New message: ', data);
        that.emitNewMessage(data);
    });

    socket.emit('server.ready');
};

module.exports = ChatServer;