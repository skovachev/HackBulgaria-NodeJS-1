var readline = require('readline');
var ChatClient = require('./ChatClient');
var socketio = require('socket.io-client');
var socket = socketio.connect('http://localhost:8000');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var client = new ChatClient(rl, socket);

client.startLoginProcedure();