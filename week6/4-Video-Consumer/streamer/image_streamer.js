var debug = require('debug')('image_streamer'),
    net = require('net'),
    PNG = require('png-js');

function writeImage(connection) {

  PNG.decode('meadow-and-flowers.png', function(pixels) {
      // pixels is a 1d array (in rgba order) of decoded pixel data
      
      var metaDataBuffer = new Buffer(4);

      metaDataBuffer.writeUInt16BE(1600, 0);
      metaDataBuffer.writeUInt16BE(1200, 2);

      var buffer = Buffer.concat([metaDataBuffer, new Buffer(pixels), new Buffer([0])]);

      debug('writing', buffer.length, 'bytes to client');
      
      connection.write(buffer);
  });
}

net.createServer({allowHalfOpen: true}, function (connection) {
  connection.on('error', function (error) {
    debug('connection error:', error);
    clearTimeout(connection.timeout);
  });

  connection.on('close', function () {
    debug('client closed');
    clearTimeout(connection.timeout);
  });

  connection.on('data', function (chunk) {
    debug('got:' + chunk);
  });

  connection.timeout = setTimeout(function writeLoop() {
    writeImage(connection);
    connection.timeout = setTimeout(writeLoop, 1000);
  }, 100);

}).listen(3000);