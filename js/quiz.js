
// Quiz constructor

function Quiz(questions) {
	this.questions = questions;
	this.quizIndex = 0;
	this.paulScore = 0;
	this.mattScore = 0;	
}



// formats the questions

function Question(text, choices, correctAnswer, afterText, whoItFor) {
  this.text = text;
  this.choices = choices;
  this.correctAnswer = correctAnswer;
  this.afterText = afterText;
  this.whoItFor = whoItFor; // use lower case, "matt" or "paul" in the form for creating new quizzes
}



// sorting based on who goes first. Puts the all the first players questions to the top of the quiz.questionaire so that they come up first while playing.

function sortByName() {
// TODO? Change this to the .filter function (currentplayer) if(quiz.whoItFor === currentplayer) {return true;} Have to set up a variable to store the new array and reference that for QuizUI?
	if(currentPlayer === "matt") {
		quiz.questions.sort(function (a, b) {
			var q1 = a.whoItFor.toUpperCase();
			var q2 = b.whoItFor.toUpperCase();
			if(q1 < q2) {
				return -1;
			}
			if(q1 > q2) {
				return +1;
			}
		});
	} else if(currentPlayer === "paul") {
		quiz.questions.sort(function (a, b) {
			var q1 = a.whoItFor.toUpperCase();
			var q2 = b.whoItFor.toUpperCase();
			if(q1 > q2) {
				return -1;
			}
			if(q1 < q2) {
				return +1;
			}
		});	
		} else {
			console.log("Error in question sorting, sortByName");
		}
	}
	



// formatting of the questions
// const quizQuestions = [ 
// 	new Question("Does this work?", ["Yes", "No", "Maybe?"], "Yes", "YAR! HERE BE THE SUBTEXT!", "paul"),
// 	new Question("Does it really though?", ["No", "Yes"], "Yes", "YAR! HERE BE THE SUBTEXT!", "matt"),
// 	new Question("No, but really, how is this thing?", ["Good!", "Borked!"], "Good!", "Yar! HERE BE THE SUBTEXT!", "matt"),
// 	new Question("More example questions??", ["Yes, Test it out man!", "Nah, we're done"], "Yes, Test it out man!", "Yar! HERE BE THE SUBTEXT!", "paul"),
// 	new Question("Keep going?", ["Sally Forth!", "Let's quit."], "Sally Forth!", "Yar! HERE BE THE SUBTEXT!", "paul"),
// 	new Question("6th time's the charm, right?", ["Seems good for now.", "Go to hell, jackass."], "Seems good for now.", "Yar! HERE BE THE SUBTEXT!", "matt")
// ];

// const quiz = new Quiz(quizQuestions);


const xhrGetQuizQuestions = new XMLHttpRequest();
xhrGetQuizQuestions.open('GET', 'js/qzJSON.json');
xhrGetQuizQuestions.send();

let quizQuestions;

xhrGetQuizQuestions.onreadystatechange = function() {
	if(xhrGetQuizQuestions.status == 200 && xhrGetQuizQuestions.readyState == 4) {
		quizQuestions = JSON.parse(xhrGetQuizQuestions.responseText).shift(); // TODO: Better way to do this? Write different JSON?

	}
}

//Stores current player selection, used for score and such.

let currentPlayer = "";
const paulScoreDisplay = document.getElementById('paul_score');
const mattScoreDisplay = document.getElementById('matt_score');

// Hiding question display until quiz starts. Better to create them in javascript on the fly?
$('.question_section, #question_afterText').hide();


// button to pick starting player
$('.player-select').click(function() {
	currentPlayer = this.textContent.toLowerCase();
	sortByName();
	$('#hide_on_start').hide(); //Hide the start button
	QuizUI.displayNext();
});

// Quiz start button
$("#quiz_start").click(function() {
	$("#quiz_start").fadeOut(100);
	$('.question_section').delay(200).fadeIn();
	QuizUI.populateIdWithHTML("question", "Who wants to go first?");

});

//

Quiz.prototype.guess = function(answer) {
	if(currentPlayer === "paul") {
		if(this.getCurrentQuestion().isCorrectAnswer(answer)) {
			quiz.paulScore++;
		}
	} else if(currentPlayer === "matt") {
		if(this.getCurrentQuestion().isCorrectAnswer(answer)) {
			quiz.mattScore++;
		}
	} else {
		console.log("Error player select, from quiz.guess");
	}
	quiz.quizIndex++;
	paulScoreDisplay.innerText = quiz.paulScore;
	mattScoreDisplay.innerText = quiz.mattScore;

}

Quiz.prototype.playerSwitchCheck = function() {
	const playerCheck = quiz.questions[quiz.quizIndex].whoItFor;
	if(playerCheck != currentPlayer) {
		if(currentPlayer === "matt") {
			currentPlayer = "paul";
		} else if(currentPlayer === "paul") {
			currentPlayer = "matt";
		} else {
			console.log("Error at player switch");
		}
	}
}

Quiz.prototype.getCurrentQuestion = function(){
	return this.questions[this.quizIndex]; 
};


Question.prototype.isCorrectAnswer = function(choice){
	return this.correctAnswer === choice;
};

Quiz.prototype.hasQuizEnded = function() {
	if(quiz.questions.length <= quiz.quizIndex) {
		return true;
	}
}

Quiz.prototype.generateEndGameScreen = function() {
	var gameOverText = "";
	if(quiz.paulScore > quiz.mattScore) {
		gameOverText = "Game over, Paul wins!!";
	} else if(quiz.mattScore > quiz.paulScore) {
		gameOverText = "Game over, Matt wins!!";
	} else if(quiz.mattScore = quiz.paulScore) {
		gameOverText = "Tie game! Jacob wins!!";
	} else {
		gameOverText = "Apparently I messed something up. Game over, I guess.";
		console.log("Error at quiz.prototype.generateEndGameScreen");
	}

	return gameOverText;
}
// function for checking answers, awarding score, displaying next question, ect.
const QuizUI = {
	displayNext() {
		
		if(quiz.hasQuizEnded()) {
			this.populateIdWithHTML("question", quiz.generateEndGameScreen());
			$("#btn_div").hide();
		} else {
			quiz.playerSwitchCheck();
			this.displayQuestion();
			this.displayChoices();
		}
	},
	displayQuestion() {
		this.populateIdWithHTML("question", quiz.getCurrentQuestion().text);
	},
	displayChoices() {
		const choices = quiz.getCurrentQuestion().choices;
		let choicesHTML = ""; 								//Generate buttons for each answer choice.
		for(let i = 0; i < choices.length; i++) {
			let newButton = `<button class="generatedButton" id="btn${i}">${choices[i]}</button>`;
			choicesHTML += newButton;
			
		}
		this.populateIdWithHTML("btn_div", choicesHTML);
		this.guessHandler();
	},

	populateIdWithHTML(id, text) {
		let element = document.getElementById(id);
		element.innerHTML = text;
	},
	guessHandler() {
		const choices = quiz.getCurrentQuestion().choices;
		for(let i = 0; i < choices.length; i++) {
			let button = document.getElementById(`btn${i}`);
			button.onclick = function() {
				quiz.guess(this.innerHTML);
				QuizUI.displayNext();
			}
		}
	}
};





