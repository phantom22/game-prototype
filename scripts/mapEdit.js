(function(){

  let D = T.DOM;

  D.qSA("#edit",document,0).addEventListener("click",function(){

    let C = 0; let d = false; let meta = []; let c1; let c2;
    let g = D.qSA("#grid",document,0).value.split(" ");
    g = g.length == 1 ? [...g,...g].map(v=>Number(v)) : g;

    if (g && g.length == 2 && g[0] <= 101 && g[1] <=101 && g[0] > 0 && g[1] > 0) {

      D.rC(D.qSA(".settings")[0]);
      D.qSA("#export",document,0).style.display = "block";

      for (let i=0;i < g[0]*g[1];i++) {meta.push(0)}

      let instance = new gameInstance({position:false,moves:1,vision:{range:3,loss:6},gamemode:3},{grid:g,meta:meta.join("")});

      let typeId = {"air":0,"wall":1,"coin":2,"door":3};

      D.qSA(".air").forEach(v =>{

        function draw(e) {

          if (e && e instanceof HTMLElement) {

            let x = e.dataset.x; let y = e.dataset.y;

            instance.registerTile([x,y],C);
            instance.tileUpdateDisplay([x,y]);

          }

        }

        v.addEventListener("mousedown",function(evt){if (!d) {d = true; if (d && evt.target.className !== instance.tileClass(C)) {draw(evt.target)}}});
        v.addEventListener("mouseover", function(evt){ if (d && evt.target.className !== instance.tileClass(C)) {draw(evt.target)}});

      });

      document.addEventListener("mouseup",function(){if (d) {d = false}});

      D.qSA("#export",document,0).addEventListener("click",function(){

        let tds = D.qSA("td"); let m = [];
        tds.forEach(v =>{let c = v.className; m.push(typeId[c])});

        console.log(`new gameInstance({position:[x,y],moves:1,vision:{range:5,loss:6},gamemode:0},{g:[${g[0]},${g[1]}],meta:"${m.join("")}"})`);

      });

      document.addEventListener("keydown",function(evt){

        let k = evt.keyCode;

        if (k == 81) {C = 0}
        else if (k == 87) {C = 1}

      });

      function isOdd(n) {if(!isNaN(n)){return n % 2 !== 0}}

      if (isOdd(g[0]) && isOdd(g[1])) {c1 = [(g[0] - 1) / 2]; c2 = [(g[1] - 1) / 2]}
      else if (isOdd(g[0]) && !isOdd(g[1])) {c1 = [(g[0] - 1) / 2]; c2 = [(g[1])/2,((g[1])/2)-1]}
      else if (!isOdd(g[0]) && isOdd(g[1])) {c1 = [(g[0])/2,((g[0])/2)-1]; c2 = [(g[1] - 1) / 2]}
      else {c1 = [(g[0])/2,((g[0])/2)-1]; c2 = [(g[1])/2,((g[1])/2)-1]}

      for (let i=0;i<c1.length;i++) {

      	for (let I=0;I<c2.length;I++) {

      		let xy = [c1[i],c2[I]];

      		instance.registerTile(xy,2);
      		instance.tileUpdateDisplay(xy);

      	}

      }

    }

  });

})()