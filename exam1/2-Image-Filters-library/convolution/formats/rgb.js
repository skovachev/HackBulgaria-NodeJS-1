var Format = require('./format');

function RGBFormat() {

}

RGBFormat.prototype = new Format();

RGBFormat.prototype.applyKernel = function(imageData, kernel) {
    return {
        red: Format.applyKernel.call(this, imageData.red),
        green: Format.applyKernel.call(this, imageData.green),
        blue: Format.applyKernel.call(this, imageData.blue)
    };
};

RGBFormat.prototype.edgeDetection = function(imageData) {
    return {
        red: Format.edgeDetection.call(this, imageData.red),
        green: Format.edgeDetection.call(this, imageData.green),
        blue: Format.edgeDetection.call(this, imageData.blue)
    };
};

RGBFormat.prototype.boxBlur = function(imageData) {
    return {
        red: Format.boxBlur.call(this, imageData.red),
        green: Format.boxBlur.call(this, imageData.green),
        blue: Format.boxBlur.call(this, imageData.blue)
    };
};

module.exports = RGBFormat;