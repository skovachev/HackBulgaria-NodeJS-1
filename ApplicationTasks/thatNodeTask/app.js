'use strict';
var Server = require('./server');
var Db = require('./Db');

(function() {
    var server = new Server();
    var db = new Db('database');
    db.initialize(function(err) {
        if(err){
            console.log('Error initializing database');
            console.log(err);
            return;
        }
        console.log('Database initialized.');
        server.initialize();
        server.start();
    });
    global.db = db;
}());
