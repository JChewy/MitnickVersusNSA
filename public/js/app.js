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
		if(message.text==='hello'){
		console.log('hello'); 
	}
}); 


//makes sure the div scrolls on the socket specific callbacks
function autoscroll() {
	    setInterval(function () {
        var iScroll = $(window).scrollTop();
        iScroll = iScroll + 200;
        $('html, .console').animate({
            scrollTop: iScroll
        }, 1000);
    }, 100);

}

autoscroll(); 


var $form = jQuery('#command-prompt');
//autoscrolls the div whenever a message is typed
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

