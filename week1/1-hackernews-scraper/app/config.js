module.exports = {};

module.exports.subscriber = {
    'port': 3000,
    'storage_file': './temp/subscribers.json'
};

module.exports.notifier = {
    'port': 3001,
    'subscribers_file': './temp/subscribers.json',
    'articles_file': './temp/articles.json',

    'gmail': {
        'address': require('./gmail_credentials').email,
        'pass': require('./gmail_credentials').password
    },

    'email': {
        'from': 'HackerNews Mailer <nodejs@hackbulgaria.com>',
        'subject': 'New articles for you in HackerNews',
    }
};

module.exports.scraper = {
    'articles_file': './temp/articles.json',
    'max_item_url': 'https://hacker-news.firebaseio.com/v0/maxitem.json?pretty',
    'initial_max_item': 8453216,
    'article_url': 'https://hacker-news.firebaseio.com/v0/item/{id}.json?print=pretty',
    'notifier_url': 'http:/localhost:3001/newArticles'
};