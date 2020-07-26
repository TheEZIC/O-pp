let OsuStats = require("../stats/statsCalculator/OsuStats");

module.exports = class OsuCalculator {
    constructor(
        map, 
        mods, 
        combo,
        acc,
        miss, 
    ) {
        this.map = map;
        this.mods = mods;
        this.combo = +combo || +this.map.combo;
        this.acc = +acc * 0.01 || 1;
        this.miss = +miss || 0;

        this.stats = new OsuStats(this.map.stats, this.mods);

        console.log(this.stats)

        this.pp = this.calcPP();
    }

    calcARWithFactor(AR) {
        let ARFactor = 1;

        if (AR > 10.33)
            ARFactor += 0.3 * (AR - 10.33);
        else if (AR < 8)
            ARFactor += 0.01 * (8 - AR);

        return ARFactor;
    }

    getHitsFromAcc() {
        let { totalObj } = this.map.objects;
        let hits = {
            300: -1,
            100: 0,
            50: 0,
            miss: this.miss
        }
        let n300 = hits[300];

        if (n300 < 0)
            n300 = Math.max(0, totalObj - hits[100] - hits[50] - hits.miss);
        
        let hitCount = n300 + hits[100] + hits[50] + hits.miss;

        if (hitCount > totalObj)
            n300 -= Math.min(n300, hitCount - totalObj);

        hitCount = n300 + hits[100] + hits[50] + hits.miss;

        if (hitCount > totalObj)
            hits[100] -= Math.min(hits[100], hitCount - totalObj);

        hitCount = n300 + hits[100] + hits[50] + hits.miss;

        if (hitCount > totalObj)
            hits[50] -= Math.min(hits[50], hitCount - totalObj);

        hitCount = n300 + hits[100] + hits[50] + hits.miss;

        hits[300] = totalObj - hits[100] - hits[50] - hits.miss;

        let max300 = totalObj - hits.miss;

        hits[100] = Math.round(
            -3 * ((this.acc - 1) * totalObj + hits.miss) * 0.5
        );

        if (hits[100] > max300) {
            hits[100] = 0;
            hits[50] = Math.round(-6 * ((this.acc * 0.01 - 1) * totalObj + hits.miss) * 0.5);
            hits[50] = Math.min(max300, hits[50]);
        }

        hits[300] = totalObj - hits[100] - hits[50] - hits.miss;
        console.log(hits)
        return hits;
    }

    calcAimValue() {
        let aimValue = this.map.diff.aim;
        let { AR, OD } = this.stats;
        let { totalObj } = this.map.objects;

        //TouchDevice
        if(this.mods.has("TD")) aimValue = aimValue ** 0.8;

        aimValue = Math.pow(5 * Math.max(1, aimValue / 0.0675) - 4, 3) / 1e5;
        aimValue *= 0.95 + 0.4 * Math.min(1, totalObj / 2e3) + (totalObj > 2e3 ? Math.log10(totalObj / 2e3) * 0.5 : 0);
        aimValue *= 0.97 ** this.miss;
        aimValue *= Math.min((this.combo ** 0.8) / (this.map.combo ** 0.8), 1);

        let ARFactor = this.calcARWithFactor(AR);

        aimValue *= ARFactor;

        if(this.mods.has("HD")) aimValue *= 1.0 + 0.04 * (12 - AR);
        if(this.mods.has("FL")) {
            aimValue *= 1.0 + 0.35 * Math.min(1, totalObj / 200) + 
            (totalObj > 200
                ? 0.3 * Math.min(1, (totalObj - 200) / 300) + (totalObj > 500 ? (totalObj - 500) / 1200 : 0)
                : 0
            );
        }

        aimValue *= 0.5 + this.acc / 2;
        aimValue *= 0.98 + (OD ** 2) / 2500;

        return aimValue;
    }

    calcSpeedValue() {
        let { AR, OD } = this.stats;
        let { totalObj } = this.map.objects;
        let speedValue = Math.pow(5 * Math.max(1, this.map.diff.speed / 0.0675) - 4, 3) / 1e5;
        let ARFactor = this.calcARWithFactor(AR);

        if(AR > 10.33)
            speedValue *= ARFactor;

        speedValue *= 0.95 + 0.4 * Math.min(1, totalObj / 2e3) + (totalObj > 2e3 ? Math.log10(totalObj / 2e3) * 0.5 : 0);
        speedValue *= 0.97 ** this.miss;
        speedValue *= Math.min((this.combo ** 0.8) / (this.map.combo ** 0.8), 1);

        if(this.mods.has("HD"))
            speedValue *= 1 + 0.04 * (12 - AR);

        speedValue *= 0.02 + this.acc;
        speedValue *= 0.96 + (Math.pow(OD, 2) / 1600);

        return speedValue;
    }

    calcAccValue() {
        let { circles } = this.map.objects;
        let { OD } = this.stats;
        let hits = this.getHitsFromAcc();
        let totalHits = hits[300] + hits[100] + hits[50] + hits.miss;
        let betterAccPerc = 0;

        if(circles > 0)
            betterAccPerc = Math.min(((hits[300] - (totalHits - circles)) * 6 + hits[100] * 2 + hits[50]) / (circles * 6), 1);
        
        let accValue = (1.52163 ** OD) * (betterAccPerc ** 24) * 2.83;

        accValue *= Math.min(1.15, (circles / 1e3) ** 0.3);

        if(this.mods.has("HD")) accValue *= 1.08;
        if(this.mods.has("FL")) accValue *= 1.02;
        
        return accValue;
    }

    calcPP() {
        let multiplier = 1.12;

        if(this.mods.has("NF")) multiplier *= 0.9;
        if(this.mods.has("SO")) multiplier *= 0.95;
        
        let aim = this.calcAimValue();
        let speed = this.calcSpeedValue();
        let acc = this.calcAccValue();

        console.log(aim, speed, acc)

        return Math.pow((aim ** 1.1 + speed ** 1.1 + acc ** 1.1), 1 / 1.1) * multiplier;
    }
}