var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SnippetSchema = new Schema({
    language: String,
    filename: String,
    content: String,
    creator: String
}, {
    collection: 'snippets'
});

var Snippet = mongoose.model('Snippet', SnippetSchema);

module.exports = Snippet;