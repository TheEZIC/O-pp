let OsuStats = require('./statsCalculator/OsuStats');
let TaikoStats = require('./statsCalculator/TaikoStats');
let CtbStats = require('./statsCalculator/CtbStats');
let ManiaStats = require('./statsCalculator/ManiaStats');

module.exports = class Stats {
    constructor(mode) {
        this.mode = mode;
    }

    update(map, mods) {
        let { stats } = map;

        switch (this.mode) {
            case 1:
                return new TaikoStats(stats, mods).setStats();
            case 2:
                return new CtbStats(stats, mods).setStats();
            case 3:
                return new ManiaStats(stats, mods).setStats();
            default:
                return new OsuStats(stats, mods).setStats();
        }
    }
}