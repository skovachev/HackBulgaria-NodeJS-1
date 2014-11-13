var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SitemapUrlSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    links: [String]
}, {
    _id: false,
    id: false
});

var SitemapSchema = new Schema({
    status: {
        type: String,
        required: true,
        enum: ['done', 'currently crawling'],
        default: 'currently crawling'
    },
    sitemap: [SitemapUrlSchema],
}, {
    collection: 'sitemaps'
});

var Sitemap = mongoose.model('Sitemap', SitemapSchema);

module.exports = Sitemap;