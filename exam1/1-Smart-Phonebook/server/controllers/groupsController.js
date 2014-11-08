var ContactGroup = require('../models/ContactGroup'),
    responseFormatter = require('../services/responseFormatter')(['groupName', 'type', 'contacts', '_id'], 'group');

function sendError(res, errorText, errorCode) {
    errorCode = errorCode || 500;
    res.status(errorCode).json(responseFormatter.formatErrorResponse(errorText));
}

function sendResponse(res, data, responseCode) {
    responseCode = responseCode || 200;
    res.status(responseCode).json(responseFormatter.formatResponse(data));
}

function listAllGroups(req, res) {
    ContactGroup.find({}, function(err, groups) {
        if (err) {
            sendError(res, 'Could not list all groups');
        } else {
            sendResponse(res, groups);
        }
    });
}

module.exports = {
    listAllGroups: listAllGroups,
};