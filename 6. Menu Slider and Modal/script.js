"use strict";

const signUpBTN = document.getElementById("open");
const menuToggleBTN = document.getElementById("toggle");
const closeBTN = document.getElementById("close");
const modal = document.getElementById("modal");

const body = document.querySelector("body");
const nav = document.querySelector("nav");

// FUNCTIONS
function toggleMenu() {
  body.classList.toggle("show-nav");
}

// Displaying modal
function showModal() {
  modal.classList.add("show-modal");
}

// closing modal
function closeModal() {
  modal.classList.remove("show-modal");
}

// EVENT LISTENERS
signUpBTN.addEventListener("click", showModal);
menuToggleBTN.addEventListener("click", toggleMenu);
closeBTN.addEventListener("click", closeModal);

// Window is the upper most object in the browser. Any clicks outside the modal will call this
window.addEventListener("click", (e) =>
  e.target === modal ? closeModal() : false
);
