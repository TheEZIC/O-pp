let OsuCalculator = require("./calculator/osuCalculator");
let TaikoCalculator = require("./calculator/taikoCalculator");
let CtbCalculator = require("./calculator/ctbCalculator");
let ManiaCalculator = require("./calculator/maniaCalculator");

let API = require("./api/API");
let APIKey = require("./APIKey");
let { modsEmitter, Mods } = require("./mods");
let Inputs = require('./inputs');
let InputsListener = require('./inputs/inputsListener');
let Stats = require('./stats');
let Setting = require('./settings');
let { modeToNumber, setMapInformation } = require("./utils");

let preload = document.getElementById('preload');

class Main {
	constructor() {
		this.settings = new Setting();
		this.api = new API();

		APIKey.tryToGet().then(key => {
			if (key)
				this.init();
			else
				APIKey.showScreen();
		});

		APIKey.confirmElement.addEventListener('click', () => {
			APIKey.save();
			this.init();
		});
	}

	async init() {
		const siteData = await this.getSiteData()
		this.beatmapId = siteData.beatmapId;
		this.beatmapsetId = siteData.beatmapsetId;
		this.mode = modeToNumber(siteData.mode);

		this.mods = new Mods(this.mode);

		this.map = await this.reqBeatmap(this.beatmapId, this.mode, this.mods);
		this.inputs = new Inputs(this.map, this.mode);
		this.stats = new Stats(this.mode);
		this.stats.update(this.map, this.mods);
		this.inputsListener = new InputsListener(this);
		const { pp } = this.getPP();
		setMapInformation(this.map, this.mods, pp);

		this.listenMods();
	}

	listenMods() {
		modsEmitter.on('addMod', async mod => {
			this.mods.addActiveMod(mod);
			await this.updateMods();
		});

		modsEmitter.on('removeMod', async mod => {
			this.mods.removeActiveMod(mod);
			await this.updateMods();
		});
	}

	async updateMods() {
		this.map = await this.reqBeatmap();
		this.stats.update(this.map, this.mods);
		const { pp } = this.getPP();
		setMapInformation(this.map, this.mods, pp);
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

	async reqBeatmap() {
		let modsNum = this.mods ? this.mods.activeModsToNum() : 0;
		let map = await this.api.getBeatmap(this.beatmapId, this.mode, modsNum);

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
}

module.export = Main;

new Main();