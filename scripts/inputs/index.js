let Input = require("./input");

module.exports = class Inputs {
    constructor(map, mode) {
        this.name = name;
        this.map = map;
        this.mode = mode;
        this.container = document.getElementById('inputsContainer');

        this.createInputs(this.mode)
    }

    createInputs(mode) {
        switch (mode) {
            default:
            case 1:
            case 2:
                return new DefaultInputs(this.container, this.map);
            case 3:
                return new ManiaInputs(this.container);
        }
    }
}

class DefaultInputs {
    constructor(container, map) {
        let inputs = ['accuracy', 'combo', 'miss'].map(i => new Input(i, map).createInput());

        container.innerHTML = inputs.join('');
    }
}

class ManiaInputs {
    constructor(container) {
        container.innerHTML = new Input('score', this.map).createInput();
    }
}