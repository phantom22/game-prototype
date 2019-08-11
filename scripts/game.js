const T = TOOL;

class gameInstance { 

  constructor( playerRules = { spawnPoint, moveDistance, vision, gamemode }, map = { grid, meta, coins, madness }, debug = { state, maxRegistryLength } ) { 

    let p = playerRules,
    player,
    vision = typeof p.vision !== "undefined" ? p.vision : void 0,
    coins = map.coins,
    madness = typeof map.madness !== "undefined" ? map.madness : void 0,
    mCoins = typeof map.madness !== "undefined" ? madness.coins : void 0,
    flag = p.gamemode === 3 ? true : false,
    trueCoinsTokenRewards,
    falseCoinsTokenRewards,
    state = typeof debug !== "undefined" ? debug.state : false,
    maxRegistryLength = typeof debug !== "undefined" && typeof map.grid !== "undefined" && debug.maxRegistryLength > ( map.grid[0] * map.grid[1] ) ? debug.maxRegistryLength : ( ( map.grid[0] * map.grid[1] ) * 2 );

    map.grid = typeof map.grid !== "undefined" && Array.isArray( map.grid ) && typeof map.grid.reduce( ( a, b )  =>  a + b ) === "number" && map.grid.length === 2 ? map.grid : void 0;
    map.meta = typeof map.meta === "string" && map.meta.split( "" ).length === map.grid[0] * map.grid[1] ? map.meta.split( "" ).map( v => Number( v ) ) : void 0;

    this.debug = typeof state !== "undefined" && state === true ? { state: state, registry: [], keys: [], maxRegistryLength: maxRegistryLength } : void 0;

    if ( !flag ) {

      p.spawnPoint = typeof playerRules.spawnPoint === "boolean" || typeof playerRules.spawnPoint !== "undefined" && Array.isArray( playerRules.spawnPoint ) && typeof playerRules.spawnPoint.reduce( ( a, b )  =>  a + b ) === "number" && playerRules.spawnPoint.length === 2 ? playerRules.spawnPoint : true;
      p.moveDistance = typeof p.moveDistance === "number" && p.moveDistance > 0 ? Math.floor( p.moveDistance ) : 1;
      p.gamemode = typeof p.gamemode === "number" && p.gamemode > 0 ? Math.floor( p.gamemode ) : 0;
      vision.initialRange =  typeof p.vision !== "undefined" && typeof vision.initialRange === "number" && vision.initialRange > 0 ? Math.floor( vision.initialRange ) : 5;
      vision.tokensPerRangeLoss = typeof vision.tokensPerRangeLoss === "number" && vision.tokensPerRangeLoss > 0 ? Math.floor( vision.tokensPerRangeLoss ) : 7;
      vision.minRange = typeof vision.minRange === "number" && vision.minRange >= 1 && vision.minRange <= vision.maxRange ? Math.floor( vision.minRange ) : 2;
      vision.maxRange = typeof vision.maxRange === "number" && vision.maxRange >= 1 && vision.maxRange >= vision.minRange ? Math.floor( vision.maxRange ) : initialRange + 2;

      coins.true.quantity = typeof coins.true.quantity === "number" & coins.true.quantity >= 1 ? Math.floor( coins.true.quantity ) : 10;
      coins.false.quantity = typeof coins.false.quantity === "number" && coins.false.quantity >= 0 ? Math.floor( coins.false.quantity ) : 10;
      coins.true.tokenRewards.base = typeof coins.true.tokenRewards.base === "number" || typeof coins.true.tokenRewards.base === "string" ? coins.true.tokenRewards.base : "*1.8";
      coins.false.tokenRewards.base = typeof coins.false.tokenRewards.base === "number" || typeof coins.false.tokenRewards.base === "string" ? coins.false.tokenRewards.base : "*1.2";
      coins.true.tokenRewards.random.added = Array.isArray( coins.true.tokenRewards.random.added ) && coins.true.tokenRewards.random.added.length === 2 ? coins.true.tokenRewards.random.added : [4, "*1.3"];
      coins.false.tokenRewards.random.added = Array.isArray( coins.false.tokenRewards.random.added ) && coins.false.tokenRewards.random.added.length === 2 ? coins.false.tokenRewards.random.added : [0, "*0.7"];
      coins.true.tokenRewards.random.removed = Array.isArray( coins.true.tokenRewards.random.removed ) && coins.true.tokenRewards.random.removed.length === 2 ? coins.true.tokenRewards.random.removed : [3, "*0.8"];
      coins.false.tokenRewards.random.removed = Array.isArray( coins.false.tokenRewards.random.removed ) && coins.false.tokenRewards.random.removed.length === 2 ? coins.false.tokenRewards.random.removed : [0,  "*0.3"];

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

      this.data = { map: map, playerRules: p, entities: { player1: {} } };
      this.registry = {};
      this.createMap();
      this.registerMap( flag );
      this.mapRender( flag );

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

    if ( string && args && Array.isArray( args ) && state && supportedStates.includes( state ) && debugKey && !isNaN( debugKey ) ) {

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

    if ( string && tokensPerRangeLoss && !isNaN( tokensPerRangeLoss ) ) {

      array = string.split(" ");

      array[0] = array[0].includes("*") && array[0].slice( 0, 1 ) === "*" ? Math.floor( tokensPerRangeLoss * Number( array[0].slice( 1 ) ) ) : array[0];
      array[1] = array[1] && array[1].slice( 0, 1 ) === "+" || array[1] && array[1].slice( 0, 1 ) === "-" ? ( array[0] + Number( array[1] ) ) : void 0;

      typeof debugKey === "undefined" ? false : this.debugRegister( "stringToCoinTokenReward", [], "end", debugKey );

      return !array[1] ? array[0] : array[1];

    }

  }

  tileClass( typeId ) {

    let debugKey,
    tileType = ["air", "wall", "coin", "door", "player", "coin" ];

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileClass", [typeId], "start", debugKey )

    }

    if ( !isNaN( typeId ) ) {

    	typeof debugKey === "undefined" ? false : this.debugRegister( "tileClass", [], "end", debugKey );
    	return String( tileType[typeId] )

    }

  }

  createMap() {

    let D = T.DOM,
    debugKey,
    map = this.data.map,
    tbl,
    tbd,
    index,
    Index,
    tr,
    td;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "createMap", [], "start", debugKey )

    }

