var DataTransformerStream = require('./DataTransformerStream'),
    Socket = require('net').Socket,
    transformerStream = new DataTransformerStream(),
    ImageToStdOutTransformStream = require('./ImageToStdOutTransformStream'),
    imageToStdOutStream = new ImageToStdOutTransformStream();

var socket = new Socket();
socket.connect(3000, '192.168.1.138');

socket
    .pipe(transformerStream)
    .pipe(imageToStdOutStream)
    .pipe(process.stdout);