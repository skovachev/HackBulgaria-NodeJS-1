var Transform = require('stream').Transform,
    util = require('util'),
    debug = require('debug')('DataTransformerStream');

function DataTransformerStream(opt) {
    opt = opt || {};
    Transform.call(this, opt);
    this._readableState.objectMode = true;
    this._writableState.objectMode = false;
    this.accummulator = new Buffer(0);
}

util.inherits(DataTransformerStream, Transform);

DataTransformerStream.prototype.writeImage = function(width, height, buf) {
    debug('Writing image: %d %d', width, height);
    this.push({
        imageHeight: height,
        imageWidth: width,
        imageContent: this.accummulator.toString()
    });
};

DataTransformerStream.prototype.checkForImage = function() {
    if (this.accummulator.length >= 4) {
        var width = this.accummulator.readUInt16BE(0);
        var height = this.accummulator.readUInt16BE(2);
        
        debug('dimentions read - width: %d, height: %d', width, height);

        var channelsPerPixel = 3; // rgb
        var requiredLength = width * height * channelsPerPixel;

        debug("requiredLength %d length %d", requiredLength, this.accummulator.length);
        if (this.accummulator.length < requiredLength) {
            debug('Buffer length too short -> continue');
        }
        else {
            var imageContent = this.accummulator.slice(5, requiredLength);
            this.accummulator = this.accummulator.slice(requiredLength+1);

            this.writeImage(width, height, imageContent);
        }
    }
    else {
        debug('not enought data in buffer -> continue');
    }
};

DataTransformerStream.prototype._transform = function(buf, encoding, callback) {
    if (buf === null) {
        // write accummulator
        this.checkForImage();
        debug('Stream finished.');
    } else {
        this.accummulator = Buffer.concat([this.accummulator, buf]);
        this.checkForImage();
        callback();
    }
    
};

module.exports = DataTransformerStream;