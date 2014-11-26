#Chat server

Implement a simple chat server supporting some form of simple user identification(authentication would be a nice plus). That means each user should have a unique nickname. Multiple users connected to the server should be able to see each other's messages.

To see full task description click [here](Task.md)

## Solution
The solution consists of 4 modules. All connections between them are made through Socket.io sockets. The modules are:

* __server__ - this is the chat server module. It act as a central instance that handles all connections and managed users within rooms.
* __web_client__ - presents a web interface for the chat
* __console_client__ - presents a console interface for the chat
* __base_client__ - contains shared functionality by all client modules 

## Running the app
Make sure to run `npm install` in all module folders.

In the web client module (_clients/web_) you'd need to run `bower install` to load all frontend modules the app needs.

You'll need to run the server by typing `node server`.

### Web client
To connect through the web client you'll need to start the web client interface. Enter `node clients/web` and you'll find the UI at _http://localhost:8080/_.

### Console client
To run the console client just type `node clients/console`.

