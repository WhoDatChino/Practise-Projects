"use strict";

const postContainer = document.getElementById("post-container");
const loadingAnimation = document.getElementById("loader");
const filter = document.getElementById("filter");

// ////// GLOBAL VARIABLES

// Limit to the number of posts fetched each time
let limit = 3;
// Defualt is 1st page
let page = 1;

// ////// FUNCTIONS
async function getPost() {
  const req = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );

  const data = await req.json();

  return data;
}
// getPost();

// Show the posts oin the dom
async function showPosts() {
  const posts = await getPost();

  posts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");
    postEl.innerHTML = `<div class="number">${post.id}</div>
        <div class="post-info">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-body">${post.body}</p>
        </div>`;

    postContainer.appendChild(postEl);
  });
}
showPosts();

// Show loader animation & fetch from api
function showLoading() {
  loadingAnimation.classList.add("show");

  page++;
  setTimeout(() => {
    showPosts();
    hideLoader();
  }, 1000);
}

function hideLoader() {
  loadingAnimation.classList.remove("show");
}

function filterPosts(e) {
  // get the actual letters of what the user is typing in (is case sensitive)
  const term = e.target.value.toUpperCase();
  // Select all the posts in the dom - returns nodeList which is essentially an array
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    //   Selecting the title & body text from each post
    const title = post.querySelector(".post-title").innerText.toUpperCase();
    const body = post.querySelector(".post-title").innerText.toUpperCase();

    // indexOf will return -1 if it is found to be false. Searching if either the title text or the body text contains the letters inputted by user. Hide the posts that dont return any matches
    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = "flex";
    } else {
      post.style.display = "none";
    }
  });

  console.log(term.trim());
}

// ////// EVENTLISTENERS
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // scrollTop = distance top of viewport to top of webpage
  // scrollHeight = Constant - total height of webpage
  // clientHeight = height of the element to which the event is attached, in this case it is the root element(window)

  //   console.log(scrollTop, scrollHeight, clientHeight);

  // Random stack overflow solution where if the user scrolls down past a certain point, the code block will be executed. (can play around with the values) Can also make use of the intersection observer api
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    // 1. Show loader
    // 2. Fetch api
    showLoading();
  }
});

filter.addEventListener("input", filterPosts);
