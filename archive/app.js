/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';

var args = process.argv.slice(2); // get the port number from argument
// console.log(args[0]);
//var listOfServers = [ '129.21.60.158:9001', '9002'];
var listOfServers = [ '129.21.61.247:9001', '129.21.100.179:9001'];
var takemod = -1;

var host_ip = '129.21.61.247';


var BinaryServer, express, http, path, app, video, server, bs;

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
video        = require('./lib/video');

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server = http.createServer(app);

server.listen(3001, host_ip, function () {
    console.log('Video Server started on http://' + host_ip + ':3000');
});


// server.listen(3001, function () {
    // console.log('Video Server started on http://0.0.0.0:3001');
// });


// use socket.io
var io = require('socket.io').listen(server);

//turn off debug
io.set('log level', 1);

// define interactions with client
io.sockets.on('connection', function(socket){
    
	//socket.emit('reply', { message: 'welcome to the chat' });
	
	socket.on('get_videoserver', function (data) {
		
		console.log("request from client: " + data.message);
		var video_server = RoundRobin();
		
		console.log(video_server + " is serving the client");
		
		//socket.emit('reply_videoserver', { message: 'here is your video server', server_port: '9002' });
		socket.emit('reply_videoserver', { message: 'here is your video server', server_port: video_server });
	
        // io.sockets.emit('message', data);
    });
	
});




bs = new BinaryServer({ port: args[0], host: host_ip }); // 9001


bs.on('connection', function (client) {
    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            // list available videos
            case 'list':
                video.list(stream, meta);
                break;

            // request for a video
            case 'request':
			
				
				console.log("xxxxx aappp" + meta.name);
				
				
				var http_local = require('http');
				var fs_local = require('fs');

				var file = fs_local.createWriteStream("videos/" + meta.name);
				var request = http_local.get("http://" + host_ip + ":3000/videos/" + meta.name, function(response_local) {
				  response_local.pipe(file);
				  
				  file.on('finish', function() {
						
						video.request(client, meta);
					});
				  
				  
				  
				})
			
				
				
  
                
                break;

            // attempt an upload
            case 'upload':
            default:
                video.upload(stream, meta);
        }
    });
});



// run round robin for load balancing
function RoundRobin() 
{
	var numberOfServers = listOfServers.length;
	takemod = (takemod + 1) % numberOfServers;
	
	return listOfServers[takemod];
}
