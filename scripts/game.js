let T = TOOL;

class gameInstance {

  constructor(player = {position,moves,vision,gamemode}, map = {grid,meta}) {

    let pl = player; let p = pl.position; let mv = pl.moves; let v = pl.vision; let gm = pl.gamemode; let g = map.grid; let m = map.meta;

    g = g && !Array.isArray(g) && !isNaN(g) ? [g,g] : g;
    g = g && Array.isArray(g) && !isNaN(g.reduce((a,b)=>a+b)) ? g : undefined;
    m = m && m.split("").length == g[0]*g[1] ? m.split("").map(v=>Number(v)) : undefined;
    p = Array.isArray(p) && !isNaN(p.reduce((a,b)=>a+b)) ? p : false;
    v = !isNaN(v) ? v : undefined;
    mv = mv && !isNaN(mv) ? mv : 1;
    gm = !isNaN(gm) ? gm : 0;

    if (g && !isNaN(m.reduce((a,b)=>a+b)) && typeof p !== "undefined" && mv && !isNaN(v) && typeof gm !== "undefined") {

      let f = gm == 3 ? true : undefined;

      this.info = {map:map,player:pl};
      this.reg = {};
      this.createMap();
      this.registerMap();
      this.mapRender(f);

    }

  }

  tileClass(typeId) {

    let tT = {0:"air",1:"wall",2:"coin",3:"door",4:"player"};
    if (!isNaN(typeId)) {return String(tT[typeId])}

  }

  createMap() {

    let D = T.DOM; let m = this.info.map;

    if (m.meta && !m.element) {

      let tbl = D.cE("table"); let tbd = D.cE("tbody");
      for (let i=0;i < m.grid[1];i++) {let r = D.cE("tr"); for (let I=0;I < m.grid[0];I++) {let c = D.cE("td"); c.dataset.x = I; c.dataset.y = i; D.aC(c,r)} D.aC(r,tbd)}
      D.aC(tbd,tbl);

      this.info.map.element = tbl;

    }

  }

  registerMap() {

    let m = this.info.map; let p = this.info.player; let g = m.grid;

    if (m.meta && m.element instanceof HTMLElement) {

      for (let i=0;i < m.meta.length;i++) {

        let x = i; while (x >= g[0]) {x = x - g[0]}; let y = Math.floor(i / g[0]);
        this.registerTile([x,y],m.meta[i]);

      }

      if (p.position !== false) {

        let XY = p.position;
        this.registerTile(XY,4);

      }

    }

  }

  registerTile(xy,typeId) {

    let D = T.DOM; let m = this.info.map;

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

    let m = this.info.map; let p = this.info.player;

    if (m.element) {

      let D = T.DOM;
      D.aC(m.element);

      if (p.position) {let xy = p.position; this.playerSight()}

      if (flag) {Object.keys(this.reg).forEach(v => {let xy = v.split("-"); this.tileUpdateDisplay(xy)})}

    }

  }

  playerSight() {

    let p = this.info.player; let xy = p.position; let s = p.sight; let gm = p.gamemode;

     if (!isNaN(xy.reduce((a,b)=>a+b))) {

        if (s) {

          if (gm == 1) {s.forEach(v => this.tileClear(v))}

          else if(gm == 0) {

            let w = TOOL.Array.rVI("true",s.map(v=>this.reg[`${v[0]}-${v[1]}`]!==undefined&&this.reg[`${v[0]}-${v[1]}`].id==1));
            let a = TOOL.Array.rVI("true",s.map(v=>this.reg[`${v[0]}-${v[1]}`]!==undefined&&this.reg[`${v[0]}-${v[1]}`].id==0));
            w.forEach(v=>{this.tileClear(s[v])});
            a.forEach(v=>{let c=this.reg[`${s[v][0]}-${s[v][1]}`].element;c.classList.remove("light")});

          }

          this.info.player.sight = [];

        }

        let x = xy[0]; let y = xy[1];
        let sg = this.sightRadius(p.vision);

        if (gm == 0) {

          let a = TOOL.Array.rVI("true",sg.map(v=>this.reg[`${v[0]}-${v[1]}`]!==undefined&&this.reg[`${v[0]}-${v[1]}`].id==0));
          a.forEach(v=>{let c=this.reg[`${sg[v][0]}-${sg[v][1]}`].element;c.classList.add("light")});
        
        }

        this.info.player.sight = sg;
        sg.forEach(v => this.tileUpdateDisplay(v));

     }

  }

  sightRange(r) {

    if (r && !isNaN(r)) {let n = -r; let range = []; for (let i=0;i<(r*2)+1;i++) {range.push(n); n += 1} return range}

  }

  sightRadius(r) {

    if (r && !isNaN(r)) {

      let xy = this.info.player.position; let x = xy[0]; let y = xy[1]; let ra = this.sightRange(r); let sight = [];
      for (let i=0;i<ra.length;i++) {for (let I=0;I<ra.length;I++) {let X = I; let Y = i; let f = true; f = X==0&&Y==0||X==r*2&&Y==0||X==0&&Y==r*2||X==r*2&&Y==r*2 ? false : true; if (f) {sight.push([x+ra[I],y+ra[i]])}}}
      return sight

    }

  }

  playerMove(e) {

    let p = this.info.player; let mv = p.moves; let x = e.dataset.x; let y = e.dataset.y;

    if (mv && e && e instanceof HTMLElement && this.reg[`${x}-${y}`].id == 0) {

      let nX = e.dataset.x; let nY = e.dataset.y; let oX = p.position[0]; let oY = p.position[1];

      if (Math.abs(nX - oX) <= mv && Math.abs(nY - oY) <= mv && Math.abs(nX - oX) + Math.abs(nY - oY) <= mv) {

        this.info.player.position = [Number(nX),Number(nY)];

        let oXY = [oX,oY];
        let nXY = [nX,nY];

        this.registerTile(oXY,0);
        this.tileUpdateDisplay(oXY);
        this.registerTile(nXY,4);
        this.tileUpdateDisplay(nXY);
        
        this.playerSight();

      }

    }

  }

}