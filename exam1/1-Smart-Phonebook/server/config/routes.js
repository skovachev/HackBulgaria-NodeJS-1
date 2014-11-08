var ContactsController = require('../controllers/contactsController'),
    GroupsController = require('../controllers/groupsController'),
    MainController = require('../controllers/mainController');

module.exports = function(app) {

    // contact related routes
    app.get('/contacts/list', ContactsController.listAllContacts);
    app.get('/contacts/:id', ContactsController.showContact);
    app.post('/contacts/create', ContactsController.createContact);
    app.delete('/contacts/delete/:id', ContactsController.deleteContact);
    app.put('/contacts/update/:id', ContactsController.updateContact);
    
    // contact group related routes
    app.get('/groups/list', GroupsController.listAllGroups);

    // service status route
    app.get('/status', MainController.showStatus);

};