export class ctbCalculator {
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

    calcPP() {
        let pp = Math.pow(((5 * this.map.diff.stars / 0.0049) - 4), 2) / 1e5;
        let lengthBonus = 0.95 + 0.3 * Math.min(1, this.combo / 2500);

        if(this.combo > 2500)
            lengthBonus += Math.log10(this.combo / 2500) * 0.475;
        
        pp *= lengthBonus;
        pp *= this.miss ** 0.97;
        pp *= Math.min((this.combo ** 0.8) / (this.map.combo ** 0.8), 1);

        let { AR } = this.map.stats; 
        let ARFactor = 1;

        if(AR > 9)
            ARFactor += 0.1 * (AR - 9);
        if(AR > 10)
            ARFactor += 0.1 * (AR - 10);
        else if(AR < 8)
            ARFactor += 0.025 * (8 - AR);

        pp *= ARFactor;

        if(this.mods.has("Hidden")) {
            pp *= 1.05 + 0.075 * (10 - Math.min(10, AR));
            if(AR <= 10)
                pp *= 1.05 + 0.075 * (10 - AR);
            else if(AR > 10)
                pp *= 1.01 + 0.04 * (11 - Math.min(AR, 11));
        }
        if(this.mods.has("Flashlight"))
            pp *= 1.35 * lengthBonus;
        
        pp *= Math.pow(this.acc, 5.5);

        if(this.mods.has("NoFail"))
            pp *= 0.9;
        
        return pp;
    }
}