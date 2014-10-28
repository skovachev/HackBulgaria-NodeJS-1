var GraphsController = require('../controllers/graphsController');

module.exports = function(app) {

    app.post('/createGraphFor', GraphsController.createGraphFor);

    app.get('/graph/:graphId', GraphsController.getGraph);

    app.get('/mutually_follow/:graphId/:username', GraphsController.getFollowingStatus);

};