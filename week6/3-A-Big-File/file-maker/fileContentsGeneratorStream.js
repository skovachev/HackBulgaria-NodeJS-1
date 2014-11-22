var Readable = require('stream').Readable,
    util = require('util');

function getStringSizeInBytes(str) {
    return Buffer.byteLength(str, 'utf8');
}

function FileContentsGeneratorStream(size, numbersPerChunk, opt) {
    opt = opt || {};
    Readable.call(this, opt);
    this.size = size;
    this.numbersPerChunk = numbersPerChunk || 1000;
}

util.inherits(FileContentsGeneratorStream, Readable);

function generateRandomNumber(low, high) {
    high = high || 100000;
    low = low || 1;
    return Math.random() * (high - low) + low;
}

FileContentsGeneratorStream.prototype.generateChunk = function(numbers) {
    numbers = numbers || this.numbersPerChunk;
    var chunk = '';

    for (var i = 0; i < numbers; i++) {
        chunk += generateRandomNumber() + ',';
    }

    return chunk;
};

FileContentsGeneratorStream.prototype._read = function(n) {
    var chunk = this.generateChunk(),
        chunkSize = getStringSizeInBytes(chunk);

    this.size -= chunkSize;

    // close stream
    if (this.size <= 0) {
        this.push(chunk.replace(',', ''));
        this.push(null);
    } else {
        this.push(chunk);
    }

};

module.exports = FileContentsGeneratorStream;