var PORT = process.env.PORT || 4000; 
var express = require('express'); 
var app = express(); 
var http = require('http').Server(app); 
var io = require('socket.io')(http); 

app.use(express.static(__dirname + '/public')); 

io.on('connection', function (socket) {
	console.log('Client has connected'); 

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text); 

		io.emit('message', message); 
	}); 

	socket.emit('message', {
		name: 'System', 
		text: "welcome to the chat application",
	}); 

})

http.listen(PORT, function(){
	console.log('server started on port:' + PORT)
})