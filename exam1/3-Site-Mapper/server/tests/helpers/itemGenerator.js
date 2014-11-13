var urls = ['http://www.hackbulgaria.com', 'http://www.stefankovachev.com', 'http://www.reddit.com'];

function getRandomElement(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function generateUrl() {
    return getRandomElement(urls);
}

function generateSitemap() {
    return {
        url: generateUrl(),
    };
}

function generateCreatedSitemap() {
    return {
        status: 'currently crawling',
        sitemap: [{
            url: generateUrl(),
            links: []
        }]
    };
}

module.exports = {
    generateUrl: generateUrl,
    generateSitemap: generateSitemap,
    generateCreatedSitemap: generateCreatedSitemap
};