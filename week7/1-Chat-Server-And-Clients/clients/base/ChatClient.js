function ChatClient(io) {
    this.username = 'anonymous';
    this.room = 'global';
    this.io = io;
}

ChatClient.prototype.showMessage = function(text) {
    
};

ChatClient.prototype.sendMessage = function(text) {
    var targeted_users = [];
    text.split(' ').forEach(function(word){
        if (word.length > 0 && word[0] === '@') {
            targeted_users.push(word.substring(1));
        }
    });

    var message = {
        username: this.username,
        content: text,
        room: this.room
    };

    if (targeted_users.length > 0) {
        message.to = targeted_users;
    }

    this.io.emit('message', message);

    return message;
};

ChatClient.prototype.formatMessage = function(message) {
    return message.username + ": " + message.content;
};

ChatClient.prototype.connectToChat = function(room, username) {
    this.username = username;
    this.room = room || this.room;

    var that = this;

    this.io.on(this.room + '.message.new', function(data){
        if (data.username !== that.username) {
            if (typeof data.to === 'undefined' || data.to.indexOf(that.username) > -1) {
                that.showMessage(that.formatMessage(data));
            }
        }
    });

    this.io.on(this.username + '.' + this.room + '.information', function(roomInfo){
        that.showMessage('Users in room: ' + roomInfo.users.join(', '));
    });

    this.io.on(this.room + '.client.connected', function(data){
        if (data.username !== that.username) {
            that.showMessage(data.username + " joined the chat.");
        }
    });

    this.io.on(this.room + '.client.disconnected', function(data){
        if (data.username !== that.username) {
            that.showMessage(data.username + " left the chat.");
        }
    });

    this.io.emit('client.connect', {
        username: username,
        room: this.room
    });

    this.showMessage('You\'ve entered room: ' + this.room);
};

ChatClient.prototype.disconnectFromChat = function() {
    this.io.emit('client.disconnect', {
        username: this.username,
        room: this.room
    });
    this.showMessage('You have been logged out.');
};

ChatClient.prototype.startLoginProcedure = function() {
    
};

module.exports = ChatClient;