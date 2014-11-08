var _ = require('underscore'),
    fields = ['personIdentifier', 'phoneNumber', '_id'],
    fillableFields = _.without(fields, '_id'),
    responseKey = 'contact',
    responseFormatter = require('../services/responseFormatter')(fields, responseKey),
    contactsService = require('../services/contactsService');

function sendError(res, errorText, errorCode) {
    errorCode = errorCode || 500;
    res.status(errorCode).json(responseFormatter.formatErrorResponse(errorText));
}

function sendResponse(res, data, responseCode) {
    responseCode = responseCode || 200;
    res.status(responseCode).json(responseFormatter.formatResponse(data));
}

function createContact(req, res) {
    var contactData = _.pick(req.body, fillableFields);
    contactsService.createContact(contactData, function(err, contact) {
        if (err) {
            sendError(res, 'Could not save contact');
        } else {
            sendResponse(res, contact, 201);
        }
    });
}

function updateContact(req, res) {
    var id = req.param("id"),
        contactData = _.pick(req.body, fillableFields);

    contactsService.updateContact(id, contactData, function(err, contact) {
        if (err || contact === null) {
            sendError(res, 'Could not save contact', 404);
        } else {
            sendResponse(res, contact);
        }
    });
}

function deleteContact(req, res) {
    var id = req.param("id");
    contactsService.deleteContact(id, function(err, contact) {
        if (err) {
            sendError(res, 'Could not find contact', 404);
        } else {
            sendResponse(res, contact);
        }
    });
}

function listAllContacts(req, res) {
    contactsService.listAllContacts(function(err, contacts) {
        if (err) {
            sendError(res, 'Could not list all contacts');
        } else {
            sendResponse(res, contacts);
        }
    });
}

function showContact(req, res) {
    var id = req.param("id");
    contactsService.findContact(id, function(err, contact) {
        if (err) {
            sendError(res, 'Could not find contact', 404);
        } else {
            sendResponse(res, contact);
        }
    });
}

module.exports = {
    createContact: createContact,
    updateContact: updateContact,
    deleteContact: deleteContact,
    listAllContacts: listAllContacts,
    showContact: showContact
};