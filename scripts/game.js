let T = TOOL;

class gameInstance {

  constructor(player = {position,moves,vision,gamemode}, map = {grid,meta}) {

    let pl = player; let p = pl.position; let mv = pl.moves; let v = pl.vision; let gm = pl.gamemode; let g = map.grid; let m = map.meta; let r = v.range; let l = v.loss;

    g = g && !Array.isArray(g) && !isNaN(g) ? [g,g] : g;
    g = g && Array.isArray(g) && !isNaN(g.reduce((a,b)=>a+b)) ? g : undefined;
    m = m && m.split("").length == g[0]*g[1] ? m.split("").map(v=>Number(v)) : undefined;
    p = Array.isArray(p) && !isNaN(p.reduce((a,b)=>a+b)) || typeof p == "boolean" ? p : false;
    r = !isNaN(r) ? r : undefined;
    l = !isNaN(l) ? l : undefined;
    mv = mv && !isNaN(mv) ? mv : 1;
    gm = !isNaN(gm) ? gm : 0;

    if (g && !isNaN(m.reduce((a,b)=>a+b)) && typeof p !== "undefined" && mv && !isNaN(r) && !isNaN(l) && typeof gm !== "undefined") {

      let f = gm == 3 ? true : undefined;

      this.data = {map:map,player:pl};
      this.reg = {};
      this.createMap();
      this.registerMap(f);
      this.mapRender(f);

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

    let coins = 10; let falseCoins = 40; let M = T.Math;

    let reg = Object.keys(this.reg); let a = reg.filter(v=>this.reg[v].id==0);

    for (let i=0;i <= (coins + falseCoins);i++) {

      let n = M.R(a.length); let id = i < coins ? 2 : 5;
      this.registerTile(a[n].split("-"),id);

    }

    this.data.map.coins = {real:coins,false:falseCoins};

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
      D.aC(m.element);

      if (p.position) {let xy = p.position; this.playerSight(); this.tileUpdateDisplay(xy); this.data.player.coins = 0; this.data.player.vision.tokens = p.vision.range * p.vision.loss;}

      if (flag) {Object.keys(this.reg).forEach(v => {let xy = v.split("-"); this.tileUpdateDisplay(xy)})}

    }

  }

  playerSight() {

    let p = this.data.player; let xy = p.position; let s = p.lastSight; let gm = p.gamemode;

     if (!isNaN(xy.reduce((a,b)=>a+b))) {

        if (s) {

          if (gm == 1) {s.forEach(v => this.tileClear(v))}

          else if(gm == 0) {

            document.querySelectorAll(".wall").forEach(v=>v.classList.remove("wall"));
            document.querySelectorAll(".light").forEach(v=>v.classList.remove("light"));
            document.querySelectorAll(".coin").forEach(v=>{v.classList.remove("coin");v.classList.add("air")});

          }

          this.data.player.lastSight = [];

        }

        let x = xy[0]; let y = xy[1];
        let sg = this.sightRadius();

        if (gm == 0) {

          let a = sg.filter(v=>this.reg[`${v[0]}-${v[1]}`]!==undefined&&this.reg[`${v[0]}-${v[1]}`].id==0);
          a.forEach(v=>{let c=this.reg[`${v[0]}-${v[1]}`].element;c.classList.add("light")});
        
        }

        this.data.player.lastSight = sg;
        sg.forEach(v => this.tileUpdateDisplay(v));

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

        let l = p.vision.loss; let t = p.vision.tokens;
        this.data.player.vision.tokens -= t !== l+1 ? 1 : 0; this.data.player.vision.range = Math.ceil(t / l) > 0 ? Math.ceil(t / l) : 2;
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

      let id = this.reg[xy.join("-")].id; let r = this.data.player.vision.range; let l = this.data.player.vision.loss; let t = this.data.player.vision.tokens; let bT = t; let M = T.Math;

      switch (id) {

          case 2: this.data.player.coins += 1; this.data.player.vision.tokens = t + Math.floor(l * 1.1) + M.R(5,(l*2)+1) - M.R(0,(l*2)-2); break;
          case 5: this.data.player.vision.tokens = t + Math.floor(l * 0.5) + M.R(2,l+1) - M.R(0,l-1); break;

      }
      
      this.data.player.vision.tokens = this.data.player.vision.tokens < (this.data.player.vision.loss * 7) ? this.data.player.vision.tokens : (this.data.player.vision.loss * 7)-1;
      this.data.player.vision.tokens = this.data.player.vision.tokens < this.data.player.vision.loss+1 ? this.data.player.vision.loss+1 : this.data.player.vision.tokens;

  }

}

//for (i=0;i<=10000;i++){let diameter = ((i+1)*2)+1; let square = (diameter*diameter)-5; let move = ((i+1)*4)+2; console.log(`radius = ${i+1} && diameter = ${diameter} => efficiency = ${100-move/(square/100)}% (calculating only ${move} units of ${square})`)}