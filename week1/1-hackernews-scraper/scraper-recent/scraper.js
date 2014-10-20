var articlesStorage = null,
    scraper_config = null,

    request = require('request'),
    Q = require('q'),
    Scraper = require('../scraper'),

    articles = [],
    add_handlers = {};

add_handlers['story'] = function(article, done) {
    console.log('Adding new article: ', article.title);
    articles.push(article);
    done();
};

add_handlers['comment'] = function(comment, done) {
    console.log('Adding new comment: #' + comment.id);

    var scraper = this;

    getParentArticle.apply(this, [comment]).then(function(article) {
        console.log('Saving comment with article: #' + article.id);

        comment.parentArticleId = article.id;

        var articleInCache = searchInCache(article.id);
        if (!articleInCache) {
            addItem.apply(scraper, [article, function() {}]);
        }
        articles.push(comment);

        done();

    }, function(error) {
        console.log('Could not get parent article for comment (' + comment.id + '): ' + error);
    });
};

function searchInCache(id) {
    return articlesStorage.findIn(['new_articles', 'articles'], function(element, index, array) {
        return element.id === id;
    });
}

function getParentArticle(comment) {
    return this.getParentItemOfType(comment, 'story');
}

function addItem(item, done) {
    var acceptedTypes = Object.keys(add_handlers);
    if (acceptedTypes.indexOf(item.type) !== -1 && !item.deleted) {
        return add_handlers[item.type].apply(this, [item, done]);
    } else {
        done();
    }
}

function notifyNewArticles() {
    console.log('Notify new articles... at ', scraper_config.notifierUrl);

    request({
        uri: scraper_config.notifierUrl,
        method: 'POST',
    }, function(error, response, body) {
        if (error) {
            console.log('Could not notify: ' + error);
        }
    });
}

function saveScrapedItems() {
    var old_articles = articlesStorage.read('new_articles', []);

    articles.forEach(function(article) {
        old_articles.push(article);
    });
    articlesStorage.write('new_articles', old_articles);

    console.log('Collected items saved in database');
}

module.exports = function(options) {
    scraper_config = options;

    articlesStorage = require('../utils').storage(options.articlesFile);

    options.handleResponse = function(response, done) {
        console.log('Scraper: response received');
        addItem.apply(this, [response, done]);
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

    options.trackingFile = options.articlesFile;

    var scraper = new Scraper(options);

    return scraper;
};