module.exports = class Stat {
    constructor(statName, map, mods) {
        this.statName = statName;
        this.map = map;
        this.mods = mods;
    }

    createStat() {
        let stats = this.map.stats;

        return `<div class="stats-container__item stats-container__item--${this.statName}">${this.statName}: ${this.calcValue(stats[this.statName]).toFixed(1)}</div>`;
    }

    calcValue(value) {
        switch (this.statName) {
            case 'OD':
                return this.calcOD(value);
            case 'AR':
                return this.calcAR(value);
            case 'CS':
                return this.calcCS(value);
            case 'HP':
                return this.calcHP(value);
            default:
                break;
        }
    }

    calcOD(value) {
        if (this.mods.has('EZ')) value *= 0.5;
        if (this.mods.has('HR')) value *= 1.4;
        return Math.min(10, value);
    }

    calcAR(value) {
        if (this.mods.has('EZ')) value *= 0.5;
        if (this.mods.has('HR')) value *= 1.4;
        return Math.min(10, value);
    }

    calcCS(value) {
        if (this.mods.has('EZ')) value *= 0.5;
        if (this.mods.has('HR')) value *= 1.3;
        return Math.min(10, value);
    }

    calcHP(value) {
        if (this.mods.has('EZ')) value *= 0.5;
        if (this.mods.has('HR')) value *= 1.4;
        return Math.min(10, value);
    }
}