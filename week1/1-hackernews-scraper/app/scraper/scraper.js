var articlesStorage = null,
    loopIsWaiting = false,
    https = require('https'),
    http = require('http'),
    sleep = require('sleep'),
    scraper_config = null,
    request = require('request'),

    callbacks = [],
    articles = [],

    getMaxItem = function(config, callback){
        var url = config.max_item_url;
        console.log('Getting new max item from url: ', url);
        https.get(url, function(res){
            res.on('data', function(data) {
                callback(data);
            });
        }).on('error', function(e){
            callback(null, e);
        });
    },

    getArticle = function(id, config, callback){
        var url = config.article_url.replace(/\{id\}/, id);

        console.log('Loading article with id: ', id, ', and url: ', url);

        https.get(url, function(res){
            res.on('data', function(data) {
                callback(JSON.parse(data));
            });
        }).on('error', function(e){
            callback(null, e);
        });
    };

function addArticle(article){
    if (article.type === 'story' && !article.deleted){
        console.log('Adding new article: ', article.title);
        articles.push(article);
    }
}

function notifyNewArticles(){
    console.log('Notify new articles... at ', scraper_config.notifier_url);
    // http.post(scraper_config.notifier_url);
    request({ uri: scraper_config.notifier_url,
        method:'POST',
        data: ''
    }, function (error, response, body) {});
}

function start(){
    var last_max_item = parseInt(articlesStorage.read('max_item', scraper_config.initial_max_item), 10);

    console.log('Scraper started with last article number: ', last_max_item);

    getMaxItem(scraper_config, function(current_max_item, error){
        if (error) throw error;

        current_max_item = parseInt(current_max_item, 10);

        console.log('New max item: ', current_max_item);

        var new_articles = current_max_item - last_max_item;

        if (new_articles > 0){
            for (i = last_max_item + 1; i <= current_max_item; i++){
                (function(number){
                    callbacks.push(function(){
                        getArticle(number, scraper_config, function(article, error){
                            addArticle(article);
                            nextCallback();
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

function nextCallback(){
    if (callbacks.length === 0){
        // save articles
        var old_articles = articlesStorage.read('new_articles', []);
        old_articles = !old_articles || typeof old_articles === 'object' ? [] : old_articles;

        console.log("New articles before update: ", old_articles);

        articles.forEach(function(article){
            old_articles.push(article);
        });
        articlesStorage.write('new_articles', old_articles);
        // articlesStorage.persistSync();

        console.log("New articles after update: ", articlesStorage.read('new_articles', []));

        if (articles.length > 0){
            notifyNewArticles();
        }

        articles = [];

        sleep.sleep(2*60); // 2 min sleep

        start();
    } else {
        var callback = callbacks.pop();
        callback();
    }
}

module.exports = function(config) {
    scraper_config = config;

    articlesStorage = require('../storage')(scraper_config.articles_file);

    return {
        start: start
    };
};