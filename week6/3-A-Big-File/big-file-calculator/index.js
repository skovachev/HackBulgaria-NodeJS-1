var parser = require('./config/arguments'),
    fs = require('fs'),
    debug = require('debug')('FileCalculator'),
    CalculateSumAndWriteStream = require('./calculateSumWriteStream');

var args = parser.parseArgs();

var filename = args.input;
var calculateSumAndWriteStream = new CalculateSumAndWriteStream();

debug('Reading file ' + filename);

fs.createReadStream(filename).pipe(calculateSumAndWriteStream);