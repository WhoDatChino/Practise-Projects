"use strict";

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const mins = document.getElementById("mins");
const seconds = document.getElementById("seconds");
const countdown = document.getElementById("countdown");
const year = document.getElementById("year");
const loading = document.getElementById("loading");

// Hard code the year each time -n would need to be changed every year
// const newYearTime = new Date('January 01 2022 00:00:00')

// Getting year dynamically
const currentYear = new Date().getFullYear();
const newYearTime = new Date(`January 1 ${currentYear + 1} 00:00:00`);

// Set the year
year.innerText = `${currentYear + 1}`;

// Update countdown time
function updateCountdown() {
  const currentTime = new Date();
  const diff = newYearTime - currentTime; // Gives you the timestamp value

  const daysTo = Math.floor(diff / 1000 / 60 / 60 / 24); // Divided by 1000 so we can get the number of seconds till next year. /60 to get mins to next year. /60 again to get number of hours to next year. /24 to get the number of days till next year
  const hoursTo = Math.floor(diff / 1000 / 60 / 60) % 24; // %24 cz need to account for the numbers that have already passed for today. Same reasoning for use of modlus operator further on
  const minsTo = Math.floor(diff / 1000 / 60) % 60;
  const secsTo = Math.floor(diff / 1000) % 60;
  //   console.log(daysTo, hoursTo, minsTo, secsTo);

  days.innerText = daysTo;
  hours.innerText = hoursTo < 10 ? `0${hoursTo}` : hoursTo;
  mins.innerText = minsTo < 10 ? `0${minsTo}` : minsTo;
  seconds.innerText = secsTo < 10 ? `0${secsTo}` : secsTo;
}

// updateCountdown();
setInterval(updateCountdown, 1000);

// Show Spinner before countdown
setTimeout(() => {
  loading.remove();
  countdown.style.display = year.style.display = "flex";
}, 1000);
