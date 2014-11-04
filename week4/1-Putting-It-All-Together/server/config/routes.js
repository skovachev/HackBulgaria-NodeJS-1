var SnippetsController = require('../controllers/snippetsController'),
    MainController = require('../controllers/mainController');

module.exports = function(app) {

    app.post('/create-snippet', SnippetsController.createSnippet);
    app.put('/update-snippet/:snippetId', SnippetsController.updateSnippet);
    app.delete('/delete-snippet/:snippetId', SnippetsController.deleteSnippet);
    app.get('/list', SnippetsController.listAllSnippets);
    app.get('/list-by-creator/:username', SnippetsController.listAllSnippetsByCreator);
    app.get('/list/:snippetId', SnippetsController.showSnippet);

    app.get('/status', MainController.showStatus);

};