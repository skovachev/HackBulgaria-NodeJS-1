var https = require('https'),
    fs = require('fs'),
    parser = null,
    source_type = 'ini',

    source = process.argv.length > 2 ? process.argv[2] : null,
    output_file = null;

if (!source)
{
    console.log('No source argument passed');
    return;
}

source_type = source.match(/.*\.json$/) ? 'json' : 'ini';
parser = require('./parse_' + source_type + '.js');

output_file = typeof process.argv[3] !== 'undefined' ? process.argv[3] : 'parsed.' + source_type;

source_is_http = source.match(/^http/g) !== null;

if (!source_is_http)
{
    parser.parseFromSource(source, output_file);
}
else
{
    // parse from url
    https.get(source, function(res){
        res.on('data', function(data){
            output_file = source.split('/');
            output_file = output_file[output_file.length-1];
            output_file = output_file.replace('.' + source_type, '');
            output_file = output_file + '.' + (source_type === 'ini' ? 'json' : 'ini');

            fs.writeFile('parse.temp', data.toString(), function(err){
                parser.parseFromSource('parse.temp', output_file);
            });
        });

        res.on('error', function(err){
            console.log(err);
        });
    });
}