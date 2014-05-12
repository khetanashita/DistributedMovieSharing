var hostname, client;

//hostname = window.location.hostname;
hostname = '129.21.135.183';
client   = new BinaryClient('ws://' + hostname + ':9000');


function fizzle(e) {
    e.preventDefault();
    e.stopPropagation();
}

function emit(event, data, file) {
    file       = file || {};
    data       = data || {};
    data.event = event;
	
	if(data.server_port !== undefined)
	{
		//
		
		
		//client_get_video   = new BinaryClient('ws://' + hostname + ':' + data.server_port);
		
		client_get_video   = new BinaryClient('ws://' + data.server_port);
		
		client_get_video.on('open', function () {
			
		//	console.log("asdfasdfdsf");
			//return client_get_video.send(file, data);
			
			client.send =  client_get_video.send(file, data);
			
			return client.send;
			
			
		});
		
		
		client_get_video.on('stream', function (stream) {
	
			//console.log("in stream");
			
			$video    = $('#video');
			
			video.download(stream, function (err, src) {
				$video.attr('src', src);
			});
		});
		
		client_get_video.on('close', function() {
			
			client_get_video.close();
		});
		
		
		
		
	}
	else
	{
		return client.send(file, data);
	}
	
	

	return client.send(file, data);
		
	}
	
    
}
