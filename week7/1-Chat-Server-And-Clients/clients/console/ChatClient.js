var BaseClient = require('../base'),
    util = require('util');

util.inherits(ChatClient, BaseClient);

function ChatClient(rl, io) {
    BaseClient.call(this, io);

    this.rl = rl;

    var that = this;

    rl.on('line', function(line) {
        that.sendMessage(line.trim());
        rl.prompt(true);
    }).on('close', function() {
        that.disconnectFromChat();
    });
}

ChatClient.prototype.showMessage = function(text) {
    ChatClient.super_.prototype.showMessage.call(this, text);

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
        ChatClient.super_.prototype.sendMessage.call(this, text);
    }
};

ChatClient.prototype.connectToChat = function(room, username) {
    ChatClient.super_.prototype.connectToChat.call(this, room, username);
    
    this.rl.setPrompt(username + '> ');
    this.rl.prompt(true);
};

ChatClient.prototype.disconnectFromChat = function() {
    ChatClient.super_.prototype.disconnectFromChat.call(this);
    process.exit(0);
};

ChatClient.prototype.startLoginProcedure = function() {
    ChatClient.super_.prototype.startLoginProcedure.call(this);

    var that = this;
    this.rl.question("What username do you want to login with? ", function(username) {
        that.rl.question("What room do you want to enter? (leave blank for global room)", function(room) {
            room = room.trim().toLowerCase();
            that.connectToChat(room, username);
        });
    });
};

module.exports = ChatClient;