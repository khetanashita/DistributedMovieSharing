var hostname = '129.21.60.85';
var my_subscriptions = [];
			
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


function NotifyClients(video_category, vid_name)
{
	var url = 'http://' + hostname + ':3000/' + video_category;
	var message = {message: 'NEW ' + video_category + ' video uploaded!!!... Watch it now.', video: vid_name};
	var dataType = 'json';
	$.ajax({
	  type: 'POST',
	  url: url,
	  data: message,
	  dataType: dataType,
	});

	console.log("notification sent to client");
}


var client = new Faye.Client('http://' + hostname + ':8000/faye');
var client_retained = client;

function SubscribeTo()
{
	var channel_name = $('#categorie_list').val();
	
	client_retained.subscribe('/' + channel_name + '_channel', function(message) {

		$('#notify').slideUp(function() {
			
				my_subscriptions.push(message.vid_name);
				
				my_subscriptions = $.unique(my_subscriptions); // save only one copy of file name
				console.log(my_subscriptions);
				SetUpSubscriptionList();
				
				$('#notify').html(message.text).slideDown();
				
				
				
		  });
		
	});
	
	
	
}



function UnsubscribeTo()
{
	var channel_name = $('#categorie_list_unsubs').val();
	
	//console.log("UNNN sent to client");
	
	client_retained.unsubscribe('/' + channel_name + '_channel');
}

/*
	
client.subscribe('/channel', function(message) {

	$('#messages').append('<p>' + message.text + '</p>');
});*/
