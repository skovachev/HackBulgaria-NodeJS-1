var SitemapsService = require('../domain').SitemapsService,
    debug = require('debug')('Worker'),
    sleep = require('sleep'),
    urlTools = require('url'),
    request = require('request'),
    htmlparser = require("htmlparser"),
    select = require('soupselect').select,
    _ = require('underscore'),
    async = require('async'),
    startDepth = require('./config').startDepth;

var robots = require('robots'),
    parser = new robots.RobotsParser();

function parseBaseUrl(url) {
    var parsedUrl = urlTools.parse(url),
        path = parsedUrl.path,
        baseUrl = url.replace(path, '');

    return baseUrl;
}

function canParseAssertion(url, success, error) {
    debug('Check if robots allows to parse %s', url);

    var baseUrl = parseBaseUrl(url);

    parser.setUrl(baseUrl + '/robots.txt', function(parser, fileParsed) {
        if (fileParsed) {
            parser.canFetch('*', url, function(access) {
                if (access) {
                    success();
                } else {
                    debug('Url denied by robots.txt [%s]', url);
                    error();
                }
            });
        } else {
            // 'Could not find robots.txt' -> continue parsing
            success();
        }
    });
}

function parseLinksFromRawHtml(host, html, sitemap, done) {
    var handler = new htmlparser.DefaultHandler(function(err, dom) {
        if (err) {
            debug("Could not parse html. Error: " + err);
            done();
        } else {
            var links = select(dom, 'a[href*=' + host + ']'),
                parsed_urls = _(sitemap.sitemap).chain().pluck('url').uniq().value();

            debug('Total links found within same hostname: %d', links.length);

            var urls = _(links).chain().map(function(link) {
                var href = link.attribs.href,
                    parsedHref = urlTools.parse(href);

                // remove query string and trailing slash
                return href.replace(parsedHref.query, '').replace(/\/$/, '');
            }).uniq().value();

            var new_urls = _.difference(urls, parsed_urls);

            done(new_urls);
        }
    });

    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
}

function parseUrlLinks(url, depth, sitemap, done) {
    process.nextTick(function() {
        var parsedUrl = urlTools.parse(url),
            host = parsedUrl.hostname;

        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                parseLinksFromRawHtml(host, body, sitemap, done);
            } else {
                done(); // no links
            }
        });

    });
}

function saveCrawledUrlToSitemap(sitemap, url, links, done) {
    SitemapsService.addUrlToSitemap(sitemap._id, url, links, function(err, data) {
        if (err) {
            throw new Error(err);
        }
        done();
    });
}

function crawlUrl(url, depth, sitemap, done) {
    depth--;
    canParseAssertion(url, function() {

        parseUrlLinks(url, depth, sitemap, function(links) {
            debug('All links found for %s:', url, links);

            // save links to sitemap
            saveCrawledUrlToSitemap(sitemap, url, links, function() {
                if (depth > 0) {
                    // start async crawl other links
                    var callbacks = links.map(function(linkUrl) {
                        return function(callback) {
                            crawlUrl(linkUrl, depth, sitemap, callback);
                        };
                    });

                    async.series(callbacks, function(err, results) {
                        done();
                    });
                } else {
                    done();
                }
            });
        });

    }, function() {
        done(); // stop parsing
    });
}

function processSitemapJob(sitemap, done) {
    debug('Processing sitemap for url: %s', sitemap.url);

    crawlUrl(sitemap.url, startDepth, sitemap, function() {
        SitemapsService.updateSitemap(sitemap._id, {
            status: 'done'
        }, function(err, sitemap) {
            if (err) {
                throw new Error(err);
            }
            done();
        });
    });

}

function run() {
    SitemapsService.findPendingSitemap(function(err, sitemap) {
        if (!err) {
            if (sitemap) {
                processSitemapJob(sitemap, function() {
                    debug('Sitemap completed. Sleeping 2 secs...');
                    sleep.sleep(2);
                    process.nextTick(function() {
                        run();
                    });
                });
            } else {
                debug('No pending jobs found... Sleeping for a while...');
                sleep.sleep(10); // sec
                run();
            }
        } else {
            throw new Error(err);
        }
    });
}

module.exports = {
    run: run
};