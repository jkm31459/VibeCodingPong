const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const PLAYER_X = 30;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballVY = 4 * (Math.random() < 0.5 ? 1 : -1);

// Mouse control for player paddle
canvas.addEventListener("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp within canvas
  if (playerY < 0) playerY = 0;
  if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Collisions: top/bottom walls
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballVY *= -1;
    ballY = Math.max(0, Math.min(ballY, canvas.height - BALL_SIZE));
  }

  // Collisions: left paddle (player)
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballX >= PLAYER_X &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballVX = Math.abs(ballVX);
    // Add a little vertical change based on hit position
    ballVY += (ballY + BALL_SIZE / 2 - (playerY + PADDLE_HEIGHT / 2)) * 0.12;
    ballX = PLAYER_X + PADDLE_WIDTH;
  }

  // Collisions: right paddle (AI)
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballX + BALL_SIZE <= AI_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballVX = -Math.abs(ballVX);
    ballVY += (ballY + BALL_SIZE / 2 - (aiY + PADDLE_HEIGHT / 2)) * 0.12;
    ballX = AI_X - BALL_SIZE;
  }

  // AI paddle movement (basic): follow ball's y
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 8) {
    aiY += AI_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 8) {
    aiY -= AI_SPEED;
  }
  // Clamp AI paddle
  if (aiY < 0) aiY = 0;
  if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;

  // Score: reset ball if out of bounds
  if (ballX < 0 || ballX > canvas.width) {
    resetBall();
  }
}

function resetBall() {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballVX = 5 * (Math.random() < 0.5 ? 1 : -1);
  ballVY = 4 * (Math.random() < 0.5 ? 1 : -1);
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw net
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  for (let i = 0; i < canvas.height; i += 24) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, i);
    ctx.lineTo(canvas.width / 2, i + 12);
    ctx.stroke();
  }

  // Draw paddles
  ctx.fillStyle = "#0ff";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

  ctx.fillStyle = "#f00";
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = "#fff";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Start game loop
gameLoop();