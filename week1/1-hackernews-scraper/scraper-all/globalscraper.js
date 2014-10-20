var storage = null,
    natural = require('natural'),
    tokenizer = new natural.WordTokenizer(),
    Scraper = require('../scraper');

function parseItemText(item) {
    if (item.type === 'comment') {
        addKeywords(item.text);
    } else if (item.type === 'story') {
        addKeywords(item.title);
    }
}

function addKeywords(text) {
    var words = tokenizer.tokenize(text),
        occurrences = {};

    words.forEach(function(word) {
        word = word.toLowerCase();
        var count = occurrences[word] || 0;
        count++;
        occurrences[word] = count;
    });

    Object.keys(occurrences).forEach(function(key) {
        var count = occurrences[key];
        storage.write(key, storage.read(key, 0) + count);
    });
}



module.exports = function(options) {

    storage = require('../utils').storage(options.storageFile);

    options.handleResponse = function(response, done) {
        console.log('Scraper: response received');
        parseItemText(response);
        done();
    };

    var scraper = new Scraper(options);

    scraper.showResults = function() {
        return storage.readAll();
    };

    return scraper;
};