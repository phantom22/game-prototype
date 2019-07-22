let instance;
(function(){

    let L = String(document.location);
    L.slice(0,L.lastIndexOf("/"));
    const ROOT = L.slice(0,L.slice(0,L.lastIndexOf("/")).lastIndexOf("/")) + "/";
    
    let tScript = document.createElement("script");
    tScript.src = ROOT + "scripts/tool.js";
    document.body.appendChild(tScript);

    tScript.onload = function() {

        let lScript = document.createElement("script");
        lScript.src = ROOT + "scripts/levels.js";
        document.body.appendChild(lScript);

        lScript.onload = function() {

            let gScript = document.createElement("script");
            gScript.src = ROOT + "scripts/game.js";
            document.body.appendChild(gScript);

            gScript.onload = function() {

                let l = LEVELS; let a = String(document.location).slice(-12).split("d=")[1].split("&m="); a[1] = Number(a[1])-1;

                instance = new gameInstance({position:true,moves:1,vision:{initialRange:l[a[0]].range,tokensPerRangeLoss:l[a[0]].loss,maxRange:l[a[0]].range+2,minRange:2},gamemode:l[a[0]].gamemode},{grid:l[a[1]].grid,meta:`${l[a[1]].meta}`,coins:{true:{quantity:10,tokenRewards:{base:"*1.3",random:{added:[6,"*2 +2"],removed:[3,"*2 -3"]}}},false:{quantity:40,tokenRewards:{base:"*0.6",random:{added:[3,"*1 +1"],removed:[1,"*1 -2"]}}}}});

                document.addEventListener("keydown", function(event){

                    let xy = instance.data.player.position; let k = event.keyCode; let x = xy[0]; let y = xy[1]; let s; let e; let id;

                    if (k == 87) {s = [x,y-1]}
                    else if (k == 83) {s = [x,y+1]}
                    else if (k == 65) {s = [x-1,y]} 
                    else if (k == 68) {s = [x+1,y]}
                    else if (k == 38) {instance.updateSelectedSlot(-1)}
                    else if (k == 40) {instance.updateSelectedSlot(1)}

                    if (s) {

                        let r = instance.reg[`${s[0]}-${s[1]}`];
                        id = r ? r.id : undefined;
                        e = r ? r.element : undefined;

                    }

                    if (e && e instanceof HTMLElement && id !== 1) {instance.playerMove(e)}

                });

            }

        }

    }

})();