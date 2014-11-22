var Writable = require('stream').Writable,
    util = require('util'),
    debug = require('debug')('CalculateSumAndWriteStream'),
    bignum = require('bignum'); // bigint is better but could not install on dev machine

function CalculateSumAndWriteStream(opt) {
    opt = opt || {};
    Writable.call(this, opt);
    this.sum = bignum(0);
    this.accummulator = '';
}

util.inherits(CalculateSumAndWriteStream, Writable);

CalculateSumAndWriteStream.prototype.parseToSum = function(parsable) {
    var numbers = parsable.split(',');
    this.sum = numbers.reduce(function(sum, number) {
        return sum.add(parseFloat(number));
    }, this.sum);
    debug('Sum updated: ' + this.sum.toString());
};

CalculateSumAndWriteStream.prototype._write = function(chunk, enc, cb) {
    if (chunk === null) {
        // write accummulator
        this.parseToSum(this.accummulator);
        this.accummulator = '';
        debug('Total sum is: ' + this.sum.toString());
    } else {
        // write chunk
        var chunkString = chunk.toString(),
            lastCommaIndex = chunkString.lastIndexOf(','),
            parsable = '',
            rest = '';

        if (lastCommaIndex > -1) {
            parsable = chunkString.substring(0, lastCommaIndex);
            rest = chunkString.replace(parsable, '');
        } else {
            parsable = chunkString;
        }

        parsable = this.accummulator + parsable;
        this.accummulator = rest;

        this.parseToSum(parsable);
        cb();
    }

};

module.exports = CalculateSumAndWriteStream;