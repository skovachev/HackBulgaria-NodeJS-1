var DataTransformerStream = require('./DataTransformerStream'),
    Socket = require('net').Socket,
    ImageToStdOutTransformStream = require('./ImageToStdOutTransformStream'),
    ImageToFileWriteStream = require('./ImageToFileWriteStream');

var socket = new Socket();
socket.connect(3000, '127.0.0.1');

// socket
//     .pipe(new DataTransformerStream())
//     .pipe(new ImageToStdOutTransformStream())
//     .pipe(process.stdout);

socket
    .pipe(new DataTransformerStream())
    .pipe(new ImageToFileWriteStream('out.png'));