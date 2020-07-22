module.exports = class ManiaCalculator {
    constructor(map, mods, score = 1e6, ) {
        this.map = map;
        this.mods = mods;
        this.score = score;

        this.pp = this.calcPP();
    }

    calcStrainValue() {
        let { totalObj } = this.map.objects;
        let { SR } = this.map.diff;
        let strainValue = 0;
    
        let score = this.score;
    
        strainValue = Math.pow(5 * Math.max(1, SR / 0.2) - 4, 2.2) / 135;
        strainValue *= 1 + 0.1 * Math.min(1, totalObj / 1500);
    
        if (score <= 5e5)
            strainValue = 0;
        else if (score <= 6e5)
            strainValue = strainValue * ((score - 5e5) / 1e5 * 0.3);
        else if (score <= 7e5)
            strainValue = strainValue * (0.3 + (score - 6e5) / 1e5 * 0.25);
        else if (score <= 8e5)
            strainValue = strainValue * (0.55 + (score - 7e5) / 1e5 * 0.2);
        else if (score <= 9e5)
            strainValue = strainValue * (0.75 + (score - 8e5) / 1e5 * 0.15);
        else
            strainValue = strainValue * (0.9 + (score - 9e5) / 1e5 * 0.1);
    
        return strainValue;
    }

    calcAccValue () {
        let { OD } = this.map.stats;
    
        let hitWindow = 34 + 3 * (Math.min(10, Math.max(0, 10 - OD)));
    
        if (hitWindow <= 0)
            hitWindow = 0;
    
        if (this.score >= 5e5 && (this.mods.has("NF") || this.mods.has("EZ") || this.mods.has("HT"))) this.score *= 0.5;

        return Math.max(0, 0.2 - ((hitWindow - 34) * 0.006667)) * this.calcStrainValue() * Math.pow((Math.max(0, this.score - 96e4) / 4e4), 1.1);
    }
    
    calcPP() {
        let multiplier  = 0.8;
        let str = this.calcStrainValue();
        let acc = this.calcAccValue();
    
        if (this.mods.has("NF")) multiplier *= 0.9;
        if (this.mods.has("EZ")) multiplier *= 0.5;

        //80 - Math.ceil(6 * OD);
    
        return Math.pow((str ** 1.1 + acc ** 1.1), 1 / 1.1) * multiplier;
    }
}