let Odometer = require('odometer');

let OsuCalculator = require("./calculator/osuCalculator");
let TaikoCalculator = require("./calculator/taikoCalculator");
let CtbCalculator = require("./calculator/ctbCalculator");
let ManiaCalculator = require("./calculator/maniaCalculator");

let API = require("./api/API");
let { modsEmitter, Mods } = require("./mods");
let Inputs = require('./inputs');
let InputsListener = require('./inputs/inputsListener');
let Stats = require('./stats');

let preload = document.getElementById('preload');

let popupTitle = document.getElementById('title');
let	popupArtist = document.getElementById('artist');
let	popupHeader = document.getElementById('header');
let	popupOuter = document.getElementById('outer');
let popupBPM = document.getElementById('BPM');
let popupSR = document.getElementById('SR');

class Main {
	constructor() {
		this.api = new API();
		new Odometer({ el: popupOuter, duration: 200 });

		this.getSiteData().then(async d => {
			this.beatmapId = d.beatmapId;
			this.beatmapsetId = d.beatmapsetId;
			this.mode = this.modeToNumber(d.mode);

			this.mods = new Mods(this.mode);

			this.map = await this.reqBeatmap(this.beatmapId, this.mode, this.mods);
			this.inputs = new Inputs(this.map, this.mode);
			this.stats = new Stats(this.mode);
			this.stats.update(this.map, this.mods)
			this.inputsListener = new InputsListener(this.map, this.mode, this.setMapInformation.bind(this));
			this.setMapInformation(this.map);
		})

		modsEmitter.on('addMod', async mod => {
			this.mods.addActiveMod(mod);
			this.map = await this.reqBeatmap(this.beatmapId, this.mode, this.mods);
			this.stats.update(this.map, this.mods);
			this.setMapInformation(this.map);
		});

		modsEmitter.on('removeMod', async mod => {
			this.mods.removeActiveMod(mod);
			this.map = await this.reqBeatmap(this.beatmapId, this.mode, this.mods);
			this.stats.update(this.map, this.mods);
			this.setMapInformation(this.map);
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
					} else if (res.status = 'ERROR'){
						let { message } = res.error;
						reject(message);
					}
				}) 
			})
		}) 
	}

	async reqBeatmap(beatmapId, mode = 0, mods) {
		if(!beatmapId) return;

		let modsNum = mods ? mods.activeModsToNum() : 0;
		let map = await this.api.getBeatmap(beatmapId, mode, modsNum);
		console.log(map, mods);
		return map;
	}

	getPP() {
		switch (this.mode) {
			case 1:
				return new TaikoCalculator(
					this.map, 
					this.mods, 
					this.inputsListener.combo, 
					this.inputsListener.accuracy, 
					this.inputsListener.miss
				);
			case 2:
				return new CtbCalculator(
					this.map, 
					this.mods, 
					this.inputsListener.combo, 
					this.inputsListener.accuracy, 
					this.inputsListener.miss
				);
			case 3:
				return new ManiaCalculator(
					this.map,
					this.mods,
					this.inputsListener.score
				);
			default:
				return new OsuCalculator(
					this.map, 
					this.mods, 
					this.inputsListener.combo, 
					this.inputsListener.accuracy, 
					this.inputsListener.miss
				);
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

	setMapInformation(map) {
		let pp = this.getPP().pp;

		popupOuter.innerText = parseInt(pp) || 0;
		popupTitle.innerText = `${map.title} (${map.diffName})`;
		popupArtist.innerText = map.artist;
		popupSR.innerText = map.diff.SR.toFixed(2);
		popupBPM.innerText = this.setBPM(+map.bpm.toFixed(0));
		popupHeader.style.backgroundImage = `url('https://assets.ppy.sh/beatmaps/${this.beatmapsetId}/covers/cover.jpg')`;
		preload.style.display = 'none';
	}

	setBPM(bpm) {
		if (this.mods.has('DT')) bpm *= 1.5;
		if (this.mods.has('HT')) bpm *= 0.75;

		return Math.ceil(bpm);
	}
}

new Main();