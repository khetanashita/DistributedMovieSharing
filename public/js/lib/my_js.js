function ToggleList()
{
	
}


$( "#show_list" ).change(function() {
	//alert( $('#show_list').val() );
	
	if($('#show_list').val() == "my_subscription")
	{
		$('#list').hide();
		$('#subscribed_list').show();
	}
	else
	{
		$('#subscribed_list').hide();
		$('#list').show();
	}
	
});



// only setting up the list. video playing is not yet available.
function SetUpSubscriptionList()
{
	$list = $('#subscribed_list');
	var $ul, $li;

	$list.empty();
	$ul = $('<ul>').appendTo($list);
	
	$.each( my_subscriptions, function( key, value ) {
	
		$li = $('<li>').appendTo($ul);
        $a  = $('<a>').appendTo($li);
		$a.attr('href', '#').text(value);
	  
	});
}