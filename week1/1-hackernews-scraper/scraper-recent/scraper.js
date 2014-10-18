var articlesStorage = null,
    https = require('https'),
    sleep = require('sleep'),
    scraper_config = null,
    request = require('request'),
    Q = require('q'),

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
    },

    add_handlers = {};

add_handlers['story'] = function(article, callback) {
    console.log('Adding new article: ', article.title);
    articles.push(article);
    callback();
};

add_handlers['comment'] = function(comment, callback) {
    console.log('Adding new comment: ', comment.text);

    getParentArticle(comment).then(function(article){
            console.log('Saving comment with article...');

            comment.parentArticleId = article.id;

            var articleInCache = searchInCache(article.id);
            if (!articleInCache) {
                addItem(article, function(){});
            }
            articles.push(comment);

            console.log('call callback', callback);
            callback();

        }, function(error){
            console.log('Could not get parent article for comment ('+comment.id+'): ' + error);
        });
};

function searchInCache (id) {
    return articlesStorage.findIn(['new_articles', 'articles'], function(element, index, array){
        return element.id === id;
    });
}

function getParentItem(item, promise) {
    var parent = searchInCache(item.id);

    if (parent) {
        promise.resolve(parent);
    }
    else {
        getItem(item.parent, scraper_config, function(json, error){
            if (error) {
                promise.reject(new Error(error));
            }
            else {
                if (json.type !== 'story') {
                    console.log('Found parent comment with id: ' + json.id + '. Loading next parent...');
                    getParentItem(json, promise);
                }
                else {
                    console.log('Found parent article with id: ' + json.id);
                    promise.resolve(json);
                }
            }
        });
    }
}

function getParentArticle(comment) {
    var deferred = Q.defer();
    getParentItem(comment, deferred);
    return deferred.promise;
}

function addItem(item, callback) {
    var acceptedTypes = Object.keys(add_handlers);
    if (acceptedTypes.indexOf(item.type) !== -1 && !item.deleted) {
        return add_handlers[item.type](item, callback);
    }
}

function notifyNewArticles() {
    console.log('Notify new articles... at ', scraper_config.notifier_url);
    // http.post(scraper_config.notifier_url);
    request({
        uri: scraper_config.notifier_url,
        method: 'POST',
    }, function(error, response, body) {
        if (error) {
            console.log('Could not notify: ' + error);
        }
    });
}

function start() {
    var last_max_item = parseInt(articlesStorage.read('max_item', scraper_config.initial_max_item), 10);

    console.log('Scraper started with last article number: ', last_max_item);

    getMaxItem(scraper_config, function(current_max_item, error) {
        if (error) throw error;

        current_max_item = parseInt(current_max_item, 10);

        console.log('New max item: ', current_max_item);

        var new_articles = current_max_item - last_max_item;

        if (new_articles > 0) {
            for (i = last_max_item + 1; i <= current_max_item; i++) {
                (function(number) {
                    callbacks.push(function() {
                        getItem(number, scraper_config, function(item, error) {
                            if (!error) {
                                addItem(item, nextCallback);
                            }
                            else {
                                nextCallback();
                            }
                        });
                    });
                })(i);
            }

            articlesStorage.write('max_item', current_max_item);
            // articlesStorage.persistSync();
            nextCallback();
        } else {
            console.log('No new articles');
        }

    });

}

function nextCallback() {
    if (callbacks.length === 0) {
        // save articles
        var old_articles = articlesStorage.read('new_articles', []);
        old_articles = !old_articles || typeof old_articles === 'object' ? [] : old_articles;

        console.log("New articles before update: ", old_articles);

        articles.forEach(function(article) {
            old_articles.push(article);
        });
        articlesStorage.write('new_articles', old_articles);
        // articlesStorage.persistSync();

        console.log("New articles after update: ", articlesStorage.read('new_articles', []));

        if (articles.length > 0) {
            notifyNewArticles();
        }

        articles = [];

        sleep.sleep(2 * 60); // 2 min sleep

        start();
    } else {
        var callback = callbacks.pop();
        callback();
    }
}

module.exports = function(config) {
    scraper_config = config;

    articlesStorage = require('../utils').storage(scraper_config.articles_file);

    return {
        start: start
    };
};