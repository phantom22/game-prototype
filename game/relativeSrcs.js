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

            document.querySelector( `#${ v + "-leftColorChange" }`).addEventListener( "click", function() {

                let savedColors = [];

                let playerColors = instance.data.playerRules.playerColors;
                let colorIndex = playerColors.indexOf( instance.data.playerSettings[v].color );

                document.querySelector(`#${ v + "-card" }`).className = ( colorIndex - 1 ) >= 0 ? playerColors[ colorIndex - 1 ] : playerColors[ 0 ];
                instance.data.playerSettings[v].color = ( colorIndex - 1 ) >= 0 ? playerColors[ colorIndex - 1 ] : playerColors[ 0 ];

                document.querySelector(`#${ v + "-color" }`).textContent = instance.data.playerSettings[v].color;

                instance.registerTile( instance.data.entities[v].position, instance.tileClassToId( v ) );
                instance.tileUpdateDisplay( instance.data.entities[v].position );

                Object.keys( instance.data.playerSettings ).forEach( v => typeof instance.data.playerSettings[v].color !== "undefined" ? savedColors.push( instance.data.playerSettings[v].color ) : void 0 );
                localStorage.colors = JSON.stringify( savedColors )

            } );

            document.querySelector( `#${ v + "-rightColorChange" }`).addEventListener( "click", function() {

                let savedColors = [];

                let playerColors = instance.data.playerRules.playerColors;
                let colorIndex = playerColors.indexOf( instance.data.playerSettings[v].color );

                document.querySelector(`#${ v + "-card" }`, document, 0 ).className = ( colorIndex + 1 ) <= ( playerColors.length - 1 )  ? playerColors[ colorIndex + 1 ] : playerColors[ playerColors.length - 1 ];
                instance.data.playerSettings[v].color = ( colorIndex + 1 ) <= ( playerColors.length - 1 ) ? playerColors[ colorIndex + 1 ] : playerColors[ playerColors.length - 1 ];

                document.querySelector(`#${ v + "-color" }`, document, 0 ).textContent = instance.data.playerSettings[v].color;

                instance.registerTile( instance.data.entities[v].position, instance.tileClassToId( v ) );
                instance.tileUpdateDisplay( instance.data.entities[v].position );

                Object.keys( instance.data.playerSettings ).forEach( v => typeof instance.data.playerSettings[v].color !== "undefined" ? savedColors.push( instance.data.playerSettings[v].color ) : void 0 );
                localStorage.colors = JSON.stringify( savedColors )

            } )

          }

          document.querySelector( `#${ v + "-keyUp" }` ).addEventListener( "click", function(evt) {

            if ( !evt.target.classList.contains( "focused" ) ) {

              document.querySelectorAll( ".focused" ).forEach( v => v.classList.remove( "focused" ) );
              evt.target.classList.add( "focused" );
              instance.data.playerRules.focusedKeyBinding = `${v} keyUp`

            }

            else {

              evt.target.classList.remove( "focused" );
              instance.data.playerRules.focusedKeyBinding = ""

            }

          })

          document.querySelector( `#${ v + "-keyDown" }` ).addEventListener( "click", function(evt) {

            if ( !evt.target.classList.contains( "focused" ) ) {

              document.querySelectorAll( ".focused" ).forEach( v => v.classList.remove( "focused" ) );
              evt.target.classList.add( "focused" );
              instance.data.playerRules.focusedKeyBinding = `${v} keyDown`

            }

            else {

              evt.target.classList.remove( "focused" );
              instance.data.playerRules.focusedKeyBinding = ""

            }

          })

          document.querySelector( `#${ v + "-keyLeft" }` ).addEventListener( "click", function(evt) {

            if ( !evt.target.classList.contains( "focused" ) ) {

              document.querySelectorAll( ".focused" ).forEach( v => v.classList.remove( "focused" ) );
              evt.target.classList.add( "focused" );
              instance.data.playerRules.focusedKeyBinding = `${v} keyLeft`

            }

            else {

              evt.target.classList.remove( "focused" );
              instance.data.playerRules.focusedKeyBinding = ""

            }

          })

          document.querySelector( `#${ v + "-keyRight" }` ).addEventListener( "click", function(evt) {

            if ( !evt.target.classList.contains( "focused" ) ) {

              document.querySelectorAll( ".focused" ).forEach( v => v.classList.remove( "focused" ) );
              evt.target.classList.add( "focused" );
              instance.data.playerRules.focusedKeyBinding = `${v} keyRight`

            }

            else {

              evt.target.classList.remove( "focused" );
              instance.data.playerRules.focusedKeyBinding = ""

            }

          })

        } )

        // adding an event listener for the keybord press event
        document.addEventListener("keydown", function(event) {
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
              newTile = instance.entityUP( entity );
            }
            else if (typeof bindings !== "undefined" && k === bindings[1] && instance.data.playerRules.HUDisActive !== true ) {
              newTile = instance.entityDOWN( entity );
            }
            else if (typeof bindings !== "undefined" && k === bindings[2] && instance.data.playerRules.HUDisActive !== true ) {
              newTile = instance.entityLEFT( entity );
            }
            else if (typeof bindings !== "undefined" && k === bindings[3] && instance.data.playerRules.HUDisActive !== true ) {
              newTile = instance.entityRIGHT( entity );
            }
            else if (!bindings && k === "CapsLock") {
              instance.togglePlayerSettings();
            }

          }

          if ( k && instance.data.playerRules.focusedKeyBinding !== "" && instance.data.playerRules.HUDisActive === true ) {

            let keys = { keyUp: 0, keyDown: 1, keyLeft: 2, keyRight: 3 };
            let focusedKeyBinding = instance.data.playerRules.focusedKeyBinding.split( " " );

            if ( !instance.data.playerRules.bannedKeysFromBinding.includes( k ) && !instance.data.playerRules.bindedKeys.includes( k ) ) {

              let oldKeyIndex = instance.data.playerRules.bindedKeys.indexOf( instance.data.playerSettings[ focusedKeyBinding[0] ].keyBindings[ keys[ focusedKeyBinding[1] ] ] );

              instance.data.playerRules.bindedKeys.splice( oldKeyIndex, 1 );

              instance.data.playerSettings[ focusedKeyBinding[0] ].keyBindings[ keys[ focusedKeyBinding[1] ] ] = k;
              document.querySelector( `#${ focusedKeyBinding.join( "-" ) }` ).textContent = k.replace("Key","");

              instance.data.playerRules.bindedKeys.push( k );

              instance.data.playerRules.focusedKeyBinding = "";
              document.querySelectorAll( ".focused" ).forEach( v => v.classList.remove( "focused" ) );

            }

            else if ( k === "Escape" ) {

              let oldKeyIndex = instance.data.playerRules.bindedKeys.indexOf( instance.data.playerSettings[ focusedKeyBinding[0] ].keyBindings[ keys[ focusedKeyBinding[1] ] ] );

              instance.data.playerRules.bindedKeys.splice( oldKeyIndex, 1 );

              instance.data.playerSettings[ focusedKeyBinding[0] ].keyBindings[ keys[ focusedKeyBinding[1] ] ] = "";
              document.querySelector( `#${ focusedKeyBinding.join( "-" ) }` ).textContent = "...";

              instance.data.playerRules.focusedKeyBinding = "";
              document.querySelectorAll( ".focused" ).forEach( v => v.classList.remove( "focused" ) );


            }

            if ( typeof Storage !== "undefined" ) {

              let savedBindings = [];

              Object.keys( instance.data.playerSettings ).forEach( v => savedBindings.push( instance.data.playerSettings[v].keyBindings ) );

              localStorage.keyBindings = JSON.stringify( savedBindings );

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
