var debug = require('debug')('image_streamer'),
    net = require('net'),
    PNG = require('pngjs').PNG,
    fs = require('fs');

function writeImage(connection) {

  fs.createReadStream('./images/meadow-and-flowers.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {

        var metaDataBuffer = new Buffer(4);

        metaDataBuffer.writeUInt16BE(this.width, 0);
        metaDataBuffer.writeUInt16BE(this.height, 2);

        var buffer = Buffer.concat([metaDataBuffer, this.data, new Buffer([0])]);

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