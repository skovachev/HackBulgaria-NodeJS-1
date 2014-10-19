var subscribersStorage = null,
    articlesStorage = null,
    mailer = require('../utils').mailer,

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
            

        mailer.sendEmail(subscriber, content, config.email_subject, config.from_email, function (error, info) {
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

    forType: 'story',

    textField: 'title',

    createMessage: function(article) {
        return '(article)\n'+ article.title + ' - ' + article.url;
    }

});

// add comments email handler
subscription_handlers.push({

    forType: 'comment',

    textField: 'text',

    createMessage: function(comment) {
        var parentArticle = articlesStorage.findIn(['new_articles', 'articles'], function(element, index, array) {
            return element.id === comment.parentArticleId;
        });

        return '(comment)\n' + comment.text + '\n(in article)\n' + parentArticle.title + ' - ' + parentArticle.url;
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
    subscribersStorage = require('../utils').storage(config.subscribers_file);
    articlesStorage = require('../utils').storage(config.articles_file);

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
                            return subscriber.type.indexOf(subscription_handler.forType) !== -1;
                        });

                    type_handlers.forEach(function(subscription_handler){
                        var matched_items = [],
                            textField = subscription_handler.textField;

                        articles.forEach(function(article) {
                            var couldMatchWords = article.type === subscription_handler.type && typeof article[subscription_handler.textField] !== 'undefined';

                            if (couldMatchWords && contentMatchesWords(article[subscription_handler.textField], subscriber.keywords)) {
                                matched_items.push(article);
                            }
                        });

                        if (matched_items.length > 0) {
                            matched_items.forEach(function(item){
                                messages.push(subscription_handler.createMessage(item));
                            });
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