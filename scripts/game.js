const T = TOOL;

class gameInstance { 

  constructor( playerRules = { spawnPoints, moveDistance, vision, gamemode, playerQuantity }, map = { grid, meta, coins, madness, tileClasses }, killerRules = { vision, movesBeforeDisappearing, playerMadnessMovesBeforeSpawn, spawn }, debug = { state, maxRegistryLength } ) { 

    let p = playerRules,
    vision = typeof p.vision !== "undefined" ? p.vision : void 0,
    coins = map.coins,
    madness = typeof map.madness !== "undefined" ? map.madness : void 0,
    mCoins = typeof map.madness !== "undefined" ? madness.coins : void 0,
    flag = p.gamemode === 3 ? true : void 0,
    trueCoinsTokenRewards,
    falseCoinsTokenRewards,
    index,
    state = typeof debug !== "undefined" ? debug.state : void 0,
    maxRegistryLength = typeof debug !== "undefined" && typeof map.grid !== "undefined" && debug.maxRegistryLength > ( map.grid[0] * map.grid[1] ) ? debug.maxRegistryLength : ( ( map.grid[0] * map.grid[1] ) * 2 ),
    k = !flag && typeof killerRules !== "undefined" ? killerRules : undefined,
    savedKeyBindings, 
    savedColors;

    map.grid = typeof map.grid !== "undefined" && Array.isArray( map.grid ) && typeof map.grid.reduce( ( a, b )  =>  a + b ) === "number" && map.grid.length === 2 ? map.grid : void 0;
    map.meta = typeof map.meta === "string" && map.meta.split("").length === map.grid[0] * map.grid[1] ? map.meta.split("").map( v => Number( v ) ) : void 0;
    map.tileClasses = typeof map.tileClasses !== "undefined" && Array.isArray( map.tileClasses ) ? map.tileClasses : ["air", "wall", "coin1", "coin2", "door", "player1", "player2", "player3", "player4" ];

    if ( !flag ) {

      p.standardKeyBindings = typeof p.standardKeyBindings !== "undefined" ? p.standardKeyBindings.filter( v => v.length === 4 ) : [ ["KeyW","KeyS","KeyA","KeyD"], ["KeyI","KeyK","KeyJ","KeyL"], ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"], ["KeyG","KeyB","KeyV","KeyN"], ["Numpad8","Numpad5","Numpad4","Numpad6"] ];
      p.playerColors = typeof p.playerColors !== "undefined" ? p.playerColors.filter( v => typeof v === "string" ) : [ "red", "blue", "green", "orange" ];
      savedColors = p.playerColors;
      savedKeyBindings = p.standardKeyBindings;

      if ( typeof Storage !== "undefined" ) {

        savedKeyBindings = typeof localStorage.keyBindings !== "undefined" ? JSON.parse( localStorage.keyBindings ) : p.standardKeyBindings;
        savedColors = typeof localStorage.colors !== "undefined" ? JSON.parse( localStorage.colors ) : p.playerColors;

      }

      p.HUDisActive = false;
      p.focusedKeyBinding = "";
      p.bannedKeysFromBinding = ["CapsLock","Tab","Escape","ShiftLeft","ControlLeft","AltLeft","AltRight","Enter","Space","ShiftRight","ControlRight"];
      p.bindedKeys = savedKeyBindings.join().split(",");

      p.madnessMoves = 0;
      p.playerQuantity = typeof p.playerQuantity === "number" && p.playerQuantity >= 1 && p.playerQuantity <= 4 ? p.playerQuantity : 1;
      p.spawnPoints = typeof playerRules.spawnPoints === "boolean" || typeof playerRules.spawnPoints !== "undefined" && Array.isArray( playerRules.spawnPoints ) && typeof playerRules.spawnPoints.reduce( ( a, b ) => a + b ) === "number" && playerRules.spawnPoints.filter( v => Array.isArray( v ) && typeof v.reduce( ( a, b ) => a + b ) === "number" && v.length === 2 ).length === playerRules.playerQuantity ? playerRules.spawnPoints : true;
      p.moveDistance = typeof p.moveDistance === "number" && p.moveDistance > 0 ? Math.floor( p.moveDistance ) : 1;
      p.gamemode = typeof p.gamemode === "number" && p.gamemode > 0 ? Math.floor( p.gamemode ) : 0;
      vision.initialRange =  typeof p.vision !== "undefined" && typeof vision.initialRange === "number" && vision.initialRange > 0 ? Math.floor( vision.initialRange ) : 5;
      vision.tokensPerRangeLoss = typeof vision.tokensPerRangeLoss === "number" && vision.tokensPerRangeLoss > 0 ? Math.floor( vision.tokensPerRangeLoss ) : 7;
      vision.minRange = typeof vision.minRange === "number" && vision.minRange >= 1 && vision.minRange <= vision.maxRange ? Math.floor( vision.minRange ) : 2;
      vision.maxRange = typeof vision.maxRange === "number" && vision.maxRange >= 1 && vision.maxRange >= vision.minRange ? Math.floor( vision.maxRange ) : initialRange + 2;

      k.vision.range =  typeof k.vision !== "undefined" && typeof k.vision.range === "number" && k.vision.range > 0 ? Math.floor( k.vision.range ) : 5;
      k.playerMadnessMovesBeforeSpawn = typeof k.playerMadnessMovesBeforeSpawn === "number" && k.playerMadnessMovesBeforeSpawn >= 1 ? Math.floor( k.playerMadnessMovesBeforeSpawn ) : 15;
      k.spawn.minDistanceFromObsession = typeof k.spawn.minDistanceFromObsession === "number" && typeof k.spawn.maxDistanceFromObsession === "number" && k.spawn.minDistanceFromObsession >= 5 && k.spawn.minDistanceFromObsession <= ( map.grid[1] - 5 ) && k.spawn.minDistanceFromObsession <= k.spawn.maxDistanceFromObsession ? Math.floor( k.spawn.minDistanceFromObsession ) : ( map.grid[1] - 5 );
      k.spawn.maxDistanceFromObsession = typeof k.spawn.maxDistanceFromObsession === "number" && typeof k.spawn.minDistanceFromObsession === "number" && k.spawn.maxDistanceFromObsession >= 5 && k.spawn.maxDistanceFromObsession <= map.grid[1] && k.spawn.maxDistanceFromObsession >= k.spawn.minDistanceFromObsession ?  Math.floor( k.spawn.maxDistanceFromObsession ) : map.grid[1];
      k.movesBeforeDisappearing = typeof k.movesBeforeDisappearing === "number" && k.movesBeforeDisappearing >= k.spawn.minDistanceFromObsession ? Math.floor( k.movesBeforeDisappearing ) : k.spawn.minDistanceFromObsession;

      coins.true.quantity = typeof coins.true.quantity === "number" & coins.true.quantity >= 1 ? Math.floor( coins.true.quantity ) : 10;
      coins.false.quantity = typeof coins.false.quantity === "number" && coins.false.quantity >= 0 ? Math.floor( coins.false.quantity ) : 10;
      coins.true.tokenRewards.base = typeof coins.true.tokenRewards.base === "number" || typeof coins.true.tokenRewards.base === "string" ? coins.true.tokenRewards.base : "*1.8";
      coins.false.tokenRewards.base = typeof coins.false.tokenRewards.base === "number" || typeof coins.false.tokenRewards.base === "string" ? coins.false.tokenRewards.base : "*1.2";
      coins.true.tokenRewards.random.added = Array.isArray( coins.true.tokenRewards.random.added ) && coins.true.tokenRewards.random.added.length === 2 ? coins.true.tokenRewards.random.added : [4, "*1.3"];
      coins.false.tokenRewards.random.added = Array.isArray( coins.false.tokenRewards.random.added ) && coins.false.tokenRewards.random.added.length === 2 ? coins.false.tokenRewards.random.added : [0, "*0.7"];
      coins.true.tokenRewards.random.removed = Array.isArray( coins.true.tokenRewards.random.removed ) && coins.true.tokenRewards.random.removed.length === 2 ? coins.true.tokenRewards.random.removed : [3, "*0.8"];
      coins.false.tokenRewards.random.removed = Array.isArray( coins.false.tokenRewards.random.removed ) && coins.false.tokenRewards.random.removed.length === 2 ? coins.false.tokenRewards.random.removed : [0,  "*0.3"];
      coins.true.positions = []; coins.false.positions = [];

      madness.distortionScaleMultiplier = typeof madness.distortionScaleMultiplier === "number" && madness.distortionScaleMultiplier >= 0 ? madness.distortionScaleMultiplier : 1;
      madness.playerDirectionDistortion = typeof madness.playerDirectionDistortion === "number" && madness.playerDirectionDistortion >= 0 && madness.playerDirectionDistortion <= 1 ? madness.playerDirectionDistortion : 0.05;
      madness.distortionLoop = typeof madness.distortionLoop === "number" && madness.distortionLoop >= 0 ? Math.floor( madness.distortionLoop ) : 15;
      madness.cap = typeof madness.cap === "number" && madness.cap > 0 && madness.cap <= 1 ? madness.cap : 0.25;
      madness.minRangeMovesBeforeDistortion = typeof madness.minRangeMovesBeforeDistortion === "number" && madness.minRangeMovesBeforeDistortion >= 0 ? Math.floor( madness.minRangeMovesBeforeDistortion ) : 10;
      madness.loss = typeof madness.loss === "number" && Math.sign( madness.loss ) === -1 && Math.abs( madness.loss ) > 0 && Math.abs( madness.loss ) <= 1 ? madness.loss : -0.025;
      madness.gain = typeof madness.gain === "number" && madness.gain > 0 && madness.gain <= 1 ? madness.gain : 0.005;
      mCoins.true.madnessMultiplier = typeof mCoins.true.madnessMultiplier === "number" && mCoins.true.madnessMultiplier >= 0 && mCoins.true.madnessMultiplier < 1 ? mCoins.true.madnessMultiplier : 0.4;
      mCoins.false.madnessMultiplier = typeof mCoins.false.madnessMultiplier === "number" && mCoins.false.madnessMultiplier >= mCoins.true.madnessMultiplier && mCoins.false.madnessMultiplier >= 0 && mCoins.false.madnessMultiplier < 1 ? mCoins.false.madnessMultiplier : 0.6;
      map.bannedTilesFromRandomizing = Array.isArray( map.bannedTilesFromRandomizing ) ? map.bannedTilesFromRandomizing.filter( v => v.length===2 ) : [];

      madness.state = false;

      coins = p.gamemode === 3 ? void 0 : coins;

      trueCoinsTokenRewards = typeof coins !== "undefined" ? coins.true.tokenRewards : void 0; falseCoinsTokenRewards = typeof coins !== "undefined" ? coins.false.tokenRewards : void 0; let tokensPerRangeLoss = vision.tokensPerRangeLoss;

      trueCoinsTokenRewards.base = typeof trueCoinsTokenRewards.base === "string" ? this.stringToCoinTokenReward( trueCoinsTokenRewards.base, vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.base;
      trueCoinsTokenRewards.random.added[0] = typeof trueCoinsTokenRewards.random.added[0] === "string" ? this.stringToCoinTokenReward( trueCoinsTokenRewards.random.added[0], vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.random.added[0];
      trueCoinsTokenRewards.random.added[1] = typeof trueCoinsTokenRewards.random.added[1] === "string" ? this.stringToCoinTokenReward( trueCoinsTokenRewards.random.added[1], vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.random.added[1];
      trueCoinsTokenRewards.random.removed[0] = typeof trueCoinsTokenRewards.random.removed[0] === "string" ? this.stringToCoinTokenReward( trueCoinsTokenRewards.random.removed[0], vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.random.removed[0];
      trueCoinsTokenRewards.random.removed[1] = typeof trueCoinsTokenRewards.random.removed[1] === "string" ? this.stringToCoinTokenReward( trueCoinsTokenRewards.random.removed[1], vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.random.removed[1];
      falseCoinsTokenRewards.base = typeof falseCoinsTokenRewards.base === "string" ? this.stringToCoinTokenReward( falseCoinsTokenRewards.base, vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.base;
      falseCoinsTokenRewards.random.added[0] = typeof falseCoinsTokenRewards.random.added[0] === "string" ? this.stringToCoinTokenReward( falseCoinsTokenRewards.random.added[0], vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.random.added[0];
      falseCoinsTokenRewards.random.added[1] = typeof falseCoinsTokenRewards.random.added[1] === "string" ? this.stringToCoinTokenReward( falseCoinsTokenRewards.random.added[1], vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.random.added[1];
      falseCoinsTokenRewards.random.removed[0] = typeof falseCoinsTokenRewards.random.removed[0] === "string" ? this.stringToCoinTokenReward( falseCoinsTokenRewards.random.removed[0], vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.random.removed[0];
      falseCoinsTokenRewards.random.removed[1] = typeof falseCoinsTokenRewards.random.removed[1] === "string" ? this.stringToCoinTokenReward( falseCoinsTokenRewards.random.removed[1], vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.random.removed[1]

    }

    if ( typeof map.grid !== "undefined" && typeof map.meta !== "undefined" && p.gamemode !== 3 || typeof map.grid !== "undefined" && typeof map.meta !== "undefined" && p.gamemode === 3 ) {

      this.data = { map: map, playerRules: p, killerRules: k, entities: {}, playerSettings: {} };

      if (!flag) {

        for ( index = 0; index < this.data.playerRules.playerQuantity; index++ ) { this.data.entities[`player${ index + 1 }`] = {}; this.data.playerSettings[`player${index + 1}`] = { color: typeof savedColors[index] !== "undefined" ? savedColors[index] : p.playerColors[index], keyBindings: typeof savedKeyBindings[index] !== "undefined" ? savedKeyBindings[index] : p.standardKeyBindings[index] }; if ( ( index + 1 ) === this.data.playerRules.playerQuantity ) { this.data.playerSettings.killer = { keyBindings: typeof savedKeyBindings[index+1] !== "undefined" ? savedKeyBindings[index+1] : p.standardKeyBindings[index+1] } } }

      }

      if ( typeof state === true ) { this.debug = { state: state, registry: [], keys: [], maxRegistryLength: maxRegistryLength } }
      this.registry = {};
      this.createMap();
      this.registerMap( flag );
      this.mapRender( flag )

    }

  }

  debugKeyGen() {

    let M = T.Math,
    key = M.R( 1000000, 10000000 );

    while ( this.debug.keys.includes( key ) ) { key = M.R( 1000000, 10000000 ) }
    this.debug.keys.push( key );

    return key

  }

  debugRegister( string, args, state, debugKey ) {

    let supportedStates = ["start", "end"],
    maxRegistryLength = this.debug.maxRegistryLength,
    registerIndex,
    keyIndex;

    if ( string && args && Array.isArray( args ) && state && supportedStates.includes( state ) && debugKey && typeof debugKey === "number" ) {

      if ( this.debug.registry.length > maxRegistryLength ) {

        this.debug.registry.shift()

      }

      if ( state == "start" ) {

        this.debug.registry.push( { function: string, args: args, states: { [state]: new Date().toISOString() }, key: debugKey } )

      }

      else if ( state == "end" ) {

        registerIndex = this.debug.registry.map( v => v.key == debugKey ).indexOf( true ); keyIndex = this.debug.keys.indexOf( debugKey );

        this.debug.registry[registerIndex].states[state] = new Date().toISOString();
        delete this.debug.registry[registerIndex].key;

        this.debug.keys.splice( keyIndex, this.debug.keys.length === 1 ? 1 : keyIndex )

      }

    }

  }

  stringToCoinTokenReward( string, tokensPerRangeLoss ) {

    let debugKey,
    array;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "stringToCoinTokenReward", [string, tokensPerRangeLoss], "start", debugKey )

    }

    if ( string && tokensPerRangeLoss && typeof tokensPerRangeLoss === "number" ) {

      array = string.split(" ");

      array[0] = array[0].includes("*") && array[0].slice( 0, 1 ) === "*" ? Math.floor( tokensPerRangeLoss * Number( array[0].slice( 1 ) ) ) : array[0];
      array[1] = array[1] && array[1].slice( 0, 1 ) === "+" || array[1] && array[1].slice( 0, 1 ) === "-" ? ( array[0] + Number( array[1] ) ) : void 0;

      typeof debugKey === "undefined" ? void 0 : this.debugRegister( "stringToCoinTokenReward", [], "end", debugKey );

      return !array[1] ? array[0] : array[1];

    }

  }

  tileIdToClass( tileId ) {

    let debugKey,
    tileClasses = this.data.map.tileClasses,
    tileClass,
    playerColor;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileIdToClass", [tileId], "start", debugKey )

    }

    if ( typeof tileId === "number" ) {

      tileClass = String( tileClasses[tileId] );
      tileClass = tileClass.includes( "coin" ) ? "coin" : tileClass;
      
      if ( tileClass.includes( "player" ) ) {

        playerColor = this.data.playerSettings[tileClass].color;
        tileClass = `player ${playerColor}`;

      }

      typeof debugKey === "undefined" ? void 0 : this.debugRegister( "tileIdToClass", [], "end", debugKey );
      return tileClass

    }

  }

  tileClassToId( tileClass ) {

    let debugKey,
    tileClasses = this.data.map.tileClasses;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileClassToId", [tileClass], "start", debugKey )

    }

    if ( typeof tileClass !== "undefined" ) {

      typeof debugKey === "undefined" ? void 0 : this.debugRegister( "tileClassToId", [], "end", debugKey );
      return Number( tileClasses.indexOf(tileClass) )

    }

  }

  createMap() {

    let D = T.DOM,
    debugKey,
    map = this.data.map,
    table,
    tbody,
    index,
    Index,
    tr,
    td;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "createMap", [], "start", debugKey )

    }

    if ( map.meta && !map.element ) {

      table = D.cE( "table" ); tbody = D.cE( "tbody" );

      for ( index = 0;index < map.grid[1]; index++ ) {

        tr = D.cE( "tr" );

        for ( Index = 0;Index < map.grid[0]; Index++ ) {

          td = D.cE( "td" );
          td.dataset.x = Index;
          td.dataset.y = index;
          D.aC( td, tr )

        }

        D.aC( tr, tbody )

      }
      
      D.aC( tbody, table );

      this.data.map.element = table;

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "createMap", [], "end", debugKey );

  }

  registerMap( flag ) {

    let M = T.Math,
    debugKey,
    map = this.data.map,
    p = this.data.playerRules,
    grid = map.grid,
    index,
    row,
    column,
    coordinates,
    registryKeys,
    airTiles,
    number,
    bannedTilesFromRandomizing,
    randomizedPositions = [];

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "registerMap", [], "start", debugKey )

    }

    if ( map.meta && map.element instanceof HTMLElement ) {

      for ( index = 0; index < map.meta.length; index++ ) {

        row = index; while ( row >= grid[0] ) { row = row - grid[0] }; column = Math.floor( index / grid[0] );
        this.registerTile( [row, column], map.meta[index] )

      }

      if ( typeof this.data.playerRules.spawnPoints !== "boolean" && Array.isArray( this.data.playerRules.spawnPoints ) && typeof this.data.playerRules.spawnPoints.reduce( ( a, b ) => a + b ) === "number" ) {

        coordinates = this.data.playerRules.spawnPoints;

        for ( index = 0; index < coordinates.length; index++ ) {

          this.registerTile( coordinates[index], this.tileClassToId( `player${ index + 1 }` ) )

        }

      }

      else if ( this.data.playerRules.spawnPoints === true ) {

        for ( index = 0; index < this.data.playerRules.playerQuantity; index++ ) {

          registryKeys = Object.keys( this.registry ); bannedTilesFromRandomizing = this.data.map.bannedTilesFromRandomizing.map( v => v.join( "-" ) );
          airTiles = registryKeys.filter( v => this.registry[v].id === 0 && !bannedTilesFromRandomizing.includes( v ) ); number = M.R( airTiles.length ); coordinates = airTiles[number].split( "-" ).map( v => Number( v ) );
          randomizedPositions.push( coordinates ); this.registerTile( coordinates, this.tileClassToId( `player${ index + 1 }` ) )

        }

      }

      if ( !flag ) {

        for ( index = 0; index < this.data.playerRules.playerQuantity; index++ ) {

          this.data.entities[`player${ index + 1 }`] = { position: randomizedPositions[index], vision: { range: this.data.playerRules.vision.initialRange, tokens: ( this.data.playerRules.vision.initialRange * p.vision.tokensPerRangeLoss ) }, madness: { minRangeMoves: 0 }, entityBehavior: "player" }

        }

        this.registerCoins();
        this.registerDoor()

      }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "registerMap", [], "end", debugKey );

  }

  registerCoins() {

    let M = T.Math,
    debugKey,
    trueCoins = this.data.map.coins.true.quantity,
    falseCoins = this.data.map.coins.false.quantity,
    bannedTilesFromRandomizing = this.data.map.bannedTilesFromRandomizing.map( v => v.join( "-" ) ),
    index,
    registry,
    airTiles,
    number,
    tileId,
    coordinates;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "registerCoins", [], "start", debugKey )

    }

    for ( index = 0; index < ( trueCoins + falseCoins ); index++ ) {

      registry = Object.keys( this.registry ); airTiles = registry.filter( v => this.registry[v].id === 0 && !bannedTilesFromRandomizing.includes( v ) );
      number = M.R( airTiles.length ); tileId = index < trueCoins ? this.tileClassToId( "coin1" ) : this.tileClassToId( "coin2" );
      coordinates = airTiles[number].split( "-" ).map( v => Number( v ) );

      this.registerTile( coordinates, tileId );

      if ( tileId === this.tileClassToId( "coin1" ) ) { this.data.map.coins.true.positions.push( coordinates ) }
      else if ( tileId === this.tileClassToId( "coin2" ) ) { this.data.map.coins.false.positions.push( coordinates ) }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "registerCoins", [], "end", debugKey )

  }

  registerDoor() {

    let M = T.Math,
    debugKey,
    bannedTilesFromRandomizing = this.data.map.bannedTilesFromRandomizing.map( v => v.join( "-" ) ),
    registry,
    airTiles,
    number;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "registerDoor", [], "start", debugKey )

    }

