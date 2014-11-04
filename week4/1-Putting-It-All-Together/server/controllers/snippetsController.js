var Snippet = require('../models/Snippet'),
    mongoose = require('mongoose'),
    db_config = require('../config/database'),
    _ = require('underscore'),
    langMap = require('language-map'),
    path = require('path');

mongoose.connect(db_config.url);

function detectLanguage(ext, done) {
    var found = null;
    Object.keys(langMap).forEach(function(lang) {
        var extensions = langMap[lang].extensions;
        if (_.indexOf(extensions, ext) !== -1) {
            found = lang;
        }
    });
    if (found) {
        done(null, found);
    }
    else {
        done('Could not detect language');
    }
}

function parseData(data, done) {
    if (typeof data['language'] !== 'undefined') {
        done(data);
    }
    else {
        detectLanguage(path.extname(data['filename']), function (err, language) {
            if (!err && language) {
                data['language'] = language;
            }
            done(data);
        });
    }
    
}

function formatResponse(response) {
    var fields = ['creator', 'content', 'language', 'filename', "_id"];
    if (_.isArray(response)) {
        return _.map(response, function(item) {
            return _.pick(item, fields);
        });
    } else {
        return _.pick(response, fields);
    }
}

function sendError(res, errorText, errorCode) {
    errorCode = errorCode || 500;
    res.status(errorCode).json({
        error: errorText
    });
}

function sendResponse(res, data, responseCode) {
    responseCode = responseCode || 200;
    res.status(responseCode).json({
        snippet: formatResponse(data)
    });
}

function createSnippet(req, res) {
    var fields = ['creator', 'content', 'language', 'filename'];
    var snippetData = _.pick(req.body, fields);

    parseData(snippetData, function(snippetData) {
        var snippet = new Snippet(snippetData);

        snippet.save(function(err, snippet, numberAffected) {
            if (err) {
                sendError(res, 'Could not save snippet');
            } else {
                sendResponse(res, snippet, 201);
            }
        });
    });
}

function updateSnippet(req, res) {
    var snippetId = req.param("snippetId"),
        fields = ['creator', 'content', 'language', 'filename'],
        snippetData = _.pick(req.body, fields);

    parseData(snippetData, function(snippetData) {
        Snippet.findOneAndUpdate({
            _id: snippetId
        }, snippetData, function(err, snippet) {
            if (err || snippet === null) {
                sendError(res, 'Could not save snippet', 404);
            } else {
                sendResponse(res, snippet);
            }
        });
    });
}

function deleteSnippet(req, res) {
    var snippetId = req.param("snippetId");
    Snippet.findByIdAndRemove(snippetId, function(err, snippet) {
        if (err) {
            sendError(res, 'Could not find snippet', 404);
        } else {
            sendResponse(res, snippet);
        }
    });
}

function listAllSnippets(req, res) {
    Snippet.find({}, function(err, snippets) {
        if (err) {
            sendError(res, 'Could not list all snippets');
        } else {
            sendResponse(res, snippets);
        }
    });
}

function listAllSnippetsByCreator(req, res) {
    var username = req.param("username");
    Snippet.find({
        creator: username
    }, function(err, snippets) {
        if (err) {
            sendError(res, 'Could not list all snippets for user ' + username);
        } else {
            sendResponse(res, snippets);
        }
    });
}

function showSnippet(req, res) {
    var snippetId = req.param("snippetId");
    Snippet.findOne({
        _id: snippetId
    }, function(err, snippet) {
        if (err) {
            sendError(res, 'Could not find snippet', 404);
        } else {
            sendResponse(res, snippet);
        }
    });
}

module.exports = {
    createSnippet: createSnippet,
    updateSnippet: updateSnippet,
    deleteSnippet: deleteSnippet,
    listAllSnippets: listAllSnippets,
    listAllSnippetsByCreator: listAllSnippetsByCreator,
    showSnippet: showSnippet
};