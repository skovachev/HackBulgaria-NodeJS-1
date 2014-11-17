# Who follows you back on GitHub

The task was to build a application that creates a directed graph of a users's connections on Github. It also allows users to run simple analysis operations on the collected data, which are exposed via a JSON API.

For full description of the tasks click [here](Task.md).


## Installation

To install the app run `npm install` in the all module folders (_graph_, _graph-source-github_, _graph-source-json_, _graph-mongodb_, _server_).

## Solution
The application is divided in several modules, each with its own set of dependancies.

* the __graph__ module contains the graph structure the application is using to respresent data
* the are 3 "source" type modules - __graph-source-json__, __graph-source-mongodb__, __graph-source-github__. These modules allow the application to load a directed graph from a different source (as you would have guessed these sources are a JSON object, a mongodb database and the Github API). Possible scenarios that can be built using this architecture are:
	* Loading a user's graph from Github and saving it in a MongoDB database
	* Loading a user's graph from a MongoDB database and serializing it to a JSON object for API consumption
	* ... other combinations ...
* lastly, there is a __server__ module that exposes some operations through an API


## Running the app
Run the server using `node server`, which would allow you to send requests to _http://0.0.0.0:1337_.
Make sure that _mongod_ is also running.