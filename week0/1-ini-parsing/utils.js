var fs = require('fs');

module.exports = {
    writeFile: function(target, text) {
        fs.writeFile(target, text, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    }
};