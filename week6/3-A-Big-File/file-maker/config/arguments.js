var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
});
parser.addArgument(
    ['-o', '--output'], {
        help: 'output file name',
        required: true
    }
);
parser.addArgument(
    ['-s', '--size'], {
        help: 'size of the file to generate',
        required: true
    }
);

module.exports = parser;