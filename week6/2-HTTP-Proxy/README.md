#Simple proxy server

This task was to create a simple proxy server. The server manages cookies sent from target URLs and makes sure these are sent when needed. Furthermore, all links in the target websites are modified to also go through the proxy.

For full description of the tasks click [here](Task.md).

## Running
Run `node proxy` to run the server. 
You can request an URL through the proxy by supplying an _url_ parameter. Please note that the _url_ parameter must be url-encoded.

Example: _http://localhost:3000/proxy?url=http://www.google.com_