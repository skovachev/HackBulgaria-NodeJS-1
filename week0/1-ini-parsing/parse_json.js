var fs = require('fs'),
    utils = require('./utils.js'),
    source = null,
    output_file = null,
    source_is_http = false,
    json = {},

    parseJsonFile = function(source)
    {
        fs.readFile(source, function(err, data){
            json = JSON.parse(data.toString());

            var lines = [];

            Object.keys(json).forEach(function(section) {
                var currentSection = json[section];
                lines.push('\n[' + section + ']\n');

                Object.keys(currentSection).forEach(function(attr) {
                    var value = currentSection[attr];
                    lines.push(attr + '=' + value + '\n');
                });
            });

            utils.writeFile(output_file, lines.join(''));
        });
    };

module.exports = {
    parseFromSource: function(source, target)
    {
        output_file = target;
        parseJsonFile(source);
    }
};