export class OsuCalculator {
    constructor(
        map, 
        mods, 
        combo,
        acc,
        miss, 
    ) {
        this.map = map;
        this.mods = mods;
        this.combo = combo;
        this.acc = acc;
        this.miss = miss;

        this.pp = this.calcPP();
    }

    calcARWithFactor(AR) {
        let ARFactor = 1;

        if(AR > 10.33)
            ARFactor += 0.3 * (AR - 10.33);
        else if(AR < 8)
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
            n300 = Math.max(0, totalObj - hits[100] - hits[50] - hits[miss]);
        
        let hitCount = n300 + hits[100] + hits[50] + hits.miss;

        if(hitCount > totalObj)
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
            -3 * ((this.acc * 0.01 - 1) * totalObj + hits.miss) * 0.5
        );

        if(hits[100] > max300) {
            hits[100] = 0;
            hits[50] = Math.round(-6 * ((this.acc * 0.01 - 1) * totalObj + hits.miss) * 0.5);
            hits[50] = Math.min(max300, hits[50]);
        }

        hits[300] = totalObj - hits[100] - hits[50] - hits.miss;

        return hits;
    }

    calcAimValue() {
        let aimValue = this.map.diff.aim;
        let { AR } = this.map.stats;
        let { totalObj } = this.map.objects;

        if(this.mods.has("TouchDevice"))
            aimValue = aimValue ** 0.8;

        aimValue = ((5 * Math.max(1, aimValue / 0.0675) - 4) ** 3) / 1e5;
        aimValue *= 0.95 + 0.4 * Math.min(1, totalObj / 2e3) + (totalObj > 2e3 ? Math.log10(totalObj / 2e3) * 0.5 : 0);
        aimValue *= Math.pow(0.97, this.miss);
        aimValue *= Math.min(Math.pow(this.combo, 0.8) / Math.pow(this.map.combo, 0.8), 1);

        let ARFactor = this.calcARWithFactor(AR);

        aimValue *= ARFactor;

        if(this.mods.has("Hidden"))
            aimValue *= 1.0 + 0.04 * (12 - AR);
        if(this.mods.has("Flashlight"))
            aimValue *= 1.0 + 0.35 * Math.min(1, totalObj / 200) + 
            (hits > 200
                ? 0.3 * Math.min(1, (totalObj - 200) / 300) + (totalObj > 500 ? (totalObj - 500) / 1200 : 0)
                : 0
            );
        
        aimValue *= 0.5 + acc / 2;

        aimValue *= 0.98 + Math.pow(this.map.stats.OD, 2) / 2500;

        return aimValue;
    }

    calcSpeedValue() {
        let { totalObj } = this.map.objects;

        let speedValue = Math.pow(5 * Math.max(1, this.map.diff.speed / 0.0675) - 4, 3) / 1e5;
        
        let ARFactor = this.calcARWithFactor(this.map.stats.AR);

        if(this.map.stats.AR > 10.33)
            speedValue *= ARFactor;

        speedValue *= 0.95 + 0.4 * Math.min(1, totalObj / 2e3) + (totalObj > 2e3 ? Math.log10(totalObj / 2e3) * 0.5 : 0);
        speedValue *= Math.pow(0.97, this.miss);
        speedValue *= Math.min(Math.pow(this.combo, 0.8) / Math.pow(this.map.combo, 0.8), 1);

        if(this.mods.has("Hidden"))
            speedValue *= 1 + 0.04 * (12 - this.map.stats.AR);

        speedValue *= 0.02 + acc;
        speedValue *= 0.96 + (Math.pow(this.map.stats.OD, 2) / 1600);

        return speedValue;
    }

    calcAccValue() {
        let { circles } = this.map.objects;
        let hits = this.getHitsFromAcc();
        let totalHits = hits[300] + hits[100] + hits[50] + hits.miss;

        if(this.map.objects.circles > 0)
            betterAccPerc = Math.min(((hits[300] - (totalHits - circles)) * 6 + hits[100] * 2 + hits[50]) / (circles * 6), 1);
        
        let accValue = Math.pow(1.52163, this.map.stats.OD) * Math.pow(betterAccPerc, 24) * 2.83;

        accValue *= Math.min(1.15, Math.pow(circles / 1e3, 0.3));

        if(this.mods.has("Hidden"))
            accValue *= 1.08;
        if(this.mods.has("Flashlight"))
            accValue *= 1.02;
        
        return accValue;
    }

    calcPP() {
        let multiplier = 1.12;

        if(this.mods.has("NoFail"))
            multiplier *= 0.9;
        if(this.mods.has("SpunOut"))
            multiplier *= 0.95;
        
        let aim = this.calcAimValue();
        let speed = this.calcSpeedValue();
        let acc = this.calcAccValue();

        return Math.pow((aim ** 1.1 + speed ** 1.1 + acc ** 1.1), 1 / 1.1) * multiplier;
    }
}