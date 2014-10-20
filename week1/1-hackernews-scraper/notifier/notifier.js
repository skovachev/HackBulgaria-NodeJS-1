var subscribersStorage = null,
    articlesStorage = null,
    mailer = require('../utils').mailer,

    contentMatchesWords = function(content, words) {
        var regex = '/' + words.join('|') + '/gi';
        return content.match(regex) !== null;
    },

    createEmailContent = function(messages) {
        var content = 'Here\'s your list of new items on HackerNews: \n\n';

        messages.forEach(function(message) {
            content += message + '\n\n';
        });

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


        mailer.sendEmail(subscriber, content, config.email_subject, config.from_email, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
            console.log('\n------------------\n\n');
        });
    };

var subscription_handlers = {};

// add articles email handler
subscription_handlers['story'] = {

    textField: 'title',

    createMessage: function(article) {
        return '(article)\n' + article.title + ' - ' + article.url;
    }
};

// add comments email handler
subscription_handlers['comment'] = {

    textField: 'text',

    createMessage: function(comment) {
        var parentArticle = articlesStorage.findIn(['new_articles', 'articles'], function(element, index, array) {
            return element.id === comment.parentArticleId;
        });

        return '(comment)\n' + comment.text + '\n(in article)\n' + parentArticle.title + ' - ' + parentArticle.url;
    }
};

function markSentArticles(articles) {
    console.log('Marking articles as sent.');

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
                items = articlesStorage.read('new_articles', []);

            console.log('Number of subscriptions: ' + Object.keys(subscribers).length);
            console.log('Number of new items: ' + items.length);

            Object.keys(subscribers).forEach(function(subscriber_id) {
                var subscriber = subscribers[subscriber_id];

                if (subscriber.verified) { // send emails only to verified subscribers

                    console.log('Processing subscription for: ' + subscriber.email);

                    var messages = [];

                    items.forEach(function(item) {
                        if (subscriber.type.indexOf(item.type) !== -1) {
                            // subscriber is interested in this item

                            var type_handler = subscription_handlers[item.type];

                            // if item type can be handled
                            if (type_handler) {
                                var couldMatchWords = typeof item[type_handler.textField] !== 'undefined';

                                // if item matches subscription keywords
                                if (couldMatchWords && contentMatchesWords(item[type_handler.textField], subscriber.keywords)) {
                                    // add item to email
                                    messages.push(type_handler.createMessage(item));
                                }
                            }
                        }

                    });

                    console.log(messages.length + ' new items found for subscription.');

                    if (messages.length > 0) {
                        sendNotificationEmail(subscriber, messages, config);
                    }
                }

                markSentArticles(items);
            });

            if (typeof callback === 'function') {
                callback();
            }
        }
    };
};