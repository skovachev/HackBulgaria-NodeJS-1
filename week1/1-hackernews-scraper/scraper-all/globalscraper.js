var storage = null,
    natural = require('natural'),
    tokenizer = new natural.WordTokenizer(),
    Scraper = require('../scraper');

function parseItemText(item, done) {
    if (item.type === 'comment') {
        addKeywords(item.text, done);
    } else if (item.type === 'story') {
        addKeywords(item.title, done);
    }
}

function addKeywords(text, done) {
    var words = tokenizer.tokenize(text),
        occurrences = {};

    words.forEach(function(word) {
        word = word.toLowerCase();
        var count = occurrences[word] || 0;
        count++;
        occurrences[word] = count;
    });

    var insertables = [];

    storage.readMany(Object.keys(occurrences), function(results) {
        results.forEach(function(result) {
            if (occurrences[result.key]) {
                occurrences[result.key] = result.value + occurrences[result.key];
            }
        });

        Object.keys(occurrences).forEach(function(key) {
            var count = occurrences[key];

            insertables.push({
                key: key,
                value: count
            });
        });

        storage.writeMany(Object.keys(occurrences), insertables, done);
    });
}



module.exports = function(options) {

    storage = require('../utils').mongostorage(options.mongoCollection);

    options.handleResponse = function(response, done) {
        console.log('Scraper: response received');
        parseItemText(response, done);
    };

    var scraper = new Scraper(options);

    scraper.showResults = function(done, from, direction) {
        return storage.readAll(done, from, direction);
    };

    // rank, keyword, count
    scraper.showRankedResults = function(done, from, direction) {
        var per_page = 10;

        from = parseInt(from, 10);
        from = direction === 'next' ? from : from - 2*per_page;

        return storage.readRankedByCount(function(results) {
            var restructured = [],
                index = 1;
            results.forEach(function(result) {
                restructured.push({
                    rank: from + index,
                    keyword: result.key,
                    count: result.value
                });
                index++;
            });

            done(restructured);
        }, from, direction, per_page);
    };



    return scraper;
};