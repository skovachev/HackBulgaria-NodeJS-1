var config = require('../config').scraper,
    scraper = require('./scraper')(config);

scraper.start();