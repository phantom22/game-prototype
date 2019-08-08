const T = TOOL;

class gameInstance { 

  constructor( player = { position, moveDistance, vision, gamemode }, map = { grid, meta, coins, madness }, debug = { state, maxRegistryLength } ) { 

    let p = player,
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

      p.position = typeof p.position === "boolean" || typeof p.position !== "undefined" && Array.isArray( p.position ) && typeof p.position.reduce( ( a, b )  =>  a + b ) === "number" && p.position.length === 2 ? p.position : true;
      p.moveDistance = typeof p.moveDistance === "number" && p.moveDistance > 0 ? Math.floor( p.moveDistance ) : 1;
      p.gamemode = typeof p.gamemode === "number" && p.gamemode > 0 ? Math.floor( p.gamemode ) : 0;
      vision.initialRange =  typeof p.vision !== "undefined" && typeof vision.initialRange === "number" && vision.initialRange > 0 ? Math.floor( vision.initialRange ) : 5;
      vision.range = vision.initialRange;
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

      trueCoinsTokenRewards.base = typeof trueCoinsTokenRewards.base === "string" ? this.stringReward( trueCoinsTokenRewards.base, vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.base;
      trueCoinsTokenRewards.random.added[0] = typeof trueCoinsTokenRewards.random.added[0] === "string" ? this.stringReward( trueCoinsTokenRewards.random.added[0], vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.random.added[0];
      trueCoinsTokenRewards.random.added[1] = typeof trueCoinsTokenRewards.random.added[1] === "string" ? this.stringReward( trueCoinsTokenRewards.random.added[1], vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.random.added[1];
      trueCoinsTokenRewards.random.removed[0] = typeof trueCoinsTokenRewards.random.removed[0] === "string" ? this.stringReward( trueCoinsTokenRewards.random.removed[0], vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.random.removed[0];
      trueCoinsTokenRewards.random.removed[1] = typeof trueCoinsTokenRewards.random.removed[1] === "string" ? this.stringReward( trueCoinsTokenRewards.random.removed[1], vision.tokensPerRangeLoss ) : trueCoinsTokenRewards.random.removed[1];
      falseCoinsTokenRewards.base = typeof falseCoinsTokenRewards.base === "string" ? this.stringReward( falseCoinsTokenRewards.base, vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.base;
      falseCoinsTokenRewards.random.added[0] = typeof falseCoinsTokenRewards.random.added[0] === "string" ? this.stringReward( falseCoinsTokenRewards.random.added[0], vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.random.added[0];
      falseCoinsTokenRewards.random.added[1] = typeof falseCoinsTokenRewards.random.added[1] === "string" ? this.stringReward( falseCoinsTokenRewards.random.added[1], vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.random.added[1];
      falseCoinsTokenRewards.random.removed[0] = typeof falseCoinsTokenRewards.random.removed[0] === "string" ? this.stringReward( falseCoinsTokenRewards.random.removed[0], vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.random.removed[0];
      falseCoinsTokenRewards.random.removed[1] = typeof falseCoinsTokenRewards.random.removed[1] === "string" ? this.stringReward( falseCoinsTokenRewards.random.removed[1], vision.tokensPerRangeLoss ) : falseCoinsTokenRewards.random.removed[1]

    }

    if ( typeof map.grid !== "undefined" && typeof map.meta !== "undefined" && p.gamemode !== 3 || typeof map.grid !== "undefined" && typeof map.meta !== "undefined" && p.gamemode === 3 ) {

      this.data = { map: map, player: p };
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

        registerIndex = this.debug.registry.map( v => v.key == debugKey ).indexOf( true );keyIndex = this.debug.keys.indexOf( debugKey );

        this.debug.registry[registerIndex].states[state] = new Date().toISOString();
        delete this.debug.registry[registerIndex].key;

        this.debug.keys.splice( keyIndex, this.debug.keys.length === 1 ? 1 : keyIndex )

      }

    }

  }

  stringReward( string, tokensPerRangeLoss ) {

    let debugKey,
    array;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "stringReward", [string, tokensPerRangeLoss], "start", debugKey )

    }

    if ( string && tokensPerRangeLoss && !isNaN( tokensPerRangeLoss ) ) {

      array = string.split(" ");

      array[0] = array[0].includes("*") && array[0].slice( 0, 1 ) === "*" ? Math.floor( tokensPerRangeLoss * Number( array[0].slice( 1 ) ) ) : array[0];
      array[1] = array[1] && array[1].slice( 0, 1 ) === "+" || array[1] && array[1].slice( 0, 1 ) === "-" ? ( array[0] + Number( array[1] ) ) : void 0;

      typeof debugKey === "undefined" ? false : this.debugRegister( "stringReward", [], "end", debugKey );

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
    p = this.data.player,
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

      if ( typeof p.position !== "boolean" && Array.isArray( p.position ) && !isNaN( p.position.reduce( ( a, b ) => a + b ) ) ) {

        xy = p.position;
        this.registerTile( xy, 4 )

      }

      else if ( p.position === true ) {

        registryKeys = Object.keys( this.registry ); bannedTilesFromRandomizing = this.data.map.bannedTilesFromRandomizing.map( v => `${ v[0] }-${ v[1] }` );
        airTiles = registryKeys.filter( v => this.registry[v].id === 0 && !bannedTilesFromRandomizing.includes( v ) );number = M.R( airTiles.length );xy = airTiles[number].split( "-" ).map( v => Number( v ) );
        this.data.player.position = xy;
        this.registerTile( xy, 4 )

      }

      if ( !flag ) {

        this.data.player.hud = { inventory: { slots: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }, selectedSlot: 0 } };
        this.registerCoins();
        this.registerDoor()

      }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "registerMap", [], "end", debugKey );

  }

  updateSelectedSlot( id ) {

    let D = T.DOM,
    debugKey,
    selected = D.qSA( ".selected" );

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "updateSelectedSlot", [id], "start", debugKey )

    }

    selected ? selected.forEach( v => v.classList.remove( "selected" ) ) : selected;
    this.data.player.hud.inventory.selectedSlot = id && !isNaN( id ) || id === 0 ? id : this.data.player.hud.inventory.selectedSlot;
    this.data.player.hud.inventory.selectedSlot = id && this.data.player.hud.inventory.selectedSlot < ( Object.keys( this.data.player.hud.inventory.slots ).length - 1 ) ? this.data.player.hud.inventory.selectedSlot : ( Object.keys( this.data.player.hud.inventory.slots ).length - 1 );
    this.data.player.hud.inventory.selectedSlot = id && this.data.player.hud.inventory.selectedSlot > 0 ? this.data.player.hud.inventory.selectedSlot : 0;
    D.qSA( ".hud td" )[this.data.player.hud.inventory.selectedSlot].classList.add( "selected" );

    typeof debugKey === "undefined" ? false : this.debugRegister( "updateSelectedSlot", [], "end", debugKey )

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
    p = this.data.player,
    xy = p.position,
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

        this.playerSight();this.tileUpdateDisplay( xy );
        this.data.player.coins = { true: 0, false: 0 };
        this.data.player.madness = { quantity: 0, minRangeMoves: 0 };
        this.data.player.vision.tokens = p.vision.range * p.vision.tokensPerRangeLoss;
        
        slots = Number( Object.keys( this.data.player.hud.inventory.slots ).length ); div = D.cE( "div" );div.className = "hud"; tbl = D.cE( "table" ); tbd = D.cE( "tbody" );
        for ( index = 0;index < slots; index++ ) { tr = D.cE( "tr" ); td = D.cE( "td" ); td.dataset.id = index; D.aC( td, tr ); D.aC( tr, tbd ) }
        D.aC( tbd, tbl ); D.aC( tbl, div ); D.aC( div );

        this.updateSelectedSlot()

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

  playerSight() { 

    let D = T.DOM,
    debugKey,
    p = this.data.player,
    xy = p.position,
    lastUpdatedTiles = p.vision.lastUpdatedTiles,
    gamemode = p.gamemode,
    currentTiles,
    airTiles;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "playerSight", [], "start", debugKey )

    }

    if ( !isNaN( xy.reduce( ( a, b ) => a + b ) ) ) {

      if ( lastUpdatedTiles ) {

        if ( gamemode === 1 ) {

          lastUpdatedTiles.forEach( v => { if( JSON.stringify( v ) !== JSON.stringify( xy ) ){ this.tileClear( v ) } } )

        }

        D.qSA( ".wall" ).forEach( v => v.classList.remove( "wall" ) );
        D.qSA( ".light" ).forEach( v => v.classList.remove( "light" ) );
        D.qSA( ".coin" ).forEach( v => { v.classList.remove( "coin" ); v.classList.add( "air" ) } );

        this.data.player.vision.lastUpdatedTiles = []

      }

      currentTiles = this.sightRadius();

      airTiles = currentTiles.filter( v => this.registry[`${ v[0] }-${ v[1] }`] !== undefined && this.registry[`${ v[0] }-${ v[1] }`].id === 0 || this.registry[`${ v[0] }-${ v[1] }`].id === 3 );
      airTiles.forEach( v => { let c=this.registry[`${ v[0] }-${ v[1] }`].element;c.classList.add( "light" ) } );

      this.data.player.vision.lastUpdatedTiles = currentTiles;
      currentTiles.forEach( v  =>  this.tileUpdateDisplay( v ) )

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "playerSight", [], "end", debugKey )

  }

