var Transform = require('stream').Transform,
    util = require('util');

function LinkTransformerStream(base_url, opt) {
    opt = opt || {};
    Transform.call(this, opt);
    this.base_url = base_url;
}

util.inherits(LinkTransformerStream, Transform);

LinkTransformerStream.prototype.proxifyLinks = function(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, this.base_url + "$1");
};


LinkTransformerStream.prototype._transform = function(data, encoding, callback) {
    var result = this.proxifyLinks(data.toString());
    callback(null, result);
};

module.exports = LinkTransformerStream;