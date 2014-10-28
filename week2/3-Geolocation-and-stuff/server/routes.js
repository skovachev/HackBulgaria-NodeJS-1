var LocationsController = require('./controllers/locationsController');

module.exports = function(app) {
    app.post('/locations', LocationsController.createLocation);
    app.get('/locations', LocationsController.findLocations);
};