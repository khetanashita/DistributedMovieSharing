var hostname = '129.21.62.129';
			
var $chat = $('#chat');
$('#fire').on('click', function() {

	// avoid No 'Access-Control-Allow-Origin' header is present on the requested resource.
	var url = 'http://' + hostname + ':3000/message';
	
	var message = {message: 'Client 1: ' + $chat.val()};
	var dataType = 'json';
	$.ajax({
	  type: 'POST',
	  url: url,
	  data: message,
	  dataType: dataType,
	});
	$chat.val('');
});


function NotifyClients(video_category)
{

	var url = 'http://' + hostname + ':3000/' + video_category;
	
	var message = {message: video_category + ' video uploaded'};
	var dataType = 'json';
	$.ajax({
	  type: 'POST',
	  url: url,
	  data: message,
	  dataType: dataType,
	});
	

	console.log("notification sent to client");
}


//var client = new Faye.Client('http://' + hostname + ':8000/faye');
var client = new Faye.Client('http://' + hostname + ':8000/faye', {
    timeout: 120
});

client.disable('autodisconnect');

var client_retained = client;

function SubscribeTo()
{

	var channel_name = $('input[name=video_category]').val();
	
	console.log(channel_name);
	
	client_retained.subscribe('/' + channel_name + '_channel', function(message) {

		$('#messages').append('<p>' + message.text + '</p>');
	});
	
	
}




	
client.subscribe('/channel', function(message) {

	$('#messages').append('<p>' + message.text + '</p>');
});



// client.subscribe('/kids_channel', function(message) {

	// $('#messages').append('<p>' + message.text + '</p>');
// });


// client.subscribe('/emotional_channel', function(message) {

	// $('#messages').append('<p>' + message.text + '</p>');
// });


// client.subscribe('/funny_channel', function(message) {

	// $('#messages').append('<p>' + message.text + '</p>');
// });


// client.subscribe('/romantic_channel', function(message) {

	// $('#messages').append('<p>' + message.text + '</p>');
// });


// client.subscribe('/sports_channel', function(message) {

	// $('#messages').append('<p>' + message.text + '</p>');
// });
			