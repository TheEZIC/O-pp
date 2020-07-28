let Odometer = require('odometer');
let axios = require('axios');
let semver = require('semver');

let { version: currentVersion } = require('../manifest.json')

let OsuCalculator = require("./calculator/osuCalculator");
let TaikoCalculator = require("./calculator/taikoCalculator");
let CtbCalculator = require("./calculator/ctbCalculator");
let ManiaCalculator = require("./calculator/maniaCalculator");

let API = require("./api/API");
let { modsEmitter, Mods } = require("./mods");
let Inputs = require('./inputs');
let InputsListener = require('./inputs/inputsListener');
let Stats = require('./stats');
let Setting = require('./settings');
let Notification = require('./notification');

let preload = document.getElementById('preload');

let popupTitle = document.getElementById('title');
let	popupArtist = document.getElementById('artist');
let	popupHeader = document.getElementById('header');
let	popupOuter = document.getElementById('outer');
let popupBPM = document.getElementById('BPM');
let popupSR = document.getElementById('SR');

class Main {
	constructor() {
		this.settings = new Setting();
		this.api = new API();
		new Odometer({ el: popupOuter, duration: 1e3, format: '' });
		this.tryToGetAPIKey().then(a => {
			if (a)
				this.init();
			else
				this.showStartScreen();
		});
	}

	async checkUpdate() {
		try {
			let { data } = await axios.get(`https://api.github.com/repos/TheEZIC/O-pp/tags`);
			if(data.message) return null;
			let lastVersion = semver.valid(semver.coerce(data[0].name));
			let nowVersion = semver.valid(semver.coerce(currentVersion));
			console.log(lastVersion, nowVersion);
			if(semver.lt(nowVersion, lastVersion))
				return new Notification({ type: 'WARNING', text: 'New update released, please update' });;
		} catch (e) {
			return null;
		}
	}

	tryToGetAPIKey() {
		return new Promise(async resolve => {
			await chrome.storage.local.get(['APIKey'], res => resolve(!!res.APIKey));
		})
	}

	init() {
		this.getSiteData().then(async d => {
			this.beatmapId = d.beatmapId;
			this.beatmapsetId = d.beatmapsetId;
			this.mode = this.modeToNumber(d.mode);

			this.checkUpdate();

			this.mods = new Mods(this.mode);

			this.map = await this.reqBeatmap(this.beatmapId, this.mode, this.mods);
			this.inputs = new Inputs(this.map, this.mode);
			this.stats = new Stats(this.mode);
			this.stats.update(this.map, this.mods);
			this.inputsListener = new InputsListener(this.map, this.mode, this.setMapInformation.bind(this));
			this.setMapInformation(this.map);
		});

		this.listenMods();
	}

	listenMods() {
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
		let modsNum = mods ? mods.activeModsToNum() : 0;
		let map = await this.api.getBeatmap(beatmapId, mode, modsNum);

		return map;
	}

	getPP() {
		let { combo, accuracy, miss, score } = this.inputsListener;

		switch (this.mode) {
			case 1: return new TaikoCalculator(this.map, this.mods, combo, accuracy, miss);
			case 2: return new CtbCalculator(this.map, this.mods, combo, accuracy, miss);
			case 3: return new ManiaCalculator(this.map, this.mods, score);
			default: return new OsuCalculator(this.map, this.mods, combo, accuracy, miss);
		}
	}

	modeToNumber(mode) {
		switch (mode) {
			case 'taiko': return 1;
			case 'fruits': return 2;
			case 'mania': return 3;
			default: return 0;
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

	showStartScreen() {
		document.getElementById('startScreen').style.display = 'flex';
		document.getElementById('startScreenAPIConfirm').addEventListener('click', () => this.saveAPIKey());
	}

	saveAPIKey() {
		let { value: APIKey } = document.getElementById('startScreenAPIInput');

		chrome.storage.local.set({ APIKey });
		document.getElementById('startScreen').style.display = 'none';
		this.init();
    }
}

new Main();