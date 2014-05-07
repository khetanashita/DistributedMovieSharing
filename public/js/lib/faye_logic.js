var hostname = '129.21.62.166';
			
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



var client = new Faye.Client('http://' + hostname + ':8000/faye');

	
client.subscribe('/channel', function(message) {
	console.log(message.text);

	$('#messages').append('<p>' + message.text + '</p>');
});
			