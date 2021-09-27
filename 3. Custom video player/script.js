"use strict";

const video = document.getElementById("video");
const play = document.getElementById("play");
const stop = document.getElementById("stop");
const progress = document.getElementById("progress");
const timestamp = document.getElementById("timestamp");

// FUNCTIONS

// Play and pause video
function toggleVideoStatus() {
  // Since youre using the html 5 video tag, it has its own properties and methods associated with it that can be accessed by js
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// Update the play/pause icon
function updatePlayIcon() {
  if (video.paused) {
    play.innerHTML = `<i class="fas fa-play fa-2x"></i>`;
  } else {
    play.innerHTML = `<i class="fas fa-pause fa-2x"></i>`;
  }
}

// Update progress and timestamp
function updateProgress() {
  //   console.log(video.currentTime);
  // Making use of the timeupdate event that fires continously. Need a percentage of where the video currently is in relation to its total length to position the slider correctly
  progress.value = (video.currentTime / video.duration) * 100;

  //   Timestamp value
  // 1. Get mins
  let mins = Math.floor(video.currentTime / 60);
  if (mins < 10) {
    mins = "0" + String(mins);
  }
  //   2. Get seconds
  let secs = Math.floor(video.currentTime % 60);
  if (secs < 10) {
    secs = "0" + String(secs);
  }

  timestamp.innerHTML = `${mins}:${secs}`;
}

// Set video time according to progress bar
function setVideoProgress() {
  //   console.log(progress.value);
  video.currentTime = (progress.value / 100) * video.duration;
}

// Stop the video
function stopVideo() {
  // There is no .stop() method for videos. To implement the stop button you have to access the currentTime property of the video and set it to 0 and then pause the video
  video.currentTime = 0;
  video.pause();
}

// EVENT LISTENERS
video.addEventListener("click", toggleVideoStatus);
video.addEventListener("pause", updatePlayIcon);
video.addEventListener("play", updatePlayIcon);
video.addEventListener("timeupdate", updateProgress);

play.addEventListener("click", toggleVideoStatus);
stop.addEventListener("click", stopVideo);
progress.addEventListener("change", setVideoProgress);
