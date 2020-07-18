export class ManiaCalculator {
    constructor(map) {
        this.map = map;

        this.pp = this.calcPP();
    }

    calcStrainValue() {
        let strainValue;
    
        if (scoreMultiplayer <= 0) 
            strainValue = 0;
    
        if (realScore < 5e5) 
            realScore = 5e5;
    
        let score = realScore;
    
        let SR = +this.map.diff.SR.toFixed(2);
    
        strainValue = Math.pow(5 * Math.max(1, SR / 0.2) - 4, 2.2) / 135;
        strainValue *= 1 + 0.1 * Math.min(1, objectsCount / 1500);
    
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
    
        return +strainValue.toFixed(2);
    }

    calcAccValue () {
        let OD = parseInt(this.map.stats.OD);
    
        let hitWindow300 = 34 + 3 * (Math.min(10, Math.max(0, 10 - OD)));
    
        if (hitWindow300 <= 0)
            hitWindow300 = 0;
    
        return Math.max(0, 0.2 - ((hitWindow300 - 34) * 0.006667)) * this.calсStrainValue() * Math.pow((Math.max(0, realScore - 96e4) / 4e4), 1.1);
    }
    
    calcPP() {
        let multiplier  = 0.8;
        let str = this.calcStrainValue();
        let acc = this.calcAccValue();
    
        if (nfMod) multiplier *= 0.9;
        if (ezMod) multiplier *= 0.5;
        if (dtMod) multiplier *= 0.9;
        if (htMod) multiplier *= 0.6;
    
        return Math.pow((str ** 1.1 + acc ** 1.1), 1 / 1.1) * multiplier;
    }
}