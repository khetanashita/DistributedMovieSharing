/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';

var BinaryServer, express, http, path, app, video, server, bs, faye, server_faye;

var host_ip = '129.21.60.85';

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
    //console.log('Video Server started on http://' + host_ip + ':3000');
});


server_faye = http.createServer(app);
bayeux.attach(server_faye);

server_faye.listen(8000, host_ip, function () {
    //console.log('Video Server started on http://' + host_ip + ':8000');
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
				//console.log("xxxxx");
				
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
	
	
	//console.log("Get the entry");
	
	var reply_coord = function(data) 
	{
		console.log("client request " + data.message);
		//socket.emit('reply_coordinator', { server_port: '3001' });
		socket.emit('reply_coordinator', { coord_ip: coordinator_details.IP, server_port: coordinator_details.port });
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


bayeux.on('subscribe', function(clientId,channel) {
if(channel!=null){
console.log("Client has subscribed to "+channel);
}
  // event listener logic
})

bayeux.on('unsubscribe', function(clientId,channel) {
if(channel!=null){
console.log("Client has unsubscribed to "+channel);
}
  // event listener logic
})




//=======================================================

// bootstrap server implementation

var ipAddress_sh = '129.21.60.85';
var ipAddress_a = '129.21.100.50';
var ipAddress_so = '129.21.135.183';

var listOfServers = [

	{
		name: "Server1",
		IP: ipAddress_sh,
		port: 3001,
		ID: 5,
		AmITheCoordinator: false
	},
	
	{
		name: "Server2",
		IP: ipAddress_a,
		port: 3001,
		ID: 10,
		AmITheCoordinator: false

	},
	
	{
		name: "Server3",
		IP: ipAddress_so,
		port: 3001,
		ID: 15,
		AmITheCoordinator: true
	}

];


var coordinator_details = listOfServers[2];


var bootstrap_server = http.createServer(app);

bootstrap_server.listen(3006, host_ip, function () {
    console.log('Bootstrap Server started on http://' + host_ip + ':3006');
});


// var io_boot = require('socket.io').listen(bootstrap_server);
// io_boot.set('log level', 1);

// io_boot.sockets.on('connection', function(socket){

	// console.log("connected bootstrap");
	
	// socket.on('getCoordinatorDetails', function (data) {
	
		// console.log("get coordinator request from client: " + data.message);
		// socket.emit('setCoordinatorDetails', { coordinator_details: coordinator_details });
    
	// });
	
	// socket.on('disconnect', function () {
	
		// console.log("I am asdfkljashdfks ");
    
	// });
	
	
// });




ConnectCoord(coordinator_details);


function ConnectCoord(coordinator_details)
{
	var ioClnt = require('socket.io-client');
	var socket_client = ioClnt.connect('http://' + coordinator_details.IP + ':' + coordinator_details.port); // connect to bootstrap
	
	if(coordinator_details.name !== "Server3")
	{
		socket_client.emit('connectionMessage', { message: 'Please ask me for details... !' });
	}
	
	
	// socket_client.on('getCoordinatorDetails', function (data) {
		
		// console.log("get coordinator request for client: " + data.message);
		// socket_client.emit('setCoordinatorDetails', { coordinator_details: coordinator_details });

	// });

	socket_client.on('disconnect', function () {
		
		console.log("coordinator is down. election started. ");
		startElection();
	});
}

	
	
function startElection() {
	
	console.log("getting servers with higher identifiers ");
	for(var i = 0; i < listOfServers.length; i++)
	{
		if(listOfServers[i].name === coordinator_details.name)
		{
			listOfServers.splice(i,1);
			break;
		}
	}
	
	
	coordinator_details = listOfServers[listOfServers.length - 1];
	console.log(coordinator_details.name + " found with highest identifier.");
	ConnectCoord(coordinator_details);
	console.log("\n");
}


