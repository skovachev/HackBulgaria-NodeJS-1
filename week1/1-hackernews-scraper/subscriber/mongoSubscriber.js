var storage = null,
    key_generator = require('generate-key'),
    mailer = require('../utils').mailer;

function createConfirmationLinkForEmail(subscriptionId, token, config) {
    return config.confirm_subscription_url + '?subscriptionId=' + subscriptionId + '&subscriptionToken=' + token;
}

function generateConfirmationToken(subscriptionId, done) {
    // save in storage and return
    var token = key_generator.generateKey();
    storage.saveSubscriptionToken(token, subscriptionId, function(){
        done(token);
    });
}

function generateConfirmationEmailContent(subscriber, link) {
    var content = "Please click the below link to confirm your subscription: \n" + link;
    return content;
}

function sendConfirmationEmail(subscriber, config) {
    generateConfirmationToken(subscriber.subscriberId, function(token){
        var link = createConfirmationLinkForEmail(subscriber.subscriberId, token, config),
            content = generateConfirmationEmailContent(subscriber, link);

        mailer.sendEmail(subscriber, content, config.email_subject, config, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    });
        
}

module.exports = function(config) {
    storage = require('./storage')(config.mongoConnectionUrl);

    return {
        subscribe: function(info, done) {
            var generated_id = key_generator.generateKey(),
                subscription_type = info.type;

            if (typeof subscription_type === 'string') {
                subscription_type = [subscription_type];
            } else if (typeof subscription_type === 'undefined') {
                subscription_type = ['story'];
            }

            if (!(subscription_type instanceof Array)) {
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

            storage.addSubscriber(subscription, function(err){
                if (!err) {
                    sendConfirmationEmail(subscription, config);
                }

                done(err, {
                    "email": info.email,
                    "subscriberId": generated_id
                });
            });
        },

        unsubscribe: function(info, done) {
            var subscriberId = info.subscriberId;

            if (typeof subscriptions[subscriberId] !== 'undefined') {
                delete subscriptions[subscriberId];
            }

            storage.removeSubscriber(info, function(removed){
                done(info);
            });
        },

        listSubscribers: function(done) {
            storage.getAllSubscribers(done);
        },

        confirmSubscription: function(subscriptionId, subscriptionToken, done) {
            storage.getConfirmationToken(subscriptionId, function(savedToken){
                if (savedToken === subscriptionToken) {
                    storage.verifySubscriber(subscriptionId, done);
                }
                else {
                    done();
                }
            });
            
        }
    };
};