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
            tileClasses: ["air", "wall", "coin1", "coin2", "door", "player1", "player2", "player3", "player4", "killer" ]
          },
          {
            vision: {
              range: 5
            },
            movesBeforeDisappearing: 35,
            playerMadnessMovesBeforeSpawn: 15,
            spawn: {
              minDistanceFromObsession: 30,
              maxDistanceFromObsession: 60
            }
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
          entities = Object.keys( instance.data.playerSettings ),
          keyBindings = [],
          bindings,
          registryItem,
          entity;

          entities.forEach( v => { keyBindings.push( instance.data.playerSettings[v].keyBindings ) } );

          if ( keyBindings.join().split( "," ).map( v => Number( v ) ).includes( k ) ) {

            for ( index = 0; index < entities.length; index++ ) {

              if ( keyBindings[index].includes( k ) ) {

                bindings = keyBindings[index];

                entity = entities[index];
                coordinates = typeof instance.data.entities[entity] !== "undefined" ? instance.data.entities[entity].position : void 0;
                oldX = typeof coordinates !== "undefined" ? coordinates[0] : void 0; oldY = typeof coordinates !== "undefined" ? coordinates[1] : void 0;

              }

            }

            if (typeof bindings !== "undefined" && k === bindings[0]) {
              newTile = instance.entityUP( entity );
            }
            else if (typeof bindings !== "undefined" && k === bindings[1]) {
              newTile = instance.entityDOWN( entity );
            }
            else if (typeof bindings !== "undefined" && k === bindings[2]) {
              newTile = instance.entityLEFT( entity );
            }
            else if (typeof bindings !== "undefined" && k === bindings[3]) {
              newTile = instance.entityRIGHT( entity );
            }

          }

          // if the new coordinates are defined (if one of the WASD buttons was pressed)
          if ( newTile ) {
            // register querySelector
            registryItem = instance.registry[newTile.join("-")];
            // if the tile is found in the registry
            id = registryItem ? registryItem.id : undefined;
            element = registryItem ? registryItem.element : undefined
          }

          // if the tile is found in the registry and its id in not 1 (wall) then move to that tile
          if ( element && element instanceof HTMLElement ) {
            instance.entityMove(entity, newTile);
            instance.entitiesSight(entity)
          }
        })
      }
    }
  }
})()
