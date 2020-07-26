let Stat = require("../stat");

module.exports = class ManiaStats {
    constructor(stats, mods) {
        this.stats = stats;
        this.mods = mods;

        this.modify();
    }

    modify() {
        let { OD, HP } = this.stats;

        let multiplier = 1;
        if (this.mods.has("EZ")) multiplier *= 0.5;

        this.OD = this.modifyOD(OD, multiplier);
        this.HP = this.modifyHP(HP, multiplier);
    }

    modifyOD(OD, multiplier) {
        OD *= multiplier;
        OD = Math.min(10, OD);

        return OD;
    }

    modifyHP(HP, multiplier) {
        HP *= multiplier;
        HP = Math.min(10, HP);

        return HP;
    }

    setStats() {
        let stats = ['OD', 'HP'].map(m => new Stat(m, this[m]).createStat());

        document.getElementById('statsContainer').innerHTML = stats.join('');
    }
}