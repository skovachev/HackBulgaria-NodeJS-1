var mongoose = require('mongoose'),
    collection = 'subscribers',
    Schema = mongoose.Schema;

var SubscriberSchema = new Schema({
  _id: String,
  email : String,
  keywords : [String],
  type: [String],
  verified: Boolean,
  subscriberId: String
}, { collection: collection });

var SubscriptionConfirmationSchema = new Schema({
  subscriber_id: String,
  token : String
}, { collection: 'subscription_confirmations' });

var Subscriber = mongoose.model('Subscriber', SubscriberSchema);
var SubscriptionConfirmation = mongoose.model('SubscriptionConfirmation', SubscriptionConfirmationSchema);

module.exports = function(url) {
    mongoose.connect(url);

    return {
        addSubscriber: function(data, done) {
            data._id = data.subscriberId;
            var sub = new Subscriber(data);
            sub.save(function(err){
                done(sub);
            }); // err
        },

        removeSubscriber: function(data, done) {
            Subscriber.findOneAndRemove({ '_id': data.subscriberId }, function(removed){
                done(removed);
            });
        },

        saveSubscriptionToken: function(token, subscriber_id, done) {
            var confirmation = SubscriptionConfirmation({
                subscriber_id: subscriber_id,
                token: token
            });
            confirmation.save(done);
        },

        getConfirmationToken: function(subscriber_id, done) {
            SubscriptionConfirmation.findOne({subscriber_id: subscriber_id}, function(err, confirmation){
                done(confirmation.token);
            });
        },


        verifySubscriber: function(subscriptionId, done) {
            var query = Subscriber.findOne({ '_id': subscriptionId });
            query.exec(function(err, subscriber){
                subscriber.verified = true;
                subscriber.save(function(err){
                    done(subscriber);
                });
            }); // err, subscriber
        },

        getAllSubscribers: function(done) {
            Subscriber.find(function(subscribers){
                done(subscribers);
            });
        }
    };
};