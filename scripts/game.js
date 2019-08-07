const T = TOOL;

class gameInstance {

  constructor(player = {position,moves,vision,gamemode}, map = {grid,meta,coins,madness}, debug) {

    let p = player; let vision = typeof p.vision !== "undefined" ? p.vision : undefined; let m = map; let coins = m.coins; let madness = typeof m.madness !== "undefined" ? m.madness : undefined; let mCoins = typeof m.madness !== "undefined" ? madness.coins : undefined; let flag = p.gamemode === 3 ? true : false;

    m.grid = typeof m.grid !== "undefined" && Array.isArray(m.grid) && typeof m.grid.reduce((a,b) => a+b) === "number" && m.grid.length === 2 ? m.grid : undefined; 
    m.meta = typeof m.meta === "string" && m.meta.split("").length === m.grid[0] * m.grid[1] ? m.meta.split("").map(v=>Number(v)) : undefined;

    if (!flag) {

      p.position = typeof p.position === "boolean" || typeof p.position !== "undefined" && Array.isArray(p.position) && typeof p.position.reduce((a,b) => a+b) === "number" && p.position.length === 2 ? p.position : true; 
      p.moves = typeof p.moves === "number" && p.moves > 0 ? Math.floor(p.moves) : 1; 
      p.gamemode = typeof p.gamemode === "number" && p.gamemode > 0 ? Math.floor(p.gamemode) : 0; 
      vision.initialRange =  typeof p.vision !== "undefined" && typeof vision.initialRange === "number" && vision.initialRange > 0 ? Math.floor(vision.initialRange) : 5; 
      vision.range = vision.initialRange;
      vision.tokensPerRangeLoss = typeof vision.tokensPerRangeLoss === "number" && vision.tokensPerRangeLoss > 0 ? Math.floor(vision.tokensPerRangeLoss) : 7; 
      vision.minRange = typeof vision.minRange === "number" && vision.minRange >= 1 && vision.minRange <= vision.maxRange ? Math.floor(vision.minRange) : 2; 
      vision.maxRange = typeof vision.maxRange === "number" && vision.maxRange >= 1 && vision.maxRange >= vision.minRange ? Math.floor(vision.maxRange) : initialRange + 2;
        
      coins.true.quantity = typeof coins.true.quantity === "number" & coins.true.quantity >= 1 ? Math.floor(coins.true.quantity) : 10;
      coins.false.quantity = typeof coins.false.quantity === "number" && coins.false.quantity >= 0 ? Math.floor(coins.false.quantity) : 10;
      coins.true.tokenRewards.base = typeof coins.true.tokenRewards.base === "number" || typeof coins.true.tokenRewards.base === "string" ? coins.true.tokenRewards.base : "*1.8";
      coins.false.tokenRewards.base = typeof coins.false.tokenRewards.base === "number" || typeof coins.false.tokenRewards.base === "string" ? coins.false.tokenRewards.base : "*1.2";
      coins.true.tokenRewards.random.added = Array.isArray(coins.true.tokenRewards.random.added) && coins.true.tokenRewards.random.added.length === 2 ? coins.true.tokenRewards.random.added : [4,"*1.3"];
      coins.false.tokenRewards.random.added = Array.isArray(coins.false.tokenRewards.random.added) && coins.false.tokenRewards.random.added.length === 2 ? coins.false.tokenRewards.random.added : [0,"*0.7"];
      coins.true.tokenRewards.random.removed = Array.isArray(coins.true.tokenRewards.random.removed) && coins.true.tokenRewards.random.removed.length === 2 ? coins.true.tokenRewards.random.removed : [3,"*0.8"];
      coins.false.tokenRewards.random.removed = Array.isArray(coins.false.tokenRewards.random.removed) && coins.false.tokenRewards.random.removed.length === 2 ? coins.false.tokenRewards.random.removed : [0, "*0.3"];

      madness.distortionScaleMultiplier = typeof madness.distortionScaleMultiplier === "number" && madness.distortionScaleMultiplier >= 0 ? madness.distortionScaleMultiplier : 1;
      madness.playerDirectionDistortion = typeof madness.playerDirectionDistortion === "number" && madness.playerDirectionDistortion >= 0 && madness.playerDirectionDistortion <= 1 ? madness.playerDirectionDistortion : 0.05;
      madness.distortionLoop = typeof madness.distortionLoop === "number" && madness.distortionLoop >= 0 ? Math.floor(madness.distortionLoop) : 15;
      madness.cap = typeof madness.cap === "number" && madness.cap > 0 && madness.cap <= 1 ? madness.cap : 0.25;
      madness.minRangeMovesBeforeDistortion = typeof madness.minRangeMovesBeforeDistortion === "number" && madness.minRangeMovesBeforeDistortion >= 0 ? Math.floor(madness.minRangeMovesBeforeDistortion) : 10;
      madness.loss = typeof madness.loss === "number" && Math.sign(madness.loss) === -1 && Math.abs(madness.loss) > 0 && Math.abs(madness.loss) <= 1 ? madness.loss : -0.025;
      madness.gain = typeof madness.gain === "number" && madness.gain > 0 && madness.gain <= 1 ? madness.gain : 0.005;
      mCoins.true.madnessMultiplier = typeof mCoins.true.madnessMultiplier === "number" && mCoins.true.madnessMultiplier >= 0 && mCoins.true.madnessMultiplier < 1 ? mCoins.true.madnessMultiplier : 0.4;
      mCoins.false.madnessMultiplier = typeof mCoins.false.madnessMultiplier === "number" && mCoins.false.madnessMultiplier >= mCoins.true.madnessMultiplier && mCoins.false.madnessMultiplier >= 0 && mCoins.false.madnessMultiplier < 1 ? mCoins.false.madnessMultiplier : 0.6;
      m.bannedTilesFromRandomizing = Array.isArray(m.bannedTilesFromRandomizing) ? m.bannedTilesFromRandomizing.filter(v=>v.length===2) : [];

      coins = p.gamemode === 3 ? undefined : coins;

      let tR = typeof coins !== "undefined" ? coins.true.tokenRewards : undefined; let fR = typeof coins !== "undefined" ? coins.false.tokenRewards : undefined; let l = vision.tokensPerRangeLoss;

      tR.base = typeof tR.base == "string" ? this.stringReward(tR.base,l) : tR.base;
      tR.random.added[0] = typeof tR.random.added[0] == "string" ? this.stringReward(tR.random.added[0],l) : tR.random.added[0];
      tR.random.added[1] = typeof tR.random.added[1] == "string" ? this.stringReward(tR.random.added[1],l) : tR.random.added[1];
      tR.random.removed[0] = typeof tR.random.removed[0] == "string" ? this.stringReward(tR.random.removed[0],l) : tR.random.removed[0];
      tR.random.removed[1] = typeof tR.random.removed[1] == "string" ? this.stringReward(tR.random.removed[1],l) : tR.random.removed[1];
      fR.base = typeof fR.base == "string" ? this.stringReward(fR.base,l) : fR.base;
      fR.random.added[0] = typeof fR.random.added[0] == "string" ? this.stringReward(fR.random.added[0],l) : fR.random.added[0];
      fR.random.added[1] = typeof fR.random.added[1] == "string" ? this.stringReward(fR.random.added[1],l) : fR.random.added[1];
      fR.random.removed[0] = typeof fR.random.removed[0] == "string" ? this.stringReward(fR.random.removed[0],l) : fR.random.removed[0];
      fR.random.removed[1] = typeof fR.random.removed[1] == "string" ? this.stringReward(fR.random.removed[1],l) : fR.random.removed[1];

    }

    if (debug) {this.debug = {state:true,registry:[],keys:[]}}

    // if all these variables are defined or if the gamemode == 3 (editor) and map.grid and map.meta is defined
    if (typeof m.grid !== "undefined" && typeof m.meta !== "undefined" && p.gamemode !== 3 || typeof m.grid !== "undefined" && typeof m.meta !== "undefined" && p.gamemode === 3) {

      // updating data
      this.data = {map:m,player:p};
      // adding a register
      this.registry = {};
      // creating a the game element (table)
      this.createMap();
      // updating register, based on the map.meta which contains all the tile ids
      this.registerMap(flag);
      // appending the map and the hud to the page, randomizing player position and coins position
      this.mapRender(flag);

    }

  }

