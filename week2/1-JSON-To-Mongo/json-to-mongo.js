var source_file = process.argv[2],
    MongoClient = require('mongodb').MongoClient,
    path = require('path');

if (!source_file) {
    console.log('Please specify a file to import');
} else {
    var config = require('./config'),
        collection_name = path.basename(collection_name, '.json'),
        source_data = require(source_file);

    if (Object.prototype.toString.call(source_data) !== '[object Array]') {
        var data = [];
        Object.keys(source_data).forEach(function(key) {
            data.push({
                "key": key,
                "value": source_data[key]
            });
        });
        source_data = data;
    }

    MongoClient.connect(config.mongoConnectionUrl, function(err, db) {
        if (err) {
            console.log('Error connecting to database');
        } else {
            var collection = db.collection(collection_name);
            // Insert some documents
            collection.insert(source_data, function(err, result) {

                console.log("Inserted " + source_data.length + " documents in to " + collection_name + " collection.");
                db.close();
            });
        }
    });
}