/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';

var BinaryServer, express, http, path, app, video, server, bs, faye, server_faye;

var host_ip = '129.21.61.103';

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
video        = require('./lib/video');
faye 		 = require('faye');


// initialize the faye server
var bayeux = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
});

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.bodyParser()); // place data in req.body object	
app.use(express.static(path.join(__dirname, 'public')));




//bayeux.attach(app);


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server = http.createServer(app);




server.listen(3000, host_ip, function () {
    console.log('Video Server started on http://' + host_ip + ':3000');
});


server_faye = http.createServer(app);
bayeux.attach(server_faye);

server_faye.listen(8000, host_ip, function () {
    console.log('Video Server started on http://' + host_ip + ':8000');
});



// server.listen(3000, function () {
    // console.log('Video Server started on http://0.0.0.0:3000');
// });




// capture the posts from the different browsers then broadcast that request to all of the client listeners.
app.post('/message', function(req, res) {
    bayeux.getClient().publish('/channel', { text: req.body.message });
    console.log('broadcast message:' + req.body.message);
    res.send(200);
});



app.post('/kids', function(req, res) {
    bayeux.getClient().publish('/kids_channel', { text: req.body.message, vid_name: req.body.video });
    console.log('broadcast message:' + req.body.message);
    res.send(200);
});

app.post('/emotional', function(req, res) {
    bayeux.getClient().publish('/emotional_channel', { text: req.body.message });
    console.log('broadcast message:' + req.body.message);
    res.send(200);
});

app.post('/funny', function(req, res) {
    bayeux.getClient().publish('/funny_channel', { text: req.body.message });
    console.log('broadcast message:' + req.body.message);
    res.send(200);
});

app.post('/romantic', function(req, res) {
    bayeux.getClient().publish('/romantic_channel', { text: req.body.message });
    console.log('broadcast message:' + req.body.message);
    res.send(200);
});

app.post('/sports', function(req, res) {
    bayeux.getClient().publish('/sports_channel', { text: req.body.message });
    console.log('broadcast message:' + req.body.message);
    res.send(200);
});




bs = new BinaryServer({ port: 9000 });


bs.on('connection', function (client) {
    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            // list available videos
            case 'list':
                video.list(stream, meta);
                break;

            // request for a video
            case 'request':
				console.log("xxxxx");
				
				// var io = require('socket.io-client'),
				// socket = io.connect('localhost', {
					// port: 3001
				// });

				// //var socket = io.connect('http://localhost:3001');
				
				// socket.on('reply', function (data) {
					
					// console.log(data);
					
				// });
	
	
				// socket.emit('request', { message: 'give me this video' });
  
  
                //video.request(client, meta);
                break;

            // attempt an upload
            case 'upload':
            default:
                video.upload(stream, meta);
        }
    });
});






// use socket.io
var io = require('socket.io').listen(server);

//turn off debug
io.set('log level', 1);

var test_var = -1;

// define interactions with client
io.sockets.on('connection', function(socket){
    
	// socket.emit('reply', { message: 'welcome to the chat' });
	
	// get the entry point from bootstrap
	
	
	var reply_coord = function(data) 
	{
		console.log(data);
		socket.emit('reply_coordinator', { server_port: '3001' });
	};
	
	
	socket.on('get_coordinator', reply_coord);
	
	
	
	
	
	
	// socket.on('request', function (data) {
		
		// test_var++;
		
		// if(test_var % 2 == 0)
		// {
			// socket.emit('reply', { server_port: '9001' });
		// }
		// else
		// {
			// socket.emit('reply', { server_port: '9002' });
		// }
		
		// console.log(test_var);
	
        // // io.sockets.emit('message', data);
    // });
	
});

