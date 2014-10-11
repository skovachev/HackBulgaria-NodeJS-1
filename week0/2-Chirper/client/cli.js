var ArgumentParser = require('argparse').ArgumentParser,
    parser = new ArgumentParser({
        version: '0.0.1',
        addHelp:false,
        description: 'Argparse example'
    });


parser.addArgument(
    ['-r', '--register'],
    {
        action: 'storeConst',
        dest:   'action',
        constant: 'register'
    }
);

parser.addArgument(
    ['--getall'],
    {
        action: 'storeConst',
        dest:   'action',
        constant: 'get_all_chrips'
    }
);

parser.addArgument(
    ['--getself'],
    {
        action: 'storeConst',
        dest:   'action',
        constant: 'my_chirps'
    }
);

parser.addArgument(
    ['--create'],
    {
        action: 'storeConst',
        dest:   'action',
        constant: 'create_chirp'
    }
);

parser.addArgument(
    ['--delete'],
    {
        action: 'storeConst',
        dest:   'action',
        constant: 'delete_chirp'
    }
);

parser.addArgument(
    ['--user']
);

parser.addArgument(
    ['--message']
);

parser.addArgument(
    ['--chirpid']
);

module.exports = {
    args: function(){
        return parser.parseArgs();
    }
};