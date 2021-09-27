"use strict";

const rulesBTN = document.getElementById("rules-btn");
const closeBTN = document.getElementById("close-btn");
const rules = document.getElementById("rules");

const canvas = document.getElementById("canvas");
// ctx is the naming convention for context
const ctx = canvas.getContext("2d");

// ////// GLOBAL VARIABLES

let score = 0;

// BALL PROPERTIES
const ball = {
  // Want the ball to start right in the middle of the screen
  x: canvas.width / 2,
  y: canvas.height / 2,

  // radius of ball
  size: 11,

  // Have to do w/ the animation
  speed: 5,
  // Speed of direction on x-axis. Amount of t\pixels the ball will move
  // Delta X
  dx: 4,
  // Speed of dir on y-axis
  dy: -4,

  colour: "#0095dd",
};

// PADDLE
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 120,
  height: 13,
  speed: 8,
  dx: 0,
  // Dont need dy cz paddle only moves left and right
};

// BRICKS
const brickRowCount = 5;
const brickColumnCount = 9;

const brickInfo = {
  width: 70,
  height: 20,
  padding: 10,
  // Position of brick. Each brick will have a different value -> changed via JS. Essentially only the first brick will be positioned at this point. Rest will be offset exactly by this amount depending on their position w/in the loop
  offsetX: 45,
  offsetY: 60,
  visible: true,

  // x & y properties will be where the origin point of the brick -> will be inserted by for loop as needs to be different for each brick
};

// Create bricks. An array of 9 cols, each w/ an array of 5 rows of bricks. info of ea brick contained w/in the array of 5. Known as a 2d array
const bricks = [];

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    // X.pos for brick offset by the prev brick's position and size
    const x = c * (brickInfo.width + brickInfo.padding) + brickInfo.offsetX;
    const y = r * (brickInfo.height + brickInfo.padding) + brickInfo.offsetY;

    bricks[c][r] = { x, y, ...brickInfo };
  }

  //   console.log(bricks);
}

// ////// FUNCTIONS

// Draw ball on canvas
function drawBall() {
  // 1. Starting the drawing process of creating a path w/ this method (essentially creating the path):
  ctx.beginPath();
  // 2. Draw the shape / circle using drawing commands
  //      x,  y,
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  // 3. Setting the colour
  ctx.fillStyle = ball.colour;
  // 4. Assigning the colour to the shape
  ctx.fill();
  ctx.closePath();
}

// Draw Paddle
function drawPaddle() {
  ctx.beginPath();

  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#0095dd";
  ctx.fill();

  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score : ${score}`, canvas.width - 100, 30);
}

function drawBricks() {
  bricks.forEach((col) => {
    // First loop through each col which contains an array for # bricks in a row
    col.forEach((brick) => {
      // Loop through row which contains 5 bricks. For each brick draw the following...
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.width, brick.height);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
    });
  });
}

// MOve paddle on canvas - Called by update().
function movePaddle() {
  // Paddle moves cz x pos changes by +/- 8 when the arrow keys are pressed. When the keyup event fired, .dx set to 0 and no more is added to the x position of the paddle so it stops.
  paddle.x += paddle.dx;

  // Wall detection - check co-ords to see if paddle is equal to the wall
  // Left wall
  if (paddle.x < 0) paddle.x = 0;

  // Right wall
  if (paddle.x + paddle.width > canvas.width)
    paddle.x = canvas.width - paddle.width;

  // Right wall = canvas.width
  // Right side of paddle = paddle.x + paddle.width

  // Left wall = 0
  // Left side of paddle = paddle.x
}

// MOve the ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall Collision detection
  // Collision detection on the x - axis walls (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // Reversing the ball to go in the other directon - heading in a +ve x direction before collision and then a -ve x direction (or vice versa)
  }
  // Collision detection on the y - axis walls (bottom/top)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1; // Reversing the ball to go in the other directon
  }

  // console.log(ball.x, ball.y)

  // Paddle collision - Area of the paddle
  if (
    // Area of paddle from the left side
    ball.x - ball.size > paddle.x &&
    // Right side
    ball.x + ball.size < paddle.x + paddle.width &&
    // Height of paddle
    ball.y + ball.size > paddle.y
  ) {
    // Want to know where the ball hit the paddle in relation to its center. Therefore you get the difference btw the ball position and the center of the paddle
    let collisionPoint = ball.x - (paddle.x + paddle.width / 2);
    // Get a value btw -1 & 1. Therefore need to normalize the values
    collisionPoint = collisionPoint / (paddle.width / 2);

    // The angle at which the ball leaves the paddle will be determined from the collision point on the paddle. The center of the paddle will be a 0 degree exit (ie straight up). Any collion between the centre of the paddle and the very edge of the paddle will result in an exit angle for the ball of between 0 and 60 degrees. (max angle is 60 deg)
    let angle = collisionPoint * (Math.PI / 3); // Math.Pi is 60 degrees
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle); // Needs to be -ve else the ball will travle downwards instead up up
    ball.colour = "#0095dd";
  }

  // NOTE ON BALL POSITION : Center of ball is it's .x & .y positions.
  // The outer edges of the ball: (ball.size is the radius of the ball)
  // Left side : ball.x - ball.size
  // Right side : ball.x + ball.size
  // Top side : ball.y - ball.size
  // Bottom side : ball.y + ball.size

  // Brick Collision - Could also used nested for loops
  bricks.forEach((col) =>
    col.forEach((brick) => {
      if (brick.visible) {
        if (
          // Left side of brick check
          ball.x - ball.size > brick.x &&
          // Right side of brick
          ball.x + ball.size < brick.x + brick.width &&
          // Top of brick
          ball.y + ball.size > brick.y &&
          // Bottom of brick
          ball.y - ball.size < brick.y + brick.height
        ) {
          // console.log(`hello`);
          // Bounce the ball off the brick
          ball.dy *= -1;
          ball.colour = "#0095dd";
          // Make brick invisible
          brick.visible = false;

          increaseScore();
        }
      }
    })
  );

  // Loose if bottom wall hit
  if (ball.y + ball.size > canvas.height) {
    ball.colour = "rgb(255, 0, 0)";
    score = 0;
    showAllBricks();
  }
}

// Increase score
function increaseScore() {
  score++;

  // Check to see if there are no more bricks left
  if (score % (brickColumnCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach((col) =>
    col.forEach((brick) => {
      brick.visible = true;
    })
  );
}

// Key presses
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

// Draw everything
function draw() {
  // Clear Canvas before you re-draw anything so it gives the illusion that things are moving and changing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation.
// Every time the canvas is repainted, we can change the properties of the bricks/paddle/ball. This creates the illusion that we are playing a game
function update() {
  movePaddle();
  moveBall();

  // draw eveything
  draw();

  requestAnimationFrame(update);
}
update();

// ////// EVENT LISTENERS
rulesBTN.addEventListener("click", () => {
  rules.classList.add("show");
});

closeBTN.addEventListener("click", () => {
  rules.classList.remove("show");
});

// Keyboard events for paddle movement
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
