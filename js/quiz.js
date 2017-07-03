const xhrGetQuizQuestions = new XMLHttpRequest();
xhrGetQuizQuestions.open('GET', 'js/qzJSON.json');
xhrGetQuizQuestions.send();

let quizQuestions;

xhrGetQuizQuestions.onreadystatechange = function() {
	if(xhrGetQuizQuestions.status == 200 && xhrGetQuizQuestions.readyState == 4) {
		quizQuestions = JSON.parse(xhrGetQuizQuestions.responseText).shift(); // TODO: Better way to do this? Write different JSON?

	}
}

const btnDiv = document.getElementById('btn_div');
const jockScore = document.getElementById('matt_score');
const nerdScore = document.getElementById('nerd_score');
const quizStartButton = document.getElementById('quiz_score');
const questionH2 = document.getElementById('question');
const afterTextP = document.getElementById('question_afterText');
const questionSection = document.querySelector('.question_section');

questionSection.style.display = 'none';

function quizStart() {
	
}