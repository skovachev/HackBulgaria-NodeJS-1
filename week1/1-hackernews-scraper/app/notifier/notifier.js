var subscribersStorage = null,
    articlesStorage = null,
    mailer = require('../mailer'),

    contentMatchesWords = function(content, words) {
        var regex = '/' + words.join('|') + '/gi';
        return content.match(regex) !== null;
    },

    createEmailContent = function(articles) {
        var content = 'Here\'s your list of new articles on HackerNews: \n';

        articles.forEach(function(article) {
            content += article.title + ' - ' + article.url + '\n';
        });

        console.log('Email content: ', content);

        return content;
    },

    sendArticlesEmail = function(subscriber, articles, config) {
        console.log('Send email to subscriber: ' + subscriber.email + ', articles: ' + articles.length);

        if (subscriber.verified) {
            return false;
        }

        var content = {
                text: emailContent,
                html: emailContent.replace(/\n/g, '<br>')
            },
            emailContent = createEmailContent(articles);

        mailer.sendEmail(subscriber, content, config.email.subject, config, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    };

module.exports = function(config) {
    subscribersStorage = require('../storage')(config.subscribers_file);
    articlesStorage = require('../storage')(config.articles_file);

    return {
        notifySubscribers: function(callback) {
            console.log('Notifying subscribers...');

            var subscribers = subscribersStorage.read('subscriptions', {}),
                articles = articlesStorage.read('new_articles', []);

            console.log('Subscriptions:', subscribers);
            console.log('New articles: ', articles);

            Object.keys(subscribers).forEach(function(subscriber_id) {
                var subscriber = subscribers[subscriber_id],
                    matched_articles = [];

                articles.forEach(function(article) {
                    if (contentMatchesWords(article.title, subscriber.keywords)) {
                        matched_articles.push(article);
                    }
                });

                if (matched_articles.length > 0) {
                    sendArticlesEmail(subscriber, matched_articles, config);
                }

                // mark articles as sent
                var old_articles = articlesStorage.read('articles', []);
                articles.forEach(function(article) {
                    old_articles.push(article);
                });
                articlesStorage.write('articles', old_articles);
                articlesStorage.write('new_articles', []);
            });

            if (typeof callback === 'function') {
                callback();
            }
        }
    };
};