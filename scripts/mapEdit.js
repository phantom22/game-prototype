(function(){

  let D = T.DOM;

  // adding the event to the #edit button
  D.qSA("#edit",document,0).addEventListener("click",function(){

    // C = color, d = isDrawing, c1 = centerPoints1, c2 = centerPoints2
    let C = 0; let d = false; let meta = []; let bannedTilesFromRandomizing = []; let imported = false; let mapBannedTiles; let c1; let c2;
    // gettin the grid number/s from the #grid input value and splitting it
    let g = D.qSA("#grid",document,0).value.split(" ");
    // if grid didn't have any spaces in it but it's a number = [g,g]
    g = g.length == 1 ? [...g,...g].map(v=>Number(v)) : g;
    // if grids first value is "level" and the second value is a number
    g = g.length == 2 && typeof g[0] == "string" && g[0] == "level" && !isNaN(Number(g[1])) ? [g[0],Number(g[1])] : g;
    // if grid has 3 values, the first two values are the resolution numbers and the third one is the meta of the map
    g = g.length == 3 ? [Number(g[0]),Number(g[1]),g[2].slice(1,-1).split("").map(v=>Number(v))] : g;

    // if grid is defined and gridX and gridY is smaller than 101 and higher than 0
    if (g && g.length <= 3 && g[0] <= 101 && g[1] <=101 && g[0] > 0 && g[1] > 0 || g && g[0] == "level" && !isNaN(g[1])) {

      if (g[0] == "level") {

      	// setting imported to true
      	imported = true;
      	// setting map meta, map bannedTilesFromRandomizing and map grid based on the level index from the LEVELS list
        meta = LEVELS[g[1]].meta.split("").map(v=>Number(v));
        mapBannedTiles = LEVELS[g[1]].bannedTilesFromRandomizing;
        g = LEVELS[g[1]].grid;

      }

      // removing the .settings div
      D.rC(D.qSA(".settings")[0]);
      // displaying the export button
      D.qSA("#export",document,0).style.display = "block";

      // if map meta isn't defined by the user
      if (!g[2] && !meta) {
        // creating a meta string made only of zeros (air tiles)
        for (let i=0;i < g[0]*g[1];i++) {meta.push(0)}
      }
      // if map meta is defined by the user
      else if (!meta) {
        // setting meta to the g[2] value
        meta = g[2];
      }

      // creating a game
      let instance = new gameInstance({gamemode:3},{grid:[g[0],g[1]],meta:meta.join("")});

      // if the map was imported from the already existing levels and mapBannedTiles is an array with length greater than 0
      if (mapBannedTiles.length !== 0 && imported) {

        mapBannedTiles.forEach(v=>{

          // adding the .banned class to all the tile coordinates in the mapBannedTiles array
          D.qSA(`[data-x="${v[0]}"][data-y="${v[1]}"]`)[0].classList.add("banned");

        });

      }

      // creating this var to easily get the tile id derived from the tile class
      let typeId = {"air":0,"wall":1,"coin":2,"door":3};

      // adding an event listener to all the tds of the game table
      D.qSA("td").forEach(v =>{

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

        // on mousedown the d becomes true so it's possible to draw with the mouse1 pressed, if the class of the tile it's the same as the drawed block. else if C is equal to 2 it means that the drawed block will become banned, checking if the tile cointains already the .banned class yes = then removing it, no = adding it
        v.addEventListener("mousedown",function(evt){if (!d) {d = true; if (d && C !== 2 && evt.target.className !== instance.tileClass(C) && !evt.target.classList.contains("banned")) {draw(evt.target)} else if (d && C == 2 && evt.target.classList.contains("air")) {evt.target.classList.contains("banned") ? evt.target.classList.remove("banned") : evt.target.classList.add("banned")}}});
        // if the mouse1 was already pressed then this event will work
        v.addEventListener("mouseover", function(evt){ if (d && C !== 2 && evt.target.className !== instance.tileClass(C) && !evt.target.classList.contains("banned")) {draw(evt.target)}});

      });

      // on mouse1 release d is set to false
      document.addEventListener("mouseup",function(){if (d) {d = false}});

      // adding an event listener to the export button
      D.qSA("#export",document,0).addEventListener("click",function(){

        // resetting the bannedTilesFromRandomizing variable
        bannedTilesFromRandomizing = [];

        // getting all the game tds
        let tds = D.qSA("td"); let bannedTiles = D.qSA(".banned"); let m = [];
        // getting each tds class and transforming it into the corresponding in-game id and pushing it to an array so it can be joined into a string of numbers
        tds.forEach(v =>{let c = v.className; m.push(typeId[c])});
        // pushing the coordinates of the .banned tiles into bannedTilesFromRandomizing
        bannedTiles.forEach(v=>bannedTilesFromRandomizing.push([Number(v.dataset.x),Number(v.dataset.y)]))


        // exporting the game data into the console
        console.log(`new gameInstance({grid:[${g[0]},${g[1]}],meta:"${m.join("")}",bannedTilesFromRandomizing:${JSON.stringify(bannedTilesFromRandomizing)}})`);

      });

      // adding an event listener for the keyboard press event
      document.addEventListener("keydown",function(evt){

        let k = evt.keyCode;

        // if "Q" is pressed then the block that will be drawed is air
        if (k == 81) {C = 0}
        // if "W" is pressed then the block that will be drawed is wall
        else if (k == 87) {C = 1}
        // if "E" is pressed then the selected blocks will be banned from randomizing
        else if (k == 69) {C = 2}

      });

      // if map meta wasn't defined by the user or it wasn't an imported map from the already existing levels
      if (!g[2] && !imported) {

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

    }

  });

})()