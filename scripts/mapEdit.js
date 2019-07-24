(function(){

  let D = T.DOM;

  D.qSA("#edit",document,0).addEventListener("click",function(){

    // C = color, d = isDrawing, c1 = centerPoints1, c2 = centerPoints2
    let C = 0; let d = false; let meta = []; let c1; let c2;
    // gettin the grid number/s from the #grid input value and splitting it
    let g = D.qSA("#grid",document,0).value.split(" ");
    // if grid didn't have any spaces in it but it's a number = [g,g]
    g = g.length == 1 ? [...g,...g].map(v=>Number(v)) : g;

    // if grid is defined and gridX and gridY is smaller than 101 and higher than 0
    if (g && g.length == 2 && g[0] <= 101 && g[1] <=101 && g[0] > 0 && g[1] > 0) {

      // removing the .settings div
      D.rC(D.qSA(".settings")[0]);
      // displaying the export button
      D.qSA("#export",document,0).style.display = "block";

      // creating a meta string made only of zeros (air tiles)
      for (let i=0;i < g[0]*g[1];i++) {meta.push(0)}

      // creating a game
      let instance = new gameInstance({gamemode:3},{grid:g,meta:meta.join("")});

      // creating this var to easily get the tile id derived from the tile class
      let typeId = {"air":0,"wall":1,"coin":2,"door":3};

      // adding an event listener to all the tds of the game table
      D.qSA(".air").forEach(v =>{

        function draw(e) {

          // if e is an element
          if (e && e instanceof HTMLElement) {

            // getting the coordinates of the tile
            let x = e.dataset.x; let y = e.dataset.y;

            // registering and updating the display of the clicked tile
            instance.registerTile([x,y],C);
            instance.tileUpdateDisplay([x,y]);

          }

        }

        // on mousedown the d becomes true so it's possible to draw with the mouse1 pressed, if the class of the tile it's the same as the drawed block.
        v.addEventListener("mousedown",function(evt){if (!d) {d = true; if (d && evt.target.className !== instance.tileClass(C)) {draw(evt.target)}}});
        // if the mouse1 was already pressed then this event will work
        v.addEventListener("mouseover", function(evt){ if (d && evt.target.className !== instance.tileClass(C)) {draw(evt.target)}});

      });

      // on mouse1 release d is set to false
      document.addEventListener("mouseup",function(){if (d) {d = false}});

      // adding an event listener to the export button
      D.qSA("#export",document,0).addEventListener("click",function(){

        // getting all the game tds
        let tds = D.qSA("td"); let m = [];
        // getting each tds class and transforming it into the corresponding in-game id and pushing it to an array so it can be joined into a string of numbers
        tds.forEach(v =>{let c = v.className; m.push(typeId[c])});

        // exporting the game data into the console
        console.log(`new gameInstance({grid:[${g[0]},${g[1]}],meta:"${m.join("")}"})`);

      });

      // adding an event listener for the keyboard press event
      document.addEventListener("keydown",function(evt){

        let k = evt.keyCode;

        // if "Q" is pressed then the block that will be drawed is air
        if (k == 81) {C = 0}
        // if "W" is pressed then the block that will be drawed is wall
        else if (k == 87) {C = 1}

      });

      // checks if a number is odd
      function isOdd(n) {if(!isNaN(n)){return n % 2 !== 0}}

      // if both numbers of the grid are odd then the center of the level will consist of 1 tile
      if (isOdd(g[0]) && isOdd(g[1])) {c1 = [(g[0] - 1) / 2]; c2 = [(g[1] - 1) / 2]}
      // if one of the numbers of the grid is odd the center will consist of 2 tiles
      else if (isOdd(g[0]) && !isOdd(g[1])) {c1 = [(g[0] - 1) / 2]; c2 = [(g[1])/2,((g[1])/2)-1]}
      else if (!isOdd(g[0]) && isOdd(g[1])) {c1 = [(g[0])/2,((g[0])/2)-1]; c2 = [(g[1] - 1) / 2]}
      //if both the numbers of the grid are even the center will consist of 4 tiles
      else {c1 = [(g[0])/2,((g[0])/2)-1]; c2 = [(g[1])/2,((g[1])/2)-1]}

      // c1 = centerX axis
      for (let i=0;i<c1.length;i++) {

        // c2 = centerY axis
        for (let I=0;I<c2.length;I++) {

          // encasing both the coordinates into an array
          let xy = [c1[i],c2[I]];

          // registering the coins as the center
          instance.registerTile(xy,2);
          // and updating the central tiles
          instance.tileUpdateDisplay(xy);

        }

      }

    }

  });

})()