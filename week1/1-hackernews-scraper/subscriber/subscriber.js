var storage = null,
    key_generator = require('generate-key'),
    mailer = require('../utils').mailer;

function createConfirmationLinkForEmail(subscriptionId, token, config) {
    return config.confirm_subscription_url + '?subscriptionId=' + subscriptionId + '&subscriptionToken=' + token;
}

function generateConfirmationToken(subscriptionId) {
    // save in storege and return
    var confirmations = storage.read('confirmations', {}),
        token = key_generator.generateKey();

    confirmations[subscriptionId] = token;
    storage.write('confirmations', confirmations);

    return token;
}

function generateConfirmationEmailContent(subscriber, link) {
    var content = "Please click the below link to confirm your subscription: \n" + link;
    return content;
}

function sendConfirmationEmail(subscriber, config) {
    var token = generateConfirmationToken(subscriber.subscriberId),
        link = createConfirmationLinkForEmail(subscriber.subscriberId, token, config),
        content = generateConfirmationEmailContent(subscriber, link);

    mailer.sendEmail(subscriber, content, config.email.subject, config, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

module.exports = function(config) {
    storage = require('../utils').storage(config.storage_file);

    return {
        subscribe: function(info) {
            var subscriptions = storage.read('subscriptions', {}),
                generated_id = key_generator.generateKey(),
                subscription_type = info.type;

            if (typeof subscription_type === 'string') {
                subscription_type = [subscription_type];
            } else if (typeof subscription_type === 'undefined') {
                subscription_type = ['story'];
            }

            if (! (subscription_type instanceof Array)) {
                return {
                    "error": 'Invalid subscription type'
                };
            }

            var subscription = {
                "email": info.email,
                "keywords": info.keywords,
                "subscriberId": generated_id,
                'type': subscription_type,
                'verified': false
            };

            subscriptions[generated_id] = subscription;

            storage.write('subscriptions', subscriptions);

            sendConfirmationEmail(subscription, config);

            return {
                "email": info.email,
                "subscriberId": generated_id
            };
        },

        unsubscribe: function(info) {
            var subscriptions = storage.read('subscriptions', {}) || {},
                subscriberId = info.subscriberId;

            if (typeof subscriptions[subscriberId] !== 'undefined') {
                delete subscriptions[subscriberId];
            }

            return info;
        },

        listSubscribers: function() {
            var subscriptions = storage.read('subscriptions', {}) || {},
                subs = [];

            Object.keys(subscriptions).forEach(function(key) {
                subs.push(subscriptions[key]);
            });

            return subs;
        },

        confirmSubscription: function(subscriptionId, subscriptionToken) {
            var savedToken = storage.read('confirmations', {})[subscriptionId];
            if (savedToken === subscriptionToken) {
                var subscriptions = storage.read('subscriptions', {});

                if (typeof subscriptions[subscriptionId] !== 'undefined') {
                    subscriptions[subscriptionId].verified = true;
                    storage.write('subscriptions', subscriptions);
                }
            }
        }
    };
};