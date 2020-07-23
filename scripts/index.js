let Odometer = require('odometer');
let OsuCalculator = require("./calculator/osuCalculator");
let TaikoCalculator = require("./calculator/taikoCalculator");
let CtbCalculator = require("./calculator/ctbCalculator");
let ManiaCalculator = require("./calculator/maniaCalculator");
let API = require("./api/API");
let { modsEmitter, Mods } = require("./mods");
const Inputs = require('./inputs');

let popupTitle = document.getElementById('title');
let	popupArtist = document.getElementById('artist');
let	popupHeader = document.getElementById('header');
let	popupOuter = document.getElementById('outer');

class Main {
	constructor() {
		this.api = new API();
		new Odometer({
			el: popupOuter,
			duration: 200
		});

		this.getSiteData().then(async d => {
			this.beatmapId = d.beatmapId;
			this.beatmapsetId = d.beatmapsetId;
			this.mode = this.modeToNumber(d.mode);

			this.mods = new Mods(this.mode);

			this.map = await this.reqBeatmap(this.beatmapId, this.mode);

			new Inputs(this.map, this.mode);
			this.inputsListener(this.mode);
			this.setMapInformation(this.map);
		})

		modsEmitter.on('addMod', async mod => {
			this.mods.addActiveMod(mod);
			this.map = await this.reqBeatmap(this.beatmapId, this.mode);
			this.setMapInformation(this.map);
		});

		modsEmitter.on('removeMod', async mod => {
			this.mods.removeActiveMod(mod);
			this.map = await this.reqBeatmap(this.beatmapId, this.mode);
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
					} else {
						let { message } = res.error;
						reject(message);
					}
				}) 
			})
		}) 
	}

	inputsListener(mode) {
		switch (mode) {
            default:
            case 1:
            case 2:
				return document.querySelectorAll('.default-input')
				.forEach(e => e.addEventListener('input', e => {
					let { value, id } = e.target;

					if (id === 'accuracy') this.accuracy = value;
					if (id === 'combo') this.combo = value;
					if (id === 'miss') this.miss = value;

					return this.setMapInformation(this.map);
				}));
            case 3:
				return document.getElementById('score').addEventListener('input', e => {
					let { value } = e.target;

					this.score = value;

					return this.setMapInformation(this.map);
				})
        }
	}

	async reqBeatmap(beatmapId, mode = 0) {
		if(!beatmapId) return;

		let mods = this.mods.activeModsToNum();
		let map = await this.api.getBeatmap(beatmapId, mode, mods);
		console.log(map, mods);
		return map;
	}

	getPP() {
		switch (this.mode) {
			case 1:
				return new TaikoCalculator(this.map, this.mods, this.combo, this.accuracy, this.miss).pp;
			case 2:
				return new CtbCalculator(this.map, this.mods, this.combo, this.accuracy, this.miss).pp;
			case 3:
				return new ManiaCalculator(this.map, this.mods, this.score).pp;
			default:
				return new OsuCalculator(this.map, this.mods, this.combo, this.accuracy, this.miss).pp;
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
		let pp = this.getPP();

		popupOuter.innerText = parseInt(pp) || '0';
		popupTitle.innerText = `${map.title} (${map.diffName})`;
		popupArtist.innerText = map.artist;
		popupHeader.style.backgroundImage = `url('https://assets.ppy.sh/beatmaps/${this.beatmapsetId}/covers/cover.jpg')`;
	}
}

new Main();