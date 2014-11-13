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
        url: generateUrl(),
        status: 'currently crawling',
        sitemap: []
    };
}

module.exports = {
    generateUrl: generateUrl,
    generateSitemap: generateSitemap,
    generateCreatedSitemap: generateCreatedSitemap
};