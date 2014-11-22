var Writable = require('stream').Writable,
    util = require('util'),
    debug = require('debug')('ImageToFileWriteStream'),
    PNG = require('pngjs').PNG,
    fs = require('fs');

function ImageToFileWriteStream(file, opt) {
    opt = opt || {};
    Writable.call(this, opt);
    this._writableState.objectMode = true;
    this.file = file;
}

util.inherits(ImageToFileWriteStream, Writable);

ImageToFileWriteStream.prototype.writeImage = function(image) {
    var png = new PNG({
        height: image.imageHeight,
        width: image.imageWidth
    });

    var imageContent = new Buffer(image.imageContent);

    for (var y = 0; y < image.imageHeight; y++) {
        for (var x = 0; x < image.imageWidth; x++) {
            var idx = (image.imageWidth * y + x) << 4;

            // invert color
            png.data[idx] = imageContent[idx];
            png.data[idx+1] = imageContent[idx+1];
            png.data[idx+2] = imageContent[idx+2];

            // and reduce opacity
            png.data[idx+3] = imageContent[idx+3];
        }
    }

    png.pack().pipe(fs.createWriteStream(this.file));
};

ImageToFileWriteStream.prototype._write = function(buf, encoding, callback) {
    if (buf === null) {
        // write accummulator
        this.push(null);
        debug('Stream finished.');
    } else {
        this.writeImage(buf);
        callback();
    }
    
};

module.exports = ImageToFileWriteStream;