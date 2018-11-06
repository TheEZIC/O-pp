var popupEZ        = document.getElementById('ez'),
	popupNF        = document.getElementById('nf'),
	popupHT        = document.getElementById('ht'),
	popupDT        = document.getElementById('dt'),
	popupHD        = document.getElementById('hd'),
	popupNoteCount = document.getElementById('noteCount'),
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
	siteBackground;

var PP;

chrome.runtime.onMessage.addListener(function (request, sender, sendRespounse) {
	siteTitle = request.siteTitle;
	siteArtist = request.siteArtist;
	siteDifficultName = request.siteDifficultName;
	siteBackground = request.siteBackground;
	siteStarDifficult = request.siteStarDifficult;
	siteOverallDifficult = request.siteOverallDifficult;
});



document.onkeydown = function () {
	var evt = window.event;

	if (evt.keyCode == 81) {
		if (popupEZ.checked) {
			popupEZ.checked = false;
		} else {
			popupEZ.checked = true;
		};
		checkEZ();
	};
	if (evt.keyCode == 87) {
		if (popupNF.checked) {
			popupNF.checked = false;
		} else {
			popupNF.checked = true;
		};
		checkNF();
	};
	if (evt.keyCode == 69) {
		if (popupHT.checked) {
			popupHT.checked = false;
		} else {
			popupHT.checked = true;
		};
		checkHT();
	};
	if (evt.keyCode == 68) {
		if (popupDT.checked) {
			popupDT.checked = false;
		} else {
			popupDT.checked = true;
		};
		checkDT();
	};

};


popupEZ.addEventListener('change', function () {
	checkEZ();
});

popupNF.addEventListener('change', function () {
	checkNF();
});

popupHT.addEventListener('change', function () {
	checkHT();
});

popupDT.addEventListener('change', function () {
	checkDT();
});



var scoreMultiplayer = 1,
	timeRate         = 1,
	ezMod            = false,
	nfMod            = false,
	htMod            = false,
	dtMod            = false;

function checkEZ() {
	if (popupEZ.checked == false) {
		popupEZIcon.style.transform = 'scale(1.2, 1.2)';
		ezMod = true;
		getPP();
	};
	if (popupEZ.checked == true) {
		popupEZIcon.style.transform = 'scale(1.0, 1.0)';
		ezMod = false;
		getPP();
	};
	getScoreMultiplayer();
}; 

function checkNF() {
	if (popupNF.checked == false) {
		popupNFIcon.style.transform = 'scale(1.2, 1.2)';
		nfMod = true;
		getPP();
	};
	if (popupNF.checked == true) {
		popupNFIcon.style.transform = 'scale(1.0, 1.0)';
		nfMod = false;
		getPP();
	};
	getScoreMultiplayer();
};

function checkHT() {
	if (popupHT.checked == false) {
		popupHTIcon.style.transform = 'scale(1.2, 1.2)';
		timeReate = 0.75;
		htMod = true;

		popupStarRate.style.display = 'block';
		getPP();
	}; 
	if (popupHT.checked == true) {
		popupHTIcon.style.transform = 'scale(1.0, 1.0)';
		htMod = false;

		popupStarRate.style.display = 'none';
		getPP();
	};
	if (popupDT.checked == false) {
		popupDTIcon.style.transform = 'scale(1.0, 1.0)';
		popupDT.checked = true;
	};
	getScoreMultiplayer();
};

function checkDT() {
	if (popupDT.checked == false) {
		popupDTIcon.style.transform = 'scale(1.2, 1.2)';
		timeRate = 1.5;
		dtMod = true;

		popupStarRate.style.display = 'block';
		getPP();
	};
	if (popupDT.checked == true) {
		popupDTIcon.style.transform = 'scale(1.0, 1.0)';
		dtMod = false;

		popupStarRate.style.display = 'none';
		getPP();
	};	
	if (popupHT.checked == false) {
		popupHTIcon.style.transform = 'scale(1.0, 1.0)';
		popupHT.checked = true;
	}
}; 


