var storage = null,
    natural = require('natural'),
    tokenizer = new natural.WordTokenizer();

function addItem(item) {
    if (item.type === 'comment') {
        addKeywords(item.text);
    }
    else if (item.type === 'story') {
        addKeywords(item.title);
    }
}

function addKeywords(text) {
    var words = tokenizer.tokenize(text),
        occurrences = {};

    words.forEach(function(word){
        word = word.toLowerCase();
        var count = occurrences[word] || 0;
        count++;
        occurrences[word] = count;
    });

    Object.keys(occurrences).forEach(function(key){
        var count = occurrences[key];
        storage.write(key, storage.read(key, 0) + count);
    });
}

var Scraper = require('../scraper');

module.exports = function(options) {

    storage = require('../utils').storage(options.storageFile);

    options.handleResponse = function(response) {
        console.log('Scraper: response received');
        addItem(response);
    };

    var scraper = new Scraper(options);

    scraper.showResults = function () {
        return storage.readAll();
    };

    return scraper;
};