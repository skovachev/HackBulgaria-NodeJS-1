var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();

// app.use('/client', serveStatic(__dirname + '/ChatClient.js'));

app.use(serveStatic(__dirname)).listen(8080);