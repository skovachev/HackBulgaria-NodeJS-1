var subscribersStorage = null,
    articlesStorage = null,
    mailer = require('../mailer'),

    contentMatchesWords = function(content, words) {
        var regex = '/' + words.join('|') + '/gi';
        return content.match(regex) !== null;
    },

    createEmailContent = function(messages) {
        var content = 'Here\'s your list of new items on HackerNews: \n';

        messages.forEach(function(message) {
            content += message + '\n\n';
        });

        console.log('Email content: ', content);

        return content;
    },

    sendNotificationEmail = function(subscriber, messages, config) {
        console.log('Send email to subscriber: ' + subscriber.email + ', items: ' + messages.length);

        if (!subscriber.verified) {
            console.log('Subscriber is not verified - skipping...');
            return false;
        }

        var emailContent = createEmailContent(messages),
            content = {
                text: emailContent,
                html: emailContent.replace(/\n/g, '<br>')
            };
            

        mailer.sendEmail(subscriber, content, config.email.subject, config, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    };

var subscription_handlers = [];

// add articles email handler
subscription_handlers.push({
    shouldExecuteForSubscription: function (subscription) {
        return subscription.type.indexOf('story') !== -1;
    },

    matchesKeywords: function(article, keywords) {
        if (article.type !== 'story') {
            return false;
        }
        return contentMatchesWords(article.title, keywords);
    },

    createItemMessages: function (matched_articles) {
        var messages = [];

        matched_articles.forEach(function(article){
            var text = '(article)\n'+ article.title + ' - ' + article.url;

            messages.push(text);
        });

        return messages;
    }
});

// add comments email handler
subscription_handlers.push({
    shouldExecuteForSubscription: function (subscription) {
        return subscription.type.indexOf('comment') !== -1;
    },

    matchesKeywords: function(comment, keywords) {
        if (comment.type !== 'comment') {
            return false;
        }
        return contentMatchesWords(comment.text, keywords);
    },

    createItemMessages: function (matched_articles) {
        var messages = [];

        matched_articles.forEach(function(comment){
            var parentArticle = articlesStorage.findIn(['new_articles', 'articles'], function(element, index, array){
                return element.id === comment.parentArticleId;
            });

            var text = '(comment)\n'+ comment.text + '\n(in article)\n' + parentArticle.title + ' - ' + parentArticle.url;

            messages.push(text);
        });

        return messages;
    }
});

function markSentArticles(articles) {
    // mark articles as sent
    var old_articles = articlesStorage.read('articles', []);
    articles.forEach(function(article) {
        old_articles.push(article);
    });
    articlesStorage.write('articles', old_articles);
    articlesStorage.write('new_articles', []);
}

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
                var subscriber = subscribers[subscriber_id];

                if (subscriber.verified) { // send emails only to verified subscribers

                    var messages = [],
                        type_handlers = subscription_handlers.filter(function(subscription_handler){
                            return subscription_handler.shouldExecuteForSubscription(subscriber);
                        });

                    type_handlers.forEach(function(subscription_handler){
                        var matched_articles = [];

                        articles.forEach(function(article) {
                            if (subscription_handler.matchesKeywords(article, subscriber.keywords)) {
                                matched_articles.push(article);
                            }
                        });

                        if (matched_articles.length > 0) {
                            messages = messages.concat(subscription_handler.createItemMessages(matched_articles));
                        }
                    });

                    if (messages.length > 0) {
                        sendNotificationEmail(subscriber, messages, config);
                    }

                    // markSentArticles(articles);
                }
            });

            if (typeof callback === 'function') {
                callback();
            }
        }
    };
};