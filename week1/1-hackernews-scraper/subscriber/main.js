var express = require('express'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    subscriber = require('./mongoSubscriber')(config),
    app = express();

app.use(bodyParser.json());

app.post('/subscribe', function(req, res) {
    var subscriber_info = req.body;
    subscriber.subscribe(subscriber_info, function(result){
        res.json(result);
    });
});

app.post('/unsubscribe', function(req, res) {
    var subscriber_info = req.body;
    subscriber.unsubscribe(subscriber_info, function(result){
        res.json(result);
    });
});

app.get('/listSubscribers', function(req, res) {
    var subscribers = subscriber.listSubscribers(function(subscribers){
        res.json(subscribers);
    });
});

app.get('/confirmSubscription', function(req, res) {
    var subscriptionKey = req.query.subscriptionId,
        subscriptionToken = req.query.subscriptionToken;

    console.log('Confirm subscription: ' + subscriptionKey + ', ' + subscriptionToken);

    if (typeof subscriptionKey === 'undefined' || typeof subscriptionToken === 'undefined') {
        res.status(500).send('Subscription data is invalid');
    } else {
        subscriber.confirmSubscription(subscriptionKey, subscriptionToken, function(){
            res.send('Yout subscription has been confirmed!');
        });
    }
});

var server = app.listen(config.port, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Subscriber listening at http://%s:%s', host, port);

});