  sightRange() {

    let debugKey,
    range = this.data.player.vision.range,
    index,
    number = ( -range ),
    sightRange = [];

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "sightRange", [], "start", debugKey )

    }

    if ( range && !isNaN( range ) ) {

      for ( index = 0;index < ( ( range * 2 ) + 1 ); index++ ) {

      	sightRange.push( number );
      	number += 1

      }

      typeof debugKey === "undefined" ? false : this.debugRegister( "sightRange", [], "end", debugKey );

      return sightRange

    }

  }

  sightRadius() {

    let debugKey,
    p = this.data.player,
    range = this.data.player.vision.range,
    xy = p.position,
    x = xy[0],
    y = xy[1],
    sightRange,
    index,
    Index,
    X,
    Y,
    f,
    sightRadius = [],
    grid = this.data.map.grid,
    n1,
    n2;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "sightRadius", [], "start", debugKey )

    }

    if ( range && !isNaN( range ) ) {

      sightRange = this.sightRange();

      for ( index = 0;index < sightRange.length; index++ ) {

      	for ( Index = 0;Index < sightRange.length; Index++ ) {

      	  X = Index;Y = index;f = true;
      	  f = X === 0 && Y === 0 || X === ( range * 2 ) && Y === 0 || X === 0 && Y === ( range * 2 ) || X === ( range * 2 ) && Y === ( range * 2 ) || X === range && Y === range ? false : true;
      	  
      	  if ( f ) {

      	  	n1 = ( x + sightRange[Index] ) >= 0 && ( x + sightRange[Index] ) < grid[0] ? ( x + sightRange[Index] ) : false;
      	  	n2 = ( y + sightRange[index] ) >= 0 && ( y + sightRange[index] ) < grid[1] ? ( y + sightRange[index] ) : false;

      	    if ( typeof n1 === "number" && typeof n2 === "number" ) { sightRadius.push( [n1, n2] ) }

      	  }

		}

      }

      typeof debugKey === "undefined" ? false : this.debugRegister( "sightRadius", [], "end", debugKey );

      return sightRadius

    }

  }

  playerMove( e ) { 

    let debugKey,
    p = this.data.player,
    moveDistance = p.moveDistance,
    tileX = e.dataset.x,
    tileY = e.dataset.y,
    newX,
    newY,
    oldX,
    oldY,
    typeId,
    oldXY,
    newXY;

    if ( typeof this.debug !== "undefined" && this.debug.state ) {

      debugKey = this.debugKeyGen();
      this.debugRegister( "playerMove", [e], "start", debugKey )

    }

    if ( moveDistance && e && e instanceof HTMLElement && this.registry[`${ tileX }-${ tileY }`].id !== 1 ) {

      newX = tileX;newY = tileY;oldX = p.position[0];oldY = p.position[1];

      if ( Math.abs( newX - oldX ) <= moveDistance && Math.abs( newY - oldY ) <= moveDistance && Math.abs( newX - oldX ) + Math.abs( newY - oldY ) <= moveDistance ) {

        typeId = `${ oldX }-${ oldY }` === this.data.map.door.join( "-" ) ? 3 : 0;

        this.data.player.direction = Math.abs( newX - oldX ) === 1 ? "x" : "y";
        this.data.player.position = [Number( newX ), Number( newY )];

        oldXY = [oldX, oldY];
        newXY = [newX, newY];

        this.registerTile( oldXY, typeId );
        this.tileUpdateDisplay( oldXY );
        this.tileEvents( newXY );
        this.registerTile( newXY, 4 );
        this.tileUpdateDisplay( newXY );
        this.playerSight()

      }

    }

    typeof debugKey === "undefined" ? false : this.debugRegister( "playerMove", [], "end", debugKey )

  }

  tileEvents( xy ) { 

    let M = T.Math,
    debugKey,
    typeId = this.registry[xy.join( "-" )].id,
    range = this.data.player.vision.range,
    tokensPerRangeLoss = this.data.player.vision.tokensPerRangeLoss,
    tokens = this.data.player.vision.tokens,
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
      this.debugRegister( "tileEvents", [xy], "start", debugKey )

    }

    switch ( typeId ) { 

      case 2: 
        this.data.player.coins.true += 1;
        this.data.player.madness.quantity = this.data.player.madness.quantity > 0 ? this.data.player.madness.quantity * this.data.map.madness.coins.true.madnessMultiplier : 0;
        this.data.player.vision.tokens = tokens + trueCoinsTokenRewards.base + M.R( trueCoinsRandomRewards.added[0], trueCoinsRandomRewards.added[1] ) - M.R( trueCoinsRandomRewards.removed[0], trueCoinsRandomRewards.removed[1] );
      break;

      case 3:
        this.data.map.coins.true.quantity - this.data.player.coins.true === 0 ? alert( "you won" ) : alert( `you found ${ this.data.player.coins.true } coins of ${ this.data.map.coins.true.quantity }` );
      break;

      case 5:
        this.data.player.coins.false += 1;
        this.data.player.madness.quantity = this.data.player.madness.quantity > 0 ? this.data.player.madness.quantity * this.data.map.madness.coins.false.madnessMultiplier : 0;
        this.data.player.vision.tokens = tokens + falseCoinsTokenRewards.base + M.R( falseCoinsRandomRewards.added[0], falseCoinsRandomRewards.added[1] ) - M.R( falseCoinsRandomRewards.removed[0], falseCoinsRandomRewards.removed[1] );
      break

    }
     
    this.data.player.madness.minRangeMoves += this.data.player.vision.range === this.data.player.vision.minRange ? 1 : 0;

    this.data.player.madness.quantity += this.data.player.vision.range > this.data.player.vision.minRange ? this.data.map.madness.loss : this.data.map.madness.gain;

    this.data.player.madness.quantity = this.data.player.madness.quantity < 0 ? 0 : this.data.player.madness.quantity;
    this.data.player.madness.quantity = this.data.player.madness.quantity > this.data.map.madness.cap ? this.data.map.madness.cap : this.data.player.madness.quantity;

    this.data.player.madness.quantity = this.data.player.madness.minRangeMoves === this.data.map.madness.minRangeMovesBeforeDistortion ? 0 : this.data.player.madness.quantity;
    this.data.player.madness.quantity = Number( this.data.player.madness.quantity.toFixed( 3 ) ) === this.data.map.madness.cap ? this.data.map.madness.cap - ( this.data.map.madness.gain * this.data.map.madness.distortionLoop ) : this.data.player.madness.quantity;

    if ( this.data.player.madness.minRangeMoves >= this.data.map.madness.minRangeMovesBeforeDistortion && this.data.player.madness.quantity > 0 ) {

      this.data.map.element.classList.add( "madness" );
      feTurbulence = document.querySelector( "feTurbulence" );feDisplacementMap = document.querySelector( "feDisplacementMap" );
      baseFrequency = `${ this.data.player.direction === "x" ? this.data.map.madness.playerDirectionDistortion : this.data.player.madness.quantity } ${ this.data.player.direction === "y" ? this.data.map.madness.playerDirectionDistortion : this.data.player.madness.quantity }`;
      scale = Math.ceil( Number( this.data.player.madness.quantity.toFixed( 2 ) ) * Math.ceil( this.data.map.madness.distortionScaleMultiplier * 100 ) );
      feTurbulence.setAttribute( "baseFrequency", baseFrequency );
      feDisplacementMap.setAttribute( "scale", scale )

    }

    if ( this.data.player.vision.range > this.data.player.vision.minRange && this.data.player.madness.quantity === 0 ) {

      this.data.player.madness.minRangeMoves = 0;
      this.data.map.element.classList.remove( "madness" )

    }

    this.data.player.vision.tokens = this.data.player.vision.tokens < ( this.data.player.vision.tokensPerRangeLoss * this.data.player.vision.maxRange ) ? this.data.player.vision.tokens : ( this.data.player.vision.tokensPerRangeLoss * this.data.player.vision.maxRange );
    this.data.player.vision.tokens = this.data.player.vision.tokens < ( ( ( this.data.player.vision.minRange - 1 ) * this.data.player.vision.tokensPerRangeLoss ) + 1 ) ? ( ( this.data.player.vision.minRange - 1 ) * ( this.data.player.vision.tokensPerRangeLoss ) + 1 ) : this.data.player.vision.tokens;
    this.data.player.vision.tokens -= this.data.player.vision.tokens !== ( ( ( this.data.player.vision.minRange - 1 ) * this.data.player.vision.tokensPerRangeLoss ) + 1 ) ? 1 : 0;
    this.data.player.vision.range = Math.ceil( this.data.player.vision.tokens / this.data.player.vision.tokensPerRangeLoss ) >= this.data.player.vision.minRange ? Math.ceil( this.data.player.vision.tokens / this.data.player.vision.tokensPerRangeLoss ) : this.data.player.vision.minRange;

    typeof debugKey === "undefined" ? false : this.debugRegister( "tileEvents", [], "end", debugKey )

  }

}
