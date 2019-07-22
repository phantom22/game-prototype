let T = TOOL;

class gameInstance {

  constructor(player = {position,moves,vision,gamemode}, map = {grid,meta}) {

    // assigning almost every value to a variable, flag is set to true if gamemode == 3 (editor)
    let pl = player; let p = pl.position; let mv = pl.moves; let v = pl.vision; let gm = pl.gamemode; let g = map.grid; let m = map.meta; let r = v ? v.initialRange : undefined; let Mr = v ? v.maxRange : undefined; let mr = v ? v.minRange : undefined; let l = v ? v.tokensPerRangeLoss : undefined; let c = map.coins; let f = gm == 3 ? true : undefined;

    // if truecoins quantity and all the rewards, baserewards and randomized rewards are defined, if not then coins becomes undefined
    c = c && c.true.quantity && c.true.tokenRewards.base && c.true.tokenRewards.random.added && c.true.tokenRewards.random.removed ? c : undefined;
    // if falsecoins quantity and all the rewards, baserewards and randomized rewards are defined, if not then coins becomes undefined
    c = c && c.false.quantity && c.false.tokenRewards.base && c.false.tokenRewards.random.added && c.false.tokenRewards.random.removed ? c : undefined;
    // if grid is an array of numbers then it stays as it is already, if not but it's a number instead it simply change it into an array [number,number]
    g = g && !Array.isArray(g) && !isNaN(g) ? [g,g] : g;
    g = g && Array.isArray(g) && !isNaN(g.reduce((a,b)=>a+b)) ? g : undefined;
    // if map is a string, which if splitted has the same length as grid[0] * grid[1] result, and it's an array of number
    m = m && m.split("").length == g[0]*g[1] ? m.split("").map(v=>Number(v)) : undefined;
    // if player.position is defined as an array of coordinates or is set to true to be randomized instead
    p = Array.isArray(p) && !isNaN(p.reduce((a,b)=>a+b)) || typeof p == "boolean" ? p : false;
    // if initialRange is a number
    r = !isNaN(r) ? r : undefined;
    // if maxRange is defined and it's bigger or equal to initialRange
    Mr = Mr && Mr >= r ? Mr : r + 2;
    // if minRange is defined and it's smaller or equal to initialRange
    mr = mr && mr <= r && mr >= 2 ? mr : 2;
    // if tokensPerRangeLoss is a number
    l = !isNaN(l) ? l : undefined;
    // if moves is a number
    mv = mv && !isNaN(mv) ? mv : 1;
    // if gamemode is a number or else it's set to 0 (normal)
    gm = !isNaN(gm) ? gm : 0;

    // if all these variables are defined or the gamemode == 3 (editor), the grid and map.meta is defined
    if (g && !isNaN(m.reduce((a,b)=>a+b)) && typeof p !== "undefined" && mv && !isNaN(r) && !isNaN(l) && typeof gm !== "undefined" && c || gm == 3 && g && !isNaN(m.reduce((a,b)=>a+b))) {

      // if coins are defined (not if gamemode == 3 (editor)) assigning to two variables the truecoins rewards and the falsecoins rewards
      let tR = c ? c.true.tokenRewards : undefined; let fR = c ? c.false.tokenRewards : undefined;

      // if coins is defined
      if (c) {

        // checking if each of the tokenrewards values is a string, if yes passing its value to the stringReward than can read the string values
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

      // if initialRange is defined, setting range to the same value as initialRange
      if (r) {this.data.player.vision.range = r}
      
      // adding a register
      this.reg = {};
      // creating a table
      this.createMap();
      // updating register, based on the map.meta which contains all the tile ids
      this.registerMap(f);
      // appending the map and the hud to the page
      this.mapRender(f);

    }

  }

  stringReward(string,tokensPerRangeLoss) {

    // if the string and the tokensPerRangeLoss are defined
    if (string && tokensPerRangeLoss && !isNaN(tokensPerRangeLoss)) {

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

        // map.meta is an array of numbers so we dont have any coordinates related to each number, so we just get the coordinates by watching at the index of the for() loop
        let x = i; while (x >= g[0]) {x = x - g[0]}; let y = Math.floor(i / g[0]);
        // registering each coordinate with their corresponding
        this.registerTile([x,y],m.meta[i]);

      }

      // if position is an array of nummber (therefor defined)
      if (p.position !== false && typeof p.position !== "boolean") {

        let XY = p.position;
        // registering the player.position coordinates as player
        this.registerTile(XY,4);

      }

      // if player.position == true
      else if (p.position == true) {

        // getting all the reg coordinates
        let reg = Object.keys(this.reg);

        // filtering all the reg coordinates that are non-wall-tiles, n is a randomized number than is smaller than the array.length and it's used to randomize a non-wall-tile to be registered as player
        let a = reg.filter(v=>this.reg[v].id==0); let n = M.R(a.length); let XY = a[n].split("-").map(v=>Number(v));
        // updating player.position with the randomized tile
        this.data.player.position = XY;
        // register the randomized tile as player
        this.registerTile(XY,4);

      }

      // if not gamemode == 3 (editor)
      if (!flag) {

        // adding a hud variable 
        this.data.player.hud = {inventory:{slots:{0:false,1:false,2:false,3:false,4:false,5:false,6:false},selectedSlot:0}};
        // adding the false and the true coins to the register
        this.registerCoins();

      }

    }

  }

