var _ = require('underscore'),
    fields = ['sitemap', 'status', '_id'],
    fillableFields = ['url'],
    responseKey = 'sitemap',
    responseFormatter = require('../services/responseFormatter')(fields, responseKey),
    SitemapsService = require('../../domain').SitemapsService;

function sendError(res, errorText, errorCode) {
    errorCode = errorCode || 500;
    res.status(errorCode).json(responseFormatter.formatErrorResponse(errorText));
}

function sendResponse(res, data, responseCode) {
    responseCode = responseCode || 200;
    res.status(responseCode).json(responseFormatter.formatResponse(data));
}

function createSitemap(req, res) {
    var sitemapData = _.pick(req.body, fillableFields);
    SitemapsService.createSitemap(sitemapData, function(err, sitemap) {
        if (err) {
            sendError(res, 'Could not save sitemap');
        } else {
            sendResponse(res, sitemap, 201);
        }
    });
}

function showSitemap(req, res) {
    var id = req.param("id");
    SitemapsService.findSitemap(id, function(err, sitemap) {
        if (err) {
            sendError(res, 'Could not find sitemap', 404);
        } else {
            sendResponse(res, sitemap);
        }
    });
}

module.exports = {
    createSitemap: createSitemap,
    showSitemap: showSitemap
};