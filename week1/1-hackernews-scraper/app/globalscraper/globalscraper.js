var storage = null,
    maxItemStorage = null,
    https = require('https'),
    http = require('http'),
    sleep = require('sleep'),
    scraper_config = null,
    request = require('request'),
    Q = require('q'),
    
    natural = require('natural'),

    callbacks = [],
    articles = [],

    getMaxItem = function(config, callback) {
        var url = config.max_item_url;
        console.log('Getting new max item from url: ', url);
        https.get(url, function(res) {
            res.on('data', function(data) {
                callback(data);
            });
        }).on('error', function(e) {
            callback(null, e);
        });
    },

    getItem = function(id, config, callback) {
        var url = config.item_url.replace(/\{id\}/, id);

        console.log('Loading item with id: ', id, ', and url: ', url);

        https.get(url, function(res) {
            res.on('data', function(data) {
                callback(JSON.parse(data));
            });
        }).on('error', function(e) {
            callback(null, e);
        });
    };

function addItem(item) {
    if (item.type === 'comment') {
        addKeywords(item.text);
    }
    else if (item.type === 'story') {
        addKeywords(item.title);
    }
}

function addKeywords(text) {
    tokenizer = new natural.WordTokenizer();
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

function start() {
    var last_max_item = parseInt(maxItemStorage.read('max_item', scraper_config.initial_max_item), 10);

    console.log('Scraper started with last article number: ', last_max_item);

    getMaxItem(scraper_config, function(current_max_item, error) {
        if (error) throw error;

        current_max_item = parseInt(current_max_item, 10);

        console.log('New max item: ', current_max_item);

        var new_articles = current_max_item - last_max_item;

        if (new_articles > 0) {
            current_max_item = last_max_item + 1;
            getItem(current_max_item, scraper_config, function(item, error) {
                if (!error) {
                    addItem(item);
                }
                maxItemStorage.write('max_item', current_max_item);
                console.log('Sleeping 2 sec');
                sleep.sleep(2); // sec
                start();
            });
        } else {
            console.log('No new articles');
        }

    });

}

module.exports = function(config) {
    scraper_config = config;

    storage = require('../storage')(scraper_config.storage_file);
    maxItemStorage = require('../storage')(scraper_config.max_item_file);

    return {
        start: start,
        showResults: function () {
            return storage.readAll();
        }
    };
};