var popupEZ        = document.getElementById('ez'),
	popupNF        = document.getElementById('nf'),
	popupHT        = document.getElementById('ht'),
	popupDT        = document.getElementById('dt'),
	popupHD        = document.getElementById('hd'),
	popupScore     = document.getElementById('score'),
	popupOD        = document.getElementById('OD'),
	popupStarRate  = document.getElementById('starRate'),
	popupTitle     = document.getElementById('title'),
	popupArtist    = document.getElementById('artist'),
	popupHeader    = document.getElementById('header'),
	popupOuter     = document.getElementById('outer');

var popupEZIcon    = document.getElementById('ez-icon'),
	popupHTIcon    = document.getElementById('ht-icon'),
	popupNFIcon    = document.getElementById('nf-icon'),
	popupDTIcon    = document.getElementById('dt-icon'),
	popupHDIcon    = document.getElementById('hd-icon');

var siteTitle,
	siteArtist,
	siteDifficultName,
	siteStarDifficult,
	siteOverallDifficult,
	siteBackground,
	objectsCount;

chrome.runtime.onMessage.addListener(req => {
	siteTitle = req.siteTitle;
	siteArtist = req.siteArtist;
	siteDifficultName = req.siteDifficultName;
	siteBackground = req.siteBackground;
	siteStarDifficult = req.siteStarDifficult;
	siteOverallDifficult = req.siteOverallDifficult;
	objectsCount = req.objectsCount;
})

document.onkeydown = function () {
	let { keyCode } = window.event;

	switch (keyCode) {
		case 81: {
			popupEZ.checked ? popupEZ.checked = false : popupEZ.checked = true;
			checkEZ();
			break;
		}
		case 87: {
			popupNF.checked ? popupNF.checked = false : popupNF.checked = true;
			checkNF();
			break;
		}
		case 69: {
			popupHT.checked ? popupNF.checked = false : popupNF.checked = true;
			checkHT();
			break;
		}
		case 68: {
			popupDT.checked ? popupDt.checked = false : popupDT.checked = true;
			checkDT();
			break;
		}
		default: { break }
	}
}

popupEZ.addEventListener('change',  () => checkEZ());
popupNF.addEventListener('change', () => checkNF());
popupHT.addEventListener('change', () => checkHT());
popupDT.addEventListener('change', () => checkDT());

var scoreMultiplayer = 1,
	timeRate         = 1,
	ezMod            = false,
	nfMod            = false,
	htMod            = false,
	dtMod            = false;

function checkEZ() {
	if (!popupEZ.checked) {
		popupEZIcon.style.transform = 'scale(1.2, 1.2)';
		ezMod = true;
		getPP();
	}
	if (popupEZ.checked) {
		popupEZIcon.style.transform = 'scale(1.0, 1.0)';
		ezMod = false;
		getPP();
	}
	getScoreMultiplayer();
}

function checkNF() {
	if (!popupNF.checked) {
		popupNFIcon.style.transform = 'scale(1.2, 1.2)';
		nfMod = true;
		getPP();
	}
	if (popupNF.checked) {
		popupNFIcon.style.transform = 'scale(1.0, 1.0)';
		nfMod = false;
		getPP();
	}
	getScoreMultiplayer();
}

function checkHT() {
	if (!popupHT.checked) {
		popupHTIcon.style.transform = 'scale(1.2, 1.2)';
		timeReate = 0.75;
		htMod = true;

		popupStarRate.style.display = 'block';
		getPP();
	}
	if (popupHT.checked) {
		popupHTIcon.style.transform = 'scale(1.0, 1.0)';
		htMod = false;

		popupStarRate.style.display = 'none';
		getPP();
	}
	if (!popupDT.checked) {
		popupDTIcon.style.transform = 'scale(1.0, 1.0)';
		popupDT.checked = true;
	}
	getScoreMultiplayer();
}

function checkDT() {
	if (!popupDT.checked) {
		popupDTIcon.style.transform = 'scale(1.2, 1.2)';
		timeRate = 1.5;
		dtMod = true;

		popupStarRate.style.display = 'block';
		getPP();
	}
	if (popupDT.checked) {
		popupDTIcon.style.transform = 'scale(1.0, 1.0)';
		dtMod = false;

		popupStarRate.style.display = 'none';
		getPP();
	}
	if (!popupHT.checked) {
		popupHTIcon.style.transform = 'scale(1.0, 1.0)';
		popupHT.checked = true;
	}
}

function getScoreMultiplayer () {
	if (ezMod || nfMod || htMod) 
		scoreMultiplayer = 0.5;
	if (ezMod && nfMod && htMod) 
		scoreMultiplayer = 0.13;
	if (ezMod && nfMod && htMod) 
		scoreMultiplayer = 1;
	if (ezMod && nfMod) 
		scoreMultiplayer = 0.25;
	if (ezMod && htMod) 
		scoreMultiplayer = 0.25;
	if (nfMod && htMod) 
		scoreMultiplayer = 0.25;
}

var realScore = 1e6;

popupScore.oninput = function () {
	realScore = popupScore.value * (1 / scoreMultiplayer);
	getPP();
}

getPP() {
	//PP = Math.round(calculatePerfomancePoints());
	if (!PP) {
		popupOuter.innerText = "0";
	} else {
		popupOuter.innerText = PP;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	setInterval(() => {
		getPP();
		popupTitle.innerText = siteTitle + ' ' + '[' + siteDifficultName + ']';
		popupArtist.innerText = siteArtist
		popupHeader.style.background = siteBackground;
	}, 100);
})