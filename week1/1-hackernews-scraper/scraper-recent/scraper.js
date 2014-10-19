var articlesStorage = null,
    scraper_config = null,

    request = require('request'),
    Q = require('q'),

    articles = [],
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

function getParentArticle(comment) {
    return scraper.getParentItemOfType(comment, 'story');
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

function saveScrapedItems() {
    var old_articles = articlesStorage.read('new_articles', []);
    // old_articles = !old_articles || typeof old_articles === 'object' ? [] : old_articles;

    articles.forEach(function(article) {
        old_articles.push(article);
    });
    articlesStorage.write('new_articles', old_articles);

    console.log('New items saved in database');
}

module.exports = function(options) {
    scraper_config = config;

    articlesStorage = require('../utils').storage(options.articles_file);

    options.handleResponse = function(response, callback) {
        console.log('Scraper: response received');
        addItem(response, callback);
    };

    options.onFeedEndReached = function() {
        saveScrapedItems();

        if (articles.length > 0) {
            console.log('Notifying subscribers');
            notifyNewArticles();
        }

        articles = [];
    };

    options.checkInCache = function(id) {
        return searchInCache(id);
    };

    options.trackingFile = options.articles_file;
    options.sleepAfterNoItems = 2 * 60; // 2 min
    options.startingNumber = options.initial_max_item;

    var scraper = new Scraper(options);

    return scraper;
};