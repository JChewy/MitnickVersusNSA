var PORT = process.env.PORT || 4000; 
var express = require('express'); 
var app = express(); 
var player = require('play-sound')(opts = {})
var MitnickLocation = 0; 
var NSALocation = 0; 
var MitnickStartGameRequest = false; 
var NSAstartGameRequest = false; 
var Mit= 0; 
var Mitnick = 0; 
var NSA = 0; 
var N= 0; 
var i = 0; 



//if this reaches zero NSA wins
var MitnickHealth = 3; 
var NSAwins = false; 

//If this reaches ten Mitnick wins
var DataCollected = 0; 
var MitnickWins = false; 
var RemainingDataToCollect = 10; 

//radars 
var snifferQuantity = 0;
var radarQuantity = 0;
var jammerQuantity = 0;

//just for the lols 
var Donut = 0;

var http = require('http').Server(app); 
var io = require('socket.io')(http); 
app.use(express.static(__dirname + '/public')); 
var clientInfo = {}; 


function MitnickExists(socket) {
	socket.emit('message', {
		name: 'System', 
		text: 'The role Mitnick is taken'
	}); 
}


function NSAExists(socket) {
	socket.emit('message', {
		name: 'System', 
		text: 'The role NSA is taken'
	}); 
}

//creating NSA locators 
function createSniffer(socket) {

	socket.emit('message', {
		name: 'System', 
		text: 'Creating sniffer...'
	}); 


	setTimeout(function(){
		socket.emit('message', {
			name: 'System', 
			text: 'Sniffer created!'
		}); 
	},1000)

	setTimeout(function(){
		snifferQuantity = snifferQuantity + 1; 
	})
}

//firing NSA locators
function useSniffer(socket) {

	socket.emit('message', {
		name: 'System', 
		text: 'Finding NSA location...'
	}); 


	setTimeout(function(){
		socket.emit('message', {
			name: 'System', 
			text: 'Location found! NSA located in server ' + NSALocation
		}); 
	},1000)

	setTimeout(function(){
		snifferQuantity = snifferQuantity - 1; 
	})
}

//if Mitnick runs out of sniffers
function noSniffer(socket) {
	socket.emit('message', {
		name: 'System', 
		text: 'You have no more sniffers.'
	})
}

//NSA radar

function createRadar (socket) {

	socket.emit('message', {
		name: 'System', 
		text: 'Setting up radar 1/5...'
	})


	setTimeout(function(){
		socket.emit('message', {
			name: 'System', 
			text: 'Setting up radar 2/5...'
		})
	},1000)

	setTimeout(function(){
		socket.emit('message', {
			name: 'System', 
			text: 'Setting up radar 3/5...'
		})
	},2000)

	setTimeout(function(){
		socket.emit('message', {
			name: 'System', 
			text: 'Setting up radar 4/5...'
		})
	},3000)

	setTimeout(function(){
		socket.emit('message', {
			name: 'System', 
			text: 'Radar fully set up! Fire when ready.'
		})
	},4000)	

	setTimeout(function(){
		socket.broadcast.emit('message', {
			name: 'System', 
			text: 'Radar is online!'
		})
	},4000)	

	setTimeout(function(){
		radarQuantity = radarQuantity + 1; 
	},4000)	
}

function Radar (socket) {
	setInterval(function(){
		socket.emit('message', {
			name: 'System', 
			text: 'Mitnick located on server ' + NSALocation
		}); 
	},1000)

	socket.broadcast.emit('message', {
		name: 'System', 
		text: 'Radar pinging your location!'
	})


}

function RadarOffline (socket) {

	socket.emit('message', {
		name: 'System', 
		text: 'Radar is offline'
	})


}

//jammer

function createJammer (socket) {
	socket.emit('message', {
		name: 'System', 
		text: 'Creating Jammer...'
	}); 


	setTimeout(function(){
		socket.emit('message', {
			name: 'System', 
			text: 'Jammer Created!'
		}); 
	},1000)

	setTimeout(function(){
		jammerQuantity = jammerQuantity + 1; 
	},1000)
}

function fireJammer (socket) {

	socket.emit('message', {
		name: 'System', 
		text: 'Firing jammer...'
	})

	setTimeout(function(){
		var userData = clientInfo[socket.id];
		io.to(userData.room).emit('message', {
			name: 'System', 
			text: 'Radar is offline!'
		})
	}, 1000)

	setInterval(function(){
		radarQuantity = 0; 
	}, 1000)
}

function noJammer (socket) {
	socket.emit('message', {
		name: 'System', 
		text: 'You have no jammers'
	})
}



