# Site mapper

The task is to expose an HTTP API for requesting site maps.

## Task details
The task details can be found [here](Task.md)

## Solution

The solution of this task consists of 3 modules

* __Domain__: contains all domain objects used by the other modules
* __Server__: exposes an API to submit new sitemap generation jobs, and also to load a specific sitemap by its id
* __Worker__: a brackground process that handles sitemap generation jobs added to the database

### Installation
Run `npm install` in each of the module folders

### Running
Make sure to run `mongod` before starting any of the modules. The connection URL used by the application can be found in _domain/config/database.js_. 

To run the server type `node server`.

To run the worker type `node worker`.

### Debug output
To enable debug output for any module set `DEBUG=*` like so:

```
DEBUG=* node worker
```

    

