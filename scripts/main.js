(function(){

	document.addEventListener("keydown", function(event){

		let xy = instance.data.player.position; let k = event.keyCode; let x = xy[0]; let y = xy[1]; let s; let e; let id;

		if (k == 87) {s = [x,y-1]}
		else if (k == 83) {s = [x,y+1]}
		else if (k == 65) {s = [x-1,y]} 
		else if (k == 68) {s = [x+1,y]}

		if (s) {

			let r = instance.reg[`${s[0]}-${s[1]}`];
			id = r ? r.id : undefined;
			e = r ? r.element : undefined;

		}

		if (e && e instanceof HTMLElement && id !== 1) {instance.playerMove(e)}

	});

})()