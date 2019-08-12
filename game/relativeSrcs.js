// making the game instance accessible for debug purposes
let instance;

(function() {
  // getting the website url string
  let L = String(document.location);
  // getting the root folder of the game
  const ROOT = L.slice(0, L.slice(0, L.lastIndexOf("/")).lastIndexOf("/")) + "/";

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
        let l = LEVELS;
        let a = [L.slice((ROOT + "game/play.html?").length).split("difficulty=")[1].split("&map=")[0],...L.slice((ROOT + "game/play.html?").length).split("difficulty=")[1].split("&map=")[1].split("&players=").map(v=>Number(v))];

        // after all the .js scripts are loaded creating a game
        instance = new gameInstance(
          {
            spawnPoints: true,
            playerQuantity: a[2],
            moveDistance: 1,
            vision: {
              initialRange: l[a[0]].range,
              tokensPerRangeLoss: l[a[0]].loss,
              maxRange: l[a[0]].range + 2,
              minRange: 2
            },
            gamemode: l[a[0]].gamemode
          },
          {
            grid: l[0][a[1]].grid,
            meta: `${l[0][a[1]].meta}`,
            bannedTilesFromRandomizing: l[0][a[1]].bannedTilesFromRandomizing,
            madness: {
              minRangeMovesBeforeDistortion: 10,
              distortionLoop: 15,
              playerDirectionDistorsion: 0.05,
              distortionScaleMultiplier: 2,
              loss: -0.025,
              gain: 0.005,
              cap: 0.25,
              coins: {
                true: { madnessMultiplier: 0.4 },
                false: { madnessMultiplier: 0.6 }
              }
            },
            coins: {
              true: {
                quantity: 10,
                tokenRewards: {
                  base: "*1.8",
                  random: { added: [4, "*1.3"], removed: [0, "*0.7"] }
                }
              },
              false: {
                quantity: 15,
                tokenRewards: {
                  base: "*1.2",
                  random: { added: [3, "*0.8"], removed: [0, "*0.3"] }
                }
              }
            },
            tileClasses: ["air", "wall", "coin1", "coin2", "door", "player1", "player2", "player3", "player4" ]
          },
          {
            state: false,
            maxRegistryLength: 50000
          }
        );

        // adding an event listener for the keybord press event
        document.addEventListener("keydown", function(event) {
          // getting player position
          let coordinates,
          k = event.keyCode,
          oldX,
          oldY,
          newTile,
          element,
          id,
          index,
          UP = (oldX, oldY) => [oldX, oldY - 1],
          DOWN = (oldX, oldY) => [oldX, oldY + 1],
          LEFT = (oldX, oldY) => [oldX - 1, oldY],
          RIGHT = (oldX, oldY) => [oldX + 1, oldY],
          keyBindings = [ [87,83,65,68], [73,75,74,76], [38,40,37,39], [71,66,86,78] ],
          bindings,
          registryItem;

          if (keyBindings[0].includes(k)) {

            // W A newTile D
            bindings = keyBindings[0];

            index = 1;
            coordinates = instance.data.entities[`player${index}`].position;
            oldX = coordinates[0]; oldY = coordinates[1];

            if (k === bindings[0]) {
              newTile = UP( oldX, oldY );
            }
            else if (k === bindings[1]) {
              newTile = DOWN( oldX, oldY );
            }
            else if (k === bindings[2]) {
              newTile = LEFT( oldX, oldY );
            }
            else if (k === bindings[3]) {
              newTile = RIGHT( oldX, oldY );
            }

          }

          else if (keyBindings[1].includes(k) && instance.data.playerRules.playerQuantity >= 2) {

            // I J K L
            bindings = keyBindings[1];

            index = 2;
            coordinates = instance.data.entities[`player${index}`].position;
            oldX = coordinates[0]; oldY = coordinates[1];

            if (k === bindings[0]) {
              newTile = UP( oldX, oldY );
            }
            else if (k === bindings[1]) {
              newTile = DOWN( oldX, oldY );
            }
            else if (k === bindings[2]) {
              newTile = LEFT( oldX, oldY );
            }
            else if (k === bindings[3]) {
              newTile = RIGHT( oldX, oldY );
            }

          }

          else if (keyBindings[2].includes(k) && instance.data.playerRules.playerQuantity >= 3) {

            // ArrowUp ArrowLeft ArrowDown ArrowRight
            bindings = keyBindings[2];

            index = 3;
            coordinates = instance.data.entities[`player${index}`].position;
            oldX = coordinates[0]; oldY = coordinates[1];

            if (k === bindings[0]) {
              newTile = UP( oldX, oldY );
            }
            else if (k === bindings[1]) {
              newTile = DOWN( oldX, oldY );
            }
            else if (k === bindings[2]) {
              newTile = LEFT( oldX, oldY );
            }
            else if (k === bindings[3]) {
              newTile = RIGHT( oldX, oldY );
            }

          }

          else if (keyBindings[3].includes(k)  && instance.data.playerRules.playerQuantity === 4) {

            // G V bindings N
            bindings = keyBindings[3];

            index = 4;
            coordinates = instance.data.entities[`player${index}`].position;
            oldX = coordinates[0]; oldY = coordinates[1];

            if (k === bindings[0]) {
              newTile = UP( oldX, oldY );
            }
            else if (k === bindings[1]) {
              newTile = DOWN( oldX, oldY );
            }
            else if (k === bindings[2]) {
              newTile = LEFT( oldX, oldY );
            }
            else if (k === bindings[3]) {
              newTile = RIGHT( oldX, oldY );
            }

          }

          // if the new coordinates are defined (if one of the WASD buttons was pressed)
          if (newTile) {
            // register querySelector
            registryItem = instance.registry[`${newTile[0]}-${newTile[1]}`];
            // if the tile is found in the registry
            id = registryItem ? registryItem.id : undefined;
            element = registryItem ? registryItem.element : undefined
          }

          // if the tile is found in the registry and its id in not 1 (wall) then move to that tile
          if (element && element instanceof HTMLElement && id !== instance.tileClassToId("wall") && id !== instance.tileClassToId("player1") && id !== instance.tileClassToId("player2") && id !== instance.tileClassToId("player3") && id !== instance.tileClassToId("player4")) {
            instance.entityMove(`player${index}`, element);
            index !== 1 ? instance.entitySight("player1") : false;
            index !== 2 ? instance.entitySight("player2") : false;
            index !== 3 ? instance.entitySight("player3") : false;
            index !== 4 ? instance.entitySight("player4") : false;
          }
        })
      }
    }
  }
})()