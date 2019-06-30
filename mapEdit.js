let cc = 0;

(function(){

  let D = T.DOM;

  D.qSA("#edit",document,0).addEventListener("click",function(){

    let draw = false;

    let grid = D.qSA("#grid",document,0).value.split(" "); let meta = [];

    grid = grid.length == 1 ? [grid,grid] : grid;

    if (grid && grid.length == 2 && grid[0] <= 101 && grid[1] <=101 && grid[0] > 0 && grid[1] > 0) {

      D.qSA("#export",document,0).style.display = "block";

      for (let i=0;i < grid[0]*grid[1];i++) {

        meta.push(0);

      }

      D.rC(D.qSA(".settings")[0]);

      let instance = new gameInstance({position:false,moves:1,gamemode:3},{grid:grid,meta:meta.join("")});

      let typeId = {"air":0,"wall":1,"coin":2,"door":3};

      D.qSA(".air").forEach(v =>{

        function tile(evt) {

          if (evt && evt instanceof HTMLElement) {

            let x = evt.dataset.x; let y = evt.dataset.y;

            let cl = instance.reg[`${x}-${y}`].element.className;

            evt.classList.remove(cl);

            evt.classList.add(instance.tileClass(cc));

          }

        }

        v.addEventListener("mousedown",function(evt){

          if (!draw) {

          draw = true;

            if (draw && evt.target.className !== instance.tileClass(cc)) {

              tile(evt.target);

            }

          }

        });

        v.addEventListener("mouseover", function(evt){

          if (draw && evt.target.className !== instance.tileClass(cc)) {

            tile(evt.target);

          }

        });

      });

      document.addEventListener("mouseup",function(){

        if (draw) {

          draw = false;

        }

      });

      D.qSA("#export",document,0).addEventListener("click",function(){

        let tds = D.qSA("td"); let meta = [];

        tds.forEach(v =>{

          let cl = v.className;

          meta.push(typeId[cl]);

        });

        console.log(`new gameInstance({position:[x,y],moves:1,gamemode:0},{grid:[${grid[0]},${grid[1]}],meta:"${meta.join("")}"})`);

      });

      document.addEventListener("keydown",function(evt){

        let k = evt.keyCode;
        if (k == 81) {
          cc = 0;
        }

        else if (k == 87) {
          cc = 1;
        }

        else if (k == 69) {
          cc = 2;
        }
        
        else if (k == 82) {
          cc = 3;
        }

      });

      function isOdd(n) {if(!isNaN(n)){return n % 2 !== 0}}

      if (isOdd(grid[0]) && isOdd(grid[1])) {

        let c1 = (grid[0] - 1) / 2;
        let c2 = (grid[1] - 1) / 2;

        instance.registerTile(`${c1}-${c2}`,2);

      }

      else if (isOdd(grid[0]) && !isOdd(grid[1])) {

        let c1 = (grid[0] - 1) / 2;
        let c2 = [(grid[1])/2,((grid[1])/2)-1];

        instance.registerTile(`${c1}-${c2[0]}`,2);
        instance.registerTile(`${c1}-${c2[1]}`,2);

      }

      else if (!isOdd(grid[0]) && isOdd(grid[1])) {

        let c1 = [(grid[0])/2,((grid[0])/2)-1];
        let c2 = (grid[1] - 1) / 2;

        instance.registerTile(`${c1[0]}-${c2}`,2);
        instance.registerTile(`${c1[1]}-${c2}`,2);

      }

      else {

        let c1 = [(grid[0])/2,((grid[0])/2)-1];
        let c2 = [(grid[1])/2,((grid[1])/2)-1];

        instance.registerTile(`${c1[0]}-${c2[0]}`,2);
        instance.registerTile(`${c1[0]}-${c2[1]}`,2);
        instance.registerTile(`${c1[1]}-${c2[0]}`,2);
        instance.registerTile(`${c1[1]}-${c2[1]}`,2);

      }

    }

  });

})()