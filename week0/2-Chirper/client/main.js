module.exports = function(){
    var http = require("http"),
        args = require("./cli").args(),
        requester = require('./requester'),
        config_loader = require('./config');

    config_loader.load_config(function(json){
        for (var key in json){
            args[key] = json[key];
        }

        var response = requester.request(args.action, args, function(response){
            if (response.user)
            {
                json.user = response.user.name;
                json.key = response.user.key;
                config_loader.save_config(json);
            }
        });
    });
};
