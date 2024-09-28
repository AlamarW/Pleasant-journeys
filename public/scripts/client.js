var px = 0;
var py = 0;
var pz = 0;
var cancan;
var iconpz = [];
var color1z = [];
var iamplayer = 0;

window.onkeypress = function(e) {
  const url2 = "/callit-_-" + e.key + "-" + iamplayer;
  const onkey2 = fetch(url2);
}

async function getData() {
  const url = "/alldata";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro");
    }

    const textrecd = await response.text();
    iconpz = (textrecd.split("z"))[0].split(",").map(Number);
    color1z = (textrecd.split("z"))[1].split(",");
    pz = ((iconpz[iamplayer]) & 0x1FF) - 10;
    py = ((iconpz[iamplayer] >> 9) & 0x1FF) + 20;
    px = (iconpz[iamplayer] >> 18) & 0x1FF;

    dispicon();

  } catch (error) {
    console.error(error.message);
  }
}

window.onload = function() {
  cancan = document.getElementById("canout").getContext("2d");
  setInterval(function() { getData() }, 300);
}

function dispicon() {
  iconpz.sort(function(a, b) { return ((b & 0x1FF) - (a & 0x1FF)) });
  cancan.clearRect(0, 0, 800, 600);
  cancan.beginPath();
  cancan.moveTo(0, 300);
  cancan.lineTo(800, 300);
  cancan.lineTo(800, 600);
  cancan.lineTo(0, 600);
  cancan.closePath();
  cancan.fillStyle = "green";
  cancan.fill();
  cancan.beginPath();
  cancan.moveTo(0, 300);
  cancan.lineTo(800, 300);
  cancan.lineTo(800, 0);
  cancan.lineTo(0, 0);
  cancan.closePath();
  cancan.fillStyle = "#c0ffff";
  cancan.fill();

  for (a1 = -5; a1 <= 5; a1++) {
    for (a2 = 0; a2 <= 10; a2++) {
      for (a3 = -2; a3 <= 8; a3++) {
        dz = a2 * 100 + 100 + (pz % 100);
        dy = a3 * 100 + 100 + (py % 100);
        dx = a1 * 100 + 100 + (px % 100);
        cancan.beginPath();
        cancan.moveTo(dx / dz * 400 + 400, 300 - dy / dz * 400);
        cancan.lineTo(dx / dz * 400 + 400, 300 - (20 + dy) / dz * 400);
        cancan.closePath();
        cancan.lineWidth = 200 / dz;
        cancan.strokeStyle = "gray";
        cancan.stroke();
      }
    }
  }

  for (a = 0; a < iconpz.length; a++) {
    ipt = iconpz[a];
    bpz = ipt & 0x1FF;
    if (bpz - pz > 10) {
      bpy = (ipt >> 9) & 0x1FF;
      bpx = (ipt >> 18) & 0x1FF;
      dz = bpz - pz;
      dy = bpy - py;
      dx = bpx - px;
      col = color1z[a];
      h = (ipt >> 27) + 1;
      cancan.beginPath();
      cancan.moveTo(dx / (dz + 4) * 400 + 400, 300 - dy / (dz + 4) * 400);
      cancan.lineTo((dx - 4) / (dz + 4) * 400 + 400, 300 - (dy + 4) / (dz + 4) * 400);
      cancan.lineTo(dx / (dz + 4) * 400 + 400, 300 - (dy + 8 * h) / (dz + 4) * 400);
      cancan.lineTo((dx + 4) / (dz + 4) * 400 + 400, 300 - (dy + 4) / (dz + 4) * 400);
      cancan.closePath();
      cancan.lineWidth = 200 / dz;
      cancan.strokeStyle = col;
      cancan.stroke();
      cancan.beginPath();
      cancan.moveTo(dx / dz * 400 + 400, 300 - dy / dz * 400);
      cancan.lineTo((dx - 4) / dz * 400 + 400, 300 - (dy + 4) / dz * 400);
      cancan.lineTo(dx / dz * 400 + 400, 300 - (dy + 8 * h) / dz * 400);
      cancan.lineTo((dx + 4) / dz * 400 + 400, 300 - (dy + 4) / dz * 400);
      cancan.closePath();
      cancan.strokeStyle = col;
      cancan.lineWidth = 200 / dz;
      cancan.stroke();
    }
  }
}
