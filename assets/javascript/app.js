var player = "";
var player1 = "";
var player2 = "";
var wins = 0;
var losses = 0;
var button = '<div class="btn-group btn-group-toggle" data-toggle="buttons"><button class="btn btn-secondary play">Rock</button><button class="btn btn-secondary play">Paper</button><button class="btn btn-secondary play">Scissor</button></div> <hr>';
var input = '<div class="input-group mb-3"><input type="text" class="form-control msg" placeholder="Message" aria-label="Message" aria-describedby="basic-addon2"><div class="input-group-append"><button class="btn btn-outline-secondary send" type="submit">Send</button></div></div>'
var nameinput = '<div class="col-12 col-md-10"><input type="text" class="form-control name" placeholder="Player\'s name"></div><div class="col-12 col-md-2"><button class="btn btn-outline-secondary" type="submit" id="Enter">Enter</button></div>'
var showButton = false;
var nameGlobal = "";

$(document).ready(function() {

	var config = {
	    apiKey: "AIzaSyDpBTF5evFTcEDkk82LcvwP592mDG5o_kk",
	    authDomain: "rps-multiplayer-e97a8.firebaseapp.com",
	    databaseURL: "https://rps-multiplayer-e97a8.firebaseio.com",
	    projectId: "rps-multiplayer-e97a8",
	    storageBucket: "rps-multiplayer-e97a8.appspot.com",
	    messagingSenderId: "976374848984"
	};

	firebase.initializeApp(config);

	var database = firebase.database();

	// create a function that display the game and chat
	function display(play) {
		if ($(".mainRow").length === 0) {
			$(".main-display").empty();
			$(".main-display").append($("<div>").addClass("row mainRow"));
			$(".mainRow").append($("<div>").addClass("col-6 game"));
			$(".mainRow").append($("<div>").addClass("col-6 chat").css("overflow", "auto"));
			$(".game").append($("<div>").addClass("row").append($("<div>").addClass("col-12 player").html("You are " + player + "<hr>")));
			if (play === "") {
				$(".game").append($("<div>").addClass("row").append($("<div>").addClass("col-12 buttons").append(button)));
			}
			else {
				$(".game").append($("<div>").addClass("row").append($("<div>").addClass("col-12 buttons").append($("<p>").html("You have played " + play + "<hr>"))));
			}
			$(".game").append($("<div>").addClass("row info").append($("<div>").addClass("col-12 score").html("Wins: " + wins + " Losses: " + losses + "<hr>")));
			$(".game").append($("<div>").addClass("row").append($("<div>").addClass("col-12").append($("<button>").addClass("btn btn-secondary reset").attr("type", "button").text("Reset"))));
			$(".chat").append($("<div>").addClass("row justify-content-center some").css("overflow", "auto").height("224px").append($("<div>").addClass("col-11 chatDisplay").css("overflow", "auto")));
			$(".chat").append($("<div>").addClass("row justify-content-center").append($("<div>").addClass("col-11").append($("<form>").addClass("w-100").append(input))));

			var chatmsg = "";
			database.ref().once("value", function(data) {
				chatmsg = data.val().chat;
			});

			if (chatmsg != "") {
				$.each(chatmsg, function(index, item) {
					console.log(nameGlobal);
					if (item.author === nameGlobal) {
						$(".chatDisplay").append($("<p>").addClass("text-right").html(item.msg + "<hr>"));
					}
					else {
						$(".chatDisplay").append($("<p>").addClass("text-left").html(item.msg + "<hr>"));
					}
				});
				$('.some').scrollTop($('.chatDisplay').height());
			}
			$(".form-row").empty();
		}
	}

	database.ref().once("value", function(data) {
		player1 = data.val().player1.name;
		player2 = data.val().player2.name;
		$(".player1name").text(player1);
		$(".player2name").text(player2);
		if (player1 === "" || player2 === "") {
			$(".main-display").empty();
			$(".main-display").append($("<h2>").text("Please enter name to start playing.").css("color", "red"));
		}
		else {
			$(".main-display").empty();
			$(".main-display").append($("<h2>").text("2 players are currently playing. If you are one of them, please enter your name above to enter the game.").css("color", "red"));
		}
	});


	$(document.body).on("click", "#Enter", function(event) {
		event.preventDefault();
		var name = $(".name").val();
		$(".name").val("");
		var play = "";
		// listen to the search click and then if name = player1 or name === player2, display the game and chat
		if (name.toLowerCase() === player1.toLowerCase()) {
			player = "Player 1";
			database.ref().once("value", function(data) {
				wins = data.val().player1.win;
				losses = data.val().player1.loss;
				play = data.val().player1.play;
			});
			nameGlobal = name;
			display(play);
		}
		else if (name.toLowerCase() === player2.toLowerCase()) {
			player = "Player 2";
			database.ref().once("value", function(data) {
				wins = data.val().player2.win;
				losses = data.val().player2.loss;
				play = data.val().player2.play;
			});
			nameGlobal = name;
			display(play);
		}
		// listen to search click and if player1 === undefined, write in player1 name and display wait for player 2, else set player2 and display the game and chat
		else if (player1 === "") {
			console.log("in");
			database.ref().child("player1").update({
				name: name
			});
			console.log("out");
			player = "Player 1";
			nameGlobal = name;
			display(play);
			$(".player").html("You are " + player + "<hr>");
		}
		else if (player2 === "") {
			database.ref().child("player2").update({
				name: name
			});
			player = "Player 2";
			nameGlobal = name;
			display(play);
			$(".player").html("You are " + player + "<hr>");
		}
	});

	// listen if the player's name changed
	database.ref().on("value", function(data) {
		player1 = data.val().player1.name;
		player2 = data.val().player2.name;
		$(".player1name").text(data.val().player1.name);
		$(".player2name").text(data.val().player2.name);
		var player1play = data.val().player1.play;
		var player2play = data.val().player2.play;

		var chatmsg = data.val().chat;

		if (chatmsg != "") {
			$(".chatDisplay").empty();
			$.each(chatmsg, function(index, item) {
				console.log(nameGlobal);
				if (item.author === nameGlobal) {
					$(".chatDisplay").append($("<p>").addClass("text-right").html(item.msg + "<hr>"));
				}
				else {
					$(".chatDisplay").append($("<p>").addClass("text-left").html(item.msg + "<hr>"));
				}
			});
			$('.some').scrollTop($('.chatDisplay').height());
		}

		if (player1play != "" && player2play != "") {
			showButton = true;
	        if ((player1play === "Rock" && player2play === "Scissor") ||
	        	(player1play === "Scissor" && player2play === "Rock") || 
	        	(player1play === "Paper" && player2play === "Rock")) {
	        	if (player === "Player 1") {
	        		wins++;
	        		$(".info").prepend($("<div>").addClass("col-12 resultinfo").html("You played " + player1play + " and you opponent played " + player2play + ". You win!!"));
	        		database.ref().child("player1").update({
	        			win: wins,
	        			play: ""
	        		});
	        	}
	        	else {
	        		losses++;
	        		$(".info").prepend($("<div>").addClass("col-12 resultinfo").html("You played " + player2play + " and you opponent played " + player1play + ". You lose!!"));
	        		database.ref().child("player2").update({
	        			loss: losses,
	        			play: ""
	        		});
	        	}
	        } else if (player1play === player2play) {
	          	$(".info").prepend($("<div>").addClass("col-12 resultinfo").html("It is a tie! No win no lose"));
	          	database.ref().child("player1").update({
	    			play: ""
	    		});
	    		database.ref().child("player2").update({
	    			play: ""
	    		});
	        } else {
	          	if (player === "Player 2") {
	        		wins++;
	        		$(".info").prepend($("<div>").addClass("col-12 resultinfo").html("You played " + player2play + " and you opponent played " + player1play + ". You win!!"));
	        		database.ref().child("player2").update({
	        			win: wins,
	        			play: ""
	        		});
	        	}
	        	else {
	        		losses++;
	        		$(".info").prepend($("<div>").addClass("col-12 resultinfo").html("You played " + player1play + " and you opponent played " + player2play + ". You lose!!"));
	        		database.ref().child("player1").update({
	        			loss: losses,
	        			play: ""
	        		});
	        	}
	        }
	        $(".play").removeClass("active");
		}

		if (data.val().player1.name === "" && data.val().player1.name === "") {
			$(".resultinfo").remove();
			wins = 0;
			losses = 0;
		}

		$(".score").html("Wins: " + wins + " Losses: " + losses + "<hr>");

		if (showButton) {
			$(".buttons").empty();
	        $(".buttons").append(button);
	        showButton = false;
		}

	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
	});

	$(document.body).on("click", ".reset", function() {
		$(".main-display").empty();
		player = "";
		player1 = "";
		player2 = "";
		wins = 0;
		losses = 0;
		showButton = false;
		nameGlobal = "";
		database.ref().set({
			player1: {
				name: player1,
				win: wins,
				loss: losses,
				play: ""
			},
			player2: {
				name: player2,
				win: wins,
				loss: losses,
				play: ""
			},
			chat: ""
		});
		$(".form-row").append(nameinput);
		$(".main-display").append($("<h2>").text("Please enter name to start playing.").css("color", "red"));
	});

	$(document.body).on("click", ".play", function() {
		var use = ""; 
		if (player === "Player 1") {
			database.ref().once("value", function(data) {
				use = data.val().player1.play;
			});
			if (use === "") {
				$(".resultinfo").remove();
				var play = $(this).text();
				$(this).addClass("active");
				database.ref().child("player1").update({
					play: play
				});
			}
		}
		else {
			database.ref().once("value", function(data) {
				use = data.val().player2.play;
			});
			if (use === "") {
				$(".resultinfo").remove();
				var play = $(this).text();
				$(this).addClass("active");
				database.ref().child("player2").update({
					play: play
				});
			}
		}
		$(".buttons").empty();
		$(".buttons").append($("<p>").html("You have played " + play + "<hr>"));
		showButton = true;
	})

	$(document).on("click", ".send", function(event) {
		event.preventDefault();
		msg = $(".msg").val();
		$(".msg").val("");
		var chatmsg = "";
		database.ref().once("value", function(data) {
			chatmsg = data.val().chat;
		});
		var chat = database.ref().child("chat");
		if (chatmsg === "" && nameGlobal != "") {
			chat.push().set({
				author: nameGlobal,
				msg: msg
			});
		}
		else {
			chat.push({
				author: nameGlobal,
				msg: msg
			});
		}
	});

	// chat
	// var chat = ref.child("chat")
	// chat.push({
	// 	author: ...
	// 	msg: ...
	// })


})