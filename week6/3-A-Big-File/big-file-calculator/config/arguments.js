var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
});
parser.addArgument(
    ['-i', '--input'], {
        help: 'output file name',
        required: true
    }
);

module.exports = parser;