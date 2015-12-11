
console.log('hello'); 


var $form = jQuery('#gate');
$form.on('submit', function(event){
	var x = document.forms["gate"]["password"].value;
		if (x !== 'pcmasterrace'){
			i=1;
			while (i>0){
				console.log('you are not worthy of entering'); 
			}
	}
}); 

// function Timer () {
// 	setTimeout(function(){
// 		i=1;
// 		while(i>0){
// 			console.log("Time's up! You are not worthy of entering")
// 		}
// 	}, 5000); 

// }

// Timer(); 

$('.found').mouseenter(function(){
	$(this).html('pcmasterrace');
});


