let Stat = require("../stat");

module.exports = class OsuStats {
    constructor(stats, mods) {
        this.stats = stats;
        this.mods = mods;

        this.modify();
    }

    modify() {
        let { OD, AR, CS, HP } = this.stats;
        
        let speedMul = 1;
        if (this.mods.has("DT")) speedMul *= 1.5;
        if (this.mods.has("HT")) speedMul *= 0.75;

        let multiplier = 1;
        if (this.mods.has("EZ")) multiplier *= 0.5;
        if (this.mods.has("HR")) multiplier *= 1.4;

        this.AR = this.modifyAR(AR, speedMul, multiplier);
        this.OD = this.modifyOD(OD, speedMul, multiplier);
        this.CS = this.modifyCS(CS);
        this.HP = this.modifyHP(HP, multiplier);
    }

    modifyAR(AR, speedMul, multiplier) {
        AR *= multiplier;

        let arms = (
            AR < 5 ?
            1800 - 120 * AR
            : 1200 - 150 * (AR - 5)
        );
        arms = Math.min(1800, Math.max(450, arms));
        arms /= speedMul;
        AR = (
            arms > 1200 ?
            (1800 - arms) / 120
            : 5 + (1200 - arms) / 150
        );

        return AR;
    }

    modifyOD(OD, speedMul, multiplier) {
        OD *= multiplier;

        let odms = 80 - Math.ceil(6 * OD);
        odms = Math.min(80, Math.max(20, odms));
        odms /= speedMul;

        OD = (80 - odms ) / 6;

        return OD;
    }

    modifyCS(CS) {
        if (this.mods.has("HR")) CS *= 1.3;
        if (this.mods.has("EZ")) CS *= 0.75;

        CS = Math.min(10, CS);

        return CS;
    }

    modifyHP(HP, multiplier) {
        HP *= multiplier;
        HP = Math.min(10, HP);

        return HP;
    }

    setStats() {
        let stats = ['OD', 'AR', 'CS', 'HP'].map(m => new Stat(m, this[m]).createStat());

        document.getElementById('statsContainer').innerHTML = stats.join('');
    }
}