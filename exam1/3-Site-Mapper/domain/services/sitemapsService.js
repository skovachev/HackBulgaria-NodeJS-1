var Sitemap = require('../models/Sitemap'),
    debug = require('debug')('SitemapsService');

module.exports = {
    createSitemap: function(sitemapData, done) {
        var url = sitemapData.url,
            item = {
                url: url,
                status: 'currently crawling',
                sitemap: []
            };

        Sitemap.findOne({url: url}, function(err, sitemap){
            if (err) {
                done(err);
            }
            else if (sitemap) {
                done(err, sitemap);
            }
            else {
                sitemap = new Sitemap(item);
                sitemap.save(function(err, created_sitemap) {
                    if (!err) {
                        done(err, created_sitemap);
                    } else {
                        done(err);
                    }
                });
            }
        });
    },

    updateSitemap: function(id, sitemapData, done) {
        Sitemap.findOne({
            _id: id
        }, function(err, sitemap) {
            if (!err) {
                var before = new Sitemap(sitemap);

                Object.keys(sitemapData).forEach(function(key) {
                    sitemap[key] = sitemapData[key];
                });

                sitemap.save(function(err, after) {
                    if (!err) {
                        done(err, after);
                    } else {
                        done(err);
                    }
                });
            } else {
                done(err);
            }
        });
    },

    addUrlToSitemap: function(id, url, done) {
        Sitemap.findOne({
            _id: id
        }, function(err, sitemap) {
            if (!err) {
                var before = new Sitemap(sitemap);

                Object.keys(sitemapData).forEach(function(key) {
                    sitemap[key] = sitemapData[key];
                });

                sitemap.save(function(err, after) {
                    if (!err) {
                        done(err, after);
                    } else {
                        done(err);
                    }
                });
            } else {
                done(err);
            }
        });
    },

    listAllSitemaps: function(done) {
        Sitemap.find({}, done);
    },

    findSitemap: function(id, done) {
        Sitemap.findOne({
            _id: id
        }, done);
    }
};