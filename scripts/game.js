let T = TOOL;

class gameInstance {

  constructor(player = {position,moves,vision,gamemode}, map = {grid,meta}) {

    // assigning almost every value to a variable, flag is set to true if gamemode == 3 (editor)
    let pl = player; let p = pl.position; let mv = pl.moves; let v = pl.vision; let gm = pl.gamemode; let md = map.madness; let b = map.bannedTilesFromRandomizing; let g = map.grid; let m = map.meta; let r = v ? v.initialRange : undefined; let Mr = v ? v.maxRange : undefined; let mr = v ? v.minRange : undefined; let l = v ? v.tokensPerRangeLoss : undefined; let c = map.coins; let f = gm == 3 ? true : undefined;

    // if truecoins quantity and all the rewards, base and randomized, are defined. if not then the coins object becomes undefined
    c = c && c.true.quantity && c.true.tokenRewards.base && c.true.tokenRewards.random.added && c.true.tokenRewards.random.removed ? c : undefined; 
    // if falsecoins quantity and all the rewards, base and randomized, are defined. if not then the coins object becomes undefined
    c = c && c.false.quantity && c.false.tokenRewards.base && c.false.tokenRewards.random.added && c.false.tokenRewards.random.removed ? c : undefined;
    
    md = md && !isNaN(md.minRangeMovesBeforeActivation + md.loss + md.gain + md.coins.true.negativeMadnessMultiplier + md.coins.true.positiveMadnessMultiplier + md.coins.false.negativeMadnessMultiplier + md.coins.false.positiveMadnessMultiplier) ? md : undefined;
    // if bannedTilesFromRandomizing is defined and it's an array. if not setting bannedTilesFromRandomizing to empty array
    b = b && Array.isArray(b) ? b : []; 
    // if grid is an array of numbers. if not but it's a number creating array of two equal numbers
    g = g && !Array.isArray(g) && !isNaN(g) ? [g,g] : g;
    g = g && Array.isArray(g) && !isNaN(g.reduce((a,b)=>a+b)) ? g : undefined;
    // if map is a string, which if splitted has the same length as the grid resolution (g[0]*g[1]), splitting the string into an array and checking if it's an array of numbers
    m = m && m.split("").length == g[0]*g[1] ? m.split("").map(v=>Number(v)) : undefined;
    // if player.position is defined as an array of coordinates or is set to true to be randomized instead. if not it's set to false (required for the gamemode == 3 (editor))
    p = Array.isArray(p) && !isNaN(p.reduce((a,b)=>a+b)) || typeof p == "boolean" ? p : false;
    // if initialRange is a number. if not setting to undefined
    r = !isNaN(r) ? r : undefined;
    // if maxRange is defined and it's equal or higher than the initialRange numnber. if not setting the maxRange number as initialRange + 2
    Mr = Mr && Mr >= r ? Mr : r + 2;
    // if minRange is defined and it's equal or smaller than the initialRange number. if not setting the minRange number to 2
    mr = mr && mr <= r && mr >= 2 ? mr : 2;
    // if tokensPerRangeLoss is a number. if not setting tokensPerRangeLoss to undefined
    l = !isNaN(l) ? l : undefined;
    // if player.moves is a number. if not setting player.moves to 1
    mv = mv && !isNaN(mv) ? mv : 1;
    // if player.gamemode is a number. if not setting player.gamemode to 0 (normal difficulty)
    gm = !isNaN(gm) ? gm : 0;

    // if all these variables are defined or if the gamemode == 3 (editor) and map.grid and map.meta is defined
    if (g && !isNaN(m.reduce((a,b)=>a+b)) && typeof p !== "undefined" && mv && !isNaN(r) && !isNaN(l) && typeof gm !== "undefined" && c && b && md || gm == 3 && g && !isNaN(m.reduce((a,b)=>a+b))) {

      // if coins are defined assigning to two variables the truecoins and the falsecoins token rewards
      let tR = c ? c.true.tokenRewards : undefined; let fR = c ? c.false.tokenRewards : undefined;

      // if coins is defined (if gamemode !== 3 (editor))
      if (c) {

        // checking if each of the tokenrewards values is a string, if yes passing its value to the stringReward function that can calculate the token reward
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

      // updating data
      this.data = {map:map,player:pl};

      // if initialRange is defined, setting range the same value as initialRange
      if (r) {this.data.player.vision.range = r}
      
      // adding a register
      this.reg = {};
      // creating a the game element (table)
      this.createMap();
      // updating register, based on the map.meta which contains all the tile ids
      this.registerMap(f);
      // appending the map and the hud to the page, randomizing player position and coins position
      this.mapRender(f);

    }

  }

  stringReward(string,tokensPerRangeLoss) {

    // if the string and the tokensPerRangeLoss are defined
    if (string && tokensPerRangeLoss && !isNaN(tokensPerRangeLoss) && string.split(" ").length == 2) {

      // splitting the string that always contain a space
      let a = string.split(" ");
      // a[0] is the one that contains the * which means that the number next to the asterisc is multiplied by the tokensPerRangeLoss number if not, it remains the same
      a[0] = a[0].includes("*") && a[0].slice(0,1) == "*" ? Math.floor(tokensPerRangeLoss * Number(a[0].slice(1))) : a[0];
      // a[1] is the one that contains at the start (slice(0,1)) the "+"" or the "-" and if so it's added to the a[0] number
      a[1] = a[1] && a[1].slice(0,1) == "+" || a[1] && a[1].slice(0,1) == "-" ? a[0] + Number(a[1]) : undefined;
      // if a[1] is defined then the function returns it, if not it's returned the a[0] number
      return a[1] ? a[1] : a[0];

    }

  }

  tileClass(typeId) {

    // all the tile classes/types
    let tT = {0:"air",1:"wall",2:"coin",3:"door",4:"player",5:"coin"};
    // returning the tyle type string
    if (!isNaN(typeId)) {return String(tT[typeId])}

  }

  createMap() {

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

  }

  registerMap(flag) {

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
        let reg = Object.keys(this.reg); let b = this.data.map.bannedTilesFromRandomizing.map(v=>`${v[0]}-${v[1]}`);
        // filtering all the reg coordinates that are non-wall-tiles and are not contained in the bannedTilesFromRandomizing array, n is a random number between 0 and a.length - 1 and it's used to randomize a non-wall-tile to be registered as player
        let a = reg.filter(v=>this.reg[v].id==0&&!b.includes(v)); let n = M.R(a.length); let XY = a[n].split("-").map(v=>Number(v));
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

      }

      this.registerDoor();

    }

  }

  updateSelectedSlot(id) {

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

  }

  registerCoins() {

    // getting true and false coins quantity for the loop for(), mapping the bannedTilesFromRandomizing array to the register format (ex."x-y")
    let M = T.Math; let trueCoins = this.data.map.coins.true.quantity; let falseCoins = this.data.map.coins.false.quantity;  let b = this.data.map.bannedTilesFromRandomizing.map(v=>`${v[0]}-${v[1]}`);

    for (let i=0;i < (trueCoins + falseCoins);i++) {

      // filtering all the reg coordinates that are non-wall-tiles and are not contained in the bannedTilesFromRandomizing array
      let reg = Object.keys(this.reg); let a = reg.filter(v=>this.reg[v].id==0&&!b.includes(v));
      // n is a random number between 0 and a.length - 1 and it's used to randomize a non-wall-tile to be registered as truecoins or falsecoins, the id (2 = realcoins and 5 = falsecoins) is determined by the for() loop index
      let n = M.R(a.length); let id = i < trueCoins ? 2 : 5;
      // registering the randomized tile as realcoin or falsecoin
      this.registerTile(a[n].split("-"),id);

    }

  }

  registerDoor() {

  	// if there isn't a door in the register
    if (!this.data.map.door) {

      // mapping the bannedTilesFromRandomizing array to the register format (ex."x-y")
      let M = T.Math; let b = this.data.map.bannedTilesFromRandomizing.map(v=>`${v[0]}-${v[1]}`);
      // filtering all the reg coordinates that are non-wall-tiles and are not contained in the bannedTilesFromRandomizing array
      let reg = Object.keys(this.reg); let a = reg.filter(v=>this.reg[v].id==0&&!b.includes(v));
      // n is a random number between 0 and a.length - 1 and it's used to randomize a non-wall-tile to be registered as a door
      let n = M.R(a.length);
      this.data.map.door = a[n].split("-").map(v=>Number(v));
      // registering the randomized tile as a door
      this.registerTile(this.data.map.door,3);

    }

  }

  registerTile(xy,typeId) {

    let D = T.DOM; let m = this.data.map;

    // if coordinates is an array of numbers and the id is a number
    if (xy && Array.isArray(xy) && !isNaN(typeId)) {

      // querySelector for the register based on the x and y coordinates, and searching for the element in the map.element to be sure that the tile is part of the game
      let r = `${xy[0]}-${xy[1]}`; let e = D.qSA(`[data-x="${xy[0]}"][data-y="${xy[1]}"]`,m.element); 
      // adding the element to the register, the added object contains the tiles id, class and the element itself
      this.reg[r] = {id:Number(typeId),class:this.tileClass(typeId),element:e[0]};

    }

  }

  tileUpdateDisplay(xy) {

    // if the coordinates is an array of numbers
    if (xy && Array.isArray(xy)) {

      // querySelector for the register based on the x and y coordinates
      let r = `${xy[0]}-${xy[1]}`;
      // checking if the element is in the register, removing all the in-game classes from the element, then updating the element with the class written in the register
      if (this.reg[r]) {let reg = this.reg[r]; this.tileClear(xy); reg.element.classList.add(reg.class)}

    }

  }

  tileClear(xy) {

    // if coordinates is an array of numbers
    if (xy && Array.isArray(xy)) {

      // querySelector for the register based on the x and y coordinates
      let r = `${xy[0]}-${xy[1]}`;

      // checking if the element is in the register
      if (this.reg[r]) {

        // removing all the in-game classes from the element
        let eC = this.reg[r].element.classList;

        eC.remove("air");
        eC.remove("wall");
        eC.remove("coin");
        eC.remove("door");
        eC.remove("player");

      }

    }

  }

  mapRender(flag) {

    let D = T.DOM; let m = this.data.map; let p = this.data.player;

    // if map.element is defined and it's an html element
    if (m.element && m.element instanceof HTMLElement) {

      // inserting the table after the beginning of the body tag
      document.body.insertAdjacentElement("beforeend",m.element);

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
      if (flag) {Object.keys(this.reg).forEach(v => {let xy = v.split("-"); this.tileUpdateDisplay(xy)})}

    }

  }

  playerSight() {

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
        let a = currentTiles.filter(v=>this.reg[`${v[0]}-${v[1]}`]!==undefined&&this.reg[`${v[0]}-${v[1]}`].id==0||this.reg[`${v[0]}-${v[1]}`].id==3);
        // adding to the filtered air tiles the .light class
        a.forEach(v=>{let c=this.reg[`${v[0]}-${v[1]}`].element;c.classList.add("light")});

        // updating the last updated tiles array
        this.data.player.vision.lastUpdatedTiles = currentTiles;
        // updating the display of all the tiles that are in range of sight
        currentTiles.forEach(v => this.tileUpdateDisplay(v));

    }

  }

  sightRange() {

    // getting current player vision range
    let r = this.data.player.vision.range;

    // creating an array of all the relative coordinated to the player (based on the player range of sight) (ex. range = 5; returned array [-5,-4,-3,-2,-1,0,+1,+2,+3,+4,+5])
    if (r && !isNaN(r)) {let n = -r; let range = []; for (let i=0;i<(r*2)+1;i++) {range.push(n); n += 1} return range}

  }

  sightRadius() {

    // getting current player vision range
    let r = this.data.player.vision.range;

    // if range is a number
    if (r && !isNaN(r)) {

      // getting player position, the sight range and the map grid
      let xy = this.data.player.position; let x = xy[0]; let y = xy[1]; let ra = this.sightRange(); let sight = []; let g = this.data.map.grid;

      // creating an array of the current radius of sight
      for (let i=0;i<ra.length;i++) {for (let I=0;I<ra.length;I++) {let X = I; let Y = i; let f = true; f = X==0&&Y==0||X==r*2&&Y==0||X==0&&Y==r*2||X==r*2&&Y==r*2||X==r&&Y==r ? false : true; if (f) {let n1 = x+ra[I]>=0&&x+ra[I]<g[0] ? x+ra[I]:false; let n2 = y+ra[i]>=0&&y+ra[i]<g[1] ? y+ra[i]:false; if (typeof n1=="number"&&typeof n2=="number") {sight.push([n1,n2])}}}}

      return sight

    }

  }

  playerMove(e) {

    // getting the tile coordinates
    let p = this.data.player; let mv = p.moves; let x = e.dataset.x; let y = e.dataset.y;

    // if moves is defined, e is an element and the reg[querySelector].id !== 1 (is not a wall)
    if (mv && e && e instanceof HTMLElement && this.reg[`${x}-${y}`].id !== 1) {

      // setting new coordinates and old coordinaties
      let nX = e.dataset.x; let nY = e.dataset.y; let oX = p.position[0]; let oY = p.position[1];

      // checking if the movement is done only on one axis, x or y and if the player.moves are set to 1 then it's not possible to move on the z axis
      if (Math.abs(nX - oX) <= mv && Math.abs(nY - oY) <= mv && Math.abs(nX - oX) + Math.abs(nY - oY) <= mv) {

      	// check if last tile is a door
      	let id = `${oX}-${oY}` == this.data.map.door.join("-") ? 3 : 0;

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

  }

  tileEvents(xy) {

    // getting the tile id to determine which event is tied to it, getting the player range, tokensPerRangeLoss and the tokens
    let id = this.reg[xy.join("-")].id; let r = this.data.player.vision.range; let l = this.data.player.vision.tokensPerRangeLoss; let t = this.data.player.vision.tokens; let M = T.Math;
    // getting the truecoins and falsecoins base and randomized tokenrewards
    let tc = this.data.map.coins.true.tokenRewards; let fc = this.data.map.coins.false.tokenRewards; let tcR = tc.random; let fcR = fc.random;

    switch (id) {

      // the truecoins have a bigger base reward than the falsecoins, and also a bigger randomized reward interval that is added and removed from the final token reward. also adding 1 to the true coins counter
      case 2: this.data.player.coins.true += 1; this.data.player.madness.quantity = this.data.player.madness.quantity > 0 ? this.data.player.madness.quantity * this.data.map.madness.coins.true.positiveMadnessMultiplier : this.data.player.madness.quantity * this.data.map.madness.coins.true.negativeMadnessMultiplier; this.data.player.vision.tokens = t + tc.base + M.R(tcR.added[0],tcR.added[1]) - M.R(tcR.removed[0],tcR.removed[1]); break;
      case 3: this.data.map.coins.true.quantity - this.data.player.coins.true == 0 ? alert("you won") : alert(`you found ${this.data.player.coins.true} coins of ${this.data.map.coins.true.quantity}`);
      // every tokenreward of the falsecoins is smaller than the truecoins. also adding 1 to the false coin counter
      case 5: this.data.player.coins.false += 1; this.data.player.madness.quantity = this.data.player.madness.quantity > 0 ? this.data.player.madness.quantity * this.data.map.madness.coins.false.positiveMadnessMultiplier : this.data.player.madness.quantity * this.data.map.madness.coins.false.negativeMadnessMultiplier; this.data.player.vision.tokens = t + fc.base + M.R(fcR.added[0],fcR.added[1]) - M.R(fcR.removed[0],fcR.removed[1]); break;

    }
     
    // this counter is needed for the distortion
    this.data.player.madness.minRangeMoves += this.data.player.vision.range == this.data.player.vision.minRange ? 1 : 0;

    // adding madness quantity if players range is equal to minRange, removing if players range is higher than minRange
    this.data.player.madness.quantity += this.data.player.vision.range > this.data.player.vision.minRange ? this.data.map.madness.loss : this.data.map.madness.gain;

    // make sure that madness quantity stays between 0 and 1
    this.data.player.madness.quantity = this.data.player.madness.quantity < 0 ? 0 : this.data.player.madness.quantity;
    this.data.player.madness.quantity = this.data.player.madness.quantity > 0.99 ? 0.99 : this.data.player.madness.quantity;

    if (this.data.player.madness.minRangeMoves >= this.data.map.madness.minRangeMovesBeforeActivation && this.data.player.madness.quantity > 0) {

    	this.data.map.element.classList.add("madness");
    	let feTurbolence = document.querySelector("feTurbulence"); let feDisplacementMap = document.querySelector("feDisplacementMap");
    	let baseFrequency = `${this.data.player.madness.quantity} ${this.data.player.madness.quantity}`;
    	let scale = Math.ceil(Number(this.data.player.madness.quantity.toFixed(2)) * 50);
    	feTurbolence.setAttribute("baseFrequency",baseFrequency);
    	feDisplacementMap.setAttribute("scale",scale);

    }

    if (this.data.player.vision.range > this.data.player.vision.minRange && this.data.player.madness.quantity == 0) {

    	this.data.player.madness.minRangeMoves = 0;
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

  }

}