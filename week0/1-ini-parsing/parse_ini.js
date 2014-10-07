var fs = require('fs'),
    utils = require('./utils.js'),
    source = null,
    output_file = 'config.json',
    source_is_http = false,
    json_string = null,
    json = {},

    parseJsonToString = function(text)
    {
        return JSON.stringify(text, null, 4);
    },
    
    readLines = function(input, func, final_callback) {
      var remaining = '';
     
      input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
          var line = remaining.substring(0, index);
          remaining = remaining.substring(index + 1);
          func(line);
          index = remaining.indexOf('\n');
        }

        final_callback(json);
      });
     
      input.on('end', function() {
        if (remaining.length > 0) {
          func(remaining);
          final_callback(json);
        }
      });
    },

    parseIniFile = function(source)
    {
        // parse from file
        var readStream = fs.createReadStream(source),
            lastSection = null,
            lastSectionTry = null;

        readLines(readStream, function(line){

            lastSectionTry = line.match(/\[.*\]/);
            if (lastSectionTry !== null) // section
            {
                lastSection = lastSectionTry[0].replace('[', '').replace(']', '');
                json[lastSection] = {};
            }
            else if (line.match(/^\s*$/) || line.match(/^\;.*/))
            {
                // empty line or comment -> skip
            }
            else
            {
                var parts = line.split('=');
                json[lastSection][parts[0].trim()] = parts[1].trim();
            }

        }, function(json){
            json_string = parseJsonToString(json);
            utils.writeFile(output_file, json_string);
        });
    };





module.exports = {
    parseFromSource: function(source, target)
    {
        output_file = target;
        parseIniFile(source);
    }
};