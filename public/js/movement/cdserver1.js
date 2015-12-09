//allows Mitnick to move around servers without being seen
//in other words, when mitnick types these commands into the application, it is not broadcasted


function cdserver1 (socket) {
	var clientInfo = {}; 
	var info = clientInfo[socket.id]; 

	if (typeof info === 'undefined') {
		return; 
	}

	socket.emit('message', {
		name: 'System', 
		text: 'You are now in server 1'
	});

	MitnickLocation = 1; 

	//just for testing if it changes mitnick location, should be taken out 
	console.log(MitnickLocation); 

} 

module.exports = cdserver1; 