//this function is fired when a player tries to access a move designated to a certain side
//for example, the NSA should not be able to hack servers 
function CommandNotRecognized(socket){
	socket.emit('message', {
		name: 'System', 
		text:'command not recognized'
	}); 
}


//hack command
function hack (socket) {
	//we make a new socket specific to the player named mitnick
	var info = clientInfo[socket.id]; 

	//this gives the illusion that actual hacking is going on
	i = 1; 

	socket.emit('message', {
		name: 'System', 
		text: 'hacking the server...'
	}); 

	setTimeout(function() {
		socket.emit('message', {
		name: 'System', 
		text: 'almost done...'
	})},1000); 

	setTimeout(function() {
		socket.emit('message', {
		name: 'System', 
		text: 'hack successful.'
	})},2000); 

	//this is emitted to the NSA, not Mitnick
	setTimeout(function() {
		socket.broadcast.emit('message', {
		name: 'System', 
		text: 'A server has been hacked!'
	})},2000); 

	//Mitnick score counter
	setTimeout(function() {
		DataCollected = DataCollected + 1; 
		RemainingDataToCollect = RemainingDataToCollect - 1; 
		i =0; 
	},2000); 

	setTimeout(function(){ 

		var userData = clientInfo[socket.id];
		if(DataCollected === 10){
			io.to(userData.room).emit('message', {
				name: 'System', 
				text: 'Game Over! Mitnick Wins!'
			}); 

			MitnickWins = true; 
			player.play(__dirname + '/public/audio/Whistle.mp3', function(err){}); 

			MitnickStartGameRequest = false; 
			NSAstartGameRequest = false; 

		}
	},2000);

	setTimeout(function(){
		Donut = MitnickLocation
	}, 5000); 




}

function hackInProgress (socket) {
	socket.emit('message', {
		name: 'System', 
		text: 'Error: hack already in progress'
	}); 
}


function pingServer (socket) {

	setTimeout(function(){
		socket.emit('message', {
		name: 'System', 
		text: 'pinging server...'
	},1000)}); 

	setTimeout(function() {
		socket.emit('message', {
		name: 'System', 
		text: 'checking response for Mitnik'
	})},2000); 

	setTimeout(function(){
		var userData = clientInfo[socket.id];
		if(MitnickLocation === NSALocation && MitnickHealth > 1){
				socket.emit('message', {
				name: 'System', 
				text: 'Mitnick presence confirmed. Data recovered but failed to apprehend terrorist.'
			}); 

			socket.broadcast.emit('message', {
				name: 'System', 
				text: 'You have been caught! You data has been confiscated'
			}); 

				DataCollected = 0; 
				MitnickHealth = MitnickHealth - 1; 
				console.log("Lives Remaining = " + MitnickHealth)

		}else if(MitnickLocation === NSALocation && MitnickHealth === 1){
			io.to(userData.room).emit('message', {
				name: 'System', 
				text: 'Game Over! USA! USA! USA!'
			}); 

			clientInfo[socket.id].role = " none ";
			Mitnick = 0; 
			NSA = 0; 
			console.log(clientInfo[socket.id].role); 

			MitnickStartGameRequest = false; 
			NSAstartGameRequest = false; 

			player.play(__dirname + '/public/audio/Murica.mp3', function(err){});

			NSAwins = true; 

		}else if(Donut === NSALocation){
			socket.emit('message', {
				name: 'System', 
				text: 'There is just a box labeled "FBI DONUTS"'
			}); 
		}else{
			socket.emit('message', {
				name: 'System', 
				text: 'No one in server.'
			}); 
		}
	}, 3000); 

}

function mustBeInServer (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name: 'System', 
		text: 'Error: You are not in a server.'
	})
}

//allows Mitnick to move around servers without being seen
//in other words, when mitnick types these commands into the application, it is not broadcasted
function cdserver1 (socket) {
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


function cdserver2 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 2'
	}); 

	MitnickLocation = 2; 

	console.log(MitnickLocation); 
}

function cdserver3 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 3'
	}); 

	MitnickLocation = 3; 

	console.log(MitnickLocation); 
}


function cdserver4 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 4'
	}); 

	MitnickLocation = 4; 

	console.log(MitnickLocation); 
}

function cdserver5 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 5'
	}); 

	MitnickLocation = 5; 

	console.log(MitnickLocation); 
}


function cdserver6 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 6'
	}); 

	MitnickLocation = 6; 

	console.log(MitnickLocation); 
}


function cdserver7 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 7'
	}); 

	MitnickLocation = 7; 

	console.log(MitnickLocation); 
}


function cdserver8 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 8'
	}); 

	MitnickLocation = 8; 

	console.log(MitnickLocation); 
}


