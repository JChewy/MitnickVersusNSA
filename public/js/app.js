var socket = io(); 

socket.on('connect', function(){
	console.log('Connected to the socket.io server!')
}); 

socket.on('message', function (message) {
	var momentTimestamp = moment.utc(message.timestamp); 
	console.log('New message:' + message.text); 
	jQuery('.messages').append('<p><strong>' + momentTimestamp.local().format('h:mm a') + ' :</strong>' +message.text + '</p>'); 
}); 

var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	event.preventDefault(); 

	var $message = $form.find('input[name=messages]')

	socket.emit('message', {
		text: $message.val()
	}); 
$message.val(''); 

}); 