module.exports = class TaikoCalculator {
    constructor(
        map, 
        mods, 
        combo,
        acc,
        miss, 
    ) {
        this.map = map;
        this.mods = mods;
        this.combo = combo || this.map.combo;
        this.acc = acc || 1;
        this.miss = miss || 0;

        this.pp = this.calcPP();
    }

    calcStrainValue() {
        let { totalObj } = this.map.objects;
        let strainValue = Math.pow(5 * Math.max(1, this.map.diff.SR / 0.0075) - 4, 2) / 1e5;
        let lengthBonus = 1 + 0.1 * Math.min(1, totalObj / 1500);

        strainValue *= lengthBonus;
        strainValue *= 0.985 ** this.miss;
        strainValue *= Math.min((totalObj - this.miss) ** 0.5 / this.map.combo ** 0.5, 1);

        if(this.mods.has("HD"))
            strainValue *= 1.025;
        if(this.mods.has("FL"))
            strainValue *= 1.05 * lengthBonus;

        strainValue *= this.acc;

        return strainValue;
    }

    calcAccValue() {
        let { totalObj } = this.map.objects;
        let hitWindow = 80 - Math.ceil(6 * this.map.stats.OD);
        let accValue = Math.pow(150 / hitWindow, 1.1) * Math.pow(this.acc, 15) * 22;

        accValue *= Math.min(1.15, Math.pow(totalObj / 1500, 0.3));

        return accValue;
    }

    calcPP() {
        let multiplier = 1.1;

        if(this.mods.has("NF")) multiplier *= 0.9;
        if(this.mods.has("HD")) multiplier *= 1.1;
        
        let str = this.calcStrainValue();
        let acc = this.calcAccValue();

        console.log(str, acc)

        return Math.pow((str ** 1.1 + acc ** 1.1), 1.0 / 1.1) * multiplier;
    }
}