var config = require('../config').globalscraper,
    scraper = require('./globalscraper')(config);

scraper.start();