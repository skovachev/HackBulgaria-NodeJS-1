$(function() {
    var socket = io('http://localhost:8000/');
    var currentUsername = 'anonymous';
    var currentRoom = 'global';

    function showMessage(text) {
        $('#messages').append("<div class='message'>"+text+"</div>");
    }

    function sendMessage(text) {
        var message = {
            username: currentUsername,
            content: text,
            room: currentRoom
        };

        socket.emit('message', message);
    }

    function connectToChat(username, room) {

        socket.on(currentRoom + '.message.new', function(data){
            if (data.username !== currentUsername) {
                if (typeof data.to === 'undefined' || data.to.indexOf(currentUsername) > -1) {
                    showMessage(data.username + ": " + data.content);
                }
            }
        });

        socket.on(currentUsername + '.' + currentRoom + '.information', function(roomInfo){
            showMessage('Users in room: ' + roomInfo.users.join(', '));
        });

        socket.on(currentRoom + '.client.connected', function(data){
            if (data.username !== username) {
                showMessage(data.username + " joined the chat.");
            }
        });

        socket.on(currentRoom + '.client.disconnected', function(data){
            if (data.username !== currentUsername) {
                showMessage(data.username + " left the chat.");
            }
        });

        socket.emit('client.connect', {
            username: currentUsername,
            room: currentRoom
        });

        console.log(socket);
    }

    $("#login-button").on('click', function() {
        var username = $('#username').val(),
            room = $('#room').val();

        if (!username) {
            alert('Please enter an username');
        } else {
            currentUsername = username;
            currentRoom = room || currentRoom;

            $('#login').remove();
            $('#chat').removeClass('hidden');

            connectToChat(currentUsername, currentRoom);
        }
    });

    $("#send-message").on('click', function() {
        var message = $('#message').val();

        if (!message || message.length === 0) {
            alert('Please enter a message');
        } else {

        }
    });
});