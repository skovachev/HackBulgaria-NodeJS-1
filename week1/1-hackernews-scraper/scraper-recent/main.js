var config = require('./config'),
    scraper = require('./scraper')(config);

scraper.start();