  updateSelectedSlot(n,id) {
    let D = T.DOM; let s = D.qSA(".selected");
    // if a .selected element is found, removing its .selected class
    s ? s.forEach(v=>v.classList.remove("selected")) : s;
    // if n is a number then adding it to the selectedSlot id (note: the n number can also be negative)
    this.data.player.hud.inventory.selectedSlot += n && !isNaN(n) ? n : 0;
    let S = this.data.player.hud.inventory.slots; let sS = this.data.player.hud.inventory.selectedSlot;
    // if the selectedSlot number is higher than the amount of avaiable slots then making the selectedSlot number as the maximum slot number avaiable
    this.data.player.hud.inventory.selectedSlot = sS > Number(Object.keys(S).length-1) ? Number(Object.keys(S).length-1) : sS;
    // if the selectedSlot number is smaller than 0, setting the selectedSlot number as 0 which is the minimum slot number avaiable
    this.data.player.hud.inventory.selectedSlot = sS < 0 ? 0 : this.data.player.hud.inventory.selectedSlot;
    // if id is a number, setting the selectedSlot as the id
    this.data.player.hud.inventory.selectedSlot = id && !isNaN(id) || id == 0 ? id : this.data.player.hud.inventory.selectedSlot;
    // adding to the querySelector[selectedSlot] the .selected class
    D.qSA(".hud td")[this.data.player.hud.inventory.selectedSlot].classList.add("selected");
  }

  registerCoins() {

    // getting true and false coins quantity for the loop for()
    let M = T.Math; let trueCoins = this.data.map.coins.true.quantity; let falseCoins = this.data.map.coins.false.quantity;
    // filtering through the reg object all the tiles than aren't walls
    let reg = Object.keys(this.reg); let a = reg.filter(v=>this.reg[v].id==0);

    for (let i=0;i < (trueCoins + falseCoins);i++) {

      // getting a random number to use in the filtered array of non-wall-tiles, the id (2 for real coins and 5 coins) is determined by the for() loop index
      let n = M.R(a.length); let id = i < trueCoins ? 2 : 5;
      // registering the randomized non-wall-tile as real or false coin
      this.registerTile(a[n].split("-"),id);

    }

  }

  registerTile(xy,typeId) {

    let D = T.DOM; let m = this.data.map;

    // if coordinates is an array of numbers and the id is a number
    if (xy && Array.isArray(xy) && !isNaN(typeId)) {

      // querySelector for the register based on x and y coordinates, and searching for the element in the map.element to be sure that the element is part of the game
      let r = `${xy[0]}-${xy[1]}`; let e = D.qSA(`[data-x="${xy[0]}"][data-y="${xy[1]}"]`,m.element); 
      // registering the element in the reg object
      this.reg[r] = {id:Number(typeId),class:this.tileClass(typeId),element:e[0]};

    }

  }

  tileUpdateDisplay(xy) {

    // if coordinates is an array of numbers
    if (xy && Array.isArray(xy)) {

      // querySelector for the register based on x and y coordinates
      let r = `${xy[0]}-${xy[1]}`;
      // checking if the element is in the reg object, then updating its class which is written in the reg object
      if (this.reg[r]) {let reg = this.reg[r]; this.tileClear(xy); reg.element.classList.add(reg.class)}

    }

  }

