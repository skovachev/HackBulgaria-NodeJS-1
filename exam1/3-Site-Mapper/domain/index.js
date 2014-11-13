var config = require('./config/database'),
    mongoose = require('mongoose');

mongoose.connect(config.url);

var Sitemap = require('./models/Sitemap'),
    SitemapsService = require('./services/sitemapsService');

module.exports = {
    Sitemap: Sitemap,
    SitemapsService: SitemapsService,
    mongoose: mongoose
};