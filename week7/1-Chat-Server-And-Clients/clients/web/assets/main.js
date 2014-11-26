$(function() {
    var socket = io('http://localhost:8000/');

    var client = new ChatClient(socket, {
        $window: $(window),
        $messages: $('#messages'),
        $chats: $('.chat'),
        $chat: $('#chat'),
        $login: $('#login'),
        $logout: $('#logout'),
        $message_input: $('#message'),
        $reload: $('#reload')
    });

    $("form#login-form").on('submit', function(e) {
        e.preventDefault();

        var username = $('#username').val(),
            room = $('#room').val();

        if (!username) {
            alert('Please enter an username');
        } else {
            client.connectToChat(room, username);
        }

        return false;
    });

    $("form#new-message").on('submit', function(e) {
        e.preventDefault();

        var message = $('#message').val();

        if (!message || message.length === 0) {
            alert('Please enter a message');
        } else {
            client.sendMessage(message);
        }

        return false;
    });
});