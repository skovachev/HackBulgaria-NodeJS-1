var https = require('https'),
    sleep = require('sleep'),
    scraper_config = null,
    callbacks = [],
    articles = [],

    getMaxItem = function(config, callback) {
        var url = config.maxItemUrl;
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
        var url = config.itemUrl.replace(/\{id\}/, id);

        console.log('Loading item with id: ', id, ', and url: ', url);

        https.get(url, function(res) {
            res.on('data', function(data) {
                callback(JSON.parse(data));
            });
        }).on('error', function(e) {
            callback(null, e);
        });
    };

function Scraper(options) {
    this.startingNumber = options.startingNumber || 1;
    this.sleepAfterRequest = options.sleepAfterRequest || 2; // 2 sec
    this.sleepAfterNoItems = options.sleepAfterNoItems || 60; // 1 min
    this.handleResponse = options.handleResponse || function(response) {
        console.log('Scraper:: response received');
        console.log(response);
    };
    this.trackingFile = options.trackingFile;

    if (this.trackingFile) {
        this.tracking = require('../utils').storage(this.trackingFile);
    }

    scraper_config = options;
}

Scraper.prototype.start = function () {
    var last_max_item = parseInt(this.tracking.read('max_item', this.startingNumber), 10),
        that = this;

    console.log('Scraper started with last number: ', last_max_item);

    getMaxItem(scraper_config, function(current_max_item, error) {
        if (error) throw error;

        current_max_item = parseInt(current_max_item, 10);

        console.log('New max item: ', current_max_item);

        var new_articles = current_max_item - last_max_item;

        if (new_articles > 0) {
            current_max_item = last_max_item + 1;
            getItem(current_max_item, scraper_config, function(item, error) {
                if (!error && typeof that.handleResponse === 'function') {
                    that.handleResponse(item);
                }
                that.tracking.write('max_item', current_max_item);
                console.log('Sleeping 2 sec');
                sleep.sleep(that.sleepAfterRequest); // sec
                that.start();
            });
        } else {
            console.log('No new items');
            sleep.sleep(that.sleepAfterNoItems); // sec
            that.start();
        }

    });
};

module.exports = Scraper;