"use strict";

const balance = document.getElementById("balance");
const income = document.getElementById("money-plus");
const expenses = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");

// Array of object that contain the info for each expense/income that the user inputs. (-ve is exp; +ve is an income)
// const dummyTransactions = [
//   { id: 1, text: "Flowers", amount: -20 },
//   { id: 2, text: "Car oil", amount: -120 },
//   { id: 3, text: "Camera Return", amount: 500 },
//   { id: 4, text: "Salary", amount: 1553.53 },
//   { id: 5, text: "phone", amount: -356.28 },
// ];

// Global variable for the transactions which will later get the info from localStorage
// let transactions = dummyTransactions
let transactions = [];

// //////// FUNCTIONS

// Add transactions to DOM
function addTransactionDOM(transaction) {
  // My Solution
  const elementClass = transaction.amount > 0 ? `plus` : `minus`;
  const sign = transaction.amount > 0 ? `+` : `-`;

  let html = `<li class="${elementClass}" data-ID=${transaction.id}>${
    transaction.text
  } <span>${sign}$${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn">X</button></li>`;

  list.insertAdjacentHTML("afterbegin", html);
  //   console.log(html);

  calcAndUpdateTotals();

  /*
  // Course Solution
  const sign = transaction.amount > 0 ? `+` : `-`;
  const item = document.createElement("li");

  item.classList.add(transaction.amount > 0 ? `plus` : `minus`);

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn">X</button></li>
    `;

  list.appendChild(item);
  */
}

// Calc Totals (my solution)
function calcAndUpdateTotals() {
  const bal = transactions.reduce((acc, ele) => acc + ele.amount, 0);
  const calcIncomes = transactions
    .filter((trans) => trans.amount > 0)
    .reduce((acc, trans) => acc + trans.amount, 0);
  const calcExpenses = transactions
    .filter((trans) => trans.amount < 0)
    .reduce((acc, trans) => acc + trans.amount, 0);

  //   console.log(bal);
  balance.innerText = `${formatToCurrency(bal)}`;
  income.innerText = `${formatToCurrency(calcIncomes)}`;
  expenses.innerText = `${formatToCurrency(calcExpenses)}`;
}

// Format to currency
function formatToCurrency(num) {
  let currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
  return currency;
}

// User creates new entry
function createNewEntry(e) {
  e.preventDefault();

  if (
    textInput.value.trim() === "" ||
    amountInput.value.trim() === "" ||
    +amountInput.value === 0
  ) {
    alert(`Please add a text and an amount`);
  } else {
    const transaction = {
      id: generateID(),
      amount: +amountInput.value,
      text: textInput.value,
    };

    console.log(`transaction`, transaction);
    console.log(`arr`, transactions);
    transactions.push(transaction);

    setLocalStorage();

    calcAndUpdateTotals();
    addTransactionDOM(transaction);

    textInput.value = "";
    amountInput.value = "";
  }
}

// Generates random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Deletes entry from history
function deleteEntry(e) {
  if (!e.target.classList.contains("delete-btn")) {
    return;
  }
  //   console.log(e.target);
  const clicked = e.target.closest("li");
  //   const clickedID = +clicked.dataset.id;
  //   console.log(clickedID);
  clicked.remove();
  transactions = transactions.filter((ele) => ele.id !== +clicked.dataset.id);
  setLocalStorage();
  //   console.log(`trans`, transactions);

  calcAndUpdateTotals();
  //   addTransactionDOM(transaction);
}

// Set localStorage
function setLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Get local storage
function getLocalStorage() {
  const local = JSON.parse(localStorage.getItem("transactions"));
  if (!local) return;
  transactions = local;
}

// Initialization - IIFE
(function init() {
  list.innerHTML = "";
  getLocalStorage();
  console.log(transactions);
  //   if (!transactions) return;
  transactions.forEach((trans) => addTransactionDOM(trans));
})();

// /////// EVENT LISTENERS

form.addEventListener("submit", createNewEntry);
list.addEventListener("click", deleteEntry);
