var storage = null,
    key_generator = require('generate-key');

module.exports = function(config) {
    storage = require('../storage')(config.storage_file);

    return {
        subscribe: function(info){
            var subscriptions = storage.read('subscriptions', {}) || {},
                generated_id = key_generator.generateKey();

            subscriptions[generated_id] = {
                "email": info.email,
                "keywords": info.keywords,
                "subscriberId": generated_id
            };

            storage.write('subscriptions', subscriptions);

            return {
                "email": info.email,
                "subscriberId": generated_id
            };
        },

        unsubscribe: function(info){
            var subscriptions = storage.read('subscriptions', {}) || {},
                subscriberId = info.subscriberId;

            if (typeof subscriptions[subscriberId] !== 'undefined')
            {
                delete subscriptions[subscriberId];
            }

            return info;
        },

        listSubscribers: function(){
            var subscriptions = storage.read('subscriptions', {}) || {},
                subs = [];

            Object.keys(subscriptions).forEach(function(key){
                subs.push(subscriptions[key]);
            });

            return subs;
        }
    };
};