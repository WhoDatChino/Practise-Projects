"use strict";

// ////////////////////////////////
// Spaghetti code (before refactor)
// ////////////////////////////////
// ////////////////////////////////

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

// FUNCTIONS

// Show error
function showError(input, message) {
  const formControl = input.parentElement;
  // Better to set class names rather than add cz then you dont have to check if element already has another class already
  formControl.className = `form-control error`;
  const small = formControl.querySelector("small");
  small.innerText = message;
}

// Show success
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = `form-control success`;
}

// Validate email
function checkEmail(input) {
  // Making use of regex -> taken off stackoverflow
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, `Not a valid email`);
  }
}

// Check required fields
function checkRequired(inputArr) {
  inputArr.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${getFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

// Checks the input length - takes in an input, min characters and max characters
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(input, `${getFieldName(input)} can not exceed ${max} characters`);
  }
}

// Checks that passwords are exactly the same
function checkPasswordsMatch(input1, input2) {
  if (
    input1.value === input2.value &&
    input1.value !== "" &&
    input2.value !== ""
  ) {
    showSuccess(input1);
    showSuccess(input2);
  } else {
    showError(input2, `Passwords do not match`);
  }
}

// Correctly capitalises the id for the error message
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// EVENT LISTENERS
/*
form.addEventListener('submit',function(e){
    e.preventDefault()
console.log(username.value)

if(username.value ===''){
    // function that will take in the element and the specific error message needed to be displayed 
    showError(username, 'Username is required')
} else{
    showSuccess(username)
}
if(email.value ===''){
    // function that will take in the element and the specific error message needed to be displayed 
    showError(email, 'Email is required')
} else if(!isValidEmail(email.value)){
    showError(email, 'Email is not valid')
} 
else{
    showSuccess(username)
}
if(password.value ===''){
    // function that will take in the element and the specific error message needed to be displayed 
    showError(password, 'Password is required')
} else{
    showSuccess(username)
}
if(password2.value ===''){
    // function that will take in the element and the specific error message needed to be displayed 
    showError(password2, 'Passwords do not match')
} else{
    showSuccess(username)
}
})
*/

// ////////////////////////////////
// After refactor -> for event listener
// ////////////////////////////////
// ////////////////////////////////

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Passing in an array removes the need to repeat yourself from calling this function 4 times over for each input. Rather just set the function to be able tp accept an array of inputs so that it can easily be expanded in future
  checkRequired([username, email, password, password2]);
  checkLength(username, 3, 15);
  checkLength(password, 6, 25);
  checkEmail(email);
  checkPasswordsMatch(password, password2);
});
