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
        this.combo = +combo || this.map.objects.totalObj;
        this.acc = +acc * 0.01 || 1;
        this.miss = +miss || 0;

        this.pp = this.calcPP();
    }

    calcStrainValue() {
        let { totalObj } = this.map.objects;
        let strainValue = Math.pow(5 * Math.max(1, this.map.diff.SR / 0.0075) - 4, 2) / 1e5;
        let lengthBonus = 1 + 0.1 * Math.min(1, totalObj / 1500);

        strainValue *= lengthBonus;
        strainValue *= 0.985 ** this.miss;
        strainValue *= Math.min((this.combo - this.miss) ** 0.5 / this.map.combo ** 0.5, 1);

        if(this.mods.has("HD")) strainValue *= 1.025;
        if(this.mods.has("FL")) strainValue *= 1.05 * lengthBonus;

        strainValue *= this.acc;

        return strainValue;
    }

    calcAccValue() {
        let { totalObj } = this.map.objects;
        let { OD } = this.map.stats;
        
        if (this.mods.has('HR')) OD *= 1.4;
        if (this.mods.has('EZ')) OD *= 0.5;

        let hitWindow = Math.floor(50 + (20 - 50) * OD / 10) - 0.5;
        console.log(hitWindow)
        let accValue = ((150 / hitWindow) ** 1.1) * (this.acc ** 15) * 22;
        console.log(accValue)

        accValue *= Math.min(1.15, (totalObj / 1500) ** 0.3);
        console.log(accValue)
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