function cdserver9 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 9'
	}); 

	MitnickLocation = 9; 

	console.log(MitnickLocation); 
}

function cdserver10 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'You are now in server 10'
	}); 

	MitnickLocation = 10; 

	console.log(MitnickLocation); 
}

//NSA moves

function checkserver1 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 1'
	}); 

	NSALocation = 1; 

	console.log(NSALocation); 
}

function checkserver2 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 2'
	}); 

	NSALocation = 2; 

	console.log(NSALocation); 
}

function checkserver3 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 3'
	}); 

	NSALocation = 3; 

	console.log(NSALocation); 
}

function checkserver4 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 4'
	}); 

	NSALocation = 4; 

	console.log(NSALocation); 
}

function checkserver5 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 5'
	}); 

	NSALocation = 5; 

	console.log(NSALocation); 
}

function checkserver6 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 6'
	}); 

	NSALocation = 6; 

	console.log(NSALocation); 
}

function checkserver7 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 7'
	}); 

	NSALocation = 7; 

	console.log(NSALocation); 
}

function checkserver8 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 8'
	}); 

	NSALocation = 8; 

	console.log(NSALocation); 
}

function checkserver9 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 9'
	}); 

	NSALocation = 9; 

	console.log(NSALocation); 
}

function checkserver10 (socket) {
	var info = clientInfo[socket.id]; 

	socket.emit('message', {
		name:'System', 
		text: 'Checking Server 10'
	}); 

	NSALocation = 10; 

	console.log(NSALocation); 
}




