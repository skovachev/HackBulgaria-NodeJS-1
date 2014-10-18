module.exports = {};

var gmail_credentials = {
        'address': require('./gmail_credentials').email,
        'pass': require('./gmail_credentials').password
    },
    from_email = 'HackerNews Mailer <nodejs@hackbulgaria.com>';

module.exports.subscriber = {
    'confirm_subscription_url': 'http://localhost:3000/confirmSubscription',
    'port': 3000,
    'storage_file': './temp/subscribers.json',

    'gmail': gmail_credentials,

    'email': {
        'from': from_email,
        'subject': 'Please confirm your subscription',
    },
};

module.exports.notifier = {
    'port': 3001,
    'subscribers_file': './temp/subscribers.json',
    'articles_file': './temp/articles.json',

    'gmail': gmail_credentials,

    'email': {
        'from': from_email,
        'subject': 'New articles for you in HackerNews',
    }
};

module.exports.scraper = {
    'articles_file': './temp/articles.json',
    'max_item_url': 'https://hacker-news.firebaseio.com/v0/maxitem.json?pretty',
    'initial_max_item': 8453216,
    'item_url': 'https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty',
    'notifier_url': 'http://localhost:3001/newArticles'
};