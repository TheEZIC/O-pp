var siteTitle            = document.querySelectorAll('.beatmapset-header__details-text--title')[0].innerText;
var siteArtist 			 = document.querySelectorAll('.beatmapset-header__details-text--artist')[0].innerText;
var siteDifficultName    = document.querySelectorAll('.beatmapset-header__diff-name')[0].innerText;
var siteBackground       = getComputedStyle(document.querySelectorAll('.beatmapset-header__content')[0], '').getPropertyValue('background');
var siteStarDifficult    = document.querySelectorAll('.beatmap-stats-table tbody tr:last-child .beatmap-stats-table__value')[0].innerText;
var siteOverallDifficult = document.querySelectorAll('.beatmap-stats-table tbody tr:nth-child(3) .beatmap-stats-table__value')[0].innerText;
var notesCount           = document.querySelectorAll('div.beatmapset-stats__row.beatmapset-stats__row--basic > div > div:nth-child(3) > span')[0].innerText;
var slidersCount         = document.querySelectorAll('div.beatmapset-stats__row.beatmapset-stats__row--basic > div > div:nth-child(4) > span')[0].innerText;
var objectsCount = notesCount.replace(',', '') + slidersCount.replace(',', '');

chrome.runtime.onMessage.addListener(req => { 
	if (req.popupOpen) {
		chrome.runtime.sendMessage({
			siteTitle,
			siteArtist,
			siteDifficultName,
			siteBackground,
			siteStarDifficult,
			siteOverallDifficult,
			objectsCount
		});
	}
})




