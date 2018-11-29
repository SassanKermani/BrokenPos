/*==============================
=            Set Up            =
==============================*/

let fs = require(`fs`);
let vids = [];
let foldor = ``;
let isNewFoldor = false;

/*=====  End of Set Up  ======*/


/*========================================
=            selecting folder            =
========================================*/

let populateFoldors = ()=>{
	fs.readdir(`db`, (err, dbObjectsNames)=>{
		// console.log(dbObjectsNames);
		for(let i = 0; i < dbObjectsNames.length; i++){
			// console.log(i);
			populateFoldorsPartTwoAddingButtons(dbObjectsNames[i]);
		}
		let addNewFoldor = document.createElement(`button`);
		addNewFoldor.innerHTML = `make new foldor`;
		addNewFoldor.addEventListener(`click`, ()=>{
			// populateFoldorsPartTwoAddingButtons(document.getElementById(`nameOfNewFoldor`).value);
			let tempButton = document.createElement(`button`);
			tempButton.innerHTML = document.getElementById(`nameOfNewFoldor`).value;
			tempButton.addEventListener(`click`, ()=>{
				foldor = document.getElementById(`nameOfNewFoldor`).value;
				isNewFoldor = true;

			});
			document.getElementById(`listOffolors`).appendChild(tempButton);
			foldor = document.getElementById(`nameOfNewFoldor`).value;
			isNewFoldor = true;
		});
		document.getElementById(`newFolderSection`).appendChild(addNewFoldor);
	});
}

let populateFoldorsPartTwoAddingButtons = (dbObjectName)=>{										//activly working on this
	let tempButton = document.createElement(`button`);
	tempButton.innerHTML = dbObjectName;
	tempButton.addEventListener(`click`, ()=>{
		vids = [];
		foldor = dbObjectName;
		isNewFoldor = false;
		getEpisodesFromDb(foldor).then((moreUsefullData)=>{
			console.log(moreUsefullData);
			for(let i = 0; i < moreUsefullData.vids.length; i++){
				// console.log()
				vids.push(new vidObj(moreUsefullData.vids[i], false, `./vids`));
			}
			addVidArrToPage();
		});
	});
	document.getElementById(`listOffolors`).appendChild(tempButton);
}

/*=====  End of selecting folder  ======*/

/*===============================================
=            Adding Episodes To Page            =
===============================================*/

let getEpisodesFromDb = (nameOfShow)=>{
	
	let tempPormis = new Promise((resolve, reject)=>{
		fs.readFile(`./db/${nameOfShow}`, (err, data)=>{
			let moreUsefullData = JSON.parse(data);
			// console.log(moreUsefullData);
			resolve(moreUsefullData);
		});
	});
	return tempPormis;
}

let getEpisodesFromSelect = ()=>{
	let newEpisodes = document.getElementById(`inputNewEpisodes`).files;
	// console.log(newEpisodes);
	for(let i = 0; i < newEpisodes.length; i++){
		vids.push(new vidObj(newEpisodes[i].name, true, newEpisodes[i].path));
	}
	console.log(vids);
}

let addVidArrToPage = ()=>{

	while (document.getElementById(`episodesSection`).firstChild) {
		document.getElementById(`episodesSection`).removeChild(document.getElementById(`episodesSection`).firstChild);
	}

	for(let i = 0; i < vids.length; i++){
		let tempP = document.createElement(`p`);
		tempP.innerHTML = vids[i].name;
		
		//buttons
		let buttonsOne = document.createElement(`button`)
		let buttonsTwo = document.createElement(`button`)
		let buttonsThree = document.createElement(`button`)
		let buttonsFour = document.createElement(`button`)

		buttonsOne.addEventListener(`click`, ()=>{
			vids = arrMoveIndexToTop(vids, i);
			addVidArrToPage();
		});
		buttonsTwo.addEventListener(`click`, ()=>{
			vids = arrMoveIndexToBottom(vids, i);
			addVidArrToPage();
		});
		buttonsThree.addEventListener(`click`, ()=>{
			vids = arrMoveIndexOneUp(vids, i);
			addVidArrToPage();
		});
		buttonsFour.addEventListener(`click`, ()=>{
			vids = arrMoveIndexOneDown(vids, i);
			addVidArrToPage();
		});

		buttonsOne.innerHTML = `top`;
		buttonsTwo.innerHTML = `bottom`;
		buttonsThree.innerHTML = `up`;
		buttonsFour.innerHTML = `down`;

		document.getElementById(`episodesSection`).appendChild(tempP);

		tempP.appendChild(buttonsOne);
		tempP.appendChild(buttonsTwo);
		tempP.appendChild(buttonsThree);
		tempP.appendChild(buttonsFour);
		// unOrderdList.appendChild(tempLi);
	}
}


/*----------  Utility  ----------*/
let vidObj = function (name, isNew, location){
	this.name = name;
	this.isNew = isNew;
	this.location = location;
}

/*=====  End of Adding Episodes To Page  ======*/

/*====================================
=            Wrting to db            =
====================================*/

let writeToDb = ()=>{
	if(foldor.length != 0 & vids.length != 0){
		let tempObj = {
			vids : vids.map(x => x.name)
		};

		fs.writeFile( `./db/${foldor}`, JSON.stringify(tempObj), (err)=>{
			if(err){throw err};
			for(let i = 0; i < vids.length; i++){
				if(vids[i].isNew){
					fs.createReadStream(vids[i].location).pipe(fs.createWriteStream(`./vids/${vids[i].name}`));
				}
			}
		});

		console.log(tempObj);

	}else{
		console.log(`fix the writeToDb`);
	}
}

/*=====  End of Wrting to db  ======*/


/*=====================================
=            Arr functions            =
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

/*=====  End of Arr functions  ======*/


/*===============================
=            Testing            =
===============================*/

populateFoldors();

document.getElementById(`importSectionGoButton`).addEventListener(`click`, ()=>{
	getEpisodesFromSelect ();
	addVidArrToPage();
});

document.getElementById(`uploadButton`).addEventListener(`click`, ()=>{
	// writeToDb();
	// console.log(vids);
})
/*=====  End of Testing  ======*/
