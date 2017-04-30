
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
// Change this to the .filter function (currentplayer) if(quiz.whoItFor === currentplayer) {return true;} Have to set up a variable to store the new array and reference that for QuizUI?
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
var quizQuestions = [ 
	new Question("Does this work?", ["Yes", "No", "Maybe?"], "Yes", "YAR! HERE BE THE SUBTEXT!", "paul"),
	new Question("Does it really though?", ["No", "Yes"], "Yes", "YAR! HERE BE THE SUBTEXT!", "matt"),
	new Question("No, but really, how is this thing?", ["Good!", "Borked!"], "Good!", "Yar! HERE BE THE SUBTEXT!", "matt"),
	new Question("More example questions??", ["Yes, Test it out man!", "Nah, we're done"], "Yes, Test it out man!", "Yar! HERE BE THE SUBTEXT!", "paul"),
	new Question("Keep going?", ["Sally Forth!", "Let's quit."], "Sally Forth!", "Yar! HERE BE THE SUBTEXT!", "paul"),
	new Question("6th time's the charm, right?", ["Seems good for now.", "Go to hell, jackass."], "Seems good for now.", "Yar! HERE BE THE SUBTEXT!", "matt")
];

var quiz = new Quiz(quizQuestions);




//Stores current player selection, used for score and such.

var currentPlayer;
const paulScoreDisplay = document.getElementById('paul_score');
const mattScoreDisplay = document.getElementById('matt_score');

// Hiding question display until quiz starts. Better to create them in javascript on the fly?
$('.question_section').hide();
$('#question_subtext').hide();


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

//Prototype functions (Hey Joe! Why do these have to be above the QuizUI?)


//check to see if all questions have been used.

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
	paulScoreDisplay.innerHTML = quiz.paulScore;
	mattScoreDisplay.innerHTML = quiz.mattScore;

}

// get
Quiz.prototype.getCurrentQuestion = function(){
	return this.questions[this.quizIndex]; 
};


Question.prototype.isCorrectAnswer = function(choice){
	return this.correctAnswer === choice;
};

// function for checking answers, awarding score, displaying next question, ect.
var QuizUI = {
	displayNext: function() {
		this.displayQuestion();
		this.displayChoices();
	},
	displayQuestion: function() {
		this.populateIdWithHTML("question", quiz.getCurrentQuestion().text);
	},
	displayChoices: function() {
		var choices = quiz.getCurrentQuestion().choices;
		var choicesHTML = ""; 								//Generate buttons for each answer choice.
		for(var i = 0; i < choices.length; i++) {
			let newButton = `<button class="generatedButton" id="btn${i}">${choices[i]}</button>`;
			choicesHTML += newButton;
			
		}
		this.populateIdWithHTML("btn_div", choicesHTML);
		this.guessHandler();
	},

	populateIdWithHTML: function(id, text) {
		let element = document.getElementById(id);
		element.innerHTML = text;
	},
	guessHandler: function() {
		var choices = quiz.getCurrentQuestion().choices;
		for(var i = 0; i < choices.length; i++) {
			var button = document.getElementById(`btn${i}`);
			button.onclick = function() {
				quiz.guess(this.innerHTML);
				QuizUI.displayNext();
			}
		}
	}
};





