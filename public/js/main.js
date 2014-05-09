$(document).ready(function () {
    var $video, $box, $progress, $list;
	var name;
	
	var host_ip = '129.21.63.103';
	var video_category = "rock";
	

    $video    = $('#video');
    $box      = $('#upload-box');
    $progress = $('#progress');
    $list     = $('#list');

    $video.attr({
        controls : true,
        autoplay : true
    });

    client.on('open', function () {
        video.list(setupList);

        $box.on('dragenter', fizzle);
        $box.on('dragover', fizzle);
        $box.on('drop', setupDragDrop);
    });

    client.on('stream', function (stream) {
	
		console.log("in stream");
		
        video.download(stream, function (err, src) {
            $video.attr('src', src);
        });
    });
	
	
	
	
	
	//var socket = io.connect('http://localhost:3000'); // connect to bootstrap
	
	//var socket = io.connect('http://129.21.61.0:3000'); // connect to bootstrap
	var socket = io.connect('http://' + host_ip + ':3000'); // connect to bootstrap

    function setupList(err, files) {
        var $ul, $li;

        $list.empty();
        $ul   = $('<ul>').appendTo($list);

        files.forEach(function (file) {
            $li = $('<li>').appendTo($ul);
            $a  = $('<a>').appendTo($li);

            $a.attr('href', '#').text(file).click(function (e) {
                fizzle(e);

				name = $(this).text();
				
				console.log(name);
				
				//var coordinator = "";
				
				socket.emit('get_coordinator', { message: 'give me the video server coordinator'});
                
            });
        });
    }

    function setupDragDrop(e) {
        fizzle(e);

        var file, tx;

        file = e.originalEvent.dataTransfer.files[0];
        tx   = 0;
		
		

        video.upload(file, function (err, data) {
            var msg;
			
			

            if (data.end) {
                msg = "Upload complete: " + file.name;

                video.list(setupList);
            } else if (data.rx) {
                msg = Math.round(tx += data.rx * 100) + '% complete';

            } else {
                // assume error
                msg = data.err;
            }

            $progress.text(msg);
            
            if (data.end || data.err) {
                setTimeout(function () {
                    $progress.fadeOut(function () {
                        $progress.text('Drop file here');
                    }).fadeIn();
                }, 5000);
            }
        });
		
		
		GetTheCategory();
		console.log(video_category);
		NotifyClients(video_category);
    }
	
	
	
	function get_video(port)
	{
		//console.log(port);
		video.request(name, port);
	}
	
	
	
	socket.on('reply_coordinator', function (data) {
		
		
					console.log(data.server_port);
		
					//coordinator = data.server_port;
					//socket.disconnect();
					
					// var socket_to_coordinator = io.connect('http://localhost:' + data.server_port);
					// var socket_to_coordinator = io.connect('http://129.21.61.0:' + data.server_port);
					var socket_to_coordinator = io.connect('http://' + host_ip + ':' + data.server_port);
					
					socket_to_coordinator.emit('get_videoserver', { message: 'give me the video server'});
					
					socket_to_coordinator.on('reply_videoserver', function (data_coord) {
					
						//console.log(data_coord.server_port);
					
						//video.request(name, data_coord.server_port);
						
						//socket_to_coordinator.disconnect();
						
						get_video(data_coord.server_port);
					
					});
					
		
		
		
		
	});
	
	
	function GetTheCategory()
	{
		video_category = $('#categorie_list').val();
	}
	
	
	
	
	
	
	
});
