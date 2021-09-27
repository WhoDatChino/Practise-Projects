"use strict";

const main = document.getElementById("main");
const addUserBTN = document.getElementById("add-user");
const doubleBTN = document.getElementById("double");
const millionairesBTN = document.getElementById("show-millionaires");
const sortBTN = document.getElementById("sort-richest");
const calcWealthBTN = document.getElementById("calculate-wealth");

// Array of objects that will contain the randomly generated people where each object has a name and money value that contains that persons wealth
let data = [];

getRandomUser();
getRandomUser();
getRandomUser();

// Fetch random user and add money
async function getRandomUser() {
  const req = await fetch(`https://randomuser.me/api/`);

  const data = await req.json();

  //   console.log(data);

  const user = data.results[0];

  const newUser = {
    fullName: `${user.name.first} ${user.name.last}`,
    money: +(Math.random() * 1000000).toFixed(2),
  };

  //   console.log(newUser);

  addData(newUser);
}

// Converts number to readable currency
function convertToCurrency(num) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

// Adds data to the data array
function addData(obj) {
  data.push(obj);
  //   console.log(data);

  updateDOM();
}

// Update Dom
// Setting a default param incase nothing is passed into this function when it is called (like in the addData function)
function updateDOM(providedData = data) {
  // 1. Clear div. Main is the parent who already has a child therefore reseting it is essentially just setting this first child rather than setting it to empty string
  main.innerHTML = `<h2><strong>Person</strong> Wealth</h2>`;

  providedData.forEach((person) => {
    const element = document.createElement("div");

    element.classList.add("person");
    element.innerHTML = `<strong>${
      person.fullName
    }</strong> ${convertToCurrency(person.money)}`;
    main.appendChild(element);
  });
}

// Double money
function doubleMoney() {
  data = data.map((user) => {
    return { ...user, money: user.money * 2 };
    // Spreading the user essentially just copies the entire user into this newly returned object. Then the money property in the new object is set to a new value
    // NOTE: this only works w/o error if expression is eplicitly returned & wrapping in{}
  });

  updateDOM();
}

// Sort by the richest people
function sortByRichest() {
  data.sort((a, b) => b.money - a.money);
  // console.log(data);
  updateDOM();
}

// Filter out the poor people
function showMillionaires() {
  data = data.filter((users) => users.money > 1000000);
  // console.log(data);
  updateDOM();
}

// Calculate entire wealth
function calcWealth() {
  let total = convertToCurrency(
    Math.floor(data.reduce((acc, data) => acc + data.money, 0))
  );
  // console.log(convertToCurrency(total));

  const wealthEl = document.createElement("div");
  wealthEl.innerHTML = `<h3>Total Wealth: <strong>${total}</strong></h3>`;
  main.appendChild(wealthEl);
}

// EVENT LISTENERS
addUserBTN.addEventListener("click", getRandomUser);
doubleBTN.addEventListener("click", doubleMoney);
sortBTN.addEventListener("click", sortByRichest);
millionairesBTN.addEventListener("click", showMillionaires);
calcWealthBTN.addEventListener("click", calcWealth);
