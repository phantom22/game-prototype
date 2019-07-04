(function(){

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

			document.location=`html/play.html?d=${difficulty}&m=${level}`;

		})

	});

})()