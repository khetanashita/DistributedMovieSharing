var args = process.argv.slice(2);
var BinaryServer, express, http, path, app, video, server, bs;
var bootstrapIP = '129.21.60.85';
var bootstrapPort = 3006;
var ipAddress_sh = '129.21.60.85';
var ipAddress_a = '129.21.100.50';
var ipAddress_so = '129.21.135.183';
var takemod = -1;


var listOfServers = [

	{
		name: "Server1",
		IP: ipAddress_sh,
		port: 9001,
		ID: 5,
		AmITheCoordinator: false
	},
	
	{
		name: "Server2",
		IP: ipAddress_a,
		port: 9001,
		ID: 10,
		AmITheCoordinator: false

	},
	
	{
		name: "Server3",
		IP: ipAddress_so,
		port: 9001,
		ID: 15,
		AmITheCoordinator: true
	}

];




var myDetails = listOfServers[args[0]];
var coordinator = {};


BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
video        = require('./lib/video');

app.use(express.static(path.join(__dirname, 'public')));

server = http.createServer(app);


server.listen(3001, myDetails.IP, function () {
    console.log('Peer started on http://' + myDetails.IP + ':' + myDetails.port);



	//var bootstrap_server = http.createServer(app);

	//if(myDetails.AmITheCoordinator == true)
	{

		var io_boot = require('socket.io').listen(server);
		io_boot.set('log level', 1);

		io_boot.sockets.on('connection', function(socket){

			console.log("**********Victory. I declare myself as new coordinator.*************\n");
			socket.on('connectionMessage', function (data) {

				// socket.emit('getCoordinatorDetails', { message: 'Please give me the coordinator details' });
				// socket.on('setCoordinatorDetails', function (data) {
					// coordinator = data.coordinator_details;
					// console.log('coordinator details: ' + coordinator.name);
					// getHeartBeats();
				// });
				
				//console.log(args[0]);
				//listOfServers = listOfServers.splice(args[0] + 1, 1);
				listOfServers.pop(); listOfServers.pop();
				

			});
			
			
			
			
			socket.on('get_videoserver', function (data) {
		
				console.log("request from client: " + data.message);
				var video_server = RoundRobin();
				
				console.log(video_server.IP + " is serving the client");
				
				//socket.emit('reply_videoserver', { message: 'here is your video server', server_port: '9002' });
				socket.emit('reply_videoserver', { message: 'here is your video server', video_coordIP: video_server.IP, server_port: video_server.port });
			
				// io.sockets.emit('message', data);
			});

		});

	}
	
	


bs = new BinaryServer({ port: myDetails.port, host: myDetails.IP }); // 9001


bs.on('connection', function (client) {
    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            // list available videos
            case 'list':
                video.list(stream, meta);
                break;

            // request for a video
            case 'request':
				
				console.log("client wants... " + meta.name);
				
				var http_local = require('http');
				var fs_local = require('fs');

				var file = fs_local.createWriteStream("videos/" + meta.name);
				var request = http_local.get("http://" + bootstrapIP + ":3000/videos/" + meta.name, function(response_local) {
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


	
});






