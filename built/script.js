var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
let bodyParts = [];
let word = "BANANA";
let currentGuess = "";
let score = 0;
let guesses = [];
let allowInput = true;
function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function onReady() {
    return __awaiter(this, void 0, void 0, function* () {
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
        word = yield getNewWord();
        displayWord();
        hideHangman();
    });
}
window.onload = onReady;
window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }
    if (event.key.length == 1 && event.key.match(/[a-z]/i)) {
        let input = event.key.toUpperCase();
        for (let button of buttons) {
            if (button.innerHTML == input) {
                processInput(button);
                return;
            }
        }
    }
    else {
        return;
    }
    event.preventDefault();
}, true);
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
        let textEl = document.createElement("p");
        letterEl.appendChild(textEl);
        textEl.innerHTML = letter;
        wordContainer.appendChild(letterEl);
    }
}
function getNewWord() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://random-word-api.herokuapp.com/word?length=" + randint(5, 8));
        const data = yield response.json();
        return data[0].toUpperCase();
    });
}
function reset() {
    return __awaiter(this, void 0, void 0, function* () {
        hideHangman();
        for (let button of buttons) {
            button.setAttribute("class", "");
        }
        score = 0;
        guesses = [];
        word = yield getNewWord();
        displayWord();
        statusDisplay.style.display = "none";
        allowInput = true;
    });
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
    let counter = 0;
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
        let correctIndexes = indexes(word, currentGuess);
        for (let i of correctIndexes) {
            letters[i].querySelector("p").style.display = "block";
        }
    }
    else {
        el.setAttribute("class", "incorrect");
        unhideCurrentPart();
        score++;
    }
    let winStatus;
    if (score > 5) {
        winStatus = false;
    }
    else if (wordUnlocked(letters)) {
        winStatus = true;
    }
    else {
        return;
    }
    let statusEl = statusDisplay.querySelector("#status");
    if (winStatus) {
        statusEl.setAttribute("class", "correct");
        statusEl.innerHTML = "You won!";
    }
    else {
        statusEl.setAttribute("class", "incorrect");
        statusEl.innerHTML = "You lost!";
        for (let letter of letters) {
            letter.querySelector("p").style.display = "block";
        }
    }
    statusDisplay.style.display = "block";
    allowInput = false;
}
