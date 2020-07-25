chrome.webNavigation.onCompleted.addListener(details => {
	let { tabId, url } = details;

	if (url.match(/https:\/\/osu.ppy.sh.beatmapsets\/(?<beatmapsetId>\d+)#(?<mode>\w+)\/(?<beatmapId>\d+)/gi)) {
		chrome.pageAction.show(tabId);
	} else {
		chrome.pageAction.hide(tabId);
	}
});




