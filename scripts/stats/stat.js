module.exports = class Stat {
    constructor(statName, value) {
        this.statName = statName;
        this.value = value;
    }

    createStat() {
        return `<div class="stats-container__item stats-container__item--${this.statName}">${this.statName}: ${this.value.toFixed(1)}</div>`;
    }
}