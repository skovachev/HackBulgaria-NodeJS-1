var https = require('https'),
    sleep = require('sleep'),
    Q = require('q'),

    scraper_config = null,
    scraper = null,

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
    this.sleepAfterRequest = typeof options.sleepAfterRequest !== 'undefined' ? options.sleepAfterRequest : 2; // 2 sec
    this.sleepAfterNoItems = typeof options.sleepAfterNoItems !== 'undefined' ? options.sleepAfterNoItems : 60; // 60 sec
    this.handleResponse = options.handleResponse || function(response) {
        console.log('Scraper:: response received');
        console.log(response);
    };
    this.trackingFile = options.trackingFile;
    this.onFeedEndReached = options.onFeedEndReached || function() {};
    this.checkInCache = options.checkInCache || function(id) {
        return null;
    };

    if (this.trackingFile) {
        this.tracking = require('../utils').storage(this.trackingFile);
    }

    scraper_config = options;
    scraper = this;
}

function onRequestEnd(max_item) {
    this.tracking.write('max_item', max_item);
    if (this.sleepAfterRequest > 0) {
        console.log('Sleeping ' + this.sleepAfterRequest + ' sec');
        sleep.sleep(this.sleepAfterRequest); // sec
    }
    this.start();
}

function getParentItem(item, parent_type, promise) {
    // check in cache first
    var parent = scraper.checkInCache(item.parent);

    if (parent) {
        promise.resolve(parent);
    } else {
        getItem(item.parent, scraper_config, function(json, error) {
            if (error) {
                promise.reject(new Error(error));
            } else {
                if (json.type !== parent_type) {
                    console.log('Found parent of wrong type with id: ' + json.id + '. Loading next parent...');
                    getParentItem(json, parent_type, promise);
                } else {
                    console.log('Found parent of type ' + parent_type + ' with id: ' + json.id);
                    promise.resolve(json);
                }
            }
        });
    }
}

Scraper.prototype.getParentItemOfType = function(child, parent_type) {
    var deferred = Q.defer();
    getParentItem(child, parent_type, deferred);
    return deferred.promise;
};

Scraper.prototype.start = function() {
    var last_max_item = parseInt(this.tracking.read('max_item', this.startingNumber), 10),
        that = this;

    console.log('\n---------------\nNew scrape request started with last number: ' + last_max_item);

    getMaxItem(scraper_config, function(current_max_item, error) {
        if (error) throw error;

        current_max_item = parseInt(current_max_item, 10);

        console.log('New max item: ', current_max_item);

        var new_articles = current_max_item - last_max_item;

        if (new_articles > 0) {
            current_max_item = last_max_item + 1;
            getItem(current_max_item, scraper_config, function(item, error) {
                if (!error && typeof that.handleResponse === 'function') {
                    that.handleResponse(item, function() {
                        onRequestEnd.apply(that, [current_max_item]);
                    });
                } else {
                    onRequestEnd.apply(that, [current_max_item]);
                }
            });
        } else {
            that.onFeedEndReached();
            console.log('No new items in feed. Sleeping for ' + that.sleepAfterNoItems + ' secs');
            sleep.sleep(that.sleepAfterNoItems); // sec
            that.start();
        }

    });
};

module.exports = Scraper;