  debugKeyGen(){

    let M = T.Math;

    let n = M.R(1000000,10000000);
    while (this.debug.keys.includes(n)) {n = M.R(1000000,10000000)}
    this.debug.keys.push(n);

    return n;

  }

  debugRegister(string,args,state,debugKey) {

    let supportedStates = ["start","end"]; let maxRegisterLength = 10000;

    if (string && args && Array.isArray(args) && state && supportedStates.includes(state) && debugKey && !isNaN(debugKey)) {

      if (this.debug.registry.length > maxRegisterLength) {

          this.debug.registry.shift();

      }

      if (state == "start") {

        this.debug.registry.push({function:string,args:args,states:{[state]:new Date().toISOString()},key:debugKey});

      }

      else if (state == "end") {

          let registerIndex = this.debug.registry.map(v=>v.key==debugKey).indexOf(true); let keyIndex = this.debug.keys.indexOf(debugKey);

        this.debug.registry[registerIndex].states[state] = new Date().toISOString();
        delete this.debug.registry[registerIndex].key;

        this.debug.keys.splice(keyIndex, this.debug.keys.length == 1 ? 1 : keyIndex);

      }

    }

  }

  stringReward(string,tokensPerRangeLoss) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("stringReward",[string,tokensPerRangeLoss],"start",debugKey);
    }

    // if the string and the tokensPerRangeLoss are defined
    if (string && tokensPerRangeLoss && !isNaN(tokensPerRangeLoss)) {

      // splitting the string that always contain a space
      let a = string.split(" ");
      // a[0] is the one that contains the * which means that the number next to the asterisc is multiplied by the tokensPerRangeLoss number if not, it remains the same
      a[0] = a[0].includes("*") && a[0].slice(0,1) == "*" ? Math.floor(tokensPerRangeLoss * Number(a[0].slice(1))) : a[0];
      // a[1] is the one that contains at the start (slice(0,1)) the "+"" or the "-" and if so it's added to the a[0] number
      a[1] = a[1] && a[1].slice(0,1) == "+" || a[1] && a[1].slice(0,1) == "-" ? a[0] + Number(a[1]) : undefined;

      typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("stringReward",[],"end",debugKey);

      // if a[1] is defined then the function returns it, if not it's returned the a[0] number
      return !a[1] ? a[0] : a[1];

    }

  }

  tileClass(typeId) {
    
    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("tileClass",[typeId],"start",debugKey);
    }

    // all the tile classes/types
    let tT = {0:"air",1:"wall",2:"coin",3:"door",4:"player",5:"coin"};
    // returning the tyle type string
    if (!isNaN(typeId)) {typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("tileClass",[],"end",debugKey);return String(tT[typeId])}

  }

  createMap() {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("createMap",[],"start",debugKey);
    }

    let D = T.DOM; let m = this.data.map;

    // if map.meta is defined but there isn't a map.element yet
    if (m.meta && !m.element) {

      // creating the main game table, its tr(s) and td(s) are defined by the map.grid array (resolution)
      let tbl = D.cE("table"); let tbd = D.cE("tbody");
      for (let i=0;i < m.grid[1];i++) {let r = D.cE("tr"); for (let I=0;I < m.grid[0];I++) {let c = D.cE("td"); c.dataset.x = I; c.dataset.y = i; D.aC(c,r)} D.aC(r,tbd)}
      D.aC(tbd,tbl);

      // updating the map.element with the table that was just created
      this.data.map.element = tbl;

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("createMap",[],"end",debugKey);

  }

  registerMap(flag) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("registerMap",[],"start",debugKey);
    }

    // getting the grid
    let M = T.Math; let m = this.data.map; let p = this.data.player; let g = m.grid;

    // if the map.meta (array of numbers that define every tile) and the map.element are defined
    if (m.meta && m.element instanceof HTMLElement) {

      for (let i=0;i < m.meta.length;i++) {

        // map.meta is an array of numbers therefore we dont have any coordinates related to each number, so we just get the coordinates by watching at the index of the for() loop
        let x = i; while (x >= g[0]) {x = x - g[0]}; let y = Math.floor(i / g[0]);
        // registering each coordinate with their corresponding tile id
        this.registerTile([x,y],m.meta[i]);

      }

      // if position is an array of numbers (coordinates) and it's not a boolean
      if (typeof p.position !== "boolean" && Array.isArray(p.position) && !isNaN(p.position.reduce((a,b)=>a+b))) {

        let XY = p.position;
        // registering the player.position coordinates as player
        this.registerTile(XY,4);

      }

      // if player.position == true
      else if (p.position == true) {

        // getting all the register coordinates, and mapping the bannedTilesFromRandomizing array to the register format (ex."x-y")
        let registry = Object.keys(this.registry); let b = this.data.map.bannedTilesFromRandomizing.map(v=>`${v[0]}-${v[1]}`);
        // filtering all the registry coordinates that are non-wall-tiles and are not contained in the bannedTilesFromRandomizing array, n is a random number between 0 and a.length - 1 and it's used to randomize a non-wall-tile to be registered as player
        let a = registry.filter(v=>this.registry[v].id==0&&!b.includes(v)); let n = M.R(a.length); let XY = a[n].split("-").map(v=>Number(v));
        // updating player.position with the randomized tile
        this.data.player.position = XY;
        // registering the randomized tile as player
        this.registerTile(XY,4);

      }

      // if not gamemode == 3 (editor)
      if (!flag) {

        // adding a hud to the player object
        this.data.player.hud = {inventory:{slots:{0:false,1:false,2:false,3:false,4:false,5:false,6:false},selectedSlot:0}};
        // randomizing the truecoins and falsecoins and registering their coordinates in the register
        this.registerCoins();
        // randomizing the door and registering its coordinates in the registry
        this.registerDoor();

      }

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("registerMap",[],"end",debugKey);

  }

  updateSelectedSlot(id) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("updateSelectedSlot",[id],"start",debugKey);
    }

    let D = T.DOM; let s = D.qSA(".selected");
    // if a .selected element is found, removing its .selected class
    s ? s.forEach(v=>v.classList.remove("selected")) : s;
    // if id is a number, setting the selectedSlot as the id
    this.data.player.hud.inventory.selectedSlot = id && !isNaN(id) || id == 0 ? id : this.data.player.hud.inventory.selectedSlot;
    // if selectedSlot is higher than the slots quantity then setting selectedSlot to the maximum avaiable slot
    this.data.player.hud.inventory.selectedSlot = id && this.data.player.hud.inventory.selectedSlot < Object.keys(this.data.player.hud.inventory.slots).length-1 ? this.data.player.hud.inventory.selectedSlot : Object.keys(this.data.player.hud.inventory.slots).length-1;
    // if selectedSlot is lower than the slots quantity then setting selectedSlot to the minimum avaiable slot
    this.data.player.hud.inventory.selectedSlot = id && this.data.player.hud.inventory.selectedSlot > 0 ? this.data.player.hud.inventory.selectedSlot : 0;
    // adding to the querySelector[selectedSlot] the .selected class
    D.qSA(".hud td")[this.data.player.hud.inventory.selectedSlot].classList.add("selected");

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("updateSelectedSlot",[],"end",debugKey);

  }

  registerCoins() {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("registerCoins",[],"start",debugKey);
    }

    // getting true and false coins quantity for the loop for(), mapping the bannedTilesFromRandomizing array to the register format (ex."x-y")
    let M = T.Math; let trueCoins = this.data.map.coins.true.quantity; let falseCoins = this.data.map.coins.false.quantity;  let b = this.data.map.bannedTilesFromRandomizing.map(v=>`${v[0]}-${v[1]}`);

    for (let i=0;i < (trueCoins + falseCoins);i++) {

      // filtering all the registry coordinates that are non-wall-tiles and are not contained in the bannedTilesFromRandomizing array
      let registry = Object.keys(this.registry); let a = registry.filter(v=>this.registry[v].id==0&&!b.includes(v));
      // n is a random number between 0 and a.length - 1 and it's used to randomize a non-wall-tile to be registered as truecoins or falsecoins, the id (2 = realcoins and 5 = falsecoins) is determined by the for() loop index
      let n = M.R(a.length); let id = i < trueCoins ? 2 : 5;
      // registering the randomized tile as realcoin or falsecoin
      this.registerTile(a[n].split("-"),id);

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("registerCoins",[],"end",debugKey);

  }

  registerDoor() {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("registerDoor",[],"start",debugKey);
    }

    // if there isn't a door in the register
    if (!this.data.map.door) {

      // mapping the bannedTilesFromRandomizing array to the register format (ex."x-y")
      let M = T.Math; let b = this.data.map.bannedTilesFromRandomizing.map(v=>`${v[0]}-${v[1]}`);
      // filtering all the registry coordinates that are non-wall-tiles and are not contained in the bannedTilesFromRandomizing array
      let registry = Object.keys(this.registry); let a = registry.filter(v=>this.registry[v].id==0&&!b.includes(v));
      // n is a random number between 0 and a.length - 1 and it's used to randomize a non-wall-tile to be registered as a door
      let n = M.R(a.length);
      this.data.map.door = a[n].split("-").map(v=>Number(v));
      // registering the randomized tile as a door
      this.registerTile(this.data.map.door,3);

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("registerDoor",[],"end",debugKey);

  }

  registerTile(xy,typeId) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("registerTile",[xy,typeId],"start",debugKey);
    }

    let D = T.DOM; let m = this.data.map;

    // if coordinates is an array of numbers and the id is a number
    if (xy && Array.isArray(xy) && !isNaN(typeId)) {

      // querySelector for the register based on the x and y coordinates, and searching for the element in the map.element to be sure that the tile is part of the game
      let r = `${xy[0]}-${xy[1]}`; let e = D.qSA(`[data-x="${xy[0]}"][data-y="${xy[1]}"]`,m.element); 
      // adding the element to the register, the added object contains the tiles id, class and the element itself
      this.registry[r] = {id:Number(typeId),class:this.tileClass(typeId),element:e[0]};

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("registerTile",[],"end",debugKey);

  }

  tileUpdateDisplay(xy) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("tileUpdateDisplay",[xy],"start",debugKey);
    }

    // if the coordinates is an array of numbers
    if (xy && Array.isArray(xy)) {

      // querySelector for the register based on the x and y coordinates
      let r = `${xy[0]}-${xy[1]}`;
      // checking if the element is in the register, removing all the in-game classes from the element, then updating the element with the class written in the register
      if (this.registry[r]) {let registry = this.registry[r]; this.tileClear(xy); registry.element.classList.add(registry.class)}

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("tileUpdateDisplay",[],"end",debugKey);

  }

  tileClear(xy) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("tileClear",[xy],"start",debugKey);
    }

    // if coordinates is an array of numbers
    if (xy && Array.isArray(xy)) {

      // querySelector for the register based on the x and y coordinates
      let r = `${xy[0]}-${xy[1]}`;

      // checking if the element is in the register
      if (this.registry[r]) {

        // removing all the in-game classes from the element
        let eC = this.registry[r].element.classList;

        eC.remove("air");
        eC.remove("wall");
        eC.remove("coin");
        eC.remove("door");
        eC.remove("player");

      }

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("tileClear",[],"end",debugKey);

  }

  mapRender(flag) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("mapRender",[flag],"start",debugKey);
    }

    let D = T.DOM; let m = this.data.map; let p = this.data.player;

    // if map.element is defined and it's an html element
    if (m.element && m.element instanceof HTMLElement) {

      // inserting the table after the beginning of the body tag
      document.body.insertAdjacentElement("afterbegin",m.element);

      // if the player position is an array of numbers
      if (p.position && Array.isArray(p.position) && !isNaN(p.position.reduce((a,b)=>a+b))) {

        // getting the player position, creating the light radius around the player, showing the player, updating the coins counter and calculating the players tokens
        let xy = p.position; this.playerSight(); this.tileUpdateDisplay(xy); this.data.player.coins = {true:0,false:0}; this.data.player.madness = {quantity:0,minRangeMoves:0}; this.data.player.vision.tokens = p.vision.range * p.vision.tokensPerRangeLoss;
        
        // getting the number of inventory slots, creating inventory table
        let s = Number(Object.keys(this.data.player.hud.inventory.slots).length); let div = D.cE("div"); div.className = "hud"; let tbl = D.cE("table"); let tbd = D.cE("tbody");
        for (let i=0;i<s;i++) {let tr = D.cE("tr");let td = D.cE("td");td.dataset.id = i;D.aC(td,tr);D.aC(tr,tbd)}
        // appending the inventory table to the body element
        D.aC(tbd,tbl);D.aC(tbl,div);D.aC(div);

        // updating the selected inventory slot (adding .selected class to the .hud td(s))
        this.updateSelectedSlot();

      }

      // if gamemode == 3 (editor) updating each tile with their corresponding in-game class so the full map is shown
      if (flag) {Object.keys(this.registry).forEach(v => {let xy = v.split("-"); this.tileUpdateDisplay(xy)})}

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("mapRender",[],"end",debugKey);

  }

  playerSight() {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("playerSight",[],"start",debugKey);
    }

    // getting the player position, gamemode id and the last updated tiles array
    let D = T.DOM; let p = this.data.player; let xy = p.position; let lUT = p.vision.lastUpdatedTiles; let gm = p.gamemode;

    // if the player position is an array of numbers
    if (!isNaN(xy.reduce((a,b)=>a+b))) {

      // if lastUpdatedTiles is defined
      if (lUT) {

        // if gamemode == 1 (hard) all the last updated tiles are now without a class (black)
        if (gm == 1) {lUT.forEach(v => {if(JSON.stringify(v) !== JSON.stringify(xy)){this.tileClear(v)}} )}

          // if not on gamemode == 1 (hard) then this effect is visible, the walls that are not in range of sight become black (without a class)
          D.qSA(".wall").forEach(v=>v.classList.remove("wall"));
          // removing the .light class from the non-wall-tiles
          D.qSA(".light").forEach(v=>v.classList.remove("light"));
          // the coins that are not in range of sight become invisible (.air class)
          D.qSA(".coin").forEach(v=>{v.classList.remove("coin");v.classList.add("air")});

          // clearing the last updated tiles array
          this.data.player.vision.lastUpdatedTiles = [];

        }

        // creating a new radius of updated tiles
        let currentTiles = this.sightRadius();

        // filtering off all the non-wall-tiles from the new radius of sight
        let a = currentTiles.filter(v=>this.registry[`${v[0]}-${v[1]}`]!==undefined&&this.registry[`${v[0]}-${v[1]}`].id==0||this.registry[`${v[0]}-${v[1]}`].id==3);
        // adding to the filtered air tiles the .light class
        a.forEach(v=>{let c=this.registry[`${v[0]}-${v[1]}`].element;c.classList.add("light")});

        // updating the last updated tiles array
        this.data.player.vision.lastUpdatedTiles = currentTiles;
        // updating the display of all the tiles that are in range of sight
        currentTiles.forEach(v => this.tileUpdateDisplay(v));

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("playerSight",[],"end",debugKey);

  }

  sightRange() {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("sightRange",[],"start",debugKey);
    }

    // getting current player vision range
    let r = this.data.player.vision.range;

    // creating an array of all the relative coordinated to the player (based on the player range of sight) (ex. range = 5; returned array [-5,-4,-3,-2,-1,0,+1,+2,+3,+4,+5])
    if (r && !isNaN(r)) {let n = -r; let range = []; for (let i=0;i<(r*2)+1;i++) {range.push(n); n += 1} typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("sightRange",[],"end",debugKey); return range}

  }

  sightRadius() {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("sightRadius",[],"start",debugKey);
    }

    // getting current player vision range
    let r = this.data.player.vision.range;

    // if range is a number
    if (r && !isNaN(r)) {

      // getting player position, the sight range and the map grid
      let xy = this.data.player.position; let x = xy[0]; let y = xy[1]; let ra = this.sightRange(); let sight = []; let g = this.data.map.grid;

      // creating an array of the current radius of sight
      for (let i=0;i<ra.length;i++) {for (let I=0;I<ra.length;I++) {let X = I; let Y = i; let f = true; f = X==0&&Y==0||X==r*2&&Y==0||X==0&&Y==r*2||X==r*2&&Y==r*2||X==r&&Y==r ? false : true; if (f) {let n1 = x+ra[I]>=0&&x+ra[I]<g[0] ? x+ra[I]:false; let n2 = y+ra[i]>=0&&y+ra[i]<g[1] ? y+ra[i]:false; if (typeof n1=="number"&&typeof n2=="number") {sight.push([n1,n2])}}}}

      typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("sightRadius",[],"end",debugKey);

      return sight

    }

  }

  playerMove(e) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("playerMove",[e],"start",debugKey);
    }

    // getting the tile coordinates
    let p = this.data.player; let moves = p.moves; let x = e.dataset.x; let y = e.dataset.y;

    // if moves is defined, e is an element and the registry[querySelector].id !== 1 (is not a wall)
    if (moves && e && e instanceof HTMLElement && this.registry[`${x}-${y}`].id !== 1) {

      // setting new coordinates and old coordinaties
      let nX = e.dataset.x; let nY = e.dataset.y; let oX = p.position[0]; let oY = p.position[1];

      // checking if the movement is done only on one axis, x or y and if the player.moves are set to 1 then it's not possible to move on the z axis
      if (Math.abs(nX - oX) <= moves && Math.abs(nY - oY) <= moves && Math.abs(nX - oX) + Math.abs(nY - oY) <= moves) {

        // check if last tile is a door
        let id = `${oX}-${oY}` == this.data.map.door.join("-") ? 3 : 0;

        this.data.player.direction = Math.abs(nX - oX) == 1 ? "x" : "y";

        // updating player position with the new coordinates
        this.data.player.position = [Number(nX),Number(nY)];

        // encasing the new and old coordinates in two separate arrays
        let oXY = [oX,oY];
        let nXY = [nX,nY];

        // registering the old coordinates as air, or door
        this.registerTile(oXY,id);
        // updating the old coordinates display
        this.tileUpdateDisplay(oXY);
        // all sort of events that alterate the vision range and tokens, based on the tile that the player is stepping on
        this.tileEvents(nXY);
        // registering the new coordinates as player
        this.registerTile(nXY,4);
        // updating the new coordinates display
        this.tileUpdateDisplay(nXY);
        // creating light radius around the player
        this.playerSight();

      }

    }

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("playerMove",[],"end",debugKey);

  }

  tileEvents(xy) {

    let debugKey;

    if (typeof this.debug !== "undefined" && this.debug.state) {
      debugKey = this.debugKeyGen();
      this.debugRegister("tileEvents",[xy],"start",debugKey);
    }

    // getting the tile id to determine which event is tied to it, getting the player range, tokensPerRangeLoss and the tokens
    let id = this.registry[xy.join("-")].id; let r = this.data.player.vision.range; let l = this.data.player.vision.tokensPerRangeLoss; let t = this.data.player.vision.tokens; let M = T.Math;
    // getting the truecoins and falsecoins base and randomized tokenrewards
    let tc = this.data.map.coins.true.tokenRewards; let fc = this.data.map.coins.false.tokenRewards; let tcR = tc.random; let fcR = fc.random;

    switch (id) {

      // the truecoins have a bigger base reward than the falsecoins, and also a bigger randomized reward interval that is added and removed from the final token reward. also adding 1 to the true coins counter
      case 2: this.data.player.coins.true += 1; this.data.player.madness.quantity = this.data.player.madness.quantity > 0 ? this.data.player.madness.quantity * this.data.map.madness.coins.true.madnessMultiplier : 0; this.data.player.vision.tokens = t + tc.base + M.R(tcR.added[0],tcR.added[1]) - M.R(tcR.removed[0],tcR.removed[1]); break;
      case 3: this.data.map.coins.true.quantity - this.data.player.coins.true == 0 ? alert("you won") : alert(`you found ${this.data.player.coins.true} coins of ${this.data.map.coins.true.quantity}`); break;
      // every tokenreward of the falsecoins is smaller than the truecoins. also adding 1 to the false coin counter
      case 5: this.data.player.coins.false += 1; this.data.player.madness.quantity = this.data.player.madness.quantity > 0 ? this.data.player.madness.quantity * this.data.map.madness.coins.false.madnessMultiplier : 0; this.data.player.vision.tokens = t + fc.base + M.R(fcR.added[0],fcR.added[1]) - M.R(fcR.removed[0],fcR.removed[1]); break;

    }
     
    // this counter is needed for the distortion
    this.data.player.madness.minRangeMoves += this.data.player.vision.range == this.data.player.vision.minRange ? 1 : 0;

    // adding madness quantity if players range is equal to minRange, removing if players range is higher than minRange
    this.data.player.madness.quantity += this.data.player.vision.range > this.data.player.vision.minRange ? this.data.map.madness.loss : this.data.map.madness.gain;

    // make sure that madness quantity stays between 0 and 1
    this.data.player.madness.quantity = this.data.player.madness.quantity < 0 ? 0 : this.data.player.madness.quantity;
    this.data.player.madness.quantity = this.data.player.madness.quantity > this.data.map.madness.cap ? this.data.map.madness.cap : this.data.player.madness.quantity;

    // if the player has minRangeMove equal to minRangeMovesBeforeDistortion then resetting the players madness quantity
    this.data.player.madness.quantity = this.data.player.madness.minRangeMoves == this.data.map.madness.minRangeMovesBeforeDistortion ? 0 : this.data.player.madness.quantity;
    // this is needed for the background filter looping and not staying static
    this.data.player.madness.quantity = Number(this.data.player.madness.quantity.toFixed(3)) == this.data.map.madness.cap ? this.data.map.madness.cap - (this.data.map.madness.gain * this.data.map.madness.distortionLoop) : this.data.player.madness.quantity;

    // if player is in state of madness and madness quantity is higher than 0
    if (this.data.player.madness.minRangeMoves >= this.data.map.madness.minRangeMovesBeforeDistortion && this.data.player.madness.quantity > 0) {

      // adding the .maddness class to the table, this class links to the noise filter
      this.data.map.element.classList.add("madness");
      let feTurbolence = document.querySelector("feTurbulence"); let feDisplacementMap = document.querySelector("feDisplacementMap");
      let baseFrequency = `${this.data.player.direction == "x" ? this.data.map.madness.playerDirectionDistortion : this.data.player.madness.quantity} ${this.data.player.direction == "y" ? this.data.map.madness.playerDirectionDistortion : this.data.player.madness.quantity}`;
      let scale = Math.ceil(Number(this.data.player.madness.quantity.toFixed(2)) * Math.ceil(this.data.map.madness.distortionScaleMultiplier * 100));
      // setting the distortion frequency
      feTurbolence.setAttribute("baseFrequency",baseFrequency);
      // setting the curve distortion
      feDisplacementMap.setAttribute("scale",scale);

    }

    // if players range is higher than minRange and the madness quantity was bringed back to 0
    if (this.data.player.vision.range > this.data.player.vision.minRange && this.data.player.madness.quantity == 0) {

      // resetting minRangeMoves to 0, this value makes sure that the next distortion doesn't start exactly when players range is equal to minRange
      this.data.player.madness.minRangeMoves = 0;
      // removing the filter link class from the table
      this.data.map.element.classList.remove("madness");

    }

    // if the number of tokens is higher than the (tokensPerRangeLoss * maxRange, basically if the tokens number is higher than the maximum range * tokensPerRangeLoss) changing the number of tokens to the maximum value based on the maxRange 
    this.data.player.vision.tokens = this.data.player.vision.tokens < (this.data.player.vision.tokensPerRangeLoss * this.data.player.vision.maxRange) ? this.data.player.vision.tokens : (this.data.player.vision.tokensPerRangeLoss * this.data.player.vision.maxRange);
    // if the number of tokens is smaller than the (((minRange-1) * tokensPerRangeLoss) + 1, basically if the tokens number is smaller than the minimum range) changing the number of tokens to the minimum value based on the minRange
    this.data.player.vision.tokens = this.data.player.vision.tokens < (((this.data.player.vision.minRange - 1) * this.data.player.vision.tokensPerRangeLoss) + 1) ? ((this.data.player.vision.minRange - 1) * (this.data.player.vision.tokensPerRangeLoss) + 1) : this.data.player.vision.tokens;
    // removing 1 token per move, if the tokens number is smaller than the (((this.data.player.vision.minRange - 1) * this.data.player.vision.tokensPerRangeLoss) + 1, basically if the tokens number is smaller than the minimum range) not removing any token
    this.data.player.vision.tokens -= this.data.player.vision.tokens !== (((this.data.player.vision.minRange - 1) * this.data.player.vision.tokensPerRangeLoss) + 1) ? 1 : 0;
    // setting the range to ceil(tokens / tokensPerRangeLoss), if the result is smaller than the minRange setting the range to the minRange automatically
    this.data.player.vision.range = Math.ceil(this.data.player.vision.tokens / this.data.player.vision.tokensPerRangeLoss) >= this.data.player.vision.minRange ? Math.ceil(this.data.player.vision.tokens / this.data.player.vision.tokensPerRangeLoss) : this.data.player.vision.minRange;

    typeof this.debug !== "undefined" && this.debug.state ? false : this.debugRegister("tileEvents",[],"end",debugKey);

  }

}
