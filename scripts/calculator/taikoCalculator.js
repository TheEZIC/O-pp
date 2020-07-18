export class TaikoCalculator {
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

    calcStrainValue() {
        let { totalObj } = this.map.objects;
        let strainValue = Math.pow(5 * Math.max(1, this.map.diff.stars / 0.0075) - 4, 2) / 1e5;
        let lengthBonus = 1 + 0.1 * Math.min(1, totalObj / 1500);

        strainValue *= lengthBonus;
        strainValue *= Math.pow(0.985, this.miss);
        strainValue *= Math.min(Math.pow((objCount - this.miss), 0.5) / Math.pow(this.map.combo, 0.5), 1);

        if(this.mods.has("Hidden"))
            strainValue *= 1.025;
        if(this.mods.has("Flashlight"))
            strainValue *= 1.05 * lengthBonus;

        strainValue *= this.acc;

        return strainValue;
    }

    calcAccValue() {
        let { totalObj } = this.map.objects;
        let hitWindow = 80 - Math.ceil(6 * this.map.stats.od);
        let accValue = Math.pow(150 / hitWindow, 1.1) * Math.pow(acc, 15) * 22;

        accValue *= Math.min(1.15, Math.pow(totalObj / 1500, 0.3));

        return accValue;
    }

    calcPP() {
        let multiplier = 1.1;

        if(this.mods.has("NoFail"))
            multiplier *= 0.9;
        if(this.mods.has("Hidden"))
            multiplier *= 1.1;
        
        let str = this.calcStrainValue();
        let acc = this.calcAccValue();

        return Math.pow((str ** 1.1 + acc ** 1.1), 1.0 / 1.1) * multiplier;
    }
}