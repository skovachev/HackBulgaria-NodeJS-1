var SitemapsController = require('../controllers/sitemapsController');

module.exports = function(app) {

    app.get('/sitemap', SitemapsController.showSitemap);
    app.post('/map', SitemapsController.createSitemap);

};