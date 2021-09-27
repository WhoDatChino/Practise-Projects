"use strict";

const currencyEl_one = document.getElementById("currency-one");
const amountEl_one = document.getElementById("amount-one");
const currencyEl_two = document.getElementById("currency-two");
const amountEl_two = document.getElementById("amount-two");

const rateEl = document.getElementById("rate");
const swap = document.getElementById("btn");

// Fetch exhange rate and update the dom
async function calculate() {
  const currencyOne = currencyEl_one.value;
  const currencyTwo = currencyEl_two.value;

  console.log(currencyOne, currencyTwo);

  const req = await fetch(
    `https://v6.exchangerate-api.com/v6/3d872c24af080a2482842e01/latest/${currencyOne}`
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)

      const rate = data.conversion_rates[currencyTwo];
      console.log(`rate:`, rate);

      rateEl.innerText = `1 ${currencyOne} = ${rate} ${currencyTwo}`;

      amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
    });
}

calculate();

// EVENT LISTENERS

currencyEl_one.addEventListener("change", calculate);
amountEl_one.addEventListener("input", calculate); // Event fired when an input occurs in the input field -> specifically used for input elements. Fires when something typed or when arrows used to change value
currencyEl_two.addEventListener("change", calculate);
currencyEl_two.addEventListener("input", calculate);
swap.addEventListener("click", () => {
  // Swapping the values in the select element
  const temp = currencyEl_one.value;
  currencyEl_one.value = currencyEl_two.value;
  currencyEl_two.value = temp;

  calculate();
});
