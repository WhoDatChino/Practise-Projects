"use strict";

const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)"); // makes it so u can access all the elements as if they are an array. Grabs all the seats in a row that are not occupied
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie"); // Gives the element

populateUI();

let ticketPrice = +movieSelect.value; // Gives the value associated with the element

// FUNCTIONS

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}

function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  // Copy selected seats into arr
  // Map through arr
  // Return a new array indexes
  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
  //   console.log(selectedSeats);
}

// Get data from local storage and populate UI
function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, i) => {
      if (selectedSeats.indexOf(i) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
    // console.log(`hello`, selectedMovieIndex);
  }

  const selectedMoviePrice = localStorage.getItem("selectedMoviePrice");
}

// EVENT LISTENERES

// Seat click event
container.addEventListener("click", (e) => {
  // Ensures the clicked element is a seat AND does not have the occupied class
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");

    updateSelectedCount();
  }
});

// Movie select event
// CHANGE EVENT OCCURS ANY TIME THE SELECTED OPTION CHANGES
movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;

  // Distinguish which movie has been selected - property available on <select> elements - gives you the index as if the options are an array (among others)
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});

// Set initial count and total
updateSelectedCount();
