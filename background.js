chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	let { url } = tab;
	let regexp = /https:\/\/osu.ppy.sh.beatmapsets\/(?<beatmapsetId>\d+)#(?<mode>\w+)\/(?<beatmapId>\d+)/gi;
	console.log(tabId, changeInfo, tab)
	if (url.match(regexp) && changeInfo.status === 'complete') {
		chrome.pageAction.show(tabId);
	} else if(!url.match(regexp)) {
		chrome.pageAction.hide(tabId);
	}
});