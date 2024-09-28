const { HTTP_STATUS, respondWith } = require("./shared");

var blocks = 10000;

var pspeedz = [3];

var iposz = [0x2140A050];
var icolz = ["#ffffff"];

iposz = iposz.concat([0x10904090, 0x10106010, 0x10908090, 0x1010A010, 0x1090C090, 0x10906010, 0x10108090, 0x1090A010, 0x1010C090, 0x1090E010]);
icolz = icolz.concat(["#000000", "#000000", "#000000", "#000000", "#000000", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]);

for (let a = 0; a < blocks; a++) {
  iposz.push(Math.floor(Math.random() * 0x1FF) + Math.floor(Math.random() * 0x1FF) * 0x40000 + Math.floor(Math.random() * 6) * 0x4000);
}

for (let a = 0; a < blocks; a++) {
  icolz.push("#" + (Math.floor(Math.random() * 16 * 16 * 16)).toString(16));
}

setInterval(function() {
  for (let a = 50; a < 1000; a++) {
    iposz[a] += Math.floor(Math.random() * 5) - 2;
    iposz[a] += (Math.floor(Math.random() * 5) - 2) * 0x40000;
  }
}, 300);

function handleMovement(request, response) {
  const requestParts = request.url.split("-");
  const playerIndex = parseInt(requestParts[3]);

  const direction = requestParts[2];
  switch (direction) {
    case "w":
      iposz[playerIndex] += pspeedz[playerIndex];
      break;
    case "s":
      iposz[playerIndex] -= pspeedz[playerIndex];
      break;
    case "a":
      iposz[playerIndex] -= pspeedz[playerIndex] * 0x40000;
      break;
    case "d":
      iposz[playerIndex] += pspeedz[playerIndex] * 0x40000;
      break;
    default:
      break;
  }

  respondWith(response, HTTP_STATUS.OK, "k");
}

function serveAllData(response) {
  const data = iposz.join(',') + "z" + icolz.join(',');
  respondWith(response, HTTP_STATUS.OK, data);
}

module.exports = {
  serveAllData,
  handleMovement
};

// ----------------------------------------------------------------------------

// va stopserer;
// var nowplayer=0;
// var playere=[2];

// var igetz=[0];

// var bodyprz=[0x9020900F,0x1040100F,0x9060900F,0x1080100F,0x90A0900F,0x9060100F,0x1080900F,0x90A0100F,0x10C0900F,0x90F0100F];
// var bodygz=[7,7,7,7,7,8,8,8,8,8];
// var boomnz=["pz4","pz6","pz7","pz8"];
// var boomfz=[function(){pspeedz[nowplayer]=1},function(){pspeedz[nowplayer]=6},function(){iposz[igetz.indexOf(nowplayer)]+=100000;bodyprz[bodygz.indexOf(nowplayer)]+=100000000},function(){iposz[igetz.indexOf(nowplayer)]-=100000;bodyprz[bodygz.indexOf(nowplayer)]-=100000000}];
// var boomxz=[function(){},function(){},function(){},function(){}];

// function bumpbody(){
//   let bodypar,bodypaz,bodypay,bodypax,bodypbz,bodypby,bodypbx,bodyr;
//     for(let a=0;a<bodyprz.length;a++){
//         for(let b=0;b<igetz.length;b++){
//           if(boomnz.indexOf("pz"+bodygz[a])>=0){
//             bodyr=bodyprz[a]%0x100;
//             bodypaz=(bodyprz[a]-bodyr)%0x10000;
//             bodypbz=iposz[igetz[b]]%0x100;
//             if((bodypaz/0x100-bodypbz)*(bodypaz/0x100-bodypbz)<bodyr*bodyr){
//             bodypay=(bodyprz[a]-bodypaz-bodyr)%0x10000;
//             bodypax=(bodyprz[a]-bodypay-bodypaz-bodyr)/0x1000000;
//             bodypay=bodypay/0x10000;
//             bodypax=bodypax/0x100;
//             bodypby=(iposz[igetz[b]]-bodypbz)%0x10000;
//             bodypbx=(iposz[igetz[b]]-bodypby-bodypbz)/0x10000;
//             bodypby=bodypby/0x100;
//             if((bodypax-bodypbx)*(bodypax-bodypbx)<bodyr*bodyr && (bodypay-bodypby)*(bodypay-bodypby)<bodyr*bodyr) {
//                 boomfz[boomnz.indexOf("pz"+bodygz[a])]();
//             }
// //            else{
// //                boomxz[boomnz.indexOf("pz"+bodygz[b])]();                
// //            }
//             }
//           }
//         }
//     }
// }