function getScoreMultiplayer () {
	if (ezMod == true || nfMod == true || htMod == true) {
		scoreMultiplayer = 0.5;
	};
	if ( ezMod == true && nfMod == true) {
		scoreMultiplayer = 0.25;
	};
	if (ezMod == true && htMod == true) {
		scoreMultiplayer = 0.25;
	};
	if (nfMod == true && htMod == true) {
		scoreMultiplayer = 0.25;
	};
	if (ezMod == true && nfMod == true && htMod == true) {
		scoreMultiplayer = 0.13;
	};
	if (ezMod == false && nfMod == false && htMod == false) {
		scoreMultiplayer = 1;
	}
};


var realScore = 1000000;
popupScore.oninput = function () {
	realScore = popupScore.value * (1 / scoreMultiplayer);
	getPP();
};

var noteCount;
popupNoteCount.oninput = function () {
	noteCount = popupNoteCount.value;
	getPP();
};


function calculateStrainValue () {
	var strainValue;

	if (scoreMultiplayer <= 0) {
		strainValue = 0;
	};

	if (realScore < 500000) {
		realScore = 500000;
	};

	var score = realScore;


	starRate = parseFloat(siteStarDifficult).toFixed(2);

	if (dtMod == true || htMod == true) {
		starRate = popupStarRate.value;
	} else {
		starRate = parseFloat(siteStarDifficult).toFixed(2);
	}

	strainValue = Math.pow(5 * Math.max(1, starRate / 0.2) - 4, 2.2) / 135;
	strainValue = strainValue * (1 + 0.1 * Math.min(1, noteCount / 1500));

	if (score <= 500000) {
		strainValue = 0;
	} else if (score <= 600000) {
		strainValue = strainValue * ((score - 500000) / 100000 * 0.3);
	} else if (score <= 700000) {
		strainValue = strainValue * (0.3 + (score - 600000) / 100000 * 0.25);
	} else if (score <= 800000) {
		strainValue = strainValue * (0.55 + (score - 700000) / 100000 * 0.20);
	} else if (score <= 900000) {
		strainValue = strainValue * (0.75 + (score - 800000) / 100000 * 0.15);
	} else {
		strainValue = strainValue * (0.9 + (score - 900000) / 100000 * 0.1);
	}
	return strainValue.toFixed(2);
};

function calculateAccValue () {
	var hitWindow300,
		OD;
	
	if (ezMod == true) {
		OD = popupOD.value;
	} else {
		OD = parseInt(siteOverallDifficult);
	}


	hitWindow300 = 34 + 3 * (Math.min(10, Math.max(0, 10 - OD)));
	if (hitWindow300 <= 0) {
		hitWindow300 = 0;
	};

	accValue = Math.max(0, 0.2 - ((hitWindow300 - 34) * 0.006667)) * calculateStrainValue() * Math.pow((Math.max(0, realScore - 960000) / 40000), 1.1);
	return accValue;
};

function calculatePerfomancePoints () {
	var multiplier  = 0.8,
		strainValue = calculateStrainValue(),
		accValue    = calculateAccValue();


	if (nfMod == true) {
		multiplier = multiplier * 0.90;
	};
	if (ezMod == true) {
		multiplier = multiplier * 0.50;
	};

	if (dtMod == true) {
		multiplier = multiplier * 0.90;
	};
	if (htMod == true) {
		multiplier = multiplier * 0.60;
	};




	var totalValue = Math.pow(Math.pow(strainValue, 1.1) + Math.pow(accValue, 1.1), 1 / 1.1) * multiplier;
	return totalValue;
};

function getPP() {
	PP = Math.round(calculatePerfomancePoints());
	if (isNaN(PP)) {
		popupOuter.innerText = "";
	} else {
		popupOuter.innerText = PP;
	};
}

document.addEventListener('DOMContentLoaded', function () {
	setInterval(function () {
		getPP();
		popupTitle.innerText = siteTitle + ' ' + '[' + siteDifficultName + ']';
		popupArtist.innerText = siteArtist
		popupHeader.style.background = siteBackground;
	}, 1);
});

