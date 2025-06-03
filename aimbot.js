const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusDiv = document.getElementById('status');

let targets = [];
let score = 0;
let aimbotEnabled = false;

// Target properties
const spawnInterval = 1200; // ms
const targetRadius = 25;

function randomPosition() {
  const padding = targetRadius + 5;
  return {
    x: Math.random() * (canvas.width - 2 * padding) + padding,
    y: Math.random() * (canvas.height - 2 * padding) + padding
  };
}

function spawnTarget() {
  targets.push({ ...randomPosition(), radius: targetRadius });
}

function drawTargets() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  targets.forEach(t => {
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#f44336";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#111";
    ctx.stroke();
  });
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#222";
  ctx.fillText("Score: " + score, 10, 30);
}

function gameLoop() {
  drawTargets();
  drawScore();
  if (aimbotEnabled) {
    statusDiv.textContent = "Aimbot: ON (press 'A' to toggle OFF)";
    runAimbot();
  } else {
    statusDiv.textContent = "Aimbot: OFF (press 'A' to toggle ON)";
  }
  requestAnimationFrame(gameLoop);
}

// Click handler
canvas.addEventListener('mousedown', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    const dist = Math.hypot(t.x - mx, t.y - my);
    if (dist < t.radius) {
      targets.splice(i, 1);
      score++;
      break;
    }
  }
});

// Toggle aimbot with "A"
document.addEventListener('keydown', function(e) {
  if (e.key.toLowerCase() === 'a') {
    aimbotEnabled = !aimbotEnabled;
  }
});

// Aimbot logic (aims and "shoots" at the nearest target)
function runAimbot() {
  if (!targets.length) return;
  // Find the closest target to the center
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  let bestIdx = 0;
  let minDist = Infinity;
  for (let i = 0; i < targets.length; i++) {
    const d = Math.hypot(center.x - targets[i].x, center.y - targets[i].y);
    if (d < minDist) {
      minDist = d;
      bestIdx = i;
    }
  }
  // Simulate a click on the target
  const t = targets[bestIdx];
  if (t) {
    targets.splice(bestIdx, 1);
    score++;
  }
}

// Game start
setInterval(spawnTarget, spawnInterval);
gameLoop();