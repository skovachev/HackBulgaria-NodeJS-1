var UsersController = require('../controllers/usersController');

module.exports = function(app) {

    app.post('/login', UsersController.loginUser);
    app.post('/register', UsersController.registerUser);

};