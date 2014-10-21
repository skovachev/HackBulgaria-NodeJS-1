var storage = require('./storage'),
    mailer = require('./mailer'),
    mongostorage = require('./mongostorage');

module.exports = {
    storage: storage,
    mailer: mailer,
    mongostorage: mongostorage
};