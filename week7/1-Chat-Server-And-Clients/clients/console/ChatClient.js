function ChatClient(rl, io) {
    this.username = 'anonymous';
    this.rl = rl;
    this.io = io;

    var that = this;

    rl.on('line', function(line) {
        that.sendMessage(line.trim());
        rl.prompt(true);
    }).on('close', function() {
        that.disconnectFromChat();
    });

    io.on('message.new', function(data){
        if (data.username !== that.username) {
            that.showMessage(data.username + ": " + data.content);
        }
    });

    io.on('client.connected', function(data){
        if (data.username !== that.username) {
            that.showMessage(data.username + " joined the chat.");
        }
    });

    io.on('client.disconnected', function(data){
        if (data.username !== that.username) {
            that.showMessage(data.username + " left the chat.");
        }
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
        this.io.emit('message', {username: this.username, content: text});
    }
};

ChatClient.prototype.connectToChat = function(username) {
    this.username = username;

    this.io.emit('client.connect', {username: username});
    
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
        that.connectToChat(username);
    });
};

module.exports = ChatClient;