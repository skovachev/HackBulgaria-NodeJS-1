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

    var stream = this;
    png.parse(new Buffer(image.imageContent, 'binary'), function() {
        png.pack().pipe(fs.createWriteStream(stream.file));
    });
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