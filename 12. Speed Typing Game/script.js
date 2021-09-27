"use strict";

const settingsBTN = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelector = document.getElementById("difficulty");
const word = document.getElementById("word");
const text = document.getElementById("text");
const timeLeft = document.getElementById("time");
const scoreEl = document.getElementById("score");
const endgameEl = document.getElementById("end-game-container");

// /////// GLOBAL VARIABLES

const amountWords = 20;
// Init variables
let wordsArr;
let score = 0;
let randomWord;
let time = 10;

const difficultySelection = {
  easy: 0,
  medium: 1,
  hard: 2,
};

let difficultyLevel = difficultySelector.value;

// From easy - med - hard    difficulties
const difficultySeconds = [6, 4, 2];

// focus on the text input
text.focus();

// Start counting down
const timeInterval = setInterval(updateTime, 1000);

// /////// FUNCTIONS

// Random word generator
async function fetchRandomWords() {
  const req = await fetch(
    `http://random-word-api.herokuapp.com/word?number=${amountWords}&swear=0`
  );

  wordsArr = await req.json();

  addWordToDOM();
  console.log(wordsArr);
}

fetchRandomWords();

// Start w/ random word from words arr
function getRandomWord() {
  return wordsArr[Math.floor(Math.random() * amountWords)];
}

function addWordToDOM() {
  randomWord = getRandomWord();
  word.innerText = randomWord;
}

function updateScore() {
  score++;
  scoreEl.innerText = score;
}

// Update time
function updateTime() {
  time--;
  timeLeft.innerText = `${time}s`;

  if (time === 0) {
    clearInterval(timeInterval);
    gameOver();
  }
}

// Called when the game is finished and the timer has run out
function gameOver() {
  endgameEl.innerHTML = `
    <h1>Time ran out!</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
    `;
  // window.location.reload essentially just reloads the page

  endgameEl.style.display = "flex";
}

function setDifficulty() {
  localStorage.setItem("difficultyLevel", JSON.stringify(difficultyLevel));
}

function getDifficulty() {
  difficultyLevel =
    localStorage.getItem("difficultyLevel") !== null
      ? JSON.parse(localStorage.getItem("difficultyLevel"))
      : "easy";

  difficultySelector.value = difficultyLevel;
}

getDifficulty();

// /////// EVENTLISTENERS
text.addEventListener("input", (e) => {
  const insertedText = e.target.value;
  console.log(insertedText);
  if (insertedText === randomWord) {
    text.value = "";
    updateScore();
    addWordToDOM();

    time += difficultySeconds[difficultySelection[difficultyLevel]];
    updateTime();
  }
});

settingsBTN.addEventListener("click", () => {
  settings.classList.toggle("hide");
});

// Settings select
settingsForm.addEventListener("change", (e) => {
  difficultyLevel = e.target.value;
  //   console.log(difficultyLevel);
  setDifficulty();
});
