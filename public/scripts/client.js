const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const DEBUG_MODE = true;
let PADDING_PX = 48, BORDER_PX = 4;

const PLAYER_INDEX = 0; // const for now
let canvasWidth, canvasHeight, halfWidth, halfHeight;

// ----------------------------------------------------------------------------

// fetches data from the server
async function fetchGameData() {
  const url = "/alldata";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const textData = await response.text();
    const [positionData, colorData] = textData.split("z");
    const iconPositions = positionData.split(",").map(Number);
    const colors = colorData.split(",");

    const playerPos = iconPositions[PLAYER_INDEX];
    const pz = (playerPos & 0x1FF) - 10;
    const py = ((playerPos >> 9) & 0x1FF) + 20;
    const px = (playerPos >> 18) & 0x1FF;

    return {
      iconPositions,
      colors,
      playerPosition: { px, py, pz }
    };

  } catch (error) {
    console.error("Error in fetchGameData:", error.message);
    return null;
  }
}

// Rendering ------------------------------------------------------------------

function drawEntity(dx, dy, dz, color, height) {
  context.beginPath();
  context.moveTo(dx / (dz + 4) * halfWidth + halfWidth, halfHeight - dy / (dz + 4) * halfHeight);
  context.lineTo((dx - 4) / (dz + 4) * halfWidth + halfWidth, halfHeight - (dy + 4) / (dz + 4) * halfHeight);
  context.lineTo(dx / (dz + 4) * halfWidth + halfWidth, halfHeight - (dy + 8 * height) / (dz + 4) * halfHeight);
  context.lineTo((dx + 4) / (dz + 4) * halfWidth + halfWidth, halfHeight - (dy + 4) / (dz + 4) * halfHeight);
  context.closePath();

  context.lineWidth = 200 / dz;
  context.strokeStyle = color;
  context.stroke();

  context.beginPath();
  context.moveTo(dx / dz * halfWidth + halfWidth, halfHeight - dy / dz * halfHeight);
  context.lineTo((dx - 4) / dz * halfWidth + halfWidth, halfHeight - (dy + 4) / dz * halfHeight);
  context.lineTo(dx / dz * halfWidth + halfWidth, halfHeight - (dy + 8 * height) / dz * halfHeight);
  context.lineTo((dx + 4) / dz * halfWidth + halfWidth, halfHeight - (dy + 4) / dz * halfHeight);
  context.closePath();

  context.lineWidth = 200 / dz;
  context.strokeStyle = color;
  context.stroke();
}

function renderScene(playerPosition, iconPositions, colors) {
  const { px, py, pz } = playerPosition;

  // sort by depth (pz)
  iconPositions.sort((a, b) => (b & 0x1FF) - (a & 0x1FF));

  context.clearRect(0, 0, canvasWidth, canvasHeight);

  // draw ground
  context.fillStyle = "green";
  context.fillRect(0, halfHeight, canvasWidth, halfHeight);

  // draw sky
  context.fillStyle = "#c0ffff";
  context.fillRect(0, 0, canvasWidth, halfHeight);

  // draw grid lines
  for (let a1 = -5; a1 <= 5; a1++) {
    for (let a2 = 0; a2 <= 10; a2++) {
      for (let a3 = -2; a3 <= 8; a3++) {
        const dz = a2 * 100 + 100 + (pz % 100);
        const dy = a3 * 100 + 100 + (py % 100);
        const dx = a1 * 100 + 100 + (px % 100);

        context.beginPath();
        context.moveTo(dx / dz * halfWidth + halfWidth, halfHeight - dy / dz * halfHeight);
        context.lineTo(dx / dz * halfWidth + halfWidth, halfHeight - (20 + dy) / dz * halfHeight);
        context.closePath();

        context.lineWidth = 200 / dz;
        context.strokeStyle = "gray";
        context.stroke();
      }
    }
  }

  // draw entities
  for (let i = 0; i < iconPositions.length; i++) {
    const ipt = iconPositions[i];
    const bpz = ipt & 0x1FF;

    // if the entity is in front of the player
    if (bpz - pz > 10) {
      const bpy = (ipt >> 9) & 0x1FF;
      const bpx = (ipt >> 18) & 0x1FF;
      const dz = bpz - pz;
      const dy = bpy - py;
      const dx = bpx - px;
      const col = colors[i];
      const h = (ipt >> 27) + 1;

      drawEntity(dx, dy, dz, col, h);
    }
  }
}

// -----------------------------------------------------------------------------

function resizeCanvas() {
  const PAD = PADDING_PX + BORDER_PX;
  canvas.width = window.innerWidth - PAD * 2;
  canvas.height = window.innerHeight - PAD * 2;

  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  halfWidth = canvasWidth / 2;
  halfHeight = canvasHeight / 2;
}

async function gameLoop() {
  const data = await fetchGameData();
  if (data) {
    const { iconPositions, colors, playerPosition } = data;
    renderScene(playerPosition, iconPositions, colors);
  }

  requestAnimationFrame(gameLoop);
}

// ----------------------------------------------------------------------------

window.addEventListener("resize", resizeCanvas);

window.addEventListener("keypress", (event) => {
  const url = `/callit-_-${event.key}-${PLAYER_INDEX}`;
  fetch(url);
});

if (DEBUG_MODE) {
  PADDING_PX = 48; BORDER_PX = 4;
} else {
  PADDING_PX = 0; BORDER_PX = 0;
  const debugTextDiv = document.querySelector(".debug-text");
  if (debugTextDiv) {
    debugTextDiv.remove();
  }
}

document.body.style.margin = "0";
document.body.style.padding = `${PADDING_PX}px`;
canvas.style.border = `${BORDER_PX}px solid red`;

resizeCanvas();
gameLoop();
