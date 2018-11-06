var documentReady;

document.addEventListener('DOMContentLoaded', function () {
  documentReady = true;
  
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {popupOpen: true}, function(response) {
			console.log('Отправленно состояние открытия');
		});
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.toLowerCase().match(/^https?:\/\/(osu|new).ppy.sh\/([bs]|beatmapsets)\/(\d+)/)) {
    chrome.pageAction.show(tabId);
    if (documentReady == true) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, { file: "content_script.js" }, function() {});
      });
    };
  } else {
    chrome.pageAction.hide(tabId);
  };
});




