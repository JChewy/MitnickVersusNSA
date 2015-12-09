var name = getQueryVariable('name') || 'Anonymous'; 
var room = getQueryVariable('room'); 
var socket = io(); 

console.log(name + 'wants to join ' + room); 


// jQuery('.room-title').text(room); 


socket.on('connect', function(){
	console.log('Connected to the socket.io server!')
	socket.emit('joinRoom', {
		name: name, 
		room: room, 
		});
	}); 

	socket.on('message', function (message) {
		var momentTimestamp = moment.utc(message.timestamp); 
		var $message = jQuery('.console'); 

		$message.append('<p><strong> > '+   message.name + ' ' + momentTimestamp.local().format('h:mm a : ') + '</strong>'+ message.text +'</p>')
}); 


var $form = jQuery('#command-prompt');

$form.on('submit', function (event) {
	event.preventDefault(); 

	var $message = $form.find('input[name=commands]')

 	$(".console").scrollTop($(".console")[0].scrollHeight);

	socket.emit('message', {
		name: name, 
		text: $message.val()
	}); 
$message.val(''); 

}); 