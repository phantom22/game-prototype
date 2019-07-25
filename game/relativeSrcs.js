let instance;
(function(){

  // getting the website url string
  let L = String(document.location);
  // getting the root folder of the game
  const ROOT = L.slice(0,L.slice(0,L.lastIndexOf("/")).lastIndexOf("/")) + "/";
  
  // creating the "tool.js" script and appending it to the body
  let tScript = document.createElement("script");
  tScript.src = ROOT + "scripts/tool.js";
  document.body.appendChild(tScript);

  // onload of the "tool.js"
  tScript.onload = function() {

    // creating the "levels.js" script and appending it to the body
    let lScript = document.createElement("script");
    lScript.src = ROOT + "scripts/levels.js";
    document.body.appendChild(lScript);

    // onload of the "levels.js"
    lScript.onload = function() {

      // creating the "game.js" script and appending it to the body
      let gScript = document.createElement("script");
      gScript.src = ROOT + "scripts/game.js";
      document.body.appendChild(gScript);

      // onload of the "game.js"
      gScript.onload = function() {

        // getting the difficulty and the map number from the website url
        let l = LEVELS; let a = L.slice(-12).split("d=")[1].split("&m=");

        // after all the .js scripts are loaded creating a game
        instance = new gameInstance({position:true,moves:1,vision:{initialRange:l[a[0]].range,tokensPerRangeLoss:l[a[0]].loss,maxRange:l[a[0]].range+2,minRange:2},gamemode:l[a[0]].gamemode},{grid:l[a[1]].grid,meta:`${l[a[1]].meta}`,bannedTilesFromRandomizing:l[a[1]].bannedTilesFromRandomizing,madness:{minRangeMovesBeforeActivation:5,loss:-0.01,gain:0.01,coins:{true:{negativeMadnessMultiplier:2.5,positiveMadnessMultiplier:0.8},false:{negativeMadnessMultiplier:1.5,positiveMadnessMultiplier:0.9}}},coins:{true:{quantity:10,tokenRewards:{base:"*1.2",random:{added:[3,"*1.5 +1"],removed:[1,"*1.5 -3"]}}},false:{quantity:10,tokenRewards:{base:"*0.5",random:{added:[3,"*0.8 +1"],removed:[1,"*0.8 -2"]}}}}});

        // adding an event listener for the keybord press event
        document.addEventListener("keydown", function(event){

          // getting player position
          let xy = instance.data.player.position; let k = event.keyCode; let x = xy[0]; let y = xy[1]; let s; let e; let id;

          // if pressed "W"
          if (k == 87) {s = [x,y-1]}
          // if pressed "S"
          else if (k == 83) {s = [x,y+1]}
          // if pressed "A"
          else if (k == 65) {s = [x-1,y]}
          // if pressed "D"
          else if (k == 68) {s = [x+1,y]}
          // if pressed "arrow up"
          else if (k == 38) {instance.updateSelectedSlot(instance.data.player.hud.inventory.selectedSlot-1)}
          // if pressed "arrow down"
          else if (k == 40) {instance.updateSelectedSlot(instance.data.player.hud.inventory.selectedSlot+1)}

          // if the new coordinates are defined (if one of the WASD buttons was pressed)
          if (s) {

            // register querySelector
            let r = instance.reg[`${s[0]}-${s[1]}`];
            // if the tile is found in the reg
            id = r ? r.id : undefined;
            e = r ? r.element : undefined;

          }

          // if the tile is found in the reg and its id in not 1 (wall) then move to that tile
          if (e && e instanceof HTMLElement && id !== 1) {instance.playerMove(e)}

        });

        // adding event listener to the inventory slots tds
        document.querySelectorAll(".hud td").forEach(v=>v.addEventListener("click",function(evt){

          // getting the id of each clicked slot
          let id = Number(evt.target.dataset.id);
          // updating the selected slot
          instance.updateSelectedSlot(id);
          
        }));

      }

    }

  }

})();