    if ( map.meta && !map.element ) {

      tbl = D.cE( "table" ); tbd = D.cE( "tbody" );

      for ( index = 0;index < map.grid[1]; index++ ) {

      	tr = D.cE( "tr" );

      	for ( Index = 0;Index < map.grid[0]; Index++ ) {

      		td = D.cE( "td" );
      		td.dataset.x = Index;
      		td.dataset.y = index;
      		D.aC( td, tr )

      	}

      	D.aC( tr, tbd )

      }
      
      D.aC( tbd, tbl );

      this.data.map.element = tbl;

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "createMap", [], "end", debugKey );

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
    xy,
    registryKeys,
    airTiles,
    number,
    bannedTilesFromRandomizing;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "registerMap", [], "start", debugKey )

    }

    if ( map.meta && map.element instanceof HTMLElement ) {

      for ( index = 0;index < map.meta.length; index++ ) {

        row = index; while ( row >= grid[0] ) { row = row - grid[0] }; column = Math.floor( index / grid[0] );
        this.registerTile( [row, column], map.meta[index] )

      }

      if ( typeof this.data.playerRules.spawnPoint !== "boolean" && Array.isArray( this.data.playerRules.spawnPoint ) && !isNaN( this.data.playerRules.spawnPoint.reduce( ( a, b ) => a + b ) ) ) {

        xy = this.data.playerRules.spawnPoint;
        this.registerTile( xy, 4 )

      }

      else if ( this.data.playerRules.spawnPoint === true ) {

        registryKeys = Object.keys( this.registry ); bannedTilesFromRandomizing = this.data.map.bannedTilesFromRandomizing.map( v => `${ v[0] }-${ v[1] }` );
        airTiles = registryKeys.filter( v => this.registry[v].id === 0 && !bannedTilesFromRandomizing.includes( v ) ); number = M.R( airTiles.length ); xy = airTiles[number].split( "-" ).map( v => Number( v ) );
        this.registerTile( xy, 4 )

      }

      if ( !flag ) {

        this.data.entities["player1"] = { position: xy, vision: { range: this.data.playerRules.vision.initialRange, tokens: ( this.data.playerRules.vision.initialRange * p.vision.tokensPerRangeLoss ) }, madness: { minRangeMoves: 0 } }
        this.registerCoins();
        this.registerDoor()

      }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "registerMap", [], "end", debugKey );

  }

  registerCoins() {

    let M = T.Math,
    debugKey,
    trueCoins = this.data.map.coins.true.quantity,
    falseCoins = this.data.map.coins.false.quantity,
    bannedTilesFromRandomizing = this.data.map.bannedTilesFromRandomizing.map( v => `${ v[0] }-${ v[1] }` ),
    index,
    registry,
    airTiles,
    number,
    typeId;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "registerCoins", [], "start", debugKey )

    }

    for ( index = 0;index < ( trueCoins + falseCoins ); index++ ) {

      registry = Object.keys( this.registry ); airTiles = registry.filter( v => this.registry[v].id === 0 && !bannedTilesFromRandomizing.includes( v ) );
      number = M.R( airTiles.length ); typeId = index < trueCoins ? 2 : 5;

      this.registerTile( airTiles[number].split( "-" ), typeId )

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "registerCoins", [], "end", debugKey )

  }

  registerDoor() {

    let M = T.Math,
    debugKey,
    bannedTilesFromRandomizing = this.data.map.bannedTilesFromRandomizing.map( v => `${ v[0] }-${ v[1] }` ),
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
      this.registerTile( this.data.map.door, 3 )

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "registerDoor", [], "end", debugKey )

  }

  registerTile( xy, typeId ) {

    let D = T.DOM,
    debugKey,
    map = this.data.map,
    registryQuery,
    element;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "registerTile", [xy, typeId], "start", debugKey )

    }

    if ( xy && Array.isArray( xy ) && !isNaN( typeId ) ) { 

      registryQuery = `${ xy[0] }-${ xy[1] }`; element = D.qSA( `[data-x="${ xy[0] }"][data-y="${ xy[1] }"]`, map.element , 0);

      this.registry[registryQuery] = { id: Number( typeId ), class: this.tileClass( typeId ), element: element }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "registerTile", [], "end", debugKey )

  }

  tileUpdateDisplay( xy ) {

    let debugKey,
    registryQuery;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileUpdateDisplay", [xy], "start", debugKey )

    }

    if ( xy && Array.isArray( xy ) ) {

      registryQuery = `${ xy[0] }-${ xy[1] }`;
      if ( this.registry[registryQuery] ) { this.tileClear( xy );this.registry[registryQuery].element.classList.add( this.registry[registryQuery].class ) }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "tileUpdateDisplay", [], "end", debugKey );

  }

  tileClear( xy ) {

    let debugKey,
    registryQuery,
    elementClassList;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileClear", [xy], "start", debugKey )

    }

    if ( xy && Array.isArray( xy ) ) {

      registryQuery = `${ xy[0] }-${ xy[1] }`;

      if ( this.registry[registryQuery] ) {

        elementClassList = this.registry[registryQuery].element.classList;

        elementClassList.remove( "air" );
        elementClassList.remove( "wall" );
        elementClassList.remove( "coin" );
        elementClassList.remove( "door" );
        elementClassList.remove( "player" )

      }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "tileClear", [], "end", debugKey )

  }

  mapRender( flag ) {

    let D = T.DOM,
    debugKey,
    map = this.data.map,
    p = this.data.playerRules,
    xy = this.data.entities.player1.position,
    slots,
    div,
    tbl,
    tbd,
    index,
    tr,
    td;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "mapRender", [flag], "start", debugKey )

    }

    if ( map.element && map.element instanceof HTMLElement ) {

      document.body.insertAdjacentElement( "afterbegin", map.element );

      if ( xy && Array.isArray( xy ) && !isNaN( xy.reduce( ( a, b ) => a + b ) ) && xy.length === 2 ) {

        this.data.playerRules.coins = { true: 0, false: 0 };
        this.data.playerRules.madness = { quantity: 0 };

        this.entitySight( "player1" ); this.tileUpdateDisplay( xy )

      }

      if ( flag ) {

      	Object.keys( this.registry ).forEach( v  =>  {

      		let xy = v.split( "-" );
      		this.tileUpdateDisplay( xy )

      	} )

      }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "mapRender", [], "end", debugKey )

  }

  entitySight( entity ) { 

    let D = T.DOM,
    debugKey,
    p = this.data.playerRules,
    xy,
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

      xy = this.data.entities[entity].position;
      lastUpdatedTiles = this.data.entities[entity].lastUpdatedTiles

      if ( xy && !isNaN( xy.reduce( ( a, b ) => a + b ) ) && entity ) {

        if ( lastUpdatedTiles ) {

          if ( gamemode === 1 ) {

            lastUpdatedTiles.forEach( v => { if( JSON.stringify( v ) !== JSON.stringify( xy ) ){ this.tileClear( v ) } } )

          }

          D.qSA( ".wall" ).forEach( v => v.classList.remove( "wall" ) );
          D.qSA( ".light" ).forEach( v => v.classList.remove( "light" ) );
          D.qSA( ".coin" ).forEach( v => { v.classList.remove( "coin" ); v.classList.add( "air" ) } );

          this.data.entities[entity].lastUpdatedTiles = []

        }

        currentTiles = this.entitySightRadius( entity );

        airTiles = currentTiles.filter( v => this.registry[`${ v[0] }-${ v[1] }`] !== undefined && this.registry[`${ v[0] }-${ v[1] }`].id === 0 || this.registry[`${ v[0] }-${ v[1] }`].id === 3 );
        airTiles.forEach( v => { currentAirTiles = this.registry[`${ v[0] }-${ v[1] }`].element; currentAirTiles.classList.add( "light" ) } );

        this.data.entities[entity].lastUpdatedTiles = currentTiles;
        currentTiles.forEach( v  =>  this.tileUpdateDisplay( v ) )

      }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "entitySight", [], "end", debugKey )

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

      if ( range && !isNaN( range ) && entity ) {

        for ( index = 0;index < ( ( range * 2 ) + 1 ); index++ ) {

        	entitySightRange.push( number );
        	number += 1

        }

        typeof debugKey === "undefined" ? false : this.debugRegister( "entitySightRange", [], "end", debugKey );

        return entitySightRange

      }

    }

  }

  entitySightRadius( entity ) {

    let debugKey,
    p = this.data.playerRules,
    range,
    xy,
    x,
    y,
    entitySightRange,
    index,
    Index,
    X,
    Y,
    f,
    entitySightRadius = [],
    grid = this.data.map.grid,
    n1,
    n2;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entitySightRadius", [entity], "start", debugKey )

    }

    if ( entity && typeof this.data.entities[entity] !== "undefined" ) {

      range = this.data.entities[entity].vision.range;
      xy = this.data.entities[entity].position;
      x = xy[0];
      y = xy[1];

      if ( range && !isNaN( range ) && entity ) {

        entitySightRange = this.entitySightRange( entity );

        for ( index = 0;index < entitySightRange.length; index++ ) {

        	for ( Index = 0;Index < entitySightRange.length; Index++ ) {

        	  X = Index; Y = index; f = true;
        	  f = X === 0 && Y === 0 || X === ( range * 2 ) && Y === 0 || X === 0 && Y === ( range * 2 ) || X === ( range * 2 ) && Y === ( range * 2 ) || X === range && Y === range ? false : true;
        	  
        	  if ( f ) {

        	  	n1 = ( x + entitySightRange[Index] ) >= 0 && ( x + entitySightRange[Index] ) < grid[0] ? ( x + entitySightRange[Index] ) : false;
        	  	n2 = ( y + entitySightRange[index] ) >= 0 && ( y + entitySightRange[index] ) < grid[1] ? ( y + entitySightRange[index] ) : false;

        	    if ( typeof n1 === "number" && typeof n2 === "number" ) { entitySightRadius.push( [n1, n2] ) }

        	  }

  		    }

        }

        typeof debugKey === "undefined" ? false : this.debugRegister( "entitySightRadius", [], "end", debugKey );

        return entitySightRadius

      }

    }

  }

  entityMove( entity, element ) { 

    let debugKey,
    p = this.data.playerRules,
    moveDistance = p.moveDistance,
    tileX = element.dataset.x,
    tileY = element.dataset.y,
    newX,
    newY,
    oldX,
    oldY,
    typeId,
    oldXY,
    newXY;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "entityMove", [entity, element], "start", debugKey )

    }

    if ( entity && typeof this.data.entities[entity] !== "undefined" && moveDistance && element && element instanceof HTMLElement && this.registry[`${ tileX }-${ tileY }`].id !== 1 ) {

      newX = tileX;
      newY = tileY;
      oldX = this.data.entities[entity].position[0];
      oldY = this.data.entities[entity].position[1];

      if ( Math.abs( newX - oldX ) <= moveDistance && Math.abs( newY - oldY ) <= moveDistance && Math.abs( newX - oldX ) + Math.abs( newY - oldY ) <= moveDistance ) {

        typeId = `${ oldX }-${ oldY }` === this.data.map.door.join( "-" ) ? 3 : 0;

        this.data.playerRules.lastPlayerMoveDirection = Math.abs( newX - oldX ) === 1 ? "x" : "y";
        this.data.entities[entity].position = [Number( newX ), Number( newY )];

        oldXY = [oldX, oldY];
        newXY = [newX, newY];

        this.registerTile( oldXY, typeId );
        this.tileUpdateDisplay( oldXY );
        this.tileEvents( newXY, entity );
        this.registerTile( newXY, 4 );
        this.tileUpdateDisplay( newXY );
        this.entitySight( entity )

      }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "entityMove", [], "end", debugKey )

  }

  tileEvents( xy, entity ) {

    let M = T.Math,
    debugKey,
    typeId,
    range,
    tokensPerRangeLoss = this.data.playerRules.vision.tokensPerRangeLoss,
    tokens,
    trueCoinsTokenRewards = this.data.map.coins.true.tokenRewards,
    falseCoinsTokenRewards = this.data.map.coins.false.tokenRewards,
    trueCoinsRandomRewards = trueCoinsTokenRewards.random,
    falseCoinsRandomRewards = falseCoinsTokenRewards.random,
    feTurbulence,
    feDisplacementMap,
    baseFrequency,
    scale;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "tileEvents", [xy, entity], "start", debugKey )

    }

    if ( entity && typeof this.data.entities[entity] !== "undefined" ) {

      range = this.data.entities[entity].vision.range;
      tokens = this.data.entities[entity].vision.tokens;

      if ( xy && Array.isArray(xy) && xy.length === 2) {

        typeId = this.registry[xy.join( "-" )].id;

        switch ( typeId ) {

          case 2: 
            this.data.playerRules.coins.true += 1;
            this.data.playerRules.madness.quantity = this.data.playerRules.madness.quantity > 0 ? this.data.playerRules.madness.quantity * this.data.map.madness.coins.true.madnessMultiplier : 0;
            this.data.entities[entity].vision.tokens = tokens + trueCoinsTokenRewards.base + M.R( trueCoinsRandomRewards.added[0], trueCoinsRandomRewards.added[1] ) - M.R( trueCoinsRandomRewards.removed[0], trueCoinsRandomRewards.removed[1] );
          break;

          case 3:
            this.data.map.coins.true.quantity - this.data.playerRules.coins.true === 0 ? alert( "you won" ) : alert( `you found ${ this.data.playerRules.coins.true } coins of ${ this.data.map.coins.true.quantity }` );
          break;

          case 5:
            this.data.playerRules.coins.false += 1;
            this.data.playerRules.madness.quantity = this.data.playerRules.madness.quantity > 0 ? this.data.playerRules.madness.quantity * this.data.map.madness.coins.false.madnessMultiplier : 0;
            this.data.entities[entity].vision.tokens = tokens + falseCoinsTokenRewards.base + M.R( falseCoinsRandomRewards.added[0], falseCoinsRandomRewards.added[1] ) - M.R( falseCoinsRandomRewards.removed[0], falseCoinsRandomRewards.removed[1] );
          break

        }
         
        this.data.entities[entity].madness.minRangeMoves += this.data.entities[entity].vision.range === this.data.playerRules.vision.minRange ? 1 : 0;

        this.data.playerRules.madness.quantity += this.data.entities[entity].vision.range > this.data.playerRules.vision.minRange ? this.data.map.madness.loss : this.data.map.madness.gain;

        this.data.playerRules.madness.quantity = this.data.playerRules.madness.quantity < 0 ? 0 : this.data.playerRules.madness.quantity;
        this.data.playerRules.madness.quantity = this.data.playerRules.madness.quantity > this.data.map.madness.cap ? this.data.map.madness.cap : this.data.playerRules.madness.quantity;

        this.data.playerRules.madness.quantity = this.data.entities[entity].madness.minRangeMoves === this.data.map.madness.minRangeMovesBeforeDistortion ? 0 : this.data.playerRules.madness.quantity;
        this.data.playerRules.madness.quantity = Number( this.data.playerRules.madness.quantity.toFixed( 3 ) ) === this.data.map.madness.cap ? this.data.map.madness.cap - ( this.data.map.madness.gain * this.data.map.madness.distortionLoop ) : this.data.playerRules.madness.quantity;

        if ( this.data.entities[entity].madness.minRangeMoves >= this.data.map.madness.minRangeMovesBeforeDistortion && this.data.playerRules.madness.quantity > 0 ) {

          this.data.map.element.classList.add( "madness" );
          feTurbulence = document.querySelector( "feTurbulence" );feDisplacementMap = document.querySelector( "feDisplacementMap" );
          baseFrequency = `${ this.data.playerRules.lastPlayerMoveDirection === "x" ? this.data.map.madness.playerDirectionDistortion : this.data.playerRules.madness.quantity } ${ this.data.playerRules.lastPlayerMoveDirection === "y" ? this.data.map.madness.playerDirectionDistortion : this.data.playerRules.madness.quantity }`;
          scale = Math.ceil( Number( this.data.playerRules.madness.quantity.toFixed( 2 ) ) * Math.ceil( this.data.map.madness.distortionScaleMultiplier * 100 ) );
          feTurbulence.setAttribute( "baseFrequency", baseFrequency );
          feDisplacementMap.setAttribute( "scale", scale )

        }

        if ( this.data.entities[entity].vision.range > this.data.playerRules.vision.minRange && this.data.playerRules.madness.quantity === 0 ) {

          this.data.entities[entity].madness.minRangeMoves = 0;
          this.data.map.element.classList.remove( "madness" )

        }

        this.data.entities[entity].vision.tokens = this.data.entities[entity].vision.tokens < ( this.data.playerRules.vision.tokensPerRangeLoss * this.data.playerRules.vision.maxRange ) ? this.data.entities[entity].vision.tokens : ( this.data.playerRules.vision.tokensPerRangeLoss * this.data.playerRules.vision.maxRange );
        this.data.entities[entity].vision.tokens = this.data.entities[entity].vision.tokens < ( ( ( this.data.playerRules.vision.minRange - 1 ) * this.data.playerRules.vision.tokensPerRangeLoss ) + 1 ) ? ( ( this.data.playerRules.vision.minRange - 1 ) * ( this.data.playerRules.vision.tokensPerRangeLoss ) + 1 ) : this.data.entities[entity].vision.tokens;
        this.data.entities[entity].vision.tokens -= this.data.entities[entity].vision.tokens !== ( ( ( this.data.playerRules.vision.minRange - 1 ) * this.data.playerRules.vision.tokensPerRangeLoss ) + 1 ) ? 1 : 0;
        this.data.entities[entity].vision.range = Math.ceil( this.data.entities[entity].vision.tokens / this.data.playerRules.vision.tokensPerRangeLoss ) >= this.data.playerRules.vision.minRange ? Math.ceil( this.data.entities[entity].vision.tokens / this.data.playerRules.vision.tokensPerRangeLoss ) : this.data.playerRules.vision.minRange;

        typeof debugKey === "undefined" ? false : this.debugRegister( "tileEvents", [], "end", debugKey )

      }

    }

  }

}
