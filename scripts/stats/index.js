let Stat = require("./stat");

module.exports = class Stats {
    constructor(mode) {
        this.mode = mode;
    }

    update(map, mods) {
        switch (this.mode) {
            case 1:
                return new TaikoStats(map, mods);
            case 2:
                return new CtbStats(map, mods);
            case 3:
                return new ManiaStats(map, mods);
            default:
                return new OsuStats(map, mods);
        }
    }
}

class OsuStats {
    constructor(map, mods) {
        let stats = ['OD', 'AR', 'CS', 'HP'].map(m => new Stat(m, map, mods).createStat());
        console.log(map.stats)
        document.getElementById('statsContainer').innerHTML = stats.join('');
    }
}

class TaikoStats {
    constructor(map, mods) {
        let stats = ['OD', 'HP'].map(m => new Stat(m, map, mods).createStat());

        document.getElementById('statsContainer').innerHTML = stats.join('');
    }
}

class CtbStats {
    constructor(map, mods) {
        let stats = ['OD', 'AR', 'CS', 'HP'].map(m => new Stat(m, map, mods).createStat());

        document.getElementById('statsContainer').innerHTML = stats.join('');
    }
}

class ManiaStats {
    constructor(map, mods) {
        let stats = ['OD', 'HP'].map(m => new Stat(m, map, mods).createStat());

        document.getElementById('statsContainer').innerHTML = stats.join('');
    }
}