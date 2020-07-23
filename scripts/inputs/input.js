module.exports = class Input {
    constructor(name, map) {
        this.name = name;
        this.map = map;
    }

    createInput() {
        switch (this.name) {
            case 'accuracy': 
                return `
                    <input 
                        class="input default-input"
                        id="accuracy"
                        type="number"
                        placeholder="Accuracy"
                        value=100.0
                        step=0.10
                        min=0
                        max=100
                    >
                `
            case 'combo':
                return `
                    <input 
                        class="input default-input"
                        id="combo"
                        type="number"
                        placeholder="Combo"
                        value=${this.map.combo || this.map.objects.totalObj}
                        step=1
                        min=0
                        max=${this.map.combo || this.map.objects.totalObj}
                    >
                `
            case 'miss':
                return `
                    <input
                        class="input default-input"
                        id="miss"
                        type="number"
                        placeholder="Miss"
                        step=1
                        min=0
                        max=${this.map.combo || this.map.objects.totalObj}
                    >
                `
            case 'score': 
                return `
                    <input 
                        class="input mania-input"
                        id="score"
                        type="number"
                        placeholder="Score"
                        value="1000000"
                        step=100
                        min=0
                        max=1000000
                    >
                `
            default:
                break;
        }
    }
}