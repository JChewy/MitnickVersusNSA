var PORT = process.env.PORT || 4000; 
var express = require('express'); 
var app = express(); 
var http = require('http').Server(app); 
var io = require('socket.io')(http); 

app.use(express.static(__dirname + '/public')); 

var clientInfo = {}; 

io.on('connection', function (socket) {
	console.log('Client has connected'); 

	socket.on('disconnect', function () {
		var userData = clientInfo[socket.id]; 
		if(typeof userData !== 'undefined' ) {
			socket.leave(userData.room); 
			io.to(userData.room).emit('message', {
				name: 'System', 
				text: userData.name + ' has left'
			}); 
			delete clientInfo[socket.id]; 
		}
	}); 

	socket.on('joinRoom', function (req){
		clientInfo[socket.id] = req; 
		socket.join(req.room); 
		socket.broadcast.to(req.room).emit('message',{
			name:'System', 
			text: req.name + ' has joined!', 
		}); 

	}); 

	socket.on('message', function (message) {
		console.log('Message received: ' + message.text); 

		io.to(clientInfo[socket.id].room).emit('message', message); 
	}); 

	socket.emit('message', {
		name: 'System', 
		text: "welcome to the chat application",
	}); 
})

http.listen(PORT, function(){
	console.log('server started on port:' + PORT)
})