"use strict";

const main = document.querySelector("main");
const voiceSelect = document.getElementById("voices");
const textArea = document.getElementById("text");

const readBTN = document.getElementById("read");
const toggleBTN = document.getElementById("toggle");
const closeBTN = document.getElementById("close");

// ////// GLOBAL VARIABLES

// Array of objects where the image is the path to get the image in the folder and the text is what you ultimately want the api to read - associated with the image
const data = [
  {
    image: `./img/drink.jpg`,
    text: `I'm thirsty`,
  },
  {
    image: `./img/angry.jpg`,
    text: `I'm angry`,
  },
  {
    image: `./img/food.jpg`,
    text: `I'm hungry`,
  },
  {
    image: `./img/grandma.jpg`,
    text: `I want to go to grandma's house`,
  },
  {
    image: `./img/happy.jpg`,
    text: `I'm happy`,
  },
  {
    image: `./img/home.jpg`,
    text: `I want to go home`,
  },
  {
    image: `./img/hurt.jpg`,
    text: `I'm hurt`,
  },
  {
    image: `./img/outside.jpg`,
    text: `I want to go outside`,
  },
  {
    image: `./img/sad.jpg`,
    text: `I'm sad`,
  },
  {
    image: `./img/scared.jpg`,
    text: `I'm scared`,
  },
  {
    image: `./img/school.jpg`,
    text: `I want to go to school`,
  },
  {
    image: `./img/tired.jpg`,
    text: `I'm tired`,
  },
];

data.forEach(createBox);

// ////// FUNCTIONS

// Create speech boxes for images
function createBox(item, i) {
  const box = document.createElement("div");

  const { image, text } = item;
  box.classList.add("box");

  box.innerHTML = `
  <img src="${image}" alt="${text}"/>
  <p class="info">${text}</p>
  `;

  // @todo -> speak event
  box.addEventListener("click", () => {
    // Set the text that we later want to speak. The text will be the item.text for each particular item
    setTextMessage(text);
    // Making the api actually speak
    speakText();

    // Add an active effect and then quickly remove it
    box.classList.add("active");
    setTimeout(() => box.classList.remove("active"), 900);
  });

  main.appendChild(box);
}

// Initializing a speech synthesis utterance - this is what takes care of actually speaking the text
const message = new SpeechSynthesisUtterance();

// Get the voices
let voices = [];

function getVoices() {
  // Making use of web speech api. This returns an array of all the voices available to read speech
  voices = speechSynthesis.getVoices();

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.innerText = `${voice.name} ${voice.lang}`;
    voiceSelect.appendChild(option);
  });
  console.log(voices);
}

// Set text
function setTextMessage(text) {
  message.text = text;
}

// Speak text
function speakText() {
  speechSynthesis.speak(message);
}

// Set the voice
function setVoice(e) {
  message.voice = voices.find((voice) => voice.name === e.target.value);
  // Finding the voice (object in the array) in the array that matches the one clicked by the user in the select box
}

// /////// EVENTLISTENERS

// toggle text box
toggleBTN.addEventListener("click", () => {
  document.getElementById("text-box").classList.toggle("show");
});

// Close window button
closeBTN.addEventListener("click", () =>
  document.getElementById("text-box").classList.remove("show")
);

// Voices changes
speechSynthesis.addEventListener("voiceschanged", getVoices);

getVoices();

// Change Voice
voiceSelect.addEventListener("change", setVoice);

// Read text button
readBTN.addEventListener("click", () => {
  setTextMessage(textArea.value);
  speakText();
});