    if ( !this.data.map.door ) {
 
      registry = Object.keys( this.registry ); airTiles = registry.filter( v => this.registry[v].id === 0 && !bannedTilesFromRandomizing.includes( v ) );
      number = M.R( airTiles.length );
      this.data.map.door = airTiles[number].split( "-" ).map( v => Number( v ) );
      this.registerTile( this.data.map.door, this.tileClassToId( "door" ) )

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "registerDoor", [], "end", debugKey )

  }

  registerTile( coordinates, tileId ) {

    let D = T.DOM,
    debugKey,
    map = this.data.map,
    registryQuery,
    element;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "registerTile", [coordinates, tileId], "start", debugKey )

    }

    if ( coordinates && Array.isArray( coordinates ) && typeof tileId === "number" ) {

      registryQuery = coordinates.join( "-" ); element = D.qSA( `[data-x="${ coordinates[0] }"][data-y="${ coordinates[1] }"]`, map.element , 0);

      this.registry[registryQuery] = { id: Number( tileId ), class: this.tileIdToClass( tileId ), element: element }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "registerTile", [], "end", debugKey )

  }

  tileUpdateDisplay( coordinates ) {

    let debugKey,
    registryQuery,
    registryItem;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileUpdateDisplay", [coordinates], "start", debugKey )

    }

    if ( coordinates && Array.isArray( coordinates ) ) {

      registryQuery = coordinates.join( "-" );

      if ( typeof this.registry[registryQuery] !== "undefined" ) {

        registryItem = this.registry[registryQuery];
        this.tileClear( coordinates ); 

        registryItem.id !== this.tileClassToId( "player1" ) && registryItem.id !== this.tileClassToId( "player2" ) && registryItem.id !== this.tileClassToId( "player3" ) && registryItem.id !== this.tileClassToId( "player4" ) ? this.registry[registryQuery].element.classList.add( this.registry[registryQuery].class ) : this.registry[registryQuery].class.split(" ").forEach( v => this.registry[registryQuery].element.classList.add( v ) )

      }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "tileUpdateDisplay", [], "end", debugKey );

  }

  tileClear( coordinates, flag ) {

    let debugKey,
    registryQuery,
    elementClassList;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileClear", [coordinates, flag], "start", debugKey )

    }

    if ( coordinates && Array.isArray( coordinates ) ) {

      registryQuery = coordinates.join( "-" );

      if ( this.registry[registryQuery] ) {

        elementClassList = this.registry[registryQuery].element.classList;

        elementClassList.remove( "air" );
        elementClassList.remove( "wall" );
        elementClassList.remove( "coin" );
        elementClassList.remove( "player" );
        elementClassList.remove( "red" );
        elementClassList.remove( "blue" );
        elementClassList.remove( "green" );
        elementClassList.remove( "orange" );
        elementClassList.remove( "killer" );
        typeof flag !== "undefined" && flag === true ? elementClassList.remove( "light" ) : void 0

      }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "tileClear", [], "end", debugKey )

  }

  lastUpdatedTilesFog( lastUpdatedTiles ) {

    let debugKey,
    registryQuery,
    tileId,
    elementClassList;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "lastUpdatedTilesFog", [lastUpdatedTiles], "start", debugKey )

    }

    if ( lastUpdatedTiles && Array.isArray( lastUpdatedTiles ) ) {

      lastUpdatedTiles.forEach( v => { 

        registryQuery = v.join( "-" );
        tileId = this.registry[registryQuery].id;
        elementClassList = this.registry[registryQuery].element.classList;

        switch ( tileId ) {

          case this.tileClassToId( "wall" ):
            elementClassList.remove( "wall" );
          break;

          case this.tileClassToId( "air" ):
            elementClassList.remove( "light" );
          break;

          case this.tileClassToId( "player1" ):
            elementClassList.remove( "light" );
          break;

          case this.tileClassToId( "player2" ):
            elementClassList.remove( "light" );
          break;

          case this.tileClassToId( "player3" ):
            elementClassList.remove( "light" );
          break;

          case this.tileClassToId( "player4" ):
            elementClassList.remove( "light" );
          break;

          case this.tileClassToId( "killer" ):
            elementClassList.remove( "light" );
          break;

          case this.tileClassToId( "coin1" ):
            elementClassList.remove( "coin" ); elementClassList.add( "air" );
          break;

          case this.tileClassToId( "coin2" ):
            elementClassList.remove( "coin" ); elementClassList.add( "air" );
          break;

        }

      } )

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "lastUpdatedTilesFog", [], "end", debugKey )

  }

  currentTilesLighting( currentTiles ) {


    let debugKey,
    registryQuery,
    tileId,
    elementClassList;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "currentTilesLighting", [currentTiles], "start", debugKey )

    }

    if ( currentTiles && Array.isArray( currentTiles ) ) {

      currentTiles.forEach( v => {

        registryQuery = v.join( "-" );
        tileId = this.registry[registryQuery].id;
        elementClassList = this.registry[registryQuery].element.classList;

        switch ( tileId ) {

          case this.tileClassToId( "air" ):
            elementClassList.add( "light" );
          break;

          case this.tileClassToId( "door" ):
            elementClassList.add( "light" );
          break;

        }

        this.tileUpdateDisplay( v )

      } )

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "currentTilesLighting", [], "end", debugKey )

  }

  mapRender( flag ) {

    let D = T.DOM,
    debugKey,
    map = this.data.map,
    p = this.data.playerRules,
    coordinates,
    slots,
    div,
    table,
    tbody,
    index,
    tr,
    td,
    tileResolution;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "mapRender", [flag], "start", debugKey )

    }

    if ( map.element && map.element instanceof HTMLElement ) {

      tileResolution = ( ( window.screen.availHeight / this.data.map.grid[1] ) * 0.8859 );

      this.data.map.element.style.height = `${ tileResolution * this.data.map.grid[1] }px`;
      this.data.map.element.style.width = `${ tileResolution * this.data.map.grid[0] }px`;

      document.body.insertAdjacentElement( "afterbegin", map.element );

      this.data.playerRules.coins = { true: 0, false: 0 };
      this.data.playerRules.madness = { quantity: 0 };

      for ( index = 0; index < this.data.playerRules.playerQuantity; index++ ) {

        coordinates = this.data.entities[`player${ index + 1 }`].position;

        if ( coordinates && Array.isArray( coordinates ) && typeof coordinates.reduce( ( a, b ) => a + b ) === "number" && coordinates.length === 2 ) {

          this.entitySight( `player${ index + 1 }` ); this.tileUpdateDisplay( coordinates )

        }

      }

      if ( flag ) {

        Object.keys( this.registry ).forEach( v  =>  {

          let coordinates = v.split( "-" );
          this.tileUpdateDisplay( coordinates )

        } )

      }

      else {

        this.generatePlayerSettings()

      }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "mapRender", [], "end", debugKey )

  }

  entitySight( entity ) { 

    let D = T.DOM,
    debugKey,
    p = this.data.playerRules,
    coordinates,
    lastUpdatedTiles,
    gamemode = p.gamemode,
    currentTiles,
    airTiles,
    currentAirTiles;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entitySight", [entity], "start", debugKey )

    }

    if ( entity && typeof this.data.entities[entity] !== "undefined" ) {

      coordinates = this.data.entities[entity].position;
      this.tileUpdateDisplay( coordinates );
      lastUpdatedTiles = this.data.entities[entity].lastUpdatedTiles;

      if ( coordinates && typeof coordinates.reduce( ( a, b ) => a + b ) === "number" ) {

        if ( lastUpdatedTiles ) {

          this.lastUpdatedTilesFog( lastUpdatedTiles )

          if ( gamemode === 1 ) {

            lastUpdatedTiles.forEach( v => { if ( v.join( "-" ) !== coordinates.join( "-" ) ) { this.tileClear( v ) } } )

          }

          this.data.entities[entity].lastUpdatedTiles = []

        }

        currentTiles = this.entitySightRadius( entity );
        this.currentTilesLighting( currentTiles );

        this.data.entities[entity].lastUpdatedTiles = currentTiles;

      }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entitySight", [], "end", debugKey )

  }

  entitySightRange( entity ) {

    let debugKey,
    range,
    index,
    number,
    entitySightRange = [];

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entitySightRange", [entity], "start", debugKey )

    }

    if ( entity && typeof this.data.entities[entity] !== "undefined" ) {

      range = this.data.entities[entity].vision.range;
      number = ( -range );

      if ( range && typeof range === "number" ) {

        for ( index = 0; index < ( ( range * 2 ) + 1 ); index++ ) {

          entitySightRange.push( number );
          number += 1

        }

        typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entitySightRange", [], "end", debugKey );

        return entitySightRange

      }

    }

  }

  entitySightRadius( entity ) {

    let debugKey,
    p = this.data.playerRules,
    range,
    coordinates,
    x,
    y,
    entitySightRange,
    index,
    Index,
    X,
    Y,
    flag,
    entitySightRadius = [],
    grid = this.data.map.grid,
    row,
    column;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entitySightRadius", [entity], "start", debugKey )

    }

    if ( entity && typeof this.data.entities[entity] !== "undefined" ) {

      range = this.data.entities[entity].vision.range;
      coordinates = this.data.entities[entity].position;
      x = coordinates[0];
      y = coordinates[1];

      if ( range && typeof range === "number" && entity ) {

        entitySightRange = this.entitySightRange( entity );

        for ( index = 0; index < entitySightRange.length; index++ ) {

          for ( Index = 0; Index < entitySightRange.length; Index++ ) {

            X = Index; Y = index; flag = true;
            flag = X === 0 && Y === 0 || X === ( range * 2 ) && Y === 0 || X === 0 && Y === ( range * 2 ) || X === ( range * 2 ) && Y === ( range * 2 ) || X === range  && Y === range  ? void 0 : true;
            
            if ( flag ) {

              row = ( x + entitySightRange[Index] ) >= 0 && ( x + entitySightRange[Index] ) < grid[0] ? ( x + entitySightRange[Index] ) : false;
              column = ( y + entitySightRange[index] ) >= 0 && ( y + entitySightRange[index] ) < grid[1] ? ( y + entitySightRange[index] ) : false;

              if ( typeof row === "number" && typeof column === "number" ) { entitySightRadius.push( [row, column] ) }

            }

          }

        }

        typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entitySightRadius", [], "end", debugKey );

        return entitySightRadius

      }

    }

  }

  entityMove( entity, coordinates ) { 

    let debugKey,
    p = this.data.playerRules,
    moveDistance = p.moveDistance,
    registryItem,
    newX,
    newY,
    oldX,
    oldY,
    tileId,
    oldXY,
    newXY,
    flag,
    trueCoinPositions = this.data.map.coins.true.positions.map( v => v.join("-") ),
    falseCoinPositions = this.data.map.coins.false.positions.map( v => v.join("-") );

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entityMove", [entity, coordinates], "start", debugKey )

    }

    if ( entity && typeof this.data.entities[entity] !== "undefined" && moveDistance && typeof coordinates !== "undefined" && Array.isArray( coordinates ) ) {

      newX = coordinates[0];
      newY = coordinates[1];
      oldX = this.data.entities[entity].position[0];
      oldY = this.data.entities[entity].position[1];
      registryItem = this.registry[ coordinates.join( "-" ) ];
      flag = registryItem.id !== this.tileClassToId( "wall" ) && registryItem.id !== this.tileClassToId( "player1" ) && registryItem.id !== this.tileClassToId( "player2" ) && registryItem.id !== this.tileClassToId( "player3" ) && registryItem.id !== this.tileClassToId( "player4" ) && registryItem.id !== this.tileClassToId( "killer" ) ? void 0 : true;

      if ( !flag && Math.abs( newX - oldX ) <= moveDistance && Math.abs( newY - oldY ) <= moveDistance && Math.abs( newX - oldX ) + Math.abs( newY - oldY ) <= moveDistance ) {

        oldXY = `${ oldX }-${ oldY }`;
        tileId = oldXY === this.data.map.door.join( "-" ) ? this.tileClassToId( "door" ) : this.tileClassToId( "air" );

        // if killer steps on a coin
        tileId = entity === "killer" && trueCoinPositions.includes( oldXY ) ? this.tileClassToId( "coin1" ) : tileId;
        tileId = entity === "killer" && falseCoinPositions.includes( oldXY ) ? this.tileClassToId( "coin2" ) : tileId;

        this.data.playerRules.lastPlayerMoveDirection = Math.abs( newX - oldX ) === 1 ? "x" : "y";
        this.data.entities[entity].position = [Number( newX ), Number( newY )];

        oldXY = [oldX, oldY];
        newXY = [newX, newY];

        this.registerTile( oldXY, tileId );
        this.tileUpdateDisplay( oldXY );
        this.tileEvents( newXY, entity );

        typeof this.data.entities[entity] !== "undefined" ? this.registerTile( newXY, this.tileClassToId( entity ) ) : this.registerTile( newXY, this.tileClassToId( "air" ) );
        typeof this.data.entities[entity] !== "undefined" ? this.tileUpdateDisplay( newXY ) : void 0;

        if (  typeof this.data.entities[entity] === "undefined" ) { this.tileClear( oldXY, true ) }

        typeof this.data.entities[entity] !== "undefined" ? this.entitySight( entity ) : void 0;
        typeof this.data.entities[entity] !== "undefined" ? this.tileClear( oldXY ) : void 0

      }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entityMove", [], "end", debugKey )

  }

  tileEvents( coordinates, entity ) {

    let M = T.Math,
    debugKey,
    tileId,
    range,
    tokensPerRangeLoss = this.data.playerRules.vision.tokensPerRangeLoss,
    tokens,
    trueCoinsTokenRewards = this.data.map.coins.true.tokenRewards,
    falseCoinsTokenRewards = this.data.map.coins.false.tokenRewards,
    trueCoinsRandomRewards = trueCoinsTokenRewards.random,
    falseCoinsRandomRewards = falseCoinsTokenRewards.random,
    obsession = typeof entity !== "undefined" && entity.includes( "killer" ) && typeof this.data.entities[ this.data.entities[entity].obsession ] !== "undefined" ? this.data.entities[entity].obsession : undefined;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileEvents", [coordinates, entity], "start", debugKey )

    }

    if ( entity && typeof this.data.entities[entity] !== "undefined" && this.data.entities[entity].entityBehavior === "player" ) {

      range = this.data.entities[entity].vision.range;
      tokens = this.data.entities[entity].vision.tokens;

      if ( coordinates && Array.isArray( coordinates ) && coordinates.length === 2) {

        tileId = this.registry[coordinates.join( "-" )].id;

        switch ( tileId ) {

          case this.tileClassToId( "coin1" ): 
            this.data.playerRules.coins.true += 1;
            this.data.playerRules.madness.quantity = this.data.playerRules.madness.quantity > 0 ? this.data.playerRules.madness.quantity * this.data.map.madness.coins.true.madnessMultiplier : 0;
            this.data.entities[entity].vision.tokens = tokens + trueCoinsTokenRewards.base + M.R( trueCoinsRandomRewards.added[0], trueCoinsRandomRewards.added[1] ) - M.R( trueCoinsRandomRewards.removed[0], trueCoinsRandomRewards.removed[1] );
          break;

          case this.tileClassToId( "door" ):
            this.data.map.coins.true.quantity - this.data.playerRules.coins.true === 0 ? alert( "you won" ) : alert( `you found ${ this.data.playerRules.coins.true } coins of ${ this.data.map.coins.true.quantity }` );
          break;

          case this.tileClassToId( "coin2" ):
            this.data.playerRules.coins.false += 1;
            this.data.playerRules.madness.quantity = this.data.playerRules.madness.quantity > 0 ? this.data.playerRules.madness.quantity * this.data.map.madness.coins.false.madnessMultiplier : 0;
            this.data.entities[entity].vision.tokens = tokens + falseCoinsTokenRewards.base + M.R( falseCoinsRandomRewards.added[0], falseCoinsRandomRewards.added[1] ) - M.R( falseCoinsRandomRewards.removed[0], falseCoinsRandomRewards.removed[1] );
          break

        }
         
        this.data.entities[entity].madness.minRangeMoves += this.data.entities[entity].vision.range === this.data.playerRules.vision.minRange ? 1 : 0;
        this.data.playerRules.madnessMoves += this.data.map.madness.state === true && this.data.entities[entity].vision.range === this.data.playerRules.vision.minRange ? 1 : 0;

        if ( this.data.killerRules.playerMadnessMovesBeforeSpawn === this.data.playerRules.madnessMoves ) {

          this.spawnKiller( entity );

        }

        this.updateMadnessFilter( entity );

        this.data.entities[entity].vision.tokens = this.data.entities[entity].vision.tokens < ( this.data.playerRules.vision.tokensPerRangeLoss * this.data.playerRules.vision.maxRange ) ? this.data.entities[entity].vision.tokens : ( this.data.playerRules.vision.tokensPerRangeLoss * this.data.playerRules.vision.maxRange );
        this.data.entities[entity].vision.tokens = this.data.entities[entity].vision.tokens < ( ( ( this.data.playerRules.vision.minRange - 1 ) * this.data.playerRules.vision.tokensPerRangeLoss ) + 1 ) ? ( ( this.data.playerRules.vision.minRange - 1 ) * ( this.data.playerRules.vision.tokensPerRangeLoss ) + 1 ) : this.data.entities[entity].vision.tokens;
        this.data.entities[entity].vision.tokens -= this.data.entities[entity].vision.tokens !== ( ( ( this.data.playerRules.vision.minRange - 1 ) * this.data.playerRules.vision.tokensPerRangeLoss ) + 1 ) ? 1 : 0;
        this.data.entities[entity].vision.range = Math.ceil( this.data.entities[entity].vision.tokens / this.data.playerRules.vision.tokensPerRangeLoss ) >= this.data.playerRules.vision.minRange ? Math.ceil( this.data.entities[entity].vision.tokens / this.data.playerRules.vision.tokensPerRangeLoss ) : this.data.playerRules.vision.minRange;

        typeof debugKey === "undefined" ? void 0 : this.debugRegister( "tileEvents", [], "end", debugKey )

      }

    }

    else if ( entity && typeof this.data.entities[entity] !== "undefined" && this.data.entities[entity].entityBehavior === "killer" && obsession ) {

      this.data.entities[entity].movesBeforeDisappearing -= this.data.entities[entity].movesBeforeDisappearing >= 1 ? 1 : 0;
      this.updateMadnessFilter( entity );

      if ( Math.abs( this.data.entities.killer.position[0] - this.data.entities[obsession].position[0] ) === 0 && Math.abs( this.data.entities.killer.position[1] - this.data.entities[obsession].position[1] ) === 1 || Math.abs( this.data.entities.killer.position[0] - this.data.entities[obsession].position[0] ) === 1 && Math.abs( this.data.entities.killer.position[1] - this.data.entities[obsession].position[1] ) === 0 ) {

        this.entityRemove( obsession );
        this.data.entities[entity].movesBeforeDisappearing = 0

      }

      if ( this.data.entities[entity].movesBeforeDisappearing === 0 ) {

        this.entityRemove( entity );
        this.data.playerRules.madnessMoves = 0

      }

    }

  }

  spawnKiller( entity ) {

    let M = T.Math,
    debugKey,
    bannedTilesFromRandomizing = this.data.map.bannedTilesFromRandomizing.map( v => v.join( "-" ) ),
    index,
    registry,
    airTiles,
    number,
    tileId,
    coordinates,
    obsessionPosition;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "spawnKiller", [entity], "start", debugKey )

    }

    if ( !this.data.entities.killer && entity && !entity.includes( "killer" ) && typeof this.data.entities[entity] !== "undefined" ) {

      obsessionPosition = this.data.entities[entity].position;

      registry = Object.keys( this.registry ); airTiles = registry.filter( v => this.registry[v].id === 0 && !bannedTilesFromRandomizing.includes( v ) ); //airTiles = airTiles.filter( v => Math.abs( v[0] - obsessionPosition[0] ) >= this.data.killerRules.spawn.minDistanceFromObsession && Math.abs( v[0] - obsessionPosition[0] ) <= this.data.killerRules.spawn.maxDistanceFromObsession || Math.abs( v[1] - obsessionPosition[1] ) >= this.data.killerRules.spawn.minDistanceFromObsession && Math.abs( v[1] - obsessionPosition[1] ) <= this.data.killerRules.spawn.maxDistanceFromObsession );
      number = M.R( airTiles.length ); tileId = this.tileClassToId( "killer" ); coordinates = airTiles[number].split( "-" ).map( v => Number( v ) );

      this.registerTile( coordinates, tileId );
      this.tileUpdateDisplay( coordinates );

      this.data.entities.killer = { entityBehavior: "killer", position: coordinates, vision: { range: this.data.killerRules.vision.range }, movesBeforeDisappearing: this.data.killerRules.movesBeforeDisappearing, obsession: entity }

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "spawnKiller", [], "end", debugKey )

  }

  entityUP( entity ) {

    let debugKey,
    t;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entityUP", [entity], "start", debugKey )

    }

    if ( typeof this.data.entities[entity] !== "undefined" ) {

      typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entityUP", [], "end", debugKey );

      return [ this.data.entities[entity].position[0], ( this.data.entities[entity].position[1] - 1 ) ]

    }

  }

  entityDOWN( entity ) {

    let debugKey,
    t;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entityDOWN", [entity], "start", debugKey )

    }

    if ( typeof this.data.entities[entity] !== "undefined" ) {

      typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entityDOWN", [], "end", debugKey );

      return [ this.data.entities[entity].position[0], ( this.data.entities[entity].position[1] + 1) ]

    }

  }

  entityLEFT( entity ) {

    let debugKey,
    t;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entityLEFT", [entity], "start", debugKey )

    }

    if ( typeof this.data.entities[entity] !== "undefined" ) {

      typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entityLEFT", [], "end", debugKey );

      return [ ( this.data.entities[entity].position[0] - 1 ), this.data.entities[entity].position[1] ]

    }

  }

  entityRIGHT( entity ) {

    let debugKey,
    t;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entityRIGHT", [entity], "start", debugKey )

    }

    if ( typeof this.data.entities[entity] !== "undefined" ) {

      typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entityRIGHT", [], "end", debugKey );

      return [ ( this.data.entities[entity].position[0] + 1), this.data.entities[entity].position[1] ]

    }

  }

  entitiesSight( entity ) {

    let debugKey,
    entityIndex;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entitiesSight", [entity], "start", debugKey )

    }

    if ( typeof this.data.entities[entity] !== "undefined" ) {

      entityIndex = entity.includes( "player" ) ? Number( entity.slice( -1 ) ) : 5;


      entityIndex !== 1 ? this.entitySight( "player1" ) : void 0;
      entityIndex !== 2 ? this.entitySight( "player2" ) : void 0;
      entityIndex !== 3 ? this.entitySight( "player3" ) : void 0;
      entityIndex !== 4 ? this.entitySight( "player4" ) : void 0;
      entityIndex !== 5 ? this.entitySight( "killer" ) : void 0

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entitiesSight", [], "end", debugKey )

  }

  entityRemove( entity ) {

    let debugKey;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entityRemove", [entity], "start", debugKey )

    }

    if ( typeof this.data.entities[entity] !== "undefined" ) {

      this.registerTile( this.data.entities[entity].position, this.tileClassToId( "air" ) );
      this.tileClear( this.data.entities[entity].position );
      this.data.entities[entity].lastUpdatedTiles.forEach( v => { if ( !this.registry[ v.join( "-" ) ].element.classList.contains( "player" ) ) { this.tileClear( v, true ) } } );
      this.entitiesSight( entity );
      delete this.data.entities[entity];

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "entityRemove", [], "end", debugKey )

  }

  updateMadnessFilter( entity ) {

    let debugKey,
    feTurbulence,
    feDisplacementMap,
    baseFrequency,
    scale;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "updateMadnessFilter", [entity], "start", debugKey )

    }

    if (  entity && typeof this.data.entities[entity] !== "undefined" ) {

      if ( this.data.entities[entity].entityBehavior === "player" ) {

        this.data.playerRules.madness.quantity += this.data.entities[entity].vision.range > this.data.playerRules.vision.minRange ? this.data.map.madness.loss : this.data.map.madness.gain;

      }

      else if ( this.data.entities[entity].entityBehavior === "killer" ) {

        this.data.playerRules.madness.quantity += ( this.data.map.madness.gain * 2 );

      }

      this.data.playerRules.madness.quantity = this.data.playerRules.madness.quantity < 0 ? 0 : this.data.playerRules.madness.quantity;
      this.data.playerRules.madness.quantity = this.data.playerRules.madness.quantity > this.data.map.madness.cap ? this.data.map.madness.cap : this.data.playerRules.madness.quantity;

      this.data.playerRules.madness.quantity = this.data.entities[entity].entityBehavior !== "killer" && this.data.entities[entity].madness.minRangeMoves === this.data.map.madness.minRangeMovesBeforeDistortion ? 0 : this.data.playerRules.madness.quantity;
      this.data.playerRules.madness.quantity = Number( this.data.playerRules.madness.quantity.toFixed( 3 ) ) === this.data.map.madness.cap ? this.data.map.madness.cap - ( this.data.map.madness.gain * this.data.map.madness.distortionLoop ) : this.data.playerRules.madness.quantity;

      this.data.map.madness.state = this.data.entities[entity].entityBehavior === "player" && this.data.entities[entity].madness.minRangeMoves >= this.data.map.madness.minRangeMovesBeforeDistortion ? true : this.data.map.madness.state;

      if ( this.data.map.madness.state === true && this.data.playerRules.madness.quantity > 0 ) {

        this.data.map.element.classList.add( "madness" );
        feTurbulence = document.querySelector( "feTurbulence" ); feDisplacementMap = document.querySelector( "feDisplacementMap" );
        baseFrequency = `${ this.data.playerRules.lastPlayerMoveDirection === "x" ? this.data.map.madness.playerDirectionDistortion : this.data.playerRules.madness.quantity } ${ this.data.playerRules.lastPlayerMoveDirection === "y" ? this.data.map.madness.playerDirectionDistortion : this.data.playerRules.madness.quantity }`;
        scale = Math.ceil( Number( this.data.playerRules.madness.quantity.toFixed( 2 ) ) * Math.ceil( this.data.map.madness.distortionScaleMultiplier * 100 ) );
        feTurbulence.setAttribute( "baseFrequency", baseFrequency );
        feDisplacementMap.setAttribute( "scale", scale )

      }

      if ( entity.includes( "player" ) && this.data.entities[entity].vision.range > this.data.playerRules.vision.minRange && this.data.playerRules.madness.quantity === 0 ) {

        this.data.map.madness.state = false;
        this.data.entities[entity].madness.minRangeMoves = 0;
        this.data.map.element.classList.remove( "madness" )

      }

      typeof debugKey === "undefined" ? void 0 : this.debugRegister( "updateMadnessFilter", [], "end", debugKey )

    }

  }

  togglePlayerSettings() {

    let debugKey,
    D = T.DOM,
    userSettings = D.qSA( ".user-settings", document, 0 );

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "togglePlayerSettings", [], "start", debugKey )

    }

    if ( typeof userSettings !== "undefined" ) {

      this.data.playerRules.HUDisActive = getComputedStyle( userSettings ).display === "block" ? false : true;
      userSettings.style.display = getComputedStyle( userSettings ).display === "block" ? "none" : "block";

      this.data.playerRules.focusedKeyBinding = "";
      document.querySelectorAll( ".focused" ).forEach( v => v.classList.remove( "focused" ) );

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "togglePlayerSettings", [], "end", debugKey )

  }

  generatePlayerSettings() {

    let debugKey,
    keyBindings,
    D = T.DOM,
    entities = Object.keys( this.data.playerSettings ),
    index,
    div;


    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "generatePlayerSettings", [], "start", debugKey )

    }

    if ( entities.length > 0 && typeof D.qSA( ".user-settings", document, 0 ) === "undefined" ) {

      div = D.cE( "div" );
      div.className = "user-settings";

      for ( index = 0; index < entities.length; index++ ) {

          div.innerHTML += `<table id="${ entities[index] + "-card" }" class="${ entities[index].includes( "player" ) && this.data.entities[entities[index]].entityBehavior === "player" ? this.data.playerSettings[entities[index]].color : "purple" }"><tr><td colspan="3">${ entities[index] }</td></tr><tr><td id="${ entities[index].includes( "player" ) && this.data.entities[entities[index]].entityBehavior === "player" ? entities[index] + "-leftColorChange" : "" }">${ entities[index].includes( "player" ) && this.data.entities[entities[index]].entityBehavior === "player" ? "<" : "" }</td><td id="${ entities[index] + "-color" }">${ entities[index].includes( "player" ) && this.data.entities[entities[index]].entityBehavior === "player" ? this.data.playerSettings[entities[index]].color : "purple" }</td><td id="${ entities[index].includes( "player" ) && this.data.entities[entities[index]].entityBehavior === "player" ? entities[index] + "-rightColorChange" : "" }">${ entities[index].includes( "player" ) && this.data.entities[entities[index]].entityBehavior === "player" ? ">" : "" }</td></tr><tr><td></td><td id="${ entities[index] + "-keyUp" }">${ typeof this.data.playerSettings[entities[index]].keyBindings !== "undefined" && typeof this.data.playerSettings[entities[index]].keyBindings[0] !== "undefined" ? this.data.playerSettings[entities[index]].keyBindings[0].replace("Key","") : "..." }</td><td></td></tr><tr><td id="${ entities[index] + "-keyLeft" }">${ typeof this.data.playerSettings[entities[index]].keyBindings !== "undefined" && typeof this.data.playerSettings[entities[index]].keyBindings[2] !== "undefined" ? this.data.playerSettings[entities[index]].keyBindings[2].replace("Key","") : "..." }</td><td id="${ entities[index] + "-keyDown" }">${ typeof this.data.playerSettings[entities[index]].keyBindings !== "undefined" && typeof this.data.playerSettings[entities[index]].keyBindings[1] !== "undefined" ? this.data.playerSettings[entities[index]].keyBindings[1].replace("Key","") : "..." }</td><td id="${ entities[index] + "-keyRight" }">${ typeof this.data.playerSettings[entities[index]].keyBindings !== "undefined" && typeof this.data.playerSettings[entities[index]].keyBindings[3] !== "undefined" ? this.data.playerSettings[entities[index]].keyBindings[3].replace("Key","") : "..." }</td></tr></table>`
        
      }

      D.aC( div )

    }

    typeof debugKey === "undefined" ? void 0 : this.debugRegister( "generatePlayerSettings", [], "end", debugKey )

  }

}