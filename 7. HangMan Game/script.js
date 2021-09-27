"use strict";

const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBTN = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.querySelector(".final-message");

// Body parts
const figureParts = document.querySelectorAll(".figure-part");

const words = [
  "application",
  "interface",
  "javascript",
  "programming",
  "github",
  "algorithm",
  "data",
  "hacking",
  "cryptocurrency",
];

let selectedWord = words[Math.floor(Math.random() * words.length)];

// console.log(selectedWord);
const correctLetters = [];
const wrongLetters = [];

// FUNCTIONS

// Shows the hidden word
// Sets innerHTML of the wordEl the selected word split into array, that is mapped to create an html markup for each letter in the randomly chosen word. If that letter is found, the letter will be shown (else only the underline will be shown)
function displayWord() {
  wordEl.innerHTML = `
${selectedWord
  .split("")
  .map(
    (letter) => `
    <span class="letter">
        ${correctLetters.includes(letter) ? letter : ""}
    </span>
`
  )
  .join("")}
`;

  const innerWord = wordEl.innerText.replace(/\n/g, "");
  console.log(wordEl.innerText, innerWord);

  // See if the player has won or not
  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations 🦾 You guessed the word!";
    popup.style.display = "flex";
  }
}

// Update the wrongLetters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
  ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Display parts
  figureParts.forEach((part, i) => {
    const errors = wrongLetters.length;

    if (i < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Check if player lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = "Unfortunately you lost 😥";
    popup.style.display = "flex";
  }
}

// Show notification popup
function showNotification() {
  notification.classList.add("show");
  // console.log(`goobye`);

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// EVENT LISTENERS

// Keydown event listener for letter presses
window.addEventListener("keydown", (e) => {
  // console.log(e.keyCode); // Each key you press has a corresponding key code. Letters have codes that start from 65 (a) and end at 90 (z)

  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);

        displayWord();
      } else {
        // In the case where you typed a letter that is already in the correctLetters array
        showNotification();
      }
    } else {
      // If a user presses a letter that is not correct - also need to check if it isnt already there
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        // If user types in incorrect letter that they have already used - ie its already in the wrongLetters array
        showNotification();
      }
    }
  }
});

// Restart game
playAgainBTN.addEventListener("click", () => {
  // Empty the arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  selectedWord = words[Math.floor(Math.random() * words.length)];

  displayWord();

  updateWrongLettersEl();

  popup.style.display = "none";
});

displayWord();
