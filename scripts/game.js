let T = TOOL;

class gameInstance {

  constructor(player = {position,moves,vision,gamemode}, map = {grid,meta}) {

    let pl = player; let p = pl.position; let mv = pl.moves; let v = pl.vision; let gm = pl.gamemode; let g = map.grid; let m = map.meta; let r = v ? v.initialRange : undefined; let Mr = v ? v.maxRange : undefined; let mr = v ? v.minRange : undefined; let l = v ? v.tokensPerRangeLoss : undefined; let c = map.coins; let f = gm == 3 ? true : undefined;

    c = c && c.true.quantity && c.true.tokenRewards.base && c.true.tokenRewards.random.added && c.true.tokenRewards.random.removed ? c : undefined;
    c = c && c.false.quantity && c.false.tokenRewards.base && c.false.tokenRewards.random.added && c.false.tokenRewards.random.removed ? c : undefined;
    g = g && !Array.isArray(g) && !isNaN(g) ? [g,g] : g;
    g = g && Array.isArray(g) && !isNaN(g.reduce((a,b)=>a+b)) ? g : undefined;
    m = m && m.split("").length == g[0]*g[1] ? m.split("").map(v=>Number(v)) : undefined;
    p = Array.isArray(p) && !isNaN(p.reduce((a,b)=>a+b)) || typeof p == "boolean" ? p : false;
    r = !isNaN(r) ? r : undefined;
    Mr = Mr && Mr > r ? Mr : r + 2;
    mr = mr && mr < r && mr >= 2 ? mr : 2;
    l = !isNaN(l) ? l : undefined;
    mv = mv && !isNaN(mv) ? mv : 1;
    gm = !isNaN(gm) ? gm : 0;

    if (g && !isNaN(m.reduce((a,b)=>a+b)) && typeof p !== "undefined" && mv && !isNaN(r) && !isNaN(l) && typeof gm !== "undefined" && c || gm == 3 && g && !isNaN(m.reduce((a,b)=>a+b))) {

      let tR = c ? c.true.tokenRewards : undefined; let fR = c ? c.false.tokenRewards : undefined;
      if (c) {

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

      this.data = {map:map,player:pl};

      if (r) {
        this.data.player.vision.range = r;
      }
      
      this.reg = {};
      this.createMap();
      this.registerMap(f);
      this.mapRender(f);

    }

  }

  stringReward(string,loss) {

    if (string && loss && !isNaN(loss)) {

      let a = string.split(" ");
      a[0] = a[0].includes("*") && a[0].slice(0,1) == "*" ? Math.floor(loss * Number(a[0].slice(1))) : a[0];
      a[1] = a[1] && a[1].slice(0,1) == "+" || a[1] && a[1].slice(0,1) == "-" ? a[0] + Number(a[1]) : undefined;
      return a[1] ? a[1] : a[0];

    }

  }

  tileClass(typeId) {

    let tT = {0:"air",1:"wall",2:"coin",3:"door",4:"player",5:"coin"};
    if (!isNaN(typeId)) {return String(tT[typeId])}

  }

  createMap() {

    let D = T.DOM; let m = this.data.map;

    if (m.meta && !m.element) {

      let tbl = D.cE("table"); let tbd = D.cE("tbody");
      for (let i=0;i < m.grid[1];i++) {let r = D.cE("tr"); for (let I=0;I < m.grid[0];I++) {let c = D.cE("td"); c.dataset.x = I; c.dataset.y = i; D.aC(c,r)} D.aC(r,tbd)}
      D.aC(tbd,tbl);

      this.data.map.element = tbl;

    }

  }

  registerMap(flag) {

    let m = this.data.map; let p = this.data.player; let g = m.grid; let M = T.Math;

    if (m.meta && m.element instanceof HTMLElement) {

      for (let i=0;i < m.meta.length;i++) {

        let x = i; while (x >= g[0]) {x = x - g[0]}; let y = Math.floor(i / g[0]);
        this.registerTile([x,y],m.meta[i]);

      }

      if (p.position !== false && typeof p.position !== "boolean") {

        let XY = p.position;
        this.registerTile(XY,4);

      }

      else if (p.position == true) {

        let reg = Object.keys(this.reg);

        let a = reg.filter(v=>this.reg[v].id==0); let n = M.R(a.length); let XY = a[n].split("-").map(v=>Number(v));
        this.data.player.position = XY;
        this.registerTile(XY,4);

      }

      if (!flag) {

        this.registerCoins();

      }

    }

  }

  registerCoins() {

    let trueCoins = this.data.map.coins.true.quantity; let falseCoins = this.data.map.coins.false.quantity; let M = T.Math;

    let reg = Object.keys(this.reg); let a = reg.filter(v=>this.reg[v].id==0);

    for (let i=0;i <= (trueCoins + falseCoins);i++) {

      let n = M.R(a.length); let id = i < trueCoins ? 2 : 5;
      this.registerTile(a[n].split("-"),id);

    }

  }

  registerTile(xy,typeId) {

    let D = T.DOM; let m = this.data.map;

    if (xy && Array.isArray(xy) && !isNaN(typeId)) {

      let r = `${xy[0]}-${xy[1]}`; let e = D.qSA(`[data-x="${xy[0]}"][data-y="${xy[1]}"]`,m.element); 
      this.reg[r] = {id:Number(typeId),class:this.tileClass(typeId),element:e[0]};

    }

  }

  tileUpdateDisplay(xy) {

    if (xy && Array.isArray(xy)) {

      let r = `${xy[0]}-${xy[1]}`;
      if (this.reg[r]) {let reg = this.reg[r]; this.tileClear(xy); reg.element.classList.add(reg.class)}

    }

  }

  tileClear(xy) {

    if (xy && Array.isArray(xy)) {

      let r = `${xy[0]}-${xy[1]}`;

      if (this.reg[r]) {

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

    let m = this.data.map; let p = this.data.player;

    if (m.element) {

      let D = T.DOM;
      document.body.insertAdjacentElement("afterbegin",m.element);

      if (p.position) {let xy = p.position; this.playerSight(); this.tileUpdateDisplay(xy); this.data.player.coins = {true:0,false:0}; this.data.player.vision.tokens = p.vision.range * p.vision.tokensPerRangeLoss;}

      if (flag) {Object.keys(this.reg).forEach(v => {let xy = v.split("-"); this.tileUpdateDisplay(xy)})}

    }

  }

  playerSight() {

    let p = this.data.player; let xy = p.position; let lUT = p.vision.lastUpdatedTiles; let gm = p.gamemode;

     if (!isNaN(xy.reduce((a,b)=>a+b))) {

        if (lUT) {

          if (gm == 1) {lUT.forEach(v => {if(JSON.stringify(v) !== JSON.stringify(xy)){this.tileClear(v)}} )}

          document.querySelectorAll(".wall").forEach(v=>v.classList.remove("wall"));
          document.querySelectorAll(".light").forEach(v=>v.classList.remove("light"));
          document.querySelectorAll(".coin").forEach(v=>{v.classList.remove("coin");v.classList.add("air")});

          this.data.player.vision.lastUpdatedTiles = [];

        }

        let x = xy[0]; let y = xy[1];
        let currentTiles = this.sightRadius();

        let a = currentTiles.filter(v=>this.reg[`${v[0]}-${v[1]}`]!==undefined&&this.reg[`${v[0]}-${v[1]}`].id==0);
        a.forEach(v=>{let c=this.reg[`${v[0]}-${v[1]}`].element;c.classList.add("light")});

        this.data.player.vision.lastUpdatedTiles = currentTiles;
        currentTiles.forEach(v => this.tileUpdateDisplay(v));

     }

  }

  sightRange() {

    let r = this.data.player.vision.range;
    if (r && !isNaN(r)) {let n = -r; let range = []; for (let i=0;i<(r*2)+1;i++) {range.push(n); n += 1} return range}

  }

  sightRadius() {

    let r = this.data.player.vision.range;

    if (r && !isNaN(r)) {

      let xy = this.data.player.position; let x = xy[0]; let y = xy[1]; let ra = this.sightRange(); let sight = []; let g = this.data.map.grid;
      for (let i=0;i<ra.length;i++) {for (let I=0;I<ra.length;I++) {let X = I; let Y = i; let f = true; f = X==0&&Y==0||X==r*2&&Y==0||X==0&&Y==r*2||X==r*2&&Y==r*2||X==r&&Y==r ? false : true; if (f) {let n1 = x+ra[I]>=0&&x+ra[I]<g[0] ? x+ra[I]:false; let n2 = y+ra[i]>=0&&y+ra[i]<g[1] ? y+ra[i]:false; if (typeof n1=="number"&&typeof n2=="number") {sight.push([n1,n2])}}}}

      return sight

    }

  }

  playerMove(e) {

    let p = this.data.player; let mv = p.moves; let x = e.dataset.x; let y = e.dataset.y;

    if (mv && e && e instanceof HTMLElement && this.reg[`${x}-${y}`].id !== 1) {

      let nX = e.dataset.x; let nY = e.dataset.y; let oX = p.position[0]; let oY = p.position[1];

      if (Math.abs(nX - oX) <= mv && Math.abs(nY - oY) <= mv && Math.abs(nX - oX) + Math.abs(nY - oY) <= mv) {

        this.data.player.position = [Number(nX),Number(nY)];

        let oXY = [oX,oY];
        let nXY = [nX,nY];

        this.registerTile(oXY,0);
        this.tileUpdateDisplay(oXY);
        this.tileEvents(nXY);
        
        this.registerTile(nXY,4);
        this.tileUpdateDisplay(nXY);
        this.playerSight();

      }

    }

  }

  tileEvents(xy) {

      let id = this.reg[xy.join("-")].id; let r = this.data.player.vision.range; let l = this.data.player.vision.tokensPerRangeLoss; let t = this.data.player.vision.tokens; let M = T.Math;
      let tc = this.data.map.coins.true.tokenRewards; let fc = this.data.map.coins.false.tokenRewards; let tcR = tc.random; let fcR = fc.random;

      switch (id) {

          case 2: this.data.player.coins.true += 1; this.data.player.vision.tokens = t + tc.base + M.R(tcR.added[0],tcR.added[1]) - M.R(tcR.removed[0],tcR.removed[1]); break;
          case 5: this.data.player.coins.false += 1; this.data.player.vision.tokens = t + fc.base + M.R(fcR.added[0],fcR.added[1]) - M.R(fcR.removed[0],fcR.removed[1]); break;

      }
      
      this.data.player.vision.tokens = this.data.player.vision.tokens < (this.data.player.vision.tokensPerRangeLoss * this.data.player.vision.maxRange) ? this.data.player.vision.tokens : (this.data.player.vision.tokensPerRangeLoss * this.data.player.vision.maxRange);
      this.data.player.vision.tokens = this.data.player.vision.tokens < (((this.data.player.vision.minRange - 1) * this.data.player.vision.tokensPerRangeLoss) + 1) ? ((this.data.player.vision.minRange - 1) * (this.data.player.vision.tokensPerRangeLoss) + 1) : this.data.player.vision.tokens;
      this.data.player.vision.tokens -= this.data.player.vision.tokens !== (((this.data.player.vision.minRange - 1) * this.data.player.vision.tokensPerRangeLoss) + 1) ? 1 : 0;
      this.data.player.vision.range = Math.ceil(this.data.player.vision.tokens / this.data.player.vision.tokensPerRangeLoss) > 0 ? Math.ceil(this.data.player.vision.tokens / this.data.player.vision.tokensPerRangeLoss) : 2;

  }

}