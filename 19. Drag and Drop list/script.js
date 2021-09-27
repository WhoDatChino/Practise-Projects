"use strict";

const draggableList = document.getElementById("draggable-list");
const checkBTN = document.getElementById("check");

// Data copied from a API - copied over for simplicity sake
let richestPeople = [
  {
    person: "Bernard Arnault",
    picture:
      "https://specials-images.forbesimg.com/imageserve/5dc05518ca425400079c659f/416x416.jpg?background=000000&cropX1=0&cropX2=4000&cropY1=1209&cropY2=5212",
    rank: 1,
    sort: Math.random(),
  },
  {
    person: "Jeff Bezos",
    picture:
      "https://specials-images.forbesimg.com/imageserve/5bb22ae84bbe6f67d2e82e05/416x416.jpg?background=000000&cropX1=627&cropX2=1639&cropY1=129&cropY2=1142",
    rank: 2,
    sort: Math.random(),
  },
  {
    person: "Elon Musk",
    picture:
      "https://specials-images.forbesimg.com/imageserve/5f47d4de7637290765bce495/416x416.jpg?background=000000&cropX1=1699&cropX2=3845&cropY1=559&cropY2=2704",
    rank: 3,
    sort: Math.random(),
  },
  {
    person: "Bill Gates",
    picture:
      "https://specials-images.forbesimg.com/imageserve/5f4ebe0c87612dab4f12a597/416x416.jpg?background=000000&cropX1=292&cropX2=3684&cropY1=592&cropY2=3987",
    rank: 4,
    sort: Math.random(),
  },
  {
    person: "Mark Zuckerberg",
    picture: "./img/mark.jpg",
    rank: 5,
    sort: Math.random(),
  },
  {
    person: "Larry Page",
    picture:
      "https://specials-images.forbesimg.com/imageserve/5c76bcaaa7ea43100043c836/416x416.jpg?background=000000&cropX1=227&cropX2=2022&cropY1=22&cropY2=1817",
    rank: 6,
    sort: Math.random(),
  },
  {
    person: "Larry Ellison",
    picture:
      "https://specials-images.forbesimg.com/imageserve/5e8b62cfc095010007bffea0/416x416.jpg?background=000000&cropX1=0&cropX2=4529&cropY1=652&cropY2=5184",
    rank: 7,
    sort: Math.random(),
  },
  {
    person: "Sergey Brin",
    picture:
      "https://specials-images.forbesimg.com/imageserve/5c7d7c254bbe6f78090d831f/416x416.jpg?background=000000&cropX1=475&cropX2=2887&cropY1=168&cropY2=2582",
    rank: 8,
    sort: Math.random(),
  },
  {
    person: "Warren Buffett",
    picture:
      "https://specials-images.forbesimg.com/imageserve/5babb7f1a7ea4342a948b79a/416x416.jpg?background=000000&cropX1=748&cropX2=3075&cropY1=1753&cropY2=4082",
    rank: 9,
    sort: Math.random(),
  },
  {
    person: "Francoise Bettencourt Meyers ",
    picture:
      "https://specials-images.forbesimg.com/imageserve/605e26e3c65f7c2596bd3e15/416x416.jpg?background=000000&cropX1=0&cropX2=1080&cropY1=0&cropY2=1080",
    rank: 10,
    sort: Math.random(),
  },
];

let listItems = [];
let randomOrderRichPeople;

let dragStartIndex;

createList();

async function getRichPeople() {
  const req = await fetch(
    `https://forbes400.herokuapp.com/api/forbes400?limit=${numberRichPeople}`
  );

  const data = await req.json();
  console.log(data);

  data.forEach((person) => {
    const info = {
      personName: person.personName,
      picture: person.squareImage,
      netWorth: Math.floor(person.finalWorth),
      industry: person.industries[0],
      companies: person.source,
      originCountry: person.countryOfCitizenship,
      rank: person.rank,
    };

    richestPeople.push(info);
  });
  console.log(richestPeople);
}

// getRichPeople();

// Insert List Items into dom
function createList() {
  // Making a copy of the array so that we dont mutate the original one
  [...richestPeople]
    .sort((a, b) => a.sort - b.sort)
    .forEach((person, i) => {
      const listItem = document.createElement("li");

      // Setting the index to the data attribute for each dom element. Each element has to be unique so that we can identify it
      listItem.setAttribute("data-index", i);

      listItem.innerHTML = `
        <span class='number'>${i + 1}</span>
        <div class='draggable' draggable='true' data-rank='${person.rank}'>
            <img class='person-img" height='80px' width='80px' src='${
              person.picture
            }'/>
            <p class='person-name'>${person.person}</p>
            
            <i class='fas fa-grip-lines'></i>
        </div>
        
        `;

      listItems.push(listItem);

      draggableList.appendChild(listItem);
    });

  addEventListeners();
}

// console.log(listItems);

function dragStart() {
  //   console.log(`dragstart`);
  // The index position where the element you have started to move came from
  dragStartIndex = +this.closest("li").getAttribute("data-index");
  //   console.log(dragStartIndex);
}
function dragEnter() {
  //   console.log(`dragenter`);
  this.classList.add("over");
}
function dragDrop() {
  //   console.log(`drop`);
  const dragEndIndex = +this.getAttribute("data-index");

  swapItems(dragStartIndex, dragEndIndex);

  this.classList.remove("over");
  console.log(listItems);
}
function dragOver(e) {
  //   console.log(`dragover`);
  // Only have this callback and eventListener so that we can prevent its behavior. It will stop the drop event from being registered and therefore the function for that listener will not be executed
  e.preventDefault();
}
function dragLeave() {
  //   console.log(`dragleave`);
  this.classList.remove("over");
}

function swapItems(fromIndex, toIndex) {
  // Selecting only the div inside the li element(parent) -> only that will be moved
  const item1 = listItems[fromIndex].querySelector(".draggable");
  const item2 = listItems[toIndex].querySelector(".draggable");

  // These 2 lines happen instantly. The draggable element is put in its new parent w/ the old one, but near instantaneosly the old one is removed and placed in the parent that had been left empty
  listItems[toIndex].appendChild(item1);
  listItems[fromIndex].appendChild(item2);

  // listItems array automatically updated. Not sure why
}

function checkOrder() {
  listItems.forEach((item, i) => {
    const sortedRank = +item
      .querySelector(".draggable")
      .getAttribute("data-rank");

    if (sortedRank - 1 !== i) {
      item.className = "wrong";
    } else {
      item.className = "right";
    }
  });
}

// ////// EVENT LISTENERS
// Events to be used: dragenter, dragstart, dragover, dragleave, drop

function addEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll(".draggable-list li");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });

  dragListItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}

checkBTN.addEventListener("click", checkOrder);
