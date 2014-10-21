var source_file = process.argv[2],
    fs = require('fs'),
    MongoClient = require('mongodb').MongoClient;

if (!source_file) {
    console.log('Please specify a file to import');
} else {
    var config = JSON.parse(fs.readFileSync('config.json')),
        collection_name = source_file.replace('.json', ''),
        source_data = JSON.parse(fs.readFileSync(source_file));

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