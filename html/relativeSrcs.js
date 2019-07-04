//scripts/tool.js
//scripts/game.js
//scripts/levels.js
//scripts/play.js

//styles/style.css

let L = String(document.location);
L.slice(0,L.lastIndexOf("/"));
let rt = L.slice(0,L.slice(0,L.lastIndexOf("/")).lastIndexOf("/"))+"/";

(function(){

	let files = {
		"script":["scripts/tool.js","scripts/levels.js","scripts/game.js"],
		"link":["styles/style.css"]
	}

	/*let head = document.getElementsByTagName("head")[0]
	let link = document.createElement("link");
	link.setAttribute("href",`${rt + files.link[0]}`);
	link.setAttribute("type","text/css");
	link.setAttribute("rel","style");
	head.appendChild(link);*/

	files.script.forEach(v=>{
		let script = document.createElement("script");
		script.src = rt + v;
		document.body.appendChild(script);
	});

	setTimeout(function(){
		let script = document.createElement("script");
		script.src = rt + "scripts/play.js";
		document.body.appendChild(script);
	},100)

})();