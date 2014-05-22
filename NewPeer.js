/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';
var args = process.argv.slice(2);
var BinaryServer, express, http, path, app, video, server, bs;
var ipAddress = '129.21.61.26';
var bootstrapIP = '129.21.61.26';
var bootstrapPort = 3006;
var myDetails;

var server1Details = {
	name: "Server1",
	IP: ipAddress,
	port: 3005,
	ID: 5,
	AmITheCoordinator: false
}

var server2Details = {
	name: "Server2",
	IP: ipAddress,
	port: 3010,
	ID: 10,
	AmITheCoordinator: false
}

var server3Details = {
	name: "Server3",
	IP: ipAddress,
	port: 3015,
	ID: 15,
	AmITheCoordinator: false
}

var los = [server1Details, server2Details, server3Details];
var myDetails = los[args[0]];
var coordinator = {};


express      = require('express');
http         = require('http');
path         = require('path');
app          = express();

app.use(express.static(path.join(__dirname, 'public')));

server = http.createServer(app);



server.listen(myDetails.port, ipAddress, function () {
    console.log('Peer1 started on http://' + ipAddress + ':' + myDetails.port);

// use socket.io
var io = require('socket.io').listen(server);
io.set('log level', 1);



// if(!myDetails.AmITheCoordinator) {
	// io.sockets.on('connection', function(socket){
	// socket.emit('reply', { message: 'What is the request?' });
	// var timeoutObj = setTimeout(startElection, 5000);
	// var end = Date.now() + 5000;
	// if (Date.now() < end) {
		// socket.on('request', function (data) {
		// clearTimeout(timeoutObj);
		// console.log("got request from client: " + data.message);
		// socket.emit('reply', { message: 'here is your video...!!! '});
    	// });
	// }

	// socket.on('election', function (data) {
		// console.log('I got the election message');
		// var id = +data.message;
		// if(myDetails.ID>id) {
			// socket.emit('stop', { message: 'yes' });
			// broadcastMyVictory();
		// }
		// else {
			// socket.emit('stop', { message: 'no' });
		// }
    // });

    // socket.on('electedLeader', function (data) {
		// setCoordinator(data.newCoordinator);
    // });

    // socket.on('removalCoordinator', function (data) {
		// node = data.removeThisServer;
		// var index = los.indexOf(coordinator);
		// if (index > -1) {
    		// los.splice(index, 1);
		// }
    // });

// });
// }
// else {
	// io.sockets.on('connection', function(socket){
	// socket.emit('ping', { message: 'Im here' });
	// });
// }






});







// client down

console.log("xxxxxxxxx");

var ioClnt = require('socket.io-client');
var socket_client = ioClnt.connect('http://' + bootstrapIP + ':' + bootstrapPort); // connect to bootstrap
socket_client.emit('getCoordinatorDetails', { message: 'Please give me the coordinator details' });
socket_client.on('setCoordinatorDetails', function (data) {
	coordinator = data.coordinator_details;
	console.log('coordinator details: ' + coordinator.name);
	continuousPingToCoordinator();
});



// if(myDetails.ID == coordinator.ID) {
	// myDetails.AmITheCoordinator = true;
	// console.log('I am the coordinator!!');
// }
// else { 
	// myDetails.AmITheCoordinator = false;
	// console.log('I am not a coordinator... :(');
// }

// function setCoordinator(serverDetails) {
	// coordinator = serverDetails;
	// return;
// }

// function getListOfServers() {
	// return los;
// }

// function broadcastMyVictory() {
	// for(var i=0; i<los.length; i++) {
		// var io_client_inner = require('socket.io-client');
		// var socket_client_inner = io_client_inner.connect('http://' + los[i].IP + ':' + los[i].port);
		// socket_client_inner.emit('electedLeader', { newCoordinator : myDetails});
	// }
// }

function startElection() {
	console.log("I am jadoo!!!!!");
	
	
	for(var i = 0; i < los.length; i++)
	{
		if(los[i].name === coordinator.name)
		{
			los.splice(i,1);
			break;
		}
	}
	
	
	
	
	broadcastFallOfTheLeader();



	// var temp = server1Details;
	// for(var i=0; i<los.length; i++) {
		// if(myDetails.ID<los[i].ID) {
			// temp = los[i];
		// }
	// }
	// sendElectionMessage(temp);

}

function broadcastFallOfTheLeader() {
	for(var i=0; i<los.length; i++) 
	{
	
		if(los[i].name != myDetails.name)
		{
			console.log("broadcasting to " + los[i].IP + ':' + los[i].port);
			var io_client_inner = require('socket.io-client');
			var socket_client_inner = io_client_inner.connect('http://' + los[i].IP + ':' + los[i].port);
			socket_client_inner.emit('removalCoordinator', { removeThisServer : coordinator});
		
		}
		
	}
}

// function sendElectionMessage(listofservers) {

	// var io_client_inner = require('socket.io-client');
	// var socket_client_inner = io_client_inner.connect('http://' + listofservers.IP + ':' + listofservers.port); // connect to bootstrap
	// socket_client_inner.emit('election', { message: '' + myDetails.ID});
	// socket_client_inner.on('stop', function (data) {
		// if(data.message == "yes") {
			// //stopElection.push(1);
			// console.log('got a stop message');
			// setCoordinator(listofservers);
		// }
		// else if (data.message == "no") {
			// //stopElection.push(0);
			// console.log('got a message that said no');
			// setCoordinator(server1Details);
			// myDetails.AmITheCoordinator = true;
			// broadcastMyVictory();
		// }	
	// });
// }

function continuousPingToCoordinator() {

	console.log(coordinator.IP);
	var io_client_inner = require('socket.io-client');
	//while(true) 
	{
		var socket_client_inner = io_client_inner.connect('http://'+ coordinator.IP + ':' + coordinator.port);
		socket_client_inner.emit('test', { newCoordinator : "test"});
		
		
		// var timeoutObj = setTimeout(startElection, 5000);
		// var end = Date.now() + 5000;
		// if (Date.now() < end) {
			// socket_client_inner.on('ping', function (data) {
				// clearTimeout(timeoutObj);
				// console.log("got reply from coordinator: " + data.message);
	    	// });
		// }
		
		
		
		socket_client_inner.on('disconnect',function(){
		   console.log('user disconnected');
			
			startElection();
			
		});
	}	
}

