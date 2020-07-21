let { EventEmitter } = require('events');
let Mod = require('./mod.js') 
let modsEmitter = new EventEmitter();

module.exports.modsEmitter = modsEmitter;

module.exports.Mods = class Mods {
	constructor(mode) {
		this.mods = this.addMods(mode);
		this.activeMods = [];
	}

	addMods(mode) {
		if (this.mods) this.clearMods();
		switch (mode) {
			case 1:
				return new TaikoMods();
			case 2:
				return new CtbMods();
			case 3:
				return new ManiaMods();
			default:
				return new OsuMods();
		}
	}

	clearMods() {
		for (let mod in this.mods) {
			console.log(this.mods[mod])
			this.mods[mod].delete();
			delete this.mods[mod];
		}
	}

	addActiveMod(mod) {
		if(this.has(mod)) return;
		console.log(mod)
		if (mod == 'ht' && this.has('DT')) {
			this.mods.DT.disactivate();
			this.removeActiveMod("DT");
		}
		if (mod == 'dt' && this.has('HT')) {
			this.mods.HT.disactivate();
			this.removeActiveMod("HT");
		}
		if (mod == 'ez' && this.has('HR')) {
			this.mods.HR.disactivate();
			this.removeActiveMod("HR");
		}
		if (mod == 'hr' && this.has('EZ')) {
			this.mods.EZ.disactivate();
			this.removeActiveMod("EZ");
		}

		this.activeMods.push(mod);
	}

	removeActiveMod(mod) {
		this.activeMods = this.activeMods.filter(m => m != mod);
	}

	activeModsToNum() {
		let num = 0;

		this.activeMods.forEach(m => {
			switch (m) {
				case "ez":
					return num += 2;
				case "hr":
					return num += 16;
				case "dt":
					return num += 64;
				case "ht":
					return num += 256;
				default:
					return;
			}
		})

		return num;
	}

	has(mod) {
		return this.activeMods.find(m => m == mod.toLowerCase());
	}
}

class OsuMods {
	constructor() {
		['EZ', 'NF', 'HT', 'HR', 'DT', 'HD', 'FL']
		.forEach(m => {
			this[m] = new Mod(m.toLowerCase());
		})
	}
}

class TaikoMods {
	constructor() {
		['EZ', 'NF', 'HT', 'HR', 'DT', 'HD', 'FL']
		.forEach(m => {
			this[m] = new Mod(m.toLowerCase());
		})
	}
}

class CtbMods {
	constructor() {
		['EZ', 'NF', 'HT', 'HR', 'DT', 'HD', 'FL']
		.forEach(m => {
			this[m] = new Mod(m.toLowerCase());
		})
	}
}

class ManiaMods {
	constructor() {
		['EZ', 'NF', 'HT', 'DT'].forEach(m => {
			this[m] = new Mod(m.toLowerCase());
		})
	}
}