/*==============================
=            Set Up            =
==============================*/

let fs = require(`fs`);

let foldor = null;
let newVidsArrToBeWrittenToDb = [];
let newVidsToBeAddedToVidsFoldor = [];

/*=====  End of Set Up  ======*/

/*================================================
=            Utility Function Section            =
================================================*/

let fsReaddir = (spot)=>{
	let tempPromise = new Promise((resolve, reject)=>{
		fs.readdir(spot, (err, listOfFiles)=>{
			resolve(listOfFiles);
		});
	});

	return tempPromise;
}

let fsReadFile = (fileNameAndLocation)=>{
	
	console.log(`fileNameAndLocation : ${fileNameAndLocation}`)

	let tempPromise = new Promise((resolve, reject)=>{
		fs.readFile(fileNameAndLocation, (err, data)=>{
			if(err){console.log(err);}
			resolve(JSON.parse(data));
		});
	});

	return tempPromise;
}

/*=====  End of Utility Function Section  ======*/


/*===========================================
=            Select From Section            =
===========================================*/

let populateFoldorsFromSection = ()=>{
	fsReaddir(`./db`).then((listOfFiles)=>{
		populateFoldorsSelectFromFoldorsSpecal();
		populateFoldorsSelectFromFoldorsNormal(listOfFiles);
	})
}

let populateFoldorsSelectFromFoldorsSpecal = ()=>{
	let tempButtonAllVids = document.createElement(`button`);
	tempButtonAllVids.innerHTML = `AllVids`;
	tempButtonAllVids.classList.add(`block`);
	tempButtonAllVids.addEventListener(`click`,()=>{
																												//WORK ON THIS LATER
		console.log(`WORK ON THIS LATER ${tempButtonAllVids.innerHTML}`);
		fsReaddir(`./vids`).then((listOfFiles)=>{
			console.log(listOfFiles);

			while (document.getElementById(`selectFromEpisodes`).firstChild) {
				document.getElementById(`selectFromEpisodes`).removeChild(document.getElementById(`selectFromEpisodes`).firstChild);
			}

			for(let i = 0; i < listOfFiles.length; i++){

				// console.log(i);
				let tempP = document.createElement(`p`);
				tempP.innerHTML = listOfFiles[i];

				let tempButton = document.createElement(`button`);
				tempButton.innerHTML = `add`;
				tempButton.addEventListener(`click`, ()=>{
																												//WORK ON THIS LATER
					//
					console.log(`WORK ON THIS LATER ${listOfFiles[i]}`);
				});

				tempP.appendChild(tempButton);
				document.getElementById(`selectFromEpisodes`).appendChild(tempP);
			}

		});
	});
	document.getElementById(`selectFromFoldorsSpecal`).appendChild(tempButtonAllVids);

	let tempButtonImport = document.createElement(`button`);
	tempButtonImport.innerHTML = `Import`;
	tempButtonImport.classList.add(`block`);
	tempButtonImport.addEventListener(`click`,()=>{

		while (document.getElementById(`selectFromEpisodes`).firstChild) {
			document.getElementById(`selectFromEpisodes`).removeChild(document.getElementById(`selectFromEpisodes`).firstChild);
		}	
			
		let newEpisodesFromImput = document.getElementById(`inputNewEpisodes`).files;
		console.log(newEpisodesFromImput);
		for(let i = 0; i < newEpisodesFromImput.length; i++){

			// console.log(i);
			let tempP = document.createElement(`p`);
			tempP.innerHTML = newEpisodesFromImput[i].name;

			let tempButton = document.createElement(`button`);
			tempButton.innerHTML = `add`;
			tempButton.addEventListener(`click`, ()=>{
																												//WORK ON THIS LATER
				//
				// console.log(`WORK ON THIS LATER ${newEpisodesFromImput[i].name}`);
				newVidsToBeAddedToVidsFoldor.push(`${newEpisodesFromImput[i].path}`)
				console.log(`newVidsToBeAddedToVidsFoldor`);
				console.log(newVidsToBeAddedToVidsFoldor);
				newVidsArrToBeWrittenToDb.push(newEpisodesFromImput[i].name);
				console.log(`newVidsArrToBeWrittenToDb`);
				console.log(newVidsArrToBeWrittenToDb);
			});

			tempP.appendChild(tempButton);
			document.getElementById(`selectFromEpisodes`).appendChild(tempP);
		}
	});
	document.getElementById(`selectFromFoldorsSpecal`).appendChild(tempButtonImport);	
}

