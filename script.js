const buttons = document.querySelectorAll("#buttons button");
const hangman = document.querySelector(".hangman");

const bodyPartQueries = [
	".head",
	".torso",
	".arm",
	".right.arm",
	".leg",
	".right.leg",
];
let bodyParts = [];

let currentGuess = "";
let score = 0;

function onReady() {
	for (let query of bodyPartQueries) {
		bodyParts.push(hangman.querySelector(query));
	}

	for (let button of buttons) {
		button.addEventListener("click", function () {
			processInput(this);
		});
	}

	hideHangman();
}

window.onload = onReady();

function hideHangman() {
	for (let part of bodyParts) {
		part.style.display = "none";
	}
}

function unhideCurrentPart() {
	bodyParts[score].style.display = "block";
	console.log(bodyParts[score]);
}

function syncBody() {}

function reset() {
	hideHangman();
	score = 0;
}

function processInput(el) {
	currentGuess = el.innerHTML;

	// loss condition
	if (true) {
		unhideCurrentPart();
		score++;
		if (score > 5) {
			// show loss message
			// reset();
		}
	}
}
