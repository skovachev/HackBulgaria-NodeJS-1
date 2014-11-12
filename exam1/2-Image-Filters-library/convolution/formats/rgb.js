var Format = require('./format'),
    Q = require('q');

function RGBFormat() {

}

function callPrototypeMethodForRGB(bind, method, imageData, deferred, kernel) {
    Format.prototype[method].call(bind, imageData.red, kernel).done(function(red) {
        Format.prototype[method].call(bind, imageData.green, kernel).done(function(green) {
            Format.prototype[method].call(bind, imageData.blue, kernel).done(function(blue) {
                deferred.resolve({
                    red: red,
                    green: green,
                    blue: blue
                });
            });
        });
    });
}

RGBFormat.prototype = new Format();

RGBFormat.prototype.applyKernel = function(imageData, kernel) {
    var deferred = Q.defer();
    callPrototypeMethodForRGB(this, 'applyKernel', imageData, deferred, kernel);
    return deferred.promise;
};

RGBFormat.prototype.edgeDetection = function(imageData) {
    var deferred = Q.defer();
    callPrototypeMethodForRGB(this, 'edgeDetection', imageData, deferred);
    return deferred.promise;
};

RGBFormat.prototype.boxBlur = function(imageData) {
    var deferred = Q.defer();
    callPrototypeMethodForRGB(this, 'boxBlur', imageData, deferred);
    return deferred.promise;
};

module.exports = RGBFormat;