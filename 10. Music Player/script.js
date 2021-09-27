"use strict";

const musicContainer = document.getElementById("music-container");

const songTitle = document.getElementById("title");
const songCover = document.getElementById("cover");

const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");

const btnParent = document.querySelector(".navigation");
const playBTN = document.getElementById("play");
const prevBTN = document.getElementById("prev");
const nextBTN = document.getElementById("next");

const timeElapsed = document.getElementById("time-elapsed");
const timeLeft = document.getElementById("time-left");

// Song array that contains the names of all the songs. Names in here must match the song names you have in the folders. The images you want as covers should also be named so they match up with this array
const songs = ["hey", "summer", "ukulele"];

// Keep track of song index
let songIndex = 0;

// ////// FUNCTIONS

// Load song details into DOM
function loadSong(song) {
  songTitle.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
}

loadSong(songs[songIndex]);

// Check if song is playing
function checkPlaying() {
  const isPlaying = musicContainer.classList.contains("play");

  isPlaying ? pauseSong() : playSong();
}

// Play song
function playSong() {
  musicContainer.classList.add("play");
  playBTN.querySelector("i.fas").classList.remove("fa-play");
  playBTN.querySelector("i.fas").classList.add("fa-pause");

  audio.play();
  //   console.log(audio.duration);

  audio.addEventListener("loadedmetadata", () => {
    timeLeft.innerText = `0${Math.floor(audio.duration / 60)}:${Math.floor(
      audio.duration % 60
    )}`;
  });
}
// Play song
function pauseSong() {
  console.log(`hello`);
  musicContainer.classList.remove("play");

  playBTN.querySelector("i.fas").classList.remove("fa-pause");
  playBTN.querySelector("i.fas").classList.add("fa-play");

  audio.pause();
}

// Skip to next song
function nextSong() {
  // Change song info
  songIndex++;

  if (songIndex === songs.length) songIndex = 0;

  loadSong(songs[songIndex]);

  // Check if playing
  playSong();
}

// Play prev song
function rewind() {
  songIndex--;
  if (songIndex === -1) songIndex = songs.length--;

  loadSong(songs[songIndex]);
  playSong();
}

// Update prgress bar and time elapsed
function updateProgress() {
  const timeElap = audio.currentTime;
  const mins = `${Math.floor(timeElap / 60)}`;
  const secs = `${Math.floor(timeElap % 60)}`;

  timeElapsed.innerText = `0${mins}:${secs < 10 ? `0${secs}` : `${secs}`}`;
  //   console.log(`pro : ${timeElap / audio.duration}`);
  const progressPercent = (timeElap / audio.duration) * 100;

  progress.style.width = `${progressPercent}%`;
}

// Skip to specific part of song
function setProgress(e) {
  // Get the total width of the object you just clicked
  const width = this.clientWidth;
  // Position of your click ito its x position in relation to the whole object
  const clickX = e.offsetX;
  const duration = audio.duration;
  const percent = (clickX / width) * duration;

  audio.currentTime = percent;

  //   progress.style.width = `${percent}%`;
}

function songInteractions(e) {
  if (!e.target.classList.contains("action-btn")) return;

  const button = e.target.id;
  //   buttonFunctions[button];

  if (button === "play") checkPlaying();
  if (button === "next") nextSong();
  if (button === "prev") rewind();

  //   console.log(e.target.id);
}

// ////// EVENTLISTENERS
btnParent.addEventListener("click", songInteractions);
audio.addEventListener("timeupdate", updateProgress);
progressContainer.addEventListener("click", setProgress);
audio.addEventListener("ended", nextSong);
