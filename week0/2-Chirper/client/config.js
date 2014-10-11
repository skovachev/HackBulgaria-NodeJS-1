var fs = require('fs');

module.exports = {
    load_config: function(callback){
        fs.readFile('config.json', function(err, data){
            var json = err ? null : JSON.parse(data.toString());
            if (!json){
                json = {
                    "api_url": "http://chirper.dev:9615/",
                    "url": "http://chirper.dev/",
                    "port": 9615
                };
            }
            console.log(json);
            callback(json);
        });
    },

    save_config: function(json)
    {
        var text = JSON.stringify(json, null, 4);
        fs.writeFile('config.json', text, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }
};