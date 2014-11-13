var default_fields = ['_id'],
    default_key = 'item',
    _ = require('underscore');

module.exports = function(item_fields, item_key) {
    var fields = item_fields || default_fields,
        key = item_key || default_key;

    function formatItem(response) {
        if (_.isArray(response)) {
            return _.map(response, function(item) {
                return _.pick(item, fields);
            });
        } else if (_.isString(response)) {
            return response;
        } else {
            return _.pick(response, fields);
        }
    }

    function formatErrorResponse(text) {
        return formatResponse(text, 'error');
    }

    function formatResponse(item, response_key) {
        var response = {};
        response_key = response_key || key;
        response[response_key] = formatItem(item);
        return response;
    }

    return {
        formatItem: formatItem,
        formatErrorResponse: formatErrorResponse,
        formatResponse: formatResponse
    };
};