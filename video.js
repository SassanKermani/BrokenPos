/*==============================
=            Set Up            =
==============================*/

let fs = require('fs');
let episodes = [];

let currentShow;
let currentEpisode;

let speed = document.getElementById(`videoPlayer`).playbackRate;
let volume = document.getElementById(`videoPlayer`).volume;
let muteTureFalse = false;

/*=====  End of Set Up  ======*/

/*===============================================
=            Adding Videos Functions            =
===============================================*/


let getShows = ()=>{
	fs.readdir(`./db`, (err, dbFileNames)=>{
		// console.log(dbFileNames);
		for(let i = 0; i < dbFileNames.length; i++){
			let tempButton = document.createElement(`button`);
			tempButton.innerHTML = dbFileNames[i];
			tempButton.addEventListener(`click`, ()=>{
				// console.log(`test`);
				getEpisodesForShow(dbFileNames[i])
				currentShow = dbFileNames[i];
				document.getElementById(`showThatIsPlaying`).innerHTML = `Show : ${dbFileNames[i]}`
			});
			document.getElementById(`showsDiv`).appendChild(tempButton);
		}
	});
}

let getEpisodesForShow = (showName)=>{
	fs.readFile(`./db/${showName}`, (err, data)=>{
		// console.log(JSON.parse(data));
		episodes = JSON.parse(data).vids;
		// console.log(episodes);
		addEpisodesToPage()
	});
}

let addEpisodesToPage = ()=>{
	while (document.getElementById(`episodes`).firstChild) {
		document.getElementById(`episodes`).removeChild(document.getElementById(`episodes`).firstChild);
	}
	for(let i = 0; i < episodes.length; i++){
		let tempButton = document.createElement(`button`);
		tempButton.innerHTML = episodes[i];
		tempButton.addEventListener(`click`, ()=>{
			changeEpisode(episodes[i]);
			// document.getElementById(`episodeThatIsPlaying`).innerHTML = `Episode : ${episodes[i]}`
			updateContinue();
		});
		document.getElementById(`episodes`).appendChild(tempButton);
	}
}

let changeEpisode = (newEpisode)=>{
	let tempVid = document.getElementById(`videoPlayer`);
	tempVid.src = `./vids/${newEpisode}`;
	tempVid.load();
	document.getElementById(`episodeThatIsPlaying`).innerHTML = `Episode : ${newEpisode}`
	currentEpisode = newEpisode;

}

let updateContinue = ()=>{
	// continue
	fs.writeFile(`./continue.json`, JSON.stringify({show : currentShow, episode : currentEpisode}), (err)=>{
		if(err){console.log(err);}
	});
}

let loadContinue = ()=>{
	fs.readFile(`./continue.json`, (err, json)=>{
		let moreUseFullJson = JSON.parse(json);
		currentShow = moreUseFullJson.show;
		document.getElementById(`showThatIsPlaying`).innerHTML = `Show : ${moreUseFullJson.show}`
		currentEpisode = moreUseFullJson.episode;
		fs.readFile(`./db/${currentShow}`, (err, data)=>{
		// console.log(JSON.parse(data));
			episodes = JSON.parse(data).vids;
			// console.log(episodes);
			addEpisodesToPage()
			changeEpisode(currentEpisode);
		});
	})
}

/*=====  End of Adding Videos Functions  ======*/

/*===============================
=            Hotkeys            =
===============================*/

/*----------  To make things easer  ----------*/
Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
	get: function(){
		return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
	}
});

/*----------  Functions  ----------*/
let nextEpisode = ()=>{
	// console.log(`episodes.indexOf(currentEpisode) : ${episodes.indexOf(currentEpisode)}`);
	// console.log(`episodes.length : ${episodes.length}`);
	if(episodes.indexOf(currentEpisode) < episodes.length - 1){
		changeEpisode(episodes[episodes.indexOf(currentEpisode) + 1]);
	}else{
		changeEpisode(episodes[0]);
	}
	updateContinue()
	fixVideo();
}

let lastEpisode = ()=>{
	if(episodes.indexOf(currentEpisode) > 0){
		changeEpisode(episodes[episodes.indexOf(currentEpisode) - 1]);
	}else{
		changeEpisode(episodes[episodes.length - 1]);
	}
	updateContinue()
	fixVideo();
}