//starts the connection 
io.on('connection', function (socket) {

	console.log('Client has connected');

	//this is emitted whenever someone is connected to the socket
	socket.emit('message', {
		name: 'System', 
		text: "welcome to the game. To start, both players must submit a start game request. To submit a start game request just type 'start game' in the console",
	}); 


	//this broadcasts when a user has joined
	socket.on('joinRoom', function (req){
		clientInfo[socket.id] = req; 
		socket.join(req.room); 
		socket.broadcast.to(req.room).emit('message',{
			name:'System', 
			text: req.name + ' has joined!', 
		}); 
	}); 


	//this broadcasts when a user has left
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

	//allows me to determine what happens when a player types something into the chat box
	//here is where I set the commands that are specific to each side
	socket.on('message', function (message) {
		//start game
		



		if(MitnickStartGameRequest === true && NSAstartGameRequest ===true){

			//hack commands for Mitnick
			if(message.text === 'cd server 1' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver1(socket);  
			//this makes sure that the NSA can't have access to the moves designated to Mitnick
			}else if(message.text === 'cd server 1' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='hack server' && clientInfo[socket.id].role === 'Mitnick' && MitnickLocation !== 0 && i===1){
				hackInProgress(socket); 
			}else if(message.text ==='hack server' && clientInfo[socket.id].role === 'Mitnick' && MitnickLocation !== 0 && i ===0){
				hack(socket); 
			}else if(message.text ==='hack server' && clientInfo[socket.id].role === 'Mitnick' && MitnickLocation === 0){
				mustBeInServer(socket); 
			}else if(message.text ==='hack server' && clientInfo[socket.id].role !=='Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 2' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver2(socket); 
			}else if(message.text === 'create sniffer' && clientInfo[socket.id].role === 'Mitnick'){
				createSniffer(socket); 
			}else if(message.text === 'create sniffer' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'use sniffer' && clientInfo[socket.id].role === 'Mitnick' && sniffer > 0){
				useSniffer(socket); 
			}else if(message.text === 'use sniffer' && clientInfo[socket.id].role === 'Mitnick' && sniffer === 0){
				noSniffer(socket); 
			}else if(message.text === 'use sniffer' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'create jammer' && clientInfo[socket.id].role === 'Mitnick'){
				createJammer(socket); 
			}else if(message.text === 'create jammer' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'fire jammer' && clientInfo[socket.id].role === 'Mitnick' && jammerQuantity > 0){
				fireJammer(socket); 
			}else if(message.text === 'fire jammer' && clientInfo[socket.id].role === 'Mitnick' && jammerQuantity === 0){
				noJammer(socket); 
			}else if(message.text === 'fire jammer' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 2' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 3' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver3(socket); 
			}else if(message.text === 'cd server 3' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 4' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver4(socket); 
			}else if(message.text === 'cd server 4' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 5' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver5(socket); 
			}else if(message.text === 'cd server 5' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 6' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver6(socket); 
			}else if(message.text === 'cd server 6' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 7' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver7(socket); 
			}else if(message.text === 'cd server 7' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 8' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver8(socket); 
			}else if(message.text === 'cd server 8' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 9' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver9(socket); 
			}else if(message.text === 'cd server 9' &&  clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}else if(message.text === 'cd server 10' && clientInfo[socket.id].role === 'Mitnick'){
				cdserver10(socket); 
			}else if(message.text === 'cd server 10' && clientInfo[socket.id].role !== 'Mitnick'){
				CommandNotRecognized(socket); 
			}//NSA movement
			 //NSA movement
			 //NSA movement
			else if(message.text ==='check server 1' && clientInfo[socket.id].role === 'NSA'){
				checkserver1(socket); 
			}else if(message.text === 'check server 1' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 2' && clientInfo[socket.id].role === 'NSA'){
				checkserver2(socket); 
			}else if(message.text === 'check server 2' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 3' && clientInfo[socket.id].role === 'NSA'){
				checkserver3(socket); 
			}else if(message.text === 'check server 3' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 4' && clientInfo[socket.id].role === 'NSA'){
				checkserver4(socket); 
			}else if(message.text === 'check server 4' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 5' && clientInfo[socket.id].role === 'NSA'){
				checkserver5(socket); 
			}else if(message.text === 'check server 5' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 6' && clientInfo[socket.id].role === 'NSA'){
				checkserver6(socket); 
			}else if(message.text === 'check server 6' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 7' && clientInfo[socket.id].role === 'NSA'){
				checkserver7(socket); 
			}else if(message.text === 'check server 7' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 8' && clientInfo[socket.id].role === 'NSA'){
				checkserver8(socket); 
			}else if(message.text === 'check server 8' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 9' && clientInfo[socket.id].role === 'NSA'){
				checkserver9(socket); 
			}else if(message.text === 'check server 9' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}else if(message.text ==='check server 10' && clientInfo[socket.id].role === 'NSA'){
				checkserver10(socket); 
			}else if(message.text === 'check server 10' && clientInfo[socket.id].role !== 'NSA'){
				CommandNotRecognized(socket); 
			}//NSA ping move. Checks if Mitnick is in the same server
			else if(message.text === 'ping server' && clientInfo[socket.id].role === 'NSA' && NSALocation !== 0){
				pingServer(socket); 
			}else if(message.text === 'ping server' && clientInfo[socket.id].role === 'NSA'){
				mustBeInServer(socket); 
			}else if(message.text === 'set up radar' && clientInfo[socket.id].role === 'NSA'){
				createRadar(socket); 
			}else if(message.text === 'fire radar' && clientInfo[socket.id].role === 'NSA' && radarQuantity > 0){
				Radar(socket); 
			}else if(message.text === 'fire radar' && clientInfo[socket.id].role === 'NSA' && radarQuantity === 0){
				RadarOffline(socket); 
			}
			else{
			//players can message each other, provided that it is not a reserved command
				// io.to(clientInfo[socket.id].room).emit('message', message);
				CommandNotRecognized(socket);  
			}
		}else if(message.text === 'start game Mitnick' && Mitnick === 0){
			var userData = clientInfo[socket.id];

			MitnickStartGameRequest = true; 
			Mit = 1; 
			Mitnick = 1; 
			clientInfo[socket.id].role = 'Mitnick';
			console.log(clientInfo[socket.id].role)

			socket.emit('message', {
				name: 'System', 
				text: 'You have selected the role of Mitnick'
			}); 

			io.to(userData.room).emit('message', {
				name: 'System', 
				text: 'Mitnick is ready to begin'
			}); 
				if (Mit === 1 && N === 1){
					var userData = clientInfo[socket.id]; 
					io.to(userData.room).emit('message', {
						name: 'System', 
						text: 'Game Start!'
					}); 

					Mit = 0; 
					N = 0; 
				}

		}else if(message.text === 'start game Mitnick' && Mitnick === 1){
				MitnickExists(socket); 
		}else if(message.text === 'start game NSA' && NSA === 0){
			var userData = clientInfo[socket.id];
			NSAstartGameRequest = true; 
			clientInfo[socket.id].role = 'NSA';
			N = 1; 
			NSA = 1; 

			socket.emit('message', {
				name: 'System', 
				text: 'You have selected the role of the NSA'
			}); 

			io.to(userData.room).emit('message', {
				name: 'System', 
				text: 'NSA is ready to begin'
			}); 
				if (Mit === 1 && N === 1){
					var userData = clientInfo[socket.id]; 
					io.to(userData.room).emit('message', {
						name: 'System', 
						text: 'Game Start!'
					}); 

					Mit = 0; 
					N = 0; 
				}
		}else if(message.text === 'start game NSA' && NSA === 1){
			NSAExists(socket); 
		}else{
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
		
	}); 


})

//starts server
http.listen(PORT, function(){
	console.log('server started on port:' + PORT)

})