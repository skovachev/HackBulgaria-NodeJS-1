/*global db*/
'use strict';

function setupRoutes(app) {

    /* Get single item from the database. Response should be in the following format
         {
            Result: (Object: Item with the specified id)
         }

     If the item doest not exist then an Error must be returned to the user.
         {
            Error: 'Item not found'
         }
     with a status code of 404.*/
    app.get('/db/:id', function (req, res, next) {
        var id = req.params.id;

        db.getById(id, function (err, item) {
            if (err) {
                if(err === 'Item not found'){
                    res.status(404).send({
                        Error: err
                    });
                } else {
                    next(err);
                }
            } else {
                res.status(200).send({
                    Result: item
                });
            }
        });
    });

    /* Get all items in the database. Response should be in the following format
     {
        Result: (Array of objects: all items in the database)
     } */
    app.get('/db', function (req, res, next) {
        db.getAll(function(err, items){
            if (err) {
                next(err); //HINT: calling next with an error automatically handles the error and sends a response to the user.
            } else {
                res.status(200).send({
                    Result: items
                });
            }
        });
    });

    /*Creates the item. Response should be in the following format:
         {
            Result: (Object: item that was created)
         }
     with a status code of 201.

    If another item exists with the same id we want to return:
        {
            Error: <errorMessage>
        }
    with a status code of 400.*/
    app.post('/db', function (req, res, next) {
        var item = req.body;
        db.addItem(item, function (err, createdItem) {
            /*
             HINT: If an error has occurred during saving the item, then the .add method calls it's callback with the error as a first parameter.
             This is an indication that something has gone wrong and we handle it.
             */
            if (err) {
                //HINT: in order for the tests to pass we should handle the error and send a custom response.
                next(err); //HINT: this is the default handling. It is routed to return a status code of 500.
            } else {
                res.status(200).send({
                    Result: createdItem
                });
            }
        });
    });

    app.post('/db/:id', function (req, res, next) {
        var id = req.params.id;
        var item = req.body;
        /*
         Updates the item with the specified id. Response should be in the following format:
             {
                 Result: (Object: New state of the item with the specified id)
             }
         If the item doest not exist then an error must be returned to the user.
            {
                Error: 'Item not found'
            }
         with a status code of 404.
         */
        next('routing.js: "Update by id" route handler not implemented');
    });

    app.delete('/db', function (req, res, next) {
        /*
         Delete all items in the database. Response should contain the count of the delete items like so:
             {
                Result: (Number: count of the items)
             }
         */
        next('routing.js: "Delete all items" route handler not implemented');

    });

    app.delete('/db/:id', function (req, res, next) {
        var id = req.params.id;
        /*
         Delete single item from the database by id. Response should contain the item that was deleted like so:
             {
                Result: (Object: item that was deleted)
             }
         If the item doest not exist then an error must be returned to the user.
             {
                Error: 'Item not found'
             }
         with a status code of 404.
         */
        next('routing.js: "Delete item by id" route handler not implemented');
    });
};

module.exports = {
    setup: setupRoutes
};