let setSpeed = (num)=>{
	if(num >= .5 && num <= 3){
		document.getElementById(`videoPlayer`).playbackRate = num;
		document.getElementById(`SpeedUiBit`).innerHTML = document.getElementById(`videoPlayer`).playbackRate;
		speed = num;
	}
}

let pausePlay = ()=>{
	if(document.getElementById(`videoPlayer`).playing == true){
		document.getElementById(`videoPlayer`).pause()
	}else{
		document.getElementById(`videoPlayer`).play();
	}
}

let mute = ()=>{
	if(document.getElementById(`videoPlayer`).muted != true){
		document.getElementById(`videoPlayer`).muted = true;
		muteTureFalse = true;
	}else{
		document.getElementById(`videoPlayer`).muted = false;
		muteTureFalse = false;
	}
}

let ajustVolume = (num)=>{
	if(num >= 0 && num <= 1){
		document.getElementById(`videoPlayer`).volume = num;
		volume = num;
	}
}

let skipForward = ()=>{
	if( document.getElementById("videoPlayer").currentTime + 10 > document.getElementById("videoPlayer").duration ){
		document.getElementById("videoPlayer").currentTime = document.getElementById("videoPlayer").duration;
	}else{
		document.getElementById("videoPlayer").currentTime = document.getElementById("videoPlayer").currentTime + 10;
	}
}

let skipBackward = ()=>{
	if( document.getElementById("videoPlayer").currentTime - 10 < 0 ){
		document.getElementById("videoPlayer").currentTime = 0;
	}else{
		document.getElementById("videoPlayer").currentTime = document.getElementById("videoPlayer").currentTime - 10;
	}
}

let theaterModeTogle = ()=>{
	if( document.getElementById(`videoPlayer`).classList.contains(`normal`) ){
		document.getElementById(`videoPlayer`).classList.remove(`normal`);
		document.getElementById(`videoPlayer`).classList.add(`theaterMode`);
		// document.getElementById(`buttonLink`).classList.add(`visibility`)
		// document.getElementById(`buttonLink`).classList.remove(`padding`)
		// document.getElementById(`buttonLink`).innerHTML = ``;
	}else{
		document.getElementById(`videoPlayer`).classList.remove(`theaterMode`);
		document.getElementById(`videoPlayer`).classList.add(`normal`);
		// document.getElementById(`buttonLink`).classList.remove(`visibility`)
		// document.getElementById(`buttonLink`).classList.add(`padding`)
		// document.getElementById(`buttonLink`).innerHTML = `upload`;
	}
}

/*----------  Utility  ----------*/
let fixVideo = ()=>{
	// console.log(`speed : ${speed}`);
	// console.log(`volume : ${volume}`);
	// console.log(`muteTureFalse : ${muteTureFalse}`);

	setSpeed(speed);
	ajustVolume(volume);
	document.getElementById(`videoPlayer`).muted = muteTureFalse;
}

/*----------  tieing them to the keys  ----------*/
window.addEventListener('keypress', function(keypressThing){
	console.log(keypressThing.key);
	if(keypressThing.key == `k`){
		pausePlay();
	}

	if(keypressThing.key == `l`){
		skipForward();
	}

	if(keypressThing.key == `j`){
		skipBackward();
	}

	if(keypressThing.key == `m`){
		mute();
	}

	if(keypressThing.key == `n`){
		ajustVolume(document.getElementById(`videoPlayer`).volume + .1);
	}

	if(keypressThing.key == `b`){
		ajustVolume(document.getElementById(`videoPlayer`).volume - .1);
	}

	if(keypressThing.key == `p`){
		setSpeed(document.getElementById(`videoPlayer`).playbackRate + .25);
	}

	if(keypressThing.key == `o`){
		setSpeed(document.getElementById(`videoPlayer`).playbackRate - .25);
	}

	if(keypressThing.key == `;`){
		nextEpisode();
	}

	if(keypressThing.key == `h`){
		lastEpisode();
	}

	if(keypressThing.key == `f`){
		theaterModeTogle();
	}

});

/*=====  End of Hotkeys  ======*/

/*===============================
=            Testing            =
===============================*/

getShows();

// document.getElementById(`continue`).addEventListener(`click`, loadContinue);

// document.getElementById(`continue`).addEventListener(`click`, ()=>{
// 	// console.log( document.getElementById(`videoPlayer`).playing );
// 	// console.log( episodes.indexOf(currentEpisode) );
// 	loadContinue();
// 	// fixVideo();
// });
loadContinue();

/*=====  End of Testing  ======*/