  tileClear(xy) {

    // if coordinates is an array of numbers
    if (xy && Array.isArray(xy)) {

      // querySelector for the register based on x and y coordinates
      let r = `${xy[0]}-${xy[1]}`;

      // if reg[querySelector] is defined
      if (this.reg[r]) {

        // removing all of the different tile classes
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

    if (m.element) {

      // inserting the game table into the body element
      document.body.insertAdjacentElement("afterbegin",m.element);

      if (p.position) {

        // get player position, creating the light radius around the player, show the player, update the coins counter and update the players tokens
        let xy = p.position; this.playerSight(); this.tileUpdateDisplay(xy); this.data.player.coins = {true:0,false:0}; this.data.player.vision.tokens = p.vision.range * p.vision.tokensPerRangeLoss;
        
        // getting the number of inventory slots, creating inventory table
        let s = Number(Object.keys(this.data.player.hud.inventory.slots).length); let div = D.cE("div"); div.className = "hud"; let tbl = D.cE("table"); let tbd = D.cE("tbody");
        for (let i=0;i<s;i++) {console.log("lol");let tr = D.cE("tr");let td = D.cE("td");td.dataset.id = i;D.aC(td,tr);D.aC(tr,tbd)}
        // appending the inventory table to the body element
        D.aC(tbd,tbl);D.aC(tbl,div);D.aC(div);

        // updating the selected inventory slot (adding .selected class to the .hud td(s))
        this.updateSelectedSlot();

      }

      // if gamemode == 3 (editor) update each tile so the full map is displayed
      if (flag) {Object.keys(this.reg).forEach(v => {let xy = v.split("-"); this.tileUpdateDisplay(xy)})}

    }

  }

  playerSight() {

    // getting the player position, gamemode id and the last updated tiles array
    let D = T.DOM; let p = this.data.player; let xy = p.position; let lUT = p.vision.lastUpdatedTiles; let gm = p.gamemode;

    //
    if (!isNaN(xy.reduce((a,b)=>a+b))) {

      // if before this move you already had a radius of vision (higher than 0)
      if (lUT) {

        // if gamemode == 1 (hard) all the last updated tiles are now without a class (black)
        if (gm == 1) {lUT.forEach(v => {if(JSON.stringify(v) !== JSON.stringify(xy)){this.tileClear(v)}} )}

          // if not on gamemode == 1 then this effect is visible, the walls that are not in your range of sight become black (without a class)
          D.qSA(".wall").forEach(v=>v.classList.remove("wall"));
          // removing the .light class from the non-wall-tiles
          D.qSA(".light").forEach(v=>v.classList.remove("light"));
          // makes all the coin invisible if not in the range of sight
          D.qSA(".coin").forEach(v=>{v.classList.remove("coin");v.classList.add("air")});

          // clearing the last updated tiles array
          this.data.player.vision.lastUpdatedTiles = [];

        }

        // creating a new radius of updated tiles
        let currentTiles = this.sightRadius();

        // filtering off all the non-wall-tiles from the new radius of sight
        let a = currentTiles.filter(v=>this.reg[`${v[0]}-${v[1]}`]!==undefined&&this.reg[`${v[0]}-${v[1]}`].id==0);
        // adding to the filtered tiles the .light class
        a.forEach(v=>{let c=this.reg[`${v[0]}-${v[1]}`].element;c.classList.add("light")});

        // updating the last updated tiles with the new radius tiles
        this.data.player.vision.lastUpdatedTiles = currentTiles;
        // updating the display of the tiles in the new radius of vision
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

    // if range is defined and it's a number
    if (r && !isNaN(r)) {

      // getting player position, the sight range and the map grid
      let xy = this.data.player.position; let x = xy[0]; let y = xy[1]; let ra = this.sightRange(); let sight = []; let g = this.data.map.grid;

      // creating an array of the current radius of sight
      for (let i=0;i<ra.length;i++) {for (let I=0;I<ra.length;I++) {let X = I; let Y = i; let f = true; f = X==0&&Y==0||X==r*2&&Y==0||X==0&&Y==r*2||X==r*2&&Y==r*2||X==r&&Y==r ? false : true; if (f) {let n1 = x+ra[I]>=0&&x+ra[I]<g[0] ? x+ra[I]:false; let n2 = y+ra[i]>=0&&y+ra[i]<g[1] ? y+ra[i]:false; if (typeof n1=="number"&&typeof n2=="number") {sight.push([n1,n2])}}}}

      return sight

    }

  }

  playerMove(e) {

    // getting players position
    let p = this.data.player; let mv = p.moves; let x = e.dataset.x; let y = e.dataset.y;

    // if moves are defined, e is an element and the reg[querySelector].id is not 1 (which means the tile is a wall)
    if (mv && e && e instanceof HTMLElement && this.reg[`${x}-${y}`].id !== 1) {

      // setting new coordinates and old coordinaties
      let nX = e.dataset.x; let nY = e.dataset.y; let oX = p.position[0]; let oY = p.position[1];

      // checking if the movement is done only on one axis, x or y and if the player.moves are set to 1 then it's not possible to move on the z axis
      if (Math.abs(nX - oX) <= mv && Math.abs(nY - oY) <= mv && Math.abs(nX - oX) + Math.abs(nY - oY) <= mv) {

        // updating player position with the new coordinates
        this.data.player.position = [Number(nX),Number(nY)];

        // encasing the new and old coordinates in two separate arrays
        let oXY = [oX,oY];
        let nXY = [nX,nY];

        // registering the old coordinates as air
        this.registerTile(oXY,0);
        // updating the old coordinates display
        this.tileUpdateDisplay(oXY);
        // all sort of events that alterate the vision range and tokens
        this.tileEvents(nXY);
        // registering new coordinates as player
        this.registerTile(nXY,4);
        // updating new coordinates display
        this.tileUpdateDisplay(nXY);
        // creating light radius around the player
        this.playerSight();

      }

    }

  }

  tileEvents(xy) {

    // getting the tile id to determine which event is tied to it, getting the player range, tokensPerRangeLoss and the tokens
    let id = this.reg[xy.join("-")].id; let r = this.data.player.vision.range; let l = this.data.player.vision.tokensPerRangeLoss; let t = this.data.player.vision.tokens; let M = T.Math;
    // getting the true coins and false coins tokenrewards from base rewards to randomized rewards
    let tc = this.data.map.coins.true.tokenRewards; let fc = this.data.map.coins.false.tokenRewards; let tcR = tc.random; let fcR = fc.random;

    switch (id) {

      // the true coins have a bigger base reward than the false coins, and also a bigger randomized reward interval thatt is added and removed from the final token number. also adding 1 to the true coins counter
      case 2: this.data.player.coins.true += 1; this.data.player.vision.tokens = t + tc.base + M.R(tcR.added[0],tcR.added[1]) - M.R(tcR.removed[0],tcR.removed[1]); break;
      // every tokenreward of the false coins is smaller than the ones in the true coin tokenrewards. also adding 1 to the false coin counter
      case 5: this.data.player.coins.false += 1; this.data.player.vision.tokens = t + fc.base + M.R(fcR.added[0],fcR.added[1]) - M.R(fcR.removed[0],fcR.removed[1]); break;

    }
      
    // if the number of tokens is higher than the (tokensPerRangeLoss * maxRange, basically if the tokens number is higher than the maximum range) changing the number of tokens to the maximum value based on the maxRange 
    this.data.player.vision.tokens = this.data.player.vision.tokens < (this.data.player.vision.tokensPerRangeLoss * this.data.player.vision.maxRange) ? this.data.player.vision.tokens : (this.data.player.vision.tokensPerRangeLoss * this.data.player.vision.maxRange);
    // if the number of tokens is smaller than the (((minRange-1) * tokensPerRangeLoss) + 1, basically if the tokens number is smaller than the minimum range) changing the number of tokens to the minimum value based of the minRange
    this.data.player.vision.tokens = this.data.player.vision.tokens < (((this.data.player.vision.minRange - 1) * this.data.player.vision.tokensPerRangeLoss) + 1) ? ((this.data.player.vision.minRange - 1) * (this.data.player.vision.tokensPerRangeLoss) + 1) : this.data.player.vision.tokens;
    // removing 1 token per move, if the tokens number is smaller than the (((this.data.player.vision.minRange - 1) * this.data.player.vision.tokensPerRangeLoss) + 1, basically if the tokens number is smaller than the minimum range) not removing any token
    this.data.player.vision.tokens -= this.data.player.vision.tokens !== (((this.data.player.vision.minRange - 1) * this.data.player.vision.tokensPerRangeLoss) + 1) ? 1 : 0;
    // setting the range, ceil(tokens / tokensPerRangeLoss) if the result is smaller than the minRange setting the range to the minRange automatically
    this.data.player.vision.range = Math.ceil(this.data.player.vision.tokens / this.data.player.vision.tokensPerRangeLoss) >= this.data.player.vision.minRange ? Math.ceil(this.data.player.vision.tokens / this.data.player.vision.tokensPerRangeLoss) : this.data.player.vision.minRange;

  }

}