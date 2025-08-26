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

// Add simple score state
let playerScore = 0;
let aiScore = 0;

// Pause state
let isPaused = false;

// Mouse control for player paddle
canvas.addEventListener("mousemove", function (e) {
  if (isPaused) return; // don't move paddle while paused
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp within canvas
  if (playerY < 0) playerY = 0;
  if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Pause toggle: left mouse button on canvas (no longer toggles here — handled globally)
canvas.addEventListener("mousedown", function (e) {
  // e.button === 0 -> left button
  if (e.button === 0) {
    // prevent text-selection / focus when clicking the canvas
    e.preventDefault();
  }
});

// Pause toggle: left mouse button anywhere on the page
document.addEventListener("mousedown", function (e) {
  if (e.button === 0) {
    isPaused = !isPaused;
  }
});

// Toggle pause with Space or P
window.addEventListener("keydown", function (e) {
  if (e.code === "Space" || e.key.toLowerCase() === "p") {
    isPaused = !isPaused;
    e.preventDefault();
  }
});

// Game loop
function gameLoop() {
  if (!isPaused) update();
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
    // Update score
    if (ballX < 0) {
      aiScore++;
    } else {
      playerScore++;
    }
    resetBall();
  }
}

function resetBall() {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballVX = 5 * (Math.random() < 0.5 ? 1 : -1);
  ballVY = 4 * (Math.random() < 0.5 ? 1 : -1);
}

// replaced circular ball drawing with a rabbit drawing helper
function drawRabbit(cx, cy, size) {
  ctx.save();
  ctx.translate(cx, cy);

  // shadow under rabbit
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(0, size * 0.7, size * 0.7, size * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // body
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(0, size * 0.22, size * 0.6, size * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // ears (outer)
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-size * 0.22, -size * 0.9, size * 0.18, size * 0.48, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.22, -size * 0.9, size * 0.18, size * 0.48, 0.18, 0, Math.PI * 2);
  ctx.fill();

  // ears (inner pink)
  ctx.fillStyle = "#ffd6e0";
  ctx.beginPath();
  ctx.ellipse(-size * 0.22, -size * 0.9, size * 0.08, size * 0.36, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(size * 0.22, -size * 0.9, size * 0.08, size * 0.36, 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // eye
  ctx.fillStyle = "#222";
  ctx.beginPath();
  ctx.arc(size * 0.14, -size * 0.04, Math.max(1, size * 0.08), 0, Math.PI * 2);
  ctx.fill();

  // nose
  ctx.fillStyle = "#ff7b9c";
  ctx.beginPath();
  ctx.moveTo(0, size * 0.08);
  ctx.lineTo(size * 0.06, size * 0.12);
  ctx.lineTo(-size * 0.06, size * 0.12);
  ctx.closePath();
  ctx.fill();

  // whiskers
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = Math.max(1, size * 0.03);
  ctx.beginPath();
  ctx.moveTo(-size * 0.08, size * 0.12);
  ctx.lineTo(-size * 0.42, size * 0.08);
  ctx.moveTo(-size * 0.08, size * 0.14);
  ctx.lineTo(-size * 0.42, size * 0.16);
  ctx.moveTo(size * 0.08, size * 0.12);
  ctx.lineTo(size * 0.42, size * 0.08);
  ctx.moveTo(size * 0.08, size * 0.14);
  ctx.lineTo(size * 0.42, size * 0.16);
  ctx.stroke();

  // subtle outline
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function draw() {
  // improved background: subtle gradient + vignette
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, "#0b1020");
  bgGrad.addColorStop(1, "#071023");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // soft vignette
  ctx.save();
  const vignette = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    Math.min(canvas.width, canvas.height) * 0.1,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) * 0.9
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vignette;
  ctx.globalCompositeOperation = "multiply";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.globalCompositeOperation = "source-over";

  // center net (dashed) with subtle glow
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 4;
  ctx.shadowColor = "rgba(255,255,255,0.06)";
  ctx.shadowBlur = 8;
  for (let i = 0; i < canvas.height; i += 28) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, i + 6);
    ctx.lineTo(canvas.width / 2, i + 18);
    ctx.stroke();
  }
  ctx.restore();

  // helper: rounded rect draw
  function drawRoundedRect(x, y, w, h, r, fillStyle, strokeStyle) {
    ctx.beginPath();
    const radius = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
  }

  // Draw paddles with gradient + subtle glow
  // Player paddle (left)
  ctx.save();
  const pGrad = ctx.createLinearGradient(PLAYER_X, playerY, PLAYER_X + PADDLE_WIDTH, playerY + PADDLE_HEIGHT);
  pGrad.addColorStop(0, "#00f7ff");
  pGrad.addColorStop(1, "#00b9ff");
  ctx.shadowColor = "rgba(0, 200, 255, 0.12)";
  ctx.shadowBlur = 12;
  drawRoundedRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, 6, pGrad, "rgba(255,255,255,0.06)");
  ctx.restore();

  // AI paddle (right)
  ctx.save();
  const aGrad = ctx.createLinearGradient(AI_X, aiY, AI_X + PADDLE_WIDTH, aiY + PADDLE_HEIGHT);
  aGrad.addColorStop(0, "#ff7b7b");
  aGrad.addColorStop(1, "#ff4040");
  ctx.shadowColor = "rgba(255, 80, 80, 0.12)";
  ctx.shadowBlur = 12;
  drawRoundedRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, 6, aGrad, "rgba(0,0,0,0.06)");
  ctx.restore();

  // Draw ball as circle with radial highlight + glow
  ctx.save();
  const ballCenterX = ballX + BALL_SIZE / 2;
  const ballCenterY = ballY + BALL_SIZE / 2;
  const rg = ctx.createRadialGradient(ballCenterX - 3, ballCenterY - 3, 1, ballCenterX, ballCenterY, BALL_SIZE);
  rg.addColorStop(0, "#ffffff");
  rg.addColorStop(0.2, "#ffffff");
  rg.addColorStop(0.6, "#d6e8ff");
  rg.addColorStop(1, "#8fbcff");
  ctx.shadowColor = "rgba(140, 190, 255, 0.6)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = rg;
  ctx.beginPath();
  ctx.arc(ballCenterX, ballCenterY, BALL_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  drawRabbit(ballCenterX, ballCenterY, BALL_SIZE);

  // Draw scores (top center)
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 28px system-ui, Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const scoreText = `${playerScore}   •   ${aiScore}`;
  // shadow for score
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 6;
  ctx.fillText(scoreText, canvas.width / 2, 12);
  ctx.restore();

  // Pause overlay
  if (isPaused) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "bold 48px system-ui, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2 - 10);

    ctx.font = "16px system-ui, Arial";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("Press Space or P to resume", canvas.width / 2, canvas.height / 2 + 30);
    ctx.restore();
  }
}

// Start game loop
gameLoop();