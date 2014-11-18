var Transform = require('stream').Transform,
    util = require('util');

function RegexStream(regex, opt) {
    opt = opt || {};
    opt.objectMode = true;
    Transform.call(this, opt);
    this.regex = regex;
}

util.inherits(RegexStream, Transform);

RegexStream.prototype.setRegex = function(regex) {
    this.regex = regex;
};

RegexStream.prototype._transform = function(data, encoding, callback) {
    if (data instanceof RegExp) {
        this.regex = data;
    }
    else {
        var text = data.toString();
        if (this.regex === null || this.regex.test(text)) {
            this.push(data);
        }
    }
    callback();
};

module.exports = RegexStream;