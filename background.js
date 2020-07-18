let documentReady = false;

document.addEventListener('DOMContentLoaded', () => {
	documentReady = true;

	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, { popupOpen: true })
	});
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.url.toLowerCase().match(/^https?:\/\/(osu|new).ppy.sh\/([bs]|beatmapsets)\/(\d+)/)) {
		chrome.pageAction.show(tabId);

		if (documentReady) {
			chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
				chrome.tabs.executeScript(tabs[0].id, { file: "content_script.js" });
			})
		}
	} else {
		chrome.pageAction.hide(tabId);
	}
})




