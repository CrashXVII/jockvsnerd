

const xhrGetQuizQuestions = new XMLHttpRequest();
xhrGetQuizQuestions.open('GET', 'js/qzJSON.json');
xhrGetQuizQuestions.send();


let quiz;
xhrGetQuizQuestions.onreadystatechange = function() {
	if(xhrGetQuizQuestions.status == 200 && xhrGetQuizQuestions.readyState == 4) {
		quizQuestions = JSON.parse(xhrGetQuizQuestions.responseText).shift(); // TODO: Better way to do this? Write different JSON?
		quiz = new Quiz(quizQuestions);
	}
}

const btnDiv = document.getElementById('btn_div');
const jockScore = document.getElementById('jock_score');
const nerdScore = document.getElementById('nerd_score');
const quizStartButton = document.getElementById('quiz_start');
const questionH2 = document.getElementById('question');
const afterTextP = document.getElementById('question_afterText');
const questionSection = document.querySelector('.question_section');
const scoreboard = document.querySelector('.scoreboard');

questionSection.style.display = 'none';
scoreboard.style.display = 'none';

let currentPlayer;

function buttonCrafter(text) {
	const button = document.createElement('button');
	button.textContent = text;
	button.className = "generatedButton";
	btnDiv.appendChild(button);
}

function Quiz(questions) {
	this.quizIndex = 0;
	this.started = false;
	this.nerd = {
		questions : questions.nerdQuestions,
		score : 0,
		quizComplete : false 
	};
	this.jock = {
		questions : questions.jockQuestions,
		score : 0,
		quizComplete : false
	};
	
}

quizStartButton.addEventListener("click", () => {
	questionSection.style.display = 'block';
	quizStartButton.style.display = 'none';
	afterTextP.style.display = 'none';
	questionH2.textContent = "Who wants to go first?";
	buttonCrafter("Jock");
	buttonCrafter('Nerd');
});



btnDiv.addEventListener("click", (e)=> {
	if(e.target.tagName == 'BUTTON') {
		quiz.buttonHandler(e.target.textContent);
	}
	
});

Quiz.prototype.playerStatusCheck = function() {
	if(currentPlayer.questions.length == quiz.quizIndex) {
		console.log('Player Switch');
		return true;
	}
}

Quiz.prototype.guessHandler = function(guess) {
	if(guess === quiz.getCurrentQuestion().correctAnswer) {
		questionH2.textContent = "Correct!";
		currentPlayer.score += 1;
		jockScore.textContent = quiz.jock.score;
		nerdScore.textContent = quiz.nerd.score;
	} else {
		questionH2.textContent = "Incorrect!";
	}
	afterTextP.style.display = '';
	afterTextP.textContent = quiz.getCurrentQuestion().afterText;
	btnDiv.innerHTML = "";
	quiz.quizIndex += 1;
		
	if (quiz.playerStatusCheck()) {
		buttonCrafter("Next Player!");
	} else {
		buttonCrafter("Next Question!")
	}
}

Quiz.prototype.buttonHandler = function(buttonText) {
	if(!quiz.started) {
		quiz.started = true;
		if(buttonText == "Jock") {
			currentPlayer = quiz.jock;
		} else if(buttonText == "Nerd") {
			currentPlayer = quiz.nerd;
		}
		scoreboard.style.display = "";
		QuizUI.displayNext();
	} else if(buttonText == "Next Question!") {
		QuizUI.displayNext();
	} else if(buttonText == "Next Player!") {

	} else {
		quiz.guessHandler(buttonText);
	}
}

Quiz.prototype.getCurrentQuestion = function() {
	return currentPlayer.questions[quiz.quizIndex];
}



Quiz.prototype.quizStatusCheck = function() {
	if(quiz.jock.quizComplete && quiz.nerd.quizComplete) {
		quiz.generateGameOver();
	} else if(quiz.jock.quizComplete) {
		currentPlayer = quiz.nerd;
	} else if(quiz.nerd.quizComplete) {
		currentPlayer = quiz.jock;
	}
}

const QuizUI = {
	displayNext() {
		btnDiv.innerHTML = "";
		afterTextP.style.display = "none";
		this.displayQuestion();
		this.displayChoices();
	},
	displayQuestion() {
		this.populateHTML(question, quiz.getCurrentQuestion().question);
	},
	displayChoices() {
		const choices = quiz.getCurrentQuestion().choices;
		for(let i = 0; i < choices.length; i++) {
			buttonCrafter(choices[i]);
		}
	},
	populateHTML(element, text) {
		element.textContent = text;
	}
}




