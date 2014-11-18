#Regular expression streams

The task is to create a Regular Expression stream and expose it through a simple HTTP interface.

For full description of the tasks click [here](Task.md).

## Running
Run `node server.js` to run the server. 
You can then make a POST request (for instance) to _http://localhost:3000/_.
 
Make sure to pass a _regex_ parameter to the query. All data send in the request body will be filtered using that regex you supplied.

Example: _http://localhost:3000/?regex=match_this_