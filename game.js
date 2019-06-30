let T = TOOL;

class gameInstance {

  constructor(player = {position,moves,gamemode}, map = {grid,meta}) {

    map.grid = map.grid && !Array.isArray(map.grid) && !isNaN(map.grid) ? [map.grid,map.grid] : map.grid;
    map.grid = map.grid && Array.isArray(map.grid) && !isNaN(map.grid.reduce((a,b)=>a+b)) ? map.grid : undefined; // if map.grid is an array of number
    map.meta = map.meta && map.meta.split("").length == map.grid[0]*map.grid[1] ? map.meta.split("").map(v=>Number(v)) : undefined; // if map.meta is an array of numbers and its length should equal to the grid dimension
    player.position = Array.isArray(player.position) && !isNaN(player.position.reduce((a,b)=>a+b)) ? player.position : false; // if player.position is an array of numbers
    player.moves = player.moves && !isNaN(player.moves) ? player.moves : 1; // if player.moves is a number higher than 0
    player.gamemode = !isNaN(player.gamemode) ? player.gamemode : 0; // if player.gamemode is a number

    if (map.grid && !isNaN(map.meta.reduce((a,b)=>a+b)) && typeof player.position !== "undefined" && player.moves && typeof player.gamemode !== "undefined") { // if all of the above conditions were satisfied

      let fl = player.gamemode == 3 ? true : undefined;

      this.info = {map:map,player:player};
      this.reg = {};
      this.createMap();
      this.registerMap();
      this.mapRender(fl);

    }

  }

  tileClass(typeId) {

    let tileTypes = {0:"air",1:"wall",2:"coin",3:"door",4:"player"};

    if (!isNaN(typeId)) {

      return String(tileTypes[typeId]);

    }

  }

  createMap() {

    let D = T.DOM;

    if (this.info.map.meta && !this.info.map.element) {

      let tbl = D.cE("table"); let tbd = D.cE("tbody");

      for (let i=0;i < this.info.map.grid[1];i++) {

        let r = D.cE("tr");

        for (let I=0;I < this.info.map.grid[0];I++) {

          let c = D.cE("td");
          c.dataset.x = I;
          c.dataset.y = i;

          D.aC(c,r);

        }

        D.aC(r,tbd);

      }

      D.aC(tbd,tbl);

      if (this.info.player.position !== false) {

        D.qSA("td",tbl).forEach(v =>{

          v.addEventListener("click",function(evt){let id = instance.reg[`${evt.target.dataset.x}-${evt.target.dataset.y}`].id; if (id !== 1) {instance.playerMove(evt.target)}});
          
        })

      }

      this.info.map.element = tbl;

    }

  }

  registerMap() {

    let map = this.info.map;

    if (map.meta && map.element instanceof HTMLElement) {

      for (let i=0;i < map.meta.length;i++) {

        let x = i;
        while (x >= map.grid[0]) {x = x - map.grid[0]};
        let y = Math.floor(i / map.grid[0]);

        this.registerTile([x,y],map.meta[i]);

      }

      if (this.info.player.position !== false) {

        let playerXY = this.info.player.position;

        this.registerTile(playerXY,4);

      }

    }

  }

  registerTile(xy,typeId) {

    let D = T.DOM;

    if (xy && Array.isArray(xy) && !isNaN(typeId)) {

      let r = `${xy[0]}-${xy[1]}`;

      let e = D.qSA(`[data-x="${xy[0]}"][data-y="${xy[1]}"]`,this.info.map.element);

      this.reg[r] = {id:typeId,class:this.tileClass(typeId),element:e[0]};

    }

  }

  tileUpdateDisplay(xy) {

    if (xy && Array.isArray(xy)) {

      let r = `${xy[0]}-${xy[1]}`;

      if (this.reg[r]) {

        let reg = this.reg[r];
        this.tileClear(xy);

        reg.element.classList.add(reg.class);

      }

    }

  }

  tileClear(xy) {

    if (xy && Array.isArray(xy)) {

      let r = `${xy[0]}-${xy[1]}`;

      if (this.reg[r]) {

        let elemClasses = this.reg[r].element.classList;

        elemClasses.remove("air");
        elemClasses.remove("wall");
        elemClasses.remove("coin");
        elemClasses.remove("door");
        elemClasses.remove("player");

      }

    }

  }

  mapRender(flag) {

    if (this.info.map.element) {

      let D = T.DOM;

      D.aC(this.info.map.element);

      if (this.info.player.position) {

        let xy = this.info.player.position;

        this.tileUpdateDisplay(xy);
        this.playerSight();

      }

      if (flag) {

        Object.keys(this.reg).forEach(v => {

          let xy = v.split("-");
          this.tileUpdateDisplay(xy)

        });

      }

    }

  }

  playerMove(e) {

    let player = this.info.player; let moves = player.moves;

    if (moves && e && e instanceof HTMLElement && player.position) {

      let nX = e.dataset.x; let nY = e.dataset.y; let oX = player.position[0]; let oY = player.position[1];

      if (Math.abs(nX - oX) <= moves && Math.abs(nY - oY) <= moves && Math.abs(nX - oX) + Math.abs(nY - oY) <= moves) {

        this.info.player.position = [Number(nX),Number(nY)];

        let oXY = [oX,oY];
        let nXY = [nX,nY];

        this.registerTile(oXY,0);
        this.tileUpdateDisplay(oXY);
        this.registerTile(nXY,4);
        this.playerSight();
        this.tileUpdateDisplay(nXY);

      }

    }

  }

  playerSight() {

    let xy = this.info.player.position;

     if (!isNaN(xy.reduce((a,b)=>a+b))) {

        if (this.info.player.sight && this.info.player.gamemode == 1) {

          let s = this.info.player.sight;
          s.forEach(v => this.tileClear(v));
          this.info.player.sight = [];

        }

        let x = xy[0]; let y = xy[1];

        let sight = [[x-1,y-2],[x,y-2],[x+1,y-2],[x-2,y-1],[x-1,y-1],[x,y-1],[x+1,y-1],[x+2,y-1],[x-2,y],[x-1,y],[x+1,y],[x+2,y],[x-2,y+1],[x-1,y+1],[x,y+1],[x+1,y+1],[x+2,y+1],[x-1,y+2],[x,y+2],[x+1,y+2],[x-2,y-3],[x-1,y-3],[x,y-3],[x+1,y-3],[x+2,y-3],[x-3,y-2],[x-2,y-2],[x+2,y-2],[x+3,y-2],[x-3,y-1],[x+3,y-1],[x-3,y],[x+3,y],[x-3,y+1],[x+3,y+1],[x-3,y+2],[x-2,y+2],[x+2,y+2],[x+3,y+2],[x-2,y+3],[x-1,y+3],[x,y+3],[x+1,y+3],[x+2,y+3]];

        if (this.info.player.gamemode == 0) {
          sight.forEach(v => this.tileUpdateDisplay(v));
        }
        else if (this.info.player.gamemode == 1) {
          this.info.player.sight = sight;
          sight.forEach(v => this.tileUpdateDisplay(v));
        }

     }

  }

}