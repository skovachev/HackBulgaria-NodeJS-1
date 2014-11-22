var Transform = require('stream').Transform,
    util = require('util'),
    debug = require('debug')('ImageToStdOutTransformStream');

function ImageToStdOutTransformStream(opt) {
    opt = opt || {};
    Transform.call(this, opt);
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
}

util.inherits(ImageToStdOutTransformStream, Transform);

ImageToStdOutTransformStream.prototype._transform = function(buf, encoding, callback) {
    if (buf === null) {
        // write accummulator
        this.push(null);
        debug('Stream finished.');
    } else {
        this.push(JSON.stringify(buf));
        callback();
    }
    
};

module.exports = ImageToStdOutTransformStream;