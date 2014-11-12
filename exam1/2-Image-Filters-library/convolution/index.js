var MonochromeFormat = require('./formats/monochrome'),
    RGBFormat = require('./formats/rgb');

module.exports = {
    monochrome: new MonochromeFormat(),
    rgb: new RGBFormat(),
};