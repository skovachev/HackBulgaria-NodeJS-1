#Video consumer

For a description of the task click [here](Task.md).

## Installation 
Make sure to run `npm install` in the folders of both modules (__streamer__ and __consumer__).

##Streamer
To start the streamer run `node streamer`.

The __streamer__ module has been updated to include a simple image streamer. This object streams the same image over and over instead of taking the images from a web camera. 

This is a most simple solution for some systems that can't use the normal streamer module.

To run the module using the video camera streamer type:

```
node streamer/streamer.js
```

##Consumer
The __consumer__ module connects to the socket provided by the __streamer__ module and handles the streamed images further.
It provides a couple of different outputs realized through streams:

* output in the console using _ImageToStdOutTransformStream_
* output to a file using _ImageToFileWriteStream_

To run the consumer type `node consumer`



