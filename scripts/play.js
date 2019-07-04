let l = LEVELS; let a = String(document.location).slice(-12).split("d=")[1].split("&m="); a[1] = Number(a[1])-1;

let instance = new gameInstance({position:l[a[1]].position,moves:1,vision:`${l[a[0]].vision}`,gamemode:`${l[a[0]].gamemode}`},{grid:l[a[1]].grid,meta:`${l[a[1]].meta}`});

let script = document.createElement("script");
script.src = rt + "scripts/main.js";
document.body.appendChild(script);
