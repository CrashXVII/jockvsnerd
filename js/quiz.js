

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



function buttonCrafter(text) {
	const button = document.createElement('button');
	button.textContent = text;
	button.className = "generatedButton";
	btnDiv.appendChild(button);
}

function Quiz(questions) {
	this.nerdQuestions = questions.nerdQuestions;
	this.jockQuestions = questions.jockQuestions;
	this.quizIndex = 0;
	this.nerdScore = 0;
	this.jockScore = 0;
	this.started = false;
	this.currentPlayerJock = false;
	this.currentPlayerNerd = false;
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
		let button = e.target;
		quiz.buttonHandler(button.textContent);
	}
	
});

Quiz.prototype.guessHandler = function(guess) {
	if(guess === quiz.getCurrentQuestion().correctAnswer) {
		questionH2.textContent = "Correct!";

		if(quiz.currentPlayerJock) {
			quiz.jockScore += 1;
		} else if(quiz.currentPlayerNerd) {
			quiz.nerdScore += 1;
		} else {
			console.log("scoring error at guessHandler");
		}
		jockScore.textContent = quiz.jockScore;
		nerdScore.textContent = quiz.nerdScore;
	} else {
		questionH2.textContent = "Incorrect!";
	}
		afterTextP.style.display = '';
		afterTextP.textContent = quiz.getCurrentQuestion().afterText;
		btnDiv.innerHTML = "";
		buttonCrafter("Next Question!");
		quiz.quizIndex += 1;
}

Quiz.prototype.buttonHandler = function(buttonText) {
	if(!quiz.started) {
		quiz.started = true;
		if(buttonText == "Jock") {
			quiz.currentPlayerJock = true;
		} else if(buttonText == "Nerd") {
			quiz.currentPlayerNerd = true;
		}
		scoreboard.style.display = "";
		QuizUI.displayNext();
	} else if(buttonText == "Next Question!") {
		QuizUI.displayNext();
	} else {
		quiz.guessHandler(buttonText);
	}
}

Quiz.prototype.getCurrentQuestion = function() {
	if(this.currentPlayerJock) {
		return this.jockQuestions[this.quizIndex];
	} else if(this.currentPlayerNerd) {
		return this.nerdQuestions[this.quizIndex];
	} else {
		console.log("Error at getCurrentQuestion");
	}
}

Quiz.prototype.isCorrectAnswer = function(choice){
	
};

const QuizUI = {
	displayNext() {
		btnDiv.innerHTML = "";
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
		element.innerHTML = text;
	}
}




