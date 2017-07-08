

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
const jockScore = document.getElementById('matt_score');
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

Quiz.prototype.buttonHandler = function(buttonText) {
	if(!quiz.started) {
		
	}
}

const QuizUI = {
	displayNext() {
		// Display next question function
	}
}




