var config = require('./config'),
    scraper = require('./globalscraper')(config);

scraper.start();