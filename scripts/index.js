let OsuCalculator = require("./calculator/osuCalculator");
let TaikoCalculator = require("./calculator/taikoCalculator");
let CtbCalculator = require("./calculator/ctbCalculator");
let ManiaCalculator = require("./calculator/maniaCalculator");
let API = require("./api/API");
let { modsEmitter, Mods } = require("./mods");

let popupScore     = document.getElementById('score'),
	popupTitle     = document.getElementById('title'),
	popupArtist    = document.getElementById('artist'),
	popupHeader    = document.getElementById('header'),
	popupOuter     = document.getElementById('outer');

class Main {
	constructor() {
		this.api = new API();

		this.getSiteData().then(d => {
			this.beatmapId = d.beatmapId;
			this.beatmapsetId = d.beatmapsetId;
			this.mode = this.modeToNumber(d.mode);
			this.mods = new Mods(d.mode);
			this.reqBeatmap(this.beatmapId, this.mode);
		})

		modsEmitter.on('addMod', mod => {
			this.mods.addActiveMod(mod);
			this.reqBeatmap(this.beatmapId, this.mode);
		});

		modsEmitter.on('removeMod', mod => {
			this.mods.removeActiveMod(mod);
			this.reqBeatmap(this.beatmapId, this.mode);
		});
	}

	getSiteData() {
		return new Promise((resolve, reject) => {
			chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
				let { id } = tab;

				chrome.tabs.sendMessage(id, null, res => {
					if (res.status = 'SUCCESS') {
						let { beatmapId, beatmapsetId, mode } = res;
						resolve({ beatmapId, beatmapsetId, mode });
					} else {
						let { message } = res.error;
						reject(message);
					}
				}) 
			})
		}) 
	}

	async reqBeatmap(beatmapId, mode = 0) {
		if(!beatmapId) return;

		let mods = this.mods.activeModsToNum();

		let map = await this.api.getBeatmap(beatmapId, mode, mods);

		console.log(mods)
		console.log(map)

		let pp = this.getPP(mode, map);

		this.setMapInformation(map, pp)
	}

	getPP(mode, map) {
		switch (mode) {
			case 1:
				return new TaikoCalculator(map, this.mods).pp;
			case 2:
				return new CtbCalculator(map, this.mods).pp;
			case 3:
				return new ManiaCalculator(map, this.mods).pp;
			default:
				return new OsuCalculator(map, this.mods).pp;
		}
	}

	modeToNumber(mode) {
		switch (mode) {
			case 'taiko':
				return 1;
			case 'fruits':
				return 2;
			case 'mania':
				return 3;
			default:
				return 0;
		}
	}

	setMapInformation(map, pp) {
		popupOuter.innerText = parseInt(pp) || '0';
		popupTitle.innerText = `${map.title} (${map.diffName})`;
		popupArtist.innerText = map.artist;
		popupHeader.style.backgroundImage = `url('https://assets.ppy.sh/beatmaps/${this.beatmapsetId}/covers/cover.jpg')`;
	}
}

new Main();