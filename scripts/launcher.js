(function(){

  // getting number of leves
  let T = TOOL.DOM; let lvls = LEVELS[0].length;
  // creating a table element, trI stands for every 2 tr which are a tr.title and a normal tr that contains the images, lvlI is needed to alternate 2 levels like 1-2,3-4,...etc
  let div = T.cE("div"); div.className = "center"; let tbl = T.cE("table"); let tbd = T.cE("tbody"); let trI = 0; lvlI = 1;

  for (let i=0;i<=lvls;i++) {

    let tr = T.cE("tr"); let tds = [T.cE("td"), T.cE("td")];

    // if the index is even
    if (i % 2 == 0) {

      tds.forEach(v => {

      	// creating p element that will contain the lvl number
        let p = T.cE("p");
        // adding to the tr element a .title class
        tr.className = "title";
        p.textContent = `Level ${trI+lvlI}`;
        // if there is a level with such index
        if (LEVELS[0][trI+lvlI-1]) {T.aC(p,v)};
        // level index is incremented by 1 to alternate the level titles 1-2,3-4,...etc
        lvlI = lvlI == 1 ? lvlI + 1 : 1;

      });

    }

    // if index is odd
    else {

      // in-game difficulty selector
      let difficulty = `<div class="difficulty" style="display: none; opacity: 0;"><button>Normal</button><button>Hard</button></div>`;

      tds.forEach(v => {

      	// creating the img elements
        let img = T.cE("img");
        img.className = "screenshot";
        // adding the dataURI of a level screenshot based on the trI and lvlI sum
        img.src = `screenshots/${trI+lvlI-1}.png`;
        img.alt = `lvl${trI+lvlI}`;
        // if there is a level with such index
        if (LEVELS[0][trI+lvlI-1]) {v.innerHTML = difficulty; T.aC(img,v)};
        // level index is incremented by 1 to alternate the level titles 1-2,3-4,...etc
        lvlI = lvlI == 1 ? lvlI + 1 : 1;

      });

      // alternating the pairs of tr.title and tr
      trI += 2;
    }

    tds.forEach(v=>{

      // appending the td(s) to the tr(s)
      T.aC(v,tr);

    });

    // appending tr to tbody, tbody to table, table to div
    T.aC(tr,tbd);
    T.aC(tbd,tbl);
    T.aC(tbl,div);

    // inserting the div after the beginning of the body tag
    document.body.insertAdjacentElement("afterbegin",div);

  }

  // getting all the .screenshot elements
  let tds = document.querySelectorAll(".screenshot");

  tds.forEach(v=>{

  	// adding a hover eventlistener
    v.addEventListener("mouseover",function(evt){

      // check if image is already selected
      let f = evt.target.classList.contains("selected");

      // if the querySelector finds a .selected element, removing its .selected class
      document.querySelectorAll(".selected").forEach(v=>{v.classList.remove("selected");v.offsetParent.firstElementChild.style.opacity="0.0";setTimeout(function(){v.offsetParent.firstElementChild.style.display="none"},750)});

      // if the image is not already .selected
      if (!f) {

      	// getting the in-game difficulty selector
        let difficulty = evt.target.offsetParent.firstElementChild;
        // displaying the difficulty div
        difficulty.style.display = "block";
        // giving the div an opacity with a timeout to create a visual effect
        setTimeout(function(){difficulty.style.opacity = "1.0"},50);
        // adding the .selected class to the hovered image
        evt.target.classList.add("selected");

      }

    });

  })

  // getting all the difficulty selector buttons
  let buttons = document.querySelectorAll("button");

  buttons.forEach(v=>{

    v.addEventListener("click",function(evt){

      // getting the difficulty from the textContent of the clicked button
      let difficulty = evt.target.textContent.toLowerCase();
      // getting the lvl index from the image.alt value
      let level = evt.target.offsetParent.nextElementSibling.alt.split("lvl")[1];

      // moving the location to "game/play.html" and adding the difficulty and the level in the location so "game/relativeSrcs.js" can understand what lvl and what difficulty needs to be loaded
      document.location=`game/play.html?d=${difficulty}&m=${Number(level)-1}`;

    });

  });

})()