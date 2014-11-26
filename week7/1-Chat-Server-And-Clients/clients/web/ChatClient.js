var BaseClient = require('../base'),
    util = require('util');

util.inherits(ChatClient, BaseClient);

var userColorMap = {};

function getRandomColor() {
    var letters = '0123456789A'.split(''); // only dark colors
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 11)];
    }
    return color;
}

function ChatClient(io, elems) {
    BaseClient.call(this, io);

    var that = this;

    for (var i in elems) {
        var el = elems[i];
        this[i] = el;
    }

    this.$window.bind("beforeunload", function() {
        that.disconnectFromChat();
    });

    this.$logout.on('click', function() {
        that.disconnectFromChat();
    });
}

ChatClient.prototype.formatMessage = function(message) {
    userColorMap[message.username] = userColorMap[message.username] || getRandomColor();

    var text = "<strong>" + message.username + ":</strong>" + message.content;
    return "<span style='color:" + userColorMap[message.username] + "'>" + text + ":</span>";
};

ChatClient.prototype.showMessage = function(text) {
    ChatClient.super_.prototype.showMessage.call(this, text);

    this.$messages.append("<div class='message'>"+text+"</div>");
};

ChatClient.prototype.sendMessage = function(text) {
    var message = ChatClient.super_.prototype.sendMessage.call(this, text);
    this.$message_input.val('');

    this.showMessage(this.formatMessage(message));
};

ChatClient.prototype.connectToChat = function(room, username) {
    ChatClient.super_.prototype.connectToChat.call(this, room, username);

    this.$chats.removeClass('hidden');
    this.$login.remove();
};

ChatClient.prototype.disconnectFromChat = function() {
    ChatClient.super_.prototype.disconnectFromChat.call(this);
    this.$chats.addClass('hidden');
    this.$chat.removeClass('hidden');
    this.$reload.removeClass('hidden');
};

module.exports = ChatClient;