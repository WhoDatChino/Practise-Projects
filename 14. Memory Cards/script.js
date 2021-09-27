"use strict";

const cardsContainer = document.getElementById("cards-container");
// Numbering of cards
const currentEl = document.getElementById("current");
// Form
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const addContainer = document.getElementById("add-container");
// Buttons
const prevBTN = document.getElementById("prev");
const nextBTN = document.getElementById("next");
const showBTN = document.getElementById("show");
const hideBTN = document.getElementById("hide");
const addCardBTN = document.getElementById("add-card");
const clearBTN = document.getElementById("clear");

// /////// GLOBAL VARIABLES

// Keep track of current card
let currentActiveCard = 0;

// Store DOM cards - the dom elements themeselves
const cardsEl = [];

// Store card data - info on the questions and answers
const cardsData = getCardsData();
//  [
//   {
//     question: "What is Shrek?",
//     answer: "Shrek is love",
//   },
//   {
//     question: "What colour is the sky?",
//     answer: "Blue",
//   },
//   {
//     question: "What is your favourite ice-cream?",
//     answer: "Oreo McFlurry from McDee's",
//   },
// ];

// /////// FUNCTIONS

// Create all card elements
function createAllCards() {
  cardsData.forEach((data, i) => createCard(data, i));
}

// Create a single card in the dom
function createCard(data, index) {
  const card = document.createElement("div");
  card.classList.add("card");

  // Adding active class to first card
  if (index === 0) {
    card.classList.add("active");
  }

  card.innerHTML = `
    <div class="inner-card">
        <div class="inner-card-front">
            <p>${data.question}</p>
        </div>
        <div class="inner-card-back">
            <p>${data.answer}</p>
        </div>
    </div>    
    `;

  card.addEventListener("click", () => card.classList.toggle("show-answer"));

  // Add to DOM cards
  cardsEl.push(card);

  cardsContainer.appendChild(card);

  updateCurrentText();
}
createAllCards();

function updateCurrentText() {
  currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
}

// Switch to next card
function nextCard() {
  cardsEl[currentActiveCard].className = "card left";

  //   cardsEl[currentActiveCard].classList.remove("active");
  //   cardsEl[currentActiveCard].classList.add("left");
  ++currentActiveCard;

  if (currentActiveCard > cardsEl.length - 1)
    currentActiveCard = cardsEl.length - 1;

  hideButtons();

  updateCurrentText();

  cardsEl[currentActiveCard].classList.add("active");
}

// Switch to prev card
function prevCard() {
  cardsEl[currentActiveCard].classList.remove("active");
  --currentActiveCard;

  if (currentActiveCard < 0) currentActiveCard = 0;

  updateCurrentText();
  hideButtons();

  cardsEl[currentActiveCard].className = "card active";
  //   cardsEl[currentActiveCard].classList.remove("left");

  //   cardsEl[currentActiveCard].classList.add("active");
}

function hideButtons() {
  currentActiveCard === 0
    ? (prevBTN.style.visibility = "hidden")
    : (prevBTN.style.visibility = "visible");

  currentActiveCard === cardsEl.length - 1
    ? (nextBTN.style.visibility = "hidden")
    : (nextBTN.style.visibility = "visible");

  if (cardsEl.length === 0) {
    prevBTN.style.visibility = "hidden";
    nextBTN.style.visibility = "hidden";
  }
}
hideButtons();

// Get cards from local storage
function getCardsData() {
  const cards = JSON.parse(localStorage.getItem("cards"));

  return cards === null ? [] : cards;
}

function setCardsData(cardData) {
  localStorage.setItem("cards", JSON.stringify(cardData));

  //   reload page so that the data will be reflected in the dom
  window.location.reload();
}

// /////// EVENTLISTENERS
nextBTN.addEventListener("click", nextCard);
prevBTN.addEventListener("click", prevCard);

showBTN.addEventListener("click", () => {
  addContainer.classList.add("show");
});

hideBTN.addEventListener("click", () => {
  addContainer.classList.remove("show");
});

addCardBTN.addEventListener("click", () => {
  const question = questionEl.value;
  const answer = answerEl.value;

  if (question.trim() && answer.trim()) {
    // Creating new card object. Es6 syntax means you dont have to type `{question : question , answer : answer}`
    const newCard = { question, answer };

    createCard(newCard);

    questionEl.value = "";
    answerEl.value = "";

    addContainer.classList.remove("show");
    cardsData.push(newCard);
    setCardsData(cardsData);
  }
});

clearBTN.addEventListener("click", () => {
  localStorage.clear();

  cardsContainer.innerHTML = "";
  window.location.reload();
});
