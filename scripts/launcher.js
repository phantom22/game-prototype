(function(){

  let T = TOOL.DOM; let lvls = LEVELS.length; let div = T.cE("div"); div.className = "center"; let tbl = T.cE("table"); let tbd = T.cE("tbody"); let trI = 0; lvlI = 1;

  for (let i=0;i<=lvls;i++) {

      let tr = T.cE("tr"); let tds = [T.cE("td"), T.cE("td")];

    if (i % 2 == 0) {

      tds.forEach(v => {
          let p = T.cE("p");
          tr.className = "title";
          p.textContent = `Level ${trI+lvlI}`;
          if (LEVELS[trI+lvlI-1]) {T.aC(p,v)};
          lvlI = lvlI == 1 ? lvlI + 1 : 1;
        }
      );

    }

    else {

      let difficulty = `<div class="difficulty" style="display: none; opacity: 0;"><button>Normal</button><button>Hard</button></div>`;

      tds.forEach(v => {
        let img = T.cE("img");
        img.className = "screenshot";
        img.src = `${SCREENSHOTS[trI+lvlI-1]}`;
        img.alt = `lvl${trI+lvlI}`;
        if (LEVELS[trI+lvlI-1]) {v.innerHTML = difficulty; T.aC(img,v)};
        lvlI = lvlI == 1 ? lvlI + 1 : 1;
      });

      trI += 2;

    }

    tds.forEach(v=>{
      T.aC(v,tr);
      T.aC(v,tr);
    });

    T.aC(tr,tbd);
    T.aC(tbd,tbl);
    T.aC(tbl,div);
    document.body.insertAdjacentElement("afterbegin",div);

  }

  let tds = document.querySelectorAll(".screenshot");

  tds.forEach(v=>{

    v.addEventListener("mouseover",function(evt){

      let f = evt.target.classList.contains("selected");

      document.querySelectorAll(".selected").forEach(v=>{v.classList.remove("selected");v.offsetParent.firstElementChild.style.opacity="0.0";setTimeout(function(){v.offsetParent.firstElementChild.style.display="none"},750)});

      if (!f) {

        let difficulty = evt.target.offsetParent.firstElementChild;
        difficulty.style.display = "block";
        setTimeout(function(){difficulty.style.opacity = "1.0"},50);
        evt.target.classList.add("selected");

      }

    });

  })



  let buttons = document.querySelectorAll("button");

  buttons.forEach(v=>{

    v.addEventListener("click",function(evt){

      let difficulty = evt.target.textContent.toLowerCase();
      let level = evt.target.offsetParent.nextElementSibling.alt.split("lvl")[1];

      document.location=`game/play.html?d=${difficulty}&m=${level}`;

    })

  });

})()

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data
        callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

        // ... or get as Data URI
        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}