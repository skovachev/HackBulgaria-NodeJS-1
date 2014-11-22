var parser = require('./config/arguments'),
    ContentGeneratorStream = require('./fileContentsGeneratorStream'),
    fs = require('fs'),
    debug = require('debug')('FileMaker');

var args = parser.parseArgs();
var sizeMeasurements = {
    'gb': 1000000000,
    'mb': 1000000
};

function parseFileSize(size) {
    size = size.toLowerCase();

    for (var meansurement in sizeMeasurements) {
        if (size.indexOf(meansurement) > -1) {
            debug('File size detected in ' + meansurement.toUpperCase());
            var parsedSize = parseInt(size.replace(meansurement, ''), 10);

            debug('Parsed size is ' + parsedSize);
            return parsedSize * sizeMeasurements[meansurement];
        }
    }

    return 0;
}

var filename = args.output;
var size = parseFileSize(args.size);

debug('Creating file ' + filename + ' of size ' + size + ' bytes');

var fileWriteStream = fs.createWriteStream(filename);

var contentGeneratorStream = new ContentGeneratorStream(size);
contentGeneratorStream.pipe(fileWriteStream);