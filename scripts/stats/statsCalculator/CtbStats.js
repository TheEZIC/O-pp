let Stat = require("../stat");

module.exports = class CtbStats {
    constructor(stats, mods) {
        this.stats = stats;
        this.mods = mods;
    
        this.modify();
    }

    modify() {
        let { OD, AR, CS, HP } = this.stats;

        let multiplier = 1;
        if (this.mods.has("EZ")) multiplier *= 0.75;
        if (this.mods.has("HR")) multiplier *= 1.4;

        this.AR = this.modifyAR(AR);
        this.OD = this.modifyOD(OD, multiplier);
        this.CS = this.modifyCS(CS, multiplier);
        this.HP = this.modifyHP(HP, multiplier);
    }

    modifyAR(AR) {
        if (!this.mods.has("DT")) return AR;

        let ms = 0;

        if (AR > 5) 
            ms = 200 + (11 - AR) * 100;
        else 
            ms = 800 + (5 - this.ar) * 80;
        
        if (ms < 300)
            AR = 11;
        else if(ms < 1200)
            AR = Math.round((11 - (ms - 300) / 150) * 100) / 100;
        else
            AR = Math.round((5 - (ms - 1200) / 120) * 100) / 100;

        return AR
    }

    modifyOD(OD, multiplier) {
        OD *= multiplier;
        OD = Math.min(10, OD);

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