let populateFoldorsSelectFromFoldorsNormal = (listOfFiles)=>{
	for(let i = 0; i < listOfFiles.length; i++){
		let tempButton = document.createElement(`button`);
		tempButton.innerHTML = listOfFiles[i];
		tempButton.addEventListener(`click`, ()=>{

			while (document.getElementById(`selectFromEpisodes`).firstChild) {
				document.getElementById(`selectFromEpisodes`).removeChild(document.getElementById(`selectFromEpisodes`).firstChild);
			}

			fsReadFile(`./db/${listOfFiles[i]}`).then((dbObject)=>{
				console.log(dbObject);
				for(let i = 0; i < dbObject.vids.length; i++){

					console.log(`i`);
					
					let tempP = document.createElement(`p`);
					tempP.innerHTML = dbObject.vids[i];

					let tempButton = document.createElement(`button`);
					tempButton.innerHTML = `add`;
					tempButton.addEventListener(`click`, ()=>{
																												//WORK ON THIS LATER
						console.log(`WORK ON THIS LATER ${dbObject.vids[i]}`);
						newVidsArrToBeWrittenToDb.push(dbObject.vids[i]);
						console.log(`newVidsArrToBeWrittenToDb`);
						console.log(newVidsArrToBeWrittenToDb);
					});

					tempP.appendChild(tempButton);
					document.getElementById(`selectFromEpisodes`).appendChild(tempP);
				}
			});
		});
		document.getElementById(`selectFromFoldorsNormal`).appendChild(tempButton);
	}
}

/*=====  End of Select From Section  ======*/

/*=========================================
=            Select To Section            =
=========================================*/

let populateFoldorsToSection = ()=>{
	fsReaddir(`./db`).then((listOfFiles)=>{
		console.log(`populateFoldorsToSection : ${listOfFiles}`);
		for(let i =0; i < listOfFiles.length; i++){
			
			let episode = document.createElement(`p`);
			episode.innerHTML = listOfFiles[i];
																												//WORK ON THIS LATER
			document.getElementById(`selectToFoldors`).appendChild(episode);
		}
	});
}

let populateFoldorsToSectionPartTwo = ()=>{

}

/*=====  End of Select To Section  ======*/

/*=====================================
=            Arr Functions            =
=====================================*/

let arrMoveIndexToTop = (arr, index)=>{
	let newArr = [];
	newArr[0] = arr[index];
	for(let i = 0; i < arr.length; i++){
		if(i < index){
			newArr[i + 1] = arr[i];
		}
		if(i == index){
			// newArr[i] = newThing;
		}
		if(i > index){
			newArr[i] = arr[i];
		}
	}
	return(newArr);
};

let arrMoveIndexToBottom = (arr, index)=>{
	let newArr = [];
	for(let i = 0; i < arr.length; i++){
		if(i < index){
			newArr[i] = arr[i];
		}
		if(i == index){
			// newArr[i] = newThing;
		}
		if(i > index){
			newArr[i - 1] = arr[i];
		}
	}
	newArr[arr.length - 1] = arr[index];
	return(newArr);
};

let arrMoveIndexOneUp = (arr, index)=>{
	if(index > 0){
		newArr = [];
		for(let i = 0; i < arr.length; i++){
			if(i == index ){
				newArr[i] = arr[i - 1];
			}
			if(i == index - 1){
				newArr[i] = arr[i + 1];
			}
			if(i != index && i != index - 1){
				// console.log(i);
				newArr[i] = arr[i];
			}
		}
		return(newArr);
	}else{
		return(arr);
	}
};

let arrMoveIndexOneDown = (arr, index)=>{
	if(index >= 0 && index < arr.length){
		newArr = [];
		for(let i = 0; i < arr.length; i++){
			if(i == index ){
				newArr[i] = arr[i + 1];
			}
			if(i == index + 1){
				newArr[i] = arr[i - 1];
			}
			if(i != index && i != index + 1){
				// console.log(i);
				newArr[i] = arr[i];
			}
		}
		return(newArr);
	}else{
		return(arr);
	}
};

let arrRemoveIndex = (arr, index)=>{
	let newArr = [];
	let ii = 0;
	for(let i = 0; i < arr.length; i++){
		if(i != index){
			newArr[ii] = arr[i];
			ii++;
		}
	}

	return(newArr);
}

/*----------  Testing  ----------*/

let arrTest = [ `a`, `b`, `c`, `d`, `e` ];

console.log( arrRemoveIndex(arrTest, 1) );

/*=====  End of Arr Functions  ======*/


/*===============================
=            Testing            =
===============================*/

populateFoldorsFromSection();

populateFoldorsToSection()
/*=====  End of Testing  ======*/