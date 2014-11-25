function ChatClient(rl, io) {
    this.username = 'anonymous';
    this.room = 'global';
    this.rl = rl;
    this.io = io;

    var that = this;

    rl.on('line', function(line) {
        that.sendMessage(line.trim());
        rl.prompt(true);
    }).on('close', function() {
        that.disconnectFromChat();
    });
}

ChatClient.prototype.showMessage = function(text) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(text);
    this.rl.prompt(true);
};

ChatClient.prototype.sendMessage = function(text) {
    if (text === 'logout') {
        this.disconnectFromChat();
    }
    else {
        this.io.emit('message', {username: this.username, content: text, room: this.room});
    }
};

ChatClient.prototype.connectToChat = function(room, username) {
    this.username = username;
    this.room = room || this.room;

    var that = this;

    this.io.on(this.room + '.message.new', function(data){
        if (data.username !== that.username) {
            that.showMessage(data.username + ": " + data.content);
        }
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
    
    this.rl.setPrompt(username + '> ');
    this.rl.prompt(true);
};

ChatClient.prototype.disconnectFromChat = function() {
    this.io.emit('client.disconnect', {username: this.username});
    this.showMessage('You have been logged out.');
    process.exit(0);
};

ChatClient.prototype.startLoginProcedure = function() {
    var that = this;
    this.rl.question("What username do you want to login with? ", function(username) {
        that.rl.question("What room do you want to enter? (leave blank for global room)", function(room) {
            room = room.trim().toLowerCase();
            that.connectToChat(room, username);
        });
    });
};

module.exports = ChatClient;