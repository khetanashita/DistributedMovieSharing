# Video Uploading and Streaming with Node.js
A video streaming application running on distributed servers. This project was done as a part of distributed systems course at Rochester Institute of Technology.

Application is hosted on ExpressJS. And each video server is running BinaryJS server.

Load balancing is done using Round Robin method.
Failure handling is implemented using Bully Algorithm.

Faye is used to provide Pub/Sub functionality. Whenever user uploads any video all the subscribers are notified about it.


      
