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
          "instance",
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
            gamemode: l[a[0]].gamemode,
            playerColors: ["red","blue","green","orange"],
            standardKeyBindings: [ ["KeyW","KeyS","KeyA","KeyD"], ["KeyI","KeyK","KeyJ","KeyL"], ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"], ["KeyG","KeyB","KeyV","KeyN"], ["Numpad8","Numpad5","Numpad4","Numpad6"] ]
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

        Object.keys( instance.data.playerSettings ).forEach( v => {

          if ( v.includes("player") && instance.data.entities[v].entityBehavior === "player" ) {

            instance.data.playerSettings[v].HUD.arrowLeft.addEventListener( "click", function() {

                instance.entityArrowColorChange( v, "left" )

            } );

            instance.data.playerSettings[v].HUD.arrowRight.addEventListener( "click", function() {

                instance.entityArrowColorChange( v, "right" )

            } )

          }

          instance.data.playerSettings[v].HUD.keyUp.addEventListener( "click", function(evt) {

            instance.toggleFocusedKeyBinding( `${v} keyUp` )

          } )

          instance.data.playerSettings[v].HUD.keyDown.addEventListener( "click", function(evt) {

            instance.toggleFocusedKeyBinding( `${v} keyDown` )

          } )

          instance.data.playerSettings[v].HUD.keyLeft.addEventListener( "click", function(evt) {

            instance.toggleFocusedKeyBinding( `${v} keyLeft` )

          } )

          instance.data.playerSettings[v].HUD.keyRight.addEventListener( "click", function(evt) {

            instance.toggleFocusedKeyBinding( `${v} keyRight` )

          } )

        } )

        // adding an event listener for the keybord press event
        document.body.addEventListener("keydown", function(event) {
          // getting player position
          let coordinates,
          k = event.code,
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

          if ( keyBindings.join().split( "," ).includes( k ) || k === "CapsLock" ) {

            for ( index = 0; index < entities.length; index++ ) {

              if ( typeof keyBindings[index] !== "undefined" && keyBindings[index].includes( k ) ) {

                bindings = keyBindings[index];

                entity = entities[index];
                coordinates = typeof instance.data.entities[entity] !== "undefined" ? instance.data.entities[entity].position : void 0;
                oldX = typeof coordinates !== "undefined" ? coordinates[0] : void 0; oldY = typeof coordinates !== "undefined" ? coordinates[1] : void 0;

              }

            }

            if (typeof bindings !== "undefined" && k === bindings[0] && instance.data.playerRules.HUDisActive !== true ) {

              instance.entityMoveUp( entity )

            }

            else if (typeof bindings !== "undefined" && k === bindings[1] && instance.data.playerRules.HUDisActive !== true ) {

              instance.entityMoveDown( entity )

            }

            else if (typeof bindings !== "undefined" && k === bindings[2] && instance.data.playerRules.HUDisActive !== true ) {

              instance.entityMoveLeft( entity )

            }

            else if (typeof bindings !== "undefined" && k === bindings[3] && instance.data.playerRules.HUDisActive !== true ) {

              instance.entityMoveRight( entity )

            }

            else if (!bindings && k === "CapsLock") {

              instance.togglePlayerSettings()

            }

          }

          if ( k && instance.data.playerRules.focusedKeyBinding !== "" && instance.data.playerRules.HUDisActive === true ) {

            instance.bindKey( k )

          }

        })

      }

    }

  }

})()