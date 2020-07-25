chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	try {
		let regexp = /https:\/\/osu.ppy.sh.beatmapsets\/(?<beatmapsetId>\d+)#(?<mode>\w+)\/(?<beatmapId>\d+)/gi;
		let url = document.location.href;
		let urlData = regexp.exec(url);
		let { beatmapsetId, beatmapId, mode } = urlData.groups;
		console.log(beatmapId, beatmapId, mode)

		sendResponse({
			status: 'SUCCESS',
			beatmapId,
			beatmapsetId,
			mode
		})
	} catch (error) {
		sendResponse({
			status: 'ERROR',
			error: {
				message: error.message,
				arguments: error.arguments,
				type: error.type,
				name: error.name,
				stack: error.stack,
			},
		});
	}
})




