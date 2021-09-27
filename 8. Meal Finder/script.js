"use srtict";

const search = document.getElementById("search");
const submit = document.getElementById("submit");
const randomBTN = document.getElementById("random");
const mealsEL = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const single_mealEl = document.getElementById("single-meal");

// /////////FUNCTIONS

// Access the API - search meal
function searchMeal(e) {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;

  //   Check if input field is empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search Results for "${term}":</h2>`;
        // Check to see if the API returns any data with the user's search term
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results for "${term}". Please try again.</p>`;
        } else {
          mealsEL.innerHTML = data.meals
            .map(
              (meal) => `
          <div class="meal">
              <img src ="${meal.strMealThumb}" alt="${meal.strMeal}">
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
          </div>
          `
            )
            .join("");
        }
      });
    //   Clear search text
    search.value = "";
  } else {
    alert(`Please enter an search term`);
  }

  console.log(term);
}

// Fetch meal by ID - makes another api call to get all the info on a meal searched by its id. Used when a meal element is clicked to display details pertaining to that specific meal
function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

// Adding meal to the DOM
function addMealToDom(meal) {
  const ingredients = [];

  // Have to do this cz of the way the api is formatted
  for (let i = 0; i <= 20; i++) {
    // Cant use dot notation (meal.strIngredient${i}) cz making use of a variable therefore need to use the bracket notation
    if (meal[`strIngredient${i}`]) {
      // Pushing the ingredient and its corresponding measurement to the array
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      // Break out the loop if there is no ingredient - not always 20 ingredients
      continue;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients:</h2>
            <ul>
                ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
            </ul>
        </div>
    </div>
    `;

  console.log(`ings`, ingredients);
}

// Create and fetch random meal
function randomMeal() {
  // Clear any perviously displayed meals and heading
  mealsEL.innerHTML = "";
  resultHeading.innerHTML = "";

  // fetch random meal
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      // The api will return an array even though it is only 1 meal so we just take it out of the array
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

// ////////EVENT LISTENERS

submit.addEventListener("submit", searchMeal);

// Meals element click
mealsEL.addEventListener("click", (e) => {
  // .find() will perform whatever operation you want it to on each of the child elements of the clicked element => will return each element itself
  const mealInfo = e.path.find((child) => {
    // console.log(child);
    if (child.classList) {
      // Want to return only the element that has the class of meal-info
      return child.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  // Getting the ID of the clicked meal
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    // console.log(mealID);
    getMealByID(mealID);
  }
});

randomBTN.addEventListener("click", randomMeal);
