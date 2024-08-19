const buttons = document.querySelectorAll("#buttons button");
const hangman = document.querySelector(".hangman");
const wordContainer = document.querySelector("#word");
const statusDisplay = document.querySelector(".display");

const bodyPartQueries = [
	".head",
	".torso",
	".arm",
	".right.arm",
	".leg",
	".right.leg",
];
const bodyParts = [];

let word = "BANANA";

let currentGuess = "";
let score = 0;

let guesses = [];

let allowInput = true;

function randint(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

async function onReady() {
	for (let query of bodyPartQueries) {
		bodyParts.push(hangman.querySelector(query));
	}

	for (let button of buttons) {
		button.addEventListener("click", function () {
			processInput(this);
		});
	}

	document.querySelector("#reset").addEventListener("click", function () {
		reset();
	});

	word = await getNewWord();
	displayWord();

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
}

function displayWord() {
	for (let letterEl of wordContainer.querySelectorAll(".letter")) {
		letterEl.remove();
	}

	for (let letter of word) {
		let letterEl = document.createElement("div");
		letterEl.setAttribute("class", "letter");

		textEl = document.createElement("p");
		letterEl.appendChild(textEl);
		textEl.innerHTML = letter;

		wordContainer.appendChild(letterEl);
	}
}

async function getNewWord() {
	let randWordList = [];

	const response = await fetch(
		"https://random-word-api.herokuapp.com/word?length=" + randint(4, 6)
	);
	const data = await response.json();

	return data[0].toUpperCase();
}

async function reset() {
	hideHangman();
	for (let button of buttons) {
		button.setAttribute("class", "");
	}
	score = 0;
	guesses = [];

	word = await getNewWord();
	displayWord();

	statusDisplay.style.display = "none";

	allowInput = true;
}

function indexes(string, find) {
	let results = [];

	for (let i = 0; i < string.length; i++) {
		if (string.substring(i, i + find.length) == find) {
			results.push(i);
		}
	}

	return results;
}

function wordUnlocked(letters) {
	counter = 0;
	for (let letter of letters) {
		if (letter.querySelector("p").style.display == "block") {
			counter++;
		}
	}

	return counter == letters.length;
}

function processInput(el) {
	// start game
	if (guesses.includes(el.innerHTML) || !allowInput) {
		return;
	}

	currentGuess = el.innerHTML;
	guesses.push(currentGuess);

	let letters = wordContainer.querySelectorAll(".letter");
	if (word.includes(currentGuess)) {
		el.setAttribute("class", "correct");
		correctIndexes = indexes(word, currentGuess);

		for (let i of correctIndexes) {
			letters[i].querySelector("p").style.display = "block";
		}
	} else {
		el.setAttribute("class", "incorrect");

		unhideCurrentPart();
		score++;
	}

	let winStatus;
	if (score > 5) {
		winStatus = false;
	} else if (wordUnlocked(letters)) {
		winStatus = true;
	} else {
		return;
	}

	statusEl = statusDisplay.querySelector("#status");
	if (winStatus) {
		statusEl.setAttribute("class", "correct");
		statusEl.innerHTML = "You won!";
	} else {
		statusEl.setAttribute("class", "incorrect");
		statusEl.innerHTML = "You lost!";
		for (let letter of letters) {
			letter.querySelector("p").style.display = "block";
		}
	}
	statusDisplay.style.display = "block";
	allowInput = false;
}
