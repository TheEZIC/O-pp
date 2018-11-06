var siteName             = document.querySelectorAll('.beatmapset-header__details-text--title')[0].innerText;
var siteArtist           = document.querySelectorAll('.beatmapset-header__details-text--artist')[0].innerText;
var siteDifficultName    = document.querySelectorAll('.beatmapset-header__diff-name')[0].innerText;
var siteBackground       = getComputedStyle(document.querySelectorAll('.beatmapset-header__content')[0], '').getPropertyValue('background');
var siteStarDifficult    = document.querySelectorAll('.beatmap-stats-table tbody tr:last-child .beatmap-stats-table__value')[0].innerText;
var siteOverallDifficult = document.querySelectorAll('.beatmap-stats-table tbody tr:nth-child(3) .beatmap-stats-table__value')[0].innerText;


chrome.runtime.onMessage.addListener(function (request, sender, sendRespounse) {
    console.log('Получено состояние открытия');
    if (request.popupOpen == true) {
        console.log('отправленны данные с сайта');
        chrome.runtime.sendMessage({
            siteTitle : siteName,
            siteArtist: siteArtist,
            siteDifficultName: siteDifficultName,
            siteBackground: siteBackground,
            siteStarDifficult: siteStarDifficult,
            siteOverallDifficult: siteOverallDifficult
        });
    };
});




