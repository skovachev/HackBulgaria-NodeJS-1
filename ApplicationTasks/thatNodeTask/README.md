##That node task

"That node task" is a node.js application in the middle of development. It consists of a basic CRUD REST Api that persists data in a database. Users are allowed to make the following requests:

- **GET** `/db` - returns all items in the database and a status code of **200** in the following format: `{ Result: [array of items] }`
- **GET** `/db/:id` - returns the item with the specified id `{ Result: {item} }`. If it is not found an error message and status code of **404** is returned. `{ Error: 'Item not found' }`
- **POST** `/db` - creates an item in the database. The item is supplied by giving a JSON object in the body of the request. An id is automatically assigned if one isn't given. The created item and a status code of **201** are returned `{ Result: {item} }`. If an "**id**" is given in the body, and it already exists in the db, an error and status code of **400** is returned `{ Error: 'Invalid item id <...>' }`.
- **POST** `/db/:id` - updates the item with the specified id. The item that will be used for the update is the JSON object in the body of the request. The id of the item isn't changed. The result of the request is the new item in the database `{ Result: {new_state_of_item} }`. If the item is not found an error message and status code of **404** is returned `{ Error: 'Item not found' }`.
- **DELETE** `/db` - deletes all items in the database. The result is the count of the items that were present in the database and a status code of **200** `{ Result: <Count> }`
- **DELETE** `/db/:id` - deletes an item by id. The result is the deleted item and a status code of **200** `{ Result: {deletedItem} }`

The QA has made sure that there are tests for the endpoints.

##Your job

Your job is to complete the application so that all tests pass. You should be able to complete the task by modifying only **2** of the files `Db.js` and `routing.js`. The developer has made it somewhat easier by writing some comments throughout the code.

##Hints
###Running the application
In order to run the application you should have node.js installed on your machine. You can download it from [http://nodejs.org/download/](http://nodejs.org/download/). After that running `node app.js` will start the server and listen on port `3000` 

> pro tip: make sure to run `npm install` inside the app directory.

###Manual endpoint testing
In order to test some requests against the running app, you can use[ Postman for chrome ](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm "Postman for Chrome"). Some sample requests can be imported from the following url. 
> https://www.getpostman.com/collections/b21cdfe5cf12474c8687`

###Running the tests

**Important** - you have to run the server first with `node app.js` before running the tests with `mocha`.

To run the tests you need to have installed node. You should run `npm install -g mocha` to install the mocha framework globally. After that, running `mocha` in the app root directory should execute the tests.

> If `mocha` isn't recognized make sure the global npm folder is added to the PATH variable.

###Db.js
This file contains the database api. It uses a simple file to persist the data. The main methods that are used to persist the data are `readItems` and `writeItems`, and all other methods should use them to persist the data. You can see how `addItem`, `getAll` and `getById` are implemented.

###routes.js
routes.js contains the initialization of the [http://expressjs.com/guide.html](http://expressjs.com/guide.html "express") routes - the skeleton of the server Api. The routes resolve parameters, call methods of the database api, handle possible errors and send the appropriate responses to the user. You can see how `get('/db/:id')` is implemented, for an example.

###Starting state
 
> The routes that handle **reading** items are fully implemented and their tests are passing. 

> The **create** item route is also implemented, but the tests show that there is a bug. You will need to check which assertions are failing, and fix the implementation. 

> All other routes are **not implemented**.

